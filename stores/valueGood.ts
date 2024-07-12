import { create } from "zustand";

interface info {
  id: string;
  symbol: string;
  decimals: number;
  name: string;
  logo_url: string;
  address: string;
};

interface valueGood {
  info: info;
  setValueGood: (e:info) => void;
}

const initDefaultValueGood = (): info => ({
    id: "",
    symbol: "",
    name: "",
    logo_url: "",
    address: "",
    decimals: 0
});

export const useValueGood = create<valueGood>((set) => ({
  
  info: initDefaultValueGood(),
  setValueGood: (newGood: info) => {
    set({ info: newGood });
  },
}));


interface goodid {
  swap:{id: string;},
  invest:{id: string;}
};

interface goodId {
  goodId: goodid;
  setGoodId: (e:goodid) => void;
}

const initDefaultGoodId = (): goodid => ({
  swap:{id: ""},
  invest:{id: ""}
});

export const useGoodId = create<goodId>((set) => ({
  
  goodId: initDefaultGoodId(),
  setGoodId: (newGood: goodid) => {
    set({ goodId: newGood });
  },
}));
