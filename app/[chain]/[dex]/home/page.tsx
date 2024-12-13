'use client'
import { useEffect, useState, useMemo } from "react";
import { Flex } from "@radix-ui/themes";
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n/i18n';
// import { message, Button, Tabs } from 'antd';
// import type { TabsProps } from 'antd';
// import { handleTabSwitch } from "@/utils/router";
import banner1 from "static/christmas-banner.png";
import banner2 from "static/christmas-banner-1.png";
import banneren1 from "static/christmas-banner-en.png";
import banneren2 from "static/christmas-banner-1-en.png";

export default function Home({ params }: { params: { chain: string, dex: string } }) {

  const { t } = useTranslation();
  const [lang, setLang] = useState('en');

  useEffect(() => {
    document.title = t('header.menu.home');
  }, [t('header.menu.home')]);
  useEffect(() => {
    setLang(i18n.language);
  }, [i18n.language]);

  return (
    <div className="w-full flex flex-col gap-20"
    // style={{ margin: "-3rem 0rem" }}
    >
      {/* <Flex align="end" gap="4"> */}
      <img src={lang==='zh'?banner1.src:banneren1.src}></img>
      <img src={lang==='zh'?banner2.src:banneren2.src}></img>
      {/* </Flex> */}
    </div>
  )

}
