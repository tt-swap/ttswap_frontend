import { create } from 'zustand';

interface GlobalLoadingState {
  isLoading: boolean;
  message: string | null;
  setLoading: (loading: boolean, message?: string | null) => void;
}

export const useGlobalLoading = create<GlobalLoadingState>((set) => ({
  isLoading: false,
  message: null,
  setLoading: (loading, message = null) => set({ isLoading: loading, message }),
}));