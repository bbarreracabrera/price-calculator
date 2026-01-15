'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

type Profile = {
  id: string
  email: string
  is_pro: boolean
  calculations_count: number
}

type Calculation = {
  id: string
  precio_final: number
  created_at: string
  // Agrega aquí otros campos si tu tabla los tiene (ej: proyecto, cliente)
}

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [calculations, setCalculations] = useState<Calculation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data: profileData } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    setProfile(profileData as Profile | null)

    // Si es PRO, cargamos historial
    if ((profileData as any)?.is_pro) {
      const { data: calculationsData } = await supabase
        .from('calculations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setCalculations(calculationsData as Calculation[] || [])
    }

    setLoading(false)
  }

  // --- LÓGICA DE MERCADOPAGO (Se mantiene tu código) ---
  const handleUpgrade = async () => {
    if (!profile) return
    try {
      const res = await fetch('/api/mercadopago/create_preference', {
        method: 'POST',
        body: JSON.stringify({
          plan: 'PRO',
          price: 9990,
          userId: profile.id
        })
      })
      const data = await res.json()
      if(data.init_point) {
          window.location.href = data.init_point
      } else {
          alert("Error: No se recibió link de pago")
      }
    } catch (e: any) {
      alert('Error iniciando pago: ' + e.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          Cargando tu panel...
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white py-12 px-6 relative overflow-hidden">
      
      {/* Fondo decorativo sutil */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        
        {/* HEADER DE BIENVENIDA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-8">
          <div>
            <h1 className="text-3xl font-bold">Panel de Control</h1>
            <p className="text-slate-400 mt-1">
              Bienvenido, <span className="text-white font-medium">{profile?.email}</span>
            </p>
          </div>
          
          <Link href="/calculator">
            <button className="px-6 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition text-sm font-medium">
              + Nuevo Cálculo
            </button>
          </Link>
        </div>

        {/* TARJETAS DE ESTADO (STATS) */}
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Card 1: Plan Actual */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <p className="text-slate-400 text-sm font-medium mb-2">Plan Actual</p>
            <div className="flex items-center gap-3">
              <span className={`text-2xl font-bold ${profile?.is_pro ? 'text-green-400' : 'text-yellow-400'}`}>
                {profile?.is_pro ? 'PRO' : 'Gratuito'}
              </span>
              {profile?.is_pro && (
                <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-xs border border-green-500/20">
                  Activo
                </span>
              )}
            </div>
          </div>

          {/* Card 2: Uso del sistema */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <p className="text-slate-400 text-sm font-medium mb-2">Cálculos realizados</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">{profile?.calculations_count}</span>
              <span className="text-slate-500 text-sm">
                / {profile?.is_pro ? 'Ilimitados' : '3'}
              </span>
            </div>
            {/* Barra de progreso visual para usuarios FREE */}
            {!profile?.is_pro && (
               <div className="w-full h-1 bg-slate-800 rounded-full mt-3 overflow-hidden">
                 <div 
                   className="h-full bg-yellow-400 transition-all duration-500" 
                   style={{ width: `${Math.min(((profile?.calculations_count || 0) / 3) * 100, 100)}%` }} 
                 />
               </div>
            )}
          </div>

          {/* Card 3: Estado de cuenta (Visual) */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
             <div>
                <p className="text-slate-400 text-sm font-medium mb-1">Estado</p>
                <p className="text-white font-medium">Cuenta verificada</p>
             </div>
             <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
               ✓
             </div>
          </div>
        </div>

        {/* ⚠️ ZONA DE UPGRADE (Solo si es FREE) */}
        {!profile?.is_pro && (
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-yellow-500/30 p-8 rounded-2xl relative overflow-hidden group">
            {/* Brillo decorativo */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Desbloquea todo el potencial 🚀
                </h3>
                <p className="text-slate-400 max-w-lg">
                  Has usado <strong>{profile?.calculations_count} de 3</strong> cálculos gratuitos. 
                  Actualiza a PRO para guardar historial ilimitado y exportar tus cotizaciones.
                </p>
              </div>
              
              <button
                onClick={handleUpgrade}
                className="whitespace-nowrap px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-slate-900 font-bold rounded-xl shadow-lg shadow-yellow-500/20 transition-all transform hover:scale-105"
              >
                Actualizar a PRO ($9.990)
              </button>
            </div>
          </div>
        )}

        {/* 📜 HISTORIAL (Solo si es PRO) */}
        {profile?.is_pro && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Historial de Cálculos</h2>
            
            {calculations.length === 0 ? (
              <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
                <p className="text-slate-500">Aún no has guardado ningún cálculo.</p>
                <Link href="/calculator" className="text-green-400 hover:underline mt-2 inline-block">
                  Ir a la calculadora
                </Link>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-950 border-b border-slate-800">
                    <tr>
                      <th className="p-4 text-slate-400 font-medium text-sm">Fecha</th>
                      <th className="p-4 text-slate-400 font-medium text-sm">Precio Final</th>
                      <th className="p-4 text-slate-400 font-medium text-sm text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {calculations.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-800/50 transition">
                        <td className="p-4 text-slate-300">
                          {new Date(c.created_at).toLocaleDateString('es-CL', { 
                            day: 'numeric', month: 'long', year: 'numeric' 
                          })}
                        </td>
                        <td className="p-4 font-bold text-green-400">
                          ${c.precio_final.toLocaleString('es-CL')}
                        </td>
                        <td className="p-4 text-right">
                          <button className="text-sm text-slate-400 hover:text-white transition">
                            Ver detalle →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  )
}