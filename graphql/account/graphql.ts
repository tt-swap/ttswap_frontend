//article.js
// import { useQuery } from '@vue/apollo-composable';
import apolloClient from '@/graphql/apollo'
import { gql } from '@apollo/client'

//my记录列表
export function myTransactions(params: { id: string; first: number; skip: number; address: string }) {
	return apolloClient.query({
		query: gql`query($id: BigInt,$address: String,$first: Int,$skip: Int) {
			goodState(id: $id) {
				currentQuantity
				currentValue
				id
				tokenname
				tokensymbol
				tokendecimals
			}
			transactions(
				where: {recipent: $address}
				orderDirection: desc
				orderBy: timestamp
				first: $first
				skip: $skip
				) {
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
export function myInvestGoodDatas(params: { id: string; first: number; skip: number; address: string }) {
	return apolloClient.query({
		query: gql`query($id: BigInt,$address: String,$first: Int,$skip: Int) {
			goodState(id: $id) {
				currentValue
				currentQuantity
				id
				tokendecimals
				tokenname
				tokensymbol
			}
			proofStates(
				where: {owner: $address}
				orderBy: proofValue
				orderDirection: desc
				first: $first
				skip: $skip
				) {
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


// 我的物品
export async function myGoodDatas(params: {
	id: string; first: number; time: number; skip: number; address: string
}) {
	return apolloClient.query({
		query: gql`query($id: BigInt,$first: Int,$time: BigInt,$skip: Int,$address:String) {
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
				where: {owner: $address}
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
						good {
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

//我的撤资数据
export function myDisInvestProof(params: { id: number; }) {
	return apolloClient.query({
		query: gql`query($id: BigInt) {
			proofState(id: $id) {
				id
				proofValue
				good1ContructFee
				good1Quantity
				good2ContructFee
				good2Quantity
				createTime
				good1 {
				  id
				  tokendecimals
				  tokensymbol
				  goodConfig
				  erc20Address
				  currentQuantity
				  currentValue
				  feeQuantity
				  investQuantity
				  isvaluegood
				}
				good2 {
				  id
				  tokendecimals
				  tokensymbol
				  goodConfig
				  erc20Address
				  currentQuantity
				  currentValue
				  feeQuantity
				  investQuantity
				}
			  }
		}`,
		variables: params
	})
}


// 我的指标
export function myIndex(params: { id: string, address: string }) {
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
			customer(id: $address) {
				id
				disinvestCount
				disinvestValue
				investCount
				investValue
				tradeCount
				tradeValue
			  }
		}`,
		variables: params
	})
}
