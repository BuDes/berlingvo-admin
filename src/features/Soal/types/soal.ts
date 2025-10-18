export default interface Soal {
  id: string
  idOpsiBenar: string
  idAttachment: string | null
  pertanyaan: string
  pembahasan: string
  tipe: TipeSoal
  opsi?: Opsi[]
}

export interface Opsi {
  id: string
  isi: string
}

export type TipeSoal = "test" | "practice"