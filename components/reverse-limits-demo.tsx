"use client"

import React, { useState, useMemo, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Sparkles, Wand2, ArrowLeftRight } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from "recharts"

interface ReverseLimitsDemoProps {
  onBack: () => void
}

// Definición de funciones matemáticas
const functions = {
  x: { name: "x", fn: (x: number) => x, integral: (a: number, b: number) => (b * b - a * a) / 2 },
  "x²": { name: "x²", fn: (x: number) => x * x, integral: (a: number, b: number) => (b * b * b - a * a * a) / 3 },
  "x³": { name: "x³", fn: (x: number) => x * x * x, integral: (a: number, b: number) => (b * b * b * b - a * a * a * a) / 4 },
  "sin(x)": { name: "sin(x)", fn: (x: number) => Math.sin(x), integral: (a: number, b: number) => -Math.cos(b) + Math.cos(a) },
  "cos(x)": { name: "cos(x)", fn: (x: number) => Math.cos(x), integral: (a: number, b: number) => Math.sin(b) - Math.sin(a) },
  "√x": { name: "√x", fn: (x: number) => Math.sqrt(Math.max(0, x)), integral: (a: number, b: number) => (2 * Math.pow(b, 1.5) - 2 * Math.pow(Math.max(0, a), 1.5)) / 3 },
  "eˣ": { name: "eˣ", fn: (x: number) => Math.exp(x), integral: (a: number, b: number) => Math.exp(b) - Math.exp(a) }
}

type FunctionKey = keyof typeof functions

