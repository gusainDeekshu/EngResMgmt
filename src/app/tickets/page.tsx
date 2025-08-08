// src/app/tickets/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useTicketStore } from "@/store/ticket-store";
import { useDebounce } from "use-debounce";
import { postClient, getClient } from "@/lib/api-client";
import { Download, Mail, MessageSquare, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { PaymentStatusBadge, FulfillmentStatusBadge } from "@/app/components/order-helpers";
import type { Order } from "@/types/orders";

// Interfaces
interface VenueOption {
    _id: string;
    name: string;
    city: string;
    isComingSoon: boolean;
}
interface OrderWithEventName extends Order {
    items: [{
        productId: string;
        name: string;
        quantity: number;
        price: number;
    }];
    ticketDetails?: {
        ticketNumber?: string;
        selectedVenue?: { name: string; city: string; } | null;
        selectedDate?: string;
        eventTime?: string;
    };
}

// GenerateTicketModal Component
const GenerateTicketModal = ({ order, isOpen, onOpenChange, onActionSuccess }: { order: OrderWithEventName; isOpen: boolean; onOpenChange: (open: boolean) => void; onActionSuccess: () => void; }) => {
    const [selectedVenueId, setSelectedVenueId] = useState(''); 
    const [isLoadingVenues, setIsLoadingVenues] = useState(true);
    const [venues, setVenues] = useState<VenueOption[]>([]);
    const [modalError, setModalError] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const fetchAndSetVenues = async () => {
            if (!isOpen) return;
            setIsLoadingVenues(true);
            setModalError(null);
            setSelectedVenueId('');
            try {
                const response = await getClient(`/api/venues`);
                const fetchedVenues: VenueOption[] = response.venues;
                setVenues(fetchedVenues);
                const firstSelectable = fetchedVenues.find(v => !v.isComingSoon);
                if (firstSelectable) {
                    setSelectedVenueId(firstSelectable._id);
                }
            } catch (err: any) {
                console.error("Failed to fetch venues for modal:", err);
                const errorMessage = err.message || "Failed to load venues. Please try again.";
                setModalError(errorMessage);
                setVenues([]);
            } finally {
                setIsLoadingVenues(false);
            }
        };
        fetchAndSetVenues();
    }, [isOpen]);

    const handleGenerate = async () => {
        setIsGenerating(true);
        setModalError(null);
        try {
            const response = await postClient(`/api/tickets/action`, { 
                action: 'generate_ticket', 
                orderId: order._id, 
                venueId: selectedVenueId 
            });
            alert((response as any).message);
            onActionSuccess();
            onOpenChange(false);
        } catch (err: any) {
            console.error("Ticket generation error:", err);
            const errorMessage = (err as Error).message || "Failed to generate ticket.";
            setModalError(errorMessage);
        } finally {
            setIsGenerating(false);
        }
    };

    const hasSelectableVenues = venues.some(venue => !venue.isComingSoon);
    const disableConfirmButton = isGenerating || isLoadingVenues || !selectedVenueId || !hasSelectableVenues;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader><DialogTitle>Generate Ticket for #{order.confirmationId}</DialogTitle></DialogHeader>
                <div className="grid gap-4 py-4">
                    {isLoadingVenues ? ( <div className="text-center text-muted-foreground">Loading venues...</div>
                    ) : modalError ? ( <div className="text-center text-destructive">{modalError}</div>
                    ) : venues.length === 0 ? ( <div className="text-center text-muted-foreground">No venues available for this event.</div>
                    ) : (
                        <Select onValueChange={setSelectedVenueId} value={selectedVenueId}>
                            <SelectTrigger><SelectValue placeholder="Select a Venue" /></SelectTrigger>
                            <SelectContent>
                                {venues.map((venue) => (
                                    <SelectItem key={venue._id} value={venue._id} disabled={venue.isComingSoon}>
                                        {venue.name}, {venue.city} {venue.isComingSoon ? "(Coming Soon)" : ""}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isGenerating}>Cancel</Button>
                    <Button onClick={handleGenerate} disabled={disableConfirmButton}>
                        {isGenerating ? "Generating..." : "Generate"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default function TicketManagementPage() {
    const { orders, pagination, isLoading, error, filters, fetchOrders, setFilters, setPage } = useTicketStore();
    
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const [modalOrder, setModalOrder] = useState<OrderWithEventName | null>(null);
    const [isDownloading, setIsDownloading] = useState<string | null>(null);

    useEffect(() => { setFilters({ search: debouncedSearchTerm }); }, [debouncedSearchTerm, setFilters]);
    useEffect(() => { fetchOrders(); }, [fetchOrders, filters.search, pagination.currentPage, filters.status]);

    const handleAction = async (action: 'send_email_ticket' | 'send_whatsapp_ticket', orderId: string) => {
        if (!confirm(`Are you sure you want to send this ticket via ${action.includes('email') ? 'Email' : 'WhatsApp'}?`)) return;
        try {
            const response = await postClient('/api/tickets/action', { action, orderId });
            alert((response as any).message);
            fetchOrders(); 
        } catch (err: any) {
            alert(`Error: ${(err as Error).message}`);
        }
    };
    
    const handleDownload = async (orderId: string) => {
        setIsDownloading(orderId);
        try {
            const response = await fetch(`/api/tickets/${orderId}`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: "An unknown error occurred." }));
                throw new Error(errorData.error || errorData.message);
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ticket-${orderId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err: any) {
            console.error("Download error:", err);
            alert(`Error downloading ticket: ${err.message}`);
        } finally {
            setIsDownloading(null);
        }
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 bg-background min-h-screen">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-foreground">Ticket Management</h1>
            <div className="flex justify-between items-center gap-4 mb-4">
                <Input type="text" placeholder="Search by name, ID, etc..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-64"/>
                <Select value={filters.status || "all"} onValueChange={(value) => setFilters({ status: value === "all" ? "" : value })}>
                    <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Tickets" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Tickets</SelectItem>
                        <SelectItem value="unfulfilled">Pending Generation</SelectItem>
                        <SelectItem value="ticket_sent">Generated</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {isLoading && <div className="text-center p-8 text-muted-foreground">Loading tickets...</div>}
            {error && <div className="text-center p-8 text-destructive">{error}</div>}
            {!isLoading && !error && (
                <>
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader><TableRow><TableHead>Order / User</TableHead><TableHead>Status</TableHead><TableHead>Ticket Details</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order._id}>
                                    <TableCell><div className="font-bold">{order.user?.fullName}</div><div className="text-xs text-muted-foreground">#{order.confirmationId}</div></TableCell>
                                    <TableCell><div className="flex flex-col gap-1-5"><PaymentStatusBadge status={order.paymentStatus} /><FulfillmentStatusBadge status={order.fulfillmentStatus} /></div></TableCell>
                                    <TableCell>
                                        {order.fulfillmentStatus === 'ticket_sent' && order.ticketDetails?.ticketNumber ? (
                                            <div>
                                                <div className="font-mono text-sm">{order.ticketDetails.ticketNumber}</div>
                                                <div className="text-xs text-muted-foreground">{order.ticketDetails.selectedVenue?.name || 'Venue TBD'}, {order.ticketDetails.selectedVenue?.city || ''}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {order.ticketDetails.selectedDate ? new Date(order.ticketDetails.selectedDate).toLocaleDateString() : 'Date TBD'} at {order.ticketDetails.eventTime || 'Time TBD'}
                                                </div>
                                            </div>
                                        ) : (<span className="text-xs text-muted-foreground">Not Generated</span>)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button size="sm" onClick={() => setModalOrder(order as OrderWithEventName)} disabled={order.fulfillmentStatus === 'ticket_sent'}>
                                                <Ticket className="w-4 h-4 mr-2"/>Generate
                                            </Button>
                                            <Button size="sm" variant="outline" onClick={() => handleDownload(order._id)} disabled={order.fulfillmentStatus !== 'ticket_sent' || isDownloading === order._id}>
                                                {isDownloading === order._id ? ( "..." ) : ( <Download className="w-4 h-4 mr-2"/> )}
                                                {isDownloading === order._id ? "Downloading" : "Download"}
                                            </Button>
                                            <Button size="sm" variant="outline" onClick={() => handleAction('send_email_ticket', order._id)} disabled={order.fulfillmentStatus !== 'ticket_sent'}>
                                                <Mail className="w-4 h-4 mr-2"/>Email
                                            </Button>
                                            <Button size="sm" variant="outline" onClick={() => handleAction('send_whatsapp_ticket', order._id)} disabled={order.fulfillmentStatus !== 'ticket_sent'}>
                                                <MessageSquare className="w-4 h-4 mr-2"/>WhatsApp
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
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
                </>
            )}
            {modalOrder && <GenerateTicketModal order={modalOrder} isOpen={!!modalOrder} onOpenChange={(open) => !open && setModalOrder(null)} onActionSuccess={fetchOrders} />}
        </div>
    );
}