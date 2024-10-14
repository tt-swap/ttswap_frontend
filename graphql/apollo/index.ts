import { ApolloClient, InMemoryCache } from '@apollo/client'
import { getTheGraphApi } from '@/data/contractConfig';

//实例化apolloClient
const apolloClient = (chainId: number) => {
  return new ApolloClient({
    uri: getTheGraphApi(chainId),
    cache: new InMemoryCache(),
  })
}

export default apolloClient;