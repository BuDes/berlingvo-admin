import type { ReactNode } from "react"

interface DashboardCardProps {
  icon: ReactNode
  value: number
  label: string
}
export default function DashboardCard({ icon, value, label }: DashboardCardProps) {
  return (
    <div className="
      bg-white flex items-center rounded-2xl p-6 shadow-lg shadow-black/10
    ">
      <div className="text-3xl bg-accent rounded-full p-3 text-white">
        {icon}
      </div>
      <div className="w-48 text-end">
        <p className="text-sm">{label}</p>
        <h1 className="text-4xl font-semibold">{value}</h1>
      </div>
    </div>
  )
}
