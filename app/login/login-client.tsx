"use client"

import { createClient } from "@/utils/supabase/client"

export default function LoginClient() {
  const supabase = createClient()

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
  }

  return (
    <div style={{ minHeight: "100vh", padding: 40 }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>
        Iniciar sesión
      </h1>

      <button
        onClick={handleLogin}
        style={{
          padding: "12px 20px",
          background: "black",
          color: "white",
          borderRadius: 6,
          fontSize: 16,
        }}
      >
        Iniciar sesión con Google
      </button>
    </div>
  )
}

