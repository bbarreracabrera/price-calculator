import Link from 'next/link'

export default function PendingPage() {
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-yellow-500/30 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-2">Pago en proceso</h1>
        <p className="text-slate-400 mb-8">Estamos verificando tu pago. Te avisaremos pronto.</p>
        <Link href="/dashboard" className="block w-full">
          <button className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-all">Ir al Dashboard</button>
        </Link>
      </div>
    </main>
  )
}