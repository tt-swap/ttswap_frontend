import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config,readPublicClient } from '@/config/wagmi';
import App from "./App.tsx";
import LocalStorageManager from "@/utils/LocalStorageManager";
import { useState } from 'react';
import "./index.css";

const queryClient = new QueryClient();


createRoot(document.getElementById("root")!).render(
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <LocalStorageManagerWrapper>
      <I18nextProvider i18n={i18n}>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </WagmiProvider>
      </I18nextProvider>
    </LocalStorageManagerWrapper>
  </BrowserRouter>
);

function LocalStorageManagerWrapper({ children }: { children: React.ReactNode }) {
  let Chian: any = 560048;
  let a = localStorage.getItem('chainId');
  if (a != "" && a != null && a != undefined) {
    Chian = Number(a);
  }
  console.log(Chian, "reference---", a)
  const [ssionChian, setSsionChian] = useState(Chian);

  return (
    <LocalStorageManager.Provider value={{ ssionChian, setSsionChian }}>
      {children}
    </LocalStorageManager.Provider>
  );
}