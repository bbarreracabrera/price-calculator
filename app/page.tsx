'use client'

import Link from 'next/link' // 👈 Esta era la línea que faltaba

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      
      {/* Fondo decorativo */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* 🚀 HERO SECTION */}
      <section className="relative z-10 flex flex-col md:flex-row items-center justify-between px-6 py-20 max-w-7xl mx-auto gap-12">
        
        {/* Texto Izquierdo */}
        <div className="md:w-1/2 space-y-6 animate-fade-in-up">
          <div className="inline-block px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-green-400 text-xs font-medium mb-2">
            ✨ Herramienta para freelancers
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Calcula tus precios <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
              al instante
            </span>
          </h1>
          
          <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
            Serio, rápido y fácil: la herramienta que tu negocio necesita para dejar de perder dinero en presupuestos mal calculados.
          </p>

          {/* 👇 BOTONES DE ACCIÓN (Sin Google, solo calculadora y planes) */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
            <Link href="/calculator" className="w-full sm:w-auto">
              <button className="w-full px-8 py-4 bg-white text-slate-950 font-bold rounded-xl hover:bg-slate-200 transition-transform hover:scale-105 shadow-lg shadow-white/10 flex items-center justify-center gap-2">
                <span>🧮</span> Usar Calculadora ahora
              </button>
            </Link>

            <Link href="/pricing" className="w-full sm:w-auto">
              <button className="w-full px-8 py-4 bg-slate-900 border border-slate-800 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors">
                Ver funciones PRO
              </button>
            </Link>
          </div>
        </div>

        {/* Imagen Derecha (Manos) */}
        <div className="md:w-1/2 flex justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-green-500/20 blur-3xl rounded-full" />
          <img 
            src="/manos.svg" 
            alt="Profesional de negocios" 
            className="w-full max-w-md relative z-10 drop-shadow-2xl" 
          />
        </div>

      </section>

      {/* 💡 FEATURES / BENEFICIOS */}
      <section className="py-24 px-6 bg-slate-900/50 relative z-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <FeatureCard src="/finance.svg" title="Seriedad" description="Diseñado para negocios y usuarios exigentes." />
          <FeatureCard src="/mujernegocio.svg" title="Facilidad" description="Interfaz simple e intuitiva para todos los usuarios." />
          <FeatureCard src="/todoeldato.svg" title="Rapidez" description="Resultados en segundos, listos para usar." />
        </div>
      </section>

    </main>
  )
}

/* Componente auxiliar */
function FeatureCard({ src, title, description }: { src: string, title: string, description: string }) {
  return (
    <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl hover:border-slate-600 transition-colors group shadow-lg">
      <div className="h-40 flex items-center justify-center mb-6">
        <img src={src} alt={title} className="h-32 w-auto object-contain drop-shadow-lg group-hover:scale-110 transition-transform" />
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  )
}