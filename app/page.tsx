import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Calculadora Inteligente de Precios
        </h1>
        <p className="text-gray-600 mb-8">
          Calcula precios de manera profesional con margen e IVA incluido
        </p>
        
        <div className="space-y-4">
          <Link
            href="/login"
            className="block w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/register"
            className="block w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Crear Cuenta
          </Link>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Plan Free: 3 cálculos gratis
            <br />
            Plan Pro: Cálculos ilimitados
          </p>
        </div>
      </div>
    </div>
  )
}

