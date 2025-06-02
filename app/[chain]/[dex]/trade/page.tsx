'use client'
import Trade from "@/components/Trade"

export default function Swap({ params }: { params: { chain: string, dex: string } }) {
  return (
    <div
      style={{ margin: "68px auto" }}
    >
      <Trade />
    </div>
  )

}
