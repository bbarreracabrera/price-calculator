'use client'
import Calculator from '../components/Calculator'

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-black text-white p-6 md:pt-16 md:pb-24">
      <div className="max-w-6xl mx-auto">
        
        {/* TEXTO SUPERIOR CENTRADO (Como en la versión online) */}
        <header className="mb-16 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4 leading-tight">
            Calculadora de <span className="text-green-500">Precios</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 leading-relaxed">
            Define tus costos, establece tu margen de ganancia deseado y obtén el precio final de venta al instante, con o sin impuestos.
          </p>
        </header>

        {/* La calculadora */}
        <Calculator />
      </div>
    </div>
  )
}