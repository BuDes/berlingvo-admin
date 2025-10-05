export default interface NewSoal {
  key?: string
  pertanyaan: string
  idJenisMateri: string
  tipe: TipeSoal
  idOpsiBenar: string
  audioFile: File| null
  opsi: Opsi[]
}

export interface Opsi {
  id: string
  isi: string
}

export type TipeSoal = "test" | "practice"