"use client"

import { useSearchParams } from "next/navigation"

export default function LoginClient() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

return (
  <div style={{ padding: 40, background: "#fff", minHeight: "100vh" }}>
    <h1 style={{ fontSize: 32, marginBottom: 20 }}>
      Iniciar sesión
    </h1>

    <form method="post" action="/api/auth/login">
      <button
        type="submit"
        style={{
          padding: "12px 20px",
          background: "black",
          color: "white",
          fontSize: 16,
          borderRadius: 6
        }}
      >
        Iniciar sesión
      </button>
    </form>
  </div>
)
}
