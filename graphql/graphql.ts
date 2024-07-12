import apolloClient from '@/graphql/apollo'
import { gql } from '@apollo/client'

//价值物品列表
export function goodStates() {
	return apolloClient.query({
		query: gql`query {
			goodStates(where: {isvaluegood: true}) {
				id
				tokenname
				tokendecimals
				tokensymbol
				erc20Address
			}
		}`
	})
}
//价值物品
export function goodState() {
	return apolloClient.query({
		query: gql`query {
			goodStates(
				orderBy: goodseq
				orderDirection: asc
				first: 1
				where: {id_not: "0", isvaluegood: true}
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
