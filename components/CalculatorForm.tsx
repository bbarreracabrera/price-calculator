'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { calculatePrice, type CalculatorInputs } from '@/lib/utils/calculator'
import { saveCalculationClient } from '@/lib/api/saveCalculation-client'

interface CalculatorFormProps {
  userId: string
  isPro: boolean
}

export default function CalculatorForm({ userId, isPro }: CalculatorFormProps) {
  const router = useRouter()

  const [inputs, setInputs] = useState<CalculatorInputs>({
    costosFijos: 0,
    costosVariables: 0,
    horasTrabajo: 0,
    valorHora: 0,
    margen: 0.3, // 30% por defecto
  })

  const [result, setResult] = useState<ReturnType<typeof calculatePrice> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (field: keyof CalculatorInputs, value: number) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }))
    setResult(null)
  }

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validaciones básicas
    if (inputs.costosFijos < 0 || inputs.costosVariables < 0 || inputs.horasTrabajo < 0 || inputs.valorHora < 0) {
      setError('Todos los valores deben ser positivos')
      return
    }

    if (inputs.margen <= 0 || inputs.margen >= 1) {
      setError('El margen debe estar entre 0% y 100% (ej: 0.30 para 30%)')
      return
    }

    // Calcular precio
    const calculationResult = calculatePrice(inputs)
    setResult(calculationResult)

    // Guardar cálculo en la base de datos usando la función centralizada
    setLoading(true)
    try {
      await saveCalculationClient({
        costos_fijos: inputs.costosFijos,
        costos_variables: inputs.costosVariables,
        horas_trabajo: inputs.horasTrabajo,
        valor_hora: inputs.valorHora,
        margen: inputs.margen,
        precio_final: calculationResult.precioFinal,
        ganancia_estimada: calculationResult.gananciaEstimada,
        iva_desglosado: calculationResult.ivaDesglosado,
      })
    } catch (err: any) {
      console.error('Error:', err)
      // Mostrar mensaje de error específico si es límite alcanzado
      if (err.message?.includes('Límite alcanzado')) {
        setError('Has alcanzado el límite de 3 cálculos. Actualiza a Pro para cálculos ilimitados.')
        router.push('/pricing')
      } else {
        setError(err.message || 'Error al guardar el cálculo. El resultado se muestra pero no se guardó.')
      }
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
      <form onSubmit={handleCalculate} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="costosFijos" className="block text-sm font-medium text-gray-700 mb-2">
              Costos Fijos
            </label>
            <input
              id="costosFijos"
              type="number"
              min="0"
              step="0.01"
              value={inputs.costosFijos}
              onChange={(e) => handleInputChange('costosFijos', parseFloat(e.target.value) || 0)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="0"
            />
          </div>

          <div>
            <label htmlFor="costosVariables" className="block text-sm font-medium text-gray-700 mb-2">
              Costos Variables
            </label>
            <input
              id="costosVariables"
              type="number"
              min="0"
              step="0.01"
              value={inputs.costosVariables}
              onChange={(e) => handleInputChange('costosVariables', parseFloat(e.target.value) || 0)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="0"
            />
          </div>

          <div>
            <label htmlFor="horasTrabajo" className="block text-sm font-medium text-gray-700 mb-2">
              Horas de Trabajo
            </label>
            <input
              id="horasTrabajo"
              type="number"
              min="0"
              step="0.1"
              value={inputs.horasTrabajo}
              onChange={(e) => handleInputChange('horasTrabajo', parseFloat(e.target.value) || 0)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="0"
            />
          </div>

          <div>
            <label htmlFor="valorHora" className="block text-sm font-medium text-gray-700 mb-2">
              Valor por Hora
            </label>
            <input
              id="valorHora"
              type="number"
              min="0"
              step="0.01"
              value={inputs.valorHora}
              onChange={(e) => handleInputChange('valorHora', parseFloat(e.target.value) || 0)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="0"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="margen" className="block text-sm font-medium text-gray-700 mb-2">
              Margen Deseado (%)
              <span className="text-gray-500 text-xs ml-2">
                (ej: 0.30 para 30%)
              </span>
            </label>
            <input
              id="margen"
              type="number"
              min="0"
              max="0.99"
              step="0.01"
              value={inputs.margen}
              onChange={(e) => handleInputChange('margen', parseFloat(e.target.value) || 0)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="0.30"
            />
            <p className="mt-1 text-xs text-gray-500">
              Margen actual: {(inputs.margen * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Calculando...' : 'Calcular Precio'}
        </button>
      </form>

      {result && (
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Resultado del Cálculo</h2>
          <div className="space-y-4">
            <div className="bg-primary-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Precio Final</span>
                <span className="text-2xl font-bold text-primary-700">
                  {formatCurrency(result.precioFinal)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-700 mb-1">Ganancia Estimada</div>
                <div className="text-xl font-semibold text-green-700">
                  {formatCurrency(result.gananciaEstimada)}
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-700 mb-1">IVA (19%)</div>
                <div className="text-xl font-semibold text-blue-700">
                  {formatCurrency(result.ivaDesglosado)}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-700 mb-1">Subtotal (sin IVA)</div>
              <div className="text-lg font-semibold text-gray-700">
                {formatCurrency(result.subtotal)}
              </div>
            </div>
          </div>

          {isPro && (
            <p className="mt-4 text-sm text-gray-500 text-center">
              ✓ Cálculo guardado en tu historial
            </p>
          )}
        </div>
      )}
    </div>
  )
}
