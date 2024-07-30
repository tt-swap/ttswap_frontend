'use client'
import { useRouter, usePathname } from "next/navigation";
// import { XYKWalletInformation } from "@covalenthq/goldrush-kit";
import { GoldRushProvider } from "@/utils/store";
import { XYKWalletPositionsListView, XYKWalletTransactionsListView, XYKWalletPoolListView } from "@/components/Organisms"
import { XYKWalletInformation } from "@/components/Molecules"
import { CreatGoods } from "@/components/goods/creatGoods"
// import { Faucet } from "@/components/faucet"
import { Disinvest } from "@/components/goods/disinvest"
import { Flex } from "@radix-ui/themes";
import { Button } from "@/components/ui/button";
import { message } from 'antd';
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
import { handleTabSwitch } from "@/utils/router";
// import { useState } from "react";
import { useEffect, useState, useMemo } from "react";
import { useValueGood, useGoodId } from "@/stores/valueGood";

import { useWeb3React } from "@web3-react/core";
// import { myIndexes } from '@/graphql/account';
// import { prettifyCurrencys } from '@/graphql/util';

export default function Account({ params }: { params: { chain: string, dex: string } }) {

  const { account } = useWeb3React();
  const router = useRouter();
  const [walletAddress, setAddress] = useState<string | null>("")
  // const [input, setInput] = useState("");
  const [proofid, setProofid] = useState(0);
  const [dataNum, setDataNum] = useState(0);
  const [open, setOpen] = useState(false);
  const { info } = useValueGood();
  const [maybeResult, setResult] = useState({});
  const { setGoodId } = useGoodId();
  const [messageApi, contextHolder] = message.useMessage();

  const pathname = usePathname()

  useMemo(() => {
    setAddress(window.localStorage.getItem("wallet"));
  }, [account, window.localStorage.getItem("wallet")]);

  function fallbackCopyTextToClipboard(text: string): void {
    const textarea = document.createElement('textarea');
    textarea.style.position = 'fixed'; // 防止滚动条
    textarea.style.top = '0';
    textarea.style.left = '0';
    textarea.style.opacity = '0';
    textarea.value = text;
    document.body.appendChild(textarea);

    try {
      // 尝试复制文本
      textarea.select();
      document.execCommand('copy');
      // alert('文本已复制到剪贴板（回退方案）');
    } catch (err) {
      // console.error('复制文本时出错（回退方案）:', err);
      // alert('复制文本时出错，请尝试手动复制');
    }

    document.body.removeChild(textarea);
  }

  function mess(){
    messageApi.open({
      type: 'success',
      content: 'Success Copy',
    });
  }
console.log("account")

  return (
    <div className="w-full flex flex-col gap-4">
      {contextHolder}
      <h1 className="pt-4 text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
        Account
      </h1>
      <Flex align="end" gap="4">
        {walletAddress !== null && (
          <>
            <CreatGoods
              setDataNum={(e) => setDataNum(e + dataNum)}
            ></CreatGoods>
            <Button
              className="newButton mx-2"
              onClick={() => {
                if (navigator.clipboard) {
                  // 使用 clipboard API 复制文本
                  navigator.clipboard.writeText(window.location.host+handleTabSwitch("overview", pathname)+"?"+walletAddress);
                  mess();
                  // alert('文本已复制到剪贴板');
                } else {
                  // 如果不支持，可以提供一个回退方案，比如使用 prompt 或者 textarea + document.execCommand('copy')（但请注意，execCommand 已被弃用）
                  fallbackCopyTextToClipboard(window.location.host+handleTabSwitch("overview", pathname)+"?"+walletAddress);
                  mess();
                  // alert('浏览器不支持 clipboard API');
                }
                // setIsClicked(true);
              }}
            >Share link</Button>
          </>
        )}
        <Disinvest
          open_zt={open}
          dis_id={proofid}
          setOpen={setOpen}
          setDataNum={(e) => setDataNum(e + dataNum)}
        ></Disinvest>
        {/* <Faucet/> */}
      </Flex>
      <XYKWalletInformation
        // @ts-ignore
        chain_name={params.chain}
        dex_name={params.dex === "ttswap" ? "uniswap_v2" : params.dex}
        wallet_address={walletAddress}
        value_good_id={info.id}
        wallet_data={maybeResult}
      />
      <h2 className="text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">
        Invest Proof
      </h2>
      <GoldRushProvider
        apikey="cqt_rQR8cdBV8vyD43KCb3vC6cDx9Xqf"
        newTheme={{
          borderRadius: 10,
        }}
      >
        <XYKWalletPositionsListView
          // @ts-ignore
          chain_name={params.chain}
          dex_name={params.dex === "ttswap" ? "uniswap_v2" : params.dex}
          wallet_address={walletAddress}
          data_num={dataNum}
          page_size={5}
          value_good_id={info.id}
          on_pool_click={(e: any) => {
            if (e === "invest") {
              router.push(`${handleTabSwitch(e, pathname)}`);
            } else {
              setProofid(e);
              setOpen(true);
            }
          }}
        />
      </GoldRushProvider>

      <h2 className="text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">
        My Goods
      </h2>
      <GoldRushProvider
        apikey="cqt_rQR8cdBV8vyD43KCb3vC6cDx9Xqf"
        newTheme={{
          borderRadius: 10,
        }}
      >
        <XYKWalletPoolListView
          // @ts-ignore
          chain_name={params.chain}
          dex_name={params.dex === "ttswap" ? "uniswap_v2" : params.dex}
          page_size={10}
          wallet_address={walletAddress}
          data_num={dataNum}
          value_good_id={info.id}
          // is_over={true}
          on_pool_click={(e: any, id: string) => {
            if (e === "invest") {
              setGoodId({ invest: { id: id }, swap: { id: "" } });
              // sessionStorage.setItem("invest", id);
            } else {
              setGoodId({ invest: { id: "" }, swap: { id: id } });
              // sessionStorage.setItem("swap", id);
            }
            router.push(`${handleTabSwitch(e, pathname)}`);
          }}
        />
      </GoldRushProvider>
      <h2 className="text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">
        Transactions
      </h2>
      <XYKWalletTransactionsListView
        // @ts-ignore
        chain_name={params.chain}
        dex_name={params.dex === "ttswap" ? "uniswap_v2" : params.dex}
        wallet_address={walletAddress}
        data_num={dataNum}
        value_good_id={info.id}
        page_size={10}
        on_native_explorer_click={(e: string) => {
          window.open(e, '_blank');
        }}
      // on_goldrush_receipt_click={(e: { tx_hash: any; }) => {
      //   window.open(`https://goldrush-tx-receipt-ui.vercel.app/tx/${params.chain}/${e.tx_hash}/`, '_blank');
      // }}
      />
      <Flex onClick={() => {
        router.back()
      }}>
        <Button>Back</Button>
      </Flex>
    </div>
  )

}
