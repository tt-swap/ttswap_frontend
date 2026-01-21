import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

// 使用新的工具函数和常量
// import { formatCurrency } from "../../utils/format";
// import { COLORS } from "../../utils/constants";
// import type { PortfolioOverview as PortfolioOverviewData } from "@/types";
import { useValueGood } from "@/stores/valueGood";
import { useLocalStorage } from "@/utils/LocalStorageManager";
import { useTranslation } from 'react-i18next';
// import { myIndexes } from '@/services/graphql/account';
import { prettifyCurrencys } from '@/services/graphql/util';
import { TokenAvatar } from "../common/TokenAvatar";
// import { TokenIcon } from "../common/TokenIcon";
import { GRK_SIZES } from "@/types/common";
// import { getChainName } from '@/data/networks';
import { useValueCionLogo } from "@/hooks/useValueCionLogo";
// import { useAccount } from 'wagmi';

interface PortfolioOverviewProps {
  datas?: items;
}

interface data {
  label: string,
  value: any,
  unit: any,
}
interface items {
  disinvestCount?: number;
  disinvestValue?: number;
  investCount?: number;
  investValue?: number;
  stakettsvalue?: number;
  getfromstake?: number;
  mining?: number;
  tradeCount?: number;
  tradeValue?: number;
  totalcommissionvalue?: number;
  totalprofitvalue?: number;
  isEmpty?: boolean;
}
export function PortfolioOverview({
  datas,
}: PortfolioOverviewProps) {

  const { t } = useTranslation();
  const { info } = useValueGood();
  const { ssionChian } = useLocalStorage();
  // const { isConnected, address } = useAccount();
  const [tokenLogo, setTokenLogo] = useState<string | undefined>(
    useValueCionLogo(info)
  );
  const [maybeResult, setResult] = useState<data[]>([]);

  useEffect(() => {
    setTokenLogo(useValueCionLogo(info));
    console.log("info.symbol", useValueCionLogo(info));
  }, [info.symbol]);

  useEffect(() => {
    console.log("#########datas-----", datas);
    // (async () => {
    //   if (ssionChian && address && info.id) {
        const result = datas//await myIndexes(info.id, address, ssionChian);
        let a: data[] = [
          {
            label: t('account.index.tradeamount'),
            value: prettifyCurrencys(result?.tradeValue),
            unit: info.symbol,
          },
          {
            label: t('account.index.investamount'),
            value: prettifyCurrencys(result?.investValue),
            unit: info.symbol,
          },
          {
            label: t('account.index.divestamount'),
            value: prettifyCurrencys(result?.disinvestValue),
            unit: info.symbol,
          },
          {
            label: t('account.index.miningvalue'),
            value: prettifyCurrencys(result?.stakettsvalue),
            unit: info.symbol,
          },
          {
            label: t('account.index.profitamount'),
            value: prettifyCurrencys(result?.totalprofitvalue),
            unit: info.symbol,
          },
          {
            label: t('account.index.commissionamount'),
            value: prettifyCurrencys(result?.totalcommissionvalue),
            unit: info.symbol,
          },
          {
            label: t('account.index.mintedtts'),
            value: prettifyCurrencys(result?.getfromstake),
            unit: "TTS",
          },
          {
            label: t('account.index.mining'),
            value: prettifyCurrencys(result?.mining),
            unit: "TTS",
          },
        ]
        setResult(a);
    //   }
    // })();
  }, [datas]);


  // 判断是否为USDT相关项目
  const isUSDTItem = (unit: string) => {
    return unit === info.symbol;
  };

  return (
    <Card className="mb-6 hover-lift transition-all duration-300 animate-slide-in-up">
      <CardContent className="p-4 sm:p-6">
        {/* 合并所有指标为统一网格 */}
        <div className="stats-grid-mobile">
          {maybeResult?.map((item, index) => (
            <div key={index} className="stats-item-mobile text-left stagger-item hover-scale transition-all duration-300">
              <div className="font-medium text-base sm:text-[1.512rem] mb-1 flex items-center gap-1 sm:gap-2 flex-wrap">
                <span className="break-all transition-colors duration-200 hover:text-[#0fb981]">{item.value}</span>
                {isUSDTItem(item.unit) ? (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-white font-medium text-xs sm:text-sm bg-[#26a17b]">
                    <TokenAvatar
                      token_url={tokenLogo}
                      size={GRK_SIZES.SMALL}
                    />
                  </div>
                ) : (
                  <span className="text-xs sm:text-base text-gray-600">{item.unit}</span>
                )}
              </div>
              <div className="text-xs sm:text-[11.6px] text-gray-400 leading-tight">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
