'use client'

import { SiteHeader } from "@/components/site-header"

import "@/styles/globals.css"
import "@/styles/styles.css"
import "@/styles/App.css"
import "@radix-ui/themes/styles.css"
import { DexProvider } from "@/lib/store"
import { usePathname, useRouter } from "next/navigation";
import { Web3ReactProvider } from "@web3-react/core";
import connectors from "@/connectors";
import { useEffect, useState, useMemo, Suspense } from "react";
import { Skeleton } from 'antd';
import { useValueGood } from "@/stores/valueGood";
import { useWalletAddress } from "@/stores/walletAddress";
import LocalStorageManager from "@/utils/LocalStorageManager";
import { chainIds } from "data/chainIds";
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/i18n';

import { valueGood } from '@/graphql';


interface RootLayoutProps {
  children: React.ReactNode
}
// const SsionContext = createContext(null);

export default function RootLayout({ children }: RootLayoutProps) {
  let pathname = usePathname();
  const router = useRouter();
  const [ssionChian, setSsionChian] = useState(11155111);
  const { info, setValueGood } = useValueGood();

  const { address, setAccount } = useWalletAddress();
  // const { chainId1, setChainId } = useChainId();

  useEffect(() => {
    i18n.loadLanguages(i18n.language);
  }, []);

  useMemo(() => {
    if (typeof window !== "undefined") {
      const routeSegments = pathname.split('/');
      if (routeSegments.length > 3) {
        const chname = routeSegments[1];
        const chid = chainIds[chname];
        setSsionChian(Number(chid));
      }
    }
  }, [pathname]);


  useEffect(() => {
    // console.log(ssionChian, 999665);
    setAccount(window.localStorage.getItem("wallet"));
    // @ts-ignore
    // setChainId(ssionChian);
    (async () => {
      const bal = await valueGood(ssionChian);
      // console.log(bal,99999999999)
      setValueGood({
        id: bal.data.goodStates[0].id,
        symbol: bal.data.goodStates[0].tokensymbol,
        name: bal.data.goodStates[0].tokenname,
        logo_url: "",
        address: bal.data.goodStates[0].erc20Address,
        decimals: bal.data.goodStates[0].tokendecimals
      });
    })();
  }, [ssionChian]);

  return (
    <>
      <html lang={i18n.language} suppressHydrationWarning>
        <head />
        {/* bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% */}
        <body>
          {/* <Theme>
            <ThemeProvider attribute="class" defaultTheme="system" forcedTheme='dark' enableSystem={false}> */}
          <Web3ReactProvider connectors={connectors}>
            <LocalStorageManager.Provider
              // @ts-ignore
              value={{ ssionChian, setSsionChian }}>
              <DexProvider>
                <I18nextProvider i18n={i18n}>
                  {/* <Suspense fallback={<Skeleton active />}> */}
                    <div className="relative flex min-h-screen flex-col">
                      <SiteHeader />
                      <div className="flex-1">{children}</div>
                    </div>
                  {/* </Suspense> */}
                </I18nextProvider>
              </DexProvider>
            </LocalStorageManager.Provider>
          </Web3ReactProvider>
          {/* </ThemeProvider>
          </Theme> */}
        </body>
      </html>
    </>
  )
}
