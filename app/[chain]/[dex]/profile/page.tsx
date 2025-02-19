'use client'
import { useRouter, usePathname } from "next/navigation";
import { GoldRushProvider } from "@/utils/store";
import { XYKWalletPositionsListView, XYKWalletTransactionsListView, XYKWalletPoolListView, XYKWalletCommissionListView,XYKWalletRefereesView } from "@/components/Organisms"
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
import { Faucet } from "@/components/test01"

// import { useWeb3React } from "@web3-react/core";
import { useLocalStorage } from "@/utils/LocalStorageManager";
import useLocalStorages from "@/hooks/useLocalStorage";
import { useAccount } from 'wagmi';

import { refereesDatas } from '@/graphql/account';

export default function Account({ params }: { params: { chain: string, dex: string } }) {

  // @ts-ignore
  const { ssionChian } = useLocalStorage();
  const { isConnected,address } = useAccount();
  // const { account } = useWeb3React();
  const router = useRouter();
  // const [walletAddress, setAddress] = useState<string | null>("")
  // const [walletAddress, setWallet] = useLocalStorages("wallet", null);
  const [referees, setReferees] = useState(0);
  const [proofid, setProofid] = useState(0);
  const [dataNum, setDataNum] = useState(0);
  const [open, setOpen] = useState(false);
  const { info } = useValueGood();
  const [maybeResult, setResult] = useState({});
  const { setGoodId } = useGoodId();
  const [messageApi, contextHolder] = message.useMessage();
  const { t } = useTranslation();

  const pathname = usePathname()

  useEffect(() => {
    document.title = t('header.menu.myaccount');
  }, [t('header.menu.myaccount')]);
  useEffect(() => {
    (async () => {
      const data = await refereesDatas(address, ssionChian);
      // @ts-ignore
      setReferees(data.referralnum);
    })();
  }, []);

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

  function mess() {
    messageApi.open({
      type: 'success',
      content: t('common.mess.copy'),
    });
  }
  console.log("referees",referees)


  const onChange = (key: string) => {
    console.log(key);
  };
  const items: TabsProps['items'] = [
    {
      key: 'myproof',
      label: t('body.account.tabs.proof'),
      children: (
        <GoldRushProvider
          apikey="cqt_rQR8cdBV8vyD43KCb3vC6cDx9Xqf"
          newTheme={{
            borderRadius: 10,
          }}
        >
          <XYKWalletPositionsListView
            // @ts-ignore
            chain_name={params.chain}
            dex_name={params.dex}
            wallet_address={address}
            data_num={dataNum}
            page_size={20}
            value_good_id={info.id}
            chain_id={ssionChian}
            on_pool_click={(e: any) => {
              if (e === "invest") {
                router.push(`${handleTabSwitch(e, pathname)}`);
              }
              //  else if (e != 0) {
              //   router.push(`${handleTabSwitch(e, pathname)}`);
              // }
              else {
                setProofid(e);
                setOpen(true);
              }
            }}
          />
        </GoldRushProvider>
      ),
    },
    {
      key: 'mygoods',
      label: t('body.account.tabs.goods'),
      children: (
        <GoldRushProvider
          apikey="cqt_rQR8cdBV8vyD43KCb3vC6cDx9Xqf"
          newTheme={{
            borderRadius: 10,
          }}
        >
          <XYKWalletPoolListView
            // @ts-ignore
            chain_name={params.chain}
            dex_name={params.dex}
            page_size={20}
            wallet_address={address}
            data_num={dataNum}
            value_good_id={info.id}
            chain_id={ssionChian}
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

      ),
    },
    {
      key: 'mycommission',
      label: t('body.account.tabs.commission'),
      children: (
        <GoldRushProvider
          apikey="cqt_rQR8cdBV8vyD43KCb3vC6cDx9Xqf"
          newTheme={{
            borderRadius: 10,
          }}
        >
          <XYKWalletCommissionListView
            // @ts-ignore
            chain_name={params.chain}
            dex_name={params.dex}
            page_size={20}
            wallet_address={address}
            data_num={dataNum}
            value_good_id={info.id}
            chain_id={ssionChian}
            on_pool_click={(e: any, id: string) => {
              router.push(`${handleTabSwitch(e, pathname)}`);
            }}
          />
        </GoldRushProvider>
      ),
    },
    {
      key: 'mytransactions',
      label: t('body.account.tabs.transactions'),
      children: (
        <GoldRushProvider
          apikey="cqt_rQR8cdBV8vyD43KCb3vC6cDx9Xqf"
          newTheme={{
            borderRadius: 10,
          }}
        >
          <XYKWalletTransactionsListView
            // @ts-ignore
            chain_name={params.chain}
            dex_name={params.dex}
            wallet_address={address}
            data_num={dataNum}
            value_good_id={info.id}
            page_size={20}
            chain_id={ssionChian}
            on_native_explorer_click={(e: string) => {
              window.open(e, '_blank');
            }}
          />
        </GoldRushProvider>
      ),
    },
    {
      key: 'referees',
      label: t('body.account.tabs.referees')+'('+referees+')',
      children: (
        <GoldRushProvider
          apikey="cqt_rQR8cdBV8vyD43KCb3vC6cDx9Xqf"
          newTheme={{
            borderRadius: 10,
          }}
        >
          <XYKWalletRefereesView
            // @ts-ignore
            chain_name={params.chain}
            dex_name={params.dex}
            wallet_address={address}
            data_num={dataNum}
            value_good_id={info.id}
            page_size={20}
            chain_id={ssionChian}
            on_native_explorer_click={(e: string) => {
              window.open(e, '_blank');
            }}
          />
        </GoldRushProvider>
      ),
    },
  ];

  return (
    <div className="w-full flex flex-col gap-4">
      {contextHolder}
      <Faucet></Faucet>
      {/* <h1 className="pt-4 text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
        Account
      </h1> */}
      <Flex align="end" gap="4">
        {isConnected && (
          <>
            <CreatGoods
              setDataNum={(e) => setDataNum(e + dataNum)}
            ></CreatGoods>
            <Button
              type="primary"
              size="large"
              className="mx-2"
              onClick={() => {
                if (navigator.clipboard) {
                  // 使用 clipboard API 复制文本
                  navigator.clipboard.writeText(window.location.host + handleTabSwitch("goods", pathname) + "?" + address);
                  mess();
                  // alert('文本已复制到剪贴板');
                } else {
                  // 如果不支持，可以提供一个回退方案，比如使用 prompt 或者 textarea + document.execCommand('copy')（但请注意，execCommand 已被弃用）
                  fallbackCopyTextToClipboard(window.location.host + handleTabSwitch("goods", pathname) + "?" + address);
                  mess();
                  // alert('浏览器不支持 clipboard API');
                }
                // setIsClicked(true);
              }}
            >{t('body.account.bnt.share')}</Button>
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
        dex_name={params.dex}
        wallet_address={address}
        value_good_id={info.id}
        wallet_data={maybeResult}
        chain_id={ssionChian}
      />
      {isConnected && (<Tabs size="large" defaultActiveKey="myproof" items={items} onChange={onChange} />)}
    </div>
  )

}
