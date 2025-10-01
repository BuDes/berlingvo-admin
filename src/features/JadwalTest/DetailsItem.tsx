import type { ReactNode } from "react"

interface DetailsItemProps {
  label: string
  children?: ReactNode
}
export default function DetailsItem({ label, children }: DetailsItemProps) {
  return (
    <div className="min-w-[24rem] w-fit mb-4">
      <h2 className="text-lg text-primary font-semibold">{label}</h2>
      <div>{children}</div>
    </div>
  )
}
