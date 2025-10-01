import { Button } from "@mui/material";
import AppCard from "../../components/AppCard";
import { useEffect, useState } from "react";
import type JadwalTest from "./types/JadwalTest";
import { BASE_URL } from "../../lib/constants";
import { getRequest } from "../../lib/utils";
import { formatDate } from "date-fns";
import { jadwalTestFromJson } from "./types/JadwalTest";
import { Link } from "react-router-dom";

export default function JadwalTestPage() {
  const { loading, jadwal } = useJadwalTest()

  const getColor = (status: string) => {
    if (status === "Terjadwal") return "text-blue-500"
    return "text-neutral-400"
  }
  
  if (loading) {
    return null
  }
  
  return (
    <>
      <AppCard title="Jadwal Test">
        <Link to="/jadwal_test/add" className="block mt-8 w-fit">
          <Button variant="contained">+ Tambah</Button>
        </Link>
        <table className="app-table">
          <thead>
            <tr>
              <th className="w-4">#</th>
              <th>Jadwal</th>
              <th>Jumlah Peserta</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {jadwal.length === 0 && (
              <tr>
                <td colSpan={4} className="text-neutral-500">Tidak aja jadwal test yang akan datang</td>
              </tr>
            )}
            {jadwal.map((item, index) => {
              return (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td className="!text-start">{formatDate(item.jadwal, "EEEE, dd MMMM yyyy | HH:mm")}</td>
                  <td>{item.jlhPeserta}</td>
                  <td className={getColor(item.status)}>{item.status}</td>
                  <td>
                    <Link to={`/jadwal_test/details/${item.id}`}>
                      <Button color="inherit" className="!text-neutral-400 !text-base">
                        Detail
                      </Button>
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </AppCard>
    </>
  )
}

function useJadwalTest() {
  const [loading, setLoading] = useState(true)
  const [jadwal, setJadwal] = useState<JadwalTest[]>([])

  useEffect(() => {
    const fetchJadwalTest = async () => {
      const endpoint = `${BASE_URL}/jadwal_test/all_sorted`
      setLoading(true)
      const response = await getRequest<[]>(endpoint)
      setLoading(false)
      const newJadwal = response.data.map(jadwalTestFromJson)
      setJadwal(newJadwal)
    }
    fetchJadwalTest()
  }, [])

  return { loading, jadwal }
}