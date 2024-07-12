import apolloClient from '@/graphql/apollo'
import { gql } from '@apollo/client'


//物品列表
export function parGoodDatas(params: { id: string;sel:string }) {
// console.log(params,3333333322222)
// 	let where;
	if (params.sel!=="") {
				
		// where=`{or: [{erc20Address_starts_with: $sel}, 
		// 	{tokenname_contains: $sel},
		// 	{tokensymbol_contains: $sel}]}`	
			return apolloClient.query({
				query: gql`query($id: BigInt,$sel:String) {
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
		return apolloClient.query({
			query: gql`query($id: BigInt,$sel:String) {
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
					where:{id_not: "0"}) {
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

