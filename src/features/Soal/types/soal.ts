export default interface Soal {
  id: string
  idOpsiBenar: string
  audioFile?: string
  pertanyaan: string
  tipe: TipeSoal
  opsi?: Opsi[]
}

export interface Opsi {
  id: string
  isi: string
}

export type TipeSoal = "test" | "practice"