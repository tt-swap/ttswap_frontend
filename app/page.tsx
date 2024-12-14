"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from 'next/navigation';
import { useLocalStorage } from "@/utils/LocalStorageManager";
import { getAddChainParameters } from "@/data/networks";

export default function IndexPage() {
  const router = useRouter();
  const pathname = usePathname();
  // @ts-ignore
  const { ssionChian } = useLocalStorage();
  // @ts-ignore
  const chainName = getAddChainParameters(ssionChian).chainName;

  useEffect(() => {
    // alert(ssionChian)
    if (pathname === '/') {
      const value = chainName;
      const address = "ttswap";
      const redirectTo = `/${value}/${address}/goods/`;
      router.push(redirectTo);
    }
  }, [router]);


  return null
}

