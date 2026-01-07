import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Shield, Zap, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
// import { useValueGood } from "@/stores/valueGood";
// import { useLocalStorage } from "@/utils/LocalStorageManager";
import { prettifyCurrencys, formatLargeNumber } from '@/services/graphql/util';
// import { AggregateIndex } from '@/services/graphql/overview';
import { useMuneName } from "@/stores/menu";

interface HeroSection {
  trdeV: number;
  invertV: number;
  users: number;
  Tokens: number;
  vSymbol: string;
}

const index = { trdeV: 0, invertV: 0, users: 0, Tokens: 0, vSymbol: "" }
export function HeroSection(data: any) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setName } = useMuneName();
  // const { info } = useValueGood();
  // const { ssionChian } = useLocalStorage();
  const [marketData, setmarketData] = useState<HeroSection>(index);

  useEffect(() => {
    // console.log("333333333",data);
    setmarketData(data.data);
    // (async () => {
    //   try {
    //     let a: any = await AggregateIndex(info.id, ssionChian);
    //     // console.log("333333333",a);
    //     setmarketData?(a);
    //   } catch (error) {
    //     setmarketData?(index);
    //   }
    // })()
  }, [data]);

  const features = [
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: t("home.HeroSection.features1.title"),
      description: t("home.HeroSection.features1.description"),
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: t("home.HeroSection.features2.title"),
      description: t("home.HeroSection.features2.description"),
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: t("home.HeroSection.features3.title"),
      description: t("home.HeroSection.features3.description"),
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: t("home.HeroSection.features4.title"),
      description: t("home.HeroSection.features4.description"),
    },
  ];

  const handleClick = (a: string) => {
    navigate('/' + a);
  };

  return (
    <div className="mb-8">
      {/* 主要Hero区域 */}
      <Card className="bg-gradient-to-br from-[#0fb981]/5 via-white to-[#22c55e]/5 border-[#0fb981]/20 mb-6 hover-lift transition-all duration-300 animate-slide-in-up">
        <CardContent className="p-6 sm:p-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl mb-4 bg-gradient-to-r from-[#0fb981] to-[#22c55e] bg-clip-text text-transparent animate-slide-in-left">
              {t("home.HeroSection.title")}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-slide-in-right">
              {t("home.HeroSection.description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-slide-in-up">
              <Button
                size="lg"
                className="h-12 px-8 bg-[#0fb981] hover:bg-[#22c55e] text-white border-0 shadow-lg btn-modern hover-glow transition-all duration-300"
                onClick={() => { setName("trade"); handleClick('trade') }}
              >
                {t("home.HeroSection.button1")}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 border-[#0fb981] text-[#0fb981] hover:bg-[#0fb981] hover:text-white hover-lift transition-all duration-300"
                onClick={() => { setName("publicSale"); handleClick('publicSale') }}
              >
                {t("home.HeroSection.button2")}
              </Button>
            </div>

            {/* 统计数据 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="stagger-item">
                <div className="text-2xl sm:text-3xl text-[#0fb981] mb-1 transition-transform duration-200 hover:scale-110">
                  {prettifyCurrencys(marketData?.trdeV)}{" "}{marketData?.vSymbol}
                </div>
                <div className="text-sm text-gray-500">
                  {t("home.HeroSection.volume")}
                </div>
              </div>
              <div className="stagger-item">
                <div className="text-2xl sm:text-3xl text-[#0fb981] mb-1 transition-transform duration-200 hover:scale-110">
                  {prettifyCurrencys(marketData?.invertV)}{" "}{marketData?.vSymbol}
                </div>
                <div className="text-sm text-gray-500">
                  {t("home.HeroSection.liquidity")}
                </div>
              </div>
              <div className="stagger-item">
                <div className="text-2xl sm:text-3xl text-[#0fb981] mb-1 transition-transform duration-200 hover:scale-110">
                  {formatLargeNumber(marketData?.users, 0)}
                </div>
                <div className="text-sm text-gray-500">
                  {t("home.HeroSection.user")}
                </div>
              </div>
              <div className="stagger-item">
                <div className="text-2xl sm:text-3xl text-[#0fb981] mb-1 transition-transform duration-200 hover:scale-110">
                  {formatLargeNumber(marketData?.Tokens, 0)}
                </div>
                <div className="text-sm text-gray-500">
                  {t("home.HeroSection.tokens")}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 特性展示 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="stagger-item hover:shadow-md hover-lift transition-all duration-300"
          >
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-[#0fb981]/10 rounded-lg flex items-center justify-center mx-auto mb-3 text-[#0fb981] transition-transform duration-200 hover:scale-110">
                {feature.icon}
              </div>
              <h3 className="text-base mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
