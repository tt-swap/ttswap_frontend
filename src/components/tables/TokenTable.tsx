import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from 'react-i18next';
import { Spin, Tooltip } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

// 使用新的工具函数和常量
import { formatCurrency, formatPercentage } from "@/utils/format";
// import { VALUE_TOKENS } from "@/utils/constants";
// import type { Token } from "@/types";
import { investGoodsDatas } from '@/services/graphql/overview';
import { prettifyCurrencys, prettifyCurrencysFee } from '@/services/graphql/util';
import { useValueGood } from "@/stores/valueGood";
import { useLocalStorage } from "@/utils/LocalStorageManager";
// import { type Option, None, Some } from "@/utils/option";
import { type TokenV2Volume } from "@/types/XykServiceTypes";
import { TokenIcon } from "../common/TokenIcon";
import { GRK_SIZES } from "@/types/common";

interface TokenTableProps {
  // data: TokenV2Volume[];
  onSwapClick?: (token: TokenV2Volume) => void;
  onInvestClick?: (token: TokenV2Volume) => void;
  onFreezeClick?: (token: TokenV2Volume) => void;
  onTokenClick?: (token: string) => void;
  onUpdateClick?: (token: TokenV2Volume) => void;
  showUpdateButton?: boolean; // 控制是否显示更新按钮，默认为 true
  valueId?: string;
  chainId?: number;
  wallet_address?: string;
}

