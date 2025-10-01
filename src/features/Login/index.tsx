import { Button, TextField } from "@mui/material"
import { createRef, useState, type FormEventHandler } from "react"
import { getTextFieldValue, handleForm } from "../../lib/utils"
import { BASE_URL } from "../../lib/constants"
import ErrorView from "../../components/ErrorView"
import { useNavigate } from "react-router-dom"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const usernameRef = createRef<HTMLDivElement>()
  const passwordRef = createRef<HTMLDivElement>()
  const navigate = useNavigate()
  
  const submitLogin: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    const endpoint = `${BASE_URL}/admin/login`
    const username = getTextFieldValue(usernameRef)
    const password = getTextFieldValue(passwordRef)
    
    const body = JSON.stringify({ username, password })
    const response = await handleForm({
      setLoading,
      setError,
      endpoint,
      body
    })
    const { status, data } = response
    if (status) {
      localStorage.setItem("USERNAME", data["username"])
      navigate("/")
    }
  }
  
  return (
    <main className="bg-primary h-screen w-screen flex">
      <div className="
        bg-white p-8 rounded-3xl m-auto shadow-xl shadow-black/20
      ">
        <div className="flex items-center justify-center">
          <img src="/logo.png" alt="Berlingvo" className="size-10" />
          <h1 className="text-xl font-semibold text-center ml-6">
            Login Admin
          </h1>
        </div>
        <form
          onSubmit={submitLogin}
          className="flex flex-col w-[22rem] pt-5 !space-y-2"
        >
          <ErrorView error={error} />
          <TextField ref={usernameRef} name="username" label="Username" required />
          <TextField ref={passwordRef} name="password" label="Password" type="password" required />
          <Button variant="contained" type="submit" className="!mt-5" loading={loading}>
            Login
          </Button>
        </form>
      </div>
    </main>
  )
}
