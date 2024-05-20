'use client'
import { useRouter } from "next/navigation";
// import { XYKPoolDetailView, XYKPoolTransactionsListView, XYKTokenListView  } from "@covalenthq/goldrush-kit";
import { GoldRushProvider } from "@/utils/store";
import { XYKPoolDetailView, XYKPoolTransactionsListView } from "@/components/Organisms"
import { XYKOverviewTimeSeries } from "@/components/Molecules"
import { Flex } from "@radix-ui/themes";
import { Button } from "@/components/ui/button";

export default function Token({ params }: { params: { chain: string, dex: string, pool_id: string} }) {
  const router = useRouter();
  return (
    <div className="w-full flex flex-col gap-4">
      <GoldRushProvider
                apikey="cqt_rQR8cdBV8vyD43KCb3vC6cDx9Xqf"
                newTheme={{
                    borderRadius: 10,
                }}
            >
        <XYKPoolDetailView
          // @ts-ignore
            chain_name={params.chain}
            dex_name={params.dex === "ttswap" ? "uniswap_v2" : params.dex}
            pool_address={params.pool_id}
          />
          <h2 className="text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">
            Transactions
          </h2>
          <XYKPoolTransactionsListView
          // @ts-ignore
            chain_name={params.chain}
            dex_name={params.dex === "ttswap" ? "uniswap_v2" : params.dex}
            pool_address={params.pool_id}
            on_native_explorer_click={(e: { explorers: { url: string | URL | undefined; }[]; })=>{
              window.open(e.explorers[0].url, '_blank');
            }}
            on_goldrush_receipt_click={(e: { tx_hash: any; })=>{
              window.open(`https://goldrush-tx-receipt-ui.vercel.app/tx/${params.chain}/${e.tx_hash}/`, '_blank');
            }}
          />
        </GoldRushProvider>
        <Flex onClick={()=>{
          router.back()
        }}>
          <Button>Back</Button>
        </Flex>
    </div>
  )

}
