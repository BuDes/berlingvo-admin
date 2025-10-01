export default interface JadwalTest {
  id: string
  jadwal: Date
  status: "Terjadwal" | "Selesai"
  jlhPeserta: number
}

export const jadwalTestFromJson = (json: {[key: string]: any}) => {
  const jadwal = new Date(json["tanggal"])
  return { ...json, jadwal } as JadwalTest
}