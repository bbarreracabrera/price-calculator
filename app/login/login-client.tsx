'use client'

import { useSearchParams } from 'next/navigation'

export default function LoginClient() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div>
      {error && (
        <p className="text-red-500 text-sm mb-4">
          Error: {error}
        </p>
      )}

      {/* formulario de login */}
    </div>
  )
}
