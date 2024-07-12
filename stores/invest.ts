import { DEFAULT_TOKEN } from "@/shared/constants/common";
import { InvestState,AmountState } from "@/shared/types/token";
import { create } from "zustand";

interface InvestStore {
  invest: InvestState;
  setInvest: (element: InvestState) => void;
}

const initDefaultinvest = (): InvestState => ({
  from: {
    id: 0,
    name: "",
    symbol: DEFAULT_TOKEN,
    investFee: 0,
    price: 0,
    logo_url: "",
    address: "",
    isvaluegood: false,
    decimals: 0
  },
  to: {
    id: 0,
    name: "",
    symbol: DEFAULT_TOKEN,
    investFee: 0,
    price: 0,
    logo_url: "",
    address: "",
    isvaluegood: false,
    decimals: 0
  },
});

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
    id: ""
  },
  to:{
    token: "",
    amount: "",
    id: ""
  }
});

export const useInvestAmountStore = create<InvestAmountStore>((set) => ({
  
  investAmount: initDefaultInvestAmount(),
  setInvestAmount: async (amount: AmountState) => {
    set({ investAmount: amount })
  },
}));