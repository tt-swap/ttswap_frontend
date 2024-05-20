//article.js
// import { useQuery } from '@vue/apollo-composable';
import apolloClient from './graphql'
import { gql } from '@apollo/client'
//query方式的请求
export function questionById(params) {
	return apolloClient.query({
		query: gql`query {
					  customers(first: 10) {
					      id
					      investCount
					      investValue
					    }
					    marketStates(first: 10) {
					      goodCount
					      id
					      marketConfig
					      marketCreator
					    }
					}`,
		variables: params 
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
//交易列表
export function transactions(params) {
	return apolloClient.query({
		query: gql`query($first: Int) {
			transactions(first: $first) {
				fromgoodQuanity
				fromgoodfee
				id
				timestamp
				togoodQuantity
				togoodfee
				transtype
				fromgood {
				  id
				  tokenname
				  tokendecimals
				  tokensymbol
				}
				togood {
				  tokenname
				  tokendecimals
				  tokensymbol
				}
			  }
		}`,
		variables: params
	})
}

//物品列表
export function parGoodDatas(params) {
	return apolloClient.query({
		query: gql`query($first: Int) {
			parGoodDatas(first: $first, orderDirection: desc, orderBy: modifiedTime) {
				pargood {
				  id
				  tokenname
				  tokensymbol
				  tokendecimals
				}
				modifiedTime
				totalTradeCount
				totalTradeQuantity
				totalInvestQuantity
				totalInvestCount
				totalDisinvestQuantity
				totalDisinvestCount
				totalProfit
			  }
		}`,
		variables: params
	})
}