export function ReverseLimitsDemo({ onBack }: ReverseLimitsDemoProps) {
  // Estados para los controles
  const [functionType, setFunctionType] = useState<FunctionKey>("x²")
  const [limitA, setLimitA] = useState(1)
  const [limitB, setLimitB] = useState(3)
  const [hoverX, setHoverX] = useState<number | null>(null)

  // Validación de límites
  const isValidLimits = limitA !== limitB

  // Generar datos para ambas gráficas
  const chartData = useMemo(() => {
    if (!isValidLimits) return []
    
    const points = 200
    const minLimit = Math.min(limitA, limitB)
    const maxLimit = Math.max(limitA, limitB)
    const step = (maxLimit - minLimit) / points
    const data = []
    
    for (let i = 0; i <= points; i++) {
      const x = minLimit + i * step
      const fValue = functions[functionType].fn(x)
      
      data.push({
        x: Number(x.toFixed(3)),
        f: Number(fValue.toFixed(3)),
        // Área para la integral normal (a a b)
        areaNormal: x >= Math.min(limitA, limitB) && x <= Math.max(limitA, limitB) ? fValue : 0,
        // Área para la integral invertida (b a a)
        areaReversed: x >= Math.min(limitA, limitB) && x <= Math.max(limitA, limitB) ? fValue : 0
      })
    }
    
    return data
  }, [functionType, limitA, limitB, isValidLimits])

  // Cálculos de integrales
  const calculations = useMemo(() => {
    if (!isValidLimits) return null

    const integralAB = functions[functionType].integral(limitA, limitB)
    const integralBA = functions[functionType].integral(limitB, limitA)
    const isEqual = Math.abs(integralAB + integralBA) < 0.001

    return {
      integralAB: Number(integralAB.toFixed(3)),
      integralBA: Number(integralBA.toFixed(3)),
      isEqual: isEqual
    }
  }, [functionType, limitA, limitB, isValidLimits])

  // Función para intercambiar límites
  const swapLimits = useCallback(() => {
    const temp = limitA
    setLimitA(limitB)
    setLimitB(temp)
  }, [limitA, limitB])

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const x = Number(label)
      const fValue = functions[functionType].fn(x)
      
      return (
        <div className="bg-white/95 backdrop-blur border border-gray-200 rounded-lg p-3 shadow-lg">
          <div className="text-sm font-semibold text-gray-800 mb-2">x = {x.toFixed(2)}</div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>f(x) = {fValue.toFixed(2)}</span>
            </div>
            <div className="text-gray-600 text-xs">
              {functions[functionType].name}
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Encabezado */}
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-orange-600" />
            <h1 className="text-3xl font-bold text-gray-800">Inversión de Límites</h1>
          </div>
        </div>
        
        <div className="text-center mb-8">
          <p className="text-lg text-gray-600 mb-4">
            Invertir los límites de integración cambia el signo de la integral
          </p>
          <div className="bg-white/80 rounded-lg p-4 border border-orange-200 inline-block">
            <div className="text-lg font-mono text-gray-800">
              ∫[a,b] f(x) dx = -∫[b,a] f(x) dx
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Panel de Controles */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 bg-white/90 backdrop-blur border border-orange-200">
            <h3 className="text-lg font-bold text-orange-800 mb-4 flex items-center gap-2">
              <Wand2 className="w-5 h-5" />
              Controles Mágicos
            </h3>
            
            {/* Selección de Función */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Función f(x):
                </label>
                <select
                  value={functionType}
                  onChange={(e) => setFunctionType(e.target.value as FunctionKey)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
                >
                  {Object.keys(functions).map((key) => (
                    <option key={key} value={key}>
                      {functions[key as FunctionKey].name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Límites de Integración */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Límite inferior (a):
                </label>
                <input
                  type="number"
                  value={limitA}
                  onChange={(e) => setLimitA(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
                  min={-10}
                  max={10}
                  step={0.1}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Límite superior (b):
                </label>
                <input
                  type="number"
                  value={limitB}
                  onChange={(e) => setLimitB(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
                  min={-10}
                  max={10}
                  step={0.1}
                />
              </div>
              
              {!isValidLimits && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">
                    ⚠️ Los límites deben ser diferentes
                  </p>
                </div>
              )}
            </div>

            {/* Botón de Intercambio */}
            <div className="mt-6">
              <Button
                onClick={swapLimits}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 hover:shadow-md flex items-center gap-2"
              >
                <ArrowLeftRight className="w-5 h-5" />
                Invertir Límites a ↔ b
              </Button>
            </div>
          </Card>
        </div>

        {/* Área de Visualización - Dos Gráficas */}
        <div className="lg:col-span-2">
          <Card className="p-6 bg-white/90 backdrop-blur border border-orange-200">
            <h3 className="text-lg font-bold text-orange-800 mb-4">
              🌟 Visualización Mágica
            </h3>
            
            {isValidLimits ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Gráfica 1 - Integral Normal */}
                <div className="h-80">
                  <div className="text-center mb-2">
                    <h4 className="font-semibold text-blue-800">∫[{limitA}, {limitB}] f(x)dx</h4>
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="x" 
                        domain={[Math.min(limitA, limitB), Math.max(limitA, limitB)]}
                        tick={{ fontSize: 10 }}
                      />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip content={<CustomTooltip />} />
                      
                      {/* Líneas de referencia */}
                      <ReferenceLine x={limitA} stroke="#3b82f6" strokeDasharray="5 5" />
                      <ReferenceLine x={limitB} stroke="#3b82f6" strokeDasharray="5 5" />
                      
                      {/* Área bajo la curva */}
                      <Area
                        type="monotone"
                        dataKey="areaNormal"
                        fill="#3b82f6"
                        fillOpacity={0.6}
                        stroke="none"
                      />
                      
                      {/* Función f(x) */}
                      <Line
                        type="monotone"
                        dataKey="f"
                        stroke="#1e40af"
                        strokeWidth={2}
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Gráfica 2 - Integral Invertida */}
                <div className="h-80">
                  <div className="text-center mb-2">
                    <h4 className="font-semibold text-red-800">∫[{limitB}, {limitA}] f(x)dx</h4>
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="x" 
                        domain={[Math.min(limitA, limitB), Math.max(limitA, limitB)]}
                        tick={{ fontSize: 10 }}
                      />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip content={<CustomTooltip />} />
                      
                      {/* Líneas de referencia */}
                      <ReferenceLine x={limitB} stroke="#ef4444" strokeDasharray="5 5" />
                      <ReferenceLine x={limitA} stroke="#ef4444" strokeDasharray="5 5" />
                      
                      {/* Área bajo la curva */}
                      <Area
                        type="monotone"
                        dataKey="areaReversed"
                        fill="#ef4444"
                        fillOpacity={0.6}
                        stroke="none"
                      />
                      
                      {/* Función f(x) */}
                      <Line
                        type="monotone"
                        dataKey="f"
                        stroke="#dc2626"
                        strokeWidth={2}
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                <p>⚠️ Ajusta los límites para ver la visualización</p>
              </div>
            )}

            {/* Leyenda */}
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded"></div>
                <span>f(x) = {functions[functionType].name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span>∫[{limitA}, {limitB}] (normal)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>∫[{limitB}, {limitA}] (invertida)</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Panel de Resultados */}
      {calculations && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tarjeta 1 - Integral Normal */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
              <h4 className="text-lg font-bold text-blue-800 mb-3">
                ✨ Integral de a → b
              </h4>
              <div className="space-y-2">
                <div className="text-sm font-mono bg-white/80 p-2 rounded border">
                  ∫[{limitA}, {limitB}] f(x) dx
                </div>
                <div className="text-sm font-mono bg-white/80 p-2 rounded border">
                  ∫[{limitA}, {limitB}] {functions[functionType].name} dx
                </div>
                <div className="text-lg font-bold text-blue-800">
                  = {calculations.integralAB > 0 ? '+' : ''}{calculations.integralAB}
                </div>
              </div>
            </Card>

            {/* Tarjeta 2 - Integral Invertida */}
            <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
              <h4 className="text-lg font-bold text-red-800 mb-3">
                🔄 Integral de b → a
              </h4>
              <div className="space-y-2">
                <div className="text-sm font-mono bg-white/80 p-2 rounded border">
                  ∫[{limitB}, {limitA}] f(x) dx
                </div>
                <div className="text-sm font-mono bg-white/80 p-2 rounded border">
                  ∫[{limitB}, {limitA}] {functions[functionType].name} dx
                </div>
                <div className="text-lg font-bold text-red-800">
                  = {calculations.integralBA > 0 ? '+' : ''}{calculations.integralBA}
                </div>
              </div>
            </Card>

            {/* Tarjeta 3 - Verificación */}
            <Card className={`p-6 border-2 ${calculations.isEqual ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <h4 className={`text-lg font-bold mb-3 ${calculations.isEqual ? 'text-green-800' : 'text-red-800'}`}>
                {calculations.isEqual ? '✅ Verificación Exitosa' : '❌ Error en la Verificación'}
              </h4>
              <div className="space-y-2">
                <div className="text-sm">
                  <div>∫[{limitA}, {limitB}] = {calculations.integralAB}</div>
                  <div>∫[{limitB}, {limitA}] = {calculations.integralBA}</div>
                </div>
                <div className="text-sm font-mono bg-white/80 p-2 rounded border">
                  {calculations.integralAB} = -({calculations.integralBA})
                </div>
                <div className={`text-lg font-bold ${calculations.isEqual ? 'text-green-800' : 'text-red-800'}`}>
                  {calculations.isEqual ? '✓' : '✗'}
                </div>
                <div className={`text-sm ${calculations.isEqual ? 'text-green-600' : 'text-red-600'}`}>
                  {calculations.isEqual 
                    ? 'La propiedad de inversión se cumple: los resultados son opuestos'
                    : 'Los valores no coinciden. Revisa los cálculos.'
                  }
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}