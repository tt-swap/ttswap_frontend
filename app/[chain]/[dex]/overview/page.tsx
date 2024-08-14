'use client'
import { Chain } from "@covalenthq/client-sdk"
import { useRouter, usePathname } from "next/navigation";
// import { XYKOverviewTransactionsListView  } from "@covalenthq/goldrush-kit";
import { GoldRushProvider } from "@/utils/store";
import { XYKPoolListView, XYKTokenListView, XYKOverviewTransactionsListView } from "@/components/Organisms"
import { XYKOverviewTimeSeries } from "@/components/Molecules"
import { Flex } from "@radix-ui/themes";
import { Button } from "@/components/ui/button";
import {
  DoubleRightOutlined
} from '@ant-design/icons';
import { Space } from 'antd';
import { useEffect, useState } from "react";
import { handleTabSwitch, getString } from "@/utils/router";
import { useValueGood, useGoodId } from "@/stores/valueGood";
import {useLocalStorage} from "@/utils/LocalStorageManager";



export default function Overview({ params }: { params: { chain: string, dex: string } }) {
  const router = useRouter();
  const pathname = usePathname()
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const { info } = useValueGood();
  const { setGoodId } = useGoodId();
  // @ts-ignore
  const { ssionChian  } = useLocalStorage();
  useEffect(() => {
    const params = window.location.search;
    if (getString(params) !== null) {
      const a = getString(params);
      // @ts-ignore
      localStorage.setItem("reference",a);
      // console.log(getString(params), 666666666)
    }
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  console.log("overview")
  return (
    <div className="w-full flex flex-col gap-4">
      <h1 className="pt-4 text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
        Overview
      </h1>
      <div className={windowWidth < 700 ? "gap-4" : "flex gap-4"}>
        <GoldRushProvider
          apikey="cqt_rQR8cdBV8vyD43KCb3vC6cDx9Xqf"
          newTheme={{
            borderRadius: 10,
          }}
        >
          <XYKOverviewTimeSeries
            // @ts-ignore
            chain_name={params.chain}
            dex_name={params.dex === "ttswap" ? "uniswap_v2" : params.dex}
            displayMetrics={"liquidity"}
            value_good_id={info.id}
            chain_id={ssionChian}
          />
          <XYKOverviewTimeSeries
            // @ts-ignore
            chain_name={params.chain}
            dex_name={params.dex === "ttswap" ? "uniswap_v2" : params.dex}
            displayMetrics={"volume"}
            value_good_id={info.id}
            chain_id={ssionChian}
          />
        </GoldRushProvider>
      </div>
      <div className="flex justify-between">
        <h2 className="text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">
          Goods
        </h2>
        {/* <h2 className="md:text-2sl">more</h2> */}
        <a className="cursor-pointer hover:opacity-75"
          onClick={() => {
            router.push(`${handleTabSwitch("goods", pathname)}`);
          }}
        ><Space><DoubleRightOutlined /></Space></a>
      </div>
      <GoldRushProvider
        apikey="cqt_rQR8cdBV8vyD43KCb3vC6cDx9Xqf"
        newTheme={{
          borderRadius: 10,
        }}
      >
        <XYKTokenListView
          // @ts-ignore
          chain_name={params.chain}
          dex_name={params.dex === "ttswap" ? "uniswap_v2" : params.dex}
          chain_id={ssionChian}
          on_token_click={(e: any, id: string) => {
            setGoodId({ invest: { id: "" }, swap: { id: id } });
            // sessionStorage.setItem("swap",id);
            router.push(`${handleTabSwitch(e, pathname)}`);
            // router.push(`/${params.chain}/${params.dex}/tokens/${e}`)
          }}
          page_size={5}
          value_good_id={info.id}
          is_over={true}
        />

      </GoldRushProvider>

      <div className="flex justify-between">
        <h2 className="text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">
          Pools
        </h2>
        {/* <h2 className="md:text-2sl">more</h2> */}
        <a className="cursor-pointer hover:opacity-75"
          onClick={() => {
            router.push(`${handleTabSwitch("pools", pathname)}`);
          }}
        ><Space><DoubleRightOutlined /></Space></a>
      </div>
      {/* <XYKTokenListView
          chain_name={params.chain}
          dex_name={params.dex}
          on_token_click={(e: any)=>{
            router.push(`/${params.chain}/${params.dex}/tokens/${e}`)
          }}
        /> */}
      <GoldRushProvider
        apikey="cqt_rQR8cdBV8vyD43KCb3vC6cDx9Xqf"
        newTheme={{
          borderRadius: 10,
        }}
      >
        <XYKPoolListView
          // @ts-ignore
          chain_name={params.chain}
          chain_id={ssionChian}
          dex_name={params.dex === "ttswap" ? "uniswap_v2" : params.dex}
          on_pool_click={(e: any, id: string) => {
            setGoodId({ invest: { id: id }, swap: { id: "" } });
            // sessionStorage.setItem("invest",id);
            router.push(`${handleTabSwitch(e, pathname)}`)
            // router.push(`/${params.chain}/${params.dex}/pools/${e}`)
          }}
          page_size={5}
          value_good_id={info.id}
          is_over={true}
        />

      </GoldRushProvider>

      <h2 className="text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">
        Transactions
      </h2>
      <XYKOverviewTransactionsListView
        // @ts-ignore
        chain_name={params.chain}
        chain_id={ssionChian}
        dex_name={params.dex === "ttswap" ? "uniswap_v2" : params.dex}
        on_native_explorer_click={(e: string) => {
          window.open(e, '_blank');
        }}
        // on_goldrush_receipt_click={(e: { tx_hash: any; }) => {
        //   window.open(`https://goldrush-tx-receipt-ui.vercel.app/tx/${params.chain}/${e.tx_hash}/`, '_blank');
        // }}
        value_good_id={info.id}
        is_over={true}
      />
      <Flex onClick={() => {
        router.back()
      }}>
        <Button>Back</Button>
      </Flex>
    </div>
  )

}
