import type { ReactNode } from "react"

interface AppCardProps {
  title?: string
  children?: ReactNode
  className?: string
}
export default function AppCard({ children, className, title }: AppCardProps) {
  return (
    <div className={`
      w-full bg-white rounded-2xl shadow-xl shadow-black/10 p-8
      ${className}
    `}>
      {title && (
        <h1 className="text-2xl text-neutral-400 font-semibold">
          {title}
        </h1>
      )}
      {children}
    </div>
  )
}
