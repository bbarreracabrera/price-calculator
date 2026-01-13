"use client"

import { useSearchParams } from "next/navigation"

export default function LoginClient() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  return (
    <div style={{ padding: 24 }}>
      <h1>Iniciar sesión</h1>

      {error && (
        <p style={{ color: "red" }}>
          Error al iniciar sesión: {error}
        </p>
      )}

      <form method="post" action="/api/auth/login">
        <button type="submit">
          Iniciar sesión
        </button>
      </form>
    </div>
  )
}
