'use client'
import { useMemo } from 'react'

export default function IncomeChart({ projects }: { projects: any[] }) {
  
  // Lógica para agrupar ingresos por mes (Últimos 6 meses)
  const chartData = useMemo(() => {
    const today = new Date()
    const data = []

    // Generamos los últimos 6 meses
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const monthName = d.toLocaleString('es-CL', { month: 'short' }) // "ene", "feb"
      const year = d.getFullYear()

      // Filtramos proyectos de este mes específico que estén PAGADOS
      const monthlyTotal = projects
        .filter(p => {
          const pDate = new Date(p.created_at)
          return (
            p.status === 'paid' && 
            pDate.getMonth() === d.getMonth() && 
            pDate.getFullYear() === year
          )
        })
        .reduce((sum, p) => sum + Number(p.total_price), 0)

      data.push({ label: monthName, value: monthlyTotal })
    }
    return data
  }, [projects])

  // Calcular el valor máximo para escalar las barras
  const maxValue = Math.max(...chartData.map(d => d.value), 10000)

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <span>📈</span> Tendencia de Ingresos
        <span className="text-xs font-normal text-zinc-500 ml-2">(Últimos 6 meses)</span>
      </h3>

      {/* Contenedor del Gráfico */}
      {/* CORRECCIÓN: Quitamos 'items-end' aquí para manejarlo en cada columna */}
      <div className="h-48 flex justify-between gap-2 md:gap-4">
        {chartData.map((item, index) => {
          // Calculamos altura porcentaje
          const heightPercent = Math.max((item.value / maxValue) * 100, 2)
          
          return (
            // CORRECCIÓN: Agregamos 'h-full' y 'justify-end' para que la columna tenga altura real
            <div key={index} className="flex-1 h-full flex flex-col justify-end items-center group relative">
              
              {/* Tooltip (flotante) */}
              <div className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-1 bg-zinc-800 text-white text-xs py-1 px-2 rounded border border-zinc-700 pointer-events-none whitespace-nowrap z-20 shadow-xl">
                ${item.value.toLocaleString('es-CL')}
              </div>

              {/* La Barra */}
              <div 
                className={`w-full max-w-[40px] rounded-t-lg transition-all duration-700 ease-out relative overflow-hidden ${item.value > 0 ? 'bg-green-500 hover:bg-green-400' : 'bg-zinc-800'}`}
                style={{ height: `${heightPercent}%` }}
              >
                {/* Efecto de brillo */}
                {item.value > 0 && (
                   <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500" />
                )}
              </div>

              {/* Etiqueta del Mes */}
              <span className="text-xs text-zinc-500 mt-3 font-medium capitalize">
                {item.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}