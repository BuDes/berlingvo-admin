import { createRef, useState, useEffect, type ChangeEventHandler, type FormEventHandler } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import AppCard from "../../components/AppCard";
import { BASE_URL } from "../../lib/constants";
import { getRequest, handleForm, showConfirm } from "../../lib/utils";
import type Attachment from "./types/attachment";
import { Button, TextField } from "@mui/material";
import ErrorView from "../../components/ErrorView";
import { attachmentFromJson } from "./types/attachment";

export default function EditAttachmentPage() {
  const { id } = useParams()
  const { loading: fetchLoading, attachment } = useAttachment(id!)
  const namaRef = createRef<HTMLInputElement>()
  const passageRef = createRef<HTMLInputElement>()
  const [audio, setAudio] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const submitEdit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    const nama = namaRef.current?.value
    const passage = passageRef.current?.value
    if (!nama) return

    const formData = new FormData()
    formData.append("nama", nama)
    if (passage != null) formData.append("passage", passage)
    if (audio != null) formData.append("audioFile", audio)

    const endpoint = `${BASE_URL}/attachment/edit/${id}`
    const response = await handleForm({
      endpoint,
      setLoading,
      setError,
      body: formData,
      method: "PUT",
      json: false
    })

    if (response.status) navigate("/attachment")
  }

  const onAudioChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.currentTarget.files?.[0]
    if (!file) return
    setAudio(file)
  }

  const handleDelete = async () => {
    const confirm = await showConfirm({
      title: "Hapus attachment ini?",
      confirmText: "Hapus",
      icon: "warning",
      buttonColor: "var(--color-red-500)"
    })
    if (!confirm) return

    const endpoint = `${BASE_URL}/attachment/remove/${id}`
    const response = await handleForm({ endpoint, setLoading, setError, method: "DELETE" })
    if (response.status) navigate("/attachment")
  }

  if (fetchLoading) {
    return null
  }

  if (!attachment) {
    return <Navigate to="/attachment" />
  }

  return (
    <AppCard title="Edit Attachment" backRoute="/attachment">
      <form onSubmit={submitEdit} className="flex flex-col w-[24rem] pt-6">
        <ErrorView error={error} />
        <TextField inputRef={namaRef} label="Nama" defaultValue={attachment.nama} required />
        <TextField
          inputRef={passageRef}
          label="Passage (Opsional)"
          className="!my-4"
          minRows={3}
          defaultValue={attachment.passage}
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
          Update Attachment
        </Button>
        <Button
          color="inherit"
          className="!text-red-400 !mt-5"
          onClick={handleDelete}
          loading={loading}
        >
          Hapus Attachment
        </Button>
      </form>
    </AppCard>
  )
}

function useAttachment(id: string) {
  const [loading, setLoading] = useState(true)
  const [attachment, setAttachment] = useState<Attachment | null>(null)

  useEffect(() => {
    const fetchAttachment = async () => {
      const endpoint = `${BASE_URL}/attachment/single/${id}`
      setLoading(true)
      const response = await getRequest(endpoint)
      setLoading(false)
      const newAttachment = attachmentFromJson(response.data)
      setAttachment(newAttachment)
    }
    fetchAttachment()
  }, [id])

  return { loading, attachment }
}