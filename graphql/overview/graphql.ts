//article.js
// import { useQuery } from '@vue/apollo-composable';
import apolloClient from '@/graphql/apollo'
import { gql } from '@apollo/client'

//Overview 走势图数据
export function ecosystemChartData(params: { id: string; eq7: number; eq30: number }) {
	return apolloClient.query({
		query: gql`query($id: BigInt,$eq7: BigInt,$eq30: BigInt) {
			goodState(id: $id) {
				currentQuantity
				currentValue
				id
				tokenname
				tokensymbol
				tokendecimals
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
export function transactions(params: { id: string; first: number }) {
	return apolloClient.query({
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
export function parGoodDatas(params: { id: string; first: number; time: number; skips: number }) {
	return apolloClient.query({
		query: gql`query($id: BigInt,$first: Int,$time: BigInt,$skips: Int) {
			goodState(id: $id) {
				currentQuantity
				currentValue
				id
				tokenname
				tokensymbol
				tokendecimals
			}
			parGoodStates(
				first: $first
				skip: $skips
				where: {id_not: "0"}
				) {
				id
				goodCount
				tokenname
				tokensymbol
				tokendecimals
				totalTradeQuantity
				totalProfit
				erc20Address
				currentQuantity
				currentValue
				parGooddata(
					orderBy: modifiedTime
					orderDirection: asc
					first: 1
					where: {modifiedTime_gte: $time, timetype: "d"}
				  ) {
					id
					decimals
					modifiedTime
					totalProfit
					totalTradeQuantity
					open
					timetype
					pargood {
					  tokenname
					  tokendecimals
					  tokensymbol
					  id
					  currentQuantity
					  currentValue
					}
				}
			  }
		}`,
		variables: params
	})
}


//投资列表
export function InvestGoodDatas(params: {
	id: string; first: number; time: number; skip: number
}) {
	return apolloClient.query({
		query: gql`query($id: BigInt,$first: Int,$time: BigInt,$skip: Int) {
			goodState(id: $id) {
				currentValue
				currentQuantity
				id
				tokendecimals
				tokenname
				tokensymbol
			}
			parGoodStates(
				first: $first
				skip: $skip
				where: {id_not: "0"}
				) {
					id
					goodCount
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
					parGooddata(
						orderBy: modifiedTime
						orderDirection: desc
						first: 1
						where: {modifiedTime_lte: $time, timetype: "d"}
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
						pargood {
							id
							tokenname
							tokendecimals
							tokensymbol
							currentQuantity
							currentValue
							investQuantity
						}
					}
			  }
			  
		}`,
		variables: params
	})
}
