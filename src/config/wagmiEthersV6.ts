import { BrowserProvider, JsonRpcSigner, FallbackProvider, JsonRpcProvider } from 'ethers'
import { useMemo } from 'react'
import type { Account, Chain, Client, Transport } from 'viem'
import { type Config, useConnectorClient, useClient } from 'wagmi'
import { readPublicClient } from './wagmi'

export function clientToProvider(client: Client<Transport, Chain>) {
  const { chain, transport } = client as any
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  if (transport.type === 'fallback') {
    const providers = (transport.transports as ReturnType<Transport>[]).map(
      ({ value }) => new JsonRpcProvider(value?.url, network),
    )
    if (providers.length === 1) return providers[0]
    return new FallbackProvider(providers)
  }
  return new JsonRpcProvider(transport.url, network)
}

/** Action to convert a viem Client to an ethers.js Provider. */
export function useEthersProvider({ chainId }: { chainId?: number } = {}) {
  // 修改：使用 readPublicClient 获取读取专用的 provider
  return useMemo(() => {
    if (chainId) {
      // 根据 chainId 找到对应的链，并创建 JsonRpcProvider
      const chain = readPublicClient.chains.find(c => c.id === chainId);
      if (chain && chain.rpcUrls?.default?.http?.[0]) {
        const network = {
          chainId: chain.id,
          name: chain.name,
          ensAddress: (chain as any).contracts?.ensRegistry?.address,
        };
        // 直接使用 RPC URL 创建 JsonRpcProvider
        return new JsonRpcProvider(chain.rpcUrls.default.http[0], network);
      }
    }
    // 如果没有提供 chainId 或找不到对应的配置，则回退到原来的逻辑
    const client = useClient<Config>({ chainId });
    return client ? clientToProvider(client) : undefined;
  }, [chainId]);
}

// 新增：创建专用的读 provider
export function useEthersProvider1(chainId: number) {
  const chain = readPublicClient.chains.find(c => c.id === chainId) 
             || readPublicClient.chains[0];
  
  if (chain && chain.rpcUrls?.default?.http?.[0]) {
    const network = {
      chainId: chain.id,
      name: chain.name,
      ensAddress: (chain as any).contracts?.ensRegistry?.address,
    };
    return new JsonRpcProvider(chain.rpcUrls.default.http[0], network);
  }
  return undefined;
}


export function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client as any
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const provider = new BrowserProvider(transport, network)
  const signer = new JsonRpcSigner(provider, account.address)
  return signer
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: client } = useConnectorClient<Config>({ chainId })
  return useMemo(() => (client ? clientToSigner(client) : undefined), [client])
}