import { Pagination, ContractMetadata, Explorer } from "./GenericTypes";
export interface PoolResponse {
    /** * The timestamp when the response was generated. Useful to show data staleness to users. */
    updated_at: Date;
    /** * The requested chain ID eg: `1`. */
    chain_id: number;
    /** * The requested chain name eg: `eth-mainnet`. */
    chain_name: string;
    /** * List of response items. */
    items: Pool[];
    /** * Pagination metadata. */
    pagination: Pagination;
}
export interface Pool {
    /** * The pair address. */
    exchange: string;
    swap_count_24h: number;
    /** * The total liquidity converted to fiat in `quote-currency`. */
    total_liquidity_quote: number;
    volume_24h_quote: number;
    fee_24h_quote: number;
    /** * Total supply of this pool token. */
    total_supply: bigint | null;
    /** * The exchange rate for the requested quote currency. */
    quote_rate: number;
    /** * A prettier version of the total liquidity quote for rendering purposes. */
    pretty_total_liquidity_quote: string;
    /** * A prettier version of the volume 24h quote for rendering purposes. */
    pretty_volume_24h_quote: string;
    /** * A prettier version of the fee 24h quote for rendering purposes. */
    pretty_fee_24h_quote: string;
    /** * A prettier version of the volume 7d quote for rendering purposes. */
    pretty_volume_7d_quote: string;
    /** * The requested chain name eg: `eth-mainnet`. */
    chain_name: string;
    /** * The requested chain ID eg: `1`. */
    chain_id: string;
    /** * The name of the DEX, eg: `uniswap_v2`. */
    dex_name: string;
    volume_7d_quote: number;
    annualized_fee: number;
    token_0: Token;
    token_1: Token;

    id: any;
    name: any;
    decimals: any;
    symbol: any;
    logo_url: any;
    investQuantity: any;
    unitPrice:any;
    investValue: any;
    valueSymbol: any;
    currentQuantity:any;
    totalInvestQuantity: any;
    totalInvestValue: any;
    investQuantity24: any;
    investValue24: any;
    totalFee: any;
    price: any;
    price_24h: any;
    totalFeeValue: any;
    fee24: any;
    feeValue24: any;
    unitFee: any;
    APY: any;
    myFeeAmount:any;
    totalTradeCount:any;
}

export interface walletPool {
    /** * The pair address. */
    exchange: string;
    swap_count_24h: number;
    /** * The total liquidity converted to fiat in `quote-currency`. */
    total_liquidity_quote: number;
    volume_24h_quote: number;
    fee_24h_quote: number;
    /** * Total supply of this pool token. */
    total_supply: bigint | null;
    /** * The exchange rate for the requested quote currency. */
    quote_rate: number;
    /** * A prettier version of the total liquidity quote for rendering purposes. */
    pretty_total_liquidity_quote: string;
    /** * A prettier version of the volume 24h quote for rendering purposes. */
    pretty_volume_24h_quote: string;
    /** * A prettier version of the fee 24h quote for rendering purposes. */
    pretty_fee_24h_quote: string;
    /** * A prettier version of the volume 7d quote for rendering purposes. */
    pretty_volume_7d_quote: string;
    /** * The requested chain name eg: `eth-mainnet`. */
    chain_name: string;
    /** * The requested chain ID eg: `1`. */
    chain_id: string;
    /** * The name of the DEX, eg: `uniswap_v2`. */
    dex_name: string;
    volume_7d_quote: number;
    annualized_fee: number;
    token_0: Token;
    token_1: Token;

    id: any;
    name: any;
    decimals: any;
    symbol: any;
    logo_url: any;
    investQuantity: any;
    unitPrice:any;
    investValue: any;
    valueSymbol: any;
    totalInvestQuantity: any;
    totalInvestValue: any;
    investQuantity24: any;
    investValue24: any;
    totalFee: any;
    price: any;
    price_24h: any;
    totalFeeValue: any;
    fee24: any;
    feeValue24: any;
    unitFee: any;
    APY: any;
}

