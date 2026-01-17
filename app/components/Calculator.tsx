'use client'
import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import LimitModal from './LimitModal'

export default function Calculator() {
  // --- 1. ESTADOS DE DATOS ---
  const [hours, setHours] = useState(10)
  const [hourRate, setHourRate] = useState(25000)
  const [expenses, setExpenses] = useState(5000)
  const [margin, setMargin] = useState(30)
  const [iva, setIva] = useState(true)

  // --- 2. ESTADOS DE LÓGICA ---
  const [supabase] = useState(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ))
  const [userId, setUserId] = useState<string | null>(null)
  const [projectCount, setProjectCount] = useState(0)
  const [showLimitModal, setShowLimitModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [animate, setAnimate] = useState(false)
  
  // NUEVO: Estados para Clientes
  const [clients, setClients] = useState<any[]>([])
  const [selectedClientId, setSelectedClientId] = useState('')

  // --- 3. CARGAR DATOS (Usuario y Clientes) ---
  useEffect(() => {
    const initData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUserId(session.user.id)
        
        // A) Contar proyectos (Límite Free)
        const { count } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', session.user.id)
        setProjectCount(count || 0)

        // B) Cargar Clientes (Agenda)
        const { data: clientsData } = await supabase
          .from('clients')
          .select('*')
          .eq('user_id', session.user.id)
          .order('name', { ascending: true })
        
        if (clientsData) setClients(clientsData)
      }
    }
    initData()
  }, [supabase])

  // --- 4. CÁLCULOS ---
  const basePrice = hours * hourRate + expenses
  const marginValue = basePrice * (margin / 100)
  const subtotal = basePrice + marginValue
  const ivaValue = iva ? subtotal * 0.19 : 0
  const total = subtotal + ivaValue

  useEffect(() => {
    setAnimate(true)
    const timer = setTimeout(() => setAnimate(false), 300)
    return () => clearTimeout(timer)
  }, [total])

  // --- 5. COPIAR PROPUESTA ---
  const copyToClipboard = () => {
    // Buscamos el nombre del cliente si está seleccionado
    const clientName = clients.find(c => c.id === selectedClientId)?.name || 'Cliente'

    const text = `
📄 *PRESUPUESTO PARA ${clientName.toUpperCase()}*
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
    alert('📋 Propuesta copiada al portapapeles.')
  }

  // --- 6. GUARDAR (Ahora incluye el Cliente) ---
  const handleSave = async () => {
    if (!userId) return alert('⚠️ Inicia sesión para guardar.')
    if (projectCount >= 3) {
      setShowLimitModal(true)
      return
    }

    setSaving(true)

    // Recuperamos el objeto cliente completo para guardarlo en el historial
    // (Así, si borras el cliente de la agenda, el presupuesto histórico no pierde los datos)
    const clientSnapshot = clients.find(c => c.id === selectedClientId) || null
    const projectName = clientSnapshot ? `Proyecto para ${clientSnapshot.name}` : `Proyecto ${new Date().toLocaleDateString('es-CL')}`

    const { error } = await supabase.from('projects').insert({
      user_id: userId,
      name: projectName,
      pocket_money: subtotal,
      total_price: total,
      details: { 
        hours, 
        rate: hourRate, 
        expenses, 
        margin, 
        include_iva: iva, 
        iva_amount: ivaValue,
        client: clientSnapshot // <--- AQUÍ GUARDAMOS AL CLIENTE
      }
    })

    if (!error) {
      window.location.href = '/dashboard'
    } else {
      alert('Error al guardar: ' + error.message)
    }
    setSaving(false)
  }

  return (
    <>
      <LimitModal isOpen={showLimitModal} onClose={() => setShowLimitModal(false)} />

      <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
        
        {/* === IZQUIERDA: CONFIGURACIÓN === */}
        <div className="space-y-8">
          
          {/* SELECCIÓN DE CLIENTE (NUEVO BLOQUE) */}
          <div className="bg-zinc-900/50 p-5 rounded-xl border border-zinc-800">
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                👤 Asignar a Cliente <span className="text-zinc-500 font-normal">(Opcional)</span>
              </label>
              <Link href="/clients" className="text-xs text-green-400 hover:text-green-300 hover:underline">
                + Crear Nuevo
              </Link>
            </div>
            
            {clients.length > 0 ? (
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full bg-black border border-zinc-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none appearance-none cursor-pointer"
              >
                <option value="">-- Sin Cliente (Genérico) --</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            ) : (
              <div className="text-sm text-zinc-500 bg-black/50 p-3 rounded-lg border border-zinc-800 border-dashed">
                No tienes clientes guardados. <Link href="/clients" className="text-green-400 underline">Agrega uno aquí</Link>.
              </div>
            )}
          </div>

          {/* INPUTS DE CÁLCULO */}
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
              label="Gastos extra" 
              value={expenses} 
              onChange={setExpenses} 
              placeholder="Ej: 5000"
              isCurrency
            />
            
            <div className="pt-2">
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-zinc-400">Margen de ganancia</label>
                <span className="text-sm font-bold text-green-400">{margin}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={margin} 
                onChange={(e) => setMargin(Number(e.target.value))}
                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
            </div>

            <label className="flex items-center gap-3 p-3 rounded-lg border border-zinc-700/50 bg-zinc-800/50 hover:bg-zinc-800 transition cursor-pointer group">
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${iva ? 'bg-green-500 border-green-500' : 'border-zinc-500 bg-transparent'}`}>
                {iva && <svg className="w-3.5 h-3.5 text-black font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </div>
              <input 
                type="checkbox" 
                className="hidden"
                checked={iva}
                onChange={e => setIva(e.target.checked)}
              />
              <span className="text-zinc-300 group-hover:text-white transition">Aplicar IVA (19%)</span>
            </label>
          </div>
        </div>

        {/* === DERECHA: RESULTADOS === */}
        <div className="relative">
          <div className="sticky top-24 bg-zinc-900/80 backdrop-blur-sm border border-zinc-700 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">
            
            <div className="space-y-4">
              <ResultRow label="Costo base" value={basePrice} />
              <ResultRow label="Tu Ganancia" value={marginValue} isGreen />
              <div className="h-px bg-zinc-700 my-2" />
              <ResultRow label="Subtotal Neto" value={subtotal} />
              {iva && <ResultRow label="IVA (19%)" value={ivaValue} />}
            </div>

            <div className="pt-4 border-t border-zinc-600">
              <p className="text-sm text-zinc-400 mb-1">Total a cobrar</p>
              <div className={`text-4xl md:text-5xl font-extrabold text-white transition-all duration-300 ${animate ? 'scale-105 text-green-400' : ''}`}>
                ${total.toLocaleString('es-CL')}
              </div>
            </div>

            <div className="grid grid-cols-5 gap-3 pt-2">
               {/* Botón Copiar */}
               <button 
                 onClick={copyToClipboard}
                 className="col-span-1 flex items-center justify-center bg-zinc-700 hover:bg-zinc-600 text-white rounded-xl transition-all border border-zinc-600 hover:border-zinc-500 active:scale-95"
                 title="Copiar resumen"
               >
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
               </button>

               {/* Botón Guardar */}
               <button 
                 onClick={handleSave}
                 disabled={saving}
                 className="col-span-4 group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 text-slate-950 font-bold py-4 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:scale-[1.02] disabled:opacity-50"
               >
                 <span className="relative z-10 flex items-center justify-center gap-2">
                   {saving ? 'Guardando...' : 'Guardar Presupuesto'}
                 </span>
                 {!saving && <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />}
               </button>
            </div>
            
            <p className="text-center text-xs text-zinc-500">
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

function Field({ label, value, onChange, placeholder, isCurrency }: any) {
  return (
    <div className="space-y-1.5 group">
      <label className="text-sm font-medium text-zinc-400 group-focus-within:text-green-400 transition-colors">
        {label}
      </label>
      <div className="relative">
        {isCurrency && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
        )}
        <input
          type="number"
          value={value === 0 ? '' : value}
          onChange={e => onChange(Number(e.target.value))}
          placeholder={placeholder}
          className={`w-full bg-zinc-900/50 border border-zinc-700 text-white rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all placeholder:text-zinc-600 ${isCurrency ? 'pl-7' : ''}`}
        />
      </div>
    </div>
  )
}

function ResultRow({ label, value, isGreen }: any) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-zinc-300">{label}</span>
      <span className={`font-semibold text-lg ${isGreen ? 'text-green-400' : 'text-white'}`}>
        ${Math.round(value).toLocaleString('es-CL')}
      </span>
    </div>
  )
}