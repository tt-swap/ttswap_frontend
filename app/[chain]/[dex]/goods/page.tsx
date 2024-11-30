'use client'
import { useEffect, useState, useMemo, Suspense } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from 'react-i18next';
import { Skeleton } from 'antd';
import { GoldRushProvider } from "@/utils/store";
import { XYKTokenListView } from "@/components/Organisms"
import { XYKOverviewTimeSeries } from "@/components/Molecules"
import { handleTabSwitch, getString } from "@/utils/router";
import { useValueGood, useGoodId } from "@/stores/valueGood";
import { useLocalStorage } from "@/utils/LocalStorageManager";
import { ethers } from "ethers";

export default function Goods({ params }: { params: { chain: string, dex: string } }) {
  const router = useRouter();
  const pathname = usePathname()
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const { info } = useValueGood();
  const { setGoodId } = useGoodId();
  // @ts-ignore
  const { ssionChian } = useLocalStorage();
  const { t, ready } = useTranslation();

  useEffect(() => {
    document.title = t('header.menu.goods');
  }, [t('header.menu.goods')]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = window.location.search;
      const a:any = getString(params);
      // console.log(ethers.isAddress(null),"reference---")
      if (getString(params) !== null && ethers.isAddress(a) && !ethers.isAddress(localStorage.getItem("reference"))) {
        // @ts-ignore
        localStorage.setItem("reference", a);
      }
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

  // if (!ready) return <div><Skeleton active /></div>;
  return (
    // <Suspense fallback={<Skeleton active />}>
    <div className="w-full flex flex-col gap-4">
      {/* <h1 className="pt-4 text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
        Overview
      </h1> */}
      <div className={windowWidth < 700 ? "gap-4" : "flex gap-6 mb-8"}>
        <GoldRushProvider
          apikey="cqt_rQR8cdBV8vyD43KCb3vC6cDx9Xqf"
          newTheme={{
            borderRadius: 10,
          }}
        >
          <XYKOverviewTimeSeries
            // @ts-ignore
            chain_name={params.chain}
            dex_name={params.dex}
            displayMetrics={"volume"}
            value_good_id={info.id}
            chain_id={ssionChian}
            title={t('body.home.chars02.title')}
          />
          <div className="p-2"></div>
          <XYKOverviewTimeSeries
            // @ts-ignore
            chain_name={params.chain}
            dex_name={params.dex}
            displayMetrics={"liquidity"}
            value_good_id={info.id}
            chain_id={ssionChian}
            title={t('body.home.chars01.title')}
          />
        </GoldRushProvider>
      </div>
      <div className="flex justify-between">
        <h2 className="text-xl font-medium leading-tight tracking-tighter">
          {t('body.home.goods.title')}
        </h2>
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
          dex_name={params.dex}
          chain_id={ssionChian}
          on_token_click={(e: any, id: string) => {
            setGoodId({ invest: { id: id }, swap: { id: id } });
            // sessionStorage.setItem("swap",id);
            router.push(`${handleTabSwitch(e, pathname)}`);
            // router.push(`/${params.chain}/${params.dex}/tokens/${e}`)
          }}
          page_size={100}
          value_good_id={info.id}
        // is_over={true}
        />
      </GoldRushProvider>
      {/* <div className="mt-8">
        <Footer />
      </div> */}
    </div>
    // </Suspense>
  )

}
