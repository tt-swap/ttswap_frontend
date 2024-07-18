import { ApolloClient, InMemoryCache } from '@apollo/client'

import { getTheGraphApi } from '@/data/contractConfig';

let chainId = 11155111;
// if (sessionStorage.getItem("chainId") !== null) {
//     chainId = Number(sessionStorage.getItem("chainId"));
// }
const APIURL =  getTheGraphApi(chainId);//''https://api.studio.thegraph.com/query/57827/ttswap/v0.0.203';
//实例化apolloClient
const apolloClient = new ApolloClient({
  // 你需要在这里使用绝对路径
  uri: APIURL,
  cache: new InMemoryCache(),
})

//导出实例
export default apolloClient;