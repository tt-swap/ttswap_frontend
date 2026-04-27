
import apolloClient from '@/services/graphql/apollo'
import { gql } from '@apollo/client'

//goodsTransactions记录列表
export function goodsTransactions(params: { id: string; first: number; skip: number; address: string; walletAddress: string }, ssionChian: number) {
    if (params.walletAddress == "0" || params.walletAddress == "") {
        return apolloClient(ssionChian).query({
            query: gql`query($id: BigInt,$address: String,$first: Int,$skip: Int) {
                goodState(id: $id) {
                    currentQuantity
                    currentValue
                    id
                    tokenname
                    tokensymbol
                    tokendecimals
                }
                transactions(
                    where: {or: [{fromgood_: {id: $address}}, {togood_: {id: $address}}]}
                    orderDirection: desc
                    orderBy: timestamp
                    first: $first
                    skip: $skip
                    ) {
                    blockNumber
                    hash
                    id
                    recipent
                    timestamp
                    transtype
                    fromgoodQuanity
                    fromgoodActualQuanity
                    fromgoodfee
                    transvalue
                    fromgood {
                    tokenname
                    tokensymbol
                    tokendecimals
                    currentValue
                    currentQuantity
                    }
                    togoodQuantity
                    togoodActualQuantity
                    togoodfee
                    togood {
                    tokenname
                    tokensymbol
                    tokendecimals
                    currentValue
                    currentQuantity
                    }
                  }
            }`,
            variables: params
        })
    } else {
        return apolloClient(ssionChian).query({
            query: gql`query($id: BigInt,$walletAddress: String,$first: Int,$skip: Int) {
                goodState(id: $id) {
                    currentQuantity
                    currentValue
                    id
                    tokenname
                    tokensymbol
                    tokendecimals
                }
                transactions(
                    where: {recipent: $walletAddress}
                    orderDirection: desc
                    orderBy: timestamp
                    first: $first
                    skip: $skip
                    ) {
                    blockNumber
                    hash
                    id
                    recipent
                    timestamp
                    transtype
                    fromgoodQuanity
                    fromgoodActualQuanity
                    fromgoodfee
                    transvalue
                    fromgood {
                    tokenname
                    tokensymbol
                    tokendecimals
                    currentValue
                    currentQuantity
                    }
                    togoodQuantity
                    togoodActualQuantity
                    togoodfee
                    togood {
                    tokenname
                    tokensymbol
                    tokendecimals
                    currentValue
                    currentQuantity
                    }
                  }
            }`,
            variables: params
        })
    }
}

//goodDataView
export function goodDataView(params: { id: string; time: number; time24: number; address: string; eq7: number; eq30: number }, ssionChian: number) {
    return apolloClient(ssionChian).query({
        query: gql`query($id: BigInt,$address: String,$time: BigInt,$time24: BigInt,$eq7: BigInt,$eq30: BigInt) {
            goodState(id: $id) {
                currentValue
                currentQuantity
                id
                tokendecimals
                tokenname
                tokensymbol
                goodData(
                    first: 1
                    orderBy: modifiedTime
                    orderDirection: desc
                    where: {timetype: "d", modifiedTime_lte: $time24}
                ) {
                    currentQuantity
                    currentValue
                    modifiedTime
                }
            }
            goodStates( where: {id: $address} ) {
                    id
                    tokenname
                    tokensymbol
                    tokendecimals
                    erc20Address
                    currentQuantity
                    currentValue
                    totalInvestQuantity
                    totalInvestCount
                    investQuantity
                    feeQuantity
                    totalTradeCount
                    totalTradeQuantity
                    totalProfit
                    totalDisinvestQuantity
                    owner
                    goodConfig
				  	investShares
                    isvaluegood
                    investActualQuantity
                    goodData(
                        orderBy: modifiedTime
                        orderDirection: desc
                        first: 1
                        where: {modifiedTime_lte: $time, timetype: "y"}
                      ) {
                        id
                        decimals
                        modifiedTime
                        open
                        timetype
                        totalInvestQuantity
                        totalInvestCount
                        feeQuantity
                        investQuantity
                        currentQuantity
                        currentValue
				  	    investShares
                        investActualQuantity
                    }
                    date24: goodData(
                        orderBy: modifiedTime
                        orderDirection: desc
                        first: 1
                        where: {modifiedTime_lte: $time24, timetype: "d"}
                      ) {
                        id
                        decimals
                        modifiedTime
                        timetype
                        totalInvestQuantity
                        totalInvestCount
                        feeQuantity
                        investQuantity
                        currentQuantity
                        currentValue
                        totalTradeQuantity
				  	    investShares
                        investActualQuantity
                    }
                    days7: goodData(
                        orderBy: modifiedTime
                        orderDirection: asc
                        where: {timetype: "w", modifiedTime_gte: $eq7}
                        ) {
                        modifiedTime
                        currentQuantity
                        currentValue
                        timetype
                        id
                    }
                    days30: goodData(
                        orderBy: modifiedTime
                        orderDirection: asc
                        where: {timetype: "m", modifiedTime_gte: $eq30}) {
                        modifiedTime
                        currentQuantity
                        currentValue
                        timetype
                        id
                    }
            }
        }`,
        variables: params
    })
}

