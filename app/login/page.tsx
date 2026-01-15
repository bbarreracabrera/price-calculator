'use client'

import GoogleLoginButton from '@/app/components/GoogleLoginButton' 
// ⚠️ Si te da error la ruta, usa: '../components/GoogleLoginButton'

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Fondo decorativo (Glow Azul) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-md space-y-8">

        {/* Texto de Bienvenida */}
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Bienvenido
          </h1>
          <p className="mt-2 text-slate-400">
            Ingresa para guardar tus cálculos y gestionar tu negocio.
          </p>
        </div>

        {/* Tarjeta de Login */}
        <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="space-y-6">
            
            {/* Contenedor del Botón Google */}
            <div className="flex flex-col gap-4">
               {/* Aquí renderizamos tu botón existente */}
               <div className="flex justify-center transform hover:scale-105 transition-transform duration-200">
                  <GoogleLoginButton />
               </div>
            </div>

            {/* Separador visual */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-900 text-slate-500">Acceso seguro</span>
              </div>
            </div>

            <p className="text-center text-xs text-slate-600">
              Al continuar, aceptas nuestros términos de servicio.
            </p>
          </div>
        </div>

      </div>
    </main>
  )
}