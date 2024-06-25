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
    id: ""
  },
  to:{
    token: "",
    amount: "",
    id: ""
  }
});

export const useSwapAmountStore = create<SwapAmountStore>((set) => ({
  
  swapsAmount: initDefaultSwapAmount(),
  setSwapAmount: async (amount: AmountState) => {
    console.log(amount,"****");
    set({ swapsAmount: amount })
  },
}));