import { useTranslation } from 'react-i18next';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';

import TokenSwap from "@/components/swap";
import TokenInvest from "@/components/invest";
import { useTrade } from '@/hooks/useTrade';

const Trade = () => {


    const { trade, setTrade } = useTrade();
    const { t } = useTranslation();

    const onChange = (key: string) => {
        console.log(key);
        setTrade(key);
        if (key === "swap") {
            document.title = t('header.menu.trade.swap');
        } else {
            document.title = t('header.menu.trade.invest');
        }
    };
    const items: TabsProps['items'] = [
        {
            key: 'swap',
            label: t('common.swap'),
            children: (
                <TokenSwap />
            ),
        },
        {
            key: 'invest',
            label: t('common.invest'),
            children: (
                <TokenInvest />

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