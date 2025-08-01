// file: src/store/order-store.ts

import { create } from 'zustand';
import { getClient, postClient } from '@/lib/api-client'; // Assuming postClient exists in api-client

// --- Type Definitions ---
interface Order {
  _id: string;
  confirmationId: string;
  amount: number;
  amountPaid : number;
  currency: string;
  status: 'pending_payment' | 'paid' | 'receipt_sent' | 'ticket_sent' | 'completed' | 'cancelled' | 'failed';
  createdAt: string;
  user: { // Populated user data
    _id: string;
    fullName: string;
    email: { address: string };
  };
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

interface Filters {
  search: string;
  status: string;
}

// --- Zustand Store State and Actions ---
interface OrderState {
  orders: Order[];
  pagination: Pagination;
  filters: Filters;
  isLoading: boolean;
  error: string | null;
  
  fetchOrders: () => Promise<void>;
  setFilters: (newFilters: Partial<Filters>) => void;
  setPage: (page: number) => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  // --- Initial State ---
  orders: [],
  pagination: { currentPage: 1, totalPages: 1, totalItems: 0 },
  filters: { search: '', status: '' },
  isLoading: true,
  error: null,

  // --- Main Fetching Action ---
  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    const { filters, pagination } = get();

    const params = new URLSearchParams({
      page: pagination.currentPage.toString(),
      limit: '10',
      ...(filters.search && { search: filters.search }),
      ...(filters.status && { status: filters.status }),
    });

    try {
      const response = await getClient(`/api/orders?${params.toString()}`);
      set({
        orders: response.data,
        pagination: response.pagination,
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false, orders: [] });
    }
  },

  // --- Action to Update Filters ---
  setFilters: (newFilters: Partial<Filters>) => {
    set(state => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, currentPage: 1 }
    }));
    get().fetchOrders(); // Fetch immediately after filter change
  },

  // --- Action to Change Page ---
  setPage: (page: number) => {
    const { pagination } = get();
    if (page > 0 && page <= pagination.totalPages) {
      set(state => ({ pagination: { ...state.pagination, currentPage: page } }));
      get().fetchOrders();
    }
  },
}));