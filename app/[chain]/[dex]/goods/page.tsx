'use client'
import { usePathname, useRouter } from "next/navigation";
// import { XYKTokenListView  } from "@covalenthq/goldrush-kit";
import { XYKTokenListView } from "@/components/Organisms"
import { Flex } from "@radix-ui/themes";
import { Button } from "@/components/ui/button";
import { GoldRushProvider } from "@/utils/store";
import { useEffect,useState } from "react";
import {handleTabSwitch} from "@/utils/router";
import { useValueGood,useGoodId } from "@/stores/valueGood";

export default function Tokens({ params }: { params: { chain: string, dex: string } }) {
  const router = useRouter();
  const pathname = usePathname()
  const { info } = useValueGood();
  const { setGoodId } = useGoodId();
  console.log("goods")
  // console.log(handleTabSwitch("swap",pathname),999)
  return (
    <div className="w-full flex flex-col gap-4">
        <h1 className="pt-4 text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Goods
        </h1>
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
            page_size={20}
            value_good_id={info.id}
            on_token_click={(e: any,id:string) => {
              setGoodId({invest:{id:""},swap:{id:id}});
              // sessionStorage.setItem("swap",id);
              router.push(`${handleTabSwitch(e,pathname)}`)
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
