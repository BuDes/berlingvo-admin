import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom"
import LoginPage from "./features/Login"
import DashboardPage from "./features/Dashboard"
import MainLayout from "./components/MainLayout"

function App() {
  return (
    <Routes>
      <Route element={<AuthWrapper />}>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

function AuthWrapper() {
  const { pathname } = useLocation()
  const username = localStorage.getItem("USERNAME")

  if (pathname !== "/login" && username === null) {
    return <Navigate to="/login" replace />
  }

  if (pathname === "/login" && username !== null) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default App
