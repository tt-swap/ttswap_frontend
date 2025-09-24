'use client'
import { useEffect, useState, useMemo } from "react";
import { Flex } from "@radix-ui/themes";
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n/i18n';
import { XYKTokenListView } from "@/components/Organisms"
// import { message, Button, Tabs } from 'antd';
// import type { TabsProps } from 'antd';
// import { handleTabSwitch } from "@/utils/router";
// import banner1 from "static/christmas-banner.png";
// import banner2 from "static/christmas-banner-1.png";
// import banneren1 from "static/christmas-banner-en.png";
// import banneren2 from "static/christmas-banner-1-en.png";
import { useValueGood, useGoodId } from "@/stores/valueGood";
import { useLocalStorage } from "@/utils/LocalStorageManager";

export default function Home({ params }: { params: { chain: string, dex: string } }) {

  const [lang, setLang] = useState('en');
  const { info } = useValueGood();
  const { setGoodId } = useGoodId();
  // @ts-ignore
  const { ssionChian } = useLocalStorage();

  const { t, ready } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    document.title = t('header.menu.home');
  }, [t('header.menu.home')]);
  useEffect(() => {
    setLang(i18n.language);
  }, [i18n.language]);

  // 在客户端和服务端渲染一致之前不渲染可能导致hydration错误的内容
  if (!ready || !isClient) {
    return (
      <div className="w-full flex flex-col gap-4">
        <div className="skeleton h-10 w-3/4"></div>
        <div className="skeleton h-64"></div>
        <div className="skeleton h-64"></div>
        <div className="flex justify-between">
          <div className="skeleton h-8 w-1/4"></div>
        </div>
        <div className="skeleton h-96"></div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-20"
    // style={{ margin: "-3rem 0rem" }}
    >
      {/* <Flex align="end" gap="4"> */}
      {/* <img src={lang==='zh'?banner1.src:banneren1.src}></img>
      <img src={lang==='zh'?banner2.src:banneren2.src}></img> */}
      {/* </Flex> */}

      <XYKTokenListView
        // @ts-ignore
        chain_name={params.chain}
        dex_name={params.dex}
        chain_id={ssionChian}
        on_token_click={(e: any, id: string) => {
          // if (e === "swap" || e === "invest") {
          //   setGoodId({ invest: { id: id }, swap: { id: id } });
          //   setTrade(e);
          //   router.push(`${handleTabSwitch("trade", pathname)}`);
          // } else {
          //   router.push(`${handleTabSwitch(e, pathname)}`);
          // }
        }}
        page_size={100}
        value_good_id={info.id}
      // is_over={true}
      />
    </div>
  )

}
