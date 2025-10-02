import type JenisMateri from "./JenisMateri"

export default interface Materi {
  id: string
  videoFile?: string
  content: string
  jenis: JenisMateri
}