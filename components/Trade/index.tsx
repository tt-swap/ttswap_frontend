import { useRouter, usePathname } from "next/navigation";
import { GoldRushProvider } from "@/utils/store";
import { XYKWalletPositionsListView, XYKWalletTransactionsListView, XYKWalletPoolListView, XYKWalletCommissionListView, XYKWalletRefereesView } from "@/components/Organisms"
import { XYKWalletInformation } from "@/components/Molecules"
import { CreatGoods } from "@/components/goods/creatGoods"
import { Disinvest } from "@/components/goods/disinvest"
import { Flex } from "@radix-ui/themes";
import { useTranslation } from 'react-i18next';
import { message, Button, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { handleTabSwitch } from "@/utils/router";
import { useEffect, useState, useMemo } from "react";
import { useValueGood, useGoodId } from "@/stores/valueGood";

// import { useWeb3React } from "@web3-react/core";
import { useLocalStorage } from "@/utils/LocalStorageManager";
import useLocalStorages from "@/hooks/useLocalStorage";
import { useAccount } from 'wagmi';

import { refereesDatas } from '@/graphql/account';

import TokenSwap from "@/components/swap";
import TokenInvest from "@/components/invest";
import { useTrade } from '@/hooks/useTrade';

const Trade = () => {


    const { trade, setTrade } = useTrade();
    const { t } = useTranslation();

    const onChange = (key: string) => {
        console.log(key);
        setTrade(key);
    };
    const items: TabsProps['items'] = [
        {
            key: 'swap',
            label: t('common.swap'),
            children: (
                <GoldRushProvider
                    apikey="cqt_rQR8cdBV8vyD43KCb3vC6cDx9Xqf"
                    newTheme={{
                        borderRadius: 10,
                    }}
                >
                    <TokenSwap/>
                </GoldRushProvider>
            ),
        },
        {
            key: 'invest',
            label: t('common.invest'),
            children: (
                <GoldRushProvider
                    apikey="cqt_rQR8cdBV8vyD43KCb3vC6cDx9Xqf"
                    newTheme={{
                        borderRadius: 10,
                    }}
                >
                    <TokenInvest/>
                </GoldRushProvider>

            ),
        }
    ];


    return (
        <>
            <Tabs size="large" defaultActiveKey={trade} items={items} onChange={onChange} />
        </>
    )
}

export default Trade;