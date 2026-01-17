'use client'
import { useState } from 'react'

export default function CheckoutButton() {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      // 1. Llamamos a TU backend
      const response = await fetch('/api/checkout_mercadopago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price: 9990,
          description: 'Actualización a PRO (Vitalicio)'
        })
      })

      const data = await response.json()

      // 2. Si nos devuelve el link, redirigimos a MercadoPago
      if (data.init_point) {
        window.location.href = data.init_point
      } else {
        alert('Error al generar el pago. Revisa la consola.')
        console.error(data)
      }
    } catch (error) {
      console.error(error)
      alert('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handleCheckout}
      disabled={loading}
      className="w-full py-4 rounded-xl bg-green-500 hover:bg-green-400 text-black font-black transition-all shadow-lg shadow-green-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
    >
      {loading ? (
        <>
          <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Procesando...
        </>
      ) : (
        'Obtener Plan PRO ($9.990)'
      )}
    </button>
  )
}