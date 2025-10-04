import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom"
import LoginPage from "./features/Login"
import DashboardPage from "./features/Dashboard"
import MainLayout from "./components/MainLayout"
import JadwalTestPage from "./features/JadwalTest"
import AddJadwalTestPage from "./features/JadwalTest/AddJadwalTestPage"
import DetailJadwallPage from "./features/JadwalTest/DetailJadwallPage"
import MateriPage from "./features/Materi"
import AddJenisPage from "./features/Materi/AddJenisPage"
import EditJenisPage from "./features/Materi/EditJenisPage"
import AddMateriPage from "./features/Materi/AddMateriPage"
import EditMateriPage from "./features/Materi/EditMateriPage"

function App() {
  return (
    <Routes>
      <Route element={<AuthWrapper />}>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          
          <Route path="/jadwal_test" element={<JadwalTestPage />} />
          <Route path="/jadwal_test/add" element={<AddJadwalTestPage />} />
          <Route path="/jadwal_test/details/:id" element={<DetailJadwallPage />} />
          
          <Route path="/materi" element={<MateriPage />} />
          <Route path="/materi/add" element={<AddMateriPage />} />
          <Route path="/materi/edit/:id" element={<EditMateriPage />} />
          <Route path="/jenis/add" element={<AddJenisPage />} />
          <Route path="/jenis/edit/:id" element={<EditJenisPage />} />
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
