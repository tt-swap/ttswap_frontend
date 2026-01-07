import { useEffect, useState } from "react";
import { TradingStatistics } from "@/components/business/TradingStatistics";
import { HeroSection } from "@/components/home/HeroSection";
import { MarketOverview } from "@/components/home/MarketOverview";
import { useTranslation } from 'react-i18next';
import { useValueGood } from "@/stores/valueGood";
import { useLocalStorage } from "@/utils/LocalStorageManager";
import { AggregateIndex } from '@/services/graphql/overview';

export default function Home() {
  const { t } = useTranslation();
  const { info } = useValueGood();
  const { ssionChian } = useLocalStorage();
  const [homeData, setHomeData] = useState<any>();
  
  useEffect(() => {
    if (info.id==="") return;
    (async () => {
      try {
        let a: any = await AggregateIndex(info.id, ssionChian);
        console.log("333333333",a);
        setHomeData(a);
      } catch (error) {
        setHomeData([]);
      }
    })()
  }, [info, ssionChian]);
  return (
    <div className="max-w-7xl mx-auto">
      <div>
        {/* 首页内容 */}
        <div className="animate-fade-in">
          {/* Hero区域 */}
          <HeroSection data={homeData?.hero}/>

          {/* 市场概览 */}
          <MarketOverview data={homeData?.over}/>

          {/* 交易统计概览 */}
          <div className="mb-4 animate-slide-in-left">
            <h2 className="mb-2">{t("home.chart.title")}</h2>
            <p className="text-muted-foreground text-sm">
              {t("home.chart.description")}
            </p>
          </div>
          <TradingStatistics data={homeData?.chart}/>
        </div>
      </div>
    </div>
  );
}