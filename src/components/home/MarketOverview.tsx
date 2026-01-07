import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, ChevronRight } from "lucide-react";

// 使用共享组件和工具函数
import { TokenIcon } from "../common/TokenIcon";
import { formatCurrency } from "@/utils/format";
import { GRK_SIZES } from "@/types/common";
// import { useValueGood } from "@/stores/valueGood";
// import { useLocalStorage } from "@/utils/LocalStorageManager";
import { prettifyCurrencys,calculateFeePercentage } from '@/services/graphql/util';
// import { GoodsSearchDatas } from '@/services/graphql/goods';
import { useTranslation } from 'react-i18next';
import { useMuneName } from "@/stores/menu";

interface TokenmarketData {
  id: string;
  name: string;
  decimals: number;
  symbol: string;
  price: any;
  logo_url: string;
  address: string;
  isvaluegood: boolean;
  valueSymbol: string;
  h24: number;
  trade24hValue: number;
}
export function MarketOverview(data: any) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setName } = useMuneName();
  // const { info } = useValueGood();
  // const { ssionChian } = useLocalStorage();
  const [marketData, setmarketData] = useState<TokenmarketData[]>([]);

  useEffect(() => {
    setmarketData(data.data);
    // (async () => {
    //     let a: any = await GoodsSearchDatas({
    //         id: info.id,
    //         sel: ""
    //     }, ssionChian);
    //     setmarketData?(a);
    // })()
}, [data]);
  const handleTokenClick = (a: string) => {
    navigate('/'+a);
  };

  return (
    <Card className="mb-6 hover-lift transition-all duration-300">
      <CardHeader className="pb-4 animate-slide-in-left">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{t("home.market.title")}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-[#0fb981] hover:text-[#22c55e] hover:bg-[#0fb981]/10 hover-lift transition-all duration-300"
            onClick={()=>{setName('tokens');handleTokenClick('tokens')}}
          >
            {t("home.market.all")}
            <ChevronRight className="h-4 w-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" />
          </Button>
        </div>
        <p className="text-sm text-gray-600">{t("home.market.description")}</p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-0">
          {marketData?.map((token, index) => (
            <div
              key={token.symbol}
              className="stagger-item p-4 border-b lg:border-b-0 lg:border-r border-gray-100 last:border-b-0 lg:last:border-r-0 hover:bg-gray-50/50 hover-scale transition-all duration-300 cursor-pointer group"
              onClick={() => handleTokenClick('tokens/'+token.address)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TokenIcon
                    isValueToken={token.isvaluegood}
                    icon={token.logo_url}
                    color=''
                    size={GRK_SIZES.SMALL}
                    showPulse={token.isvaluegood}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base transition-colors duration-200 group-hover:text-[#0fb981]">{token.symbol}</span>
                      <div className={`flex items-center gap-1 text-xs transition-all duration-200 ${token.h24 >= 0 ? 'text-[#0fb981]' : 'text-red-500'
                        }`}>
                        {token.h24 >= 0 ? (
                          <TrendingUp className="h-3 w-3 transition-transform duration-200 group-hover:scale-110" />
                        ) : (
                          <TrendingDown className="h-3 w-3 transition-transform duration-200 group-hover:scale-110" />
                        )}
                        {calculateFeePercentage(token.h24)}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 transition-colors duration-200 group-hover:text-gray-700">{token.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base transition-colors duration-200 group-hover:text-[#0fb981]">
                    {formatCurrency(parseFloat(token.price))}
                  </div>
                  <div className="text-xs text-gray-500 transition-colors duration-200 group-hover:text-gray-700">24h: {prettifyCurrencys(token.trade24hValue)}{" "}{token.valueSymbol}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
