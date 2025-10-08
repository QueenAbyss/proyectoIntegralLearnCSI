"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Play, Pause, RotateCcw, BookOpen, MousePointer, Wand2, Eye, EyeOff } from "lucide-react"

interface CrystalAntiderivativesProps {
  width?: number
  height?: number
}

export function CrystalAntiderivatives({ 
  width = 800, 
  height = 500 
}: CrystalAntiderivativesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedFunction, setSelectedFunction] = useState("quadratic")
  const [mode, setMode] = useState<"guided" | "free">("guided")
  const [complexityLevel, setComplexityLevel] = useState<"basic" | "advanced">("basic")
  const [showFamily, setShowFamily] = useState(true)
  const [showTransformation, setShowTransformation] = useState(false)
  const [constantC, setConstantC] = useState(0)
  const [customFunction, setCustomFunction] = useState("")
  const [substitutionActive, setSubstitutionActive] = useState(false)
  const [substitutionU, setSubstitutionU] = useState("")

  // Mathematical functions and their antiderivatives
  const functions = {
    quadratic: {
      f: (x: number) => x * x,
      F: (x: number, C: number = 0) => (x * x * x) / 3 + C,
      name: "f(x) = x²",
      antiderivative: "F(x) = x³/3 + C",
      derivative: (x: number) => x * x
    },
    sine: {
      f: (x: number) => Math.cos(x),
      F: (x: number, C: number = 0) => Math.sin(x) + C,
      name: "f(x) = cos(x)",
      antiderivative: "F(x) = sin(x) + C",
      derivative: (x: number) => Math.cos(x)
    },
    exponential: {
      f: (x: number) => Math.exp(x),
      F: (x: number, C: number = 0) => Math.exp(x) + C,
      name: "f(x) = eˣ",
      antiderivative: "F(x) = eˣ + C",
      derivative: (x: number) => Math.exp(x)
    },
    linear: {
      f: (x: number) => 2 * x + 1,
      F: (x: number, C: number = 0) => x * x + x + C,
      name: "f(x) = 2x + 1",
      antiderivative: "F(x) = x² + x + C",
      derivative: (x: number) => 2 * x + 1
    }
  }

  const currentFunc = functions[selectedFunction as keyof typeof functions]

  // Animation loop
  useEffect(() => {
    let animationId: number
    let lastTime = 0
    const targetFPS = 30
    const frameDelay = 1000 / targetFPS

    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= frameDelay) {
        drawCrystal()
        lastTime = currentTime
      }
      animationId = requestAnimationFrame(animate)
    }
    
    animationId = requestAnimationFrame(animate)
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [selectedFunction, showFamily, showTransformation, constantC, substitutionActive, substitutionU, width, height])

  const drawCrystal = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas with crystal background
    const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2)
    gradient.addColorStop(0, "#E6F3FF") // Light blue center
    gradient.addColorStop(0.5, "#B3D9FF") // Medium blue
    gradient.addColorStop(1, "#80BFFF") // Darker blue edges
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Draw coordinate system as crystal lattice
    ctx.strokeStyle = "rgba(100, 149, 237, 0.3)"
    ctx.lineWidth = 2

    // X-axis
    ctx.beginPath()
    ctx.moveTo(50, height - 100)
    ctx.lineTo(width - 50, height - 100)
    ctx.stroke()

    // Y-axis
    ctx.beginPath()
    ctx.moveTo(100, 50)
    ctx.lineTo(100, height - 50)
    ctx.stroke()

    // Draw grid lines (crystal lattice)
    ctx.strokeStyle = "rgba(100, 149, 237, 0.2)"
    ctx.lineWidth = 1

    // Vertical grid lines
    for (let i = 1; i < 10; i++) {
      const x = 100 + (i / 10) * (width - 200)
      ctx.beginPath()
      ctx.moveTo(x, 50)
      ctx.lineTo(x, height - 50)
      ctx.stroke()
    }

    // Horizontal grid lines
    for (let i = 1; i < 8; i++) {
      const y = 50 + (i / 8) * (height - 150)
      ctx.beginPath()
      ctx.moveTo(100, y)
      ctx.lineTo(width - 50, y)
      ctx.stroke()
    }

    // Convert mathematical coordinates to screen coordinates
    const mathToScreen = (mathX: number, mathY: number) => {
      const screenX = 100 + ((mathX + 3) / 6) * (width - 200)
      const screenY = height - 100 - mathY * 15
      return { x: screenX, y: screenY }
    }

    // Draw original function
    ctx.strokeStyle = "#8A2BE2"
    ctx.lineWidth = 4
    ctx.beginPath()

    for (let x = -3; x <= 3; x += 0.1) {
      const screenCoords = mathToScreen(x, currentFunc.f(x))
      if (x === -3) {
        ctx.moveTo(screenCoords.x, screenCoords.y)
      } else {
        ctx.lineTo(screenCoords.x, screenCoords.y)
      }
    }
    ctx.stroke()

    // Draw family of antiderivatives
    if (showFamily) {
      const constants = [-3, -1.5, 0, 1.5, 3]
      const colors = ["#FF6B6B", "#FFA500", "#32CD32", "#4169E1", "#9370DB"]
      
      constants.forEach((C, index) => {
        ctx.strokeStyle = colors[index]
        ctx.lineWidth = 2
        ctx.setLineDash(C === constantC ? [] : [5, 5])
        ctx.beginPath()

        for (let x = -3; x <= 3; x += 0.1) {
          const screenCoords = mathToScreen(x, currentFunc.F(x, C))
          if (x === -3) {
            ctx.moveTo(screenCoords.x, screenCoords.y)
          } else {
            ctx.lineTo(screenCoords.x, screenCoords.y)
          }
        }
        ctx.stroke()
        
        // Highlight the selected constant
        if (C === constantC) {
          ctx.strokeStyle = "#FFD700"
          ctx.lineWidth = 3
          ctx.beginPath()
          for (let x = -3; x <= 3; x += 0.1) {
            const screenCoords = mathToScreen(x, currentFunc.F(x, C))
            if (x === -3) {
              ctx.moveTo(screenCoords.x, screenCoords.y)
            } else {
              ctx.lineTo(screenCoords.x, screenCoords.y)
            }
          }
          ctx.stroke()
        }
      })
      ctx.setLineDash([])
    }

    // Draw substitution transformation
    if (showTransformation && substitutionActive) {
      // Original function in one color
      ctx.strokeStyle = "#FF6B6B"
      ctx.lineWidth = 3
      ctx.setLineDash([10, 5])
      ctx.beginPath()
      for (let x = -3; x <= 3; x += 0.1) {
        const screenCoords = mathToScreen(x, currentFunc.f(x))
        if (x === -3) {
          ctx.moveTo(screenCoords.x, screenCoords.y)
        } else {
          ctx.lineTo(screenCoords.x, screenCoords.y)
        }
      }
      ctx.stroke()

      // Transformed function
      ctx.strokeStyle = "#32CD32"
      ctx.lineWidth = 3
      ctx.setLineDash([])
      ctx.beginPath()
      
      // Example: u = x + 1, so x = u - 1
      for (let u = -2; u <= 4; u += 0.1) {
        const x = u - 1 // substitution
        if (x >= -3 && x <= 3) {
          const screenCoords = mathToScreen(u, currentFunc.f(x))
          if (u === -2) {
            ctx.moveTo(screenCoords.x, screenCoords.y)
          } else {
            ctx.lineTo(screenCoords.x, screenCoords.y)
          }
        }
      }
      ctx.stroke()

      // Show transformation arrow
      ctx.strokeStyle = "#FFD700"
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(width/2 - 50, height/2)
      ctx.lineTo(width/2 + 50, height/2)
      ctx.stroke()

      // Arrow head
      ctx.beginPath()
      ctx.moveTo(width/2 + 50, height/2)
      ctx.lineTo(width/2 + 30, height/2 - 10)
      ctx.moveTo(width/2 + 50, height/2)
      ctx.lineTo(width/2 + 30, height/2 + 10)
      ctx.stroke()

      // Transformation labels
      ctx.fillStyle = "#333333"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText("u = x + 1", width/2 - 100, height/2 - 10)
      ctx.fillText("f(x) → f(u-1)", width/2 + 100, height/2 - 10)
    }

    // Draw crystal particles
    if (isPlaying) {
      ctx.fillStyle = "rgba(255, 215, 0, 0.6)"
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * width
        const y = Math.random() * height
        const size = 2 + Math.random() * 3
        ctx.beginPath()
        ctx.arc(x, y, size, 0, 2 * Math.PI)
        ctx.fill()
      }
    }

    // Draw labels
    ctx.fillStyle = "#333333"
    ctx.font = "12px Arial"
    ctx.textAlign = "center"
    
    // Function labels
    ctx.fillText("f(x)", mathToScreen(2, currentFunc.f(2)).x, 
                mathToScreen(2, currentFunc.f(2)).y - 15)
    
    if (showFamily) {
      ctx.fillText(`F(x) + ${constantC}`, mathToScreen(-2, currentFunc.F(-2, constantC)).x, 
                  mathToScreen(-2, currentFunc.F(-2, constantC)).y - 15)
    }

    // Show current values
    ctx.fillStyle = "#333333"
    ctx.font = "10px Arial"
    ctx.textAlign = "left"
    ctx.fillText(`f(x) = ${currentFunc.name}`, 10, 20)
    ctx.fillText(`F(x) = ${currentFunc.antiderivative}`, 10, 35)
    ctx.fillText(`C = ${constantC}`, 10, 50)
    if (substitutionActive) {
      ctx.fillText(`u = ${substitutionU}`, 10, 65)
    }
  }, [selectedFunction, showFamily, showTransformation, constantC, substitutionActive, substitutionU, isPlaying, width, height])

  const handleSubstitution = () => {
    if (substitutionU.trim()) {
      setSubstitutionActive(true)
      setShowTransformation(true)
    }
  }

  const resetSubstitution = () => {
    setSubstitutionActive(false)
    setShowTransformation(false)
    setSubstitutionU("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 via-purple-200 to-blue-400 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-blue-800 mb-2">💎 El Cristal Mágico de Antiderivadas ✨</h1>
          <p className="text-blue-700 text-lg">
            Explora las familias de antiderivadas y el cambio de variable con el Hada Cristalina
          </p>
          <div className="mt-3 p-3 bg-white/80 rounded-lg border border-blue-300 inline-block">
            <div className="text-sm text-blue-600 mb-1">Función Actual:</div>
            <div className="text-lg font-bold text-blue-800">{currentFunc.name}</div>
            <div className="text-sm text-blue-600">Antiderivada: {currentFunc.antiderivative}</div>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="flex justify-center gap-4 mb-6">
          <Button
            onClick={() => setMode("guided")}
            variant={mode === "guided" ? "default" : "outline"}
            className="flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            Modo Guiado
          </Button>
          <Button
            onClick={() => setMode("free")}
            variant={mode === "free" ? "default" : "outline"}
            className="flex items-center gap-2"
          >
            <MousePointer className="w-4 h-4" />
            Modo Libre
          </Button>
        </div>

        {/* Complexity Level Selection */}
        {mode === "guided" && (
          <div className="flex justify-center gap-4 mb-4">
            <Button
              onClick={() => setComplexityLevel("basic")}
              variant={complexityLevel === "basic" ? "default" : "outline"}
              className="flex items-center gap-2"
            >
              🌱 Nivel Básico
            </Button>
            <Button
              onClick={() => setComplexityLevel("advanced")}
              variant={complexityLevel === "advanced" ? "default" : "outline"}
              className="flex items-center gap-2"
            >
              🌟 Nivel Avanzado
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Canvas */}
          <div className="lg:col-span-3">
            <Card className="p-4 bg-white/90 backdrop-blur">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={width}
                  height={height}
                  className="w-full border-2 border-blue-300 rounded-lg"
                />
              </div>

              {/* Theory Explanation */}
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <Wand2 className="w-4 h-4" />
                  Integrales Indefinidas y Cambio de Variable
                </h4>
                <div className="text-sm text-gray-700 space-y-2">
                  <p>
                    <strong>Integral Indefinida:</strong> ∫f(x)dx = F(x) + C, donde C es una constante arbitraria.
                  </p>
                  <p>
                    <strong>Cambio de Variable:</strong> Si u = g(x), entonces ∫f(g(x))g'(x)dx = ∫f(u)du.
                  </p>
                  <div className="bg-white p-2 rounded border font-mono text-center text-xs">
                    Ejemplo: ∫(x+1)²dx → u = x+1, du = dx → ∫u²du = u³/3 + C = (x+1)³/3 + C
                  </div>
                  <p className="text-xs text-gray-600">
                    💡 Observa cómo cambiar la constante C desplaza verticalmente toda la familia de antiderivadas.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Controls Panel */}
          <div className="space-y-4">
            {/* Function Selection */}
            <Card className="p-4 bg-white/90 backdrop-blur">
              <h3 className="font-semibold mb-3 text-blue-800">Función Original</h3>
              <div className="space-y-2">
                {Object.keys(functions).map((func) => (
                  <Button
                    key={func}
                    onClick={() => setSelectedFunction(func)}
                    variant={selectedFunction === func ? "default" : "outline"}
                    className="w-full justify-start"
                  >
                    {func === "quadratic" && "💎 x²"}
                    {func === "sine" && "🌊 cos(x)"}
                    {func === "exponential" && "📈 eˣ"}
                    {func === "linear" && "📏 2x+1"}
                  </Button>
                ))}
              </div>
            </Card>

            {/* Family of Antiderivatives */}
            <Card className="p-4 bg-white/90 backdrop-blur">
              <h3 className="font-semibold mb-3 text-blue-800">Familia de Antiderivadas</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setShowFamily(!showFamily)}
                    variant={showFamily ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                  >
                    {showFamily ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showFamily ? "Ocultar" : "Mostrar"}
                  </Button>
                </div>
                
                {showFamily && (
                  <div>
                    <label className="text-sm text-blue-600">Constante C</label>
                    <Slider
                      value={[constantC]}
                      onValueChange={(value) => setConstantC(value[0])}
                      min={-5}
                      max={5}
                      step={0.5}
                      className="w-full"
                    />
                    <div className="text-center text-xs text-blue-500">C = {constantC}</div>
                  </div>
                )}
              </div>
            </Card>

            {/* Substitution Controls */}
            <Card className="p-4 bg-white/90 backdrop-blur">
              <h3 className="font-semibold mb-3 text-blue-800">Cambio de Variable</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-blue-600">Sustitución u =</label>
                  <Input
                    value={substitutionU}
                    onChange={(e) => setSubstitutionU(e.target.value)}
                    placeholder="x + 1"
                    className="w-full"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleSubstitution}
                    disabled={!substitutionU.trim()}
                    className="flex-1"
                    size="sm"
                  >
                    <Wand2 className="w-4 h-4 mr-1" />
                    Aplicar
                  </Button>
                  <Button
                    onClick={resetSubstitution}
                    variant="outline"
                    size="sm"
                    disabled={!substitutionActive}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>

                {substitutionActive && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-sm text-green-700">
                      <strong>Transformación Activa</strong>
                    </div>
                    <div className="text-xs text-green-600">
                      u = {substitutionU}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Animation Controls */}
            <Card className="p-4 bg-white/90 backdrop-blur">
              <h3 className="font-semibold mb-3 text-blue-800">Efectos Mágicos</h3>
              <div className="space-y-2">
                <Button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-full"
                  variant={isPlaying ? "destructive" : "default"}
                >
                  {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {isPlaying ? "Detener" : "Partículas"}
                </Button>
                
                <Button
                  onClick={() => setShowTransformation(!showTransformation)}
                  variant={showTransformation ? "default" : "outline"}
                  className="w-full"
                >
                  ✨ {showTransformation ? "Ocultar" : "Mostrar"} Transformación
                </Button>
              </div>
            </Card>

            {/* Legend */}
            <Card className="p-4 bg-white/90 backdrop-blur">
              <h3 className="font-semibold mb-3 text-blue-800">Leyenda</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-1 bg-purple-600"></div>
                  <span>f(x) - Función original</span>
                </div>
                {showFamily && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-green-600 border-dashed border border-green-600"></div>
                    <span>F(x) + C - Familia de antiderivadas</span>
                  </div>
                )}
                {showTransformation && substitutionActive && (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-1 bg-red-600 border-dashed border border-red-600"></div>
                      <span>f(x) - Antes de sustitución</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-1 bg-green-600"></div>
                      <span>f(u) - Después de sustitución</span>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}


