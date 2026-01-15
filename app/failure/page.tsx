import Link from 'next/link'

export default function FailurePage() {
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-red-500/30 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-2">Pago no realizado</h1>
        <p className="text-slate-400 mb-8">Hubo un problema al procesar tu pago.</p>
        <Link href="/pricing" className="block w-full">
          <button className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all">Intentar de nuevo</button>
        </Link>
      </div>
    </main>
  )
}