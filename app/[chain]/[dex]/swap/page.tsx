'use client'
import TokenSwap from "@/components/swap"

export default function Swap({ params }: { params: { chain: string, dex: string } }) {
  return (
    <div
      style={{ margin: "68px auto" }}
    >
      <TokenSwap />
    </div>
  )

}
