import apolloClient from '@/services/graphql/apollo'
import { gql } from '@apollo/client'

//AggregateIndexQ
export function AggregateIndexQ(params: { id: string; eq7: number; eq30: number; time: number; }, ssionChian: number) {
	return apolloClient(ssionChian).query({
		query: gql`query ($id: BigInt, $eq7: BigInt, $eq30: BigInt, $time: BigInt) {
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
					marketStates {
						goodCount
						proofCount
						totalDisinvestCount
						totalDisinvestValue
						totalInvestCount
						totalInvestValue
						totalTradeCount
						totalTradeValue
						txCount
						userCount
					}
					goodStates(
						where: {id_not: "0x0000000000000000000000000000000000000000", islockgood: false}
						orderBy: currentValue
						orderDirection: desc
						first: 5
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
					days70: marketDatas(
						first: 1
						orderBy: modifiedTime
						orderDirection: desc
						where: {timetype: "w", modifiedTime_lte: $eq7}
					) {
						modifiedTime
						totalInvestValue
						totalTradeValue
						timetype
						id
					}
					days7: marketDatas(
						orderBy: modifiedTime
						orderDirection: asc
						where: {timetype: "w", modifiedTime_gte: $eq7}
					) {
						modifiedTime
						totalInvestValue
						totalTradeValue
						timetype
						id
					}
					days31: marketDatas(
						first: 1
						orderBy: modifiedTime
						orderDirection: desc
						where: {timetype: "m", modifiedTime_lte: $eq30}
					) {
						modifiedTime
						totalInvestValue
						totalTradeValue
						timetype
						id
					}
					days30: marketDatas(
						orderBy: modifiedTime
						orderDirection: asc
						where: {timetype: "m", modifiedTime_gte: $eq30}
					) {
						modifiedTime
						totalInvestValue
						totalTradeValue
						timetype
						id
					}
				}`,
		variables: params
	})
}

//Overview 走势图数据
export function ecosystemChartData(params: { id: string; eq7: number; eq30: number }, ssionChian: number) {
	return apolloClient(ssionChian).query({
		query: gql`query($id: BigInt,$eq7: BigInt,$eq30: BigInt) {
			goodState(id: $id) {
				currentQuantity
				currentValue
				id
				tokenname
				tokensymbol
				tokendecimals
			}
			days70: marketDatas(
				first: 1
				orderBy: modifiedTime
    			orderDirection: desc
				where: {timetype: "w", modifiedTime_lte: $eq7}
				) {
				modifiedTime
				totalInvestValue
				totalTradeValue
				timetype
				id
			}
			days7: marketDatas(
				orderBy: modifiedTime
    			orderDirection: asc
				where: {timetype: "w", modifiedTime_gte: $eq7}
				) {
				modifiedTime
				totalInvestValue
				totalTradeValue
				timetype
				id
			}
			days31: marketDatas(
				first: 1
				orderBy: modifiedTime
    			orderDirection: desc
				where: {timetype: "m", modifiedTime_lte: $eq30}
				) {
				modifiedTime
				totalInvestValue
				totalTradeValue
				timetype
				id
			}
			days30: marketDatas(
				orderBy: modifiedTime
    			orderDirection: asc
				where: {timetype: "m", modifiedTime_gte: $eq30}) {
				modifiedTime
				totalInvestValue
				totalTradeValue
				timetype
				id
			}
		}`,
		variables: params
	})
}

//记录列表
export function transactions(params: { id: string; first: number }, ssionChian: number) {
	return apolloClient(ssionChian).query({
		query: gql`query($id: BigInt,$first: Int) {
			goodState(id: $id) {
				currentQuantity
				currentValue
				id
				tokenname
				tokensymbol
				tokendecimals
			}
			transactions(first: $first, orderDirection: desc, orderBy: timestamp) {
				blockNumber
				hash
				id
				recipent
				timestamp
				transtype
				fromgoodQuanity
				fromgoodfee
				transvalue
				frompargood {
				tokenname
				tokensymbol
				tokendecimals
				currentValue
				currentQuantity
				}
				togoodQuantity
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

//物品列表
export function parGoodDatas(params: { id: string; first: number; time: number; skips: number }, ssionChian: number) {
	return apolloClient(ssionChian).query({
		query: gql`query($id: BigInt,$first: Int,$time: BigInt,$skips: Int) {
			goodState(id: $id) {
				currentQuantity
				currentValue
				id
				tokenname
				tokensymbol
				tokendecimals
			}
			goodStates(
				first: $first
				skip: $skips
				where: {id_not: "0x0000000000000000000000000000000000000000"}
				) {
				id
				tokenname
				tokensymbol
				tokendecimals
				totalTradeQuantity
				totalProfit
				erc20Address
				currentQuantity
				currentValue
				isvaluegood
				islockgood
				goodData(
					orderBy: modifiedTime
					orderDirection: desc
					first: 1
					where: {modifiedTime_lte: $time, timetype: "d"}
				  ) {
					id
					decimals
					modifiedTime
					totalProfit
					totalTradeQuantity
					timetype
					currentQuantity
					currentValue
				}
			  }
		}`,
		variables: params
	})
}


//投资列表
export function InvestGoodDatas(params: {
	id: string; first: number; time: number; time24: number; skip: number; address: string
}, ssionChian: number) {
	if (params.address === "0") {
		return apolloClient(ssionChian).query({
			query: gql`query($id: BigInt,$first: Int,$time: BigInt,$time24: BigInt,$skip: Int) {
				goodState(id: $id) {
					currentValue
					currentQuantity
					id
					tokendecimals
					tokenname
					tokensymbol
				}
				goodStates(
					first: $first
					skip: $skip
					orderBy: currentValue
					orderDirection: desc
					where: {id_not: "0x0000000000000000000000000000000000000000", islockgood: false}
					) {
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
						investShares
						isvaluegood
						islockgood
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
							investActualQuantity
						}
				  }
			}`,
			variables: params
		})
	} else {
		return apolloClient(ssionChian).query({
			query: gql`query($id: BigInt,$first: Int,$time: BigInt,$time24: BigInt,$skip: Int,$address: String) {
				goodState(id: $id) {
					currentValue
					currentQuantity
					id
					tokendecimals
					tokenname
					tokensymbol
				}
				goodStates(
					first: $first
					skip: $skip
					orderBy: currentValue
					orderDirection: desc
					where: {id_not: "0x0000000000000000000000000000000000000000",owner: $address}
					) {
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
						investShares
						isvaluegood
						islockgood
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
							investActualQuantity
						}
				  }
			}`,
			variables: params
		})
	}
}
