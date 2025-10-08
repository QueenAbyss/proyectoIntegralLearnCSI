"use client"

import React, { useState, useMemo, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Sparkles, Wand2 } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"

interface LinearityDemoProps {
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

export function LinearityDemo({ onBack }: LinearityDemoProps) {
  // Estados para los controles
  const [fFunction, setFFunction] = useState<FunctionKey>("x")
  const [gFunction, setGFunction] = useState<FunctionKey>("x²")
  const [alpha, setAlpha] = useState(2)
  const [beta, setBeta] = useState(1)
  const [limitA, setLimitA] = useState(0)
  const [limitB, setLimitB] = useState(2)
  const [hoverX, setHoverX] = useState<number | null>(null)

  // Validación de límites
  const isValidLimits = limitA < limitB

  // Generar datos para la gráfica
  const chartData = useMemo(() => {
    if (!isValidLimits) return []
    
    const points = 200
    const step = (limitB - limitA) / points
    const data = []
    
    for (let i = 0; i <= points; i++) {
      const x = limitA + i * step
      const fValue = functions[fFunction].fn(x)
      const gValue = functions[gFunction].fn(x)
      const combinedValue = alpha * fValue + beta * gValue
      
      data.push({
        x: Number(x.toFixed(3)),
        f: Number(fValue.toFixed(3)),
        g: Number(gValue.toFixed(3)),
        combined: Number(combinedValue.toFixed(3))
      })
    }
    
    return data
  }, [fFunction, gFunction, alpha, beta, limitA, limitB, isValidLimits])

  // Cálculos de integrales
  const calculations = useMemo(() => {
    if (!isValidLimits) return null

    const fIntegral = functions[fFunction].integral(limitA, limitB)
    const gIntegral = functions[gFunction].integral(limitA, limitB)
    const combinedIntegral = alpha * fIntegral + beta * gIntegral
    const directCombinedIntegral = functions[fFunction].integral(limitA, limitB) * alpha + functions[gFunction].integral(limitA, limitB) * beta

    return {
      fIntegral: Number(fIntegral.toFixed(3)),
      gIntegral: Number(gIntegral.toFixed(3)),
      alphaFIntegral: Number((alpha * fIntegral).toFixed(3)),
      betaGIntegral: Number((beta * gIntegral).toFixed(3)),
      combinedIntegral: Number(combinedIntegral.toFixed(3)),
      directCombinedIntegral: Number(directCombinedIntegral.toFixed(3)),
      isEqual: Math.abs(combinedIntegral - directCombinedIntegral) < 0.001
    }
  }, [fFunction, gFunction, alpha, beta, limitA, limitB, isValidLimits])

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const x = Number(label)
      const fValue = payload.find((p: any) => p.dataKey === 'f')?.value || 0
      const gValue = payload.find((p: any) => p.dataKey === 'g')?.value || 0
      const combinedValue = payload.find((p: any) => p.dataKey === 'combined')?.value || 0
      
      return (
        <div className="bg-white/95 backdrop-blur border border-gray-200 rounded-lg p-3 shadow-lg">
          <div className="text-sm font-semibold text-gray-800 mb-2">x = {x.toFixed(2)}</div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>f(x) = {fValue.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>g(x) = {gValue.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>αf(x) = {alpha} × {fValue.toFixed(2)} = {(alpha * fValue).toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>βg(x) = {beta} × {gValue.toFixed(2)} = {(beta * gValue).toFixed(2)}</span>
            </div>
            <div className="border-t pt-1 mt-2">
              <div className="flex items-center gap-2 font-semibold">
                <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                <span>αf(x) + βg(x) = {(alpha * fValue + beta * gValue).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
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
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-800">Linealidad</h1>
          </div>
        </div>
        
        <div className="text-center mb-8">
          <p className="text-lg text-gray-600 mb-4">
            La integral de una combinación lineal es igual a la combinación lineal de las integrales
          </p>
          <div className="bg-white/80 rounded-lg p-4 border border-purple-200 inline-block">
            <div className="text-lg font-mono text-gray-800">
              ∫[a,b] [αf(x) + βg(x)] dx = α∫[a,b] f(x) dx + β∫[a,b] g(x) dx
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Panel de Controles */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 bg-white/90 backdrop-blur border border-purple-200">
            <h3 className="text-lg font-bold text-purple-800 mb-4 flex items-center gap-2">
              <Wand2 className="w-5 h-5" />
              Controles Mágicos
            </h3>
            
            {/* Selección de Funciones */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Función f(x):
                </label>
                <select
                  value={fFunction}
                  onChange={(e) => setFFunction(e.target.value as FunctionKey)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                >
                  {Object.keys(functions).map((key) => (
                    <option key={key} value={key}>
                      {functions[key as FunctionKey].name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Función g(x):
                </label>
                <select
                  value={gFunction}
                  onChange={(e) => setGFunction(e.target.value as FunctionKey)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                >
                  {Object.keys(functions).map((key) => (
                    <option key={key} value={key}>
                      {functions[key as FunctionKey].name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Coeficientes */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coeficiente α (alfa): {alpha}
                </label>
                <Slider
                  value={[alpha]}
                  onValueChange={(value) => setAlpha(value[0])}
                  min={-5}
                  max={5}
                  step={0.1}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coeficiente β (beta): {beta}
                </label>
                <Slider
                  value={[beta]}
                  onValueChange={(value) => setBeta(value[0])}
                  min={-5}
                  max={5}
                  step={0.1}
                  className="w-full"
                />
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
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
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
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                  min={-10}
                  max={10}
                  step={0.1}
                />
              </div>
              
              {!isValidLimits && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">
                    ⚠️ El límite superior debe ser mayor que el inferior
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Área de Visualización */}
        <div className="lg:col-span-2">
          <Card className="p-6 bg-white/90 backdrop-blur border border-purple-200">
            <h3 className="text-lg font-bold text-purple-800 mb-4">
              🌟 Visualización Mágica
            </h3>
            
            {isValidLimits ? (
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="x" 
                      domain={[limitA, limitB]}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    
                    {/* Líneas de referencia para los límites */}
                    <ReferenceLine x={limitA} stroke="#6b7280" strokeDasharray="5 5" />
                    <ReferenceLine x={limitB} stroke="#6b7280" strokeDasharray="5 5" />
                    
                    {/* Función f(x) */}
                    <Line
                      type="monotone"
                      dataKey="f"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={false}
                      name={`f(x) = ${functions[fFunction].name}`}
                    />
                    
                    {/* Función g(x) */}
                    <Line
                      type="monotone"
                      dataKey="g"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={false}
                      name={`g(x) = ${functions[gFunction].name}`}
                    />
                    
                    {/* Combinación lineal */}
                    <Line
                      type="monotone"
                      dataKey="combined"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      dot={false}
                      name={`${alpha}f(x) + ${beta}g(x)`}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-96 flex items-center justify-center text-gray-500">
                <p>⚠️ Ajusta los límites para ver la visualización</p>
              </div>
            )}

            {/* Leyenda */}
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span>f(x) = {functions[fFunction].name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>g(x) = {functions[gFunction].name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded"></div>
                <span>{alpha}f(x) + {beta}g(x)</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Panel de Resultados */}
      {calculations && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tarjeta 1 - Lado Izquierdo */}
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
              <h4 className="text-lg font-bold text-purple-800 mb-3">
                ✨ Integral de la Combinación Lineal
              </h4>
              <div className="space-y-2">
                <div className="text-sm font-mono bg-white/80 p-2 rounded border">
                  ∫[{limitA}, {limitB}] [{alpha}f(x) + {beta}g(x)] dx
                </div>
                <div className="text-sm font-mono bg-white/80 p-2 rounded border">
                  ∫[{limitA}, {limitB}] [{alpha}·{functions[fFunction].name} + {beta}·{functions[gFunction].name}] dx
                </div>
                <div className="text-lg font-bold text-purple-800">
                  = {calculations.combinedIntegral}
                </div>
              </div>
            </Card>

            {/* Tarjeta 2 - Lado Derecho */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-green-50 border border-blue-200">
              <h4 className="text-lg font-bold text-blue-800 mb-3">
                🧮 Combinación Lineal de las Integrales
              </h4>
              <div className="space-y-2">
                <div className="text-sm font-mono bg-white/80 p-2 rounded border">
                  {alpha}∫[{limitA}, {limitB}] f(x) dx + {beta}∫[{limitA}, {limitB}] g(x) dx
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>{alpha} × {calculations.fIntegral} = {calculations.alphaFIntegral}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>{beta} × {calculations.gIntegral} = {calculations.betaGIntegral}</span>
                  </div>
                </div>
                <div className="text-lg font-bold text-blue-800 border-t pt-2">
                  = {calculations.alphaFIntegral} + {calculations.betaGIntegral} = {calculations.combinedIntegral}
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
                  <div>Lado izquierdo: {calculations.combinedIntegral}</div>
                  <div>Lado derecho: {calculations.combinedIntegral}</div>
                </div>
                <div className={`text-lg font-bold ${calculations.isEqual ? 'text-green-800' : 'text-red-800'}`}>
                  {calculations.isEqual ? '✓' : '✗'}
                </div>
                <div className={`text-sm ${calculations.isEqual ? 'text-green-600' : 'text-red-600'}`}>
                  {calculations.isEqual 
                    ? 'La propiedad de linealidad se cumple: ambos lados son iguales'
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
