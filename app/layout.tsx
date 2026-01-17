import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
// 🟢 CAMBIO IMPORTANTE: Importamos con llaves { } porque ahora es una exportación nombrada
import { MobileNav } from "./components/MobileNav"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PriceCalc - Calculadora Freelance",
  description: "Calcula tus precios profesionales",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-black text-white`}>
        {/* Barra Superior (Escritorio) */}
        <Navbar />
        
        {/* Contenedor Principal */}
        {/* 'pb-24' añade espacio abajo en móviles para que la barra no tape el contenido */}
        <div className="pb-24 md:pb-0">
          {children}
        </div>

        {/* Barra Inferior (Solo Móviles) */}
        <MobileNav />
      </body>
    </html>
  );
}