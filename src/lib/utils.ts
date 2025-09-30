import type { RefObject } from "react"

interface handleFormArgs {
  endpoint: string
  body: any
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  method?: "POST" | "PUT" | "DELETE"
}
export async function handleForm({ endpoint, body, setLoading, setError, method = "POST" }: handleFormArgs): Promise<boolean> {
  try {
    setLoading(true)
    setError(null)
    const response = await fetch(endpoint, {
      method,
      headers: {"Content-Type": "application/json"},
      body,  
    })
    setLoading(false)

    if (response.status < 300) {
      setError(null)
      return true
    }

    const json = await response.json()
    setError(json["message"] ?? "Terjadi kesalahan")
    return false
  } catch (error) {
    setError("Terjadi kesalahan")
    return false
  }
}

export function getTextFieldValue(key: RefObject<HTMLDivElement | null>) {
  return key.current?.querySelector("input")?.value
}