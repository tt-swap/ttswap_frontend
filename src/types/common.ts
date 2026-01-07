import { isMobile } from 'react-device-detect';

export const DEFAULT_TOKEN = isMobile ? "Tokens" : "Tokens";
export enum SwapKeys {
    From = "from",
    To = "to",
}

export interface TokenAvatarProps {
    token_url?: string | null;
    sub_url?: string | null;
    size: GRK_SIZES;
    is_chain_logo?: boolean;
    chain_color?: string | null;
    showPulse?: boolean;
}

export enum GRK_SIZES {
    LARGE = "lg",
    MEDIUM = "md",
    SMALL = "sm",
    EXTRA_SMALL = "xs",
    EXTRA_EXTRA_SMALL = "xxs",
}