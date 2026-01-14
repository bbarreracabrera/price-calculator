'use client' // necesario si vas a usar componentes interactivos

import React from 'react'

export default function Page() {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          {/* Logo inline */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="40" height="40">
            <rect x="8" y="8" width="48" height="48" rx="8" fill="#2563EB"/>
            <rect x="16" y="16" width="32" height="12" rx="2" fill="white"/>
            <rect x="16" y="32" width="32" height="16" rx="2" fill="white"/>
          </svg>
          <span className="font-bold text-xl">Calculadora Inteligente de Precios</span>
        </div>
        <div className="space-x-4">
          <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition">Iniciar Sesión</button>
          <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Crear Cuenta</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between p-12 md:p-24 bg-blue-50">
        <div className="md:w-1/2 space-y-4">
          <h1 className="text-4xl font-bold text-blue-900">Calculadora Inteligente de Precios</h1>
          <p className="text-lg text-gray-700">Calcula tus precios de venta de forma rápida y precisa.</p>
          <div className="flex space-x-4 mt-6">
            {/* Botón Google con icono inline */}
            <button className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 533.5 544.3" width="20" height="20">
                <path fill="#4285F4" d="M533.5 278.4c0-17.9-1.6-35.1-4.7-51.8H272v98.1h147.1c-6.4 34.7-25.9 64.1-55.4 84l89.1 69c52-48.1 81.7-118.3 81.7-199.3z"/>
                <path fill="#34A853" d="M272 544.3c74.7 0 137.5-24.7 183.4-67.1l-89.1-69c-24.9 16.8-56.7 26.8-94.3 26.8-72.5 0-134-48.8-155.8-114.5l-91.1 70.3C61.1 473 160 544.3 272 544.3z"/>
                <path fill="#FBBC05" d="M116.2 321.5c-5.6-16.6-8.8-34.3-8.8-52.5s3.2-35.9 8.8-52.5l-91.1-70.3C10.6 202 0 261.5 0 278.9s10.6 76.9 25.1 132.7l91.1-70.1z"/>
                <path fill="#EA4335" d="M272 107.4c40.6 0 76.9 13.9 105.6 41.3l79-79C403.2 24.1 340.4 0 272 0 160 0 61.1 71.3 25.1 170.1l91.1 70.3C138 156.2 199.5 107.4 272 107.4z"/>
              </svg>
              <span>Iniciar con Google</span>
            </button>
            <button className="px-6 py-3 border border-gray-400 rounded hover:bg-gray-100 transition">Comenzar Gratis</button>
          </div>
        </div>
        <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center">
          {/* Ilustración inline placeholder */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" width="300" height="200">
            <rect width="300" height="200" fill="#D1FAE5"/>
            <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="#065F46" fontSize="20">Ilustración</text>
          </svg>
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
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Comenzar Gratis</button>
        </div>

        <div className="border rounded-lg p-6 text-center shadow hover:shadow-lg transition">
          <h2 className="text-2xl font-bold mb-2">Plan Pro</h2>
          <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full mb-4">Premium</span>
          <ul className="space-y-2 mb-4">
            <li>Cálculos ilimitados</li>
            <li>Reportes avanzados</li>
            <li>Soporte prioritario</li>
          </ul>
          <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Mejorar a Pro</button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="p-12 md:p-24 bg-gray-50 grid md:grid-cols-3 gap-8 text-center">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="48" height="48">
            <circle cx="32" cy="32" r="30" fill="#3B82F6"/>
            <path fill="white" d="M32 16v16l12 8"/>
          </svg>
          <h3 className="font-bold mb-2">Rápido y Preciso</h3>
          <p>Obtén resultados al instante.</p>
        </div>

        <div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="48" height="48">
            <circle cx="32" cy="32" r="30" fill="#10B981"/>
            <path fill="white" d="M20 32l8 8 16-16"/>
          </svg>
          <h3 className="font-bold mb-2">Fácil de Usar</h3>
          <p>Interfaz simple e intuitiva.</p>
        </div>

        <div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="48" height="48">
            <circle cx="32" cy="32" r="30" fill="#6366F1"/>
            <path fill="white" d="M32 16c-8 0-8 8-8 8v8h16v-8s0-8-8-8z"/>
          </svg>
          <h3 className="font-bold mb-2">100% Seguro</h3>
          <p>Tus datos siempre protegidos.</p>
        </div>
      </section>
    </div>
  )
}

