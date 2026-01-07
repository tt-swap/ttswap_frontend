import { create } from 'zustand';

interface MenuState {
  name: string | null;
  setName: (name?: string | null) => void;
}

export const useMuneName = create<MenuState>((set) => ({
  name: 'home',
  setName: (name = 'home') => set({ name }),
}));