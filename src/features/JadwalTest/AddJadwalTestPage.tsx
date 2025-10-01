import AppCard from "../../components/AppCard";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { createRef, useState, type FormEventHandler } from "react";
import { Button } from "@mui/material";
import { handleForm, showConfirm } from "../../lib/utils";
import { formatDate } from "date-fns";
import { BASE_URL } from "../../lib/constants";
import ErrorView from "../../components/ErrorView";
import { useNavigate } from "react-router-dom";

export default function AddJadwalTestPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  
  const tanggalRef = createRef<HTMLInputElement>()
  const submitTambah: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    const tanggal = new Date(tanggalRef.current!.value)
    const tanggalString = formatDate(tanggal, "EEEE, dd MMMM yyyy")
    const timeString = formatDate(tanggal, "HH:mm")
    const confirm = await showConfirm({ title: `Membuat jadwal test pada ${tanggalString} pukul ${timeString}?` })
    if (!confirm) return

    const endpoint = `${BASE_URL}/jadwal_test/add`
    const body = JSON.stringify({ tanggal })
    const response = await handleForm({ endpoint, setLoading, setError, body })
    if (!response.status) return

    navigate("/jadwal_test")
  }
  
  return (
    <AppCard title="+ Jadwal Test Baru">
      <form onSubmit={submitTambah} className="flex flex-col w-fit pt-6">
        <ErrorView error={error} />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            label="Pilih jadwal test"
            className="!mb-4"
            inputRef={tanggalRef}
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