export interface Token {
    /** * Use the relevant `contract_address` to lookup prices, logos, token transfers, etc. */
    contract_address: string;
    /** * The string returned by the `name()` method. */
    contract_name: string;
    volume_in_24h: string;
    volume_out_24h: string;
    /** * The exchange rate for the requested quote currency. */
    quote_rate: number;
    reserve: string;
    /** * The contract logo URL. */
    logo_url: string;
    /** * The ticker symbol for this contract. This field is set by a developer and non-unique across a network. */
    contract_ticker_symbol: string;
    /** * Use contract decimals to format the token balance for display purposes - divide the balance by `10^{contract_decimals}`. */
    contract_decimals: number;
    volume_in_7d: string;
    volume_out_7d: string;
}
export interface PoolToDexResponse {
    /** * The timestamp when the response was generated. Useful to show data staleness to users. */
    updated_at: Date;
    /** * The requested address. */
    address: string;
    /** * The requested chain ID eg: `1`. */
    chain_id: number;
    /** * The requested chain name eg: `eth-mainnet`. */
    chain_name: string;
    /** * List of response items. */
    items: PoolToDexItem[];
}
export interface PoolToDexItem extends SupportedDex {
    /** * The dex logo URL. */
    logo_url: string;
}
export interface SupportedDex {
    /** * The requested chain ID eg: `1`. */
    chain_id: string;
    /** * The requested chain name eg: `eth-mainnet`. */
    chain_name: string;
    /** * The name of the DEX, eg: `uniswap_v2`. */
    dex_name: string;
    /** * A display-friendly name for the dex. */
    display_name: string;
    /** * The dex logo URL. */
    logo_url: string;
    factory_contract_address: string;
    router_contract_addresses: string[];
    swap_fee: number;
}
export interface PoolByAddressResponse {
    /** * The timestamp when the response was generated. Useful to show data staleness to users. */
    updated_at: Date;
    /** * The requested chain ID eg: `1`. */
    chain_id: number;
    /** * The requested chain name eg: `eth-mainnet`. */
    chain_name: string;
    /** * List of response items. */
    items: PoolWithTimeseries[];
    /** * Pagination metadata. */
    pagination: Pagination;
}
export interface PoolWithTimeseries {
    /** * The pair address. */
    exchange: string;
    /** * A list of explorers for this address. */
    explorers: Explorer[];
    swap_count_24h: number;
    /** * The total liquidity converted to fiat in `quote-currency`. */
    total_liquidity_quote: number;
    volume_24h_quote: number;
    fee_24h_quote: number;
    /** * Total supply of this pool token. */
    total_supply: bigint | null;
    /** * The exchange rate for the requested quote currency. */
    quote_rate: number;
    /** * The requested chain ID eg: `1`. */
    chain_id: string;
    /** * The name of the DEX, eg: `uniswap_v2`. */
    dex_name: string;
    volume_7d_quote: number;
    annualized_fee: number;
    /** * A prettier version of the total liquidity quote for rendering purposes. */
    pretty_total_liquidity_quote: string;
    /** * A prettier version of the volume 24h quote for rendering purposes. */
    pretty_volume_24h_quote: string;
    /** * A prettier version of the fee 24h quote for rendering purposes. */
    pretty_fee_24h_quote: string;
    /** * A prettier version of the volume 7d quote for rendering purposes. */
    pretty_volume_7d_quote: string;
    token_0: Token;
    token_1: Token;
    token_0_reserve_quote: number;
    token_1_reserve_quote: number;
    volume_timeseries_7d: VolumeTimeseries[];
    volume_timeseries_30d: VolumeTimeseries[];
    liquidity_timeseries_7d: LiquidityTimeseries[];
    liquidity_timeseries_30d: LiquidityTimeseries[];
    price_timeseries_7d: PriceTimeseries[];
    price_timeseries_30d: PriceTimeseries[];
}
export interface VolumeTimeseries {
    /** * The name of the DEX, eg: `uniswap_v2`. */
    dex_name: string;
    /** * The requested chain ID eg: `1`. */
    chain_id: string;
    dt: Date;
    /** * The pair address. */
    exchange: string;
    sum_amount0in: string;
    sum_amount0out: string;
    sum_amount1in: string;
    sum_amount1out: string;
    volume_quote: number;
    /** * A prettier version of the volume quote for rendering purposes. */
    pretty_volume_quote: string;
    token_0_quote_rate: number;
    token_1_quote_rate: number;
    swap_count_24: number;
}
export interface LiquidityTimeseries {
    /** * The name of the DEX, eg: `uniswap_v2`. */
    dex_name: string;
    /** * The requested chain ID eg: `1`. */
    chain_id: string;
    dt: Date;
    /** * The pair address. */
    exchange: string;
    r0_c: string;
    r1_c: string;
    liquidity_quote: number;
    /** * A prettier version of the liquidity quote for rendering purposes. */
    pretty_liquidity_quote: string;
    token_0_quote_rate: number;
    token_1_quote_rate: number;
}
export interface PriceTimeseries {
    /** * The name of the DEX, eg: `uniswap_v2`. */
    dex_name: string;
    /** * The requested chain ID eg: `1`. */
    chain_id: string;
    dt: Date;
    /** * The pair address. */
    exchange: string;
    price_of_token0_in_token1: number;
    /** * A prettier version of the price token0 for rendering purposes. */
    pretty_price_of_token0_in_token1: string;
    price_of_token0_in_token1_description: string;
    price_of_token1_in_token0: number;
    /** * A prettier version of the price token1 for rendering purposes. */
    pretty_price_of_token1_in_token0: string;
    price_of_token1_in_token0_description: string;
    /** * The requested quote currency eg: `USD`. */
    quote_currency: string;
    price_of_token0_in_quote_currency: number;
    price_of_token1_in_quote_currency: number;
}
export interface PoolsDexDataResponse {
    /** * The timestamp when the response was generated. Useful to show data staleness to users. */
    updated_at: Date;
    /** * The requested address. */
    address: string;
    /** * The requested chain ID eg: `1`. */
    chain_id: number;
    /** * The requested chain name eg: `eth-mainnet`. */
    chain_name: string;
    /** * The requested quote currency eg: `USD`. */
    quote_currency: string;
    /** * List of response items. */
    items: PoolsDexDataItem[];
    /** * Pagination metadata. */
    pagination: Pagination;
}
export interface PoolsDexDataItem {
    /** * The name of the DEX, eg: `uniswap_v2`. */
    dex_name: string;
    /** * The pair address. */
    exchange: string;
    /** * The combined ticker symbol of token0 and token1 separated with a hypen. */
    exchange_ticker_symbol: string;
    /** * The dex logo URL for the pair address. */
    exchange_logo_url: string;
    /** * The list of explorers for the token address. */
    explorers: Explorer[];
    /** * The total liquidity converted to fiat in `quote-currency`. */
    total_liquidity_quote: number;
    /** * A prettier version of the total liquidity quote for rendering purposes. */
    pretty_total_liquidity_quote: string;
    /** * The volume 24h converted to fiat in `quote-currency`. */
    volume_24h_quote: number;
    /** * The volume 7d converted to fiat in `quote-currency`. */
    volume_7d_quote: number;
    /** * The fee 24h converted to fiat in `quote-currency`. */
    fee_24h_quote: number;
    /** * The exchange rate for the requested quote currency. */
    quote_rate: number;
    /** * A prettier version of the quote rate for rendering purposes. */
    pretty_quote_rate: string;
    /** * The annual fee percentage. */
    annualized_fee: number;
    /** * A prettier version of the volume 24h quote for rendering purposes. */
    pretty_volume_24h_quote: string;
    /** * A prettier version of the volume 7d quote for rendering purposes. */
    pretty_volume_7d_quote: string;
    /** * A prettier version of the fee 24h quote for rendering purposes. */
    pretty_fee_24h_quote: string;
    /** * Token0's contract metadata and reserve data. */
    token_0: PoolsDexToken;
    /** * Token1's contract metadata and reserve data. */
    token_1: PoolsDexToken;
}
export interface PoolsDexToken {
    /** * The reserves for the token. */
    reserve: string;
    /** * The string returned by the `name()` method. */
    contract_name: string;
    /** * Use contract decimals to format the token balance for display purposes - divide the balance by `10^{contract_decimals}`. */
    contract_decimals: number;
    /** * The ticker symbol for this contract. This field is set by a developer and non-unique across a network. */
    contract_ticker_symbol: string;
    /** * Use the relevant `contract_address` to lookup prices, logos, token transfers, etc. */
    contract_address: string;
    /** * The contract logo URL. */
    logo_url: string;
    /** * The exchange rate for the requested quote currency. */
    quote_rate: number;
}
export interface AddressExchangeBalancesResponse {
    /** * The requested address. */
    address: string;
    /** * The timestamp when the response was generated. Useful to show data staleness to users. */
    updated_at: Date;
    /** * The requested chain ID eg: `1`. */
    chain_id: number;
    /** * The requested chain name eg: `eth-mainnet`. */
    chain_name: string;
    /** * List of response items. */
    items: UniswapLikeBalanceItem[];
}
export interface UniswapLikeBalanceItem {
    token_0: UniswapLikeToken;
    token_1: UniswapLikeToken;
    pool_token: UniswapLikeTokenWithSupply;
}
export interface UniswapLikeToken {
    /** * Use contract decimals to format the token balance for display purposes - divide the balance by `10^{contract_decimals}`. */
    contract_decimals: number;
    /** * The ticker symbol for this contract. This field is set by a developer and non-unique across a network. */
    contract_ticker_symbol: string;
    /** * Use the relevant `contract_address` to lookup prices, logos, token transfers, etc. */
    contract_address: string;
    /** * The contract logo URL. */
    logo_url: string;
    /** * The asset balance. Use `contract_decimals` to scale this balance for display purposes. */
    balance: bigint | null;
    quote: number;
    /** * A prettier version of the quote for rendering purposes. */
    pretty_quote: string;
    /** * The exchange rate for the requested quote currency. */
    quote_rate: number;
}
export interface UniswapLikeTokenWithSupply {
    /** * Use contract decimals to format the token balance for display purposes - divide the balance by `10^{contract_decimals}`. */
    contract_decimals: number;
    /** * The ticker symbol for this contract. This field is set by a developer and non-unique across a network. */
    contract_ticker_symbol: string;
    /** * Use the relevant `contract_address` to lookup prices, logos, token transfers, etc. */
    contract_address: string;
    /** * The contract logo URL. */
    logo_url: string;
    /** * The asset balance. Use `contract_decimals` to scale this balance for display purposes. */
    balance: bigint | null;
    quote: number;
    /** * A prettier version of the quote for rendering purposes. */
    pretty_quote: string;
    /** * The exchange rate for the requested quote currency. */
    quote_rate: number;
    /** * Total supply of this pool token. */
    total_supply: bigint | null;
}
export interface NetworkExchangeTokensResponse {
    /** * The timestamp when the response was generated. Useful to show data staleness to users. */
    updated_at: Date;
    /** * The requested chain ID eg: `1`. */
    chain_id: number;
    /** * The requested chain name eg: `eth-mainnet`. */
    chain_name: string;
    /** * List of response items. */
    items: TokenV2Volume[];
    /** * Pagination metadata. */
    pagination: Pagination;
}
export interface TokenV2Volume {
    /** * The requested chain name eg: `eth-mainnet`. */
    chain_name: string;
    /** * The requested chain ID eg: `1`. */
    chain_id: string;
    /** * The name of the DEX, eg: `uniswap_v2`. */
    dex_name: string;
    /** * Use the relevant `contract_address` to lookup prices, logos, token transfers, etc. */
    contract_address: string;
    /** * The string returned by the `name()` method. */
    contract_name: string;
    total_liquidity: string;
    total_volume_24h: string;
    /** * The contract logo URL. */
    logo_url: string;
    /** * The ticker symbol for this contract. This field is set by a developer and non-unique across a network. */
    contract_ticker_symbol: string;
    /** * Use contract decimals to format the token balance for display purposes - divide the balance by `10^{contract_decimals}`. */
    contract_decimals: number;
    swap_count_24h: number;
    /** * The list of explorers for the token address. */
    explorers: Explorer[];
    /** * The exchange rate for the requested quote currency. */
    quote_rate: number;
    /** * The 24h exchange rate for the requested quote currency. */
    quote_rate_24h: number;
    /** * A prettier version of the exchange rate for rendering purposes. */
    pretty_quote_rate: string;
    /** * A prettier version of the 24h exchange rate for rendering purposes. */
    pretty_quote_rate_24h: string;
    /** * A prettier version of the total liquidity quote for rendering purposes. */
    pretty_total_liquidity_quote: string;
    /** * A prettier version of the 24h volume quote for rendering purposes. */
    pretty_total_volume_24h_quote: string;
    /** * The total liquidity converted to fiat in `quote-currency`. */
    total_liquidity_quote: number;
    /** * The total volume 24h converted to fiat in `quote-currency`. */
    total_volume_24h_quote: number;
    id: any;
    name: any;
    decimals: any;
    symbol: any;
    logo_url: any;
    valueSymbol: any;
    totalFee: any;
    price: any;
    price_24h: any;
    totalFeeValue: any;
    fee24: any;
    feeValue24: any;
    unitFee: any;
    totalTradeQuantity: any;
    totalTradeValue: any;
    tradeQuantity24: any;
    tradeValue24: any;
    currentQuantity: any;
}
export interface NetworkExchangeTokenViewResponse {
    /** * The timestamp when the response was generated. Useful to show data staleness to users. */
    updated_at: Date;
    /** * The requested chain ID eg: `1`. */
    chain_id: number;
    /** * The requested chain name eg: `eth-mainnet`. */
    chain_name: string;
    /** * List of response items. */
    items: TokenV2VolumeWithChartData[];
    /** * Pagination metadata. */
    pagination: Pagination;
}
export interface TokenV2VolumeWithChartData {
    /** * The requested chain name eg: `eth-mainnet`. */
    chain_name: string;
    /** * The requested chain ID eg: `1`. */
    chain_id: string;
    /** * The name of the DEX, eg: `uniswap_v2`. */
    dex_name: string;
    /** * Use the relevant `contract_address` to lookup prices, logos, token transfers, etc. */
    contract_address: string;
    /** * The string returned by the `name()` method. */
    contract_name: string;
    /** * A list of explorers for this address. */
    explorers: Explorer[];
    /** * The total liquidity unscaled value. */
    total_liquidity: string;
    /** * The total volume 24h unscaled value. */
    total_volume_24h: string;
    /** * The contract logo URL. */
    logo_url: string;
    /** * The ticker symbol for this contract. This field is set by a developer and non-unique across a network. */
    contract_ticker_symbol: string;
    /** * Use contract decimals to format the token balance for display purposes - divide the balance by `10^{contract_decimals}`. */
    contract_decimals: number;
    /** * The total amount of swaps in the last 24h. */
    swap_count_24h: number;
    /** * The exchange rate for the requested quote currency. */
    quote_rate: number;
    /** * The 24h exchange rate for the requested quote currency. */
    quote_rate_24h: number;
    /** * A prettier version of the exchange rate for rendering purposes. */
    pretty_quote_rate: string;
    /** * A prettier version of the 24h exchange rate for rendering purposes. */
    pretty_quote_rate_24h: string;
    /** * A prettier version of the total liquidity quote for rendering purposes. */
    pretty_total_liquidity_quote: string;
    /** * A prettier version of the 24h volume quote for rendering purposes. */
    pretty_total_volume_24h_quote: string;
    /** * The total liquidity converted to fiat in `quote-currency`. */
    total_liquidity_quote: number;
    /** * The total volume 24h converted to fiat in `quote-currency`. */
    total_volume_24h_quote: number;
    /** * The number of transactions in the last 24h. */
    transactions_24h: number;
    volume_timeseries_7d: VolumeTokenTimeseries[];
    volume_timeseries_30d: VolumeTokenTimeseries[];
    liquidity_timeseries_7d: LiquidityTokenTimeseries[];
    liquidity_timeseries_30d: LiquidityTokenTimeseries[];
    price_timeseries_7d: PriceTokenTimeseries[];
    price_timeseries_30d: PriceTokenTimeseries[];
    id: any;
    name: any;
    decimals: any;
    symbol: any;
    logo_url: any;
    valueSymbol: any;
    totalFee: any;
    price: any;
    price_24h: any;
    totalFeeValue: any;
    fee24: any;
    feeValue24: any;
    unitFee: any;
    totalTradeQuantity: any;
    totalTradeValue: any;
    tradeQuantity24: any;
    tradeValue24: any;
    currentQuantity: any;
    address:string;
    exp_url:string;
    investQuantity24:any;
    APY:any;
    investValue24: any;
    totalInvestQuantity: any;
    totalInvestValue: any;
    totalDisinvestQuantity: any;
    totalDisinvestValue: any;
    totalTradeCount: any;
    totalInvestCount: any;
    owner: any;
    buyFee: any;
    sellFee: any;
    investFee: any;
    divestFee: any;
    swapChips: any;
    divestChips: any;
    currentValue: any;
    investQuantity: any;
    investValue: any;
    currentFee: any;
    currentFeeValue: any;
}
export interface VolumeTokenTimeseries {
    /** * The name of the DEX, eg: `uniswap_v2`. */
    dex_name: string;
    /** * The requested chain ID eg: `1`. */
    chain_id: string;
    /** * The current date. */
    dt: Date;
    /** * The total volume unscaled for this day. */
    total_volume: string;
    /** * The volume in `quote-currency` denomination. */
    volume_quote: number;
    /** * A prettier version of the volume quote for rendering purposes. */
    pretty_volume_quote: string;
}
export interface LiquidityTokenTimeseries {
    /** * The name of the DEX, eg: `uniswap_v2`. */
    dex_name: string;
    /** * The requested chain ID eg: `1`. */
    chain_id: string;
    /** * The current date. */
    dt: Date;
    /** * The total liquidity unscaled up to this day. */
    total_liquidity: string;
    /** * The liquidity in `quote-currency` denomination. */
    liquidity_quote: number;
    /** * A prettier version of the liquidity quote for rendering purposes. */
    pretty_liquidity_quote: string;
}
export interface PriceTokenTimeseries {
    /** * The name of the DEX, eg: `uniswap_v2`. */
    dex_name: string;
    /** * The requested chain ID eg: `1`. */
    chain_id: string;
    /** * The current date. */
    dt: Date;
    /** * The currency to convert. Supports `USD`, `CAD`, `EUR`, `SGD`, `INR`, `JPY`, `VND`, `CNY`, `KRW`, `RUB`, `TRY`, `NGN`, `ARS`, `AUD`, `CHF`, and `GBP`. */
    quote_currency: string;
    /** * The exchange rate for the requested quote currency. */
    quote_rate: number;
    /** * A prettier version of the exchange rate for rendering purposes. */
    pretty_quote_rate: string;
}
export interface SupportedDexesResponse {
    /** * The timestamp when the response was generated. Useful to show data staleness to users. */
    updated_at: Date;
    /** * List of response items. */
    items: SupportedDex[];
    /** * Pagination metadata. */
    pagination: Pagination;
}
export interface SingleNetworkExchangeTokenResponse {
    /** * The timestamp when the response was generated. Useful to show data staleness to users. */
    updated_at: Date;
    /** * The requested chain ID eg: `1`. */
    chain_id: number;
    /** * The requested chain name eg: `eth-mainnet`. */
    chain_name: string;
    /** * List of response items. */
    items: PoolWithTimeseries[];
    /** * Pagination metadata. */
    pagination: Pagination;
}
export interface TransactionsForAccountAddressResponse {
    /** * The timestamp when the response was generated. Useful to show data staleness to users. */
    updated_at: Date;
    /** * The requested chain ID eg: `1`. */
    chain_id: number;
    /** * The requested chain name eg: `eth-mainnet`. */
    chain_name: string;
    /** * List of response items. */
    items: ExchangeTransaction[];
    /** * Pagination metadata. */
    pagination: Pagination;
}
export interface ExchangeTransaction {
    /** * The block signed timestamp in UTC. */
    block_signed_at: Date;
    /** * The requested transaction hash. */
    hash: string;
    act: string;
    /** * The requested address. */
    address: string;
    /** * A list of explorers for this transaction. */
    explorers: Explorer[];
    amount_0: string;
    amount_1: string;
    amount_0_in: string;
    amount_0_out: string;
    amount_1_in: string;
    amount_1_out: string;
    to_address: string;
    from_address: string;
    sender_address: string;
    total_quote: number;
    /** * A prettier version of the total quote for rendering purposes. */
    pretty_total_quote: string;
    /** * The value attached to this tx. */
    value: bigint | null;
    /** * The value attached in `quote-currency` to this tx. */
    value_quote: number;
    /** * A prettier version of the quote for rendering purposes. */
    pretty_value_quote: string;
    /** * The requested chain native gas token metadata. */
    gas_metadata: ContractMetadata;
    /** * The amount of gas supplied for this tx. */
    gas_offered: number;
    /** * The gas spent for this tx. */
    gas_spent: number;
    /** * The gas price at the time of this tx. */
    gas_price: number;
    /** * The total transaction fees (`gas_price` * `gas_spent`) paid for this tx, denoted in wei. */
    fees_paid: bigint | null;
    /** * The gas spent in `quote-currency` denomination. */
    gas_quote: number;
    /** * A prettier version of the quote for rendering purposes. */
    pretty_gas_quote: string;
    /** * The native gas exchange rate for the requested `quote-currency`. */
    gas_quote_rate: number;
    /** * The requested quote currency eg: `USD`. */
    quote_currency: string;
    token_0: PoolToken;
    token_1: PoolToken;
    token_0_quote_rate: number;
    token_1_quote_rate: number;
}
export interface PoolToken {
    /** * Use contract decimals to format the token balance for display purposes - divide the balance by `10^{contract_decimals}`. */
    contract_decimals: number;
    /** * The string returned by the `name()` method. */
    contract_name: string;
    /** * The ticker symbol for this contract. This field is set by a developer and non-unique across a network. */
    contract_ticker_symbol: string;
    /** * Use the relevant `contract_address` to lookup prices, logos, token transfers, etc. */
    contract_address: string;
    /** * A list of supported standard ERC interfaces, eg: `ERC20` and `ERC721`. */
    supports_erc: string[];
    /** * The contract logo URL. */
    logo_url: string;
}
export interface TransactionsForTokenAddressResponse {
    /** * The timestamp when the response was generated. Useful to show data staleness to users. */
    updated_at: Date;
    /** * The requested chain ID eg: `1`. */
    chain_id: number;
    /** * The requested chain name eg: `eth-mainnet`. */
    chain_name: string;
    /** * List of response items. */
    items: ExchangeTransaction[];
    /** * Pagination metadata. */
    pagination: Pagination;
}
export interface TransactionsForExchangeResponse {
    /** * The timestamp when the response was generated. Useful to show data staleness to users. */
    updated_at: Date;
    /** * The requested chain ID eg: `1`. */
    chain_id: number;
    /** * The requested chain name eg: `eth-mainnet`. */
    chain_name: string;
    /** * List of response items. */
    items: ExchangeTransaction[];
    /** * Pagination metadata. */
    pagination: Pagination;
}
export interface NetworkTransactionsResponse {
    /** * The timestamp when the response was generated. Useful to show data staleness to users. */
    updated_at: Date;
    /** * The requested chain ID eg: `1`. */
    chain_id: number;
    /** * The requested chain name eg: `eth-mainnet`. */
    chain_name: string;
    /** * List of response items. */
    items: ExchangeTransaction[];
    /** * Pagination metadata. */
    pagination: Pagination;
}
export interface EcosystemChartDataResponse {
    /** * The timestamp when the response was generated. Useful to show data staleness to users. */
    updated_at: Date;
    /** * The requested chain ID eg: `1`. */
    chain_id: number;
    /** * The requested chain name eg: `eth-mainnet`. */
    chain_name: string;
    /** * List of response items. */
    items: UniswapLikeEcosystemCharts[];
    /** * Pagination metadata. */
    pagination: Pagination;
}
export interface UniswapLikeEcosystemCharts {
    /** * The name of the DEX, eg: `uniswap_v2`. */
    dex_name: string;
    /** * The requested chain ID eg: `1`. */
    chain_id: string;
    /** * The requested quote currency eg: `USD`. */
    quote_currency: string;
    gas_token_price_quote: number;
    total_swaps_24h: number;
    total_active_pairs_7d: number;
    total_fees_24h: number;
    /** * A prettier version of the gas quote for rendering purposes. */
    pretty_gas_token_price_quote: string;
    /** * A prettier version of the 24h total fees for rendering purposes. */
    pretty_total_fees_24h: string;
    volume_chart_7d: VolumeEcosystemChart[];
    volume_chart_30d: VolumeEcosystemChart[];
    liquidity_chart_7d: LiquidityEcosystemChart[];
    liquidity_chart_30d: LiquidityEcosystemChart[];
}
export interface VolumeEcosystemChart {
    /** * The name of the DEX, eg: `uniswap_v2`. */
    dex_name: string;
    /** * The requested chain ID eg: `1`. */
    chain_id: string;
    dt: Date;
    /** * The requested quote currency eg: `USD`. */
    quote_currency: string;
    volume_quote: number;
    /** * A prettier version of the volume quote for rendering purposes. */
    pretty_volume_quote: string;
    swap_count_24: number;
}
export interface LiquidityEcosystemChart {
    /** * The name of the DEX, eg: `uniswap_v2`. */
    dex_name: string;
    /** * The requested chain ID eg: `1`. */
    chain_id: string;
    dt: Date;
    /** * The requested quote currency eg: `USD`. */
    quote_currency: string;
    liquidity_quote: number;
    /** * A prettier version of the liquidity quote for rendering purposes. */
    pretty_liquidity_quote: string;
}
export interface HealthDataResponse {
    /** * The timestamp when the response was generated. Useful to show data staleness to users. */
    updated_at: Date;
    /** * The requested chain ID eg: `1`. */
    chain_id: number;
    /** * The requested chain name eg: `eth-mainnet`. */
    chain_name: string;
    /** * List of response items. */
    items: HealthData[];
    /** * Pagination metadata. */
    pagination: Pagination;
}
export interface HealthData {
    synced_block_height: number;
    synced_block_signed_at: Date;
    latest_block_height: number;
    latest_block_signed_at: Date;
}
