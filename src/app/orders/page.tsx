"use client";

import React, { useState, useEffect } from "react";
import { useOrderStore } from "@/store/order-store";
import { useDebounce } from "use-debounce";
import { postClient, postClientForFile } from "@/lib/api-client";
import { Mail, MailWarning, Clock, Send, CheckCircle2, MessageSquareWarning, MessageSquare, MessageSquareText, MessageSquareCode } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type Order = ReturnType<typeof useOrderStore.getState>['orders'][0];
type NotificationChannel = NonNullable<Order['notifications']>[keyof NonNullable<Order['notifications']>];
type NotificationStatus = NotificationChannel['status'];

// --- Helper Components (Unchanged) ---
const PaymentStatusBadge = ({ status }: { status: Order['paymentStatus'] }) => {
    const styles = { paid: 'bg-green-100 text-green-800 border-green-300', partially_paid: 'bg-yellow-100 text-yellow-800 border-yellow-300', pending: 'bg-gray-100 text-gray-800 border-gray-300', failed: 'bg-red-100 text-red-800 border-red-300', refunded: 'bg-blue-100 text-blue-800 border-blue-300', partially_refunded: 'bg-indigo-100 text-indigo-800 border-indigo-300' };
    return <Badge variant="outline" className={`capitalize ${styles[status] || styles.pending}`}>{status.replace('_', ' ')}</Badge>;
};
const FulfillmentStatusBadge = ({ status }: { status: Order['fulfillmentStatus'] }) => {
    const styles = { completed: 'bg-green-100 text-green-800 border-green-300', ticket_sent: 'bg-teal-100 text-teal-800 border-teal-300', receipt_sent: 'bg-sky-100 text-sky-800 border-sky-300', unfulfilled: 'bg-yellow-100 text-yellow-800 border-yellow-300', cancelled: 'bg-red-100 text-red-800 border-red-300' };
    return <Badge variant="outline" className={`capitalize ${styles[status] || styles.unfulfilled}`}>{status.replace('_', ' ')}</Badge>;
};
const CommunicationStatus = ({ channel, type }: { channel?: NotificationChannel, type: 'email' | 'whatsapp' }) => {
    if (!channel) { return <div className="flex items-center gap-2 text-xs text-muted-foreground">{type === 'email' ? <Mail size={14} /> : <MessageSquare size={14} />}<span>No Data</span></div>; }
    if (!channel.send) { return <div className="flex items-center gap-2 text-xs text-muted-foreground">{type === 'email' ? <Mail size={14} /> : <MessageSquare size={14} />}<span>Disabled</span></div>; }
    type IconMap = Record<NotificationStatus, React.ReactElement>;
    const icons: Record<'email' | 'whatsapp', IconMap> = { email: { pending: <Clock size={14} />, sent: <Send size={14} />, delivered: <CheckCircle2 size={14} />, failed: <MailWarning size={14} />, bounced: <MailWarning size={14} />, read: <CheckCircle2 size={14}/>, queued: <Clock size={14} /> }, whatsapp: { pending: <Clock size={14} />, queued: <MessageSquare size={14} />, sent: <MessageSquareText size={14} />, delivered: <MessageSquareCode size={14} />, failed: <MessageSquareWarning size={14} />, read: <MessageSquareCode size={14}/>, bounced: <MessageSquareWarning size={14} /> } };
    const colors: Record<NotificationStatus, string> = { pending: 'text-muted-foreground', queued: 'text-muted-foreground', sent: 'text-blue-600', delivered: 'text-green-600', read: 'text-green-600', failed: 'text-destructive', bounced: 'text-destructive' };
    const icon = icons[type][channel.status];
    const color = colors[channel.status];
    return (<Tooltip><TooltipTrigger asChild><div className={`flex items-center gap-2 text-xs font-medium cursor-help ${color}`}>{icon}<span className="capitalize">{channel.status}</span></div></TooltipTrigger><TooltipContent><p className="capitalize"><strong>{type} Status:</strong> {channel.status}</p>{channel.error && <p className="max-w-xs mt-1 text-destructive"><strong>Error:</strong> {channel.error}</p>}</TooltipContent></Tooltip>);
};


