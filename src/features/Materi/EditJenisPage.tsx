import { TextField, Button } from "@mui/material"
import { createRef, useEffect, useState, type ChangeEventHandler, type FormEventHandler } from "react"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import AppCard from "../../components/AppCard"
import ErrorView from "../../components/ErrorView"
import { BASE_URL } from "../../lib/constants"
import { getRequest, handleForm, showConfirm } from "../../lib/utils"
import type JenisMateri from "./types/JenisMateri"

export default function EditJenisPage() {
  const { id } = useParams()
  const { loading: fetchLoading, jenis  } = useJenis(id!)
  const namaRef = createRef<HTMLInputElement>()
  const deskripsiRef = createRef<HTMLInputElement>()
  const [gambar, setGambar] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const submitEdit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    const nama = namaRef.current?.value
    const deskripsi = deskripsiRef.current?.value
    if (!nama || !deskripsi) return
    const formData = new FormData()
    formData.append("nama", nama)
    formData.append("deskripsi", deskripsi)
    if (gambar) formData.append("file", gambar)

    const endpoint = `${BASE_URL}/jenis_materi/edit/${id}`
    const response = await handleForm({
      endpoint,
      setLoading,
      setError,
      body: formData,
      method: "PUT",
      json: false
    })

    if (response.status) navigate("/materi")
  }
  
  const onGambarChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.currentTarget.files?.[0]
    if (!file) return
    setGambar(file)
  }

  const handleDelete = async () => {
    const confirm = await showConfirm({
      title: "Hapus jenis materi ini?",
      confirmText: "Hapus",
      icon: "warning",
      buttonColor: "var(--color-red-500)"
    })
    if (!confirm) return
    
    const endpoint = `${BASE_URL}/jenis_materi/remove/${id}`
    const response = await handleForm({ endpoint, setLoading, setError, method: "DELETE" })
    if (response.status) navigate("/materi")
  }

  if (fetchLoading) {
    return null
  }

  if (!jenis) {
    return <Navigate to="/materi" />
  }
  
  return (
    <AppCard title={jenis.nama} backRoute="/materi">
      <form onSubmit={submitEdit} className="flex flex-col w-[24rem] pt-6">
        <ErrorView error={error} />
        <TextField inputRef={namaRef} label="Nama" defaultValue={jenis.nama} required />
        <TextField
          inputRef={deskripsiRef}
          label="Deskripsi Singkat"
          className="!my-4"
          defaultValue={jenis.deskripsi}
          required
        />
        <input
          accept="image/*"
          id="gambar"
          type="file"
          className="hidden"
          onChange={onGambarChange}
        />
        <label htmlFor="gambar" className="flex items-center">
          <Button component="span">Pilih Gambar</Button>
          <p className="ml-4">
            {gambar?.name ?? (
              <span className="text-neutral-500 italic text-sm">
                Kosongkan jika tidak berubah
              </span>
            )}
          </p>
        </label>
        <Button
          className="!mt-8"
          variant="contained"
          type="submit"
          loading={loading}
        >
          Update Jenis
        </Button>
        <Button
          color="inherit"
          className="!text-red-400 !mt-5"
          onClick={handleDelete}
          loading={loading}
        >
          Hapus Jenis
        </Button>
      </form>
    </AppCard>
  )
}

function useJenis(id: string) {
  const [loading, setLoading] = useState(true)
  const [jenis, setJenis] = useState<JenisMateri | null>(null)

  useEffect(() => {
    const fetchJenis = async () => {
      const endpoint = `${BASE_URL}/jenis_materi/single/${id}`
      setLoading(true)
      const response = await getRequest(endpoint)
      setLoading(false)
      setJenis(response.data)
    }
    fetchJenis()
  }, [id])

  return { loading, jenis }
}