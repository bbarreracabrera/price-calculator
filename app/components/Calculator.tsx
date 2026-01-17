'use client'
import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import LimitModal from './LimitModal' // Importamos el modal

export default function Calculator() {
  const [name, setName] = useState('')
  const [hours, setHours] = useState(10)
  const [rate, setRate] = useState(25000)
  const [expenses, setExpenses] = useState(5000)
  const [margin, setMargin] = useState(30)
  const [includeIVA, setIncludeIVA] = useState(true)
  
  // Estados para el límite
  const [projectCount, setProjectCount] = useState(0)
  const [showLimitModal, setShowLimitModal] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  
  const [supabase] = useState(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ))

  // 1. Al cargar, verificamos cuántos proyectos tiene el usuario
  useEffect(() => {
    const checkUserLimits = async () => {
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
    checkUserLimits()
  }, [supabase])

  // Lógica Matemática
  const laborCost = hours * rate
  const baseCost = laborCost + expenses
  const marginAmount = baseCost * (margin / 100)
  const subtotalNeto = baseCost + marginAmount
  const ivaAmount = includeIVA ? subtotalNeto * 0.19 : 0
  const total = subtotalNeto + ivaAmount

  const handleSave = async () => {
    if (!userId) return alert('⚠️ Debes iniciar sesión para guardar.')
    if (!name) return alert('⚠️ Por favor, ponle un nombre al proyecto.')

    // 2. EL CANDADO: Si tiene 3 o más proyectos, mostramos el modal y NO guardamos
    // (Aquí podrías agregar "&& !isPro" si tuvieras el campo en la BD)
    if (projectCount >= 3) {
      setShowLimitModal(true)
      return
    }

    const { error } = await supabase.from('projects').insert({
      user_id: userId,
      name,
      pocket_money: subtotalNeto,
      total_price: total,
      details: { hours, rate, expenses, margin, include_iva: includeIVA, iva_amount: ivaAmount }
    })

    if (!error) {
      window.location.href = '/dashboard'
    } else {
      alert('Error al guardar')
    }
  }

  // Estilos
  const inputContainerStyle = "relative group"
  const iconStyle = "absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold group-focus-within:text-green-500 transition-colors"
  const inputStyle = "w-full bg-zinc-900 border border-zinc-800 p-4 pl-10 rounded-xl text-white outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all font-medium"
  const labelStyle = "text-zinc-500 text-xs font-bold uppercase mb-2 block tracking-wider"

  return (
    <>
      {/* El Modal vive aquí, invisible hasta que se active */}
      <LimitModal isOpen={showLimitModal} onClose={() => setShowLimitModal(false)} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* COLUMNA IZQUIERDA */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <label className={labelStyle}>Nombre del Proyecto</label>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-white focus:border-green-500 outline-none transition-all font-medium placeholder:text-zinc-600"
              placeholder="Ej: Rediseño Sitio Web Corporativo..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={inputContainerStyle}>
              <label className={labelStyle}>Horas estimadas</label>
              <span className={iconStyle}>H</span>
              <input type="number" value={hours} onChange={e => setHours(Number(e.target.value))} className={inputStyle} />
            </div>
            <div className={inputContainerStyle}>
              <label className={labelStyle}>Valor Hora</label>
              <span className={iconStyle}>$</span>
              <input type="number" value={rate} onChange={e => setRate(Number(e.target.value))} className={inputStyle} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={inputContainerStyle}>
              <label className={labelStyle}>Gastos / Software</label>
              <span className={iconStyle}>$</span>
              <input type="number" value={expenses} onChange={e => setExpenses(Number(e.target.value))} className={inputStyle} />
            </div>
            <div className={inputContainerStyle}>
              <label className={labelStyle}>Margen de Ganancia</label>
              <span className={iconStyle}>%</span>
              <input type="number" value={margin} onChange={e => setMargin(Number(e.target.value))} className={inputStyle} />
            </div>
          </div>

          <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 flex items-center justify-between cursor-pointer hover:border-zinc-700 transition-colors" onClick={() => setIncludeIVA(!includeIVA)}>
            <div>
              <p className="font-bold text-white mb-1">¿Incluir IVA (19%)?</p>
              <p className="text-xs text-zinc-500">Activa esto si emites factura.</p>
            </div>
            <div className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${includeIVA ? 'bg-green-500' : 'bg-zinc-700'}`}>
              <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${includeIVA ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA (RESUMEN) */}
        <div className="lg:col-span-5 lg:sticky lg:top-8">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2rem] shadow-2xl shadow-black/50">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-black text-white tracking-tight">Resumen</h3>
              {/* Contador visual discreto */}
              <div className={`px-3 py-1 rounded-full text-xs font-bold border ${projectCount >= 3 ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                {projectCount}/3 Usados
              </div>
            </div>
            
            <div className="space-y-5 mb-8">
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-400 font-medium">Costo base</span>
                <span className="font-bold text-zinc-200">${baseCost.toLocaleString('es-CL')}</span>
              </div>
              <div className="flex justify-between items-center text-sm py-3 border-y border-zinc-800/50">
                <span className="text-green-500 font-bold flex items-center gap-2">
                  <span className="bg-green-500/10 p-1 rounded text-xs">+{margin}%</span>
                  Tu Ganancia
                </span>
                <span className="font-bold text-green-500 text-lg">+${Math.round(marginAmount).toLocaleString('es-CL')}</span>
              </div>
              <div className="flex justify-between items-center text-sm pt-2">
                <span className="text-zinc-400 font-medium">Subtotal Neto</span>
                <span className="font-bold text-white">${Math.round(subtotalNeto).toLocaleString('es-CL')}</span>
              </div>
              {includeIVA && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-400 font-medium">IVA (19%)</span>
                  <span className="font-bold text-zinc-300">${Math.round(ivaAmount).toLocaleString('es-CL')}</span>
                </div>
              )}
            </div>

            <div className="mb-8 pt-6 border-t border-zinc-800">
              <p className="text-xs text-zinc-500 uppercase font-bold mb-2 tracking-wider">Total final</p>
              <p className="text-5xl font-black text-green-500 tracking-tighter leading-none">
                ${Math.round(total).toLocaleString('es-CL')}
              </p>
            </div>

            <button 
              onClick={handleSave}
              className="w-full py-5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-green-600/20 active:scale-[0.98] text-lg"
            >
              <span>💾</span> Guardar presupuesto
            </button>
          </div>
        </div>

      </div>
    </>
  )
}