'use client'
// import { Analytics } from '@vercel/analytics/react';
import "@/styles/globals.css"
import "@/styles/styles.css"
// import { Theme } from "@radix-ui/themes"
// import "@/styles/App.css"

import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { SiteHeader } from "@/components/site-header"
// import { ThemeProvider } from "@/components/theme-provider"

import "@radix-ui/themes/styles.css"
import { DexProvider } from "@/lib/store"
// import { Toaster } from "@/components/ui/toaster"
// import { KeyDialog } from "@/components/key-dialog"
import { Footer } from '@/components/footer';
import { usePathname,useRouter } from "next/navigation";
import { Web3ReactProvider } from "@web3-react/core";
import connectors from "@/connectors";
import { useEffect, useState,useMemo } from "react";
import { useValueGood } from "@/stores/valueGood";
import { useWalletAddress } from "@/stores/walletAddress";
import LocalStorageManager from "@/utils/LocalStorageManager";
import { chainIds } from "data/chainIds";

import { valueGood } from '@/graphql';


interface RootLayoutProps {
  children: React.ReactNode
}
// const SsionContext = createContext(null);

export default function RootLayout({ children }: RootLayoutProps) {
  let pathname = usePathname();
  const router = useRouter();
  const [ssionChian, setSsionChian] = useState(97);
  const { info, setValueGood } = useValueGood();

  const { address, setAccount } = useWalletAddress();
  // const { chainId1, setChainId } = useChainId();

  useMemo(() => {
    const routeSegments = pathname.split('/');
    // console.log(routeSegments, "account");
    if (routeSegments.length>3) {
      const chname = routeSegments[1];
        const chid = chainIds[chname];
        setSsionChian(Number(chid));
    }
      console.log(ssionChian, "account");
  }, []);


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
      <html lang="en" suppressHydrationWarning>
        <head />
        {/* bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% */}
        <body
          className={cn(
            `"min-h-screen bg-background font-sans antialiased " ${pathname === "/eth-mainnet/ttswap/swap" ? "bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%" : ""}`,
            fontSans.variable
          )}
        >
          {/* <Theme>
            <ThemeProvider attribute="class" defaultTheme="system" forcedTheme='dark' enableSystem={false}> */}
          <Web3ReactProvider connectors={connectors}>
            <LocalStorageManager.Provider
              // @ts-ignore
              value={{ ssionChian, setSsionChian }}>
              <DexProvider>
                <div className="relative flex min-h-screen flex-col">
                  <SiteHeader />
                  <div className="flex-1">{children}</div>
                  <Footer />
                  {/* <Analytics />
                  <Footer/>
                  <KeyDialog />
                  <Toaster /> */}
                </div>
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
