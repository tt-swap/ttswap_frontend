import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
// import { ThemeToggle } from "@/components/theme-toggle"
import ConnectAccount from "components/components/Account/ConnectAccount";
import ChainSelector from "@/components/ChainSelector";
// import { useWindowSize } from "hooks";
// import { useMemo, useEffect, useState } from "react";
// import { useValueGood } from "@/stores/valueGood";

// import { valueGood } from '@/graphql';


export function SiteHeader() {

  // const { info, setValueGood } = useValueGood();

  // useMemo(async() => {
  //   // (async () => {
  //     const bal = await valueGood();
  //     // console.log(bal,99999999999)
  //     setValueGood({
  //       id: bal.data.goodStates[0].id,
  //       symbol: bal.data.goodStates[0].tokensymbol,
  //       name: bal.data.goodStates[0].tokenname,
  //       logo_url: "",
  //       address: bal.data.goodStates[0].erc20Address,
  //       decimals: bal.data.goodStates[0].tokendecimals
  //     });
  //   // })();

  // }, []);

  // console.log(info,77779999999)
  return (
    <header className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0 text-white">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <ChainSelector />
            <ConnectAccount />
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "icon",
                  variant: "ghost",
                })}
              >
                <Icons.gitHub className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            {/* <Link href={siteConfig.links.settings}>
              <div
                className={buttonVariants({
                  size: "icon",
                  variant: "ghost",
                })}
              >
                <Icons.Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </div>
            </Link>
            <ThemeToggle /> */}

          </nav>
        </div>
      </div>
    </header>
  )
}
