"use client"

import React, { useState, useMemo, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Sparkles, Wand2, BarChart3, CheckCircle, AlertTriangle } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine } from "recharts"

interface ComparisonDemoProps {
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

export function ComparisonDemo({ onBack }: ComparisonDemoProps) {
  // Estados para los controles
  const [functionF, setFunctionF] = useState<FunctionKey>("x")
  const [functionG, setFunctionG] = useState<FunctionKey>("x²")
  const [limitA, setLimitA] = useState(0)
  const [limitB, setLimitB] = useState(1)
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
      const fValue = functions[functionF].fn(x)
      const gValue = functions[functionG].fn(x)
      
      data.push({
        x: Number(x.toFixed(3)),
        f: Number(fValue.toFixed(3)),
        g: Number(gValue.toFixed(3)),
        // Área bajo f(x)
        areaF: fValue,
        // Área bajo g(x)
        areaG: gValue
      })
    }
    
    return data
  }, [functionF, functionG, limitA, limitB, isValidLimits])

  // Cálculos de integrales y verificación
  const calculations = useMemo(() => {
    if (!isValidLimits) return null

    const integralF = functions[functionF].integral(limitA, limitB)
    const integralG = functions[functionG].integral(limitA, limitB)
    
    // Verificar si f(x) ≤ g(x) en todo el intervalo
    const samplePoints = 50
    let conditionSatisfied = true
    let satisfiedPoints = 0
    
    for (let i = 0; i <= samplePoints; i++) {
      const x = limitA + (i / samplePoints) * (limitB - limitA)
      const fValue = functions[functionF].fn(x)
      const gValue = functions[functionG].fn(x)
      
      if (fValue <= gValue) {
        satisfiedPoints++
      } else {
        conditionSatisfied = false
      }
    }
    
    const satisfactionPercentage = (satisfiedPoints / (samplePoints + 1)) * 100
    const propertySatisfied = integralF <= integralG
    const difference = integralG - integralF

    return {
      integralF: Number(integralF.toFixed(3)),
      integralG: Number(integralG.toFixed(3)),
      conditionSatisfied,
      satisfactionPercentage: Number(satisfactionPercentage.toFixed(1)),
      propertySatisfied,
      difference: Number(difference.toFixed(3))
    }
  }, [functionF, functionG, limitA, limitB, isValidLimits])

  // Tooltip personalizado con comparación
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const x = Number(label)
      const fValue = functions[functionF].fn(x)
      const gValue = functions[functionG].fn(x)
      const difference = gValue - fValue
      const comparison = fValue <= gValue
      
      return (
        <div className={`bg-white/95 backdrop-blur border rounded-lg p-4 shadow-lg ${
          comparison ? 'border-green-300' : 'border-orange-300'
        }`}>
          <div className="text-sm font-semibold text-gray-800 mb-2">x = {x.toFixed(2)}</div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>f(x) = {fValue.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>g(x) = {gValue.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className={`flex items-center gap-2 ${comparison ? 'text-green-600' : 'text-orange-600'}`}>
                {comparison ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                <span>
                  {fValue < gValue ? 'f(x) < g(x) ✓' : 
                   fValue === gValue ? 'f(x) = g(x) ✓' : 'f(x) > g(x) ⚠️'}
                </span>
              </div>
              <div className={`text-xs mt-1 ${difference >= 0 ? 'text-green-600' : 'text-orange-600'}`}>
                Diferencia: {difference.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
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
            <h1 className="text-3xl font-bold text-gray-800">Propiedad de Comparación</h1>
          </div>
        </div>
        
        <div className="text-center mb-8">
          <p className="text-lg text-gray-600 mb-4">
            Si una función es menor o igual que otra, su integral también es menor o igual
          </p>
          <div className="bg-white/80 rounded-lg p-4 border border-purple-200 inline-block">
            <div className="text-lg font-mono text-gray-800">
              Si f(x) ≤ g(x) en [a,b] ⇒ ∫[a,b] f(x) dx ≤ ∫[a,b] g(x) dx
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
                  Selecciona f(x):
                </label>
                <select
                  value={functionF}
                  onChange={(e) => setFunctionF(e.target.value as FunctionKey)}
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
                  Selecciona g(x):
                </label>
                <select
                  value={functionG}
                  onChange={(e) => setFunctionG(e.target.value as FunctionKey)}
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
                    ⚠️ El límite inferior debe ser menor que el superior
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
              <div className="space-y-6">
                {/* Gráfica interactiva */}
                <div className="h-96">
                  <div className="text-center mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Comparación de f(x) = {functions[functionF].name} y g(x) = {functions[functionG].name}
                    </h4>
                    <div className="flex justify-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-500 rounded"></div>
                        <span>f(x) = {functions[functionF].name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <span>g(x) = {functions[functionG].name}</span>
                      </div>
                    </div>
                  </div>
                  
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="x" 
                        domain={[limitA, limitB]}
                        tick={{ fontSize: 10 }}
                      />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip content={<CustomTooltip />} />
                      
                      {/* Líneas de referencia */}
                      <ReferenceLine x={limitA} stroke="#3b82f6" strokeDasharray="5 5" />
                      <ReferenceLine x={limitB} stroke="#3b82f6" strokeDasharray="5 5" />
                      
                      {/* Área bajo g(x) */}
                      <Area
                        type="monotone"
                        dataKey="areaG"
                        fill="#10b981"
                        fillOpacity={0.3}
                        stroke="none"
                      />
                      
                      {/* Área bajo f(x) */}
                      <Area
                        type="monotone"
                        dataKey="areaF"
                        fill="#3b82f6"
                        fillOpacity={0.3}
                        stroke="none"
                      />
                      
                      {/* Función g(x) */}
                      <Line
                        type="monotone"
                        dataKey="g"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={false}
                      />
                      
                      {/* Función f(x) */}
                      <Line
                        type="monotone"
                        dataKey="f"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Estado de la condición */}
                {calculations && (
                  <div className={`p-4 rounded-lg border ${
                    calculations.conditionSatisfied 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-orange-50 border-orange-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {calculations.conditionSatisfied ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                      )}
                      <h4 className={`font-semibold ${
                        calculations.conditionSatisfied ? 'text-green-800' : 'text-orange-800'
                      }`}>
                        Análisis de la Condición f(x) ≤ g(x)
                      </h4>
                    </div>
                    <p className={`text-sm ${
                      calculations.conditionSatisfied ? 'text-green-700' : 'text-orange-700'
                    }`}>
                      {calculations.conditionSatisfied 
                        ? `✓ f(x) ≤ g(x) en todo el intervalo [${limitA}, ${limitB}]`
                        : `⚠️ f(x) > g(x) en ${100 - calculations.satisfactionPercentage}% del intervalo. La condición no se satisface completamente.`
                      }
                    </p>
                    <div className="mt-2">
                      <div className="text-xs text-gray-600">
                        Satisfacción: {calculations.satisfactionPercentage}% del intervalo
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                <p>⚠️ Ajusta los límites para ver la visualización</p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Panel de Resultados */}
      {calculations && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Tarjeta 1 - Integral de f(x) */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
              <h4 className="text-lg font-bold text-blue-800 mb-3">
                ✨ Integral de f(x)
              </h4>
              <div className="space-y-2">
                <div className="text-sm font-mono bg-white/80 p-2 rounded border">
                  ∫[{limitA}, {limitB}] f(x) dx
                </div>
                <div className="text-sm font-mono bg-white/80 p-2 rounded border">
                  ∫[{limitA}, {limitB}] {functions[functionF].name} dx
                </div>
                <div className="text-lg font-bold text-blue-800">
                  = {calculations.integralF}
                </div>
              </div>
            </Card>

            {/* Tarjeta 2 - Integral de g(x) */}
            <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
              <h4 className="text-lg font-bold text-green-800 mb-3">
                🌿 Integral de g(x)
              </h4>
              <div className="space-y-2">
                <div className="text-sm font-mono bg-white/80 p-2 rounded border">
                  ∫[{limitA}, {limitB}] g(x) dx
                </div>
                <div className="text-sm font-mono bg-white/80 p-2 rounded border">
                  ∫[{limitA}, {limitB}] {functions[functionG].name} dx
                </div>
                <div className="text-lg font-bold text-green-800">
                  = {calculations.integralG}
                </div>
              </div>
            </Card>

            {/* Tarjeta 3 - Verificación */}
            <Card className={`p-6 border-2 ${
              calculations.propertySatisfied 
                ? 'bg-green-50 border-green-200' 
                : 'bg-orange-50 border-orange-200'
            }`}>
              <h4 className={`text-lg font-bold mb-3 ${
                calculations.propertySatisfied ? 'text-green-800' : 'text-orange-800'
              }`}>
                {calculations.propertySatisfied ? '✅ Verificación Exitosa' : '⚠️ Verificación Fallida'}
              </h4>
              <div className="space-y-2">
                <div className="text-sm">
                  <div>∫f(x)dx = {calculations.integralF}</div>
                  <div>∫g(x)dx = {calculations.integralG}</div>
                </div>
                <div className="text-sm font-mono bg-white/80 p-2 rounded border">
                  {calculations.integralF} ≤ {calculations.integralG}
                </div>
                <div className={`text-lg font-bold ${
                  calculations.propertySatisfied ? 'text-green-800' : 'text-orange-800'
                }`}>
                  {calculations.propertySatisfied ? '✓' : '✗'}
                </div>
                <div className={`text-sm ${
                  calculations.propertySatisfied ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {calculations.propertySatisfied 
                    ? 'La propiedad se cumple: ∫f(x)dx ≤ ∫g(x)dx ✓'
                    : 'La propiedad NO se cumple: ∫f(x)dx > ∫g(x)dx ⚠️'
                  }
                </div>
                <div className="text-xs text-gray-600">
                  Diferencia: {calculations.difference}
                </div>
              </div>
            </Card>

            {/* Tarjeta 4 - Análisis de Condición */}
            <Card className={`p-6 border-2 ${
              calculations.conditionSatisfied 
                ? 'bg-green-50 border-green-200' 
                : 'bg-orange-50 border-orange-200'
            }`}>
              <h4 className={`text-lg font-bold mb-3 ${
                calculations.conditionSatisfied ? 'text-green-800' : 'text-orange-800'
              }`}>
                🔍 Análisis de Condición
              </h4>
              <div className="space-y-2">
                <div className="text-sm">
                  <div>Condición: f(x) ≤ g(x)</div>
                  <div>Intervalo: [{limitA}, {limitB}]</div>
                </div>
                <div className={`text-sm ${
                  calculations.conditionSatisfied ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {calculations.conditionSatisfied 
                    ? '✓ Condición satisfecha en todo el intervalo'
                    : `⚠️ Condición violada en ${100 - calculations.satisfactionPercentage}% del intervalo`
                  }
                </div>
                <div className="text-xs text-gray-600">
                  Satisfacción: {calculations.satisfactionPercentage}%
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
