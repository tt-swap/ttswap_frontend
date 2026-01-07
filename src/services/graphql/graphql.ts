import apolloClient from '@/services/graphql/apollo'
import { gql } from '@apollo/client'

//价值物品列表
export function goodStates(ssionChian: number) {
	return apolloClient(ssionChian).query({
		query: gql`query {
			goodStates(where: {isvaluegood: true}) {
				id
				tokenname
				tokendecimals
				tokensymbol
				erc20Address
				currentQuantity
				currentValue
			}
		}`
	})
}
//价值物品
export function goodState(ssionChian: number) {
	return apolloClient(ssionChian).query({
		query: gql`query {
			goodStates(
				orderBy: goodseq
				orderDirection: asc
				first: 1
				where: {id_not: "0x0000000000000000000000000000000000000000", isvaluegood: true}
			  ) {
				id
				tokenname
				tokensymbol
				tokendecimals
				erc20Address
			  }
		}`,
		// variables: params
	})
}

//publicSale
export function publicSale(ssionChian: number) {
	return apolloClient(ssionChian).query({
		query: gql`query {
			ttswapPublicsellLogs(orderDirection: asc, orderBy: create_time) {
				id
				ttsamount
				usdtamount
				user
				create_time
			}
		}`
	})
}