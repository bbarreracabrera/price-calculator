'use client'
import Link from 'next/link'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function LimitModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl max-w-md w-full shadow-2xl relative text-center">
        
        {/* Botón Cerrar */}
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
          ✕
        </button>

        <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">🔒</span>
        </div>

        <h2 className="text-2xl font-black text-white mb-2">Límite Alcanzado</h2>
        <p className="text-zinc-400 mb-8">
          Has usado tus 3 presupuestos gratuitos. Para guardar más proyectos ilimitados y eliminar límites, actualiza a PRO.
        </p>

        <div className="space-y-3">
          <Link href="/pricing">
            <button className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-green-900/20">
              Desbloquear Ilimitado ($9.990)
            </button>
          </Link>
          <button onClick={onClose} className="text-sm text-zinc-500 hover:text-white font-medium">
            Quizás más tarde
          </button>
        </div>
      </div>
    </div>
  )
}