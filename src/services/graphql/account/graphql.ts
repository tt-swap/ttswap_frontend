//article.js
// import { useQuery } from '@vue/apollo-composable';
import apolloClient from '@/services/graphql/apollo'
import { gql } from '@apollo/client'

//my记录列表
export function myTransactions(params: { id: string; first: number; skip: number; address: string }, ssionChian: number) {
	return apolloClient(ssionChian).query({
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
				fromgoodActualQuanity
				fromgoodfee
				transvalue
				fromgood {
				tokenname
				tokensymbol
				tokendecimals
				currentValue
				currentQuantity
				}
				togoodQuantity
				togoodActualQuantity
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
export function myInvestGoodDatas(params: { id: string; first: number; skip: number; address: string }, ssionChian: number) {
	return apolloClient(ssionChian).query({
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
				good1Quantity
				good1ActualQuantity
				good2Quantity
				good2ActualQuantity
				id
				owner
				proofValue
    			good1Shares
    			good2Shares
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
				  investShares
				  isvaluegood
				  islockgood
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
					investShares
				    isvaluegood
					islockgood
				}
			  }
		}`,
		variables: params
	})
}


// 我的物品
export async function myGoodDatas(params: {
	id: string; first: number; time: number; skip: number; address: string
}, ssionChian: number) {
	return apolloClient(ssionChian).query({
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
				  	investShares
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
						currentQuantity
						currentValue
				  		investShares
						good {
							id
							tokenname
							tokendecimals
							tokensymbol
						}
					}
			  }
		}`,
		variables: params
	})
}

//我的撤资数据
export function myDisInvestProof(params: { id: number, address: string }, ssionChian: number) {
	return apolloClient(ssionChian).query({
		query: gql`query($id: BigInt,$address: String) {
			proofState(id: $id) {
				id
				proofValue
				good1Quantity
				good1ActualQuantity
				good2Quantity
				good2ActualQuantity
				createTime
    			good1Shares
    			good2Shares
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
				  investShares
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
				  isvaluegood
				  investQuantity
				  investShares
				}
			  }
			customer(id: $address) {
				stakettsvalue
				stakettscontruct
			}
			ttsEnv(id: "1") {
				id
				poolasset
				poolvalue
			}
		}`,
		variables: params
	})
}


// 我的指标
export function myIndex(params: { id: string, address: string }, ssionChian: number) {
	return apolloClient(ssionChian).query({
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
				totalcommissionvalue
				totalprofitvalue
				stakettsvalue
				stakettscontruct
				getfromstake
    			referralnum
			}
			ttsEnv(id: "1") {
				id
				poolasset
				poolvalue
			}
		}`,
		variables: params
	})
}


// My Commission
export function myCommission(params: { id: string, first: number; skip: number; address: string }, ssionChian: number) {
	return apolloClient(ssionChian).query({
		query: gql`query($id: BigInt,$first: Int,$skip: Int,$address: String) {
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
				skip: $skip
				orderBy: totalTradeCount
				orderDirection: desc
				where: {id_not: "0x0000000000000000000000000000000000000000"}
				) {
				id
				tokensymbol
				tokenname
				tokendecimals
				erc20Address
				feeQuantity
				totalTradeCount
				currentQuantity
				currentValue
				goodConfig
				isvaluegood
			  }
			customer(id: $address) {
				totalcommissionvalue
			}
		}`,
		variables: params
	})
}

// 我的推荐人数
export function referees(params: { address: string }, ssionChian: number) {
	return apolloClient(ssionChian).query({
		query: gql`query($address: String) {
			customer(id: $address) {
				id
    			referralnum
			}
		}`,
		variables: params
	})
}

// updateToken
export function updateToken(params: { id: string }, ssionChian: number) {
	return apolloClient(ssionChian).query({
		query: gql`query($id: String) {
			goodState(id: $id) {
				id
    			goodConfig
			}
		}`,
		variables: params
	})
}


//my推荐人数据
export function myReferees(params: { id: string; first: number; skip: number; address: string }, ssionChian: number) {
	return apolloClient(ssionChian).query({
		query: gql`query($id: BigInt,$address: String,$first: Int,$skip: Int) {
			goodState(id: $id) {
				currentQuantity
				currentValue
				id
				tokenname
				tokensymbol
				tokendecimals
			}
			customers(
				where: {refer: $address}
				orderDirection: desc
				orderBy: tradeValue
				first: $first
				skip: $skip) {
				id
				disinvestValue
				investValue
				tradeValue
				lastoptime
				totalprofitvalue
			}
		}`,
		variables: params
	})
}


// goodStateMin
export function goodStateMin(params: { address: string }, ssionChian: number) {
	return apolloClient(ssionChian).query({
		query: gql`query($address: String) {
			goodState(id: $address) {
				id
				tokenname
				tokensymbol
				tokendecimals
				erc20Address
				currentQuantity
				currentValue
			  }
		}`,
		variables: params
	})
}



// createToken
export function createToken(params: { id: string }, ssionChian: number) {
	return apolloClient(ssionChian).query({
		query: gql`query($id: String) {
            goodState(id: $id) {
                currentValue
                currentQuantity
                id
                tokendecimals
                tokenname
                tokensymbol
				erc20Address
            }
			goodStates(where: {isvaluegood: true, islockgood: false}) {
                currentValue
                currentQuantity
                id
                tokendecimals
                tokenname
                tokensymbol
				erc20Address
            }
		}`,
		variables: params
	})
}


// tokensBalanceData
export function tokensBalanceData(params: { id: string, address: string, time: number }, ssionChian: number) {
	return apolloClient(ssionChian).query({
		query: gql
			`query ($id: BigInt,$address: String, $time: BigInt) {
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
                    goodStates(where: {id_not: "0x0000000000000000000000000000000000000000"}, orderBy: currentValue, orderDirection: desc) {
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
					transactions(
						where: {recipent: $address, transtype_in:["buy","invest"]}
						orderDirection: desc
						orderBy: timestamp
						first: 5
						) {
						id
						timestamp
						transtype
						fromgoodQuanity
						fromgoodActualQuanity
						fromgood {
						tokensymbol
						tokendecimals
						}
						togoodQuantity
						togoodActualQuantity
						togood {
						tokensymbol
						tokendecimals
						}
					}
                }`,
		variables: params
	})
}
