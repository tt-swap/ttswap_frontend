'use client'
// import { track } from '@vercel/analytics/react';
// import { poweredCovalent } from "@/lib/svg";
import Footer1 from '@/components/footer/Footer1';
import { Footer10DataSource } from '@/components/footer/data.source';
import { isMobile } from 'react-device-detect';

export const Footer = () => {
  // console.log(Footer10DataSource)
  return <footer className="bg-background  z-40 w-full border-t">
    <div
      className="rt-Flex container rt-r-display-flex rt-r-fd-column rt-r-jc-start rt-r-gap-5">
      <Footer1
        id="Footer1_0"
        key="Footer1_0"
        dataSource={Footer10DataSource}
        isMobile={isMobile}
      />
    </div>
    {/* // <footer className="bg-background  z-40 w-full border-t bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%"> */}
    {/* <a
      onClick={() => {
        track('covalent_cta');
      }}
      target="_blank"
      href="https://Tt_swap.com/"
      className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0 "
    > */}
    {/* {poweredCovalent} */}
    {/* </a> */}
  </footer>
}