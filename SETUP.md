# Guía de Configuración

## Pasos para Configurar el Proyecto

### 1. Instalar Dependencias

```bash
cd price-calculator
npm install
```

### 2. Configurar Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ve a **Settings > API** y copia:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

### 4. Configurar Base de Datos

1. Ve al **SQL Editor** en Supabase
2. Copia y ejecuta el contenido de `supabase-setup.sql`
3. Verifica que las tablas se hayan creado correctamente

### 5. Ejecutar el Proyecto

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura de Base de Datos

### Tabla `user_profiles`
- `id` (UUID): ID del usuario (referencia a auth.users)
- `email` (TEXT): Email del usuario
- `is_pro` (BOOLEAN): Si el usuario tiene plan Pro
- `calculations_count` (INTEGER): Contador de cálculos realizados
- `created_at` (TIMESTAMP): Fecha de creación

### Tabla `calculations`
- `id` (UUID): ID único del cálculo
- `user_id` (UUID): ID del usuario que realizó el cálculo
- `costos_fijos` (NUMERIC): Costos fijos ingresados
- `costos_variables` (NUMERIC): Costos variables ingresados
- `horas_trabajo` (NUMERIC): Horas de trabajo
- `valor_hora` (NUMERIC): Valor por hora
- `margen` (NUMERIC): Margen deseado (ej: 0.30 para 30%)
- `precio_final` (NUMERIC): Precio final calculado
- `ganancia_estimada` (NUMERIC): Ganancia estimada
- `iva_desglosado` (NUMERIC): IVA desglosado (19%)
- `created_at` (TIMESTAMP): Fecha del cálculo

## Funcionalidades Implementadas

✅ Autenticación con email/password
✅ Sistema de usuarios Free (máx. 3 cálculos) y Pro (ilimitados)
✅ Calculadora de precios con fórmula completa
✅ Historial de cálculos (solo usuarios Pro)
✅ Protección de rutas privadas
✅ Diseño responsive y PWA-ready

## Próximos Pasos (No Implementados)

- Integración con MercadoPago para pagos
- Sistema de notificaciones
- Exportar cálculos a PDF/Excel
- Compartir cálculos con otros usuarios

## Deploy en Vercel

1. Conecta tu repositorio a Vercel
2. Agrega las variables de entorno en la configuración del proyecto
3. Deploy automático en cada push a main

