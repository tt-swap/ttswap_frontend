//article.js
// import { useQuery } from '@vue/apollo-composable';
import apolloClient from '@/graphql/apollo'
import { gql } from '@apollo/client'

//Overview 走势图数据
export function ecosystemChartData(params: { id: string; eq7: number; eq30: number },ssionChian:number) {
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
export function transactions(params: { id: string; first: number },ssionChian:number) {
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
export function parGoodDatas(params: { id: string; first: number; time: number; skips: number },ssionChian:number) {
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
				where: {id_not: "0"}
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
					open
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
	id: string; first: number; time: number; time24: number; skip: number
},ssionChian:number) {
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
				where: {id_not: "0"}
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
					}
			  }
		}`,
		variables: params
	})
}
