import { useState, useEffect, useCallback, useRef } from "react";
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
import { throttle } from 'lodash';

import { formatCurrency, formatPercentage } from "@/utils/format";
import { investGoodsDatas } from '@/services/graphql/overview';
import { prettifyCurrencysFee } from '@/services/graphql/util';
import { type TokenV2Volume } from "@/types/XykServiceTypes";
import { TokenIcon } from "../common/TokenIcon";
import { GRK_SIZES } from "@/types/common";

interface TokenTableProps {
  onSwapClick?: (token: TokenV2Volume) => void;
  onInvestClick?: (token: TokenV2Volume) => void;
  onFreezeClick?: (token: TokenV2Volume) => void;
  onTokenClick?: (token: string) => void;
  onUpdateClick?: (token: TokenV2Volume) => void;
  showUpdateButton?: boolean;
  valueId?: string;
  chainId?: number;
  wallet_address?: string;
}

const PAGE_SIZE = 50;
const SCROLL_THRESHOLD = 200; // 距离底部多少像素时触发加载
const THROTTLE_DELAY = 200; // 节流延迟毫秒数

export function TokenTable({
  onSwapClick,
  onInvestClick,
  onTokenClick,
  onUpdateClick,
  showUpdateButton = true,
  chainId,
  valueId,
  wallet_address,
}: TokenTableProps) {
  const { t } = useTranslation();

  // 状态管理
  const [spinning, setSpinning] = useState(false);
  const [pagination, setPagination] = useState({ page_number: 1 });
  const [hasMore, setHasMore] = useState(false);
  const [tokens, setTokens] = useState<TokenV2Volume[]>([]);
  const [error, setError] = useState<{ error: boolean; error_message: string }>({
    error: false,
    error_message: "",
  });

  // Refs - 用于避免闭包陷阱和竞态条件
  const loadingRef = useRef(false);
  const cancelledRef = useRef(false);
  const hasMoreRef = useRef(hasMore);
  const spinningRef = useRef(spinning);

  // 同步 ref 值
  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  useEffect(() => {
    spinningRef.current = spinning;
  }, [spinning]);

  // 重置分页当关键参数改变
  useEffect(() => {
    setPagination({ page_number: 1 });
    setTokens([]);
    setHasMore(false);
    setError({ error: false, error_message: "" });
  }, [chainId, valueId, wallet_address]);

  // 数据加载
  useEffect(() => {
    cancelledRef.current = false;
    loadingRef.current = true;

    const fetchData = async () => {
      setSpinning(true);
      setError({ error: false, error_message: "" });

      try {
        const response: any = await investGoodsDatas({
          id: valueId || '',
          pageNumber: pagination.page_number - 1,
          pageSize: PAGE_SIZE,
          address: wallet_address || '0',
        }, chainId);

        if (!cancelledRef.current) {
          setHasMore(response.pagination.has_more);

          if (pagination.page_number === 1) {
            setTokens(response.items);
          } else {
            setTokens(prev => [...prev, ...response.items]);
          }
        }
      } catch (exception) {
        if (!cancelledRef.current) {
          const errorMessage = exception instanceof Error
            ? exception.message
            : "Failed to load token data";

          setError({
            error: true,
            error_message: errorMessage,
          });
        }
      } finally {
        if (!cancelledRef.current) {
          setSpinning(false);
          loadingRef.current = false;
        }
      }
    };

    fetchData();

    return () => {
      cancelledRef.current = true;
    };
  }, [chainId, pagination.page_number, valueId, wallet_address]);

  // 滚动加载 - 优化版
  useEffect(() => {
    const handleScroll = throttle(() => {
      const scrollBottom = window.innerHeight + window.scrollY;
      const documentHeight = document.documentElement.offsetHeight;

      // 检查是否到达底部，且有更多数据，且没有正在加载
      if (
        scrollBottom >= documentHeight - SCROLL_THRESHOLD &&
        hasMoreRef.current &&
        !loadingRef.current &&
        !spinningRef.current
      ) {
        setPagination(prev => ({
          page_number: prev.page_number + 1,
        }));
      }
    }, THROTTLE_DELAY, { leading: true, trailing: true });

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      handleScroll.cancel();
    };
  }, []); // 空依赖数组，使用 ref 获取最新值

  // 格式化百分比并返回样式信息 - 使用 useMemo 缓存
  const getPercentageDisplay = useCallback((value: number) => {
    const color = value >= 0 ? "text-[#0fb981]" : "text-red-500";
    const text = formatPercentage(value, 2, true);
    return { color, text };
  }, []);

  // 按钮点击处理 - 阻止事件冒泡的工厂函数
  const createClickHandler = useCallback(
    (handler?: (token: TokenV2Volume) => void, token?: TokenV2Volume) =>
      (e: React.MouseEvent) => {
        e.stopPropagation();
        if (handler && token) {
          handler(token);
        }
      },
    []
  );

  // 渲染桌面端按钮组
  const renderDesktopActions = useCallback(
    (item: TokenV2Volume) => (
      <div className="flex gap-2 justify-center">
        <Button
          size="sm"
          className="token-action-btn h-[1.66rem] px-3 text-xs bg-[#0fb981] hover:bg-[#22c55e] text-white border-0 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md"
          onClick={createClickHandler(onSwapClick, item)}
        >
          {t("trade.quick")}
        </Button>
        {showUpdateButton && (
          <Button
            size="sm"
            className="token-action-btn h-[1.66rem] px-3 text-xs bg-[#0fb981] hover:bg-[#22c55e] text-white border-0 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md"
            onClick={createClickHandler(onUpdateClick, item)}
          >
            {t("common.update")}
          </Button>
        )}
      </div>
    ),
    [onSwapClick, onUpdateClick, showUpdateButton, t, createClickHandler]
  );

  // 渲染移动端按钮组
  const renderMobileActions = useCallback(
    (item: TokenV2Volume) => (
      <div className="flex flex-row gap-1.5 sm:gap-2">
        <Button
          size="sm"
          className="mobile-action-btn flex-1 h-8 px-2 sm:px-3 text-xs bg-[#0fb981] hover:bg-[#22c55e] text-white border-0 shadow-sm btn-modern hover-glow transition-all duration-200"
          onClick={createClickHandler(onSwapClick, item)}
        >
          {t("common.swap")}
        </Button>
        <Button
          size="sm"
          className="mobile-action-btn flex-1 h-8 px-2 sm:px-3 text-xs bg-[#0fb981] hover:bg-[#22c55e] text-white border-0 shadow-sm btn-modern hover-glow transition-all duration-200"
          onClick={createClickHandler(onInvestClick, item)}
        >
          {t("common.invest")}
        </Button>
        {showUpdateButton && (
          <Button
            size="sm"
            className="mobile-action-btn flex-1 h-8 px-2 sm:px-3 text-xs bg-[#0fb981] hover:bg-[#22c55e] text-white border-0 shadow-sm btn-modern hover-glow transition-all duration-200"
            onClick={createClickHandler(onUpdateClick, item)}
          >
            {t("common.update")}
          </Button>
        )}
      </div>
    ),
    [onSwapClick, onInvestClick, onUpdateClick, showUpdateButton, t, createClickHandler]
  );

  // 渲染移动端数据网格
  const renderMobileDataGrid = useCallback(
    (item: TokenV2Volume) => {
      const percentageDisplay = getPercentageDisplay(item.priceC_24h);

      return (
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
          <div className="hover-scale transition-all duration-200">
            <div className="text-xs text-muted-foreground mb-1">{t("table.tokens.price")}</div>
            <div className="font-medium text-sm transition-colors duration-200 hover:text-[#0fb981]">
              {formatCurrency(item.price)}
            </div>
          </div>
          <div className="hover-scale transition-all duration-200">
            <div className="text-xs text-muted-foreground mb-1">{t("table.tokens.change24h")}</div>
            <div className={`font-medium text-sm transition-all duration-200 ${percentageDisplay.color}`}>
              {percentageDisplay.text}
            </div>
          </div>
          <div className="hover-scale transition-all duration-200">
            <div className="text-xs text-muted-foreground mb-1">{t("table.tokens.navps")}</div>
            <div className="font-medium text-sm transition-colors duration-200 hover:text-[#0fb981]">
              {prettifyCurrencysFee(item.NAVPS)}
            </div>
          </div>
          <div className="hover-scale transition-all duration-200">
            <div className="text-xs text-muted-foreground mb-1">{t("table.tokens.apy")}</div>
            <div className="font-medium text-sm text-[#0fb981] transition-transform duration-200 hover:scale-105">
              {formatPercentage(item.apy, 2)}
            </div>
          </div>
          <div className="col-span-2 hover-scale transition-all duration-200">
            <div className="text-xs text-muted-foreground mb-1">{t("table.tokens.amount")}</div>
            <div className="font-medium transition-colors duration-200 hover:text-[#0fb981]">
              {formatCurrency(item.currentValue)}
            </div>
          </div>
        </div>
      );
    },
    [getPercentageDisplay, t]
  );

  // 错误状态展示
  if (error.error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-2">{t("common.error")}</p>
        <p className="text-sm text-muted-foreground">{error.error_message}</p>
      </div>
    );
  }

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
                <TableHead className="text-center w-[200px] h-[34px] px-2 py-[5.5px]">
                  {t("table.tokens.name")}
                </TableHead>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("table.tokens.price.tip")}</span>}>
                <TableHead className="text-right h-[34px] px-2 py-[5.5px]">
                  {t("table.tokens.price")}
                </TableHead>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("table.tokens.change24h.tip")}</span>}>
                <TableHead className="text-right h-[34px] px-2 py-[5.5px]">
                  {t("table.tokens.change24h")}
                </TableHead>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("table.tokens.navps.tip")}</span>}>
                <TableHead className="text-right h-[34px] px-2 py-[5.5px]">
                  {t("table.tokens.navps")}
                </TableHead>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("table.tokens.apy.tip")}</span>}>
                <TableHead className="text-right h-[34px] px-2 py-[5.5px]">
                  {t("table.tokens.apy")}
                </TableHead>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("table.tokens.amount.tip")}</span>}>
                <TableHead className="text-right h-[34px] px-2 py-[5.5px]">
                  {t("table.tokens.amount")}
                </TableHead>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("table.tokens.actions.tip")}</span>}>
                <TableHead className="text-center w-[120px] h-[34px] px-2 py-[5.5px]">
                  {t("common.actions")}
                </TableHead>
              </Tooltip>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tokens.map((item, index) => {
              const percentageDisplay = getPercentageDisplay(item.priceC_24h);

              return (
                <TableRow
                  key={item.id}
                  className="hover:bg-muted/30 transition-all duration-300 cursor-pointer hover:shadow-sm stagger-item"
                  onClick={() => onTokenClick?.(item.id)}
                >
                  <TableCell className="text-center align-middle px-2 py-[5.5px]">
                    <div className="font-medium transition-colors duration-200 hover:text-[#0fb981]">
                      {index + 1}
                    </div>
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
                    <span className={`transition-all duration-200 ${percentageDisplay.color}`}>
                      {percentageDisplay.text}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium px-2 py-[5.5px] transition-colors duration-200 hover:text-[#0fb981]">
                    {prettifyCurrencysFee(item.NAVPS)}
                  </TableCell>
                  <TableCell className="text-right font-medium px-2 py-[5.5px]">
                    <span className="text-[#0fb981] transition-transform duration-200 hover:scale-105 inline-block">
                      {formatPercentage(item.apy, 2)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium px-2 py-[5.5px] transition-colors duration-200 hover:text-[#0fb981]">
                    {formatCurrency(item.currentValue)}
                  </TableCell>
                  <TableCell className="text-center align-middle px-2 py-[5.5px]">
                    {renderDesktopActions(item)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* 移动端卡片布局 */}
      <div className="sm:hidden space-y-3">
        {tokens.map((item) => (
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
                  <div className="font-medium text-lg transition-colors duration-200 hover:text-[#0fb981]">
                    {item.symbol}
                  </div>
                  <div className="text-sm text-muted-foreground">{item.name}</div>
                </div>
              </div>
              {renderMobileActions(item)}
            </div>

            {/* 底部：数据网格 */}
            {renderMobileDataGrid(item)}
          </Card>
        ))}
      </div>

      {/* 加载指示器 */}
      <div className="flex justify-center py-4">
        <Spin
          spinning={spinning}
          indicator={<LoadingOutlined spin />}
          tip="Loading"
        >
          <div />
        </Spin>
      </div>

      {/* 空状态 */}
      {!spinning && tokens.length === 0 && !error.error && (
        <div>
          <div className="hidden sm:block text-center py-12 text-gray-400 text-sm border rounded-lg">
            {t("common.noData")}
          </div>
          <div className="sm:hidden text-center py-12 text-gray-400 text-sm">
            {t("common.noData")}
          </div>
        </div>
      )}

      {/* 全部加载完毕提示 */}
      {/* {!hasMore && tokens.length > 0 && !spinning && (
        <div className="text-center py-4 text-sm text-muted-foreground">
          {t("common.noMoreData")}
        </div>
      )} */}
    </div>
  );
}