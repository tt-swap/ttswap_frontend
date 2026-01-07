import { useEffect, useState } from "react";
import TokenSwap from "@/components/trade/trade";
import { useGoodId } from "@/stores/valueGood";
import { useTranslation } from 'react-i18next';
import CreatModal from "./creatModal";

interface SwapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "swap" | "invest";
  tokenId?: string;
}

export function SwapDialog({
  open,
  onOpenChange,
  defaultTab = "swap",
  tokenId
}: SwapDialogProps) {
  const { t } = useTranslation();

  const { setGoodId } = useGoodId();

  useEffect(() => {
    setGoodId({
      swap: { id: tokenId },
      invest: { id: tokenId }
    })
  }, [tokenId]);

  return (
    <>
      <CreatModal open={open} setOpen={onOpenChange} title={t("trade.quick")}>
          <main className="flex flex-col flex-1 overflow-y-auto">
            <TokenSwap
              params={{ defaultTab: defaultTab, tokenId: tokenId }} />
          </main>
      </CreatModal>
    </>
  );
}
