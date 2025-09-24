'use client'
import { useEffect,useState } from "react";
import { useTranslation } from 'react-i18next';
import Trade from "@/components/Trade"

export default function Swap({ params }: { params: { chain: string, dex: string } }) {

  const { t, ready } = useTranslation();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);


// 在客户端和服务端渲染一致之前不渲染可能导致hydration错误的内容
if (!ready || !isClient) {
return (
  <div className="w-full flex flex-col gap-4">
    <div className="skeleton h-10 w-3/4"></div>
    <div className="skeleton h-64"></div>
    <div className="skeleton h-64"></div>
    <div className="flex justify-between">
      <div className="skeleton h-8 w-1/4"></div>
    </div>
    <div className="skeleton h-96"></div>
  </div>
);
}

  return (
    <div
      style={{ margin: "68px auto" }}
    >
      <Trade />
    </div>
  )

}
