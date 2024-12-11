'use client'

import { SiteHeader } from "@/components/site-header"

import "@/styles/globals.css"
import "@/styles/styles.css"
import "@/styles/App.css"
import "@radix-ui/themes/styles.css"
import '@rainbow-me/rainbowkit/styles.css';
import { DexProvider } from "@/lib/store"
import { usePathname, useRouter } from "next/navigation";
import { Web3ReactProvider } from "@web3-react/core";
import connectors from "@/connectors";
import { useEffect, useState, useMemo, Suspense } from "react";
import { useValueGood } from "@/stores/valueGood";
import LocalStorageManager from "@/utils/LocalStorageManager";
import { chainIds } from "data/chainIds";
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/i18n';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { Locale, RainbowKitProvider, lightTheme, AvatarComponent } from '@rainbow-me/rainbowkit';

import { valueGood } from '@/graphql';

import { config } from '@/config/wagmi';

import { Loading } from '@/components/Loading';
import {Footer} from '@/components/footer/Footer';
import Jazzicons from "@/components/components/Jazzicons";
import { useLoadingStore } from '@/hooks/useLoading';


const queryClient = new QueryClient();

interface RootLayoutProps {
  children: React.ReactNode
}
const CustomAvatar: AvatarComponent = ({ address, ensImage, size }) => {
  return (
    <Jazzicons seed={address} />
  )
};

export default function RootLayout({ children }: RootLayoutProps) {
  let pathname = usePathname();
  const [ssionChian, setSsionChian] = useState(11155111);
  const { info, setValueGood } = useValueGood();

  const [language, setLanguage] = useState('en');
  const { isLoading, setLoading } = useLoadingStore();

  // 监听路由变化
  useEffect(() => {
    const handleRouteChange = () => {
      setLoading(true);
      // 给一个短暂的延迟来显示加载状态
      setTimeout(() => {
        setLoading(false);
      }, 500);
    };

    // 初始加载
    handleRouteChange();
  }, [pathname, setLoading]); // 当路由或查询参数变化时触发

  // 监听页面加载完成
  useEffect(() => {
    if (document.readyState === 'complete') {
      setLoading(false);
    } else {
      const handleLoad = () => setLoading(false);
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, [setLoading]);

  useEffect(() => {
    i18n.loadLanguages(i18n.language);
    setLanguage(i18n.language);
  }, []);

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setLanguage(lng);
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
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
      <html lang={language} suppressHydrationWarning>
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

                  <WagmiProvider config={config}>
                    <QueryClientProvider client={queryClient}>
                      <RainbowKitProvider
                        locale={language as Locale}
                        initialChain={ssionChian}
                        theme={lightTheme({
                          accentColor: 'rgb(134 211 139)',
                          accentColorForeground: 'white',
                          borderRadius: 'medium',
                          // fontStack: 'system',
                          // overlayBlur: 'small',
                        })}
                        avatar={CustomAvatar}
                      >
                        {isLoading && <Loading />}
                        <div className="relative flex min-h-screen flex-col">
                          <SiteHeader />
                          <div className="flex-1">{children}</div>
                          <Footer />
                        </div>
                      </RainbowKitProvider>
                    </QueryClientProvider>
                  </WagmiProvider>
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
