import { useState, useEffect, createRef, useRef, type ChangeEventHandler, type FormEventHandler } from "react";
import AppCard from "../../components/AppCard";
import { BASE_URL } from "../../lib/constants";
import { getRequest, handleForm, showConfirm } from "../../lib/utils";
import type Soal from "./types/soal";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import type { TipeSoal, Opsi } from "./types/soal";
import { TextField, InputLabel, Select, MenuItem, Button, type SelectChangeEvent } from "@mui/material";
import ErrorView from "../../components/ErrorView";

export default function EditSoalPage() {
  const { id } = useParams()
  const state = useLocation().state
  const idJenis = state?.idJenis
  const pertanyaanRef = createRef<HTMLInputElement>()
  const pembahasanRef = createRef<HTMLInputElement>()
  const [audio, setAudio] = useState<File | null>(null)
  const [tipe, setTipe] = useState<TipeSoal>("practice")
  const opsi = useRef<Opsi[]>([])
  const [opsiBenar, setOpsiBenar] = useState<string>("")
  const { loading: fetchLoading, soal } = useDetailSoal({
    id: id!,
    opsi,
    setOpsiBenar,
    setTipe,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const backRoute = idJenis ? `/soal/jenis/${idJenis}` : "/soal"
  
  const submitEdit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
  
    const pertanyaan = pertanyaanRef.current?.value
    const pembahasan = pembahasanRef.current?.value
    if (!pertanyaan ||!pembahasan ) return
    const formData = new FormData()
    formData.append("pertanyaan", pertanyaan)
    formData.append("pembahasan", pembahasan)
    formData.append("tipe", tipe)
    formData.append("idOpsiBenar", opsiBenar)
    if (audio) formData.append("audioFile", audio)

    const endpoint = `${BASE_URL}/soal/edit/${id}`
    const response = await handleForm({
      endpoint,
      body: formData,
      setLoading,
      setError,
      json: false,
      method: "PUT",
    })

    if (response.status) navigate(backRoute)
  }

  const handleDelete = async () => {
    const confirm = await showConfirm({
      title: "Hapus jenis materi ini?",
      confirmText: "Hapus",
      icon: "warning",
      buttonColor: "var(--color-red-500)"
    })
    if (!confirm) return
    
    const endpoint = `${BASE_URL}/soal/remove/${id}`
    const response = await handleForm({ endpoint, setLoading, setError, method: "DELETE" })
    if (response.status) navigate(backRoute)
  }
  
  const onTipeChange = (e: SelectChangeEvent<TipeSoal>) => {
    const value = e.target.value
    setTipe(value)
  }
  const onAudioChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.currentTarget.files?.[0]
    if (!file) return
    setAudio(file)
  }
  const updateOpsi = (index: number, value: string) => {
    opsi.current[index].isi = value
  }
  
  if (fetchLoading) {
    return null
  }

  if (!soal) {
    return <Navigate to={backRoute} />
  }
  
  return (
    <AppCard title="Edit Soal" backRoute={backRoute}>
      <form onSubmit={submitEdit} className="flex flex-col w-[32rem] pt-6">
        <ErrorView error={error} />
        <TextField
          inputRef={pertanyaanRef}
          label="Pertanyaan"
          defaultValue={soal.pertanyaan}
          required
        />
        <TextField
          inputRef={pembahasanRef}
          label="Pembahasan"
          defaultValue={soal.pembahasan}
          className="!mt-4"
          minRows={2}
          multiline
          required
        />
        <InputLabel className="!mt-4">Tipe</InputLabel>
        <Select
          value={tipe}
          onChange={onTipeChange}
          displayEmpty
          required
        >
          <MenuItem value="test">Test</MenuItem>
          <MenuItem value="practice">Practice</MenuItem>
        </Select>
        <input
          accept="audio/*"
          id="audio"
          type="file"
          className="hidden"
          onChange={onAudioChange}
        />
        <label htmlFor="audio" className="flex items-center my-4">
          <Button component="span">Pilih Audio</Button>
          <p className="ml-4">
            {audio?.name ?? (
              <span className="text-neutral-500 italic text-sm">Kosongkan jika tidak berubah</span>
            )}
          </p>
        </label>
        {opsi.current.map((item, index) => {
          const onOpsiChange: ChangeEventHandler<HTMLInputElement> = (e) => {
            updateOpsi(index, e.currentTarget.value)
          }
          const updateOpsiBenar = () => {
            setOpsiBenar(item.id)
          }

          return (
            <div
              key={item.id}
              className="flex items-center"
            >
              <TextField
                onChange={onOpsiChange}
                placeholder={`Opsi ${index + 1}*`}
                className="!my-1 flex-1"
                defaultValue={item.isi}
                contentEditable={false}
                slotProps={{
                  htmlInput: { readOnly: true }
                }}
              />
              {
                opsiBenar === item.id
                  ? (
                      <p className="text-green-500 w-28 text-sm font-semibold px-2">
                        Opsi Benar
                      </p>
                    )
                  : (
                    <Button
                      onClick={updateOpsiBenar}
                      className="h-fit !w-28"
                      color="info"
                    >
                      Set opsi benar
                    </Button>
                  )
              }
            </div>
          )
        })}
        <Button
          className="!mt-8"
          variant="contained"
          type="submit"
          loading={loading}
        >
          Update Soal
        </Button>
        <Button
          color="inherit"
          className="!text-red-400 !mt-5"
          onClick={handleDelete}
          loading={loading}
        >
          Hapus Soal
        </Button>
      </form>
    </AppCard>
  )
}

interface userDetailSoalArgs {
  id: string
  setTipe: React.Dispatch<React.SetStateAction<TipeSoal>>
  opsi: React.RefObject<Opsi[]>
  setOpsiBenar: React.Dispatch<React.SetStateAction<string>>
}
function useDetailSoal({ id, setTipe, opsi, setOpsiBenar }: userDetailSoalArgs) {
  const [loading, setLoading] = useState(true)
  const [soal, setSoal] = useState<Soal | null>(null)

  useEffect(() => {
    const fetchSoal = async () => {
      const endpoint = `${BASE_URL}/soal/detail/${id}`
      setLoading(true)
      const response = await getRequest<Soal>(endpoint)
      setLoading(false)
      const { data } = response
      setSoal(data)
      setTipe(data.tipe)
      opsi.current = data.opsi!
      setOpsiBenar(data.idOpsiBenar)
    }
    fetchSoal()
  }, [id])

  return { loading, soal }
}