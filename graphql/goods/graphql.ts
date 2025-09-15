
import apolloClient from '@/graphql/apollo'
import { gql } from '@apollo/client'

//goodsTransactions记录列表
export function goodsTransactions(params: { id: string; first: number; skip: number; address: string }, ssionChian: number) {

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


// 我的物品
// export async function myGoodDatas(params: {
//     id: string; first: number; time: number; skip: number; address: string
// }, ssionChian: number) {
//     return apolloClient(ssionChian).query({
//         query: gql`query($id: BigInt,$first: Int,$time: BigInt,$skip: Int,$address:String) {
//             goodState(id: $id) {
//                 currentValue
//                 currentQuantity
//                 id
//                 tokendecimals
//                 tokenname
//                 tokensymbol
//             }
//             goodStates(
//                 first: $first
//                 skip: $skip
//                 where: {owner: $address}
//                 ) {
//                     id
//                     tokenname
//                     tokensymbol
//                     tokendecimals
//                     erc20Address
//                     currentQuantity
//                     currentValue
//                     totalInvestQuantity
//                     totalInvestCount
//                     investQuantity
//                     feeQuantity
//                     goodData(
//                         orderBy: modifiedTime
//                         orderDirection: desc
//                         first: 1
//                         where: {modifiedTime_lte: $time, timetype: "d"}
//                       ) {
//                         id
//                         decimals
//                         modifiedTime
//                         open
//                         timetype
//                         totalInvestQuantity
//                         totalInvestCount
//                         feeQuantity
//                         investQuantity
//                         currentQuantity
//                         currentValue
//                         good {
//                             id
//                             tokenname
//                             tokendecimals
//                             tokensymbol
//                         }
//                     }
//               }
//         }`,
//         variables: params
//     })
// }

//我的撤资数据
// export function myDisInvestProof(params: { id: number; }, ssionChian: number) {
//     return apolloClient(ssionChian).query({
//         query: gql`query($id: BigInt) {
//             proofState(id: $id) {
//                 id
//                 proofValue
//                 good1ContructFee
//                 good1Quantity
//                 good2ContructFee
//                 good2Quantity
//                 createTime
//                 good1 {
//                   id
//                   tokendecimals
//                   tokensymbol
//                   goodConfig
//                   erc20Address
//                   currentQuantity
//                   currentValue
//                   feeQuantity
//                   investQuantity
//                   isvaluegood
//                 }
//                 good2 {
//                   id
//                   tokendecimals
//                   tokensymbol
//                   goodConfig
//                   erc20Address
//                   currentQuantity
//                   currentValue
//                   feeQuantity
//                   investQuantity
//                 }
//               }
//         }`,
//         variables: params
//     })
// }


// 我的指标
// export function myIndex(params: { id: string, address: string }, ssionChian: number) {
//     return apolloClient(ssionChian).query({
//         query: gql`query($id: BigInt,$address: String) {
//             goodState(id: $id) {
//                 currentQuantity
//                 currentValue
//                 id
//                 tokenname
//                 tokensymbol
//                 tokendecimals
//             }
//             customer(id: $address) {
//                 id
//                 disinvestCount
//                 disinvestValue
//                 investCount
//                 investValue
//                 tradeCount
//                 tradeValue
//                 totalcommissionvalue
//                 totalprofitvalue
//               }
//         }`,
//         variables: params
//     })
// }


// My Commission
// export function myCommission(params: { id: string, first: number; skip: number; }, ssionChian: number) {
//     return apolloClient(ssionChian).query({
//         query: gql`query($id: BigInt,$first: Int,$skip: Int) {
//             goodState(id: $id) {
//                 currentQuantity
//                 currentValue
//                 id
//                 tokenname
//                 tokensymbol
//                 tokendecimals
//             }
//             goodStates(
//                 first: $first
//                 skip: $skip
//                 orderBy: totalTradeCount
//                 orderDirection: desc
//                 where: {id_not: "0x0000000000000000000000000000000000000000"}
//                 ) {
//                 id
//                 tokensymbol
//                 tokenname
//                 tokendecimals
//                 erc20Address
//                 feeQuantity
//                 totalTradeCount
//                 currentQuantity
//                 currentValue
//                 goodConfig
//               }
//         }`,
//         variables: params
//     })
// }



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
                        where: {or: [{erc20Address_starts_with: $sel}, {symbol_lower_contains: $sel}, {name_lower_contains: $sel}]}
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
                        goodData (
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
                    goodStates(where: {id_not: "0x0000000000000000000000000000000000000000"}, orderBy: currentValue, orderDirection: desc, first: 5) {
                        id
                        erc20Address
                        tokensymbol
                        tokenname
                        tokendecimals
                        isvaluegood
                        currentQuantity
                        currentValue
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
                }`,
            variables: params
        })
    }
}


