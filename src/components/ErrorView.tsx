interface ErrorViewProps {
  error: string | null
  twColor?: string
}
export default function ErrorView({ error, twColor = "text-red-500" }: ErrorViewProps) {
  return (
    <p className={`
      text-center ${twColor}
    `}>
      {error}
    </p>
  )
}
