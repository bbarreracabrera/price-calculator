"use client"

import { useSearchParams } from "next/navigation"

export default function LoginClient() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Iniciar sesión</h1>

        {error && (
          <p className="text-sm text-red-500">
            Error: {error}
          </p>
        )}

        {/* Aquí va tu formulario de login */}
      </div>
    </div>
  )
}