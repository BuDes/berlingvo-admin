import { Button, InputLabel, MenuItem, Select, TextField, type SelectChangeEvent } from "@mui/material"
import { createRef, useEffect, useRef, useState, type ChangeEventHandler } from "react"
import type NewSoal from "./types/new_soal";
import AppCard from "../../components/AppCard";
import { MdClose } from "react-icons/md";
import type { TipeSoal, Opsi } from "./types/soal";
import { BASE_URL } from "../../lib/constants";
import { getRequest } from "../../lib/utils";
import type Attachment from "../Attachment/types/attachment";
import { attachmentFromJson } from "../Attachment/types/attachment";

interface AddSoalFormProps {
  idJenisMateri: string
  formIndex: number
  onChange: (index: number, soal: NewSoal) => void
  defaultValues: NewSoal
  onRemove: (index: number) => void
  formKey: string
}
export default function AddSoalForm({ idJenisMateri, formIndex, onChange, defaultValues, onRemove }: AddSoalFormProps) {
  const pertanyaanRef = createRef<HTMLInputElement>()
  const pembahasanRef = createRef<HTMLInputElement>()
  const [attachment, setAttachment] = useState<string | null>(defaultValues.idAttachment)
  const [tipe, setTipe] = useState<TipeSoal>(defaultValues.tipe)
  const opsi = useRef<Opsi[]>(defaultValues.opsi)
  const [opsiBenar, setOpsiBenar] = useState<string>(defaultValues.idOpsiBenar)
  const { loading, attachments } = useAttachment()

  const getCurrentVals = (): NewSoal => {
    return {
      pertanyaan: pertanyaanRef.current!.value,
      pembahasan: pembahasanRef.current!.value,
      idJenisMateri,
      tipe,
      idOpsiBenar: opsiBenar,
      idAttachment: attachment,
      opsi: opsi.current
    }
  }

  const updateValues = () => {
    onChange(formIndex, getCurrentVals())
  }
  const onTipeChange = (e: SelectChangeEvent<TipeSoal>) => {
    const value = e.target.value
    const newVals = getCurrentVals()
    newVals.tipe = value as TipeSoal
    setTipe(value)
    onChange(formIndex, newVals)
  }
  const onAttachmentChange = (e: SelectChangeEvent<string | null>) => {
    const value = e.target.value
    const newVals = getCurrentVals()
    newVals.idAttachment = value as string | null
    setAttachment(value)
    onChange(formIndex, newVals)
  }

  const updateOpsi = (index: number, value: string) => {
    opsi.current[index].isi = value
    updateValues()
  }
  const removeForm = () => onRemove(formIndex)

  if (loading) {
    return null
  }
  
  return (
    <AppCard title={`Soal Baru (${formIndex + 1})`} className="w-full mb-4 relative">
      <div className="absolute top-4 right-8">
        <Button color="error" onClick={removeForm}>
          <MdClose size={20} className="mr-2" />
          Hapus
        </Button>
      </div>
      <div className="flex flex-col w-[32rem] pt-6">
        <TextField
          inputRef={pertanyaanRef}
          onChange={updateValues}
          label="Pertanyaan"
          defaultValue={defaultValues.pertanyaan}
          required
        />
        <TextField
          inputRef={pembahasanRef}
          onChange={updateValues}
          label="Pembahasan"
          defaultValue={defaultValues.pertanyaan}
          className="!mt-4"
          minRows={2}
          multiline
          required
        />
        <InputLabel className="!mt-4">Tipe *</InputLabel>
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
            const newVals = getCurrentVals()
            newVals.idOpsiBenar = item.id
            setOpsiBenar(item.id)
            onChange(formIndex, newVals)
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
                required
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
      </div>
    </AppCard>
  )
}

function useAttachment() {
  const [loading, setLoading] = useState(true)
  const [attachments, setAttachment] = useState<Attachment[]>([])

  useEffect(() => {
    const fetchMateri = async () => {
      const endpoint = `${BASE_URL}/attachment`
      setLoading(true)
      const response = await getRequest<[]>(endpoint)
      setLoading(false)
      const newAttachments = response.data.map(attachmentFromJson)
      setAttachment(newAttachments)
    }
    fetchMateri()
  }, [])

  return { loading, attachments }
}