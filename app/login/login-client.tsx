'use client'

import { useSearchParams } from 'next/navigation'

export default function LoginClient() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
