import { useEffect, useState } from "react";
import AppCard from "../../components/AppCard";
import type Soal from "./types/soal";
import { BASE_URL } from "../../lib/constants";
import { getRequest } from "../../lib/utils";
import { Link, Navigate, useParams } from "react-router-dom";
import type JenisMateri from "../Materi/types/JenisMateri";
import { Button } from "@mui/material";
import { MdOutlineEdit } from "react-icons/md";
import type { TipeSoal } from "./types/soal";

export default function SoalByJenisPage() {
  const { idJenis } = useParams()
  const { loading, soal, jenis } = useSoal(idJenis!)

  const displayTipe = (tipe: TipeSoal) => {
    if (tipe === "practice") return "Practice"
    if (tipe === "test") return "Test"
    return ""
  }

  if (loading) {
    return null
  }

  if (!jenis) {
    return <Navigate to="/soal" />
  }

  return (
    <AppCard title={jenis.nama}>
      <p className="mt-1">Kelola soal untuk latihan {jenis.nama}</p>
      <Link to={`/soal/jenis/${jenis.id}/add`} className="block mt-8 w-fit">
        <Button variant="contained">+ Tambah</Button>
      </Link>
      <table className="app-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Tipe</th>
            <th>Pertanyaan</th>
            <th className="w-48">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {soal.length === 0 && (
            <tr>
              <td className="!text-center text-neutral-500" colSpan={4}>
                Belum ada soal untuk jenis latihan ini
              </td>
            </tr>
          )}
          {soal.map((item, index) => {
            return (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{displayTipe(item.tipe)}</td>
                <td>{item.pertanyaan}</td>
                <td>
                  <Link
                    to={`/soal/edit/${item.id}`}
                    state={{ idJenis }}
                    className="text-neutral-400"
                  >
                    <Button color="inherit">
                      <MdOutlineEdit size={24} />
                      <span className="text-base pl-4">Edit</span>
                    </Button>
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </AppCard>
  )
}

interface SoalResponse {
  jenis: JenisMateri
  soal: Soal[]
}
function useSoal(idJenis: string) {
  const [loading, setLoading] = useState(true)
  const [soal, setSoal] = useState<Soal[]>([])
  const [jenis, setJenis] = useState<JenisMateri | null>(null)

  useEffect(() => {
    const fetchSoal = async () => {
      const endpoint = `${BASE_URL}/soal/jenis/${idJenis}`
      setLoading(true)
      const response = await getRequest<SoalResponse>(endpoint)
      setLoading(false)
      const { soal: newSoal, jenis: newJenis } = response.data
      setSoal(newSoal)
      setJenis(newJenis)
    }
    fetchSoal()
  }, [idJenis])

  return { loading, soal, jenis }
}