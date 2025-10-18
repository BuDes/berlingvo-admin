import { createRef, useState, type ChangeEventHandler, type FormEventHandler } from "react";
import AppCard from "../../components/AppCard";
import { useNavigate } from "react-router-dom";
import ErrorView from "../../components/ErrorView";
import { Button, TextField } from "@mui/material";
import { BASE_URL } from "../../lib/constants";
import { handleForm } from "../../lib/utils";

export default function AddAttachmentPage() {
  const namaRef = createRef<HTMLInputElement>()
  const passageRef = createRef<HTMLInputElement>()
  const [audio, setAudio] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  
  const submitTambah: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    const nama = namaRef.current?.value
    const passage = passageRef.current?.value
    if (!nama) return
    
    const formData = new FormData()
    formData.append("nama", nama)
    if (passage != null) formData.append("passage", passage)
    if (audio != null) formData.append("audioFile", audio)

    const endpoint = `${BASE_URL}/attachment/add`
    const response = await handleForm({
      endpoint,
      setLoading,
      setError,
      body: formData,
      json: false
    })
    if (response.status) navigate("/attachment")
  }

  const onAudioChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.currentTarget.files?.[0]
    if (!file) return
    setAudio(file)
  }
  
  return (
    <AppCard title="+ Attachment Baru" backRoute="/attachment">
      <form onSubmit={submitTambah} className="flex flex-col w-[24rem] pt-6">
        <ErrorView error={error} />
        <TextField inputRef={namaRef} label="Nama" required />
        <TextField
          inputRef={passageRef}
          label="Passage (Opsional)"
          className="!my-4"
          minRows={3}
        />
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
              <span className="text-neutral-500 italic text-sm">Silahkan pilih audio (opsional)</span>
            )}
          </p>
        </label>
        <Button
          className="!mt-8"
          variant="contained"
          type="submit"
          loading={loading}
        >
          + Tambah Attachment
        </Button>
      </form>
    </AppCard>
  )
}
