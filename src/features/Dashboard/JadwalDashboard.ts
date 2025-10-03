export default interface JadwalDashboard {
  id: string
  jadwal: Date
  nama: string
  jlhPeserta: number
}

export const jadwalDashboardFromJson = (json: {[key: string]: any}) => {
  const jadwal = new Date(json["tanggal"])
  return { ...json, jadwal } as JadwalDashboard
}