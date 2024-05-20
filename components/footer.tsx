'use client'
import { track } from '@vercel/analytics/react';
import { poweredCovalent } from "@/lib/svg"

export const Footer = () => {
    return  <footer className="bg-background  z-40 w-full border-t">

    {/* // <footer className="bg-background  z-40 w-full border-t bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%"> */}
    <a
      onClick={() => {
        track('covalent_cta');
      }}
      target="_blank"
      href="https://Tt_swap.com/"
      className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0 "
    >
      {/* {poweredCovalent} */}
    </a>
  </footer>
}