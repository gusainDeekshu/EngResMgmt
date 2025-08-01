// src/store/user-store.ts
import { create } from 'zustand';
import { getClient } from '@/lib/api-client';

// --- Type Definitions ---
interface Order {
  _id: string;
  confirmationId: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

interface User {
  _id: string;
  fullName: string;
  email: { address: string };
  phoneNumber: string;
  kyc: { status: string };
  createdAt: string;
  orders: Order[];
  orderCount: number;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

interface Filters {
  search: string;
  kycStatus: string;
}

// --- Zustand Store State and Actions ---
interface UserState {
  users: User[];
  pagination: Pagination;
  filters: Filters;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchUsers: () => Promise<void>;
  setFilters: (newFilters: Partial<Filters>) => void;
  setPage: (page: number) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  // --- Initial State ---
  users: [],
  pagination: { currentPage: 1, totalPages: 1, totalItems: 0 },
  filters: { search: '', kycStatus: '' },
  isLoading: true,
  error: null,

  // --- Main Fetching Action ---
  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    const { filters, pagination } = get();

    // Construct query parameters from the current state
    const params = new URLSearchParams({
      page: pagination.currentPage.toString(),
      limit: '10',
      ...(filters.search && { search: filters.search }),
      ...(filters.kycStatus && { kycStatus: filters.kycStatus }),
    });

    try {
      // Call our Next.js server's proxy endpoint
      const response = await getClient(`/api/users?${params.toString()}`);
      set({
        users: response.data,
        pagination: response.pagination,
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false, users: [], pagination: { currentPage: 1, totalPages: 1, totalItems: 0 } });
    }
  },

  // --- Action to Update Filters ---
  setFilters: (newFilters: Partial<Filters>) => {
    const { fetchUsers } = get();
    // Merge new filters and reset to page 1
    set(state => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, currentPage: 1 } // Reset to first page on filter change
    }));
    // Debounce the fetch call in the component or fetch immediately
    fetchUsers();
  },

  // --- Action to Change Page ---
  setPage: (page: number) => {
    const { pagination, fetchUsers } = get();
    if (page > 0 && page <= pagination.totalPages) {
        set(state => ({
            pagination: { ...state.pagination, currentPage: page }
        }));
        fetchUsers();
    }
  },
}));