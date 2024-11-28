'use client'
import { useMemo,useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from 'react-i18next';
import { GoldRushProvider } from "@/utils/store";
import { XYKTokenDetailView, XYKTokenTransactionsListView } from "@/components/Organisms"
import { Flex } from "@radix-ui/themes";
import { Button } from 'antd';

import { useValueGood } from "@/stores/valueGood";
import { useLocalStorage } from "@/utils/LocalStorageManager";

export default function Token({ params }: { params: { chain: string, dex: string, goods_id: string } }) {
  const router = useRouter();
  const { info } = useValueGood();
  const { t } = useTranslation();
  // @ts-ignore
  const { ssionChian } = useLocalStorage();

  useEffect(() => {
    document.title = t('header.menu.goods');
  }, [t('header.menu.goods')]);
  

  return (
    <div className="w-full flex flex-col gap-4">
      <GoldRushProvider
        apikey="cqt_rQR8cdBV8vyD43KCb3vC6cDx9Xqf"
        newTheme={{
          borderRadius: 10,
        }}
      >
        <XYKTokenDetailView
          // @ts-ignore
          chain_name={params.chain}
          dex_name={params.dex}
          token_address={params.goods_id}
          value_good_id={info.id}
          chain_id={ssionChian}
        />
        <h2 className="text-xl font-medium leading-tight tracking-tighter py-2">
          {t("body.goods.title")}
        </h2>
        <XYKTokenTransactionsListView
          // @ts-ignore
          chain_name={params.chain}
          dex_name={params.dex}
          token_address={params.goods_id}
          on_native_explorer_click={(e: string) => {
            window.open(e, '_blank');
          }}
          value_good_id={info.id}
          chain_id={ssionChian}
          page_size={10}
        // on_goldrush_receipt_click={(e: { tx_hash: any; })=>{
        //   window.open(`https://goldrush-tx-receipt-ui.vercel.app/tx/${params.chain}/${e.tx_hash}/`, '_blank');
        // }}
        />
      </GoldRushProvider>
      {/* <Flex onClick={() => {
        router.back()
      }}>
        <Button
          // shape="round"
          size="large"
          type="primary">Back</Button>
      </Flex> */}
    </div>
  )

}
