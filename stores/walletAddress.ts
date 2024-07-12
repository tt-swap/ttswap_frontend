import { create } from "zustand";

interface walletAddress {
  address: any
  setAccount: (e: any) => void
}
export const useWalletAddress = create<walletAddress>((set) => ({
  address: null,
  setAccount: async (newAccount: any) => {
    set({ address: newAccount });
  }
  }));
