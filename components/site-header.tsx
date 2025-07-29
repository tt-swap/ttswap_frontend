import { usePathname, useRouter } from "next/navigation"
import ConnectAccount from "@/components/components/Account/ConnectAccount";
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
import { useLocalStorage } from "@/utils/LocalStorageManager";
import { getAddChainParameters } from "@/data/networks";


export function SiteHeader() {

    const router = useRouter()
    const pathname = usePathname()
    // const pathRegex = pathname.match(/\/([^\/]*)$/)
    const [current, setCurrent] = useState('goods');
    const { t, ready } = useTranslation();
    const [windowWidth, setWindowWidth] = useState<number>(0);
    const [skeleton, setSkeleton] = useState(false);
    const { isConnected, address } = useAccount();
    // @ts-ignore
    const { ssionChian, setSsionChian } = useLocalStorage();
    const chainId = useChainId();

    const handleTabSwitch = (route: string) => {
        const routeSegments = pathname.split('/');
        routeSegments[3] = route;
        if (routeSegments.length > 4) {
            routeSegments.pop();
        }
        const newRoute = routeSegments.join('/');
        console.log(newRoute)
        router.push(newRoute);
    }

    const routerUp = () => {

        const routeSegments = pathname.split('/');
        // @ts-ignore
        const chainName = getAddChainParameters(chainId).chainName;
        routeSegments[1] = chainName;
        const newRoute = routeSegments.join('/');
        console.log(routeSegments, chainName, newRoute);
        router.push(newRoute)
    };

    useEffect(() => {
        if (isConnected) {
            setSsionChian(chainId);
            routerUp();
        }
    }, [isConnected, chainId]);

    useEffect(() => {
        const routeSegments = pathname.split('/');
        // console.log(routeSegments, "account");
        if (routeSegments.length > 3) {
            const chname = routeSegments[3];
            setCurrent(chname);
            // console.log(chname, "account");
        }
        // console.log(treeData)
    }, [pathname]);

    const items: MenuProps['items'] = [
        // {
        //     label: t('header.menu.home') || "Home",
        //     key: 'home',
        //     onClick: () => handleTabSwitch("home"),
        // },
        {
            label: t('header.menu.goods') || "Goods",
            key: 'goods',
            onClick: () => handleTabSwitch("goods"),
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
        }
    ];

    const onClick: MenuProps['onClick'] = (e) => {
        // console.log('click ', e);
        setCurrent(e.key);
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
        {skeleton&&(<Skeleton/>)}
            <header className="bg-gradient-to-r to-90% sticky top-0 z-40 w-full border-b h-16 bg-background">
                <div className="pr-4 pl-4 flex h-16 items-center justify-center w-full">
                    <div className="flex items-center justify-start w-full" style={{ height: "42px" }}>
                        <div className="flex h-full items-center gap-1 cursor-pointer">
                            <CompanyInfo />
                        </div>
                        {windowWidth > 950 && (<Menu className="headerMenu" onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />)}
                    </div>
                    <GoodsSearch isValue={""} />
                    <div className="flex items-center justify-end w-full">
                        <nav className="flex items-center gap-3">
                            <GoodsSearch isValue={"button"} />
                            {/* {isConnected && chainId!==1 && (<Faucet />)} */}
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
