import AppCard from "../../components/AppCard";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { createRef, useState, type FormEventHandler } from "react";
import { Button, TextField } from "@mui/material";
import { handleForm, showConfirm } from "../../lib/utils";
import { formatDate } from "date-fns";
import { BASE_URL } from "../../lib/constants";
import ErrorView from "../../components/ErrorView";
import { useNavigate } from "react-router-dom";

export default function AddJadwalTestPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  
  const namaRef = createRef<HTMLInputElement>()
  const tanggalRef = createRef<HTMLInputElement>()

  const submitTambah: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    const tanggal = new Date(tanggalRef.current!.value)
    const nama = namaRef.current!.value
    const tanggalString = formatDate(tanggal, "EEEE, dd MMMM yyyy")
    const timeString = formatDate(tanggal, "HH:mm")
    const confirm = await showConfirm({ title: `Membuat jadwal test pada ${tanggalString} pukul ${timeString}?` })
    if (!confirm) return

    const endpoint = `${BASE_URL}/jadwal_test/add`
    const body = JSON.stringify({ tanggal, nama })
    const response = await handleForm({ endpoint, setLoading, setError, body })
    if (!response.status) return

    navigate("/jadwal_test")
  }
  
  return (
    <AppCard title="+ Jadwal Test Baru">
      <form onSubmit={submitTambah} className="flex flex-col w-fit pt-6">
        <ErrorView error={error} />
        <TextField inputRef={namaRef} label="Nama Test" required />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            label="Pilih jadwal test"
            className="!mb-4 !mt-2"
            inputRef={tanggalRef}
            format="yyyy/MM/dd HH:mm"
            slotProps={{
              textField: { required: true }
            }}
          />
        </LocalizationProvider>
        <Button type="submit" variant="contained" loading={loading}>
          + Tambah
        </Button>
      </form>
    </AppCard>
  )
}
