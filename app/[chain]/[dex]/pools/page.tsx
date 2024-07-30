'use client'
import { Chain } from "@covalenthq/client-sdk"
import { usePathname, useRouter } from "next/navigation";
import { GoldRushProvider } from "@/utils/store";
import { XYKPoolListView } from "@/components/Organisms"
// import { XYKPoolListView, XYKTokenListView,   } from "@covalenthq/goldrush-kit";
import { Flex } from "@radix-ui/themes";
import { Button } from "@/components/ui/button";
import { useEffect,useState } from "react";
import {handleTabSwitch} from "@/utils/router";
import { useValueGood,useGoodId } from "@/stores/valueGood";

export default function Pools({ params }: { params: { chain: string, dex: string } }) {
  const router = useRouter();
  const pathname = usePathname()
  const { info } = useValueGood();
  const { setGoodId } = useGoodId();
  // const url = pathname.replace(/pools/g, "tokens");

  console.log("pools")
  return (
    <div className="w-full flex flex-col gap-4">
        <h1 className="pt-4 text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
        Pools
        </h1>
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
            page_size={20}
            value_good_id={info.id}
            on_pool_click={(e: any,id:string) => {
              setGoodId({invest:{id:id},swap:{id:""}});
              // sessionStorage.setItem("invest",id);
              router.push(`${handleTabSwitch(e,pathname)}`)
            }}
          />
        </GoldRushProvider>
       
        {/* <XYKTokenListView
          chain_name={params.chain}
          dex_name={params.dex}
          page_size={20}
          on_token_click={(e: any)=>{
            router.push(`${pathname}/${e}`)
          }}
        />
         */}
        <Flex onClick={()=>{
          router.back()
        }}>
          <Button>Back</Button>
        </Flex>
    </div>
  )

}
