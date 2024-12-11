import { FC, useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

import { Dropdown, Button, Space } from "antd";
import type { MenuProps } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { CaretDownOutlined, GithubOutlined, XOutlined, DiscordOutlined, MailOutlined, MenuOutlined } from '@ant-design/icons';
import { Icons } from "@/components/icons";

import Logo from "@/assets/tt_logo.png"
import { StaticImageData } from "next/image";

import './index.css';

const CompanyInfo: FC = () => {

    const router = useRouter();
    const pathname = usePathname()
    const { t } = useTranslation();
    const [windowWidth, setWindowWidth] = useState<number>(0);
    const width = 950;

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

    const handleTabSwitch = (route: string) => {
        const routeSegments = pathname.split('/');
        routeSegments[3] = route;
        if (routeSegments.length > 4) {
            routeSegments.pop();
        }
        const newRoute = routeSegments.join('/');
        // console.log(newRoute)
        router.push(newRoute);
    }

    const tzlb = (
            <div className="flex justify-between gap-8 ico-eas">
                <a target="_blank" rel="noopener noreferrer" href="https://x.com/ttswapFinance">
                    <XOutlined />
                </a>
                <a target="_blank" rel="noopener noreferrer" href="https://discord.gg/XygqnmQgX3">
                    <DiscordOutlined />
                </a>
                <a target="_blank" rel="noopener noreferrer" href="mailto:ttswap.exchange@gmail.com">
                    <MailOutlined />
                </a>
                <a target="_blank" rel="noopener noreferrer" href="https://github.com/tt-swap">
                    <GithubOutlined />
                </a>
                <a target="_blank" rel="noopener noreferrer" href="https://t.me/ttswap01">
                    <Icons.Telegram className="h-5 w-5" />
                </a>
            </div>
        );

    const labelToShow = (logo: StaticImageData, alt: string) => {
        return (
            <div className="flex items-center">
                <img src={logo.src} alt={alt} style={{ width: "25px", height: "25px", borderRadius: "10px", marginRight: "0" }} />
            </div>
        );
    };


    const items: MenuProps['items'] = [
        {
            key: '1',
            type: 'group',
            label: t('footer.title2'),
            children: [
                {
                    key: '1-1',
                    label: (<a target="_blank" rel="noopener noreferrer" href="/whitepaper_cn.pdf">
                        {t('footer.title2.wpcn')}
                    </a>),
                },
                {
                    key: '1-2',
                    label: (<a target="_blank" rel="noopener noreferrer" href="/whitepaper_en.pdf">
                        {t('footer.title2.wpen')}
                    </a>),
                },
            ],
        },
        {
            key: '2',
            type: 'group',
            label: t('footer.title1'),
            children: [
                {
                    key: '2-1',
                    label: (tzlb),
                },
            ],
        },
    ];
    const items1: MenuProps['items'] = [
        {
            key: '0',
            type: 'group',
            label: t('footer.menu'),
            children: [
                {
                    label: t('header.menu.goods') || "Goods",
                    key: 'goods',
                    onClick: () => handleTabSwitch("goods"),
                },
                {
                    label: t('header.menu.trade.swap') || "Swap",
                    key: 'swap',
                    onClick: () => handleTabSwitch("swap"),
                },
                {
                    label: t('header.menu.trade.invest') || "Invest",
                    key: 'invest',
                    onClick: () => handleTabSwitch("invest"),
                },
                {
                    label: t('header.menu.myaccount') || "Profile",
                    key: 'profile',
                    onClick: () => handleTabSwitch("profile"),
                }
            ],
        },
        {
            key: '1',
            type: 'group',
            label: t('footer.title2'),
            children: [
                {
                    key: '1-1',
                    label: (<a target="_blank" rel="noopener noreferrer" href="/whitepaper_cn.pdf">
                        {t('footer.title2.wpcn')}
                    </a>),
                },
                {
                    key: '1-2',
                    label: (<a target="_blank" rel="noopener noreferrer" href="/whitepaper_en.pdf">
                        {t('footer.title2.wpen')}
                    </a>),
                },
            ],
        },
        {
            key: '2',
            type: 'group',
            label: t('footer.title1'),
            children: [
                {
                    key: '2-1',
                    label: (tzlb),
                },
            ],
        }
    ];
    const menuProps: MenuProps = {
        items: windowWidth > width ? items : items1
    };
    return (
        <Dropdown menu={menuProps} overlayClassName="custom-dropdown">
            <a
                className="flex items-center logo"
                onClick={(e) => handleTabSwitch("home")}>
                <Space>
                    {labelToShow(Logo, "")}
                    {windowWidth > 1290 ? (<span className="logo-name">TTSWAP</span>) : (<span></span>)}
                    {windowWidth < width && (<MenuOutlined />)}
                    <CaretDownOutlined
                        style={{ fontSize: "12px" }}
                    />
                </Space>
            </a>
        </Dropdown>
    );
};

export default CompanyInfo;
