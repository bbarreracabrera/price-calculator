import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import { redirect } from 'next/navigation'

export default async function PricingPage() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const isPro = (profile as any)?.is_pro ?? false

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Planes y Precios</h1>
          <p className="text-xl text-gray-600">
            Elige el plan que mejor se adapte a tus necesidades
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Plan Free */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Plan Free</h2>
              <div className="text-4xl font-bold text-gray-900 mb-1">$0</div>
              <p className="text-gray-500">Gratis para siempre</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Hasta 3 cálculos totales</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Calculadora completa</span>
              </li>
            </ul>

            {!isPro ? (
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <p className="text-sm font-semibold text-gray-700">Plan Actual</p>
              </div>
            ) : (
              <button disabled className="w-full bg-gray-300 text-gray-500 py-3 px-4 rounded-lg font-semibold cursor-not-allowed">
                Plan Actual
              </button>
            )}
          </div>

          {/* Plan Pro */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-purple-500 relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Recomendado
              </span>
            </div>

            <div className="text-center mb-6 mt-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Plan Pro</h2>
              <div className="text-4xl font-bold text-purple-600 mb-1">$9.990</div>
              <p className="text-gray-500">Pago único mensual</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Cálculos ilimitados</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Historial completo de cálculos</span>
              </li>
            </ul>

            {isPro ? (
              <div className="bg-purple-100 rounded-lg p-4 text-center">
                <p className="text-sm font-semibold text-purple-700">Plan Actual</p>
              </div>
            ) : (
              <button disabled className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors opacity-75 cursor-not-allowed">
                Próximamente: MercadoPago
              </button>
            )}
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/dashboard" className="text-primary-600 hover:text-primary-700 font-semibold">
            ← Volver al Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

