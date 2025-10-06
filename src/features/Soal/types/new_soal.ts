import type { Opsi, TipeSoal } from "./soal"

export default interface NewSoal {
  key?: string
  pertanyaan: string
  idJenisMateri: string
  tipe: TipeSoal
  idOpsiBenar: string
  audioFile: File| null
  opsi: Opsi[]
}
