// import { EventEmitter } from 'events';

// class LocalStorageManager extends EventEmitter {
//     setItem(key: string, value: string) {
//         localStorage.setItem(key, value);
//         this.emit('change', { key, value });
//     }

//     getItem(key: string) {
//         return localStorage.getItem(key);
//     }

//     // 可以添加更多方法...
// }

// const localStorageManager = new LocalStorageManager();

import { createContext, useState, useContext } from 'react';

const LocalStorageManager = createContext(null);

// 你可以导出这个Context和自定义的useTheme钩子
export const useLocalStorage = () => useContext(LocalStorageManager);



export default LocalStorageManager;