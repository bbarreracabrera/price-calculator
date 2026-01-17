import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
// 🗑️ Borramos el import de MobileNav

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
        <Navbar />
        
        {/* Quitamos el 'pb-24' y dejamos el layout limpio */}
        <div>
          {children}
        </div>

        {/* 🗑️ Borramos <MobileNav /> */}
      </body>
    </html>
  );
}