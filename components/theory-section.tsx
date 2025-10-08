"use client"

import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight, BookOpen, Lightbulb, Calculator, Globe } from "lucide-react"

interface TheorySectionProps {
  currentScenario: string
}

export function TheorySection({ currentScenario }: TheorySectionProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const theoryContent = {
    "riemann": {
      title: "Integrales de Riemann y Propiedades",
      icon: "🧚‍♀️",
      sections: [
        {
          id: "what-is-integral",
          title: "¿Qué es una Integral?",
          icon: <BookOpen className="w-4 h-4" />,
          content: (
            <div className="space-y-3">
              <p className="text-gray-700">
                Una <strong>integral definida</strong> representa el área bajo una curva entre dos puntos. 
                Es una herramienta fundamental en cálculo que conecta la geometría con el álgebra.
              </p>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="font-mono text-sm text-blue-800">
                  ∫[a,b] f(x) dx = Área bajo f(x) desde x=a hasta x=b
                </div>
              </div>
              <p className="text-sm text-gray-600">
                El símbolo ∫ (integral) proviene de la "S" de "suma", ya que originalmente 
                se pensaba como una suma infinita de rectángulos muy pequeños.
              </p>
            </div>
          )
        },
        {
          id: "riemann-sums",
          title: "Sumas de Riemann",
          icon: <Calculator className="w-4 h-4" />,
          content: (
            <div className="space-y-3">
              <p className="text-gray-700">
                Las <strong>sumas de Riemann</strong> son una aproximación del área bajo la curva 
                dividiendo el intervalo en pequeños rectángulos.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="bg-green-50 p-3 rounded border border-green-200">
                  <strong className="text-green-700">Izquierda:</strong>
                  <div className="font-mono">f(xi) × Δx</div>
                  <div className="text-xs text-green-600">Altura por el extremo izquierdo</div>
                </div>
                <div className="bg-blue-50 p-3 rounded border border-blue-200">
                  <strong className="text-blue-700">Derecha:</strong>
                  <div className="font-mono">f(xi+1) × Δx</div>
                  <div className="text-xs text-blue-600">Altura por el extremo derecho</div>
                </div>
                <div className="bg-purple-50 p-3 rounded border border-purple-200">
                  <strong className="text-purple-700">Centro:</strong>
                  <div className="font-mono">f((xi+xi+1)/2) × Δx</div>
                  <div className="text-xs text-purple-600">Altura por el punto medio</div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Mientras más rectángulos usemos (mayor n), mejor será la aproximación al área real.
              </p>
            </div>
          )
        },
        {
          id: "properties",
          title: "Propiedades de las Integrales Definidas",
          icon: <Lightbulb className="w-4 h-4" />,
          content: (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-blue-50 p-3 rounded border border-blue-200">
                  <strong className="text-blue-700">Linealidad:</strong>
                  <div className="font-mono text-sm">∫[cf(x)]dx = c∫f(x)dx</div>
                  <div className="text-xs text-blue-600">Constante sale de la integral</div>
                </div>
                <div className="bg-green-50 p-3 rounded border border-green-200">
                  <strong className="text-green-700">Aditividad:</strong>
                  <div className="font-mono text-sm">∫[a,b] = ∫[a,c] + ∫[c,b]</div>
                  <div className="text-xs text-green-600">Dividir intervalo</div>
                </div>
                <div className="bg-orange-50 p-3 rounded border border-orange-200">
                  <strong className="text-orange-700">Monotonía:</strong>
                  <div className="font-mono text-sm">f ≥ g → ∫f ≥ ∫g</div>
                  <div className="text-xs text-orange-600">Función mayor, área mayor</div>
                </div>
                <div className="bg-red-50 p-3 rounded border border-red-200">
                  <strong className="text-red-700">Intervalo Nulo:</strong>
                  <div className="font-mono text-sm">∫[a,a] = 0</div>
                  <div className="text-xs text-red-600">Sin ancho, sin área</div>
                </div>
              </div>
            </div>
          )
        },
        {
          id: "applications",
          title: "Aplicaciones en Ingeniería de Sistemas",
          icon: <Globe className="w-4 h-4" />,
          content: (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-purple-50 p-3 rounded border border-purple-200">
                  <strong className="text-purple-700">🖥️ Procesamiento de Señales:</strong>
                  <p className="text-sm text-gray-600 mt-1">
                    Cálculo de energía total de señales digitales, filtros y transformadas.
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded border border-blue-200">
                  <strong className="text-blue-700">📊 Análisis de Datos:</strong>
                  <p className="text-sm text-gray-600 mt-1">
                    Cálculo de áreas bajo curvas de distribución, métricas de rendimiento.
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded border border-green-200">
                  <strong className="text-green-700">🎮 Gráficos por Computadora:</strong>
                  <p className="text-sm text-gray-600 mt-1">
                    Cálculo de volúmenes, superficies y efectos de iluminación.
                  </p>
                </div>
                <div className="bg-orange-50 p-3 rounded border border-orange-200">
                  <strong className="text-orange-700">🔬 Simulaciones:</strong>
                  <p className="text-sm text-gray-600 mt-1">
                    Modelado de sistemas físicos, análisis de rendimiento de algoritmos.
                  </p>
                </div>
              </div>
              <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                <strong className="text-yellow-700">💡 Ejemplo Práctico:</strong>
                <p className="text-sm text-gray-600 mt-1">
                  En análisis de redes, las integrales ayudan a calcular el ancho de banda total 
                  utilizado durante un período de tiempo, representado por el área bajo la curva 
                  de uso de datos vs tiempo.
                </p>
              </div>
            </div>
          )
        }
      ]
    }
  }

  const currentContent = theoryContent[currentScenario as keyof typeof theoryContent]

  if (!currentContent) {
    return null
  }

  return (
    <Card className="p-6 bg-white/90 backdrop-blur">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{currentContent.icon}</span>
        <h3 className="text-xl font-bold text-green-800">
          {currentContent.title}
        </h3>
      </div>

      <div className="space-y-3">
        {currentContent.sections.map((section) => (
          <Card key={section.id} className="border border-gray-200">
            <Button
              variant="ghost"
              className="w-full justify-start p-4 h-auto"
              onClick={() => toggleSection(section.id)}
            >
              <div className="flex items-center gap-3 w-full">
                {expandedSections.includes(section.id) ? (
                  <ChevronDown className="w-4 h-4 text-green-600" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-green-600" />
                )}
                <div className="text-green-600">{section.icon}</div>
                <span className="font-semibold text-gray-800 flex-1 text-left">
                  {section.title}
                </span>
                {!expandedSections.includes(section.id) && (
                  <Badge variant="outline" className="text-xs">
                    Ver más
                  </Badge>
                )}
              </div>
            </Button>
            
            {expandedSections.includes(section.id) && (
              <div className="px-4 pb-4 border-t border-gray-100">
                {section.content}
              </div>
            )}
          </Card>
        ))}
      </div>

      <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
        <div className="text-sm text-green-700">
          <strong>📚 Recursos Adicionales:</strong>
          <ul className="mt-1 space-y-1 text-xs text-green-600">
            <li>• Stewart, J. (2017). Cálculo de una variable. Cengage Learning.</li>
            <li>• Larson, R. & Edwards, B. (2017). Cálculo. McGraw-Hill.</li>
            <li>• Khan Academy: Integrales definidas y sumas de Riemann</li>
          </ul>
        </div>
      </div>
    </Card>
  )
}


