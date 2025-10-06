import { useState, useEffect } from "react";
import AppCard from "../../components/AppCard";
import { BASE_URL } from "../../lib/constants";
import { getRequest } from "../../lib/utils";
import type JenisMateri from "../Materi/types/JenisMateri";
import { List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Link } from "react-router-dom";

export default function SoalHomePage() {
  const { loading, jenis } = useJenis()

  if (loading) {
    return null
  }
  
  return (
    <AppCard title="Kelola Soal Test">
      <p className="mt-1">Silahkan pilih jenis latihan yang ingin dikelola</p>
      <List>
        {jenis.map((item) => {
          return (
            <Link key={item.id} to={`/soal/jenis/${item.id}`}>
              <ListItemButton key={item.id}>
                <ListItemIcon>
                  <img src={item.gambar} alt={item.nama} className="h-10 p-1 w-12 object-contain" />
                </ListItemIcon>
                <ListItemText primary={item.nama} />
                <ListItemIcon><MdKeyboardArrowRight size={24} /></ListItemIcon>
              </ListItemButton>
            </Link>
          )
        })}
      </List>
    </AppCard>
  )
}

function useJenis() {
  const [loading, setLoading] = useState(true)
  const [jenis, setJenis] = useState<JenisMateri[]>([])

  useEffect(() => {
    const fetchMateri = async () => {
      const endpoint = `${BASE_URL}/jenis_materi`
      setLoading(true)
      const response = await getRequest<JenisMateri[]>(endpoint)
      setLoading(false)
      setJenis(response.data)
    }
    fetchMateri()
  }, [])

  return { loading, jenis }
}