// Next.js Project: store/ticket-store.ts
import { create } from 'zustand';
import { getClient } from '@/lib/api-client';

// --- The Fix: Import the shared Order and Pagination types directly. ---
import { Order, Pagination } from '@/types/orders';

// --- REMOVE the problematic dynamic import line. ---
// type Order = ReturnType<typeof import('./order-store').useOrderStore.getState>['orders'][0];

interface TicketStoreState {
  orders: Order[];
  pagination: Pagination; // Use the imported Pagination type
  isLoading: boolean;
  error: string | null;
  filters: { search: string; status: string; };
  fetchOrders: () => void;
  setFilters: (newFilters: Partial<{ search: string; status: string; }>) => void;
  setPage: (page: number) => void;
}

export const useTicketStore = create<TicketStoreState>((set, get) => ({
  orders: [],
  pagination: { currentPage: 1, totalPages: 1, totalItems: 0 },
  isLoading: false,
  error: null,
  filters: { search: "", status: "" },
  setFilters: (newFilters) => {
    set((state) => ({ 
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, currentPage: 1 }
    }));
  },
  setPage: (page) => {
    set((state) => ({ pagination: { ...state.pagination, currentPage: page } }));
  },
  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const { filters, pagination } = get();
      // Fetch only PAID orders, which are candidates for tickets
      const params = new URLSearchParams({
        page: String(pagination.currentPage),
        paymentStatus: 'paid', // <-- This is correct for a ticket-focused page
        limit: '15',
      });
      if (filters.search) params.set('search', filters.search);
      if (filters.status) params.set('fulfillmentStatus', filters.status);
      
      const response = await getClient(`/api/orders?${params.toString()}`);
      
      set({ 
        orders: response.data, 
        pagination: response.pagination, 
        isLoading: false 
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
}));