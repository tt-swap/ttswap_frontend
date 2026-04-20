import { useNavigate } from "react-router-dom"
import ChainSelector from "@/components/ChainSelector";
import { LanguageSwitcher } from "@/components/Language/LanguageSwitcher"
import { Faucet } from "@/components/faucet"
import { Menu, Button, Skeleton } from "antd";
import type { MenuProps } from "antd";
import { useState, useEffect, Suspense, useMemo } from "react";
import { useTranslation } from 'react-i18next';
import GoodsSearch from "@/components/Search/GoodsSearch";
import CompanyInfo from "@/components/CompanyInfo/CompanyInfo";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useChainId } from 'wagmi';
// import { useLocalStorage } from "@/utils/LocalStorageManager";
import { useMuneName } from "@/stores/menu";
// import useWallet from "@/hooks/useWallet";


export function SiteHeader() {
    const navigate = useNavigate();
    // const [name, setName] = useState('home');
    const { name, setName } = useMuneName();
    const { t, ready } = useTranslation();
    const [windowWidth, setWindowWidth] = useState<number>(0);
    const [skeleton, setSkeleton] = useState(false);
    const { isConnected, address } = useAccount();
    // @ts-ignore
    // const { ssionChian, setSsionChian } = useLocalStorage();
    const chainId = useChainId();
    // const { updateNetworkVia } = useWallet();

    const handleTabSwitch = (route: string) => {
        navigate('/' + route);
    }

    // useEffect(() => {
    //     if (!isConnected) return;

    //     (async () => {
    //         const a = await updateNetworkVia(ssionChian);
    //         console.log("sssss", a)
    //     })();
    // }, [ssionChian,isConnected]);


    const items: MenuProps['items'] = [
        // {
        //     label: t('header.menu.home') || "Home",
        //     key: 'home',
        //     onClick: () => handleTabSwitch(""),
        // },
        {
            label: t('header.menu.tokens') || "Tokens",
            key: 'tokens',
            onClick: () => handleTabSwitch("tokens"),
        },
        {
            label: t('header.menu.trade') || "Trade",
            key: 'trade',
            onClick: () => handleTabSwitch("trade"),
            // children: [
            //     {
            //         label: t('header.menu.trade.swap') || "Swap",
            //         key: 'swap',
            //         onClick: () => handleTabSwitch("swap"),
            //     },
            //     {
            //         label: t('header.menu.trade.invest') || "Invest",
            //         key: 'invest',
            //         onClick: () => handleTabSwitch("invest"),
            //     }
            // ]
        },
        {
            label: t('header.menu.myaccount') || "Profile",
            key: 'profile',
            onClick: () => handleTabSwitch("profile"),
        },
        {
            label: t('header.menu.publicSale') || "PublicSale",
            key: 'publicSale',
            onClick: () => handleTabSwitch("publicSale"),
        }
    ];

    const onClick: MenuProps['onClick'] = (e) => {
        // console.log('click ', e);
        setName(e.key);
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            setWindowWidth(window.innerWidth);

            const handleResize = () => {
                setWindowWidth(window.innerWidth);
            };

            window.addEventListener("resize", handleResize);

            return () => {
                window.removeEventListener("resize", handleResize);
            };
        }
    }, []);

    return (
        <>
            {skeleton && (<Skeleton />)}
            <header className="bg-gradient-to-r to-90% sticky top-0 z-40 w-full border-b h-16 bg-background">
                <div className="pr-4 pl-4 flex h-16 items-center justify-center w-full">
                    <div className="flex items-center justify-start w-full header-menu-cont">
                        <div
                            onClick={() => setName("home")} >
                            <CompanyInfo />
                        </div>
                        {windowWidth > 950 && (<Menu className="headerMenu" onClick={onClick} selectedKeys={[name]} mode="horizontal" items={items} />)}
                    </div>
                    <GoodsSearch isValue={""} />
                    <div className="flex items-center justify-end w-full">
                        <nav className="flex items-center gap-3">
                            <GoodsSearch isValue={"button"} />
                            {isConnected && chainId !== 1 && (<Faucet />)}
                            {!isConnected && (<><ChainSelector />
                            </>)}
                            <LanguageSwitcher />
                            <ConnectButton
                                label={t('header.menu.account.connect')}
                                chainStatus="icon"
                                // accountStatus="address"
                                showBalance={false}
                            />
                        </nav>
                    </div>
                </div>
            </header>
        </>
    )
}
