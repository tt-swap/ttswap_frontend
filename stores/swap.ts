import { DEFAULT_TOKEN } from "@/shared/constants/common";
import { SwapState } from "@/shared/types/token";
import { create } from "zustand";

interface SwapStore {
  swaps: SwapState;
  setSwap: (element: SwapState) => void;
}

const initDefaultSwap = (): SwapState => ({
  from: {
    token: DEFAULT_TOKEN,
    amount: 0,
  },
  to: {
    token: DEFAULT_TOKEN,
    amount: 0,
  },
});

export const useSwapStore = create<SwapStore>((set) => ({
  swaps: initDefaultSwap(),
  setSwap: async (newSwaps: SwapState) => set({ swaps: newSwaps }),
}));
