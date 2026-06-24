import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { TokenTable } from "@/components/tables/TokenTable";
import { SwapDialog } from "@/components/dialogs";
import { useValueGood } from "@/stores/valueGood";
import { useLocalStorage } from "@/utils/LocalStorageManager";
import { useMuneName } from "@/stores/menu";
import type { TokenV2Volume } from "@/types/XykServiceTypes";


export default function Tokens() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { info } = useValueGood();
    const { ssionChian } = useLocalStorage();
    const [isSwapDialogOpen, setIsSwapDialogOpen] =
        useState(false);
    const [swapDialogTab, setSwapDialogTab] = useState<"swap" | "invest">("swap");
    const { setName } = useMuneName();
    const [selectedToken, setSelectedToken] = useState<TokenV2Volume | null>(null);

    useEffect(() => {
        setName('tokens');
    }, []);
    // 处理代币交换点击
    const handleTokenSwap = useCallback((
        token: TokenV2Volume,
    ) => {
        setSelectedToken(token);
        setSwapDialogTab("swap");
        setIsSwapDialogOpen(true);
    }, []);

    // 处理代币投资点击
    const handleTokenInvest = useCallback((
        token: TokenV2Volume,
    ) => {
        setSelectedToken(token);
        setSwapDialogTab("invest");
        setIsSwapDialogOpen(true);
    }, []);

    // 处理代币行点击跳转到TokenProfile
    const handleTokenRowClick = useCallback((token: string) => {
        navigate(`/tokens/${token}`);
    }, [navigate]);

    // 处理弹窗关闭
    const handleDialogOpenChange = useCallback((open: boolean) => {
        setIsSwapDialogOpen(open);
        if (!open) {
            // 弹窗关闭时延迟清空选中的 token，避免关闭动画时数据闪烁
            setTimeout(() => setSelectedToken(null), 200);
        }
    }, []);

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

                <TokenTable
                    onSwapClick={handleTokenSwap}
                    onInvestClick={handleTokenInvest}
                    onTokenClick={handleTokenRowClick}
                    showUpdateButton={false}
                    valueId={info.id}
                    chainId={ssionChian}
                    wallet_address="0"
                />
                <SwapDialog
                    open={isSwapDialogOpen}
                    onOpenChange={handleDialogOpenChange}
                    defaultTab={swapDialogTab}
                    tokenId={selectedToken?.id}
                />
            </div>

        </div>
    );
}