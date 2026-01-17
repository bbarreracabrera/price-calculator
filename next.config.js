/** @type {import('next').NextConfig} */

// Detectamos si estamos construyendo para móvil usando una variable de entorno
const isMobile = process.env.NEXT_PUBLIC_IS_MOBILE === 'true';

const nextConfig = {
  // Si es móvil, usamos 'export' (archivos estáticos). Si es web, usamos el normal (undefined)
  output: isMobile ? 'export' : undefined,
  
  // En móvil no hay servidor para optimizar imágenes, así que las desoptimizamos
  images: {
    unoptimized: isMobile ? true : false
  }
};

export default nextConfig;