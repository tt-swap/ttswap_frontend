//article.js
// import { useQuery } from '@vue/apollo-composable';
import apolloClient from '@/graphql/apollo'
import { gql } from '@apollo/client'

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
			proofStates(where: {owner: $address}) {
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