'use client'

import Link from 'next/link'
import GoogleLoginButton from './components/GoogleLoginButton'

export default function Page() {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      <section className="flex flex-col md:flex-row items-center justify-between p-12 md:p-24 bg-blue-50">
        <div className="md:w-1/2 space-y-4">
          <h1 className="text-4xl font-bold text-blue-900">Calcula tus precios al instante</h1>
          <p className="text-lg text-gray-700">Serio, rápido y fácil: la herramienta que tu negocio necesita.</p>
          <div className="flex space-x-4 mt-6">
            <GoogleLoginButton />
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
