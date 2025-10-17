import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import AppCard from "../../components/AppCard";
import { useEffect, useState } from "react";
import type JenisMateri from "./types/JenisMateri";
import type Materi from "./types/Materi";
import { BASE_URL } from "../../lib/constants";
import { getRequest } from "../../lib/utils";
import { MdOutlineEdit } from "react-icons/md";

export default function MateriPage() {
  const { loading, jenis, materi } = useMateri()

  if (loading) {
    return null
  }
  
  return (
    <>
      <AppCard title="Jenis Materi">
        <Link to="/jenis/add" className="block mt-8 w-fit">
          <Button variant="contained">+ Tambah</Button>
        </Link>
        <table className="app-table">
          <thead>
            <tr>
              <th className="w-4">#</th>
              <th>Gambar</th>
              <th>Nama Jenis</th>
              <th>Jumlah Soal</th>
              <th>Deskripsi</th>
              <th className="w-48">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {jenis.map((item, index) => {
              return (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="py-2">
                      <img src={item.gambar} alt={item.nama} className="h-10" />
                    </div>
                  </td>
                  <td>{item.nama}</td>
                  <td>{item.jlhSoal}</td>
                  <td>{item.deskripsi}</td>
                  <td>
                    <Link to={`/jenis/edit/${item.id}`} className="text-neutral-400">
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

      <AppCard title="Materi" className="mt-8">
        <Link to="/materi/add" className="block mt-8 w-fit">
          <Button variant="contained">+ Tambah</Button>
        </Link>
        <table className="app-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Judul</th>
              <th>Jenis Materi</th>
              <th>Isi</th>
              <th>Video</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {materi.map((item, index) => {
              return (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.nama}</td>
                  <td>{item.jenis.nama}</td>
                  <td className="max-w-[24rem]">
                    <p className={`
                      line-clamp-2 overflow-ellipsis
                      ${item.content ? "" : "text-neutral-400 italic"}
                    `}>
                      {item.content ?? "Tidak ada isi"}
                    </p>
                  </td>
                  <td>{item.videoFile ? "Tersedia" : "Tidak Tersedia"}</td>
                  <td>
                    <Link to={`/materi/edit/${item.id}`} className="text-neutral-400">
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
    </>
  )
}

interface MateriResponse {
  jenis: JenisMateri[]
  materi: Materi[]
}
function useMateri() {
  const [loading, setLoading] = useState(true)
  const [jenis, setJenis] = useState<JenisMateri[]>([])
  const [materi, setMateri] = useState<Materi[]>([])

  useEffect(() => {
    const fetchMateri = async () => {
      const endpoint = `${BASE_URL}/materi/materi_and_jenis`
      setLoading(true)
      const response = await getRequest<MateriResponse>(endpoint)
      setLoading(false)
      setJenis(response.data.jenis)
      setMateri(response.data.materi)
    }
    fetchMateri()
  }, [])

  return { loading, jenis, materi }
}