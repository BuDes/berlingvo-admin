import { useNavigate, useParams } from "react-router-dom";
import AddSoalForm from "./AddSoalForm";
import { useEffect, useRef, useState, type FormEventHandler } from "react";
import type NewSoal from "./types/new_soal";
import { v4 } from "uuid";
import { Button } from "@mui/material";
import AppCard from "../../components/AppCard";
import { BASE_URL } from "../../lib/constants";
import { handleForm } from "../../lib/utils";
import ErrorView from "../../components/ErrorView";

export default function AddSoalPage() {
  const { idJenis } = useParams()
  const { listSoal, keys, addForm, removeForm, onValuesChange } = useSoalForm(idJenis!)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const submitSoal: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    
    const formData = new FormData()
    listSoal.forEach((soal, index) => {
      if (soal.audioFile) formData.append(keys[index], soal.audioFile)
    })
    const parsedSoal = listSoal.map((soal, index) => {
      const audioFile = soal.audioFile ? keys[index] : null
      return { ...soal, audioFile }
    })
    console.log(parsedSoal)
    formData.append("data", JSON.stringify(parsedSoal))

    const endpoint = `${BASE_URL}/soal/add_many`
    const response = await handleForm({
      endpoint,
      body: formData,
      setError,
      setLoading,
      json: false,
    })
    if (response.status) navigate(`/soal/jenis/${idJenis}`)
  }
  
  return (
    <form onSubmit={submitSoal} className="w-full">
      {keys.map((key, index) => {
        return (
          <AddSoalForm
            key={key}
            idJenisMateri={idJenis!}
            formIndex={index}
            onChange={onValuesChange}
            defaultValues={listSoal[index]}
            onRemove={removeForm}
            formKey={key}
          />
        )
      })}
      <div className="text-center mb-4">
        <Button color="info" onClick={addForm}>
          + Tambah Soal
        </Button>
      </div>
      <AppCard className="items-center flex flex-col !p-4">
        <ErrorView error={error} />
        <Button
          className="!text-base w-64"
          variant="contained"
          type="submit"
          loading={loading}
        >
          Submit Soal
        </Button>
      </AppCard>
    </form>
  )
}

function useSoalForm(idJenis: string) {
  const [keys, setKeys] = useState<string[]>([])
  const listSoal = useRef<NewSoal[]>([])
  
  const addForm = () => {
    const idOpsiBenar = v4()
    const key = v4()
    listSoal.current.push({
      key,
      pertanyaan: "",
      idJenisMateri: idJenis,
      tipe: "practice",
      audioFile: null,
      idOpsiBenar,
      opsi: [
        { id: idOpsiBenar, isi: "" },
        { id: v4(), isi: "" },
        { id: v4(), isi: "" },
        { id: v4(), isi: "" },
      ]
    })
    setKeys((prev) => [...prev, key])
  }

  const removeForm = (index: number) => {
    listSoal.current.splice(index, 1)
    setKeys((prev) => prev.filter((_, i) => i !== index))
  }

  const onValuesChange = (index: number, soal: NewSoal) => {
    listSoal.current[index] = soal
  }

  useEffect(() => {
    addForm()
  }, [])

  return {
    listSoal: listSoal.current,
    keys,
    addForm,
    removeForm,
    onValuesChange
  }
}