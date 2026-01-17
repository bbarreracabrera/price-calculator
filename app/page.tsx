import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-green-500/30">
      
      {/* SECCIÓN HERO (Portada) */}
      <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse md:flex-row items-center justify-between py-20 gap-12">
        <div className="md:w-1/2 space-y-6">
          <div className="inline-block px-4 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-green-400">
            ✨ Herramienta para freelancers
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
            Calcula tus precios <br />
            <span className="text-blue-500">al instante</span>
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-lg">
            Serio, rápido y fácil: la herramienta que tu negocio necesita para dejar de perder dinero en presupuestos mal calculados.
          </p>
          <div className="flex gap-4 pt-4">
            <Link href="/calculator">
              <button className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-all">
                ⚡ Usar Calculadora ahora
              </button>
            </Link>
            <Link href="/pricing">
              <button className="px-8 py-4 bg-slate-900 border border-slate-800 text-white font-bold rounded-xl hover:bg-slate-800 transition-all">
                Ver funciones PRO
              </button>
            </Link>
          </div>
        </div>

        {/* Imagen: Manos SVG */}
        <div className="md:w-1/2 flex justify-center">
          <img 
            src="/manos.svg" 
            alt="Freelance Deal" 
            className="w-full max-w-md object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      {/* SECCIÓN BENEFICIOS (Las 3 tarjetas) */}
      <div className="bg-slate-900/30 py-20 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Tarjeta 1 */}
          <div className="p-8 rounded-3xl bg-black border border-slate-800 text-center hover:border-blue-500/50 transition duration-300">
            <img src="/finance.svg" alt="Seriedad" className="h-32 mx-auto mb-6" />
            <h3 className="text-xl font-bold mb-3">Seriedad</h3>
            <p className="text-slate-500">Diseñado para negocios y usuarios exigentes.</p>
          </div>

          {/* Tarjeta 2 */}
          <div className="p-8 rounded-3xl bg-black border border-slate-800 text-center hover:border-blue-500/50 transition duration-300">
            <img src="/mujernegocio.svg" alt="Facilidad" className="h-32 mx-auto mb-6" />
            <h3 className="text-xl font-bold mb-3">Facilidad</h3>
            <p className="text-slate-500">Interfaz simple e intuitiva para todos los usuarios.</p>
          </div>

          {/* Tarjeta 3 */}
          <div className="p-8 rounded-3xl bg-black border border-slate-800 text-center hover:border-blue-500/50 transition duration-300">
            <img src="/todoeldato.svg" alt="Rapidez" className="h-32 mx-auto mb-6" />
            <h3 className="text-xl font-bold mb-3">Rapidez</h3>
            <p className="text-slate-500">Resultados en segundos, listos para usar.</p>
          </div>

        </div>
      </div>
    </main>
  )
}