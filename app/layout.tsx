'use client'
import { Analytics } from '@vercel/analytics/react';
import "@/styles/globals.css"
import "@covalenthq/goldrush-kit/styles.css"
import { Theme } from "@radix-ui/themes"

import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { SiteHeader } from "@/components/site-header"
import { ThemeProvider } from "@/components/theme-provider"

import "@radix-ui/themes/styles.css"
import { DexProvider } from "@/lib/store"
import { Toaster } from "@/components/ui/toaster"
import { KeyDialog } from "@/components/key-dialog"
import { Footer } from '@/components/footer';
import { usePathname } from "next/navigation";
import { Web3ReactProvider } from "@web3-react/core";
import connectors from "@/connectors";
import { useMemo, useEffect, useState } from "react";
import { useValueGood } from "@/stores/valueGood";
import {useWalletAddress} from "@/stores/walletAddress";

import { valueGood } from '@/graphql';


interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  let pathname = usePathname();

  const { info, setValueGood } = useValueGood();

  const { address,setAccount } = useWalletAddress();

  useEffect(() => {
    setAccount(window.localStorage.getItem("wallet"));
  }, []);

  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        {/* bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% */}
        <body
          className={cn(
            `"min-h-screen bg-background font-sans antialiased " ${pathname === "/eth-mainnet/ttswap/swap" ? "bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%": ""}`,
            fontSans.variable
          )}
        >
          {/* <Theme>
            <ThemeProvider attribute="class" defaultTheme="system" forcedTheme='dark' enableSystem={false}> */}
             <Web3ReactProvider connectors={connectors}>
              <DexProvider>
                <div className="relative flex min-h-screen flex-col">
                  <SiteHeader />
                  <div className="flex-1">{children}</div>
                  {/* <Analytics />
                  <Footer/>
                  <KeyDialog />
                  <Toaster /> */}
                </div>
              </DexProvider>
            </Web3ReactProvider>
            {/* </ThemeProvider>
          </Theme> */}
        </body>
      </html>
    </>
  )
}
