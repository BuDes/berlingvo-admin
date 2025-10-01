import { Button } from "@mui/material"
import type { ReactNode } from "react"
import { MdArrowBack } from "react-icons/md"
import { Link } from "react-router-dom"

interface AppCardProps {
  title?: string
  children?: ReactNode
  className?: string
  backRoute?: string
}
export default function AppCard({ children, className, title, backRoute }: AppCardProps) {
  return (
    <div className={`
      w-full bg-white rounded-2xl shadow-xl shadow-black/10 p-8
      ${className}
    `}>
      {backRoute && (
        <Link to={backRoute} className="block text-accent !-translate-4">
          <Button color="inherit">
            <MdArrowBack size={18} className="mr-4" />
            Kembali
          </Button>
        </Link>
      )}
      {title && (
        <h1 className="text-2xl text-neutral-400 font-semibold">
          {title}
        </h1>
      )}
      {children}
    </div>
  )
}
