import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function PricingPage() {
  const supabase = await createServerSupabaseClient()
  
  // 1. Obtenemos usuario (pero NO redirigimos si no existe, para que todos vean precios)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let isPro = false

  // 2. Si hay usuario, verificamos si es PRO
  if (user) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('is_pro')
      .eq('id', user.id)
      .single()
    
    isPro = (profile as any)?.is_pro ?? false
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white py-24 px-6 relative overflow-hidden">
      
      {/* Fondos decorativos (Mismo estilo que la Home) */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* HEADER */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Planes y Precios
          </h1>
          <p className="text-slate-400 text-lg">
            Invierte en tu tranquilidad. Elige el plan que se adapte a tu etapa actual.
          </p>
        </div>

        {/* GRID DE PLANES */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* PLAN FREE */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 flex flex-col hover:border-slate-700 transition-colors">
            <div className="mb-6 text-center">
              <h3 className="text-xl font-semibold text-slate-300">Freelancer (Free)</h3>
              <div className="mt-4 flex justify-center items-baseline gap-1">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-slate-500">/mes</span>
              </div>
              <p className="mt-2 text-slate-400 text-sm">Para empezar a ordenarte.</p>
            </div>

            <ul className="space-y-4 mb-8 flex-1 px-4">
              <Feature text="Calculadora completa (IVA + Margen)" />
              <Feature text="Hasta 3 cálculos guardados (Demo)" />
              <Feature text="Exportación básica" />
            </ul>

            {/* Lógica del Botón FREE */}
            {!user ? (
               <Link href="/login" className="block w-full">
                 <button className="w-full py-3 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-700 border border-slate-700 transition-all">
                   Crear cuenta gratis
                 </button>
               </Link>
            ) : !isPro ? (
              <div className="w-full py-3 rounded-xl bg-slate-800/50 text-slate-400 font-medium text-center border border-slate-800">
                Tu plan actual
              </div>
            ) : (
              <div className="w-full py-3 rounded-xl bg-slate-800/50 text-slate-500 font-medium text-center border border-slate-800">
                Plan Básico
              </div>
            )}
          </div>

          {/* PLAN PRO (Destacado) */}
          <div className="relative bg-slate-900 border border-green-500/50 rounded-3xl p-8 shadow-2xl shadow-green-500/10 flex flex-col transform md:-translate-y-4">
            
            <div className="absolute top-0 right-0 bg-green-500 text-slate-950 text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">
              RECOMENDADO
            </div>

            <div className="mb-6 text-center">
              <h3 className="text-xl font-semibold text-green-400">Profesional (PRO)</h3>
              <div className="mt-4 flex justify-center items-baseline gap-1">
                <span className="text-4xl font-bold text-white">$9.990</span>
                <span className="text-slate-500">/mes</span>
              </div>
              <p className="mt-2 text-slate-400 text-sm">Control total de tu negocio.</p>
            </div>

            <ul className="space-y-4 mb-8 flex-1 px-4">
              <Feature text="Cálculos ilimitados" checkColor="text-green-400" />
              <Feature text="Historial completo en la nube" checkColor="text-green-400" />
              <Feature text="Soporte prioritario" checkColor="text-green-400" />
              <Feature text="Próximamente: Generador de cotizaciones PDF" checkColor="text-green-400" />
            </ul>

            {/* Lógica del Botón PRO */}
            {isPro ? (
               <div className="w-full py-3 rounded-xl bg-green-500/20 text-green-400 font-bold text-center border border-green-500/50">
                 ✅ Tienes el Plan PRO activo
               </div>
            ) : (
               // Aquí es donde irá el botón real de MercadoPago
               // Por ahora lleva al login si no hay usuario, o muestra "Proximamente"
               !user ? (
                 <Link href="/login" className="block w-full">
                   <button className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-slate-950 font-bold hover:shadow-lg hover:shadow-green-500/25 transition-all">
                     Suscribirse Ahora
                   </button>
                 </Link>
               ) : (
                 <form action="/api/checkout_mercadopago" method="POST"> 
                   {/* 👆 Este form preparará el terreno para MercadoPago */}
                   <button 
                    disabled 
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-slate-950 font-bold opacity-80 cursor-not-allowed"
                   >
                     MercadoPago (Configurando...)
                   </button>
                 </form>
               )
            )}
            
            {!isPro && (
                <p className="text-center text-xs text-slate-500 mt-3">
                  Pago seguro vía MercadoPago
                </p>
            )}
          </div>

        </div>

        {/* Link volver */}
        <div className="text-center pt-8">
           {user && (
             <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">
               ← Volver a mi Dashboard
             </Link>
           )}
        </div>

      </div>
    </main>
  )
}

/* --- Componente Auxiliar --- */
function Feature({ text, checkColor = "text-slate-500" }: { text: string, checkColor?: string }) {
  return (
    <li className="flex items-start gap-3 text-slate-300 text-sm">
      <svg className={`w-5 h-5 flex-shrink-0 ${checkColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      <span>{text}</span>
    </li>
  )
}