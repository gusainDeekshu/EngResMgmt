// Next.js Project: app/components/order-helpers.tsx
"use client";

import React from 'react';
import { Badge } from "@/components/ui/badge";
import type { Order } from '@/types/orders'; // Import the shared Order type

// --- Payment Status Badge Component ---
export const PaymentStatusBadge = ({ status }: { status: Order['paymentStatus'] }) => {
    const styles: Record<Order['paymentStatus'], string> = { 
        paid: 'bg-green-100 text-green-800 border-green-300', 
        partially_paid: 'bg-yellow-100 text-yellow-800 border-yellow-300', 
        pending: 'bg-gray-100 text-gray-800 border-gray-300', 
        failed: 'bg-red-100 text-red-800 border-red-300', 
        refunded: 'bg-blue-100 text-blue-800 border-blue-300', 
        partially_refunded: 'bg-indigo-100 text-indigo-800 border-indigo-300' 
    };
    return <Badge variant="outline" className={`capitalize ${styles[status] || styles.pending}`}>{status.replace(/_/g, ' ')}</Badge>;
};

// --- Fulfillment Status Badge Component ---
export const FulfillmentStatusBadge = ({ status }: { status: Order['fulfillmentStatus'] }) => {
    const styles: Record<Order['fulfillmentStatus'], string> = { 
        completed: 'bg-green-100 text-green-800 border-green-300', 
        ticket_sent: 'bg-teal-100 text-teal-800 border-teal-300', 
        receipt_sent: 'bg-sky-100 text-sky-800 border-sky-300', 
        unfulfilled: 'bg-yellow-100 text-yellow-800 border-yellow-300', 
        cancelled: 'bg-red-100 text-red-800 border-red-300' 
    };
    return <Badge variant="outline" className={`capitalize ${styles[status] || styles.unfulfilled}`}>{status.replace(/_/g, ' ')}</Badge>;
};