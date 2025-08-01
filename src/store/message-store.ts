// src/store/message-store.ts
import { create } from 'zustand';
import { getClient } from '@/lib/api-client';

interface MessageState {
  responseMessage: string | null;
  isLoading: boolean;
  error: string | null;
  fetchSecretMessage: () => Promise<void>;
}

export const useMessageStore = create<MessageState>((set) => ({
  responseMessage: null,
  isLoading: false,
  error: null,
  fetchSecretMessage: async () => {
    set({ isLoading: true, error: null });
    try {
      // This calls our Next.js server's proxy endpoint
      const response = await getClient("/api/get-secret-message");
      // The backend response has a 'message' field
      set({ responseMessage: response.message, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
}));