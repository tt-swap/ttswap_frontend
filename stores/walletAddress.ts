import { create } from "zustand";
import { useState } from "react";

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


  export const useChainId =()=>{
    const [chainId1, setChainId] = useState(11155111);
    return {chainId1, setChainId};
  };