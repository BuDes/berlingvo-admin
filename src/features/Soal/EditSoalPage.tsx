import { useState, useEffect, createRef, useRef, type ChangeEventHandler, type FormEventHandler } from "react";
import AppCard from "../../components/AppCard";
import { BASE_URL } from "../../lib/constants";
import { getRequest, handleForm, showConfirm } from "../../lib/utils";
import type Soal from "./types/soal";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import type { TipeSoal, Opsi } from "./types/soal";
import { TextField, InputLabel, Select, MenuItem, Button, type SelectChangeEvent } from "@mui/material";
import ErrorView from "../../components/ErrorView";
import { attachmentFromJson } from "../Attachment/types/attachment";
import type Attachment from "../Attachment/types/attachment";

export default function EditSoalPage() {
  const { id } = useParams()
  const state = useLocation().state
  const idJenis = state?.idJenis
  const pertanyaanRef = createRef<HTMLInputElement>()
  const pembahasanRef = createRef<HTMLInputElement>()
  const [attachment, setAttachment] = useState<string | null>(null)
  const [tipe, setTipe] = useState<TipeSoal>("practice")
  const opsi = useRef<Opsi[]>([])
  const [opsiBenar, setOpsiBenar] = useState<string>("")
  const { loading: fetchLoading, soal, attachments } = useDetailSoal({
    id: id!,
    opsi,
    setOpsiBenar,
    setTipe,
    setAttachment,
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
    // const formData = new FormData()
    // formData.append("pertanyaan", pertanyaan)
    // formData.append("pembahasan", pembahasan)
    // formData.append("tipe", tipe)
    // formData.append("idOpsiBenar", opsiBenar)
    // formData.append("idAttachment", attachment)
    const body = JSON.stringify({
      pertanyaan: pertanyaanRef.current!.value,
      pembahasan: pembahasanRef.current!.value,
      idJenisMateri: idJenis,
      tipe,
      idOpsiBenar: opsiBenar,
      idAttachment: attachment,
      opsi: opsi.current
    })

    const endpoint = `${BASE_URL}/soal/edit/${id}`
    const response = await handleForm({
      endpoint,
      body,
      setLoading,
      setError,
      method: "PUT",
    })

    if (response.status) navigate(backRoute)
  }

  const handleDelete = async () => {
    const confirm = await showConfirm({
      title: "Hapus soal ini?",
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
  const onAttachmentChange = (e: SelectChangeEvent<string | null>) => {
    const value = e.target.value
    setAttachment(value)
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
  console.log(soal.idAttachment)
  
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
        <InputLabel className="!mt-4">Attachment (Opsional)</InputLabel>
        <Select
          value={attachment}
          onChange={onAttachmentChange}
          displayEmpty
          className="!mb-4"
        >
          <MenuItem value={null as any}>
            <p className="text-neutral-500 italic">Tidak ada</p>
          </MenuItem>
          {attachments.map((item) => {
            return (
              <MenuItem
                key={item.id}
                value={item.id}
                className="overflow-ellipsis"
              >
                {item.tanggal.getTime()} - {item.nama}
              </MenuItem>
            )
          })}
        </Select>
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
  setAttachment: React.Dispatch<React.SetStateAction<string | null>>
}
interface DetailSoalResponse {
  soal: Soal
  attachments: []
}
function useDetailSoal({ id, setTipe, opsi, setOpsiBenar, setAttachment }: userDetailSoalArgs) {
  const [loading, setLoading] = useState(true)
  const [soal, setSoal] = useState<Soal | null>(null)
  const [attachments, setAttachments] = useState<Attachment[]>([])

  useEffect(() => {
    const fetchSoal = async () => {
      const endpoint = `${BASE_URL}/soal/detail/${id}`
      setLoading(true)
      const response = await getRequest<DetailSoalResponse>(endpoint)
      setLoading(false)
      const { soal, attachments: attachmentsJson } = response.data
      const newAttachments = attachmentsJson.map(attachmentFromJson)
      opsi.current = soal.opsi!

      setSoal(soal)
      setTipe(soal.tipe)
      setOpsiBenar(soal.idOpsiBenar)
      setAttachment(soal.idAttachment)
      setAttachments(newAttachments)
    }
    fetchSoal()
  }, [id])

  return { loading, soal, attachments }
}