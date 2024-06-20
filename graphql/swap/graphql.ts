//article.js
// import { useQuery } from '@vue/apollo-composable';
import apolloClient from '@/graphql/apollo'
import { gql } from '@apollo/client'


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

//物品列表
export function parGoodDatas(params) {
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
				where: {id_not: "0"}
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
				orderBy: modifiedTime
				orderDirection: asc
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

