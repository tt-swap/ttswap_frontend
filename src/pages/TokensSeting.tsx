import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { TokenTable } from "@/components/tables/TokenTable";
import { TokensSetingDialog } from "@/components/dialogs/TokensSetingDialog";
import { useValueGood } from "@/stores/valueGood";
import { useLocalStorage } from "@/utils/LocalStorageManager";
import { useMuneName } from "@/stores/menu";
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
import { Spin, Tooltip } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

// 使用新的工具函数和常量
import { formatCurrency, formatPercentage } from "@/utils/format";
import { investGoodsDatas } from '@/services/graphql/overview';
import { prettifyCurrencys, prettifyCurrencysFee } from '@/services/graphql/util';
import { type TokenV2Volume } from "@/types/XykServiceTypes";
import { TokenIcon } from "@/components/common/TokenIcon";
import { GRK_SIZES } from "@/types/common";
import { useAccount } from "wagmi";


export default function TokensSeting() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { info } = useValueGood();
  const { ssionChian } = useLocalStorage();
  const { isConnected, address } = useAccount();
  const [isSwapDialogOpen, setIsSwapDialogOpen] =
    useState(false);
  const [selectedToken, setSelectedToken] = useState(null);

  const [spinning, setSpinning] = useState(false);
  const [pagination, setPagination] = useState({
    page_number: 1,
  });
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [maybeResult, setResult] = useState<TokenV2Volume[]>([]);
  const [error, setError] = useState({ error: false, error_message: "" });
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
            id: info.address,
            pageNumber: pagination.page_number - 1,
            pageSize: page_size,
            address: address,
          }, ssionChian);
        console.log(response, "***",address);
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
  }, [ssionChian, pagination, info, address]);

  
  // 格式化百分比并返回样式信息
  const getPercentageDisplay = (value: number) => {
    const color = value >= 0 ? "text-[#0fb981]" : "text-red-500";
    const text = formatPercentage(value, 2, true);
    return { color, text };
  };

  // 处理代币交换点击
  const onSetingClick = (
    token: any,
  ) => {
    setSelectedToken(token);
    setIsSwapDialogOpen(true);
  };


  // 处理代币行点击跳转到TokenProfile
  const handleTokenRowClick = (token: string) => {
    navigate('/tokens/' + token);
  };

  return (
    <div>
      <div className="animate-fade-in">
        <div className="mb-4 sm:mb-6 animate-slide-in-left">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-0">
            <div>
              <h1 className="mb-2 text-xl sm:text-2xl">
                {t("tokens.title")}
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                {t("tokens.description")}
              </p>
            </div>
          </div>
        </div>

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
                    <TableHead className="text-center h-[34px] px-2 py-[5.5px]">{t("table.tokens.price")}</TableHead>
                  </Tooltip>
                  <Tooltip placement="top" title={<span>{t("table.tokens.change24h.tip")}</span>}>
                    <TableHead className="text-center h-[34px] px-2 py-[5.5px]">{t("table.tokens.change24h")}</TableHead>
                  </Tooltip>
                  <Tooltip placement="top" title={<span>{t("table.tokens.navps.tip")}</span>}>
                    <TableHead className="text-center h-[34px] px-2 py-[5.5px]">{t("table.tokens.navps")}</TableHead>
                  </Tooltip>
                  <Tooltip placement="top" title={<span>{t("table.tokens.apy.tip")}</span>}>
                    <TableHead className="text-center h-[34px] px-2 py-[5.5px]">{t("table.tokens.apy")}</TableHead>
                  </Tooltip>
                  <Tooltip placement="top" title={<span>{t("table.tokens.amount.tip")}</span>}>
                    <TableHead className="text-center h-[34px] px-2 py-[5.5px]">{t("table.tokens.amount")}</TableHead>
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
                    onClick={() => handleTokenRowClick?.(item.id)}
                  >
                    <TableCell className="text-center align-middle px-2 py-[5.5px]">
                      <div className="font-medium transition-colors duration-200 hover:text-[#0fb981]">{index + 1}</div>
                    </TableCell>
                    <TableCell className="px-2 py-[5.5px]">
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
                    <TableCell className="text-center font-medium px-2 py-[5.5px] transition-colors duration-200 hover:text-[#0fb981]">
                      {formatCurrency(item.price)}
                    </TableCell>
                    <TableCell className="text-center font-medium px-2 py-[5.5px]">
                      <span className={`transition-all duration-200 ${getPercentageDisplay(item.priceC_24h).color}`}>
                        {getPercentageDisplay(item.priceC_24h).text}
                      </span>
                    </TableCell>
                    <TableCell className="text-center font-medium px-2 py-[5.5px] transition-colors duration-200 hover:text-[#0fb981]">
                      {prettifyCurrencysFee(item.NAVPS)}
                    </TableCell>
                    <TableCell className="text-center font-medium px-2 py-[5.5px]">
                      <span className="text-[#0fb981] transition-transform duration-200 hover:scale-105 inline-block">{formatPercentage(item.apy, 2)}</span>
                    </TableCell>
                    <TableCell className="text-center font-medium px-2 py-[5.5px] transition-colors duration-200 hover:text-[#0fb981]">
                      {formatCurrency(item.currentValue)}
                    </TableCell>
                    <TableCell className="text-center align-middle px-2 py-[5.5px]">
                      <div className="flex gap-2 justify-center">
                        <Button
                          size="sm"
                          className="token-action-btn h-[1.66rem] px-3 text-xs bg-[#0fb981] hover:bg-[#22c55e] text-white border-0 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSetingClick?.(item);
                          }}
                        >
                          配置
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
        <TokensSetingDialog
          open={isSwapDialogOpen}
          onOpenChange={setIsSwapDialogOpen}
          token={selectedToken}
          walletAddress={address}
        />
      </div>

    </div>
  );
}