import { create } from 'zustand';
// BEFORE:
// import { get, put } from '@/lib/api'; 

// AFTER: Import the new functions from the new file.
import { getClient } from '@/lib/api-client';

// Define the shape of your user profile data
interface UserProfile {
  name: string;
  email: string;
  department: string;
  skills: string[];
  seniority: string;
}

// Define the shape of your store's state and actions
interface ProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

// Create the Zustand store (The logic inside remains the same)
export const useProfileStore = create<ProfileState>((set) => ({
  // Initial State
  profile: null,
  loading: true,
  error: null,

  // --- ACTIONS ---

  // Action to fetch the user's profile
  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      // Use the new getClient function
      const response = await getClient("/api/auth/profile"); 
      set({ profile: response.user, loading: false });
    } catch (error: any) {
      console.error("Failed to fetch profile:", error);
      set({ error: error.message, loading: false });
    }
  },

  // Action to update the user's profile
  updateProfile: async (dataToUpdate) => {
    set({ loading: true, error: null });
    try {
      // Use the new putClient function
      
      
      alert("Profile updated successfully!");

    } catch (error: any) {
      console.error("Profile update error:", error);
      set({ error: error.message, loading: false });
      
      alert(`Failed to update profile: ${error.message}`);
    }
  },
}));