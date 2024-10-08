import { type ChainActivityEvent } from "@covalenthq/client-sdk";
import {
    type BalanceItem,
    type BlockTransactionWithContractTransfers,
    type Chain,
} from "@covalenthq/client-sdk";

export interface NFTDetailViewProps {
    chain_name: Chain;
    collection_address: string;
    token_id: string;
}

export interface XYKPoolDetailViewProps {
    chain_name: Chain;
    dex_name: string;
    pool_address: string;
    value_good_id:string;
    chain_id:number;
}

export interface NFTWalletCollectionViewProps {
    chain_name: Chain;
    address: string;
}

export interface NFTWalletTokenListViewProps {
    chain_names: Chain[];
    address: string;
}

export interface NFTCollectionTokenListViewProps {
    chain_name: Chain;
    collection_address: string;
    on_nft_click: Function;
}

export interface AddressActivityListViewProps {
    address: string;
    get_all_row_selection?: (newValue: ChainActivityEvent[]) => void;
    get_row_selection_state?: (selectionState: {
        [key: string]: boolean;
    }) => void;
    row_selection_state?: { [key: string]: boolean };
}

export interface TokenTransferMeta {
    chain_name: string;
    contract_ticker_symbol: string;
    logo_url: string;
    value_good_id:string;
}

export interface BlockTransactionWithContractTransfersWithDelta
    extends BlockTransactionWithContractTransfers {
    delta_quote: number;
    delta: bigint | null;
    value_good_id:string;
}

export interface TokenTransfersListViewProps {
    chain_name: Chain;
    address: string;
    contract_address: string;
    value_good_id:string;
    is_over:boolean;
}

export interface XYKPoolTransactionsListViewProps {
    chain_name: Chain;
    dex_name: string;
    pool_address: string;
    on_transaction_click?: Function;
    on_native_explorer_click?: Function;
    on_goldrush_receipt_click?: Function;
    value_good_id:string;
    is_over:boolean;
}

export interface XYKTokenTransactionsListViewProps {
    chain_name: Chain;
    dex_name: string;
    token_address: string;
    on_transaction_click?: Function;
    on_native_explorer_click?: Function;
    on_goldrush_receipt_click?: Function;
    value_good_id:string;
    is_over:boolean;
    page_size:number;
    chain_id:number;
}

export interface XYKWalletTransactionsListViewProps {
    chain_name: Chain;
    dex_name: string;
    wallet_address: any;
    on_transaction_click?: Function;
    on_native_explorer_click?: Function;
    on_goldrush_receipt_click?: Function;
    data_num:number;
    value_good_id:string;
    is_over:boolean;
    page_size:number;
    chain_id:number;
}

export interface TokenBalancesListViewProps {
    chain_names: Chain[];
    address: string;
    hide_small_balances?: boolean;
    mask_balances?: boolean;
    on_transfer_click?: Function;
    value_good_id:string;
    is_over:boolean;
}

export interface XYKTokenListViewProps {
    chain_name: Chain;
    dex_name: string;
    on_token_click: Function;
    page_size?: number;
    value_good_id:string;
    is_over:boolean;
    chain_id:number;
}

export interface CrossChainBalanceItem extends BalanceItem {
    chain: Chain;
}

export interface XYKPoolListViewProps {
    chain_name: Chain;
    dex_name: string;
    on_pool_click?: Function;
    page_size?: number;
    value_good_id:string;
    is_over:boolean;
    wallet_address: any;
    data_num:number;
    chain_id:number;
}

export interface XYKTokenPoolListViewProps {
    chain_name: Chain;
    dex_name: string;
    token_address: string;
    on_pool_click?: Function;
    value_good_id:string;
    is_over:boolean;
    data_num:number;
}

export interface XYKWalletPoolListViewProps {
    chain_name: Chain;
    dex_name: string;
    wallet_address: any;
    on_pool_click?: Function;
    data_num:number;
    value_good_id:string;
    is_over:boolean;
}

export interface XYKWalletPositionsListViewProps {
    chain_name: Chain;
    dex_name: string;
    wallet_address: any;
    on_pool_click?: Function;
    data_num:number;
    page_size?: number;
    value_good_id:string;
    is_over:boolean;
    chain_id:number;

}

export interface XYKTokenDetailViewProps {
    chain_name: Chain;
    dex_name: string;
    token_address: string;
    value_good_id:string;
    is_over:boolean;
    chain_id:number;
}

export interface XYKOverviewTransactionsListViewProps {
    chain_name: Chain;
    dex_name: string;
    on_transaction_click?: Function;
    on_native_explorer_click?: Function;
    on_goldrush_receipt_click?: Function;
    value_good_id:string;
    is_over:boolean;
    chain_id:number;
}

export interface TransactionReceiptViewProps {
    chain_name: Chain;
    tx_hash: string;
}

export interface AddressDetailsViewProps {
    address: string;
    chain_name: Chain;
}
