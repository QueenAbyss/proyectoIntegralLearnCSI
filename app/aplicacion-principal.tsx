"use client"

import React, { useState } from "react"
import { ScenarioNavigation } from "@/components/scenario-navigation"
import { LoginForm } from "@/components/login-form"
import RiemannGarden from "@/components/riemann-garden"
import { FundamentalTheoremBridge } from "@/components/fundamental-theorem-bridge"
import { MeanValueTower } from "@/components/mean-value-tower"
import { CrystalAntiderivatives } from "@/components/crystal-antiderivatives"

type RolUsuario = "student" | "teacher"
type Escenario = "inicio" | "riemann" | "teorema-fundamental" | "valor-medio" | "antiderivadas"

interface Usuario {
  email: string
  rol: RolUsuario
}

export default function AplicacionPrincipal() {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [escenarioActual, setEscenarioActual] = useState<Escenario>("inicio")

  const manejarLogin = (email: string, password: string, rol: RolUsuario) => {
    setUsuario({ email, rol })
    setEscenarioActual("inicio")
  }

  const manejarLogout = () => {
    setUsuario(null)
    setEscenarioActual("inicio")
  }

  const manejarCambioEscenario = (escenario: string) => {
    setEscenarioActual(escenario as Escenario)
  }

  const renderizarEscenarioActual = () => {
    switch (escenarioActual) {
      case "inicio":
        return <DashboardInicio usuario={usuario} onCambioEscenario={setEscenarioActual} />
      case "riemann":
        return <RiemannGarden />
      case "teorema-fundamental":
        return <FundamentalTheoremBridge />
      case "valor-medio":
        return <MeanValueTower />
      case "antiderivadas":
        return <CrystalAntiderivatives />
      default:
        return <DashboardInicio usuario={usuario} onCambioEscenario={setEscenarioActual} />
    }
  }

  if (!usuario) {
    return <LoginForm onLogin={manejarLogin} />
  }

  return (
    <div className="flex">
      <ScenarioNavigation
        currentScenario={escenarioActual}
        onScenarioChange={manejarCambioEscenario}
        userRole={usuario.rol}
        onLogout={manejarLogout}
      />
      <div className="flex-1 ml-80">
        {renderizarEscenarioActual()}
      </div>
    </div>
  )
}

// Componente Dashboard de Inicio
interface PropsDashboardInicio {
  usuario: Usuario | null
  onCambioEscenario: (escenario: Escenario) => void
}

function DashboardInicio({ usuario, onCambioEscenario }: PropsDashboardInicio) {
  const escenarios = [
    {
      id: "riemann" as Escenario,
      nombre: "Jardín de Riemann",
      descripcion: "Aprende integrales de Riemann plantando macetas mágicas",
      icono: "🧚‍♀️",
      color: "from-green-400 to-green-600",
      temas: ["Sumas de Riemann", "Propiedades de integrales", "Aproximación de áreas"],
      dificultad: "Básico",
      tiempoEstimado: "15-20 min"
    },
    {
      id: "teorema-fundamental" as Escenario,
      nombre: "Puente del Teorema Fundamental",
      descripcion: "Descubre la conexión entre derivadas e integrales",
      icono: "🌉",
      color: "from-blue-400 to-blue-600",
      temas: ["Teorema fundamental", "Derivadas e integrales", "Construcción de antiderivadas"],
      dificultad: "Intermedio",
      tiempoEstimado: "20-25 min"
    },
    {
      id: "valor-medio" as Escenario,
      nombre: "Torre del Valor Medio",
      descripcion: "Encuentra el punto donde la función alcanza su valor promedio",
      icono: "🏰",
      color: "from-purple-400 to-purple-600",
      temas: ["Valor medio", "Punto intermedio", "Comparación de áreas"],
      dificultad: "Intermedio",
      tiempoEstimado: "18-22 min"
    },
    {
      id: "antiderivadas" as Escenario,
      nombre: "Cristal de Antiderivadas",
      descripcion: "Explora las familias de antiderivadas y cambio de variable",
      icono: "💎",
      color: "from-cyan-400 to-cyan-600",
      temas: ["Integrales indefinidas", "Cambio de variable", "Familias de funciones"],
      dificultad: "Avanzado",
      tiempoEstimado: "25-30 min"
    }
  ]

  const escenariosDisponibles = usuario?.rol === "teacher" 
    ? escenarios 
    : escenarios.filter(s => s.id !== "antiderivadas") // Restringir para estudiantes

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado de Bienvenida */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            ¡Bienvenido al Bosque Mágico de Integrales! ✨
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            {usuario?.rol === "student" 
              ? "Explora los diferentes escenarios y aprende sobre integrales de manera interactiva"
              : "Gestiona las simulaciones y supervisa el progreso de tus estudiantes"
            }
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full border border-gray-200">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">
              {usuario?.rol === "student" ? "Estudiante activo" : "Profesor en línea"}
            </span>
          </div>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🧚‍♀️</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Escenarios Disponibles</h3>
                <p className="text-2xl font-bold text-green-600">{escenariosDisponibles.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Temas Cubiertos</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {escenariosDisponibles.reduce((acc, escenario) => acc + escenario.temas.length, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⏱️</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Tiempo Estimado</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {escenariosDisponibles.reduce((acc, escenario) => {
                    const tiempo = parseInt(escenario.tiempoEstimado.split('-')[1])
                    return acc + tiempo
                  }, 0)} min
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de Escenarios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {escenariosDisponibles.map((escenario) => (
            <div
              key={escenario.id}
              className="group cursor-pointer"
              onClick={() => onCambioEscenario(escenario.id)}
            >
              <div className="bg-white/80 backdrop-blur rounded-2xl p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start gap-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${escenario.color} rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300`}>
                    {escenario.icono}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                      {escenario.nombre}
                    </h3>
                    <p className="text-gray-600 mb-4">{escenario.descripcion}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {escenario.temas.slice(0, 2).map((tema, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {tema}
                        </span>
                      ))}
                      {escenario.temas.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{escenario.temas.length - 2} más
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          {escenario.dificultad}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          {escenario.tiempoEstimado}
                        </span>
                      </div>
                      <div className="text-purple-600 font-semibold group-hover:translate-x-1 transition-transform">
                        Comenzar →
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Instrucciones */}
        <div className="mt-12 bg-white/80 backdrop-blur rounded-2xl p-8 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">¿Cómo usar IntegraLearn?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🎯</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">1. Selecciona un Escenario</h4>
              <p className="text-sm text-gray-600">
                Elige el tema que quieres aprender y comienza tu aventura mágica
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📖</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">2. Modo Guiado o Libre</h4>
              <p className="text-sm text-gray-600">
                Aprende paso a paso o explora libremente según tu preferencia
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">✨</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">2. Interactúa y Aprende</h4>
              <p className="text-sm text-gray-600">
                Manipula las simulaciones y recibe retroalimentación inmediata
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
