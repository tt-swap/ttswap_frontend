'use client'
import { useEffect, useState, useMemo } from "react";
import { Flex } from "@radix-ui/themes";
import { useTranslation } from 'react-i18next';
// import { message, Button, Tabs } from 'antd';
// import type { TabsProps } from 'antd';
// import { handleTabSwitch } from "@/utils/router";
import banner1 from "static/christmas-banner.png";
// import banner2 from "static/christmas-banner-1.png";

export default function Home({ params }: { params: { chain: string, dex: string } }) {

  const { t } = useTranslation();

  useEffect(() => {
    document.title = t('header.menu.home');
  }, [t('header.menu.home')]);
  useEffect(() => {
    // (async () => {
    //   const data = await refereesDatas(address, ssionChian);
    //   // @ts-ignore
    //   setReferees(data.referralnum);
    // })();
  }, []);

  return (
    <div className="w-full flex flex-col gap-20"
      // style={{ margin: "-3rem 0rem" }}
    >
      {/* <Flex align="end" gap="4"> */}
      <img src={banner1.src}></img>
      {/* <img src={banner2.src}></img> */}
      {/* </Flex> */}
    </div>
  )

}
