import { createContext, useState, useContext, Dispatch, SetStateAction } from 'react';

interface LocalStorageContextType {
    ssionChian: number;
    setSsionChian: Dispatch<SetStateAction<number>>;
}

const LocalStorageManager = createContext<LocalStorageContextType | null>(null);

// 你可以导出这个Context和自定义的useTheme钩子
export const useLocalStorage = () => useContext(LocalStorageManager);

export default LocalStorageManager;