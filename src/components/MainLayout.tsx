import { type ReactNode } from "react"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { MdLogout, MdOutlineAttachFile, MdOutlineCalendarMonth, MdOutlineDashboard, MdOutlineDescription, MdOutlineSchool } from "react-icons/md";

export default function MainLayout() {
  const navigate = useNavigate()
  
  // useEffect(() => {
  //   console.log("AAAAAAAAA")
  // }, [])
  
  const logout = () => {
    localStorage.removeItem("USERNAME")
    navigate("/login")
  }
  
  return (
    <main className="flex bg-beige">
      <div className="
        sticky w-[18rem] bg-primary top-0 left-0 h-screen flex flex-col text-white
      ">
        <Link
          to="/"
          className="flex items-center justify-center p-5 pr-12 select-none mb-8"
        >
          <div className="rounded-full bg-white p-2">
            <img src="/logo.png" alt="Berlingvo" className="size-10" />
          </div>
          <h1 className="text-xl font-semibold ml-4">Admin Panel</h1>
        </Link>

        <NavItem to="/">
          <MdOutlineDashboard size={24} className="mr-5" />
          Dashboard
        </NavItem>
        <NavItem to="/jadwal_test">
          <MdOutlineCalendarMonth size={24} className="mr-5" />
          Jadwal Test
        </NavItem>
        <NavItem to="/materi">
          <MdOutlineSchool size={24} className="mr-5" />
          Materi
        </NavItem>
        <NavItem to="/soal">
          <MdOutlineDescription size={24} className="mr-5" />
          Soal
        </NavItem>
        <NavItem to="/attachment">
          <MdOutlineAttachFile size={24} className="mr-5" />
          Attachment
        </NavItem>

        <button
          onClick={logout}
          className="
            hover:bg-white/20 duration-200 py-4 px-8 mt-auto font-semibold text-start
            text-lg flex items-center
          "
        >
          <MdLogout className="mr-3" size={24} />
          Logout
        </button>
      </div>
      <div className="p-8 flex-1 flex flex-col">
        <Outlet />
      </div>
    </main>
  )
}

interface NavItemProps {
  to: string
  children?: ReactNode
}
function NavItem({ to, children }:NavItemProps) {
  const { pathname } = useLocation()
  const selected = pathname === to
  
  return (
    <Link
      to={to}
      className={`
        duration-200 py-4 px-8 font-semibold text-start
        text-lg flex items-center
        ${selected ? "bg-black/20" : "hover:bg-white/20"}
      `}
    >
     {children}
    </Link>
  )
}