export function TokenTable({
  // data,
  onSwapClick,
  onInvestClick,
  onTokenClick,
  onUpdateClick,
  onFreezeClick,
  showUpdateButton = true, // 默认显示更新按钮
  chainId, valueId,
  wallet_address,
}: TokenTableProps) {
  // 暂时使用默认翻译，等待重启开发服务器后启用 i18n
  // const t = useTranslation();
  const { t } = useTranslation();

  const [spinning, setSpinning] = useState(false);
  const [pagination, setPagination] = useState({
    page_number: 1,
  });
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [maybeResult, setResult] = useState<TokenV2Volume[]>([]);
  const [error, setError] = useState({ error: false, error_message: "" });
  const { info } = useValueGood();
  const { ssionChian } = useLocalStorage();
  const page_size = 20;


  const handlePagination = (page_number: number) => {
    setPagination((prev) => {
      return {
        ...prev,
        page_number,
      };
    });
  };

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight) {
      if (hasMore) {
        handlePagination(pagination.page_number + 1);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasMore, pagination]);
  // console.log("pafas:", pagination,hasMore)
  useEffect(() => {
    (async () => {
      setSpinning(true);
      // setResult(None);
      let response: any;
      try {
        response =
          await investGoodsDatas({
            id: valueId,
            pageNumber: pagination.page_number - 1,
            pageSize: page_size,
            address: wallet_address,
          }, chainId);
        console.log(response, "***",wallet_address);
        setHasMore(response.pagination.has_more);
        setError({ error: false, error_message: "" });
        if (pagination.page_number === 1) {
          setResult(response.items);
        } else {
          setResult(prevItems => [...prevItems, ...response.items]);
        }
      } catch (exception) {
        setResult(null);
        setError({
          error: response ? response.error : false,
          error_message: response ? response.error_message : "",
        });
      }
      setSpinning(false);
    })();
  }, [chainId, pagination, valueId, wallet_address]);

  // 格式化百分比并返回样式信息
  const getPercentageDisplay = (value: number) => {
    const color = value >= 0 ? "text-[#0fb981]" : "text-red-500";
    const text = formatPercentage(value, 2, true);
    return { color, text };
  };

  return (
    <div className="animate-fade-in">
      {/* 桌面端表格 */}
      <div className="hidden sm:block rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <Tooltip placement="top" title={<span>{t("table.tokens.id.tip")}</span>}>
                <TableHead className="text-center w-[60px] h-[34px] px-2 py-[5.5px]">
                  {t("table.tokens.id")}
                </TableHead>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("table.tokens.name.tip")}</span>}>
                <TableHead className="text-center w-[200px] h-[34px] px-2 py-[5.5px]">{t("table.tokens.name")}</TableHead>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("table.tokens.price.tip")}</span>}>
                <TableHead className="text-right h-[34px] px-2 py-[5.5px]">{t("table.tokens.price")}</TableHead>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("table.tokens.change24h.tip")}</span>}>
                <TableHead className="text-right h-[34px] px-2 py-[5.5px]">{t("table.tokens.change24h")}</TableHead>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("table.tokens.navps.tip")}</span>}>
                <TableHead className="text-right h-[34px] px-2 py-[5.5px]">{t("table.tokens.navps")}</TableHead>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("table.tokens.apy.tip")}</span>}>
                <TableHead className="text-right h-[34px] px-2 py-[5.5px]">{t("table.tokens.apy")}</TableHead>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("table.tokens.amount.tip")}</span>}>
                <TableHead className="text-right h-[34px] px-2 py-[5.5px]">{t("table.tokens.amount")}</TableHead>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("table.tokens.actions.tip")}</span>}>
                <TableHead className="text-center w-[120px] h-[34px] px-2 py-[5.5px]">{t("common.actions")}</TableHead>
              </Tooltip>
            </TableRow>
          </TableHeader>
          <TableBody>
            {maybeResult?.map((item, index) => (
              <TableRow
                key={item.id}
                className="hover:bg-muted/30 transition-all duration-300 cursor-pointer hover:shadow-sm stagger-item"
                onClick={() => onTokenClick?.(item.id)}
              >
                <TableCell className="text-center align-middle px-2 py-[5.5px]">
                  <div className="font-medium transition-colors duration-200 hover:text-[#0fb981]">{index + 1}</div>
                </TableCell>
                <TableCell className="text-left px-2 py-[5.5px]">
                  <div className="flex items-center gap-3">
                    <TokenIcon
                      isValueToken={item.isvaluegood}
                      icon={item.logo_url}
                      color=""
                      size={GRK_SIZES.EXTRA_SMALL}
                      showPulse={item.isvaluegood}
                    />
                    <div className="flex flex-col items-start gap-0.5 min-w-0">
                      <div className="font-medium text-black/80 transition-colors duration-200 hover:text-[#0fb981] truncate w-full">
                        {item.symbol}
                      </div>
                      <div className="text-gray-500 text-xs opacity-80 truncate w-full">
                        {item.name}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium px-2 py-[5.5px] transition-colors duration-200 hover:text-[#0fb981]">
                  {formatCurrency(item.price)}
                </TableCell>
                <TableCell className="text-right font-medium px-2 py-[5.5px]">
                  <span className={`transition-all duration-200 ${getPercentageDisplay(item.priceC_24h).color}`}>
                    {getPercentageDisplay(item.priceC_24h).text}
                  </span>
                </TableCell>
                <TableCell className="text-right font-medium px-2 py-[5.5px] transition-colors duration-200 hover:text-[#0fb981]">
                  {prettifyCurrencysFee(item.NAVPS)}
                </TableCell>
                <TableCell className="text-right font-medium px-2 py-[5.5px]">
                  <span className="text-[#0fb981] transition-transform duration-200 hover:scale-105 inline-block">{formatPercentage(item.apy, 2)}</span>
                </TableCell>
                <TableCell className="text-right font-medium px-2 py-[5.5px] transition-colors duration-200 hover:text-[#0fb981]">
                  {formatCurrency(item.currentValue)}
                </TableCell>
                <TableCell className="text-center align-middle px-2 py-[5.5px]">
                  <div className="flex gap-2 justify-center">
                    <Button
                      size="sm"
                      className="token-action-btn h-[1.66rem] px-3 text-xs bg-[#0fb981] hover:bg-[#22c55e] text-white border-0 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSwapClick?.(item);
                      }}
                    >
                      {t("trade.quick")}
                    </Button>

                    {/* <Button
                      size="sm"
                      className="token-action-btn h-[1.66rem] px-3 text-xs bg-[#0fb981] hover:bg-[#22c55e] text-white border-0 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        onInvestClick?.(item);
                      }}
                    >
                      {t("common.invest")}
                    </Button> */}

                    {showUpdateButton && (
                      <>
                      <Button
                        size="sm"
                        className="token-action-btn h-[1.66rem] px-3 text-xs bg-[#0fb981] hover:bg-[#22c55e] text-white border-0 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateClick?.(item);
                        }}
                      >
                        {t("common.update")}
                      </Button>
                      {/* <Button
                      size="sm"
                      className="token-action-btn h-[1.66rem] px-3 text-xs bg-[#0fb981] hover:bg-[#22c55e] text-white border-0 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        onFreezeClick?.(item);
                      }}
                    >
                      {t("common.freeze")}
                    </Button> */}
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 移动端卡片布局 */}
      <div className="sm:hidden space-y-3">
        {maybeResult?.map((item, index) => (
          <Card
            key={item.id}
            className="stagger-item p-4 hover:shadow-md hover-lift transition-all duration-300 cursor-pointer hover:border-[#0fb981]/30"
            onClick={() => onTokenClick?.(item.id)}
          >
            {/* 顶部：代币信息和操作按钮 */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <TokenIcon
                  isValueToken={item.isvaluegood}
                  icon={item.logo_url}
                  color=""
                  size={GRK_SIZES.SMALL}
                  showPulse={item.isvaluegood}
                />
                <div>
                  <div className="font-medium text-lg transition-colors duration-200 hover:text-[#0fb981]">{item.symbol}</div>
                  <div className="text-sm text-muted-foreground">{item.name}</div>
                  {/* <div className="text-xs text-muted-foreground">#{index + 1}</div> */}
                </div>
              </div>
              <div className="flex flex-row gap-1.5 sm:gap-2">
                <Button
                  size="sm"
                  className="mobile-action-btn flex-1 h-8 px-2 sm:px-3 text-xs bg-[#0fb981] hover:bg-[#22c55e] text-white border-0 shadow-sm btn-modern hover-glow transition-all duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSwapClick?.(item);
                  }}
                >
                  {t("common.swap")}
                </Button>
                <Button
                  size="sm"
                  className="mobile-action-btn flex-1 h-8 px-2 sm:px-3 text-xs bg-[#0fb981] hover:bg-[#22c55e] text-white border-0 shadow-sm btn-modern hover-glow transition-all duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    onInvestClick?.(item);
                  }}
                >
                  {t("common.invest")}
                </Button>
                {showUpdateButton && (
                  <Button
                    size="sm"
                    className="mobile-action-btn flex-1 h-8 px-2 sm:px-3 text-xs bg-[#0fb981] hover:bg-[#22c55e] text-white border-0 shadow-sm btn-modern hover-glow transition-all duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateClick?.(item);
                    }}
                  >
                    {t("common.update")}
                  </Button>
                )}
              </div>
            </div>

            {/* 底部：数据网格 */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
              <div className="hover-scale transition-all duration-200">
                <div className="text-xs text-muted-foreground mb-1">{t("table.tokens.price")}</div>
                <div className="font-medium text-sm transition-colors duration-200 hover:text-[#0fb981]">{formatCurrency(item.price)}</div>
              </div>
              <div className="hover-scale transition-all duration-200">
                <div className="text-xs text-muted-foreground mb-1">{t("table.tokens.change24h")}</div>
                <div className={`font-medium text-sm transition-all duration-200 ${getPercentageDisplay(item.priceC_24h).color}`}>
                  {getPercentageDisplay(item.priceC_24h).text}
                </div>
              </div>
              <div className="hover-scale transition-all duration-200">
                <div className="text-xs text-muted-foreground mb-1">{t("table.tokens.navps")}</div>
                <div className="font-medium text-sm transition-colors duration-200 hover:text-[#0fb981]">{prettifyCurrencysFee(item.NAVPS)}</div>
              </div>
              <div className="hover-scale transition-all duration-200">
                <div className="text-xs text-muted-foreground mb-1">{t("table.tokens.apy")}</div>
                <div className="font-medium text-sm text-[#0fb981] transition-transform duration-200 hover:scale-105">{formatPercentage(item.apy, 2)}</div>
              </div>
              <div className="col-span-2 hover-scale transition-all duration-200">
                <div className="text-xs text-muted-foreground mb-1">{t("table.tokens.amount")}</div>
                <div className="font-medium transition-colors duration-200 hover:text-[#0fb981]">{formatCurrency(item.currentValue)}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Spin
          spinning={spinning}
          indicator={<LoadingOutlined spin />}
          tip="Loading"
        // size="small"
        >
          <div />
        </Spin>
      </div>
      {/* 空状态 */}
      {maybeResult?.length === 0 && (
        <div>
          <div className="hidden sm:block text-center py-12 text-gray-400 text-sm border rounded-lg">
            {t("common.noData")}
          </div>
          <div className="sm:hidden text-center py-12 text-gray-400 text-sm">
            {t("common.noData")}
          </div>
        </div>
      )}
    </div>
  );
}
