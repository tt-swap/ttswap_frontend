'use client'
import TokenInvest from "@/components/invest"

export default function Swap({ params }: { params: { chain: string, dex: string } }) {
  return (
    <div
      style={{ margin: "68px auto" }}
    >
      <TokenInvest />
    </div>
  )

}
