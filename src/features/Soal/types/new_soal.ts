import type { Opsi, TipeSoal } from "./soal"

export default interface NewSoal {
  key?: string
  pertanyaan: string
  pembahasan: string
  idJenisMateri: string
  tipe: TipeSoal
  idOpsiBenar: string
  idAttachment: string | null
  opsi: Opsi[]
}
