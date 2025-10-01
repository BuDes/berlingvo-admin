export default interface DetailJadwal {
  id: string
  jadwal: Date
  status: "Terjadwal" | "Selesai"
  peserta: {
    id: string
    nama: string
    email: string
  }[]
}

export function detailJadwalFromJson(json: {[key: string]: any}) {
  const jadwal = new Date(json["tanggal"])
  const peserta = json["peserta"].map((e: any) => e.user)
  return { ...json, jadwal, peserta } as DetailJadwal
}