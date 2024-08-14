//article.js
// import { useQuery } from '@vue/apollo-composable';
import apolloClient from '@/graphql/apollo'
import { gql } from '@apollo/client'

//物品列表
export function parGoodDatas(params: { id: string; sel: string; time: number; },ssionChian:number) {
	if (params.sel !== "") {
		if (Number(params.sel)>0) {
			return apolloClient(ssionChian).query({
				query: gql`query($id: BigInt,$time: BigInt,$sel:String) {
					goodState(id: $id) {
						currentQuantity
						currentValue
						id
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
						investQuantity
					  }
					parGoodStates(
							where:{Goodlist_: {id: $sel}}) {
							id
							erc20Address
							tokensymbol
							tokenname
							tokendecimals
							Goodlist {
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
								goodData(
								  first: 1
								  orderBy: modifiedTime
								  orderDirection: desc
								  where: {timetype: "d", modifiedTime_lte: $time}
								) {
								  feeQuantity
								  modifiedTime
								}
							}
						}
				}`,
				variables: params
			})
		} else {
			return apolloClient(ssionChian).query({
				query: gql`query($id: BigInt,$time: BigInt,$sel:String) {
					goodState(id: $id) {
						currentQuantity
						currentValue
						id
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
						investQuantity
					  }
					parGoodStates(
						where:{or: [{erc20Address_starts_with: $sel}, 
							{tokenname_contains: $sel},
							{tokensymbol_contains: $sel}]}) {
							id
							erc20Address
							tokensymbol
							tokenname
							tokendecimals
							Goodlist {
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
								goodData(
								  first: 1
								  orderBy: modifiedTime
								  orderDirection: desc
								  where: {timetype: "d", modifiedTime_lte: $time}
								) {
								  feeQuantity
								  modifiedTime
								}
							}
						}
				}`,
				variables: params
			})
		}
	} else {
		return apolloClient(ssionChian).query({
			query: gql`query($id: BigInt,$time: BigInt) {
				goodState(id: $id) {
					currentQuantity
					currentValue
					id
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
					investQuantity
				  }
				parGoodStates(
					where: {id_not: "0"}
					) {
						id
						erc20Address
						tokensymbol
						tokenname
						tokendecimals
						Goodlist {
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
							goodData(
							  first: 1
							  orderBy: modifiedTime
							  orderDirection: desc
							  where: {timetype: "d", modifiedTime_lte: $time}
							) {
							  feeQuantity
							  modifiedTime
							}
						}
					}
			}`,
			variables: params
		})
	}
}

