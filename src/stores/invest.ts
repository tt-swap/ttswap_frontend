// import { DEFAULT_TOKEN } from "@/types/common";
import { InvestState,AmountState,initDefaultinvest } from "@/types/token";
import { create } from "zustand";

interface InvestStore {
  invest: InvestState;
  setInvest: (element: InvestState) => void;
}


export const useInvestStore = create<InvestStore>((set) => ({
  
  invest: initDefaultinvest(),
  setInvest: async (newInvest: InvestState) => {
    set({ invest: newInvest })
  },
}));

interface InvestAmountStore {
  investAmount: AmountState;
  setInvestAmount: (element: AmountState) => void;
}

const initDefaultInvestAmount = (): AmountState => ({
  from:{
    token: "",
    amount: "",
    id: "",
    currentQuantity: 0,
    currentValue: 0,
    price:0
  },
  to:{
    token: "",
    amount: "",
    id: "",
    currentQuantity: 0,
    currentValue: 0,
    price:0
  }
});

export const useInvestAmountStore = create<InvestAmountStore>((set) => ({
  
  investAmount: initDefaultInvestAmount(),
  setInvestAmount: async (amount: AmountState) => {
    set({ investAmount: amount })
  },
}));