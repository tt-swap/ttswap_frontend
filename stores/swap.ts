import { DEFAULT_TOKEN } from "@/shared/constants/common";
import { SwapState,SwapStateF,SwapStateT } from "@/shared/types/token";
import { create } from "zustand";

interface SwapStore {
  swaps: SwapState;
  setSwap: (element: SwapState) => void;
}

const initDefaultSwap = (): SwapState => ({
  from: {
    symbol: DEFAULT_TOKEN,
    id: 0,
    buyFee: 0,
    sellFee: 0,
    price: 0,
    logo_url: "",
    address: "",
    currentQuantity: 0,
    currentValue: 0,
    decimals: 0
  },
  to: {
    symbol: DEFAULT_TOKEN,
    id: 0,
    buyFee: 0,
    sellFee: 0,
    price: 0,
    logo_url: "",
    address: "",
    currentQuantity: 0,
    currentValue: 0,
    decimals: 0
  },
});

export const useSwapStore = create<SwapStore>((set) => ({
  
  swaps: initDefaultSwap(),
  setSwap: async (newSwaps: SwapState) => {
    set({ swaps: newSwaps })
    // console.log({ swaps: newSwaps },66666)
  },
}));

interface SwapStoreF {
  swapsF: SwapStateF;
  setSwapF: (element: SwapStateF) => void;
}

const initDefaultSwapF = (): SwapStateF => ({
  from: {
    symbol: DEFAULT_TOKEN,
    id: "",
    buyFee: 0,
    sellFee: 0,
    price: 0,
    logo_url: "",
    address: "",
    currentQuantity: 0,
    currentValue: 0,
    decimals: 0
  }
});

export const useSwapStoreF = create<SwapStoreF>((set) => ({
  
  swapsF: initDefaultSwapF(),
  setSwapF: async (newSwaps: SwapStateF) => {
    set({ swapsF: newSwaps })
    // console.log({ swaps: newSwaps },66666)
  },
}));

interface SwapStoreT {
  swapsT: SwapStateT;
  setSwapT: (element: SwapStateT) => void;
}

const initDefaultSwapT = (): SwapStateT => ({
  to: {
    symbol: DEFAULT_TOKEN,
    id: "",
    buyFee: 0,
    sellFee: 0,
    price: 0,
    logo_url: "",
    address: "",
    currentQuantity: 0,
    currentValue: 0,
    decimals: 0
  },
});

export const useSwapStoreT = create<SwapStoreT>((set) => ({
  
  swapsT: initDefaultSwapT(),
  setSwapT: (newSwaps: SwapStateT) => {
    set({ swapsT: newSwaps })
    // console.log({ swaps: newSwaps },66666)
  },
}));
