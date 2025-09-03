//article.js
// import { useQuery } from '@vue/apollo-composable';
import apolloClient from '@/graphql/apollo'
import { gql } from '@apollo/client'

//物品列表
export function parGoodDatas(params: { id: string; sel: string; gid: string; time: number; }, ssionChian: number) {
    if (params.gid !== "") {
        return apolloClient(ssionChian).query({
            query: gql
                `query ($id: BigInt, $time: BigInt, $gid: String, $sel: String) {
                    goodState(id: $id) {
                        currentQuantity
                        currentValue
                        id
                        tokenname
                        tokensymbol
                        tokendecimals
                    }
                    goodStates(where: {id_not: "0x0000000000000000000000000000000000000000", isvaluegood: true}) {
                        id
                        isvaluegood
                        tokenname
                        tokensymbol
                        tokendecimals
                        erc20Address
                        goodConfig
                        currentQuantity
                        currentValue
                        feeQuantity
                        investQuantity
						investShares
                    }
                    parGoodStates :goodStates(where: {id: $gid}) {
                            id
                            isvaluegood
                            currentQuantity
                            currentValue
                            erc20Address
                            feeQuantity
                            goodConfig
                            tokenname
                            tokensymbol
                            tokendecimals
                            investQuantity
                            modifiedTime
						    investShares
                            goodData(
                                first: 1
                                orderBy: modifiedTime
                                orderDirection: desc
                                where: {timetype: "y", modifiedTime_lte: $time}
                            ) {
                                feeQuantity
                                investQuantity
                                modifiedTime
						        investShares
                            }
                    }
                }`,
            variables: params
        })
    } else {
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
                    }
                    goodStates(where: {id_not: "0x0000000000000000000000000000000000000000", isvaluegood: true}) {
                        id
                        isvaluegood
                        tokenname
                        tokensymbol
                        tokendecimals
                        erc20Address
                        goodConfig
                        currentQuantity
                        currentValue
                        feeQuantity
                        investQuantity
						investShares
                    }
                    parGoodStates :goodStates(
                        where: {or: [{erc20Address_starts_with: $sel}, {symbol_lower_contains: $sel}, {name_lower_contains: $sel}]}
                        orderBy: currentValue
                        orderDirection: desc
                    ) {
                            id
                            isvaluegood
                            currentQuantity
                            currentValue
                            erc20Address
                            feeQuantity
                            goodConfig
                            tokenname
                            tokensymbol
                            tokendecimals
                            investQuantity
                            modifiedTime
						    investShares
                            goodData(
                                first: 1
                                orderBy: modifiedTime
                                orderDirection: desc
                                where: {timetype: "y", modifiedTime_lte: $time}
                            ) {
                                feeQuantity
                                investQuantity
                                modifiedTime
						        investShares
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
                        }
                        goodStates(where: {id_not: "0x0000000000000000000000000000000000000000", isvaluegood: true}) {
                            id
                            isvaluegood
                            tokenname
                            tokensymbol
                            tokendecimals
                            erc20Address
                            goodConfig
                            currentQuantity
                            currentValue
                            feeQuantity
                            investQuantity
						    investShares
                        }
                        parGoodStates :goodStates(where: {id_not: "0x0000000000000000000000000000000000000000"}, orderBy: currentValue, orderDirection: desc) {
                                id
                                isvaluegood
                                currentQuantity
                                currentValue
                                erc20Address
                                feeQuantity
                                goodConfig
                                tokenname
                                tokensymbol
                                tokendecimals
                                investQuantity
                                modifiedTime
						        investShares
                                goodData(
                                    first: 1
                                    orderBy: modifiedTime
                                    orderDirection: desc
                                    where: {timetype: "y", modifiedTime_lte: $time}
                                ) {
                                    feeQuantity
                                    investQuantity
                                    modifiedTime
						            investShares
                                }
                        }
                    }`,
                variables: params
            })
        }
    }
}


