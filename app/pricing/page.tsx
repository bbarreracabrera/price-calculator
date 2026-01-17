import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
// CORRECCIÓN: Usamos ../ para asegurar que encuentre el componente
import CheckoutButton from '../../components/CheckoutButton' 

export default async function PricingPage() {
  const supabase = await createServerSupabaseClient()
  
  // 1. Obtenemos usuario
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
    <div className="min-h-screen bg-black text-white py-24 px-6 relative overflow-hidden">
      
      {/* === LUCES DE FONDO === */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* HEADER */}
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">
            Planes y <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Precios</span>
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Invierte en tu tranquilidad. Elige el plan que se adapte a tu etapa actual sin letras chicas.
          </p>
        </div>

        {/* GRID DE PLANES */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
          
          {/* === PLAN FREE === */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] p-8 flex flex-col hover:bg-zinc-900/60 transition-all duration-300 group">
            <div className="mb-8">
              <span className="inline-block px-4 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs font-bold uppercase tracking-widest mb-4">
                Inicial
              </span>
              <h3 className="text-3xl font-bold text-white mb-2">Freelancer</h3>
              <p className="text-zinc-500">Para empezar a ordenarte.</p>
            </div>

            <div className="text-5xl font-black text-white mb-8 tracking-tighter">
              $0 <span className="text-lg font-medium text-zinc-500 tracking-normal">/mes</span>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
              <Feature text="Calculadora completa" />
              <Feature text="Hasta 3 cálculos guardados" />
              <Feature text="Exportación básica" />
            </ul>

            {!user ? (
               <Link href="/login" className="block w-full">
                 <button className="w-full py-4 rounded-xl bg-zinc-800 text-white font-bold hover:bg-zinc-700 border border-zinc-700 transition-all">
                   Crear cuenta gratis
                 </button>
               </Link>
            ) : !isPro ? (
              <div className="w-full py-4 rounded-xl bg-zinc-800/50 text-zinc-400 font-medium text-center border border-zinc-800 cursor-default">
                Tu plan actual
              </div>
            ) : (
              <div className="w-full py-4 rounded-xl bg-zinc-800/50 text-zinc-500 font-medium text-center border border-zinc-800 cursor-default">
                Plan Básico
              </div>
            )}
          </div>

          {/* === PLAN PRO === */}
          <div className="relative bg-zinc-900 border border-green-500/30 rounded-[2.5rem] p-8 shadow-2xl shadow-green-900/20 flex flex-col transform md:scale-105 z-20">
            
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 text-black px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-green-500/40">
              RECOMENDADO
            </div>

            <div className="mb-8 mt-2">
              <span className="inline-block px-4 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold uppercase tracking-widest mb-4">
                Profesional
              </span>
              <h3 className="text-3xl font-bold text-white mb-2">Plan PRO</h3>
              <p className="text-zinc-400">Control total de tu negocio.</p>
            </div>

            <div className="text-5xl font-black text-white mb-8 tracking-tighter flex items-end gap-2">
              $9.990 <span className="text-lg font-medium text-zinc-500 tracking-normal mb-1">/único</span>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
              <Feature text="Cálculos ILIMITADOS" checkColor="text-green-400" />
              <Feature text="Historial completo en la nube" checkColor="text-green-400" />
              <Feature text="Soporte prioritario" checkColor="text-green-400" />
              <Feature text="PDFs sin marca de agua" checkColor="text-green-400" />
            </ul>

            {/* BOTÓN INTELIGENTE */}
            {isPro ? (
               <div className="w-full py-4 rounded-xl bg-green-500/20 text-green-400 font-bold text-center border border-green-500/50">
                 ✅ Tienes el Plan PRO activo
               </div>
            ) : (
               !user ? (
                 <Link href="/login" className="block w-full">
                   <button className="w-full py-4 rounded-xl bg-green-500 hover:bg-green-400 text-black font-black transition-all shadow-lg shadow-green-500/20 active:scale-95">
                     Suscribirse Ahora
                   </button>
                 </Link>
               ) : (
                 <CheckoutButton />
               )
            )}
            
            {!isPro && (
                <p className="text-center text-xs text-zinc-500 mt-4 font-medium">
                  Pago seguro vía MercadoPago. Sin suscripciones.
                </p>
            )}
          </div>

        </div>

        <div className="text-center pt-8">
           {user && (
             <Link href="/dashboard" className="text-zinc-500 hover:text-white transition-colors text-sm font-medium">
               ← Volver a mi Dashboard
             </Link>
           )}
        </div>

      </div>
    </div>
  )
}

function Feature({ text, checkColor = "text-zinc-600" }: { text: string, checkColor?: string }) {
  return (
    <li className="flex items-center gap-3 text-zinc-300 text-sm font-medium">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center bg-zinc-800 ${checkColor === "text-zinc-600" ? "text-zinc-400" : "bg-green-500 text-black"}`}>
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span>{text}</span>
    </li>
  )
}