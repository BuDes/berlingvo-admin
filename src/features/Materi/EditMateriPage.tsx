import { TextField, Button, MenuItem, Select, type SelectChangeEvent } from "@mui/material";
import AppCard from "../../components/AppCard";
import ErrorView from "../../components/ErrorView";
import { createRef, useEffect, useState, type ChangeEventHandler, type FormEventHandler } from "react";
import type Materi from "./types/Materi";
import { BASE_URL } from "../../lib/constants";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { getRequest, handleForm, showConfirm } from "../../lib/utils";
import type JenisMateri from "./types/JenisMateri";

export default function EditMateriPage() {
  const { id } = useParams()
  const { loading: fetchLoading, materi, jenis: listJenis } = useMateri(id!)
  const namaRef = createRef<HTMLInputElement>()
  const isiRef = createRef<HTMLInputElement>()
  const [video, setVideo] = useState<File | null>(null)
  const [jenis, setJenis] = useState<string>(materi?.jenis.id ?? "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const submitEdit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    const nama = namaRef.current?.value
    const isi = isiRef.current?.value
    if (!nama || !jenis) return

    const formData = new FormData()
    formData.append("nama", nama)
    formData.append("idJenisMateri", jenis)
    if (isi) formData.append("content", isi)
    if (video) formData.append("file", video)

    const endpoint = `${BASE_URL}/materi/edit/${id}`
    const response = await handleForm({
      endpoint,
      setLoading,
      setError,
      body: formData,
      json: false,
      method: "PUT",
    })

    if (response.status) navigate("/materi")
  }
  
  const onVideoChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.currentTarget.files?.[0]
    if (!file) return
    setVideo(file)
  }

  const onJenisChange = (e: SelectChangeEvent<string>) => {
    setJenis(e.target.value)
  }
  
  const handleDelete = async () => {
    const confirm = await showConfirm({
      title: "Hapus materi ini?",
      confirmText: "Hapus",
      icon: "warning",
      buttonColor: "var(--color-red-500)"
    })
    if (!confirm) return
    
    const endpoint = `${BASE_URL}/materi/remove/${id}`
    const response = await handleForm({ endpoint, setLoading, setError, method: "DELETE" })
    if (response.status) navigate("/materi")
  }

  if (fetchLoading) {
    return null
  }

  if (!materi) {
    return <Navigate to="/materi" />
  }

  if (jenis === "") setJenis(materi.jenis.id)
  
  return (
    <AppCard title={materi.nama} backRoute="/materi">
      <form onSubmit={submitEdit} className="flex flex-col w-[32rem] pt-6">
        <ErrorView error={error} />
        <TextField inputRef={namaRef} label="Nama" defaultValue={materi.nama} required />
        <Select
          value={jenis}
          onChange={onJenisChange}
          displayEmpty
          className="!mt-4"
          defaultValue={materi.jenis.id}
        >
          {listJenis.map((jenis) => {
            return (
              <MenuItem key={jenis.id} value={jenis.id}>
                {jenis.nama}
              </MenuItem>
            )
          })}
        </Select>
        <TextField
          inputRef={isiRef}
          label="Isi (Opsional)"
          className="!my-4"
          multiline
          minRows={3}
          defaultValue={materi.content}
        />
        <input
          accept="video/*"
          id="video"
          type="file"
          className="hidden"
          onChange={onVideoChange}
        />
        <label htmlFor="video" className="flex items-center">
          <Button component="span">Pilih Video</Button>
          <p className="ml-4">
            {video?.name ?? (
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
          Update Materi
        </Button>
        <Button
          color="inherit"
          className="!text-red-400 !mt-5"
          onClick={handleDelete}
          loading={loading}
        >
          Hapus Materi
        </Button>
      </form>
    </AppCard>
  )
}

interface MateriResponse {
  materi: Materi
  jenis: JenisMateri[]
}
function useMateri(id: string) {
  const [loading, setLoading] = useState(true)
  const [materi, setMateri] = useState<Materi | null>(null)
  const [jenis, setJenis] = useState<JenisMateri[]>([])

  useEffect(() => {
    const fetchMateri = async () => {
      const endpoint = `${BASE_URL}/materi/single/${id}`
      setLoading(true)
      const response = await getRequest<MateriResponse>(endpoint)
      setLoading(false)
      const { materi: newMateri, jenis } = response.data
      setMateri(newMateri)
      setJenis(jenis)
    }
    fetchMateri()
  }, [id])

  return { loading, materi, jenis }
}