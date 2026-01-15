import Calculator from '@/app/components/Calculator'

export default function CalculatorPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center px-6">
      <div className="w-full max-w-5xl space-y-10">

        {/* Header */}
        <header className="text-center space-y-4">
          <span className="inline-block px-4 py-1 text-sm rounded-full bg-green-500/10 text-green-400 font-medium">
            Calculadora profesional
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            Calcula precios justos  
            <span className="block text-green-400">sin perder dinero</span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            Diseñada para freelancers y profesionales independientes en Chile.
          </p>
        </header>

        {/* Card */}
        <section className="bg-slate-900/80 backdrop-blur rounded-3xl shadow-2xl p-8 md:p-10">
          <Calculator />
        </section>

        {/* Footer */}
        <footer className="text-center text-xs text-slate-500">
          Price Calculator · Herramienta profesional
        </footer>

      </div>
    </main>
  )
}
