/**
 * Calcula el precio sugerido basado en los inputs del usuario
 * Fórmula: ((Costos fijos + Costos variables + (Horas * ValorHora)) / (1 - Margen)) + IVA
 * IVA fijo: 19%
 */

export interface CalculatorInputs {
  costosFijos: number
  costosVariables: number
  horasTrabajo: number
  valorHora: number
  margen: number // Porcentaje (ej: 0.30 para 30%)
}

export interface CalculatorResult {
  precioFinal: number
  gananciaEstimada: number
  ivaDesglosado: number
  subtotal: number
}

const IVA_PORCENTAJE = 0.19 // 19%

export function calculatePrice(inputs: CalculatorInputs): CalculatorResult {
  const { costosFijos, costosVariables, horasTrabajo, valorHora, margen } = inputs

  // Calcular costo total de mano de obra
  const costoManoObra = horasTrabajo * valorHora

  // Calcular costo total (fijos + variables + mano de obra)
  const costoTotal = costosFijos + costosVariables + costoManoObra

  // Calcular subtotal antes de IVA (aplicando margen)
  // Precio = Costo / (1 - Margen)
  const subtotal = costoTotal / (1 - margen)

  // Calcular IVA sobre el subtotal
  const ivaDesglosado = subtotal * IVA_PORCENTAJE

  // Precio final con IVA
  const precioFinal = subtotal + ivaDesglosado

  // Ganancia estimada (precio final - costo total - IVA)
  const gananciaEstimada = precioFinal - costoTotal - ivaDesglosado

  return {
    precioFinal: Math.round(precioFinal),
    gananciaEstimada: Math.round(gananciaEstimada),
    ivaDesglosado: Math.round(ivaDesglosado),
    subtotal: Math.round(subtotal),
  }
}

