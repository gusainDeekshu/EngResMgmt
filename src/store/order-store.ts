// store/order-store.ts
import { create } from 'zustand';
import { getClient } from '@/lib/api-client';
import { Order, Pagination } from '@/types/orders';



interface Filters {
  search: string;
  status: string; // This will now filter by fulfillmentStatus
}

interface OrderState {
  orders: Order[];
  pagination: Pagination;
  filters: Filters;
  isLoading: boolean;
  error: string | null;
  
  fetchOrders: () => Promise<void>;
  setFilters: (newFilters: Partial<Filters>) => void;
  setPage: (page: number) => void;
  updateOrderInList: (order: Order) => void; // The new action for real-time updates
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
    // To prevent flashes of loading on real-time updates, only set loading if there are no orders
    if (get().orders.length === 0) {
      set({ isLoading: true });
    }
    set({ error: null });
    
    const { filters, pagination } = get();

    const params = new URLSearchParams({
      page: pagination.currentPage.toString(),
      limit: '15', // Using a slightly larger page size
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
      // Reset to page 1 whenever a filter changes
      pagination: { ...state.pagination, currentPage: 1 } 
    }));
    // We will let the useEffect on the page trigger the fetch
  },

  // --- Action to Change Page ---
  setPage: (page: number) => {
    const { pagination } = get();
    if (page > 0 && page <= pagination.totalPages) {
      set(state => ({ pagination: { ...state.pagination, currentPage: page } }));
      // Let the useEffect on the page trigger the fetch
    }
  },

  // --- The new action for handling real-time SSE updates ---
  updateOrderInList: (updatedOrder: Order) => {
    set((state) => ({
      orders: state.orders.map((order) =>
        // If the ID matches, replace the old order with the new one from the server
        order._id === updatedOrder._id ? { ...order, ...updatedOrder } : order
      ),
    }));
  },
}));