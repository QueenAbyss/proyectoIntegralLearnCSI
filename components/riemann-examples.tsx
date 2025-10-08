"use client"

import React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calculator, BookOpen, Lightbulb } from "lucide-react"

export function RiemannExamples() {
  const examples = [
    {
      id: 1,
      title: "Ejemplo 1: Función Cuadrática",
      function: "f(x) = x²",
      interval: "[0, 2]",
      solution: "8/3 ≈ 2.667",
      steps: [
        "1. Identificar la función: f(x) = x²",
        "2. Determinar el intervalo: [0, 2]",
        "3. Aplicar la regla de la potencia: ∫x²dx = x³/3",
        "4. Evaluar en los límites: [x³/3]₀² = 8/3 - 0 = 8/3"
      ],
      difficulty: "Básico"
    },
    {
      id: 2,
      title: "Ejemplo 2: Función Lineal",
      function: "f(x) = 2x + 1",
      interval: "[1, 3]",
      solution: "8",
      steps: [
        "1. Identificar la función: f(x) = 2x + 1",
        "2. Determinar el intervalo: [1, 3]",
        "3. Aplicar linealidad: ∫(2x + 1)dx = 2∫xdx + ∫1dx",
        "4. Resolver: 2[x²/2]₁³ + [x]₁³ = [x²]₁³ + [x]₁³ = 9-1 + 3-1 = 8"
      ],
      difficulty: "Básico"
    },
    {
      id: 3,
      title: "Ejemplo 3: Función Trigonométrica",
      function: "f(x) = sin(x)",
      interval: "[0, π]",
      solution: "2",
      steps: [
        "1. Identificar la función: f(x) = sin(x)",
        "2. Determinar el intervalo: [0, π]",
        "3. Aplicar antiderivada: ∫sin(x)dx = -cos(x)",
        "4. Evaluar: [-cos(x)]₀^π = -cos(π) + cos(0) = -(-1) + 1 = 2"
      ],
      difficulty: "Intermedio"
    }
  ]

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-green-800 mb-2">📚 Ejemplos Resueltos</h2>
        <p className="text-green-700">
          Ejercicios paso a paso para dominar las integrales de Riemann
        </p>
      </div>

      <div className="space-y-6">
        {examples.map((example) => (
          <Card key={example.id} className="p-6 border border-green-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  {example.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-green-600">
                  <div className="flex items-center gap-1">
                    <Calculator className="w-4 h-4" />
                    <span>{example.function}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{example.interval}</span>
                  </div>
                </div>
              </div>
              <Badge 
                variant={example.difficulty === "Básico" ? "default" : "secondary"}
                className="bg-green-100 text-green-800"
              >
                {example.difficulty}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Solución */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Solución
                </h4>
                <div className="text-2xl font-bold text-blue-900">
                  ∫{example.interval} {example.function} dx = {example.solution}
                </div>
              </div>

              {/* Pasos */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Pasos de Resolución:</h4>
                <ol className="space-y-2 text-sm text-green-700">
                  {example.steps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="bg-green-200 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Consejos adicionales */}
      <Card className="mt-6 p-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200">
        <h3 className="text-lg font-semibold text-purple-800 mb-3">💡 Consejos para Resolver Integrales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="font-semibold text-purple-700">Técnicas Básicas:</div>
            <ul className="space-y-1 text-purple-600">
              <li>• Identifica el tipo de función</li>
              <li>• Aplica las reglas de integración</li>
              <li>• Verifica tu resultado derivando</li>
            </ul>
          </div>
          <div className="space-y-2">
            <div className="font-semibold text-purple-700">Errores Comunes:</div>
            <ul className="space-y-1 text-purple-600">
              <li>• No olvides la constante de integración</li>
              <li>• Verifica los límites de integración</li>
              <li>• Simplifica antes de evaluar</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}

