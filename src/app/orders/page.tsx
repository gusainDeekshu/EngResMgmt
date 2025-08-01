"use client";

import React, { useState, useEffect } from 'react';
import { useOrderStore } from '@/store/order-store';
import { useDebounce } from 'use-debounce';
import { postClientForFile } from '@/lib/api-client';

// --- ShadCN Component Imports ---
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table';

// Helper to get status color and text, now including all statuses from your schema
const getStatusStyle = (status: Order['status']) => {
  switch (status) {
    case 'completed':
    case 'ticket_sent':
      return { text: 'Ticket Sent', dot: 'bg-green-500' };
    case 'receipt_sent':
      return { text: 'Receipt Sent', dot: 'bg-sky-500' };
    case 'paid':
      return { text: 'Paid', dot: 'bg-blue-500' };
    case 'partial_payment':
      return { text: 'Partial Payment', dot: 'bg-orange-500' };
    case 'pending_payment':
      return { text: 'Pending', dot: 'bg-yellow-500' };
    case 'failed':
    case 'cancelled':
      return { text: 'Failed/Cancelled', dot: 'bg-red-500' };
    default:
      return { text: 'Unknown', dot: 'bg-gray-400' };
  }
};

export default function OrderManagementPage() {
    const { orders, pagination, isLoading, error, filters, fetchOrders, setFilters, setPage } = useOrderStore();
    
    const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState(filters.search);
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

    // Initial fetch of orders when the component mounts
    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]); // Dependency array ensures it only runs once on mount

    // Re-fetch orders when debounced search term or other filters change
    useEffect(() => {
        setFilters({ search: debouncedSearchTerm });
        // The store's effect will trigger the fetch
    }, [debouncedSearchTerm, setFilters]);

    const handleSelectAll = (checked: boolean | 'indeterminate') => {
        setSelectedOrderIds(checked === true ? orders.map(order => order._id) : []);
    };

    const handleSelectOne = (checked: boolean, id: string) => {
        setSelectedOrderIds(
            checked ? [...selectedOrderIds, id] : selectedOrderIds.filter(orderId => orderId !== id)
        );
    };

    const handleBulkAction = async (action: 'send_receipt' | 'send_ticket', options?: { withGst: boolean }) => {
        if (selectedOrderIds.length === 0) {
            alert("Please select at least one order.");
            return;
        }
        if (action === 'send_receipt' && selectedOrderIds.length !== 1) {
            alert("Please select exactly one order to generate a receipt.");
            return;
        }

        try {
            const response = await postClientForFile('/api/orders/bulk-action', { action, orderIds: selectedOrderIds, options });
            
            const disposition = response.headers.get('content-disposition');
            const filenameMatch = disposition && disposition.match(/filename="(.+?)"/);
            const filename = filenameMatch ? filenameMatch[1] : 'receipt.pdf';

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            
            alert('Action completed successfully and file downloaded!');
            fetchOrders(); // Refresh data from the server
            setSelectedOrderIds([]); // Clear selection

        } catch (err: any) {
            console.error("Action failed:", err);
            alert(`An error occurred: ${err.message}`);
        }
    };

    const StatusLegend = () => (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-600">
            <strong>Legend:</strong>
            <span className="flex items-center"><span className="h-2 w-2 rounded-full mr-1.5 bg-blue-500"></span>Paid</span>
            <span className="flex items-center"><span className="h-2 w-2 rounded-full mr-1.5 bg-orange-500"></span>Partial Payment</span> {/* --- ADDED --- */}
            <span className="flex items-center"><span className="h-2 w-2 rounded-full mr-1.5 bg-sky-500"></span>Receipt Sent</span>
            <span className="flex items-center"><span className="h-2 w-2 rounded-full mr-1.5 bg-green-500"></span>Ticket Sent</span>
            <span className="flex items-center"><span className="h-2 w-2 rounded-full mr-1.5 bg-yellow-500"></span>Pending</span>
            <span className="flex items-center"><span className="h-2 w-2 rounded-full mr-1.5 bg-red-500"></span>Failed</span>
        </div>
    );
    
    return (
        <div className="container mx-auto p-4 sm:p-6 bg-background min-h-screen">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-foreground">Order Management</h1>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <Input 
                        type="text" 
                        placeholder="Search by name, email, or ID..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        className="w-full sm:w-64" 
                    />
                    <Select
                        value={filters.status || 'all'}
                        onValueChange={(value) => {
                            setFilters({ status: value === 'all' ? '' : value });
                        }}
                    >
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            {/* --- UPDATED: FULL STATUS LIST --- */}
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="pending_payment">Pending</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="partial_payment">Partial Payment</SelectItem>
                            <SelectItem value="receipt_sent">Receipt Sent</SelectItem>
                            <SelectItem value="ticket_sent">Ticket Sent</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" disabled={selectedOrderIds.length === 0}>
                            Actions ({selectedOrderIds.length})
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Generate Receipt</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleBulkAction('send_receipt', { withGst: true })} disabled={selectedOrderIds.length !== 1}>
                            Download (with GST)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleBulkAction('send_receipt', { withGst: false })} disabled={selectedOrderIds.length !== 1}>
                            Download (no GST)
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem disabled onClick={() => handleBulkAction('send_ticket')}>
                            Mark as Ticket Sent
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {isLoading && <div className="text-center p-8 text-muted-foreground">Loading orders...</div>}
            {error && <div className="text-center p-8 text-destructive">{error}</div>}
            
            {!isLoading && !error && (
                <>
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">
                                        <Checkbox
                                            checked={
                                                orders.length > 0 && (selectedOrderIds.length === orders.length ? true : selectedOrderIds.length > 0 ? "indeterminate" : false)
                                            }
                                            onCheckedChange={(checked) => handleSelectAll(!!checked)}
                                        />
                                    </TableHead>
                                    <TableHead>Order / User</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Order Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.length === 0 ? (
                                    <TableRow><TableCell colSpan={5} className="text-center h-24 text-muted-foreground">No orders found.</TableCell></TableRow>
                                ) : (
                                    orders.map(order => {
                                        const style = getStatusStyle(order.status);
                                        return (
                                            <TableRow key={order._id}>
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedOrderIds.includes(order._id)}
                                                        onCheckedChange={(checked) => handleSelectOne(!!checked, order._id)}
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    <div className="font-bold text-foreground">{order.user?.fullName || 'Unknown User'}</div>
                                                    <div className="text-xs text-muted-foreground font-mono">#{order.confirmationId}</div>
                                                </TableCell>
                                                <TableCell>₹{(order.amountPaid / 100).toFixed(2)}</TableCell>
                                                <TableCell><div className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${style.dot}`}></span><span>{style.text}</span></div></TableCell>
                                                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
                        <StatusLegend />
                        {pagination.totalPages > 1 && (
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => setPage(pagination.currentPage - 1)} disabled={pagination.currentPage <= 1}>Previous</Button>
                                <span className="text-sm text-muted-foreground">Page {pagination.currentPage} of {pagination.totalPages}</span>
                                <Button variant="outline" size="sm" onClick={() => setPage(pagination.currentPage + 1)} disabled={pagination.currentPage >= pagination.totalPages}>Next</Button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

// Minimal type definition to avoid TS errors
type Order = {
  _id: string;
  confirmationId: string;
  amountPaid: number;
  status: 'pending_payment' | 'paid' | 'partial_payment' | 'receipt_sent' | 'ticket_sent' | 'completed' | 'cancelled' | 'failed';
  createdAt: string;
  user?: {
    fullName?: string;
  };
};