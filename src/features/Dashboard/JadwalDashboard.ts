export default interface JadwalDashboard {
  id: string
  jadwal: Date
  jlhPeserta: number
}

export const dummyJadwalDashboard: JadwalDashboard[] = [
  { id: "1", jadwal: new Date(2025, 9, 3), jlhPeserta: 5 },
  { id: "2", jadwal: new Date(2025, 9, 4), jlhPeserta: 4 },
  { id: "3", jadwal: new Date(2025, 9, 5), jlhPeserta: 3 },
]

export const jadwalDashboardFromJson = (json: {[key: string]: any}) => {
  const jadwal = new Date(json["tanggal"])
  return { ...json, jadwal } as JadwalDashboard
}