import { create } from 'zustand';

interface Trade {
    trade: string;
    setTrade: (loading: string) => void;
}

export const useTrade = create<Trade>((set) => ({
    trade: "swap",
    setTrade: (loading) => set({ trade: loading }),
}));