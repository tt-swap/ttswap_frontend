'use client'
// import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { XYKWalletTransactionsListView, XYKWalletPoolListView, XYKWalletInformation, XYKWalletPositionsListView  } from "@covalenthq/goldrush-kit";
import { Flex } from "@radix-ui/themes";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
// import { useState } from "react";
import TokenSwap from "@/components/swap"
import usePrices from "@/hooks/usePrices";
import { cleanupImgCache } from "@/utils/icon";
import { useEffect,useState } from "react";
import { useTheme } from "next-themes"

export default function Swap({ params }: { params: { chain: string, dex: string } }) {
  const router = useRouter();
  const [walletAddress, setAddress] = useState("")
  const [input, setInput] = useState("");
  const { getPrices } = usePrices();
  const { setTheme, theme } = useTheme()

  useEffect(()=>{
    console.log("dark:");
    setTheme("dark");
    return ()=>{
      setTheme("dark");
    }
  },[])
  
  return (
    <div
    style={{margin: "68px auto"}}
    //  className="w-full flex flex-col gap-4 bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%"
     >
        <TokenSwap />
        <Flex onClick={()=>{
          router.back()
        }}>
            
          {/* <Button>Back</Button> */}
        </Flex>
    </div>
  )

}
