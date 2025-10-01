import { useEffect, useState } from "react";
import AppCard from "../../components/AppCard";
import { BASE_URL } from "../../lib/constants";
import { Navigate, useParams } from "react-router-dom";
import { getRequest } from "../../lib/utils";
import { detailJadwalFromJson } from "./types/DetailJadwal";
import type DetailJadwal from "./types/DetailJadwal";
import { formatDate } from "date-fns";
import DetailsItem from "./DetailsItem";

export default function DetailJadwallPage() {
  const { loading, jadwal } = useDetailJadwal()

  if (loading) {
    return null
  }

  if (jadwal === null) {
    return <Navigate to="/jadwal_test" />
  }
  
  const dateString = formatDate(jadwal.jadwal, "EEEE, dd MMMM yyyy")
  const timeString = formatDate(jadwal.jadwal, "HH:mm")
  return (
    <AppCard
      title={`Jadwal Test ${formatDate(jadwal.jadwal, "dd/MM/yyyy")}`}
      backRoute="/jadwal_test"
    >
      <div className="mt-8">
        <DetailsItem label="Tanggal & Waktu">
          <p>{`${dateString} pukul ${timeString}`}</p>
        </DetailsItem>

        <DetailsItem label="Status">
          {jadwal.status}
        </DetailsItem>
        
        <DetailsItem label="Peserta">
          {jadwal.peserta.length === 0 && (
            <p className="text-neutral-500 italic">Belum ada peserta</p>
          )}
          {jadwal.peserta.map((peserta) => {
            return (
              <p key={peserta.id}>{peserta.nama}</p>
            )
          })}
        </DetailsItem>
      </div>
    </AppCard>
  )
}

function useDetailJadwal() {
  const [loading, setLoading] = useState(true)
  const [jadwal, setJadwal] = useState<DetailJadwal | null>(null)
  const { id } = useParams()

  useEffect(() => {
    const fetchDetailJadwal = async () => {
      const endpoint = `${BASE_URL}/jadwal_test/details/${id}`
      setLoading(true)
      const response = await getRequest(endpoint)
      setLoading(false)
      const newJadwal = detailJadwalFromJson(response.data)
      setJadwal(newJadwal)
    }
    fetchDetailJadwal()
  }, [id])

  return { loading, jadwal }
}