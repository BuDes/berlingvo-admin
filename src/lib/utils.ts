import type { RefObject } from "react"
import Swal, { type SweetAlertIcon } from "sweetalert2";

interface handleFormArgs {
  endpoint: string
  body?: any
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  method?: "POST" | "PUT" | "DELETE"
  json?: boolean
}
interface handleFormResponse {
  status: boolean
  data: any
}
export async function handleForm({ endpoint, body, setLoading, setError, method = "POST", json = true }: handleFormArgs): Promise<handleFormResponse> {
  try {
    setLoading(true)
    setError(null)
    const response = await fetch(endpoint, {
      method,
      headers: json ? {"Content-Type": "application/json"} : undefined,
      body,  
    })
    setLoading(false)
    const { message, data } = await response.json()

    if (response.status < 300) {
      setError(null)
      return { status: true, data }
    }

    setError(message ?? "Terjadi kesalahan")
    return { status: false, data }
  } catch (error) {
    setError("Terjadi kesalahan")
    return { status: false, data: null }
  }
}

export function getTextFieldValue(key: RefObject<HTMLDivElement | null>) {
  return key.current?.querySelector("input")?.value
}

export const getRequest = async <T = any>(endpoint: string) => {
  const response = await fetch(endpoint)
  const json = await response.json()
  const data = json.data as T
  return {
    status: response.status,
    json,
    data
  }
}

interface showConfirmArgs {
  title: string
  confirmText?: string
  icon?: SweetAlertIcon
  buttonColor?: string
}
export async function showConfirm({ title, confirmText = "Iya", icon = "question", buttonColor = "var(--color-primary)" }: showConfirmArgs) {
  const result = await Swal.fire({
    title,
    icon: icon,
    confirmButtonText: confirmText,
    showCancelButton: true,
    cancelButtonText: "Batal",
    reverseButtons: true,
    confirmButtonColor: buttonColor,
    cancelButtonColor: "var(--color-neutral-400)"
  })

  return result.isConfirmed
}