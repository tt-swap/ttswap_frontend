"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from 'next/navigation';
import { useLocalStorage } from "@/utils/LocalStorageManager";
import { getAddChainParameters } from "@/data/networks";
import { getString } from "@/utils/router";
import { ethers } from "ethers";

export default function IndexPage() {
  const router = useRouter();
  const pathname = usePathname();
  // @ts-ignore
  const { ssionChian } = useLocalStorage();
  // @ts-ignore
  const chainName = getAddChainParameters(ssionChian).chainName;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = window.location.search;
      const a: any = getString(params);
      // console.log(ethers.isAddress(null),"reference---")
      if (getString(params) !== null && ethers.isAddress(a) && !ethers.isAddress(localStorage.getItem("reference"))) {
        // @ts-ignore
        localStorage.setItem("reference", a);
      }
    }
    if (pathname === '/') {
      const value = chainName;
      const address = "ttswap";
      const redirectTo = `/${value}/${address}/goods/`;
      router.push(redirectTo);
    }
  }, [router]);


  return null
}

