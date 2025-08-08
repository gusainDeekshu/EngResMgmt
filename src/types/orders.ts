// file: types/orders.ts

// This file is now the single source of truth for what an 'Order' is.

export type NotificationChannel = {
  send: boolean;
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced' | 'read' | 'queued';
  error?: string | null;
  messageSid?: string;
};

export interface Order {
  _id: string;
  confirmationId: string;
  totalAmount: number;
  createdAt: string;
  paymentStatus: 'pending' | 'paid' | 'partially_paid' | 'failed' | 'refunded' | 'partially_refunded';
  fulfillmentStatus: 'unfulfilled' | 'receipt_sent' | 'ticket_sent' | 'completed' | 'cancelled';
  paymentDetails: {
    method: 'razorpay' | 'imported' | 'other';
    amountPaid: number;
  };
  user?: {
    fullName?: string;
    phoneNumber?: string;
  };
  notifications?: {
    email: NotificationChannel;
    whatsapp: NotificationChannel;
  };
  // Add the ticketDetails here as it's part of a complete order object
  ticketDetails?: {
    selectedVenue?: string;
    selectedDate?: string;
    ticketUrl?: string;
    ticketNumber?: string;
    eventTime?: string;
  } | null;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}