'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Calculator() {
  const supabase = createClient()
  const router = useRouter()
  
  // Estados
  const [hours, setHours] = useState(10)
  const [hourRate, setHourRate] = useState(25000)
  const [expenses, setExpenses] = useState(5000)
  const [margin, setMargin] = useState(30)
  const [includeIva, setIncludeIva] = useState(true)
  
  const [user, setUser] = useState<any>(null)
  const [saving, setSaving] = useState(false) // Estado de carga

  // Verificar usuario
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  // Lógica matemática
  const netCost = (hours * hourRate) + expenses
  const marginValue = netCost * (margin / 100)
  const subtotal = netCost + marginValue
  const ivaValue = includeIva ? subtotal * 0.19 : 0
  const total = subtotal + ivaValue

  // 💾 FUNCIÓN DE GUARDADO REAL
  const handleSave = async () => {
    // 1. Si no hay usuario, mandar al login
    if (!user) {
      router.push('/login')
      return
    }

    setSaving(true)

    // 2. Insertar en Supabase (Tabla 'calculations')
    const { error } = await supabase
      .from('calculations')
      .insert({
        user_id: user.id,
        hours: hours,
        hour_value: hourRate,
        expenses: expenses,
        margin: margin,
        precio_final: total // Dato clave para el dashboard
      })

    setSaving(false)

    if (error) {
      alert('Error al guardar: ' + error.message)
    } else {
      // 3. Éxito: Ir al Dashboard
      router.push('/dashboard')
    }
  }

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      
      {/* Inputs */}
      <div className="lg:col-span-7 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputGroup label="Horas estimadas" symbol="H" value={hours} onChange={setHours} />
          <InputGroup label="Valor Hora" symbol="$" value={hourRate} onChange={setHourRate} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputGroup label="Gastos / Software" symbol="$" value={expenses} onChange={setExpenses} />
          <InputGroup label="Margen deseado" symbol="%" value={margin} onChange={setMargin} />
        </div>
        <div 
          onClick={() => setIncludeIva(!includeIva)}
          className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700 rounded-xl cursor-pointer hover:bg-slate-800 transition-colors"
        >
          <span className="text-slate-300 font-medium">¿Incluir IVA (19%)?</span>
          <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${includeIva ? 'bg-green-500' : 'bg-slate-600'}`}>
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${includeIva ? 'translate-x-6' : 'translate-x-0'}`} />
          </div>
        </div>
      </div>

      {/* Ticket Resultados */}
      <div className="lg:col-span-5">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

          <h3 className="text-lg font-semibold text-slate-400 mb-6">Resumen del cobro</h3>
          <div className="space-y-4">
            <Row label="Costo base" value={netCost} />
            <Row label={`Ganancia (${margin}%)`} value={marginValue} highlight />
            <div className="h-px bg-slate-800 my-4"></div>
            <Row label="Subtotal Neto" value={subtotal} />
            <Row label="IVA (19%)" value={ivaValue} hidden={!includeIva} />
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800">
            <span className="block text-sm text-slate-500 mb-1">Total a cobrar</span>
            <span className="block text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
              ${Math.round(total).toLocaleString('es-CL')}
            </span>
          </div>

          {/* 👇 BOTÓN ACTUALIZADO 👇 */}
          <button 
            onClick={handleSave}
            disabled={saving}
            className={`w-full mt-8 py-3 px-4 font-medium rounded-lg text-sm transition-all border flex items-center justify-center gap-2 group
              ${saving 
                ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-wait' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700 hover:border-slate-600'
              }`}
          >
            {!user ? (
               <>🔒 Inicia sesión para guardar</>
            ) : saving ? (
               <><span className="animate-spin">⏳</span> Guardando...</>
            ) : (
               <>💾 Guardar presupuesto</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

/* Helpers */
function InputGroup({ label, symbol, value, onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-400">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 font-semibold">{symbol}</div>
        <input type="number" value={value || ''} onChange={(e) => onChange(Number(e.target.value))} className="block w-full pl-10 pr-4 py-4 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all outline-none" placeholder="0"/>
      </div>
    </div>
  )
}
function Row({ label, value, highlight, hidden }: any) {
  if (hidden) return null
  return <div className="flex justify-between items-center text-sm"><span className={highlight ? "text-green-400" : "text-slate-400"}>{label}</span><span className={`font-medium ${highlight ? "text-green-400" : "text-slate-200"}`}>${Math.round(value).toLocaleString('es-CL')}</span></div>
}