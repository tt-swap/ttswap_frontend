import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Copy, Search, Clock, X, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { useState, useCallback, useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';
import { Spin } from 'antd';
import { prettifyCurrencys, Timestamp } from '@/services/graphql/util';
import { GoodsDatas } from '@/services/graphql/swap/index';
import { SwapTokenValue, InvestToken } from "@/types/token";
import { TokenIcon } from '@/components/common/TokenIcon';
import { GRK_SIZES, DEFAULT_TOKEN } from "@/types/common";
import CreatModal from "./creatModal";

interface TokenSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectToken: (token: SwapTokenValue) => void;
  selectedToken?: SwapTokenValue | InvestToken;
  title?: string;
  info: any,
  ssionChian: any;
}


export function TokenSelectionDialog({
  open,
  onOpenChange,
  onSelectToken,
  selectedToken,
  title, info, ssionChian
}: TokenSelectionDialogProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearchTokens, setRecentSearchTokens] = useState<string[]>([]);
  const [showAllRecentTokens, setShowAllRecentTokens] = useState(false);
  const [valueTokens, setValueTokens] = useState<string[]>([]);
  const [showAllValueTokens, setShowAllValueTokens] = useState(false);
  const [showAllOtherTokens, setShowAllOtherTokens] = useState(false);

  // 新增：筛选状态管理
  const [allTokensFilter, setAllTokensFilter] = useState<'none' | 'value' | 'recent'>('none');

  // 无限滚动状态 - 只针对其他代币
  const [otherTokensDisplayLimit, setOtherTokensDisplayLimit] = useState(10);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const [spinning, setSpinning] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [availableTokens, setTokensValue] = useState<SwapTokenValue[]>([]);
  const [tokensData, setTokens] = useState<SwapTokenValue[]>();


  useEffect(() => {
    // if (!open) return;
    setSpinning(true);
    (async () => {
      let a: any = await GoodsDatas({
        id: info.id,
        sel: keyword,
        gid: "",
        par: Timestamp()
      }, ssionChian);
      console.log(a, 33332)
      setTokensValue(a.tokenValue);
      setTokens(a.tokens);
      setSpinning(false);
    })()
  }, [info, ssionChian]);

  // 搜索过滤
  const filteredTokens = tokensData?.filter(
    (token) =>
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recentSearchFilteredTokens = filteredTokens?.filter((token) =>
    recentSearchTokens.includes(token.symbol)
  );
  const otherFilteredTokens = filteredTokens?.filter(
    (token) => !recentSearchTokens.includes(token.symbol) && !valueTokens.includes(token.symbol)
  );

  // 渲染代币图标
  const renderTokenIcon = (token: SwapTokenValue) => {
    return (
      <TokenIcon
        isValueToken={token.isvaluegood}
        icon={token.logo_url}
        color=""
        size={GRK_SIZES.SMALL}
        showPulse={token.isvaluegood}
      />
    );
  };

  // 渲染紧凑版代币图标 - 缩小版本但避免变形
  const renderCompactTokenIcon = (token: SwapTokenValue) => {

    return (
      <TokenIcon
        isValueToken={token.isvaluegood}
        icon={token.logo_url}
        color=""
        size={GRK_SIZES.EXTRA_EXTRA_SMALL}
        showPulse={token.isvaluegood}
      />
    );
  };

  // 格式化合约地址
  const formatAddress = (address: string) => {
    if (!address) return "地址未设置";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // 复制地址到剪贴板（带fallback机制）
  const copyToClipboard = async (address: string, tokenName: string) => {
    try {
      // 尝试使用现代 Clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(address);
        toast.success(`${tokenName} 地址已复制到剪贴板`);
      } else {
        // Fallback 到传统方法
        fallbackCopyTextToClipboard(address, tokenName);
      }
    } catch (err) {
      console.error("复制失败:", err);
      // 如果 Clipboard API 失败，尝试 fallback 方法
      fallbackCopyTextToClipboard(address, tokenName);
    }
  };

  // Fallback 复制方法
  const fallbackCopyTextToClipboard = (text: string, tokenName: string) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;

      // 避免在移动设备上显示键盘
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      textArea.setAttribute('readonly', '');

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (successful) {
        toast.success(`${tokenName} 地址已复制到剪贴板`);
      } else {
        // 如果所有方法都失败，显示地址供用户手动复制
        toast.error(`复制失败，地址为: ${text}`, {
          duration: 10000,
        });
      }
    } catch (err) {
      console.error("Fallback复制也失败:", err);
      // 最后的 fallback：显示地址让用户手动复制
      toast.error(`无法自动复制，地址为: ${text}`, {
        duration: 10000,
      });
    }
  };

  // 清除最近搜索记录
  const clearRecentSearch = (tokenSymbol: string) => {
    setRecentSearchTokens((prev) =>
      prev.filter((symbol) => symbol !== tokenSymbol)
    );
  };

  // 选择代币
  const handleSelectToken = (token: SwapTokenValue) => {
    // 将选中的代币添加到最近搜索列表的开头
    setRecentSearchTokens((prev) => {
      const filtered = prev.filter((symbol) => symbol !== token.symbol);
      return [token.symbol, ...filtered].slice(0, 8); // 保持最多8个最近搜索记录
    });

    onSelectToken(token);
    onOpenChange(false);
    setSearchQuery(""); // 重置搜索
    setShowAllRecentTokens(false); // 重置最近搜索代币展开状态
    setShowAllValueTokens(false); // 重置价值代币展开状态
    setShowAllOtherTokens(false); // 重置其他代币展开状态
    setAllTokensFilter('none'); // 重置筛选状态
  };

  // 处理价值代币的"更多"点击
  const handleValueTokensMore = () => {
    setShowAllValueTokens(false);
    setAllTokensFilter('value');
    setShowAllOtherTokens(true);
  };

  // 处理最近搜索代币的"更多"点击
  const handleRecentTokensMore = () => {
    setShowAllRecentTokens(false);
    setAllTokensFilter('recent');
    setShowAllOtherTokens(true);
  };

  // 清除筛选
  const clearFilter = () => {
    setAllTokensFilter('none');
    setShowAllOtherTokens(false);
    setRecentSearchTokens([])
  };
  //收起
  const foldUp = () => {
    setAllTokensFilter('none');
    setShowAllOtherTokens(false);
  };

  // 加载更多其他代币
  const loadMoreOtherTokens = useCallback(() => {
    setOtherTokensDisplayLimit(prev => prev + 10);
  }, []);

  // 滚动监听 - 只针对其他代币区域
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const threshold = 50; // 距离底部50px时加载更多

    if (scrollHeight - scrollTop - clientHeight < threshold) {
      // 只在显示其他代币且还有更多代币时加载
      if ((!showAllOtherTokens && allTokensFilter === 'none' && otherTokensDisplayLimit < otherFilteredTokens.length) ||
        (showAllOtherTokens && allTokensFilter === 'none' && otherTokensDisplayLimit < otherFilteredTokens.length)) {
        loadMoreOtherTokens();
      }
    }
  }, [showAllOtherTokens, allTokensFilter, otherTokensDisplayLimit, otherFilteredTokens?.length, loadMoreOtherTokens]);

  // 重置显示限制当搜索或筛选改变时
  useEffect(() => {
    setOtherTokensDisplayLimit(10);
  }, [searchQuery, allTokensFilter]);



  // 简化的最近搜索代币项组件（小行缩略图：图标与简称同行）
  const RecentTokenItem = ({ token }: { token: SwapTokenValue }) => {
    const isSelected = selectedToken?.symbol === token.symbol;

    return (
      <div
        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] ${isSelected
          ? "bg-[#0fb981]/10 border border-[#0fb981]/20 hover-glow"
          : "hover:bg-gray-50 hover:shadow-md"
          }`}
        onClick={() => handleSelectToken(token)}
      >
        {renderCompactTokenIcon(token)}
        <div className="text-sm font-medium">{token.symbol}</div>
      </div>
    );
  };

  // 简化的价值代币项组件（小行缩略图：图标与简称同行，保留价值代币特效）
  const ValueTokenItem = ({ token }: { token: SwapTokenValue }) => {
    const isSelected = selectedToken?.symbol === token.symbol;

    return (
      <div
        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] ${isSelected
          ? "bg-[#0fb981]/10 border border-[#0fb981]/20 hover-glow"
          : "hover:bg-gray-50 hover:shadow-md"
          }`}
        onClick={() => handleSelectToken(token)}
      >
        {renderCompactTokenIcon(token)}
        <div className="text-sm font-medium text-[#0fb981]">{token.symbol}</div>
      </div>
    );
  };

  // 完整代币项组件
  const TokenItem = ({ token, type }: { token: SwapTokenValue, type: string }) => {
    const isSelected = selectedToken?.symbol === token.symbol;
    const isRecent = recentSearchTokens.includes(token.symbol);
    // const isValueTokenType = isValueToken(token.symbol);

    return (
      <div
        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${isSelected
          ? "bg-[#0fb981]/10 border border-[#0fb981]/20"
          : "hover:bg-gray-50"
          }`}
        onClick={() => handleSelectToken(token)}
      >
        <div className="flex items-center gap-3 flex-1">
          {renderTokenIcon(token)}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{token.symbol}</span>
              {/* {token.isvaluegood && (
                <Badge
                  variant="secondary"
                  className="opacity-75 bg-transparent border-0 shadow-none text-[#12b981] px-1 py-0.5 h-4"
                >
                  价值代币
                </Badge>
              )} */}
              {isRecent && (
                <Clock className="h-3 w-3 text-blue-500" />
              )}
            </div>
            <div className="text-sm text-muted-foreground">{token.name}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="font-mono">{formatAddress(token.address)}</span>
              <div
                className="h-3 w-3 cursor-pointer hover:bg-[#0fb981]/10 hover:text-[#0fb981] rounded transition-colors flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(token.address, token.symbol);
                }}
              >
                <Copy className="h-2.5 w-2.5" />
              </div>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="font-medium">
            {prettifyCurrencys(token.currentQuantity / 10 ** token.decimals)}
          </div>
          <div className="text-sm text-muted-foreground">
            ≈
            {prettifyCurrencys(token.currentQuantity / 10 ** token.decimals * token.price)}{" " + info.symbol}
          </div>
          {type === "recent" && isRecent && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 mt-1 hover:bg-red-50 hover:text-red-500 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                clearRecentSearch(token.symbol);
              }}
              title={t("trade.selection.rem")}
            >
              <X className="h-3 w-3 text-gray-400" />
            </Button>
          )}
        </div>
      </div>
    );
  };


  return (
    <CreatModal open={open} setOpen={onOpenChange} title={title}>
      {/* <DialogContent className="sm:max-w-[500px] max-h-[85vh] min-h-[400px] p-0 flex flex-col animate-fade-in">
        <DialogHeader className="p-6 pb-4 flex-shrink-0 animate-slide-in-up">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            选择您要交换的代币，或搜索特定代币
          </DialogDescription>
        </DialogHeader> */}
        <div className="pb-4"> {t("trade.selection.title.desc")}</div>
        <div className="px-6 pb-4 flex-shrink-0 animate-slide-in-up">
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("trade.selection.input.tip")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200 focus-visible:ring-2 focus-visible:ring-[#0fb981] focus-visible:border-[#0fb981]"
            />
          </div>
        </div>

        <div className="flex-1 min-h-0 px-6 overflow-hidden">
          <div
            className="space-y-4 pb-6 overflow-y-auto token-scroll-area h-full max-h-full animate-fade-in"
            onScroll={handleScroll}
            ref={scrollAreaRef}
          >
            {/* 价值代币 - 简化显示 */}
            {availableTokens?.length > 0 && !showAllValueTokens && allTokensFilter === 'none' && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#0fb981] flex items-center justify-center">
                      <DollarSign className="h-2.5 w-2.5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      {t("trade.selection.valuetoken")}
                    </span>
                  </div>
                  {/* 当代币超过3个时，显示"更多"按钮 */}
                  {availableTokens?.length > 3 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs text-muted-foreground hover:bg-[#0fb981]/10 hover:text-[#0fb981] transition-colors"
                      onClick={handleValueTokensMore}
                    >
                      {t("trade.selection.more")} ({availableTokens?.length - 3})
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {availableTokens?.slice(0, 3).map((token) => (
                    <ValueTokenItem key={token.symbol} token={token} />
                  ))}
                </div>
              </div>
            )}


            {/* 最近搜索的代币 - 简化显示 */}
            {recentSearchFilteredTokens?.length > 0 && !showAllRecentTokens && !showAllValueTokens && allTokensFilter === 'none' && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium text-muted-foreground">
                    {t("trade.selection.recently")}
                    </span>
                  </div>
                  {/* 当代币超过3个时，显示"更多"按钮 */}
                  {recentSearchFilteredTokens?.length > 3 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs text-muted-foreground hover:bg-[#0fb981]/10 hover:text-[#0fb981] transition-colors"
                      onClick={handleRecentTokensMore}
                    >
                      {t("trade.selection.more")} ({recentSearchFilteredTokens?.length - 3})
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {recentSearchFilteredTokens?.slice(0, 3).map((token) => (
                    <RecentTokenItem key={token.symbol} token={token} />
                  ))}
                </div>
              </div>
            )}


            {/* 所有代币 - 根据筛选状态显示不同内容 */}
            {(showAllOtherTokens || allTokensFilter !== 'none') && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      {t("trade.selection.all")}
                    </span>
                    {allTokensFilter === 'value' && (
                      <Badge variant="secondary" className="text-xs bg-[#0fb981]/10 text-[#0fb981]">
                        {t("trade.selection.valuetokenS")}
                      </Badge>
                    )}
                    {allTokensFilter === 'recent' && (
                      <Badge variant="secondary" className="text-xs bg-blue-500/10 text-blue-500">
                        {t("trade.selection.recentlyS")}
                      </Badge>
                    )}
                  </div>
                  {allTokensFilter === 'recent' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors"
                      onClick={clearFilter}
                    >
                      {t("trade.selection.clear")}
                    </Button>)}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors"
                    onClick={foldUp}
                  >
                    {t("trade.selection.fold")}
                  </Button>
                </div>
                <div className="space-y-2 overflow-y-auto max-h-96">
                  {allTokensFilter === 'value' &&
                    availableTokens?.map((token) => (
                      <TokenItem key={token.symbol} token={token} type="value" />
                    ))
                  }
                  {allTokensFilter === 'recent' &&
                    tokensData?.map((token) => (
                      <TokenItem key={token.symbol} token={token} type="recent" />
                    ))
                  }
                  {allTokensFilter === 'none' && showAllOtherTokens &&
                    tokensData?.map((token) => (
                      <TokenItem key={token.symbol} token={token} type="none" />
                    ))
                  }
                </div>
                {/* 加载提示 - 只在展开其他代币时显示 */}
                {/* {allTokensFilter === 'none' && showAllOtherTokens && otherTokensDisplayLimit < otherFilteredTokens.length && (
                  <div className="text-center py-4 text-muted-foreground">
                    <div className="text-sm">滚动到底部加载更多...</div>
                  </div>
                )} */}
              </div>
            )}

            {/* 其他代币 - 只在未有任何筛选时显示 */}
            {otherFilteredTokens?.length > 0 && !showAllOtherTokens && allTokensFilter === 'none' && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t("trade.selection.all")}
                  </span>
                </div>
                <ScrollArea className="h-100">
                  <div className="space-y-2">
                    {tokensData?.map((token) => (
                      <TokenItem key={token.symbol} token={token} type="none" />
                    ))}
                  </div>
                </ScrollArea>
                {/* 加载提示 */}
                {/* {otherTokensDisplayLimit < otherFilteredTokens.length && (
                  <div className="text-center py-4 text-muted-foreground">
                    <div className="text-sm">滚动到底部加载更多...</div>
                  </div>
                )} */}
              </div>
            )}

            {/* 无搜索结果 */}
            {filteredTokens?.length === 0 && !showAllRecentTokens && !showAllValueTokens && allTokensFilter === 'none' && (
              <div className="text-center py-8 text-muted-foreground">
                <div className="mb-2">{t("trade.selection.noS")}</div>
                <div className="text-sm">
                  {t("trade.selection.noS.tip")}
                </div>
              </div>
            )}
          </div>
        </div>
    </CreatModal>
  );
}
