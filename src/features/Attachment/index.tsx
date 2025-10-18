import { useEffect, useState } from "react";
import AppCard from "../../components/AppCard";
import type Attachment from "./types/attachment";
import { BASE_URL } from "../../lib/constants";
import { getRequest } from "../../lib/utils";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { MdOutlineEdit } from "react-icons/md";
import { attachmentFromJson } from "./types/attachment";

export default function AttachmentHomePage() {
  const { loading, attachments } = useAttachment()

  if (loading) {
    return null
  }

  return (
    <AppCard title="Kelola Attachment">
      <p className="mt-1">Kelola file audio ataupun passage pada soal</p>
      <Link to="/attachment/add" className="block mt-8 w-fit">
        <Button variant="contained">+ Tambah</Button>
      </Link>
      <table className="app-table">
        <thead>
          <tr>
            <th className="w-4">#</th>
            <th>Nama</th>
            <th>Passage</th>
            <th>Audio</th>
            <th className="w-48">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {attachments.map((attachment) => {
            return (
              <tr key={attachment.id}>
                <td>{attachment.tanggal.getTime()}</td>
                <td>{attachment.nama}</td>
                <td className="max-w-[24rem]">
                  <p className="line-clamp-2 overflow-ellipsis">
                    {attachment.passage ?? "-"}
                  </p>
                </td>
                <td>{attachment.audioFile ? "Tersedia" : "Tidak Tersedia"}</td>
                <td>
                  <Link to={`/attachment/edit/${attachment.id}`} className="text-neutral-400">
                    <Button color="inherit">
                      <MdOutlineEdit size={24} />
                      <span className="text-base pl-4">Edit</span>
                    </Button>
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
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