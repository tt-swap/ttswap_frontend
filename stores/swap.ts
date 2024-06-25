import { DEFAULT_TOKEN } from "@/shared/constants/common";
import { SwapState,AmountState } from "@/shared/types/token";
import { create } from "zustand";

interface SwapStore {
  swaps: SwapState;
  setSwap: (element: SwapState) => void;
}

const initDefaultSwap = (): SwapState => ({
  from: {
    symbol: DEFAULT_TOKEN,
    id: "",
    buyFee: 0,
    sellFee: 0,
    price: 0,
    logo_url: "",
    address: "",
    currentQuantity: 0,
    currentValue: 0
  },
  to: {
    symbol: DEFAULT_TOKEN,
    id: "",
    buyFee: 0,
    sellFee: 0,
    price: 0,
    logo_url: "",
    address: "",
    currentQuantity: 0,
    currentValue: 0
  },
});

export const useSwapStore = create<SwapStore>((set) => ({
  
  swaps: initDefaultSwap(),
  setSwap: async (newSwaps: SwapState) => {
    console.log(newSwaps,"****");
    set({ swaps: newSwaps })
  },
}));