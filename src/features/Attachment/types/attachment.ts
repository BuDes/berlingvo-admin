export default interface Attachment {
  id: string
  nama: string
  passage?: string
  audioFile?: string
  tanggal: Date
}

export const attachmentFromJson = (json: {[key: string]: any}) => {
  const tanggal = new Date(json["createdAt"])
  return { ...json, tanggal } as Attachment
}