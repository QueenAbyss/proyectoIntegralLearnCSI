"use client"

import React, { useState, useMemo, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Sparkles, Wand2, Divide } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart, ComposedChart } from "recharts"

interface AdditivityDemoProps {
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

export function AdditivityDemo({ onBack }: AdditivityDemoProps) {
  // Estados para los controles
  const [functionType, setFunctionType] = useState<FunctionKey>("x²")
  const [limitA, setLimitA] = useState(0)
  const [limitB, setLimitB] = useState(2)
  const [limitC, setLimitC] = useState(4)
  const [hoverX, setHoverX] = useState<number | null>(null)

  // Validación de límites
  const isValidLimits = limitA < limitB && limitB < limitC

  // Generar datos para la gráfica
  const chartData = useMemo(() => {
    if (!isValidLimits) return []
    
    const points = 200
    const step = (limitC - limitA) / points
    const data = []
    
    for (let i = 0; i <= points; i++) {
      const x = limitA + i * step
      const fValue = functions[functionType].fn(x)
      
      data.push({
        x: Number(x.toFixed(3)),
        f: Number(fValue.toFixed(3)),
        // Datos para las áreas
        area1: x >= limitA && x <= limitB ? fValue : 0,
        area2: x >= limitB && x <= limitC ? fValue : 0
      })
    }
    
    return data
  }, [functionType, limitA, limitB, limitC, isValidLimits])

  // Cálculos de integrales
  const calculations = useMemo(() => {
    if (!isValidLimits) return null

    const integralAC = functions[functionType].integral(limitA, limitC)
    const integralAB = functions[functionType].integral(limitA, limitB)
    const integralBC = functions[functionType].integral(limitB, limitC)
    const sumAB_BC = integralAB + integralBC

    return {
      integralAC: Number(integralAC.toFixed(3)),
      integralAB: Number(integralAB.toFixed(3)),
      integralBC: Number(integralBC.toFixed(3)),
      sumAB_BC: Number(sumAB_BC.toFixed(3)),
      isEqual: Math.abs(integralAC - sumAB_BC) < 0.001
    }
  }, [functionType, limitA, limitB, limitC, isValidLimits])

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const x = Number(label)
      const fValue = payload.find((p: any) => p.dataKey === 'f')?.value || 0
      
      let interval = ""
      let intervalColor = ""
      if (x >= limitA && x <= limitB) {
        interval = `[${limitA}, ${limitB}]`
        intervalColor = "blue"
      } else if (x >= limitB && x <= limitC) {
        interval = `[${limitB}, ${limitC}]`
        intervalColor = "green"
      } else {
        interval = "Fuera del intervalo"
        intervalColor = "gray"
      }
      
      return (
        <div className="bg-white/95 backdrop-blur border border-gray-200 rounded-lg p-3 shadow-lg">
          <div className="text-sm font-semibold text-gray-800 mb-2">x = {x.toFixed(2)}</div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>f(x) = {fValue.toFixed(2)}</span>
            </div>
            <div className={`flex items-center gap-2 text-${intervalColor}-600`}>
              <div className={`w-3 h-3 bg-${intervalColor}-500 rounded-full`}></div>
              <span>Intervalo: {interval}</span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
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
            <Sparkles className="w-6 h-6 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-800">Aditividad</h1>
          </div>
        </div>
        
        <div className="text-center mb-8">
          <p className="text-lg text-gray-600 mb-4">
            La integral sobre un intervalo puede dividirse en la suma de integrales sobre subintervalos
          </p>
          <div className="bg-white/80 rounded-lg p-4 border border-green-200 inline-block">
            <div className="text-lg font-mono text-gray-800">
              ∫[a,c] f(x) dx = ∫[a,b] f(x) dx + ∫[b,c] f(x) dx
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Panel de Controles */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 bg-white/90 backdrop-blur border border-green-200">
            <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
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
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
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
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  min={-10}
                  max={10}
                  step={0.1}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Punto intermedio (b): {limitB}
                </label>
                <Slider
                  value={[limitB]}
                  onValueChange={(value) => setLimitB(value[0])}
                  min={limitA + 0.1}
                  max={limitC - 0.1}
                  step={0.1}
                  className="w-full"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Este punto divide el intervalo en dos partes
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Límite superior (c):
                </label>
                <input
                  type="number"
                  value={limitC}
                  onChange={(e) => setLimitC(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  min={-10}
                  max={10}
                  step={0.1}
                />
              </div>
              
              {!isValidLimits && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">
                    ⚠️ Los límites deben cumplir: a &lt; b &lt; c
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Área de Visualización */}
        <div className="lg:col-span-2">
          <Card className="p-6 bg-white/90 backdrop-blur border border-green-200">
            <h3 className="text-lg font-bold text-green-800 mb-4">
              🌟 Visualización Mágica
            </h3>
            
            {isValidLimits ? (
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="x" 
                      domain={[limitA, limitC]}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    
                    {/* Líneas de referencia para los límites */}
                    <ReferenceLine x={limitA} stroke="#6b7280" strokeDasharray="5 5" />
                    <ReferenceLine x={limitB} stroke="#ef4444" strokeWidth={2} />
                    <ReferenceLine x={limitC} stroke="#6b7280" strokeDasharray="5 5" />
                    
                    {/* Área del primer intervalo [a, b] */}
                    <Area
                      type="monotone"
                      dataKey="area1"
                      fill="#3b82f6"
                      fillOpacity={0.5}
                      stroke="none"
                    />
                    
                    {/* Área del segundo intervalo [b, c] */}
                    <Area
                      type="monotone"
                      dataKey="area2"
                      fill="#10b981"
                      fillOpacity={0.5}
                      stroke="none"
                    />
                    
                    {/* Función f(x) */}
                    <Line
                      type="monotone"
                      dataKey="f"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      dot={false}
                      name={`f(x) = ${functions[functionType].name}`}
                    />
                  </ComposedChart>
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
                <div className="w-4 h-4 bg-purple-500 rounded"></div>
                <span>f(x) = {functions[functionType].name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span>Intervalo [{limitA}, {limitB}]</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Intervalo [{limitB}, {limitC}]</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Panel de Resultados */}
      {calculations && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tarjeta 1 - Integral del Intervalo Completo */}
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
              <h4 className="text-lg font-bold text-purple-800 mb-3">
                ✨ Integral sobre [a, c]
              </h4>
              <div className="space-y-2">
                <div className="text-sm font-mono bg-white/80 p-2 rounded border">
                  ∫[{limitA}, {limitC}] f(x) dx
                </div>
                <div className="text-sm font-mono bg-white/80 p-2 rounded border">
                  ∫[{limitA}, {limitC}] {functions[functionType].name} dx
                </div>
                <div className="text-lg font-bold text-purple-800">
                  = {calculations.integralAC}
                </div>
              </div>
            </Card>

            {/* Tarjeta 2 - Suma de Integrales de Subintervalos */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-green-50 border border-blue-200">
              <h4 className="text-lg font-bold text-blue-800 mb-3">
                🧮 Suma de Integrales sobre Subintervalos
              </h4>
              <div className="space-y-2">
                <div className="text-sm font-mono bg-white/80 p-2 rounded border">
                  ∫[{limitA}, {limitB}] f(x) dx + ∫[{limitB}, {limitC}] f(x) dx
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>∫[{limitA}, {limitB}] = {calculations.integralAB}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>∫[{limitB}, {limitC}] = {calculations.integralBC}</span>
                  </div>
                </div>
                <div className="text-lg font-bold text-blue-800 border-t pt-2">
                  = {calculations.integralAB} + {calculations.integralBC} = {calculations.sumAB_BC}
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
                  <div>Integral completa [{limitA}, {limitC}]: {calculations.integralAC}</div>
                  <div>Suma de subintervalos: {calculations.sumAB_BC}</div>
                </div>
                <div className={`text-lg font-bold ${calculations.isEqual ? 'text-green-800' : 'text-red-800'}`}>
                  {calculations.isEqual ? '✓' : '✗'}
                </div>
                <div className={`text-sm ${calculations.isEqual ? 'text-green-600' : 'text-red-600'}`}>
                  {calculations.isEqual 
                    ? 'La propiedad de aditividad se cumple: ambos resultados son iguales'
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



