import { DEFAULT_TOKEN } from "@/shared/constants/common";
import { AmountState } from "@/shared/types/token";
import { create } from "zustand";

interface SwapAmountStore {
  swapsAmount: AmountState;
  setSwapAmount: (element: AmountState) => void;
}

const initDefaultSwapAmount = (): AmountState => ({
  from:{
    token: "",
    amount: "",
    id: 0,
    currentQuantity: 0,
    currentValue: 0,
    price:0
  },
  to:{
    token: "",
    amount: "",
    id: 0,
    currentQuantity: 0,
    currentValue: 0,
    price:0
  }
});

export const useSwapAmountStore = create<SwapAmountStore>((set) => ({
  
  swapsAmount: initDefaultSwapAmount(),
  setSwapAmount: async (amount: AmountState) => {
    set({ swapsAmount: amount })
  },
}));