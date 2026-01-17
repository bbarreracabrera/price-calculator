'use client'
import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import LimitModal from './LimitModal' 

export default function Calculator() {
  // --- 1. ESTADOS DE DATOS ---
  const [hours, setHours] = useState(10)
  const [hourRate, setHourRate] = useState(25000)
  const [expenses, setExpenses] = useState(5000)
  const [margin, setMargin] = useState(30)
  const [iva, setIva] = useState(true)

  // --- 2. ESTADOS DE LÓGICA & UI ---
  const [supabase] = useState(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ))
  const [userId, setUserId] = useState<string | null>(null)
  const [projectCount, setProjectCount] = useState(0)
  const [showLimitModal, setShowLimitModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [animate, setAnimate] = useState(false) // Animación del precio

  // --- 3. CARGAR USUARIO Y LÍMITES ---
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUserId(session.user.id)
        const { count } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', session.user.id)
        
        setProjectCount(count || 0)
      }
    }
    checkUser()
  }, [supabase])

  // --- 4. CÁLCULOS MATEMÁTICOS ---
  const basePrice = hours * hourRate + expenses
  const marginValue = basePrice * (margin / 100)
  const subtotal = basePrice + marginValue
  const ivaValue = iva ? subtotal * 0.19 : 0
  const total = subtotal + ivaValue

  // Efecto visual al cambiar el total
  useEffect(() => {
    setAnimate(true)
    const timer = setTimeout(() => setAnimate(false), 300)
    return () => clearTimeout(timer)
  }, [total])

  // --- 5. FUNCIÓN: COPIAR PROPUESTA (WhatsApp Style) ---
  const copyToClipboard = () => {
    const text = `
📄 *PRESUPUESTO ESTIMADO*
------------------------------------
🔹 *Servicios Profesionales:*
• Horas estimadas: ${hours} hrs
• Tarifa base: $${(hours * hourRate).toLocaleString('es-CL')}

🔹 *Costos Operacionales:*
• Insumos/Software: $${expenses.toLocaleString('es-CL')}

------------------------------------
💰 *Subtotal Neto:* $${Math.round(subtotal).toLocaleString('es-CL')}
${iva ? `🏛 *IVA (19%):* $${Math.round(ivaValue).toLocaleString('es-CL')}` : ''}
------------------------------------
✅ *TOTAL FINAL:* $${total.toLocaleString('es-CL')}

_Generado con PriceCalc_ 🚀
    `.trim()

    navigator.clipboard.writeText(text)
    // Feedback visual simple (podrías usar un toast, pero alert funciona bien por ahora)
    alert('📋 ¡Propuesta copiada! Lista para pegar en WhatsApp o Correo.')
  }

  // --- 6. FUNCIÓN: GUARDAR EN HISTORIAL (Base de Datos) ---
  const handleSave = async () => {
    if (!userId) return alert('⚠️ Inicia sesión para guardar tu presupuesto.')
    
    // Verificación del límite (Plan Free: Máx 3)
    if (projectCount >= 3) {
      setShowLimitModal(true)
      return
    }

    setSaving(true)
    const { error } = await supabase.from('projects').insert({
      user_id: userId,
      name: `Proyecto ${new Date().toLocaleDateString('es-CL')} - ${new Date().getHours()}:${new Date().getMinutes()}`,
      pocket_money: subtotal,
      total_price: total,
      details: { 
        hours, 
        rate: hourRate, 
        expenses, 
        margin, 
        include_iva: iva, 
        iva_amount: ivaValue 
      }
    })

    if (!error) {
      window.location.href = '/dashboard' // Redirige al éxito
    } else {
      alert('Error al guardar: ' + error.message)
    }
    setSaving(false)
  }

  return (
    <>
      <LimitModal isOpen={showLimitModal} onClose={() => setShowLimitModal(false)} />

      <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
        
        {/* === COLUMNA IZQUIERDA: INPUTS === */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">Configuración</h3>
            <p className="text-sm text-slate-400">Define los parámetros de tu servicio.</p>
          </div>

          <div className="space-y-5">
            <Field 
              label="Horas estimadas" 
              value={hours} 
              onChange={setHours} 
              placeholder="Ej: 10"
            />
            
            <Field 
              label="Valor hora (CLP)" 
              value={hourRate} 
              onChange={setHourRate} 
              placeholder="Ej: 25000"
              isCurrency
            />

            <Field 
              label="Gastos extra (Software, insumos)" 
              value={expenses} 
              onChange={setExpenses} 
              placeholder="Ej: 5000"
              isCurrency
            />

            <div className="pt-2">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-400">Margen de ganancia</label>
                <span className="text-sm font-bold text-green-400">{margin}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={margin} 
                onChange={(e) => setMargin(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
            </div>

            <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-700/50 bg-slate-800/50 hover:bg-slate-800 transition cursor-pointer group">
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${iva ? 'bg-green-500 border-green-500' : 'border-slate-500 bg-transparent'}`}>
                {iva && <svg className="w-3.5 h-3.5 text-black font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </div>
              <input 
                type="checkbox" 
                className="hidden"
                checked={iva}
                onChange={e => setIva(e.target.checked)}
              />
              <span className="text-slate-300 group-hover:text-white transition">Aplicar IVA (19%)</span>
            </label>
          </div>
        </div>

        {/* === COLUMNA DERECHA: RESULTADOS (STICKY CARD) === */}
        <div className="relative">
          <div className="sticky top-24 bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">
            
            <div className="space-y-4">
              <ResultRow label="Costo base (Horas + Gastos)" value={basePrice} />
              <ResultRow label="Tu Ganancia" value={marginValue} isGreen />
              <div className="h-px bg-slate-700 my-2" />
              <ResultRow label="Subtotal Neto" value={subtotal} />
              {iva && <ResultRow label="IVA (19%)" value={ivaValue} />}
            </div>

            <div className="pt-4 border-t border-slate-600">
              <p className="text-sm text-slate-400 mb-1">Precio sugerido al cliente</p>
              <div className={`text-4xl md:text-5xl font-extrabold text-white transition-all duration-300 ${animate ? 'scale-105 text-green-400' : ''}`}>
                ${total.toLocaleString('es-CL')}
              </div>
            </div>

            {/* --- ZONA DE ACCIONES (NUEVO DISEÑO DE BOTONES) --- */}
            <div className="grid grid-cols-5 gap-3 pt-2">
               {/* Botón 1: Copiar Propuesta (MVP) */}
               <button 
                 onClick={copyToClipboard}
                 className="col-span-1 flex items-center justify-center bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all border border-slate-600 hover:border-slate-500 active:scale-95"
                 title="Copiar resumen para WhatsApp"
               >
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
               </button>

               {/* Botón 2: Guardar (Principal) */}
               <button 
                 onClick={handleSave}
                 disabled={saving}
                 className="col-span-4 group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 text-slate-950 font-bold py-4 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 <span className="relative z-10 flex items-center justify-center gap-2">
                   {saving ? (
                     'Guardando...'
                   ) : (
                     <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                        Guardar Presupuesto
                     </>
                   )}
                 </span>
                 {/* Efecto de brillo */}
                 {!saving && <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />}
               </button>
            </div>
            
            <p className="text-center text-xs text-slate-500">
              {userId ? (
                <>Has usado <strong>{projectCount}</strong> de 3 cálculos gratuitos.</>
              ) : (
                'Inicia sesión para guardar historial.'
              )}
            </p>
          </div>
        </div>

      </div>
    </>
  )
}

/* --- SUBCOMPONENTES REUTILIZABLES --- */

function Field({ label, value, onChange, placeholder, isCurrency }: any) {
  return (
    <div className="space-y-1.5 group">
      <label className="text-sm font-medium text-slate-400 group-focus-within:text-green-400 transition-colors">
        {label}
      </label>
      <div className="relative">
        {isCurrency && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
        )}
        <input
          type="number"
          value={value === 0 ? '' : value}
          onChange={e => onChange(Number(e.target.value))}
          placeholder={placeholder}
          className={`w-full bg-slate-900/50 border border-slate-700 text-white rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all placeholder:text-slate-600 ${isCurrency ? 'pl-7' : ''}`}
        />
      </div>
    </div>
  )
}

function ResultRow({ label, value, isGreen }: any) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-slate-300">{label}</span>
      <span className={`font-semibold text-lg ${isGreen ? 'text-green-400' : 'text-white'}`}>
        ${Math.round(value).toLocaleString('es-CL')}
      </span>
    </div>
  )
}