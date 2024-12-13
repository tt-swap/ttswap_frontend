"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from 'next/navigation';

export default function IndexPage() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/') {
      const value = "sepolia";
      const address = "ttswap";
      const redirectTo = `/${value}/${address}/goods/`;
      router.push(redirectTo);
    }
  }, [router]);


  return null
}

