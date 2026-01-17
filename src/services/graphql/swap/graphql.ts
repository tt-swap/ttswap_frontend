import apolloClient from '@/services/graphql/apollo'
import { gql } from '@apollo/client'


//物品列表
export function parGoodDatas(params: { id: string; sel: string; gid: string; par: number }, ssionChian: number) {
    // console.log(params,"00000000")
    // 	let where;
    if (params.gid !== "") {
        // console.log(params, 3333333322222)
        return apolloClient(ssionChian).query({
            query: gql
                `query($id: BigInt, $gid: String, $sel:String) {
                    goodState(id: $id) {
                        id
                        currentQuantity
                        currentValue
                        tokenname
                        tokensymbol
                        tokendecimals
                    }
                    goodStates(where: {id_not: "0x0000000000000000000000000000000000000000", isvaluegood: true, islockgood: false}
                            orderBy: currentValue
                            orderDirection: desc
                            ) {
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
                    }
                    parGoodStates: goodStates(where: {id: $gid}) {
                        id
                        currentQuantity
                        currentValue
                        erc20Address
                        feeQuantity
                        goodConfig
                        tokenname
                        tokensymbol
                        tokendecimals
                        isvaluegood
                    }
                }`,
            variables: params
        })
    } else {
        // console.log(params, "000000000000--")
        if (params.sel !== "") {
            // console.log(params.sel, "000000000000")
            return apolloClient(ssionChian).query({
                query: gql
                    `query($id: BigInt,$sel:String) {
                        goodState(id: $id) {
                            id
                            currentQuantity
                            currentValue
                            tokenname
                            tokensymbol
                            tokendecimals
                        }
                        goodStates(where: {id_not: "0x0000000000000000000000000000000000000000", isvaluegood: true, islockgood: false}
                            orderBy: currentValue
                            orderDirection: desc
                            ) {
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
                        }
                        parGoodStates: goodStates(
                            where: {and: [{islockgood: false}{
                            or: [{erc20Address_starts_with: $sel}, {symbol_lower_contains: $sel}, {name_lower_contains: $sel}]}]}
                            orderBy: currentValue
                            orderDirection: desc
                        ) {
                            id
                            currentQuantity
                            currentValue
                            erc20Address
                            feeQuantity
                            goodConfig
                            tokenname
                            tokensymbol
                            tokendecimals
                            isvaluegood
                        }
                    }`,
                variables: params
            })
        } else {
            return apolloClient(ssionChian).query({
                query: gql
                    `query($id: BigInt,$sel:String,$par: BigInt) {
                        goodState(id: $id) {
                            id
                            currentQuantity
                            currentValue
                            tokenname
                            tokensymbol
                            tokendecimals
                        }
                        goodStates(where: {id_not: "0x0000000000000000000000000000000000000000", isvaluegood: true, islockgood: false}
                            orderBy: currentValue
                            orderDirection: desc
                            ) {
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
                        }
                        parGoodStates: goodStates(where: {id_not: "0x0000000000000000000000000000000000000000", islockgood: false}, orderBy: currentValue, orderDirection: desc) {
                            id
                            currentQuantity
                            currentValue
                            erc20Address
                            feeQuantity
                            goodConfig
                            tokenname
                            tokensymbol
                            tokendecimals
                            isvaluegood
                        }
                    }`,
                variables: params
            })
        }
    }

}

// newGoodsPrice
export function newGoodsPrices(params: { id: string; from: string; to: string }, ssionChian: number) {
    return apolloClient(ssionChian).query({
        query: gql`query($id: BigInt,$from: BigInt,$to: BigInt) {
			goodState(id: $id) {
				currentQuantity
				currentValue
				id
				tokendecimals
			}
			from: goodStates(where: {id: $from}) {
                id
				currentQuantity
				currentValue
				tokendecimals
                goodConfig
              }
			to: goodStates(where: {id: $to}) {
                id
				currentQuantity
				currentValue
				tokendecimals
                goodConfig
              }
		}`,
        variables: params
    })
}

// SwapNumber
export function SwapNumber(params: { id: string; }, ssionChian: number) {
    return apolloClient(ssionChian).query({
        query: gql`query($id: String) {
            goodState(id: $id) {
                currentQuantity
                currentValue
                feeQuantity
                goodConfig
            }
		}`,
        variables: params
    })
}

// customerRefer
export function customerRefer(params: { id: string; }, ssionChian: number) {
    return apolloClient(ssionChian).query({
        query: gql`query($id: String) {
            customer(id: $id) {
                id
                refer
                customerno
                referralnum
            }
		}`,
        variables: params
    })
}
