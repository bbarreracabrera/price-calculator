import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
// 1. Importamos el Toaster
import { Toaster } from 'react-hot-toast';

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
        
        {/* 2. Configuramos el diseño de las notificaciones */}
        <Toaster 
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            style: {
              background: '#18181b', // zinc-900
              color: '#fff',
              border: '1px solid #27272a', // zinc-800
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              iconTheme: {
                primary: '#22c55e', // green-500
                secondary: 'black',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444', // red-500
                secondary: 'white',
              },
            },
          }}
        />

        <div>
          {children}
        </div>
      </body>
    </html>
  );
}