"use client"

import {  useEffect } from "react"
import { useRouter } from "next/navigation"

export default function IndexPage() {
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      if (currentPath === '/') {
        const value = "sepolia";
        const address = "ttswap";
        const redirectTo = `/${value}/${address}/goods/`;
        router.push(redirectTo);
      }
    }
  }, [router]);


  return (
    <section className="container flex flex-col justify-center gap-6 md:py-10 h-[calc(100vh-150px)] items-center ">
    </section>
  )
}