export default function OrderManagementPage() {
  const { orders, pagination, isLoading, error, filters, fetchOrders, setFilters, setPage, updateOrderInList } = useOrderStore();
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  useEffect(() => { setFilters({ search: debouncedSearchTerm }); }, [debouncedSearchTerm, setFilters]);
  useEffect(() => { fetchOrders(); }, [fetchOrders, filters.search, pagination.currentPage, filters.status]);

  // --- THIS IS THE FINAL, CORRECTED REAL-TIME LOGIC ---
  useEffect(() => {
    // 1. Connect to our OWN Next.js API route. It's clean, simple, and secure.
    const sseUrl = '/api/sse';
    
    // 2. The EventSource connection no longer needs any special options.
    const eventSource = new EventSource(sseUrl);

    eventSource.onmessage = (event) => {
      try {
        // We add a check for the initial "connected" message from our service
        const parsedData = JSON.parse(event.data);
        if (parsedData.event === 'connected') {
            console.log('SSE connection established successfully.');
            return; // Do nothing, just log the connection
        }
        if (parsedData.event === 'order:updated') {
          const updatedOrder: Order = parsedData.data;
          console.log('Real-time update received:', updatedOrder.confirmationId);
          updateOrderInList(updatedOrder);
        }
      } catch (e) {
        console.error("Failed to parse SSE event data:", event.data, e);
      }
    };

    eventSource.onerror = (err) => {
      console.error('EventSource connection to proxy failed:', err);
      eventSource.close();
    };
    
    return () => {
      eventSource.close();
    };
  }, [updateOrderInList]);

  const handleBulkAction = async (action: "send_receipt" | "send_email_receipt" | "send_whatsapp_receipt", options?: { withGst?: boolean }) => {
    if (selectedOrderIds.length === 0) {
      alert("Please select at least one order.");
      return;
    }
    const actionMap = { send_receipt: { single: true, entity: 'receipt', download: true }, send_email_receipt: { single: false, entity: 'email receipts', download: false }, send_whatsapp_receipt: { single: false, entity: 'WhatsApp receipts', download: false } };
    const currentAction = actionMap[action];
    if (currentAction.single && selectedOrderIds.length !== 1) {
      alert(`Please select exactly one order to download a ${currentAction.entity}.`);
      return;
    }
    if (!currentAction.download && !confirm(`Are you sure you want to send ${currentAction.entity} to ${selectedOrderIds.length} selected orders?`)) {
        return;
    }
    try {
      const response = currentAction.download 
        ? await postClientForFile("/api/orders/bulk-action", { action, orderIds: selectedOrderIds, options })
        : await postClient("/api/orders/bulk-action", { action, orderIds: selectedOrderIds, options });
      if (currentAction.download) {
        const disposition = (response as Response).headers.get("content-disposition");
        const filename = disposition?.match(/filename="(.+?)"/)?.[1] || "receipt.pdf";
        const blob = await (response as Response).blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); window.URL.revokeObjectURL(url);
      } else {
        alert((response as any).message);
      }
      setSelectedOrderIds([]);
    } catch (err: any) {
      alert(`An error occurred: ${err.message}`);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 bg-background min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-foreground">Order Management</h1>
      
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Input type="text" placeholder="Search by name, ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full sm:w-64"/>
          <Select value={filters.status || "all"} onValueChange={(value) => setFilters({ status: value === "all" ? "" : value })}>
            <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="All Fulfillment" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Fulfillment</SelectItem>
              <SelectItem value="unfulfilled">Unfulfilled</SelectItem>
              <SelectItem value="receipt_sent">Receipt Sent</SelectItem>
              <SelectItem value="ticket_sent">Ticket Sent</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="outline" disabled={selectedOrderIds.length === 0}>Actions ({selectedOrderIds.length})</Button></DropdownMenuTrigger>
          <DropdownMenuContent className="w-60">
            <DropdownMenuLabel>Send WhatsApp Receipt</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleBulkAction("send_whatsapp_receipt", { withGst: true })} disabled={selectedOrderIds.length === 0}>Send (with GST)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleBulkAction("send_whatsapp_receipt", { withGst: false })} disabled={selectedOrderIds.length === 0}>Send (no GST)</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Send Email Receipt</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleBulkAction("send_email_receipt", { withGst: true })} disabled={selectedOrderIds.length === 0}>Email (with GST)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleBulkAction("send_email_receipt", { withGst: false })} disabled={selectedOrderIds.length === 0}>Email (no GST)</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Download Single Receipt</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleBulkAction("send_receipt", { withGst: true })} disabled={selectedOrderIds.length !== 1}>Download (with GST)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleBulkAction("send_receipt", { withGst: false })} disabled={selectedOrderIds.length !== 1}>Download (no GST)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isLoading && <div className="text-center p-8 text-muted-foreground">Loading initial orders...</div>}
      {error && <div className="text-center p-8 text-destructive">{error}</div>}

      {!isLoading && !error && (
        <TooltipProvider delayDuration={100}>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"><Checkbox checked={orders.length > 0 && selectedOrderIds.length === orders.length} onCheckedChange={(checked) => setSelectedOrderIds(checked ? orders.map(o => o._id) : [])} /></TableHead>
                  <TableHead>Order / User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Order Status</TableHead>
                  <TableHead>Communications</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center h-24 text-muted-foreground">No orders found.</TableCell></TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order._id} data-state={selectedOrderIds.includes(order._id) ? "selected" : undefined}>
                      <TableCell><Checkbox checked={selectedOrderIds.includes(order._id)} onCheckedChange={(checked) => setSelectedOrderIds(checked ? [...selectedOrderIds, order._id] : selectedOrderIds.filter(id => id !== order._id))}/></TableCell>
                      <TableCell className="font-medium">
                        <div className="font-bold text-foreground">{order.user?.fullName || "Unknown"}</div>
                        <div className="text-xs text-muted-foreground font-mono">#{order.confirmationId}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold">₹{order.totalAmount.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground capitalize">{order.paymentDetails.method}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1.5">
                          <PaymentStatusBadge status={order.paymentStatus} />
                          <FulfillmentStatusBadge status={order.fulfillmentStatus} />
                        </div>
                      </TableCell>
                      <TableCell>
                         <div className="flex flex-col gap-1.5">
                            <CommunicationStatus type="email" channel={order.notifications?.email} />
                            <CommunicationStatus type="whatsapp" channel={order.notifications?.whatsapp} />
                        </div>
                      </TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString('en-GB')}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
            <div className="text-sm text-muted-foreground">{pagination.totalItems} Orders</div>
            {pagination.totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage(pagination.currentPage - 1)} disabled={pagination.currentPage <= 1}>Previous</Button>
                <span className="text-sm text-muted-foreground">Page {pagination.currentPage} of {pagination.totalPages}</span>
                <Button variant="outline" size="sm" onClick={() => setPage(pagination.currentPage + 1)} disabled={pagination.currentPage >= pagination.totalPages}>Next</Button>
              </div>
            )}
          </div>
        </TooltipProvider>
      )}
    </div>
  );
}