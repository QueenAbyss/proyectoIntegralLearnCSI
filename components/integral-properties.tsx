"use client"

import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calculator, TrendingUp, ArrowLeftRight, BarChart3 } from "lucide-react"

interface IntegralPropertiesProps {
  riemannSum: number
  exactIntegral: number
  leftLimit: number
  rightLimit: number
  partitions: number
  onPropertySelect: (property: string) => void
  activeProperty: string
  onSimulationConfig?: (config: {
    leftLimit: number
    rightLimit: number
    partitions: number
    functionType: string
  }) => void
  onBackToVisualization?: () => void
  onNavigateToDemo?: (demoType: string) => void
}

export function IntegralProperties({
  riemannSum,
  exactIntegral,
  leftLimit,
  rightLimit,
  partitions,
  onPropertySelect,
  activeProperty,
  onSimulationConfig,
  onBackToVisualization,
  onNavigateToDemo
}: IntegralPropertiesProps) {
  const [showDetailed, setShowDetailed] = useState(false)
  const [showSimulationConfig, setShowSimulationConfig] = useState(false)
  const [configLeftLimit, setConfigLeftLimit] = useState(leftLimit)
  const [configRightLimit, setConfigRightLimit] = useState(rightLimit)
  const [configPartitions, setConfigPartitions] = useState(partitions)
  const [configFunctionType, setConfigFunctionType] = useState("quadratic")

  const applySimulationConfig = () => {
    if (onSimulationConfig) {
      onSimulationConfig({
        leftLimit: configLeftLimit,
        rightLimit: configRightLimit,
        partitions: configPartitions,
        functionType: configFunctionType
      })
    }
    setShowSimulationConfig(false)
  }

  // Definición de las 4 propiedades principales con fórmulas LaTeX correctas
  const properties = [
    {
      id: "linearity",
      name: "Linealidad",
      icon: Calculator,
      description: "La integral de una combinación lineal es igual a la combinación lineal de las integrales.",
      formula: "∫[a,b] [αf(x) + βg(x)] dx = α∫[a,b] f(x) dx + β∫[a,b] g(x) dx",
      color: "bg-blue-50 border-blue-200",
      textColor: "text-blue-800",
      buttonColor: "bg-blue-600 hover:bg-blue-700"
    },
    {
      id: "additivity",
      name: "Aditividad",
      icon: TrendingUp,
      description: "La integral sobre un intervalo puede dividirse en la suma de integrales sobre subintervalos.",
      formula: "∫[a,c] f(x) dx = ∫[a,b] f(x) dx + ∫[b,c] f(x) dx",
      color: "bg-green-50 border-green-200",
      textColor: "text-green-800",
      buttonColor: "bg-green-600 hover:bg-green-700"
    },
    {
      id: "reverse_limits",
      name: "Inversión de Límites", 
      icon: ArrowLeftRight,
      description: "Invertir los límites de integración cambia el signo de la integral.",
      formula: "∫[a,b] f(x) dx = -∫[b,a] f(x) dx",
      color: "bg-orange-50 border-orange-200",
      textColor: "text-orange-800",
      buttonColor: "bg-orange-600 hover:bg-orange-700"
    },
    {
      id: "comparison",
      name: "Propiedad de Comparación",
      icon: BarChart3,
      description: "Si una función es menor o igual que otra, su integral también es menor o igual.",
      formula: "Si f(x) ≤ g(x) en [a,b] ⇒ ∫[a,b] f(x) dx ≤ ∫[a,b] g(x) dx",
      color: "bg-purple-50 border-purple-200",
      textColor: "text-purple-800", 
      buttonColor: "bg-purple-600 hover:bg-purple-700"
    }
  ]

  const handlePropertyClick = (propertyId: string) => {
    onPropertySelect(propertyId)
    // Navegar a la demo interactiva correspondiente
    if (onNavigateToDemo) {
      onNavigateToDemo(propertyId)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Botón de regreso */}
      {onBackToVisualization && (
        <div className="p-4">
        <Button
            onClick={onBackToVisualization}
          variant="outline"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
            ← Volver a la Visualización
        </Button>
        </div>
      )}

      {/* Encabezado Principal */}
      <div className="text-center py-12 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Propiedades de la Integral
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Explora las cuatro propiedades fundamentales del cálculo integral de forma interactiva
        </p>
      </div>

      {/* Grid de 4 Tarjetas */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {properties.map((property) => {
            const IconComponent = property.icon
  return (
          <Card
            key={property.id}
                className={`${property.color} border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer`}
                onClick={() => handlePropertyClick(property.id)}
              >
                <div className="p-6">
                  {/* Icono y Título */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <IconComponent className="w-6 h-6 text-gray-700" />
                    </div>
                    <h3 className={`text-xl font-bold ${property.textColor}`}>
                  {property.name}
                    </h3>
                </div>

                  {/* Descripción */}
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {property.description}
                </p>

                  {/* Fórmula LaTeX */}
                  <div className="bg-white/80 rounded-lg p-4 mb-4 border border-gray-200">
                    <div className="text-center">
                      <div className="text-lg font-mono text-gray-800 font-semibold">
                        {property.formula}
                </div>
              </div>
            </div>

                  {/* Botón de navegación */}
          <Button
                    className={`w-full ${property.buttonColor} text-white font-semibold py-3 rounded-lg transition-all duration-200 hover:shadow-md`}
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePropertyClick(property.id)
                    }}
                  >
                    Ver ejemplo interactivo
          </Button>
        </div>
              </Card>
            )
          })}
              </div>
            </div>


      </div>
  )
}



