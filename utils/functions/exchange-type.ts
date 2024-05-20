import { type ExchangeTransaction } from "@covalenthq/client-sdk";

export const handleExchangeType = (
    transaction: ExchangeTransaction,
    token_num: number
) => {
    if (token_num === 0) {
         // @ts-ignore
        if (transaction.amount_0_in.toString() === "0") {
            return "out";
        }
         // @ts-ignore
        if (transaction.amount_0_out.toString() === "0") {
            return "in";
        }
    }
    if (token_num === 1) {
         // @ts-ignore
        if (transaction.amount_1_in.toString() === "0") {
            return "out";
        }
         // @ts-ignore
        if (transaction.amount_1_out.toString() === "0") {
            return "in";
        }
    }
};
