import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  Copy,
  Globe,
  TrendingUp, TrendingDown
} from "lucide-react";
import { ShareAltOutlined, XOutlined, DiscordOutlined, FacebookOutlined, GithubOutlined, LinkOutlined, FilePdfOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { Tooltip } from 'antd';
import { TransactionRecords } from "../tables/TransactionRecords";
// import { toast } from "sonner";
import * as echarts from "echarts";
import { useEffect, useRef, useState } from "react";
import TokenSwap from "@/components/trade/trade";
import { useValueGood } from "@/stores/valueGood";
import { useLocalStorage } from "@/utils/LocalStorageManager";
import { prettifyCurrencys, calculateFeePercentage, prettifyCurrencysFee, complete24HourData } from '@/services/graphql/util';
import { getLpTokenView, GoodKLineData } from '@/services/graphql/goods';
import { TokenAvatar } from "../common/TokenAvatar";
import { TokenIcon } from "../common/TokenIcon";
import { GRK_SIZES } from "@/types/common";
import { getChainName } from '@/data/networks';
import { useValueCionLogo } from "@/hooks/useValueCionLogo";

interface TokenProfileData {
  id: string;
  name: string;
  decimals: number;
  symbol: string;
  vlogo_url: string;
  logo_url: string;
  exp_url: string;
  tokenInfo: string;
  address: string;
  valueSymbol: string;

  price: number;
  NAVPS: number;
  APY: number;
  price_24h: number;

  currentQuantity: number;
  currentValue: number;
  investQuantity: number;
  investValue: number;
  currentFee: number;
  currentFeeValue: number;

  tradeQuantity24: number;
  tradeValue24: number;
  fee24: number;
  feeValue24: number;
  investQuantity24: number;
  investValue24: number;

  totalInvestQuantity: number;
  totalInvestValue: number;
  totalTradeQuantity: number;
  totalTradeValue: number;
  totalDisinvestQuantity: number;
  totalDisinvestValue: number;

  totalTradeCount: number;
  totalInvestCount: number;
  owner: string;
  isvaluegood: boolean;

  buyFee: number;
  sellFee: number;
  investFee: number;
  divestFee: number;
  swapChips: number;
  divestChips: number

  investor: number;
  operator: number;
  portal: number;
  referrer: number;
  user: number;
  protocol: number;
  maxLiquidity: number;
}

interface TokenProfileProps {
  handleBack: () => void;
  tokenId: string;
}



let map = {
  id: "", name: "", decimals: 0, symbol: "", logo_url: "", vlogo_url: "", exp_url: "", address: "", valueSymbol: "",
  price: 0, NAVPS: 0, APY: 0, price_24h: 0, tokenInfo: "",
  currentQuantity: 0, currentValue: 0, investQuantity: 0, investValue: 0, currentFee: 0, currentFeeValue: 0,
  tradeQuantity24: 0, tradeValue24: 0, fee24: 0, feeValue24: 0, investQuantity24: 0, investValue24: 0,
  totalInvestQuantity: 0, totalInvestValue: 0, totalTradeQuantity: 0, totalTradeValue: 0, totalDisinvestQuantity: 0, totalDisinvestValue: 0,
  totalTradeCount: 0, totalInvestCount: 0, owner: "", isvaluegood: false,
  buyFee: 0, sellFee: 0, investFee: 0, divestFee: 0, swapChips: 0, divestChips: 0,
  investor: 0, operator: 0, portal: 0, referrer: 0, user: 0, protocol: 0, maxLiquidity: 0,
};

export function TokenProfile({ handleBack, tokenId }: TokenProfileProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const { t } = useTranslation();
  const { info } = useValueGood();
  const { ssionChian } = useLocalStorage();
  const [isChartLoading, setIsChartLoading] = useState(true);

  const [tokenDataState, setTokenDataState] = useState<TokenProfileData>(map);
  const [jsonData, setJsonData] = useState<any>(null);
  const [chainName, setChainName] = useState<string | undefined>(
    getChainName(ssionChian)
  );
  const [tokenLogo, setTokenLogo] = useState<string | undefined>(
    useValueCionLogo(info)
  );
  const [h24KLineData, setH24KLineData] = useState<any>([]);

  useEffect(() => {
    setTokenLogo(useValueCionLogo(info));
    console.log("info.symbol", useValueCionLogo(info));
  }, [info.symbol]);

  useEffect(() => {
    setChainName(getChainName(ssionChian));
    (async () => {
      let response: any;
      try {
        response =
          await getLpTokenView(
            info.address,
            tokenId,
            ssionChian
          );
        setTokenDataState(response.items[0]);
        console.log("XYKTokenDetailView ", response.items[0]);
        const json = await (await fetch(response.items[0].tokenInfo)).json();
        setJsonData(json);
        console.log("json", json);
        // if (response.error) {
        //     throw error;
        // }
      } catch (exception) {
        console.error(exception);
      }
    })();
  }, [tokenId, info, ssionChian]);


  useEffect(() => {
    (async () => {
      try {
        const a: any = await GoodKLineData({ id: info.id, sel: tokenId }, ssionChian);
        console.log("GoodKLineData", a);
        //  const n = complete24HourData(a, 10);
        setH24KLineData(a)
        //  console.log("completeData", n);
      } catch (exception) {
        console.error(exception);
      }
    })();
  }, [tokenId, info, ssionChian]);

  const formatPercent = (value: number) => {
    return `${value}%`;
  };

  const tokenLinks = (data: any, class1: string, class2: string) => {
    let a: boolean = false;
    try {
      const l = data?.links;
      console.log("-----", l)
      if (l) {
        a = true
      }
    } catch (exception) {
      console.error(exception);
    }
    console.log("-77777-", a)
    return (
      <>
        <button
          onClick={() => handleViewInExplorer(tokenDataState?.exp_url)}
          className={`${class1} rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors group`}
          title={chainName}
        >
          <LinkOutlined className={`${class2} text-gray-600 group-hover:text-gray-800`} />
        </button>
        <button
          onClick={() => handleViewInExplorer(data?.website)}
          className={`${class1} rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors group`}
          title="website"
        >
          <Globe className={`${class2} text-gray-600 group-hover:text-gray-800`} />
        </button>
        {a ? data?.links.map((link: any, index: any) => (
          <>
            {link?.name == "x" ? (
              <button
                onClick={() => handleViewInExplorer(link?.url)}
                className={`${class1} rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors group`}
                title="x"
              >
                <XOutlined className={`${class2} text-gray-600 group-hover:text-gray-800`} />
              </button>
            ) : link?.name == "github" ? (
              <button
                onClick={() => handleViewInExplorer(link?.url)}
                className={`${class1} rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors group`}
                title="github"
              >
                <GithubOutlined className={`${class2} text-gray-600 group-hover:text-gray-800`} />
              </button>
            ) : link?.name == "whitepaper" ? (
              <button
                onClick={() => handleViewInExplorer(link?.url)}
                className={`${class1} rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors group`}
                title="whitepaper"
              >
                <FilePdfOutlined className={`${class2} text-gray-600 group-hover:text-gray-800`} />
              </button>
            ) : null}
          </>
        )) : null}
      </>
    )
  };

  // 超小尺寸USDT图标渲染函数 (73.5%大小 = 75% * 98%)
  const renderUsdtIconExtraSmall = () => {
    return (
      <span className="flex items-center gap-1">
        <div className="w-[14.7px] h-[14.7px] rounded-full flex items-center justify-center text-white font-medium text-[9.8px] bg-[#26a17b]">
          <TokenAvatar
            token_url={tokenLogo}
            size={GRK_SIZES.SMALL}
          />
        </div>
      </span>
    );
  };

  const handleViewInExplorer = (e: string | URL) => {
    window.open(e, '_blank');
  };

  const handleCopyAddress = async (e: string) => {
    try {
      // 尝试使用现代 Clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(e);
        // 可以添加成功提示
        console.log("地址已复制");
      } else {
        // Fallback 到传统方法
        fallbackCopyTextToClipboard(e);
      }
    } catch (err) {
      console.error("复制失败:", err);
      // 如果 Clipboard API 失败，尝试 fallback 方法
      fallbackCopyTextToClipboard(e);
    }
  };

  // Fallback 复制方法
  const fallbackCopyTextToClipboard = (text: string) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;

      // 避免在移动设备上显示键盘
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      textArea.setAttribute("readonly", "");

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (successful) {
        console.log("地址已复制 (fallback)");
      } else {
        console.error("复制失败，地址为:", text);
      }
    } catch (err) {
      console.error("Fallback复制也失败:", err);
      console.error("无法自动复制，地址为:", text);
    }
  };

  const formatAddress = (address: string) => {
    if (address?.length <= 10) return address;
    return `${address?.slice(0, 6)}...${address?.slice(-4)}`;
  };

  // 初始化ECharts图表
  useEffect(() => {
    if (!chartRef.current) return;

    try {
      // 销毁现有实例
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }

      // 确保容器有尺寸
      const container = chartRef.current;
      if (container.clientWidth === 0 || container.clientHeight === 0) {
        console.warn('Chart container has no size, retrying in 100ms');
        setTimeout(() => {
          if (chartRef.current && chartRef.current.clientWidth > 0) {
            chartInstance.current = echarts.init(chartRef.current);
            // initChart();
          }
        }, 100);
        return;
      }

      // 创建新实例
      chartInstance.current = echarts.init(chartRef.current);

      // 准备数据
      const dates = h24KLineData?.map((item) => item[0]);
      const ohlcData = h24KLineData?.map((item) => [
        item[1],
        item[2],
        item[3],
        item[4],
      ]);
      const volumeData = h24KLineData?.map(
        (item) => item[5],
      );

      // 图表配置
      const option = {
        backgroundColor: "transparent",
        grid: [
          {
            left: "10%",
            right: "8%",
            height: "50%",
          },
          {
            left: "10%",
            right: "8%",
            top: "70%",
            height: "16%",
          },
        ],
        xAxis: [
          {
            type: "category",
            data: dates,
            boundaryGap: false,
            axisLine: { onZero: false },
            splitLine: { show: false },
            min: "dataMin",
            max: "dataMax",
            axisPointer: {
              z: 100,
            },
          },
          {
            type: "category",
            gridIndex: 1,
            data: dates,
            boundaryGap: false,
            axisLine: { onZero: false },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: { show: false },
            min: "dataMin",
            max: "dataMax",
          },
        ],
        yAxis: [
          {
            scale: true,
            splitArea: {
              show: true,
            },
          },
          {
            scale: true,
            gridIndex: 1,
            splitNumber: 2,
            axisLabel: { show: false },
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { show: false },
          },
        ],
        dataZoom: [
          {
            type: "inside",
            xAxisIndex: [0, 1],
            start: 90,
            end: 100,
          },
          {
            show: true,
            xAxisIndex: [0, 1],
            type: "slider",
            top: "85%",
            start: 10,
            end: 100,
            backgroundColor: "#f3f4f6",
            borderColor: "#e5e7eb",
            handleStyle: {
              color: "#0fb981",
              borderColor: "#0fb981",
            },
            textStyle: {
              color: "#6b7280",
            },
          },
        ],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
          backgroundColor: "rgba(245, 245, 245, 0.8)",
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          textStyle: {
            color: "#000",
          },
          formatter: function (params: any) {
            const candlestickParam = params.find(
              (p: any) => p.seriesName === "Kline",
            );
            const volumeParam = params.find(
              (p: any) => p.seriesName === "volume",
            );

            let html = `<div style="margin-bottom: 8px; font-weight: bold;">${params[0].axisValue}</div>`;

            if (candlestickParam) {
              const data = candlestickParam.data;
              html += `
              <div>${t("token.k.open")}: ${data[1].toFixed(6)} ${info.symbol}</div>
              <div>${t("token.k.close")}: ${data[2].toFixed(6)} ${info.symbol}</div>
              <div>${t("token.k.low")}: ${data[3].toFixed(6)} ${info.symbol}</div>
              <div>${t("token.k.high")}: ${data[4].toFixed(6)} ${info.symbol}</div>
            `;
            }

            if (volumeParam) {
              html += `<div>${t("token.k.volume")}: ${volumeParam.data.toFixed(2)}</div>`;
            }

            return html;
          },
        },
        series: [
          {
            name: "Kline",
            type: "candlestick",
            data: ohlcData,
            itemStyle: {
              color: "#0fb981",
              color0: "#ef4444",
              borderColor: "#0fb981",
              borderColor0: "#ef4444",
            },
            markPoint: {
              label: {
                formatter: function (param: any) {
                  return param != null
                    ? Math.round(param.value) + ""
                    : "";
                },
              },
              data: [
                {
                  name: "maxValue",
                  type: "max",
                  valueDim: "highest",
                },
                {
                  name: "minValue",
                  type: "min",
                  valueDim: "lowest",
                },
              ],
              tooltip: {
                formatter: function (param: any) {
                  return (
                    param.name + "<br>" + (param.data.coord || "")
                  );
                },
              },
            },
          },
          {
            name: "volume",
            type: "bar",
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: volumeData,
            itemStyle: {
              color: function (params: any) {
                const index = params.dataIndex;
                const candleData = ohlcData[index];
                return candleData[1] > candleData[0]
                  ? "#0fb981"
                  : "#ef4444";
              },
              opacity: 0.6,
            },
          },
        ],
      };

      chartInstance.current.setOption(option);
      setIsChartLoading(false);

      // 响应式处理
      const handleResize = () => {
        if (chartInstance.current) {
          chartInstance.current.resize();
        }
      };

      window.addEventListener("resize", handleResize);

      // 返回清理函数
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    } catch (error) {
      console.error("ECharts chart configuration error:", error);
    }
  }, [h24KLineData]);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      try {
        if (chartInstance.current) {
          chartInstance.current.dispose();
          chartInstance.current = null;
        }
      } catch (error) {
        console.error("ECharts cleanup error:", error);
      }
    };
  }, []);

  return (
    <>
      {/* 返回导航栏 - 优化设计 */}
      <div className="mb-4 sm:mb-6">
        {/* 顶部返回栏 - 增强可见性和移动端优化 */}
        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 mb-4 shadow-sm">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 border-[#0fb981] text-[#0fb981] hover:bg-[#0fb981] hover:text-white transition-colors font-medium shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">
                {t("token.back")}
              </span>
              {/* <span className="sm:hidden">返回</span> */}
            </Button>

            {/* 面包屑导航 - 移动端简化显示 */}
            <div className="text-xs sm:text-sm text-muted-foreground flex-1 text-right max-w-[60%] sm:max-w-none">
              {/* <span className="hidden lg:inline">
              首页 → 交易统计概览 →{" "}
            </span>
            <span className="hidden sm:inline lg:hidden">
              统计概览 →{" "}
            </span> */}
              <span className="font-medium text-gray-900 truncate">
                {tokenDataState?.name}{" "}{t("token.detail")}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        {/* 代币基本信息 - 移动端适配 */}
        <Card>
          <CardHeader className="py-4 sm:py-6">
            <div className="relative min-h-[48px] flex items-center">
              <div className="flex items-center gap-3 sm:gap-6 flex-1 min-w-0">
                {/* 代币图标最左侧 */}
                <TokenIcon
                  isValueToken={tokenDataState?.isvaluegood}
                  icon={tokenDataState?.logo_url}
                  color=""
                  size={GRK_SIZES.MEDIUM}
                  showPulse={tokenDataState?.isvaluegood}
                />
                {/* 代币信息 - 移动端优化 */}
                <div className="flex flex-col items-start justify-center flex-1 min-w-0">
                  {/* 第一行：简称 */}
                  <div className="font-medium text-black/80 text-lg sm:text-[120%]">
                    {tokenDataState?.symbol}
                  </div>
                  {/* 第二行：全称和地址 - 移动端垂直排列 */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 w-full">
                    <div className="text-gray-500 text-sm sm:text-[85%] opacity-75">
                      {tokenDataState?.name}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs sm:text-sm opacity-75 truncate">
                        {formatAddress(tokenDataState?.address)}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopyAddress(tokenDataState?.address)}
                        className="h-5 w-5 sm:h-6 sm:w-6 p-0 hover:bg-[#0fb981]/10 hover:text-[#0fb981] transition-colors"
                      >
                        <Copy className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 右侧操作按钮 - 移动端田字格布局 */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2">
                {/* 移动端：2x2田字格布局 */}
                <div className="grid grid-cols-2 gap-1 sm:hidden">

                  {tokenLinks(jsonData, "w-7 h-7", "w-3 h-3")}
                </div>

                {/* 桌面端：水平排列 */}
                <div className="hidden sm:flex items-center gap-2">
                  {tokenLinks(jsonData, "w-8 h-8", "w-4 h-4")}

                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* 价格信息卡片 - 移动端适配 */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            {/* 移动端：2x2网格，桌面端：1x4网格 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8">
              <Tooltip placement="top"
                title={<span>
                  {t("token.level1.price.tip")}</span>}>
                <div className="text-center cursor-pointer">
                  <div className="text-muted-foreground text-xs sm:text-sm mb-1 sm:mb-2">
                    {t("token.level1.price")}
                  </div>
                  <div className="text-lg sm:text-2xl font-semibold text-gray-900 flex items-center justify-center gap-1 sm:gap-2">
                    {prettifyCurrencys(tokenDataState?.price)}
                    <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-white font-medium text-xs sm:text-sm bg-[#26a17b]">
                      <TokenAvatar
                        token_url={tokenLogo}
                        size={GRK_SIZES.SMALL}
                      />
                    </div>
                  </div>
                </div>
              </Tooltip>
              <Tooltip placement="top" title={<span>
                {t("token.level1.24h.tip")}</span>}>
                <div className="text-center cursor-pointer">
                  <div className="text-muted-foreground text-xs sm:text-sm mb-1 sm:mb-2">
                    {t("token.level1.24h")}
                  </div>
                  {/* <div className="flex items-center gap-2"> */}
                  <div className={`text-lg sm:text-2xl font-semibold flex items-center justify-center gap-1 ${tokenDataState?.price_24h >= 0 ? 'text-[#0fb981]' : 'text-red-500'
                    }`}>
                    {tokenDataState?.price_24h >= 0 ? (
                      <TrendingUp className="text-sm sm:text-lg transition-transform duration-200 group-hover:scale-110" />
                    ) : (
                      <TrendingDown className="text-sm sm:text-lg transition-transform duration-200 group-hover:scale-110" />
                    )}
                    {calculateFeePercentage(tokenDataState?.price_24h)}
                  </div>
                </div>
              </Tooltip>
              <Tooltip placement="top" title={<span>
                {t("token.level1.NAVPS.tip")}</span>}>
                <div className="text-center cursor-pointer">
                  <div className="text-muted-foreground text-xs sm:text-sm mb-1 sm:mb-2">
                    {t("token.level1.NAVPS")}
                  </div>
                  <div className="text-lg sm:text-2xl font-semibold text-blue-600">
                    {prettifyCurrencysFee(tokenDataState?.NAVPS)}
                  </div>
                </div>
              </Tooltip>
              <Tooltip placement="top" title={<span>
                {t("token.level1.apy.tip")}</span>}>
                <div className="text-center cursor-pointer">
                  <div className="text-muted-foreground text-xs sm:text-sm mb-1 sm:mb-2">
                    {t("token.level1.apy")}
                  </div>
                  <div className="text-lg sm:text-2xl font-semibold text-green-600 flex items-center justify-center gap-1">
                    <span className="text-sm sm:text-lg">📈</span>
                    {calculateFeePercentage(tokenDataState?.APY)}
                  </div>
                </div>
              </Tooltip>
            </div>
          </CardContent>
        </Card>

        {/* 24小时K线图与交易量 + 交��和投资功能 - 移动端垂直排列，桌面端左右并排 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* K线图 (移动端：全宽，桌面端：2/3宽度) */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <Card className="h-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-base sm:text-lg">
                  {t("token.k.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <div
                  ref={chartRef}
                  className="w-full h-[350px] sm:h-[450px] lg:h-[600px]"
                  style={{ minHeight: "350px" }}
                />
              </CardContent>
            </Card>
          </div>

          {/* 交换和投资功能 (移动端：全宽，桌面端：1/3宽��) */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <Card className="h-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-base sm:text-lg">
                  {t("token.trade.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <TokenSwap
                    params={{ defaultTab: "swap", tokenId: tokenId }} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 第一部分：当前状态数据 */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base sm:text-[115%]">
              {t("token.level2.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* 合并显示：当前状态数据和24小时统计 */}
            {/* 桌面端：网格布局 */}
            <div className="hidden lg:grid grid-cols-6 gap-6">
              <Tooltip placement="top" title={<span>{t("token.level2.volume.tip")}</span>}>
                <div className="text-left cursor-pointer">
                  <div className="text-muted-foreground text-[92%] mb-2">
                    {t("token.level2.volume")}
                  </div>
                  <div className="font-medium mb-0 text-[115%]">
                    {prettifyCurrencys(tokenDataState?.currentQuantity)}
                  </div>
                  <div className="text-[90%] text-muted-foreground flex items-center gap-1">
                    {prettifyCurrencys(tokenDataState?.currentValue)}
                    {renderUsdtIconExtraSmall()}
                  </div>
                </div>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("token.level2.invest.tip")}</span>}>
                <div className="text-left cursor-pointer">
                  <div className="text-muted-foreground text-[92%] mb-2">
                    {t("token.level2.invest")}
                  </div>
                  <div className="font-medium mb-0 text-[115%]">
                    {prettifyCurrencys(tokenDataState?.investQuantity)}
                  </div>
                  <div className="text-[90%] text-muted-foreground flex items-center gap-1">
                    {prettifyCurrencys(tokenDataState?.investValue)}
                    {renderUsdtIconExtraSmall()}
                  </div>
                </div>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("token.level2.fee.tip")}</span>}>
                <div className="text-left cursor-pointer">
                  <div className="text-muted-foreground text-[92%] mb-2">
                    {t("token.level2.fee")}
                  </div>
                  <div className="font-medium mb-0 text-[115%]">
                    {prettifyCurrencys(tokenDataState?.currentFee)}
                  </div>
                  <div className="text-[90%] text-muted-foreground flex items-center gap-1">
                    {prettifyCurrencys(tokenDataState?.currentFeeValue)}
                    {renderUsdtIconExtraSmall()}
                  </div>
                </div>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("token.level2.24htrade.tip")}</span>}>
                <div className="text-left cursor-pointer">
                  <div className="text-muted-foreground text-[92%] mb-2">
                    {t("token.level2.24htrade")}
                  </div>
                  <div className="font-medium mb-0 text-[115%]">
                    {prettifyCurrencys(tokenDataState?.tradeQuantity24)}
                  </div>
                  <div className="text-[90%] text-muted-foreground flex items-center gap-1">
                    {prettifyCurrencys(tokenDataState?.tradeValue24)}
                    {renderUsdtIconExtraSmall()}
                  </div>
                </div>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("token.level2.24hinvest.tip")}</span>}>
                <div className="text-left cursor-pointer">
                  <div className="text-muted-foreground text-[92%] mb-2">
                    {t("token.level2.24hinvest")}
                  </div>
                  <div className="font-medium mb-0 text-[115%]">
                    {prettifyCurrencys(tokenDataState?.investQuantity24)}
                  </div>
                  <div className="text-[90%] text-muted-foreground flex items-center gap-1">
                    {prettifyCurrencys(tokenDataState?.investValue24)}
                    {renderUsdtIconExtraSmall()}
                  </div>
                </div>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("token.level2.24hfee.tip")}</span>}>
                <div className="text-left cursor-pointer">
                  <div className="text-muted-foreground text-[92%] mb-2">
                    {t("token.level2.24hfee")}
                  </div>
                  <div className="font-medium mb-0 text-[115%]">
                    {prettifyCurrencys(tokenDataState?.fee24)}
                  </div>
                  <div className="text-[90%] text-muted-foreground flex items-center gap-1">
                    {prettifyCurrencys(tokenDataState?.feeValue24)}
                    {renderUsdtIconExtraSmall()}
                  </div>
                </div>
              </Tooltip>
            </div>

            {/* 移动端：行布局 */}
            <div className="lg:hidden space-y-3">

              <Tooltip placement="top" title={<span>{t("token.level2.volume.tip")}</span>}>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-muted-foreground text-sm">
                    {t("token.level2.volume")}
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">
                      {prettifyCurrencys(tokenDataState?.currentQuantity)}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      {prettifyCurrencys(tokenDataState?.currentValue)}
                      {renderUsdtIconExtraSmall()}
                    </div>
                  </div>
                </div>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("token.level2.invest.tip")}</span>}>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-muted-foreground text-sm">
                    {t("token.level2.invest")}
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">
                      {prettifyCurrencys(tokenDataState?.investQuantity)}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      {prettifyCurrencys(tokenDataState?.investValue)}
                      {renderUsdtIconExtraSmall()}
                    </div>
                  </div>
                </div>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("token.level2.fee.tip")}</span>}>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-muted-foreground text-sm">
                    {t("token.level2.fee")}
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">
                      {prettifyCurrencys(tokenDataState?.currentFee)}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      {prettifyCurrencys(tokenDataState?.currentFeeValue)}
                      {renderUsdtIconExtraSmall()}
                    </div>
                  </div>
                </div>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("token.level2.24htrade.tip")}</span>}>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-muted-foreground text-sm">
                    {t("token.level2.24htrade")}
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">
                      {prettifyCurrencys(tokenDataState?.tradeQuantity24)}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      {prettifyCurrencys(tokenDataState?.tradeValue24)}
                      {renderUsdtIconExtraSmall()}
                    </div>
                  </div>
                </div>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("token.level2.24hinvest.tip")}</span>}>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-muted-foreground text-sm">
                    {t("token.level2.24hinvest")}
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">
                      {prettifyCurrencys(tokenDataState?.investQuantity24)}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      {prettifyCurrencys(tokenDataState?.investValue24)}
                      {renderUsdtIconExtraSmall()}
                    </div>
                  </div>
                </div>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("token.level2.24hfee.tip")}</span>}>
                <div className="flex justify-between items-center py-2">
                  <div className="text-muted-foreground text-sm">
                    {t("token.level2.24hfee")}
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">
                      {prettifyCurrencys(tokenDataState?.fee24)}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      {prettifyCurrencys(tokenDataState?.feeValue24)}
                      {renderUsdtIconExtraSmall()}
                    </div>
                  </div>
                </div>
              </Tooltip>
            </div>
          </CardContent>
        </Card>

        {/* 第二部分：详细统计数据 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[115%]">
              {t("token.level3.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* 桌面端：网格布局 */}
            <div className="hidden lg:grid grid-cols-6 gap-6">
              <Tooltip placement="top" title={<span>{t("token.level3.totaltrade.tip")}</span>}>
                <div className="text-left cursor-pointer">
                  <div className="text-muted-foreground text-[92%] mb-2">
                    {t("token.level3.totaltrade")}
                  </div>
                  <div className="font-medium mb-0 text-[115%]">
                    {prettifyCurrencys(tokenDataState?.totalTradeQuantity)}
                  </div>
                  <div className="text-[90%] text-muted-foreground flex items-center gap-1">
                    {prettifyCurrencys(tokenDataState?.totalTradeValue)}
                    {renderUsdtIconExtraSmall()}
                  </div>
                </div>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("token.level3.totalinvest.tip")}</span>}>
                <div className="text-left cursor-pointer">
                  <div className="text-muted-foreground text-[92%] mb-2">
                    {t("token.level3.totalinvest")}
                  </div>
                  <div className="font-medium mb-0 text-[115%]">
                    {prettifyCurrencys(tokenDataState?.totalInvestQuantity)}
                  </div>
                  <div className="text-[90%] text-muted-foreground flex items-center gap-1">
                    {prettifyCurrencys(tokenDataState?.totalInvestValue)}
                    {renderUsdtIconExtraSmall()}
                  </div>
                </div>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("token.level3.totaldivest.tip")}</span>}>
                <div className="text-left cursor-pointer">
                  <div className="text-muted-foreground text-[92%] mb-2">
                    {t("token.level3.totaldivest")}
                  </div>
                  <div className="font-medium mb-0 text-[115%]">
                    {prettifyCurrencys(tokenDataState?.totalDisinvestQuantity)}
                  </div>
                  <div className="text-[90%] text-muted-foreground flex items-center gap-1">
                    {prettifyCurrencys(tokenDataState?.totalDisinvestValue)}
                    {renderUsdtIconExtraSmall()}
                  </div>
                </div>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("token.level3.totaltradecount.tip")}</span>}>
                <div className="text-left cursor-pointer">
                  <div className="text-muted-foreground text-[92%] mb-2">
                    {t("token.level3.totaltradecount")}
                  </div>
                  <div className="font-medium text-[115%]">
                    {tokenDataState?.totalTradeCount}
                  </div>
                </div>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("token.level3.totalinvestcount.tip")}</span>}>
                <div className="text-left cursor-pointer">
                  <div className="text-muted-foreground text-[92%] mb-2">
                    {t("token.level3.totalinvestcount")}
                  </div>
                  <div className="font-medium text-[115%]">
                    {tokenDataState?.totalInvestCount}
                  </div>
                </div>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("token.level3.creator.tip")}</span>}>
                <div className="text-left cursor-pointer">
                  <div className="text-muted-foreground text-[92%] mb-2">
                    {t("token.level3.creator")}
                  </div>
                  <div className="font-mono text-[92%]">
                    {formatAddress(tokenDataState?.owner)}
                  </div>
                </div>
              </Tooltip>
            </div>

            {/* 移动端：行布局 */}
            <div className="lg:hidden space-y-3">
              <Tooltip placement="top" title={<span>{t("token.level3.totaltrade.tip")}</span>}>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-muted-foreground text-sm">
                    {t("token.level3.totaltrade")}
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">
                      {prettifyCurrencys(tokenDataState?.totalTradeQuantity)}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      {prettifyCurrencys(tokenDataState?.totalTradeValue)}
                      {renderUsdtIconExtraSmall()}
                    </div>
                  </div>
                </div>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("token.level3.totalinvest.tip")}</span>}>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-muted-foreground text-sm">
                    {t("token.level3.totalinvest")}
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">
                      {prettifyCurrencys(tokenDataState?.totalInvestQuantity)}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      {prettifyCurrencys(tokenDataState?.totalInvestValue)}
                      {renderUsdtIconExtraSmall()}
                    </div>
                  </div>
                </div>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("token.level3.totaldivest.tip")}</span>}>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-muted-foreground text-sm">
                    {t("token.level3.totaldivest")}
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">
                      {prettifyCurrencys(tokenDataState?.totalDisinvestQuantity)}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      {prettifyCurrencys(tokenDataState?.totalDisinvestValue)}
                      {renderUsdtIconExtraSmall()}
                    </div>
                  </div>
                </div>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("token.level3.totaltradecount.tip")}</span>}>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-muted-foreground text-sm">
                    {t("token.level3.totaltradecount")}
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">
                      {tokenDataState?.totalTradeCount}
                    </div>
                  </div>
                </div>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("token.level3.totalinvestcount.tip")}</span>}>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-muted-foreground text-sm">
                    {t("token.level3.totalinvestcount")}
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">
                      {tokenDataState?.totalInvestCount}
                    </div>
                  </div>
                </div>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("token.level3.creator.tip")}</span>}>
                <div className="flex justify-between items-center py-2">
                  <div className="text-muted-foreground text-sm">
                    {t("token.level3.creator")}
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm">
                      {formatAddress(tokenDataState?.owner)}
                    </div>
                  </div>
                </div>
              </Tooltip>
            </div>
          </CardContent>
        </Card>

        {/* 第三部分：代币配置 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[115%]">
              {t("token.level4.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* 桌面端：网格布局 */}
            <div className="hidden lg:grid grid-cols-6 gap-6">
              <Tooltip placement="top" title={<span>{t("token.level4.buyfee.tip")}</span>}>
                <div className="text-left cursor-pointer">
                  <div className="text-muted-foreground text-[92%] mb-2">
                    {t("token.level4.buyfee")}
                  </div>
                  <div className="font-medium text-[115%]">
                    {formatPercent(tokenDataState?.buyFee)}
                  </div>
                </div>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("token.level4.sellfee.tip")}</span>}>
                <div className="text-left cursor-pointer">
                  <div className="text-muted-foreground text-[92%] mb-2">
                    {t("token.level4.sellfee")}
                  </div>
                  <div className="font-medium text-[115%]">
                    {formatPercent(tokenDataState?.sellFee)}
                  </div>
                </div>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("token.level4.investfee.tip")}</span>}>
                <div className="text-left cursor-pointer">
                  <div className="text-muted-foreground text-[92%] mb-2">
                    {t("token.level4.investfee")}
                  </div>
                  <div className="font-medium text-[115%]">
                    {formatPercent(tokenDataState?.investFee)}
                  </div>
                </div>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("token.level4.divestfee.tip")}</span>}>
                <div className="text-left cursor-pointer">
                  <div className="text-muted-foreground text-[92%] mb-2">
                    {t("token.level4.divestfee")}
                  </div>
                  <div className="font-medium text-[115%]">
                    {formatPercent(tokenDataState?.divestFee)}
                  </div>
                </div>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("token.level4.strengthen.tip")}</span>}>
                <div className="text-left cursor-pointer">
                  <div className="text-muted-foreground text-[92%] mb-2">
                    {t("token.level4.strengthen")}
                  </div>
                  <div className="font-medium text-[115%]">
                    {tokenDataState?.swapChips}
                  </div>
                </div>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("token.level4.divestchips.tip")}</span>}>
                <div className="text-left cursor-pointer">
                  <div className="text-muted-foreground text-[92%] mb-2">
                    {t("token.level4.divestchips")}
                  </div>
                  <div className="font-medium text-[115%]">
                    {tokenDataState?.divestChips}
                  </div>
                </div>
              </Tooltip>
            </div>

            {/* 移动端：行布局 */}
            <div className="lg:hidden space-y-3">
              <Tooltip placement="top" title={<span>{t("token.level4.buyfee.tip")}</span>}>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-muted-foreground text-sm">
                    {t("token.level4.buyfee")}
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">
                      {formatPercent(tokenDataState?.buyFee)}
                    </div>
                  </div>
                </div>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("token.level4.sellfee.tip")}</span>}>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-muted-foreground text-sm">
                    {t("token.level4.sellfee")}
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">
                      {formatPercent(tokenDataState?.sellFee)}
                    </div>
                  </div>
                </div>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("token.level4.investfee.tip")}</span>}>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-muted-foreground text-sm">
                    {t("token.level4.investfee")}
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">
                      {formatPercent(tokenDataState?.investFee)}
                    </div>
                  </div>
                </div>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("token.level4.divestfee.tip")}</span>}>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-muted-foreground text-sm">
                    {t("token.level4.divestfee")}
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">
                      {formatPercent(tokenDataState?.divestFee)}
                    </div>
                  </div>
                </div>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("token.level4.strengthen.tip")}</span>}>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-muted-foreground text-sm">
                    {t("token.level4.strengthen")}
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">
                      {tokenDataState?.swapChips}
                    </div>
                  </div>
                </div>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("token.level4.divestchips.tip")}</span>}>
                <div className="flex justify-between items-center py-2">
                  <div className="text-muted-foreground text-sm">
                    {t("token.level4.divestchips")}
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">
                      {tokenDataState?.divestChips}
                    </div>
                  </div>
                </div>
              </Tooltip>
            </div>
          </CardContent>
        </Card>

        {/* 第三部分：分佣配置 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[115%]">
              {t("token.level6.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* 桌面端：网格布局 */}
            <div className="hidden lg:grid grid-cols-6 gap-6">
              <Tooltip placement="top" title={<span>{t("token.level6.investor.tip")}</span>}>
                <div className="text-left cursor-pointer">
                  <div className="text-muted-foreground text-[92%] mb-2">
                    {t("token.level6.investor")}
                  </div>
                  <div className="font-medium text-[115%]">
                    {formatPercent(tokenDataState?.investor)}
                  </div>
                </div>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("token.level6.operator.tip")}</span>}>
                <div className="text-left cursor-pointer">
                  <div className="text-muted-foreground text-[92%] mb-2">
                    {t("token.level6.operator")}
                  </div>
                  <div className="font-medium text-[115%]">
                    {formatPercent(tokenDataState?.operator)}
                  </div>
                </div>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("token.level6.portal.tip")}</span>}>
                <div className="text-left cursor-pointer">
                  <div className="text-muted-foreground text-[92%] mb-2">
                    {t("token.level6.portal")}
                  </div>
                  <div className="font-medium text-[115%]">
                    {formatPercent(tokenDataState?.portal)}
                  </div>
                </div>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("token.level6.referrer.tip")}</span>}>
                <div className="text-left cursor-pointer">
                  <div className="text-muted-foreground text-[92%] mb-2">
                    {t("token.level6.referrer")}
                  </div>
                  <div className="font-medium text-[115%]">
                    {formatPercent(tokenDataState?.referrer)}
                  </div>
                </div>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("token.level6.user.tip")}</span>}>
                <div className="text-left cursor-pointer">
                  <div className="text-muted-foreground text-[92%] mb-2">
                    {t("token.level6.user")}
                  </div>
                  <div className="font-medium text-[115%]">
                    {formatPercent(tokenDataState?.user)}
                  </div>
                </div>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("token.level6.protocol.tip")}</span>}>
                <div className="text-left cursor-pointer">
                  <div className="text-muted-foreground text-[92%] mb-2">
                    {t("token.level6.protocol")}
                  </div>
                  <div className="font-medium text-[115%]">
                    {formatPercent(tokenDataState?.protocol)}
                  </div>
                </div>
              </Tooltip>
            </div>

            {/* 移动端：行布局 */}
            <div className="lg:hidden space-y-3">
              <Tooltip placement="top" title={<span>{t("token.level6.investor.tip")}</span>}>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-muted-foreground text-sm">
                    {t("token.level6.investor")}
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">
                      {formatPercent(tokenDataState?.investor)}
                    </div>
                  </div>
                </div>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("token.level6.operator.tip")}</span>}>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-muted-foreground text-sm">
                    {t("token.level6.operator")}
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">
                      {formatPercent(tokenDataState?.operator)}
                    </div>
                  </div>
                </div>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("token.level6.portal.tip")}</span>}>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-muted-foreground text-sm">
                    {t("token.level6.portal")}
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">
                      {formatPercent(tokenDataState?.portal)}
                    </div>
                  </div>
                </div>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("token.level6.referrer.tip")}</span>}>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-muted-foreground text-sm">
                    {t("token.level6.referrer")}
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">
                      {formatPercent(tokenDataState?.referrer)}
                    </div>
                  </div>
                </div>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("token.level6.user.tip")}</span>}>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="text-muted-foreground text-sm">
                    {t("token.level6.user")}
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">
                      {formatPercent(tokenDataState?.user)}
                    </div>
                  </div>
                </div>
              </Tooltip>
              <Tooltip placement="top" title={<span>{t("token.level6.protocol.tip")}</span>}>
                <div className="flex justify-between items-center py-2">
                  <div className="text-muted-foreground text-sm">
                    {t("token.level6.protocol")}
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">
                      {formatPercent(tokenDataState?.protocol)}
                    </div>
                  </div>
                </div>
              </Tooltip>
            </div>
          </CardContent>
        </Card>

        {/* 第四部分：交易记录 */}
        <div className="mb-4 animate-slide-in-left">
          <h2 className="mb-2">{t("token.level5.title")}</h2>
          {/* <p className="text-muted-foreground text-sm">
            {t("token.level4.description")}
          </p> */}
        </div>
        <TransactionRecords tokenId={tokenId} symbol={tokenDataState?.symbol} wallet_address="" />

      </div>
    </>
  );
}