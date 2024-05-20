import { ApolloClient, InMemoryCache } from '@apollo/client'

const APIURL = 'https://api.studio.thegraph.com/query/57827/ttswap/v0.0.171';
//实例化apolloClient
const apolloClient = new ApolloClient({
  // 你需要在这里使用绝对路径
  uri: APIURL,
  cache: new InMemoryCache(),
})

//导出实例
export default apolloClient;