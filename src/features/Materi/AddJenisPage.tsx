import { Button, TextField } from "@mui/material";
import AppCard from "../../components/AppCard";
import { createRef, useState, type ChangeEventHandler, type FormEventHandler } from "react";
import ErrorView from "../../components/ErrorView";
import { handleForm } from "../../lib/utils";
import { BASE_URL } from "../../lib/constants";
import { useNavigate } from "react-router-dom";

export default function AddJenisPage() {
  const namaRef = createRef<HTMLInputElement>()
  const deskripsiRef = createRef<HTMLInputElement>()
  const [gambar, setGambar] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  
  const submitTambah: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    const nama = namaRef.current?.value
    const deskripsi = deskripsiRef.current?.value
    if (!nama || !deskripsi || !gambar) return
    
    const formData = new FormData()
    formData.append("nama", nama)
    formData.append("file", gambar)
    formData.append("deskripsi", deskripsi)

    const endpoint = `${BASE_URL}/jenis_materi/add`
    const response = await handleForm({
      endpoint,
      setLoading,
      setError,
      body: formData,
      json: false
    })
    if (response.status) navigate("/materi")
  }

  const onGambarChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.currentTarget.files?.[0]
    if (!file) return
    setGambar(file)
  }
  
  return (
    <AppCard title="+ Jenis Materi Baru" backRoute="/materi">
      <form onSubmit={submitTambah} className="flex flex-col w-[24rem] pt-6">
        <ErrorView error={error} />
        <TextField inputRef={namaRef} label="Nama" required />
        <TextField
          inputRef={deskripsiRef}
          label="Deskripsi Singkat"
          className="!my-4"
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
              <span className="text-neutral-500 italic text-sm">Silahkan pilih gambar*</span>
            )}
          </p>
        </label>
        <Button
          className="!mt-8"
          variant="contained"
          type="submit"
          loading={loading}
        >
          + Tambah Jenis
        </Button>
      </form>
    </AppCard>
  )
}
