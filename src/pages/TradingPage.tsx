import { useState, useEffect, useCallback, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Wallet, Activity } from "lucide-react";
import TokenSwap from "@/components/trade/trade";
import { TokenIcon } from "@/components/common/TokenIcon";
import { GRK_SIZES } from "@/types/common";
import { useTranslation } from 'react-i18next';
import { useValueGood } from "@/stores/valueGood";
import { useLocalStorage } from "@/utils/LocalStorageManager";
import useWallet from "@/hooks/useWallet";
import { prettifyBalance, prettifyCurrencys, calculateFeePercentage } from '@/services/graphql/util';
import { useTokensBalance } from '@/services/graphql/account'; // 假设这是从 account 导出的 hook
import { useAccount } from 'wagmi';
import { timestampParser } from "@/utils/timestamp-parser";
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useMuneName } from "@/stores/menu";

// ============ 类型定义 ============
interface TokenItem {
  address: string;
  symbol: string;
  logo_url: string;
  price: string;
  balance: string;
  h24: number;
  isvaluegood?: boolean;
  valueSymbol?: string;
}

interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  time: number;
  fromgoodQuanity: string;
  togoodQuantity?: string;
  symbol1: string;
  symbol2?: string;
}

interface TradingData {
  tokens: TokenItem[] | null;
  transactions: Transaction[] | null;
  isLoading: boolean;
  error: string | null;
}

// ============ 常量 ============
const EMPTY_TRADING_DATA: TradingData = {
  tokens: null,
  transactions: null,
  isLoading: false,
  error: null,
};

export default function TradingPage() {
  const { t } = useTranslation();
  const { isConnected, address } = useAccount();
  const { info } = useValueGood();
  const { ssionChian } = useLocalStorage();
  const { tokenBalance } = useWallet();
  const { setName } = useMuneName();

  // ============ State ============
  const [tradingData, setTradingData] = useState<TradingData>(EMPTY_TRADING_DATA);
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);
  const mountedRef = useRef(true);

  // ============ 生命周期 ============
  useEffect(() => {
    setName('trade');
  }, [setName]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // ============ 数据获取 ============
  const fetchTradingData = useCallback(async () => {
    if (!info?.id || !address) return;

    setIsLoadingTokens(true);
    setTradingData(prev => ({ ...prev, error: null }));

    try {
      // 1. 获取基础交易数据
      const balance: any = await useTokensBalance({
        id: info.id,
        wallet: address
      }, ssionChian);

      if (!mountedRef.current) return;

      // 2. 并行获取所有代币余额（带错误处理）
      const tokensWithBalance = await Promise.allSettled(
        (balance.tokens || []).map(async (item: any): Promise<TokenItem> => {
          try {
            const tokenBalanceValue = await tokenBalance(item);
            return {
              ...item,
              price: prettifyCurrencys(item.price),
              balance: tokenBalanceValue,
            };
          } catch (error) {
            console.error(`获取 ${item.symbol} 余额失败:`, error);
            return {
              ...item,
              price: prettifyCurrencys(item.price),
              balance: "0", // 失败时默认为 0
            };
          }
        })
      );

      if (!mountedRef.current) return;

      // 3. 提取成功的结果并过滤
      const successfulTokens = tokensWithBalance
        .filter((result): result is PromiseFulfilledResult<TokenItem> =>
          result.status === 'fulfilled'
        )
        .map(result => result.value)
        .filter(token => {
          // 正确的数字比较
          const balanceNum = parseFloat(token.balance);
          return !isNaN(balanceNum) && balanceNum > 0;
        });

      // 4. 更新状态
      setTradingData({
        tokens: successfulTokens,
        transactions: balance.transactions || [],
        isLoading: false,
        error: tokensWithBalance.some(r => r.status === 'rejected')
          ? '部分代币余额获取失败'
          : null,
      });

    } catch (error) {
      console.error("获取交易数据失败:", error);
      if (mountedRef.current) {
        setTradingData({
          tokens: null,
          transactions: null,
          isLoading: false,
          error: '获取数据失败，请检查网络连接',
        });
      }
    } finally {
      if (mountedRef.current) {
        setIsLoadingTokens(false);
      }
    }
  }, [info?.id, address, ssionChian, tokenBalance]);

  useEffect(() => {
    fetchTradingData();
  }, [fetchTradingData]);

  // ============ 渲染辅助函数 ============
  const renderTokenList = () => {
    if (isLoadingTokens && !tradingData.tokens) {
      return (
        <div className="flex justify-center py-8">
          <Spin indicator={<LoadingOutlined spin />} tip="Loading tokens..." />
        </div>
      );
    }

    if (!tradingData.tokens?.length) {
      return (
        <div className="text-center text-muted-foreground py-8">
          {tradingData.error || t("common.noData")}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {tradingData.tokens.map((token) => (
          <div key={token.symbol} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
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
              <div className="font-medium">
                {prettifyBalance(parseFloat(token.balance))}
              </div>
              <div className={`text-xs ${token.h24 > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                {calculateFeePercentage(token.h24)}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTransactionList = () => {
    if (!tradingData.transactions?.length) {
      return (
        <div className="text-center text-muted-foreground py-8">
          {t("common.noData")}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {tradingData.transactions.map((trade) => (
          <div
            key={trade.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${trade.type === 'buy' ? 'bg-green-500' : 'bg-red-500'
                }`} />
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
                  {prettifyCurrencys(parseFloat(trade.fromgoodQuanity))} {trade.symbol1}
                {trade.symbol2 && (
                  <> → {prettifyCurrencys(parseFloat(trade.togoodQuantity ?? '0'))} {trade.symbol2}</>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // ============ 主渲染 ============
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
                <TokenSwap params={{ defaultTab: "swap" }} />
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
                  {renderTokenList()}
                  {isLoadingTokens && tradingData.tokens && (
                    <div className="flex justify-center mt-4">
                      <Spin indicator={<LoadingOutlined spin />} />
                    </div>
                  )}
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
                  {renderTransactionList()}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}