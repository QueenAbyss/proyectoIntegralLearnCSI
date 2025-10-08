"use client"

import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Home, 
  BookOpen, 
  ArrowRightLeft, 
  TrendingUp, 
  Gem, 
  User, 
  GraduationCap,
  Settings,
  LogOut
} from "lucide-react"

interface ScenarioNavigationProps {
  currentScenario: string
  onScenarioChange: (scenario: string) => void
  userRole: "student" | "teacher"
  onLogout: () => void
}

export function ScenarioNavigation({
  currentScenario,
  onScenarioChange,
  userRole,
  onLogout
}: ScenarioNavigationProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const scenarios = [
    {
      id: "home",
      name: "Inicio",
      icon: <Home className="w-5 h-5" />,
      description: "Dashboard principal",
      color: "bg-gray-100 text-gray-800",
      available: true
    },
    {
      id: "riemann",
      name: "Jardín de Riemann",
      icon: <BookOpen className="w-5 h-5" />,
      description: "Integrales de Riemann y propiedades",
      color: "bg-green-100 text-green-800",
      available: true,
      topics: ["Sumas de Riemann", "Propiedades de integrales", "Aproximación de áreas"]
    },
    {
      id: "fundamental-theorem",
      name: "Puente del Teorema Fundamental",
      icon: <ArrowRightLeft className="w-5 h-5" />,
      description: "Primer y segundo teorema fundamental del cálculo",
      color: "bg-blue-100 text-blue-800",
      available: true,
      topics: ["Teorema fundamental", "Derivadas e integrales", "Construcción de antiderivadas"]
    },
    {
      id: "mean-value",
      name: "Torre del Valor Medio",
      icon: <TrendingUp className="w-5 h-5" />,
      description: "Teorema del valor medio para integrales",
      color: "bg-purple-100 text-purple-800",
      available: true,
      topics: ["Valor medio", "Punto intermedio", "Comparación de áreas"]
    },
    {
      id: "antiderivatives",
      name: "Cristal de Antiderivadas",
      icon: <Gem className="w-5 h-5" />,
      description: "Integrales indefinidas y cambio de variable",
      color: "bg-cyan-100 text-cyan-800",
      available: userRole === "teacher", // Solo disponible para profesores por ahora
      topics: ["Integrales indefinidas", "Cambio de variable", "Familias de funciones"]
    }
  ]

  const getCurrentScenarioInfo = () => {
    return scenarios.find(s => s.id === currentScenario)
  }

  const currentScenarioInfo = getCurrentScenarioInfo()

  return (
    <div className="fixed left-0 top-0 h-full w-80 bg-white/95 backdrop-blur border-r border-gray-200 shadow-lg z-50">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-800">IntegraLearn</h1>
            <p className="text-xs text-gray-500">
              {userRole === "student" ? "Estudiante" : "Profesor"}
            </p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">
              {userRole === "student" ? "Estudiante" : "Prof. Sergio"}
            </p>
            <p className="text-xs text-gray-500">
              {userRole === "student" ? "Matemáticas II" : "Cálculo"}
            </p>
          </div>
          <Button
            onClick={onLogout}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Current Scenario Info */}
      {currentScenarioInfo && currentScenarioInfo.id !== "home" && (
        <div className="p-4 border-b border-gray-200">
          <div className={`p-3 rounded-lg ${currentScenarioInfo.color}`}>
            <div className="flex items-center gap-2 mb-2">
              {currentScenarioInfo.icon}
              <span className="font-semibold text-sm">{currentScenarioInfo.name}</span>
            </div>
            <p className="text-xs opacity-75 mb-2">{currentScenarioInfo.description}</p>
            {currentScenarioInfo.topics && (
              <div className="space-y-1">
                {currentScenarioInfo.topics.map((topic, index) => (
                  <Badge key={index} variant="secondary" className="text-xs mr-1">
                    {topic}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Escenarios de Aprendizaje</h3>
        <div className="space-y-2">
          {scenarios.map((scenario) => (
            <Card
              key={scenario.id}
              className={`cursor-pointer transition-all duration-200 ${
                currentScenario === scenario.id
                  ? "ring-2 ring-blue-400 bg-blue-50"
                  : scenario.available
                  ? "hover:shadow-md hover:bg-gray-50"
                  : "opacity-50 cursor-not-allowed"
              }`}
              onClick={() => scenario.available && onScenarioChange(scenario.id)}
            >
              <div className="p-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${scenario.color}`}>
                    {scenario.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-gray-800">
                      {scenario.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {scenario.description}
                    </p>
                    {!scenario.available && (
                      <Badge variant="outline" className="text-xs mt-1">
                        Próximamente
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Progress Section - Only for students */}
      {userRole === "student" && (
        <div className="p-4 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Progreso</h3>
          <div className="space-y-2">
            {scenarios.filter(s => s.available && s.id !== "home").map((scenario) => (
              <div key={scenario.id} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  currentScenario === scenario.id ? "bg-green-500" : "bg-gray-300"
                }`}></div>
                <span className="text-xs text-gray-600 flex-1">{scenario.name}</span>
                <Badge 
                  variant={currentScenario === scenario.id ? "default" : "secondary"}
                  className="text-xs"
                >
                  {currentScenario === scenario.id ? "Activo" : "Disponible"}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Teacher Controls */}
      {userRole === "teacher" && (
        <div className="p-4 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Panel de Control</h3>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Settings className="w-4 h-4 mr-2" />
              Configurar Clases
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <GraduationCap className="w-4 h-4 mr-2" />
              Ver Progreso Estudiantes
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
