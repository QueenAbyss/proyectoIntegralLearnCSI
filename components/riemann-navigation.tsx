"use client"

import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, BarChart3, FileText } from "lucide-react"

interface RiemannNavigationProps {
  children: {
    theory: React.ReactNode
    visualizations: React.ReactNode
    examples: React.ReactNode
  }
}

export function RiemannNavigation({ children }: RiemannNavigationProps) {
  const [activeTab, setActiveTab] = useState<"theory" | "visualizations" | "examples">("visualizations")

  const tabs = [
    {
      id: "theory" as const,
      label: "Teoría",
      icon: <BookOpen className="w-4 h-4" />,
      description: "Conceptos fundamentales de la Integral de Riemann y sus propiedades"
    },
    {
      id: "visualizations" as const,
      label: "Visualizaciones", 
      icon: <BarChart3 className="w-4 h-4" />,
      description: "Gráficas interactivas que ilustran el concepto de integración"
    },
    {
      id: "examples" as const,
      label: "Ejemplos",
      icon: <FileText className="w-4 h-4" />,
      description: "Ejercicios resueltos paso a paso con explicaciones detalladas"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 via-green-200 to-green-400 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-green-800 mb-2">🧚‍♀️ El Jardín Mágico de Riemann 🌸</h1>
          <p className="text-green-700 text-lg">
            Aprende integrales definidas plantando macetas mágicas con el Hada Aria
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-6">
          <div className="bg-white/90 backdrop-blur rounded-lg p-2 shadow-lg">
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  className={`flex items-center gap-2 px-6 py-3 ${
                    activeTab === tab.id 
                      ? "bg-green-600 text-white shadow-md" 
                      : "text-green-700 hover:bg-green-50"
                  }`}
                >
                  {tab.icon}
                  <span className="font-medium">{tab.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Description */}
        <div className="text-center mb-6">
          <div className="bg-white/80 backdrop-blur rounded-lg border border-green-300 inline-block p-4">
            <div className="flex items-center gap-2 text-green-700">
              {tabs.find(tab => tab.id === activeTab)?.icon}
              <span className="font-medium">
                {tabs.find(tab => tab.id === activeTab)?.description}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/90 backdrop-blur rounded-lg shadow-lg">
          {activeTab === "theory" && children.theory}
          {activeTab === "visualizations" && children.visualizations}
          {activeTab === "examples" && children.examples}
        </div>
      </div>
    </div>
  )
}

