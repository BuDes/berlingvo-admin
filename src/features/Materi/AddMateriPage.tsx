import { createRef, useEffect, useState, type ChangeEventHandler, type FormEventHandler } from "react";
import AppCard from "../../components/AppCard";
import { useNavigate } from "react-router-dom";
import { Button, MenuItem, Select, TextField, type SelectChangeEvent } from "@mui/material";
import ErrorView from "../../components/ErrorView";
import { getRequest, handleForm } from "../../lib/utils";
import { BASE_URL } from "../../lib/constants";
import type JenisMateri from "./types/JenisMateri";

export default function AddMateriPage() {
  const namaRef = createRef<HTMLInputElement>()
  const isiRef = createRef<HTMLInputElement>()
  const introRef = createRef<HTMLInputElement>()
  const [video, setVideo] = useState<File | null>(null)
  const [jenis, setJenis] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { loading: fetchLoading, jenis: listJenis } = useJenis()
  
  const submitTambah: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    const nama = namaRef.current?.value
    const isi = isiRef.current?.value
    const intro = introRef.current?.value
    if (!nama || !jenis || !intro) return

    const formData = new FormData()
    formData.append("nama", nama)
    formData.append("idJenisMateri", jenis)
    formData.append("intro", intro)
    if (isi) formData.append("content", isi)
    if (video) formData.append("file", video)

    const endpoint = `${BASE_URL}/materi/add`
    const response = await handleForm({
      endpoint,
      setLoading,
      setError,
      body: formData,
      json: false,
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

  if (fetchLoading) {
    return null
  }
  
  return (
    <AppCard title="Materi Baru" backRoute="/materi">
      <form onSubmit={submitTambah} className="flex flex-col w-[32rem] pt-6">
        <ErrorView error={error} />
        <TextField inputRef={namaRef} label="Nama" required />
        <Select
          value={jenis}
          onChange={onJenisChange}
          displayEmpty
          className="!mt-4"
          required
        >
          <MenuItem value="" disabled>--- Pilih Jenis Materi --- *</MenuItem>
          {listJenis.map((jenis) => {
            return (
              <MenuItem key={jenis.id} value={jenis.id}>
                {jenis.nama}
              </MenuItem>
            )
          })}
        </Select>
        <TextField
          inputRef={introRef}
          label="Intro"
          className="!mt-4"
          multiline
          required
          minRows={3}
        />
        <TextField
          inputRef={isiRef}
          label="Isi (Opsional)"
          className="!my-4"
          multiline
          minRows={5}
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
              <span className="text-neutral-500 italic text-sm">Silahkan pilih video (opsional)</span>
            )}
          </p>
        </label>
        <Button
          className="!mt-8"
          variant="contained"
          type="submit"
          loading={loading}
        >
          + Tambah Materi
        </Button>
      </form>
    </AppCard>
  )
}

function useJenis() {
  const [loading, setLoading] = useState(true)
  const [jenis, setJenis] = useState<JenisMateri[]>([])

  useEffect(() => {
    const fetchJenis = async () => {
      const endpoint = `${BASE_URL}/jenis_materi`
      setLoading(true)
      const response = await getRequest<JenisMateri[]>(endpoint)
      setLoading(false)
      setJenis(response.data)
    }
    fetchJenis()
  }, [])

  return { loading, jenis }
}