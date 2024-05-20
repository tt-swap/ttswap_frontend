import { create } from "zustand";
import priceService from "../services/priceService";
import { Price } from "@/shared/types/price";

interface PriceStore {
  isFetching: boolean
  prices: Array<Price>
  getPrices: () => void
}
export const useBlockChainPriceStore = create<PriceStore>((set) => ({
  isFetching: false,
  prices: [],
  getPrices: async () => {
    set({ isFetching: true });
    const prices = await priceService.getPrices();
    console.log("prices:", prices);
    set({ prices: prices, isFetching: false });
  },
}));
