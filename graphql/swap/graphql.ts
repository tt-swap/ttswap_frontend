import apolloClient from '@/graphql/apollo'
import { gql } from '@apollo/client'


//物品列表
export function parGoodDatas(params: { id: string; sel: string; gid: number; par: number }, ssionChian: number) {
    // console.log(params,3333333322222)
    // 	let where;
    if (Number(params.gid) > 0) {
        // console.log(params.sel, 3333333322222)
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
                    goodStates(where: {id_not: "0", isvaluegood: true}) {
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
                    parGoodStates(where: {Goodlist_: {id: $sel}}) {
                        id
                        erc20Address
                        tokensymbol
                        tokenname
                        tokendecimals
                        Goodlist {
                        id
                        currentQuantity
                        currentValue
                        erc20Address
                        feeQuantity
                        goodConfig
                        tokenname
                        tokensymbol
                        tokendecimals
                        }
                    }
                }`,
            variables: params
        })
    } else {
        if (params.sel !== "") {
            // console.log(params.sel, "000000000000")
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
                        goodStates(where: {id_not: "0", isvaluegood: true}) {
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
                        parGoodStates(
                            where: {or: [{erc20Address_starts_with: $sel}, {symbol_lower_contains: $sel}, {name_lower_contains: $sel}]}
                            orderBy: currentValue
                            orderDirection: desc
                        ) {
                            id
                            erc20Address
                            tokensymbol
                            tokenname
                            tokendecimals
                            Goodlist {
                            id
                            currentQuantity
                            currentValue
                            erc20Address
                            feeQuantity
                            goodConfig
                            tokenname
                            tokensymbol
                            tokendecimals
                            }
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
                        goodStates(where: {id_not: "0", isvaluegood: true, tokensymbol_not: $par}) {
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
                        parGoodStates(where: {id_not: "0"}, orderBy: currentValue, orderDirection: desc) {
                            id
                            erc20Address
                            tokensymbol
                            tokenname
                            tokendecimals
                            Goodlist {
                            id
                            currentQuantity
                            currentValue
                            erc20Address
                            feeQuantity
                            goodConfig
                            tokenname
                            tokensymbol
                            tokendecimals
                            }
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
              }
			to: goodStates(where: {id: $to}) {
                id
				currentQuantity
				currentValue
				tokendecimals
              }
		}`,
        variables: params
    })
}
