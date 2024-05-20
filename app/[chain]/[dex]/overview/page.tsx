'use client'
import { Chain } from "@covalenthq/client-sdk"
import { useRouter } from "next/navigation";
import { XYKOverviewTransactionsListView  } from "@covalenthq/goldrush-kit";
import { GoldRushProvider } from "@/utils/store";
import { XYKPoolListView, XYKTokenListView } from "@/components/Organisms"
import { XYKOverviewTimeSeries } from "@/components/Molecules"
import { Flex } from "@radix-ui/themes";
import { Button } from "@/components/ui/button";
import { useEffect,useState } from "react";



export default function Overview({ params }: { params: { chain: string, dex: string } }) {
  const router = useRouter();

  return (
    <div className="w-full flex flex-col gap-4">
        <h1 className="pt-4 text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Overview
        </h1>
        <div className="flex gap-4">
          <GoldRushProvider
                apikey="cqt_rQR8cdBV8vyD43KCb3vC6cDx9Xqf"
                newTheme={{
                    borderRadius: 10,
                }}
            >
            <XYKOverviewTimeSeries
            // @ts-ignore
              chain_name={params.chain}
              dex_name={params.dex === "ttswap" ? "uniswap_v2" : params.dex}
              displayMetrics={"liquidity"}
            />
            <XYKOverviewTimeSeries
            // @ts-ignore
              chain_name={params.chain}
              dex_name={params.dex === "ttswap" ? "uniswap_v2" : params.dex}
              displayMetrics={"volume"}
            />
          </GoldRushProvider>
        </div>
        <h2 className="text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">
        Goods
        </h2>
        <GoldRushProvider
                apikey="cqt_rQR8cdBV8vyD43KCb3vC6cDx9Xqf"
                newTheme={{
                    borderRadius: 10,
                }}
            >
              <XYKTokenListView
              // @ts-ignore
                chain_name={params.chain}
                dex_name={params.dex === "ttswap" ? "uniswap_v2" : params.dex}
                on_token_click={(e: any)=>{
                  router.push(`/${params.chain}/${params.dex}/tokens/${e}`)
                }}
              />

            </GoldRushProvider>
        
        <h2 className="text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">
        Invest
        </h2>
        {/* <XYKTokenListView
          chain_name={params.chain}
          dex_name={params.dex}
          on_token_click={(e: any)=>{
            router.push(`/${params.chain}/${params.dex}/tokens/${e}`)
          }}
        /> */}
        <GoldRushProvider
                apikey="cqt_rQR8cdBV8vyD43KCb3vC6cDx9Xqf"
                newTheme={{
                    borderRadius: 10,
                }}
            >
              <XYKPoolListView
               // @ts-ignore
                chain_name={params.chain}
                dex_name={params.dex === "ttswap" ? "uniswap_v2" : params.dex}
                on_pool_click={(e: any)=>{
                  router.push(`/${params.chain}/${params.dex}/pools/${e}`)
                }}
              />

            </GoldRushProvider>
        
        <h2 className="text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">
          Transactions
        </h2>
        <XYKOverviewTransactionsListView
         // @ts-ignore
          chain_name={params.chain}
          dex_name={params.dex === "ttswap" ? "uniswap_v2" : params.dex}
          on_native_explorer_click={(e: { explorers: { url: string | URL | undefined; }[]; })=>{
            window.open(e.explorers[0].url, '_blank');
          }}
          on_goldrush_receipt_click={(e: { tx_hash: any; })=>{
            window.open(`https://goldrush-tx-receipt-ui.vercel.app/tx/${params.chain}/${e.tx_hash}/`, '_blank');
          }}
        />
        <Flex onClick={()=>{
          router.back()
        }}>
          <Button>Back</Button>
        </Flex>
    </div>
  )

}
