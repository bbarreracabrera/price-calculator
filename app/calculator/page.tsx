import { redirect } from 'next/navigation'
import CalculatorForm from '@/components/CalculatorForm'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'

export default async function CalculatorPage() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Verificar límites del usuario
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const isPro = (profile as any)?.is_pro ?? false
  const calculationsCount = (profile as any)?.calculations_count ?? 0
  const maxCalculations = isPro ? Infinity : 3
  const canCalculate = isPro || calculationsCount < maxCalculations

  if (!canCalculate) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Calculadora de Precios</h1>
          <p className="mt-2 text-gray-600">
            Ingresa los datos para calcular el precio sugerido con margen e IVA
          </p>
        </div>

        <CalculatorForm userId={user.id} isPro={isPro} />
      </div>
    </div>
  )
}

