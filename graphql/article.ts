//article.js
// import { useQuery } from '@vue/apollo-composable';
import apolloClient from './graphql'
import { gql } from '@apollo/client'

//Overview 走势图数据
export function ecosystemChartData(params) {
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
			days7: marketDatas(where: {timetype: "w", modifiedTime_gte: $eq7}) {
				modifiedTime
				totalInvestValue
				totalTradeValue
				timetype
				id
			}
			days30: marketDatas(where: {timetype: "m", modifiedTime_gte: $eq30}) {
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

//价值物品列表
export function goodStates() {
	return apolloClient.query({
		query: gql`query() {
			goodStates(where: {isvaluegood: true}) {
				id
				tokenname
				tokendecimals
				tokensymbol
				isvaluegood
			}
		}`
	})
}
//价值物品
export function goodState(params) {
	return apolloClient.query({
		query: gql`query($id: BigInt) {
			goodState(id: $id) {
				currentQuantity
				currentValue
				id
				tokenname
				tokensymbol
				tokendecimals
			  }
		}`,
		variables: params
	})
}
//记录列表
export function transactions(params) {
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

//my记录列表
export function myTransactions(params) {
	return apolloClient.query({
		query: gql`query($id: BigInt,$address: String) {
			goodState(id: $id) {
				currentQuantity
				currentValue
				id
				tokenname
				tokensymbol
				tokendecimals
			}
			transactions(where: {recipent: $address}, orderDirection: desc, orderBy: timestamp) {
				blockNumber
				hash
				id
				recipent
				timestamp
				transtype
				fromgoodQuanity
				fromgoodfee
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
export function parGoodDatas(params) {
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
			  }
			  parGoodDatas(
				orderBy: modifiedTime
				orderDirection: asc
				first: 1
				where: {modifiedTime_gte: $time, timetype: "d"}
			  ) {
				decimals
				modifiedTime
				pargood {
				  tokenname
				  tokendecimals
				  tokensymbol
				  id
				  currentQuantity
				  currentValue
				}
				totalProfit
				totalTradeQuantity
				open
				id
				timetype
			}
		}`,
		variables: params
	})
}


//投资列表
export function InvestGoodDatas(params) {
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
			  }
			  parGoodDatas(
				orderBy: modifiedTime
				orderDirection: asc
				first: 1
				where: {modifiedTime_gte: $time, timetype: "d"}
			  ) {
				decimals
				modifiedTime
				pargood {
				tokenname
				tokendecimals
				tokensymbol
				id
				currentQuantity
				currentValue
				investQuantity
				}
				open
				id
				timetype
				totalInvestQuantity
				totalInvestCount
				feeQuantity
				investQuantity
			}
		}`,
		variables: params
	})
}


//我的投资列表
export function myInvestGoodDatas(params) {
	return apolloClient.query({
		query: gql`query($id: BigInt,$time: BigInt,$address: String) {
			goodState(id: $id) {
				currentValue
				currentQuantity
				id
				tokendecimals
				tokenname
				tokensymbol
			}
			proofStates {
				createTime
				good1ContructFee
				good1Quantity
				good2ContructFee
				good2Quantity
				id
				owner
				proofValue
				good1 {
				  tokendecimals
				  tokenname
				  tokensymbol
				  feeQuantity
				  currentQuantity
				  modifiedTime
				  currentValue
				  erc20Address
				  investQuantity
				}
				good2 {
					tokendecimals
					tokenname
					tokensymbol
					feeQuantity
					currentQuantity
					modifiedTime
					currentValue
					erc20Address
					investQuantity
				}
			  }
		}`,
		variables: params
	})
}