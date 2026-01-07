import usdt from "@/assets/cions/usdt.png";
import btc from "@/assets/cions/btc.png";
import eth from "@/assets/cions/eth.png";
import usdc from "@/assets/cions/usdc.png";

export function useValueCionLogo(info: any) {
    // const { t } = useTranslation();
    switch ((info.symbol).toUpperCase()) {
        case "USDT": { return usdt; }
        case "BTC":
        case "WBTC": { return btc; }
        case "ETH":
        case "WETH":
        case "TWETH": { return eth; }
        case "USDC": { return usdc; }
        default: { return null; }
    }
}