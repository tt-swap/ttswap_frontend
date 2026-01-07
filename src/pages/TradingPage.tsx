import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Clock,
  Wallet,
  Activity,
} from "lucide-react";
import TokenSwap from "@/components/trade/trade";
import { TokenIcon } from "@/components/common/TokenIcon";
import { GRK_SIZES } from "@/types/common";
import { useTranslation } from 'react-i18next';
import { useValueGood } from "@/stores/valueGood";
import { useLocalStorage } from "@/utils/LocalStorageManager";
import useWallet from "@/hooks/useWallet";
import { prettifyBalance, prettifyCurrencys, calculateFeePercentage } from '@/services/graphql/util';
import { tokensBalance } from '@/services/graphql/account';
import { useAccount } from 'wagmi';
import { timestampParser } from "@/utils/timestamp-parser";
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useMuneName } from "@/stores/menu";

export default function TradingPage() {
  const { t } = useTranslation();

  const { isConnected, address } = useAccount();
  const { info } = useValueGood();
  const { ssionChian } = useLocalStorage();
  const { tokenBalance } = useWallet();

  const [tokensData, setTokensData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any>(null);
  const [spinning, setSpinning] = useState(false);
  const { name, setName } = useMuneName();
  useEffect(() => {
    setName('trade');
  }, []);

  useEffect(() => {
    (async () => {
      setSpinning(true);
      const balance: any = await tokensBalance({ id: info.id, wallet: address }, ssionChian);
      console.log("09--", balance);
      setTransactions(balance.transactions);
      let a = balance.tokens.map(async (item: any) => {

        item.price = prettifyCurrencys(item.price);

        const balance = await tokenBalance(item.address);
        item.balance = (balance);
        return item;
      });
      a = await Promise.all(a);
      console.log("09--00", a);
      a = a.filter((item: any) => item.balance > 0);
      setTokensData(a);
      setSpinning(false);
    })()
  }, [info.id, address, ssionChian]);

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* 页面头部 */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl">{t("trade.title")}</h1>
              <p className="text-muted-foreground">
                {t("trade.title.desc")}
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* 左侧：交易面板 */}
          <div className="lg:col-span-2">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-[#0fb981]" />
                  {t("trade.panel")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TokenSwap
                  params={{ defaultTab: "swap" }} />
              </CardContent>
            </Card>
          </div>

          {/* 右侧：信息面板 */}
          <div className="space-y-6">
            {/* 钱包余额 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-[#0fb981]" />
                  {t("trade.wallet.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
              <ScrollArea className="h-80">
              <div className="space-y-3">
                {tokensData?.map((token) => (
                  <div key={token.symbol} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {/* {renderTokenIcon(token)} */}
                      <TokenIcon
                        icon={token.logo_url}
                        color=""
                        size={GRK_SIZES.EXTRA_SMALL}
                        showPulse={token.isvaluegood}
                        isValueToken={token.isvaluegood}
                      />
                      <div>
                        <div className="font-medium">{token.symbol}</div>
                        <div className="text-xs text-muted-foreground">
                          {token.price}{" "}{token.valueSymbol}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{prettifyBalance(parseFloat(token.balance))}</div>
                      <div className={`text-xs ${token.h24 > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {calculateFeePercentage(token.h24)}
                      </div>
                    </div>
                  </div>
                ))}
                </div>
                <div className="flex justify-center">
                  <Spin
                    spinning={spinning}
                    indicator={<LoadingOutlined spin />}
                    tip="Loading"
                  >
                    <div />
                  </Spin>
                </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* 交易历史 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[#0fb981]" />
                  {t("trade.transactions.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {transactions?.map((trade) => (
                      <div
                        key={trade.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <div>
                            <div className="text-sm font-medium">
                              {trade.type === 'buy' ? t("common.swap") : t("common.invest")}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {timestampParser(trade.time, "relative")}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {prettifyCurrencys(trade.fromgoodQuanity)} {trade.symbol1}
                            {trade.symbol2 && ` → ${prettifyCurrencys(trade.togoodQuantity)} ${trade.symbol2}`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center">
                    <Spin
                      spinning={spinning}
                      indicator={<LoadingOutlined spin />}
                      tip="Loading"
                    >
                      <div />
                    </Spin>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* 市场统计 */}
            {/* <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#0fb981]" />
                  {t("trade.market.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">24h交易量</span>
                    <span className="font-medium">$2,845,692</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">总锁仓价值</span>
                    <span className="font-medium">$45,892,156</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">活跃用户</span>
                    <span className="font-medium">1,284</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">平均APY</span>
                    <span className="font-medium text-green-600">15.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>
    </div>
  );
}