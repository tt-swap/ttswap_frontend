
import { useEffect, useState, useMemo, Suspense } from "react";
import { Flex } from "@radix-ui/themes"
import "@radix-ui/themes/styles.css"
import RouterView from './routes'
import { Locale, RainbowKitProvider, lightTheme, AvatarComponent } from '@rainbow-me/rainbowkit';
import { SiteHeader } from "@/components/header/site-header"
import Jazzicons from "@/components/Jazzicons";
import { Loading, GlobalLoading } from '@/components/Loading';
import { useLocalStorage } from "@/utils/LocalStorageManager";
import { useValueGood } from "@/stores/valueGood";
import { valueGood } from '@/services/graphql';
import i18n from '@/i18n';
import { useAccount, useChainId, useDisconnect } from 'wagmi';
import { ethers } from "ethers";
import { useLanguage } from '@/hooks/useLanguage';

import "@/styles/widget.css";
// import "@radix-ui/themes/styles.css"
import '@rainbow-me/rainbowkit/styles.css';

const CustomAvatar: AvatarComponent = ({ address, ensImage, size }) => {
  return (
    <Jazzicons seed={address} />
  )
};
function App() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const [language, setLanguage] = useState('en');
  const { ssionChian, setSsionChian } = useLocalStorage();
  const { info, setValueGood } = useValueGood();
  const { currentLanguage, changeLanguage } = useLanguage();
  const { disconnect } = useDisconnect();

  const getString = (str: string): string | null => {
    const index = str.indexOf('?');
    if (index === -1) {
      return null; // 如果未找到"?"，则返回null
    }
    return str.substring(index + 1); // 返回"?"之后的所有字符
  }

  // 初始化时检查是否需要断开连接
  const [shouldForceDisconnect, setShouldForceDisconnect] = useState(false);

  // 页面加载时立即检查并清除自动连接
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const wasManuallyDisconnected = localStorage.getItem('manually_disconnected');
      if (wasManuallyDisconnected === 'true') {
        setShouldForceDisconnect(true);
      }
    }
  }, []);

  // 执行强制断开
  useEffect(() => {
    if (shouldForceDisconnect && isConnected) {
      disconnect();
      localStorage.removeItem('manually_disconnected');
      clearAllWalletStorage();
      setShouldForceDisconnect(false);
    }
  }, [shouldForceDisconnect, isConnected, disconnect]);

  // 监听用户手动断开连接
  useEffect(() => {
    if (!isConnected) {
      // 标记为用户手动断开
      localStorage.setItem('manually_disconnected', 'true');
      clearAllWalletStorage();
    }
  }, [isConnected]);

  useEffect(() => {
    changeLanguage(localStorage.getItem("language"));
    if (typeof window !== "undefined") {
      const params = window.location.search;
      const a: any = getString(params);
      // console.log(ethers.isAddress(null),"reference---")
      if (getString(params) !== null && ethers.isAddress(a) && !ethers.isAddress(localStorage.getItem("reference"))) {
        // @ts-ignore
        localStorage.setItem("reference", a);
      }
    }
  }, []);

  useEffect(() => {
    if (isConnected) {
      setSsionChian(chainId);
      localStorage.setItem("chainId", chainId.toString());
      // routerUp();
    } else {
      localStorage.setItem("chainId", ssionChian.toString());
      console.log(ssionChian, "reference---000")
    }
  }, [isConnected, chainId, ssionChian]);

  useEffect(() => {
    (async () => {
      const bal = await valueGood(ssionChian);
      console.log(bal, 99999999999, ssionChian)
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

  useEffect(() => {
    // i18n.loadLanguages(i18n.language);
    // setLanguage(i18n.language);

    // 确保只在客户端执行，并且i18n已初始化
    if (typeof window !== 'undefined' && i18n.isInitialized) {
      setLanguage(i18n.language);
    }
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

  return (
    <Suspense fallback={<Loading />}>
      <RainbowKitProvider
        // key={ssionChian}
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
        showRecentTransactions={false}
      >
        {/* <Loading /> */}
        <GlobalLoading />
        <div className="relative flex min-h-screen flex-col bg-gray-50/30">
          <SiteHeader />
          <div className="flex-1">
            <Flex
              direction="column"
              gap="5"
              className="container min-h-[calc(100vh-150px)] py-16 px-4 sm:px-6"
            >
              <RouterView />
            </Flex>
          </div>
        </div>
      </RainbowKitProvider>
    </Suspense>
  )
}


function clearAllWalletStorage() {
  if (typeof window === 'undefined') return;

  const keysToClear = [
    'wagmi.store',
    'wagmi.connected',
    'walletconnect',
    'walletconnect-connector',
    'injected-connector',
    'coinbaseWalletConnector',
    'metaMask-connector',
    'rainbow-connector',
    'safe-connector',
    'uniswap-connector',
    'argent-connector',
    'binance-connector',
  ];

  keysToClear.forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });

  Object.keys(localStorage).forEach((key) => {
    if (key.toLowerCase().includes('wagmi') ||
      key.toLowerCase().includes('walletconnect') ||
      key.toLowerCase().includes('connector')) {
      localStorage.removeItem(key);
    }
  });

  Object.keys(sessionStorage).forEach((key) => {
    if (key.toLowerCase().includes('wagmi') ||
      key.toLowerCase().includes('walletconnect') ||
      key.toLowerCase().includes('connector')) {
      sessionStorage.removeItem(key);
    }
  });
}

export default App
