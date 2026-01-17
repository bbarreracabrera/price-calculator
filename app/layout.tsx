import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google' // Importamos la fuente
import Navbar from './components/Navbar'

// Configuramos la fuente Inter
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'PriceCalc - Calculadora para Freelancers',
  description: 'Calcula tus presupuestos de forma profesional.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={inter.variable}>
      {/* Aplicamos el fondo negro puro y la fuente a todo el body */}
      <body className={`${inter.className} bg-black min-h-screen text-slate-200 antialiased selection:bg-green-500/30`}>
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  )
}