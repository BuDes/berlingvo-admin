import DashboardCard from "./DashboardCard";
import { MdOutlineAssignment, MdOutlineCheckCircle, MdOutlinePending } from "react-icons/md";
import { jadwalDashboardFromJson } from "./JadwalDashboard";
import { formatDate } from "date-fns";
import { Button } from "@mui/material";
import { BASE_URL } from "../../lib/constants";
import { getRequest } from "../../lib/utils";
import { useEffect, useState } from "react";
import type JadwalDashboard from "./JadwalDashboard";

export default function DashboardPage() {
  const { loading, dashboardData } = getDashboardData()

  if (loading) {
    return null
  }

  if (dashboardData === null) {
    return <p className="text-center">Terjadi kesalahan</p>
  }
  
  return (
    <div className="p-8 flex-1 flex flex-col">
      <div className="flex flex-wrap space-x-8">
        <DashboardCard
          icon={<MdOutlineCheckCircle />}
          label="Total Semua Test"
          value={dashboardData.totalTest}
        />
        <DashboardCard
          icon={<MdOutlineAssignment />}
          label="Total Test Bulan Ini"
          value={dashboardData.totalMonthlyTest}
        />
        <DashboardCard
          icon={<MdOutlinePending />}
          label="Jadwal Test Mendatang"
          value={dashboardData.totalUpcoming}
        />
      </div>

      <div className="
        w-full bg-white rounded-2xl shadow-xl shadow-black/10 p-8 mt-12 flex-1
      ">
        <h1 className="text-2xl text-neutral-400 font-semibold">Jadwal Test Mendatang</h1>
        <table className="app-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Jadwal</th>
              <th>Jumlah Peserta</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.upcoming.length === 0 && (
              <tr>
                <td colSpan={4} className="text-neutral-500">Tidak aja jadwal test yang akan datang</td>
              </tr>
            )}
            {dashboardData.upcoming.map((jadwal, index) => {
              return (
                <tr key={jadwal.id}>
                  <td className="w-4">{index + 1}</td>
                  <td className="!text-start">{formatDate(jadwal.jadwal, "EEEE, dd MMMM yyyy")}</td>
                  <td>{jadwal.jlhPeserta}</td>
                  <td>
                    <Button color="inherit" className="!text-neutral-400 !text-base">
                      Detail
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

interface DashboardDataResponse {
  totalTest: number
  totalMonthlyTest: number
  upcoming: {
    top5: []
    totalUpcoming: number
  }
}
function getDashboardData() {
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<{
    totalTest: number
    totalMonthlyTest: number
    upcoming: JadwalDashboard[]
    totalUpcoming: number
  } | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      const endpoint = `${BASE_URL}/admin/dashboard`
      setLoading(true)
      const response = await getRequest<DashboardDataResponse>(endpoint)
      setLoading(false)

      const {
        totalTest,
        totalMonthlyTest,
        upcoming: { top5, totalUpcoming }
      } = response.data

      const upcoming = top5.map(jadwalDashboardFromJson)
      setDashboardData({
        totalTest,
        totalMonthlyTest,
        upcoming,
        totalUpcoming,
      })
    }
    fetchDashboardData()
  }, [])
  
  
  return { loading, dashboardData }
}