//物品搜索列表
export function GoodsSearch(params: { id: string; sel: string; time: number; }, ssionChian: number) {
    if (params.sel !== "") {
        return apolloClient(ssionChian).query({
            query: gql
                `query ($id: BigInt, $time: BigInt, $sel: String) {
                    goodState(id: $id) {
                        currentQuantity
                        currentValue
                        id
                        tokenname
                        tokensymbol
                        tokendecimals
                        goodData(
                            first: 1
                            orderBy: modifiedTime
                            orderDirection: desc
                            where: {timetype: "d", modifiedTime_lte: $time}
                        ) {
                            currentQuantity
                            currentValue
                            modifiedTime
                        }
                    }
                    goodStates(
                        where: { and: [{islockgood: false}{ 
                        or: [{erc20Address_starts_with: $sel}, {symbol_lower_contains: $sel}, {name_lower_contains: $sel}]}]}
                        orderBy: currentValue
                        orderDirection: desc
                    ) {
                        id
                        erc20Address
                        tokensymbol
                        tokenname
                        tokendecimals
                        isvaluegood
                        currentQuantity
                        currentValue
                        totalTradeQuantity
                        goodData (
                                first: 1
                                orderBy: modifiedTime
                                orderDirection: desc
                                where: {timetype: "d", modifiedTime_lte: $time}
                            ) {
                                currentQuantity
                                currentValue
                                modifiedTime
                                totalTradeQuantity
                            }
                    }
                }`,
            variables: params
        })
    } else {
        return apolloClient(ssionChian).query({
            query: gql
                `query ($id: BigInt, $time: BigInt) {
                    goodState(id: $id) {
                        currentQuantity
                        currentValue
                        id
                        tokenname
                        tokensymbol
                        tokendecimals
                        goodData(
                        first: 1
                        orderBy: modifiedTime
                        orderDirection: desc
                        where: {timetype: "d", modifiedTime_lte: $time}
                        ) {
                        currentQuantity
                        currentValue
                        modifiedTime
                        }
                    }
                    goodStates(where: {id_not: "0x0000000000000000000000000000000000000000", islockgood: false}, orderBy: currentValue, orderDirection: desc, first: 5) {
                        id
                        erc20Address
                        tokensymbol
                        tokenname
                        tokendecimals
                        isvaluegood
                        currentQuantity
                        currentValue
                        totalTradeQuantity
                            goodData(
                                first: 1
                                orderBy: modifiedTime
                                orderDirection: desc
                                where: {timetype: "d", modifiedTime_lte: $time}
                            ) {
                                currentQuantity
                                currentValue
                                modifiedTime
                                totalTradeQuantity
                            }
                    }
                }`,
            variables: params
        })
    }
}

//GoodKLine
export function GoodKLine(params: { id: string; sel: string; time: number; }, ssionChian: number) {
    if (params.id !== "") {
        return apolloClient(ssionChian).query({
            query: gql
                `query ($id: String, $time: BigInt, $sel: String) {
                    goodState(id: $id) {
                        currentQuantity
                        currentValue
                        id
                        tokenname
                        tokensymbol
                        tokendecimals
                        goodData(
                        first: 1
                        orderBy: modifiedTime
                        orderDirection: desc
                        where: {timetype: "d", modifiedTime_lte: $time}
                        ) {
                        currentQuantity
                        currentValue
                        modifiedTime
                        }
                    }
                    h24: goodDatas(
                        first: 1
                        orderBy: modifiedTime
                        orderDirection: desc
                        where: {good:$sel, timetype: "d", modifiedTime_lte: $time}
                    ) {
                        close
                        totalTradeQuantity
                        high
                        low
                        open
                        modifiedTime
                        decimals
                    }
                    goodDatas(
                        orderBy: modifiedTime
                        orderDirection: asc
                        where: {good:$sel, timetype: "d", modifiedTime_gte: $time}
                    ) {
                        close
                        totalTradeQuantity
                        high
                        low
                        open
                        modifiedTime
                        decimals
                    }
                }`,
            variables: params
        })
    }
}


