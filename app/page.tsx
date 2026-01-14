'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function Page() {
  const router = useRouter()

  // Detecta si el usuario ya tiene sesión al cargar la página
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/dashboard') // Redirige directamente si ya está logueado
      }
    }
    checkSession()
  }, [router])

  // Función de login con Google
  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard` // ruta final después del login
      }
    })
    if (error) console.error('Error iniciando sesión:', error.message)
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">

      {/* Header */}
      <header className="flex justify-between items-center p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <img src="/finance.svg" alt="Logo" className="w-10 h-10" />
          <span className="font-bold text-xl">Calculadora Inteligente de Precios</span>
        </div>
        <div className="space-x-4">
          <Link href="/login">
            <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition">
              Iniciar Sesión
            </button>
          </Link>
          <Link href="/register">
            <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
              Crear Cuenta
            </button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between p-12 md:p-24 bg-blue-50">
        <div className="md:w-1/2 space-y-4">
          <h1 className="text-4xl font-bold text-blue-900">Calcula tus precios al instante</h1>
          <p className="text-lg text-gray-700">Serio, rápido y fácil: la herramienta que tu negocio necesita.</p>
          <div className="flex space-x-4 mt-6">
            {/* Botón de Google Login */}
            <button
              onClick={handleGoogleSignIn}
              className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Iniciar con Google
            </button>

            <Link href="/register">
              <button className="px-6 py-3 border border-gray-400 rounded hover:bg-gray-100 transition">
                Comenzar Gratis
              </button>
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center">
          <img src="/manos.svg" alt="Profesional de negocios" className="w-full max-w-md" />
        </div>
      </section>

      {/* Plans Section */}
      <section className="p-12 md:p-24 grid md:grid-cols-2 gap-8">
        <div className="border rounded-lg p-6 text-center shadow hover:shadow-lg transition">
          <h2 className="text-2xl font-bold mb-2">Plan Gratuito</h2>
          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full mb-4">Gratis</span>
          <ul className="space-y-2 mb-4">
            <li>3 cálculos por mes</li>
            <li>Funciones básicas</li>
            <li>Soporte estándar</li>
          </ul>
          <Link href="/register">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Comenzar Gratis</button>
          </Link>
        </div>

        <div className="border rounded-lg p-6 text-center shadow hover:shadow-lg transition">
          <h2 className="text-2xl font-bold mb-2">Plan Pro</h2>
          <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full mb-4">Premium</span>
          <ul className="space-y-2 mb-4">
            <li>Cálculos ilimitados</li>
            <li>Reportes avanzados</li>
            <li>Soporte prioritario</li>
          </ul>
          <Link href="/register">
            <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Mejorar a Pro</button>
          </Link>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="p-12 md:p-24 bg-gray-50 grid md:grid-cols-3 gap-8 text-center">
        <div>
          <img src="/finance.svg" alt="Seriedad" className="mx-auto w-32 h-32" />
          <h3 className="font-bold mt-4">Seriedad</h3>
          <p>Diseñado para negocios y usuarios exigentes.</p>
        </div>

        <div>
          <img src="/mujernegocio.svg" alt="Facilidad" className="mx-auto w-32 h-32" />
          <h3 className="font-bold mt-4">Facilidad</h3>
          <p>Interfaz simple e intuitiva para todos los usuarios.</p>
        </div>

        <div>
          <img src="/todoeldato.svg" alt="Rapidez" className="mx-auto w-32 h-32" />
          <h3 className="font-bold mt-4">Rapidez</h3>
          <p>Resultados en segundos, listos para usar.</p>
        </div>
      </section>

    </div>
  )
}
