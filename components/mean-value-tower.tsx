"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, BookOpen, MousePointer, Search, Target } from "lucide-react"

interface MeanValueTowerProps {
  width?: number
  height?: number
}

export function MeanValueTower({ 
  width = 800, 
  height = 500 
}: MeanValueTowerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [leftLimit, setLeftLimit] = useState(-2)
  const [rightLimit, setRightLimit] = useState(4)
  const [selectedFunction, setSelectedFunction] = useState("quadratic")
  const [mode, setMode] = useState<"guided" | "free">("guided")
  const [complexityLevel, setComplexityLevel] = useState<"basic" | "advanced">("basic")
  const [showMeanValue, setShowMeanValue] = useState(true)
  const [showAreaComparison, setShowAreaComparison] = useState(true)
  const [foundC, setFoundC] = useState<number | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  // Mathematical functions
  const functions = {
    quadratic: {
      f: (x: number) => 0.5 * x * x + 1,
      name: "f(x) = 0.5x² + 1",
      color: "#8A2BE2"
    },
    sine: {
      f: (x: number) => 2 * Math.sin(x) + 3,
      name: "f(x) = 2sin(x) + 3",
      color: "#FF6B6B"
    },
    cubic: {
      f: (x: number) => 0.1 * x * x * x + 0.5 * x * x + 2,
      name: "f(x) = 0.1x³ + 0.5x² + 2",
      color: "#32CD32"
    }
  }

  const currentFunc = functions[selectedFunction as keyof typeof functions]

  // Calculate mean value
  const calculateMeanValue = () => {
    let sum = 0
    const n = 1000 // High precision
    const dx = (rightLimit - leftLimit) / n
    
    for (let i = 0; i < n; i++) {
      const x = leftLimit + i * dx
      sum += currentFunc.f(x)
    }
    
    return sum / n
  }

  // Find c where f(c) = mean value
  const findMeanValuePoint = () => {
    const meanVal = calculateMeanValue()
    const tolerance = 0.01
    
    // Binary search for c
    let low = leftLimit
    let high = rightLimit
    let c = (low + high) / 2
    let iterations = 0
    const maxIterations = 50
    
    while (iterations < maxIterations) {
      c = (low + high) / 2
      const funcValue = currentFunc.f(c)
      const difference = funcValue - meanVal
      
      if (Math.abs(difference) < tolerance) {
        return c
      }
      
      if (difference > 0) {
        high = c
      } else {
        low = c
      }
      
      iterations++
    }
    
    return c
  }

  // Animation for finding c
  useEffect(() => {
    let animationId: number
    let lastTime = 0
    const targetFPS = 30
    const frameDelay = 1000 / targetFPS

    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= frameDelay) {
        drawTower()
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
  }, [leftLimit, rightLimit, selectedFunction, showMeanValue, showAreaComparison, foundC, isSearching])

  const drawTower = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas with tower background
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, "#87CEEB") // Sky blue
    gradient.addColorStop(0.7, "#98FB98") // Light green (ground)
    gradient.addColorStop(1, "#228B22") // Forest green
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Draw coordinate system as crystal structure
    ctx.strokeStyle = "#8B7355"
    ctx.lineWidth = 3

    // X-axis (ground level)
    ctx.beginPath()
    ctx.moveTo(50, height - 100)
    ctx.lineTo(width - 50, height - 100)
    ctx.stroke()

    // Y-axis (tower center)
    ctx.beginPath()
    ctx.moveTo(100, 50)
    ctx.lineTo(100, height - 50)
    ctx.stroke()

    // Draw grid lines (crystal lattice)
    ctx.strokeStyle = "rgba(139, 115, 85, 0.3)"
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
      const screenX = 100 + ((mathX - leftLimit) / (rightLimit - leftLimit)) * (width - 200)
      const screenY = height - 100 - mathY * 40
      return { x: screenX, y: screenY }
    }

    // Draw function as tower height variation
    ctx.strokeStyle = currentFunc.color
    ctx.lineWidth = 4
    ctx.beginPath()

    for (let x = leftLimit; x <= rightLimit; x += 0.1) {
      const screenCoords = mathToScreen(x, currentFunc.f(x))
      if (x === leftLimit) {
        ctx.moveTo(screenCoords.x, screenCoords.y)
      } else {
        ctx.lineTo(screenCoords.x, screenCoords.y)
      }
    }
    ctx.stroke()

    // Draw mean value line
    if (showMeanValue) {
      const meanVal = calculateMeanValue()
      const leftScreen = mathToScreen(leftLimit, meanVal)
      const rightScreen = mathToScreen(rightLimit, meanVal)
      
      ctx.strokeStyle = "rgba(255, 215, 0, 0.8)"
      ctx.lineWidth = 3
      ctx.setLineDash([10, 5])
      ctx.beginPath()
      ctx.moveTo(leftScreen.x, leftScreen.y)
      ctx.lineTo(rightScreen.x, rightScreen.y)
      ctx.stroke()
      ctx.setLineDash([])

      // Label for mean value
      ctx.fillStyle = "rgba(255, 215, 0, 0.9)"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText(`Valor Medio: ${meanVal.toFixed(2)}`, rightScreen.x, rightScreen.y - 10)
    }

    // Draw area comparison
    if (showAreaComparison) {
      const meanVal = calculateMeanValue()
      
      // Area under curve
      ctx.fillStyle = "rgba(138, 43, 226, 0.3)"
      ctx.beginPath()
      ctx.moveTo(mathToScreen(leftLimit, 0).x, mathToScreen(leftLimit, 0).y)
      
      for (let x = leftLimit; x <= rightLimit; x += 0.1) {
        const screenCoords = mathToScreen(x, currentFunc.f(x))
        ctx.lineTo(screenCoords.x, screenCoords.y)
      }
      
      ctx.lineTo(mathToScreen(rightLimit, 0).x, mathToScreen(rightLimit, 0).y)
      ctx.closePath()
      ctx.fill()

      // Area of rectangle with mean value
      ctx.fillStyle = "rgba(255, 215, 0, 0.3)"
      const leftScreen = mathToScreen(leftLimit, 0)
      const rightScreen = mathToScreen(rightLimit, meanVal)
      ctx.fillRect(leftScreen.x, leftScreen.y, rightScreen.x - leftScreen.x, leftScreen.y - rightScreen.y)
    }

    // Draw found c point
    if (foundC !== null) {
      const cScreen = mathToScreen(foundC, currentFunc.f(foundC))
      
      // Crystal highlight
      ctx.fillStyle = "#FFD700"
      ctx.beginPath()
      ctx.arc(cScreen.x, cScreen.y, 12, 0, 2 * Math.PI)
      ctx.fill()
      
      // Crystal border
      ctx.strokeStyle = "#FFFFFF"
      ctx.lineWidth = 3
      ctx.stroke()

      // Connection line to mean value
      const meanVal = calculateMeanValue()
      const meanScreen = mathToScreen(foundC, meanVal)
      
      ctx.strokeStyle = "rgba(255, 215, 0, 0.8)"
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(cScreen.x, cScreen.y)
      ctx.lineTo(meanScreen.x, meanScreen.y)
      ctx.stroke()
      ctx.setLineDash([])

      // Labels
      ctx.fillStyle = "#333333"
      ctx.font = "10px Arial"
      ctx.textAlign = "center"
      ctx.fillText(`c = ${foundC.toFixed(2)}`, cScreen.x, cScreen.y - 20)
      ctx.fillText(`f(c) = ${currentFunc.f(foundC).toFixed(2)}`, cScreen.x, cScreen.y + 25)
    }

    // Draw searching animation
    if (isSearching) {
      const searchX = leftLimit + Math.random() * (rightLimit - leftLimit)
      const searchScreen = mathToScreen(searchX, currentFunc.f(searchX))
      
      // Search crystal
      ctx.fillStyle = "rgba(255, 215, 0, 0.6)"
      ctx.beginPath()
      ctx.arc(searchScreen.x, searchScreen.y, 8, 0, 2 * Math.PI)
      ctx.fill()
      
      // Search effect
      ctx.strokeStyle = "rgba(255, 215, 0, 0.4)"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(searchScreen.x, searchScreen.y, 15 + Math.random() * 10, 0, 2 * Math.PI)
      ctx.stroke()
    }

    // Draw labels
    ctx.fillStyle = "#333333"
    ctx.font = "12px Arial"
    ctx.textAlign = "center"
    
    // Function label
    ctx.fillText(currentFunc.name, mathToScreen(rightLimit - 0.5, currentFunc.f(rightLimit - 0.5)).x, 
                mathToScreen(rightLimit - 0.5, currentFunc.f(rightLimit - 0.5)).y - 15)

    // Interval labels
    ctx.fillStyle = "#666666"
    ctx.font = "10px Arial"
    ctx.fillText(`[${leftLimit.toFixed(1)}, ${rightLimit.toFixed(1)}]`, width / 2, height - 80)
  }, [leftLimit, rightLimit, selectedFunction, showMeanValue, showAreaComparison, foundC, isSearching, width, height])

  const handleFindC = async () => {
    setIsSearching(true)
    setFoundC(null)
    
    // Simulate search animation
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const c = findMeanValuePoint()
    setFoundC(c)
    setIsSearching(false)
  }

  const calculateAreaUnderCurve = () => {
    let area = 0
    const n = 1000
    const dx = (rightLimit - leftLimit) / n
    
    for (let i = 0; i < n; i++) {
      const x = leftLimit + i * dx
      area += currentFunc.f(x) * dx
    }
    
    return area
  }

  const calculateRectangleArea = () => {
    const meanVal = calculateMeanValue()
    return meanVal * (rightLimit - leftLimit)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-200 via-green-200 to-purple-400 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-purple-800 mb-2">🏰 La Torre del Valor Medio 💎</h1>
          <p className="text-purple-700 text-lg">
            Descubre el punto donde la función alcanza su valor promedio con el Hada Arquitecta
          </p>
          <div className="mt-3 p-3 bg-white/80 rounded-lg border border-purple-300 inline-block">
            <div className="text-sm text-purple-600 mb-1">Función Actual:</div>
            <div className="text-lg font-bold text-purple-800">{currentFunc.name}</div>
            <div className="text-sm text-purple-600">Intervalo: [{leftLimit.toFixed(1)}, {rightLimit.toFixed(1)}]</div>
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
                  className="w-full border-2 border-purple-300 rounded-lg"
                />
              </div>

              {/* Results Display */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-yellow-100 rounded-lg">
                  <div className="text-sm text-yellow-600">Valor Medio</div>
                  <div className="text-xl font-bold text-yellow-800">{calculateMeanValue().toFixed(4)}</div>
                  <div className="text-xs text-yellow-500 mt-1">Promedio en el intervalo</div>
                </div>
                <div className="text-center p-3 bg-purple-100 rounded-lg">
                  <div className="text-sm text-purple-600">Área Bajo Curva</div>
                  <div className="text-xl font-bold text-purple-800">{calculateAreaUnderCurve().toFixed(4)}</div>
                  <div className="text-xs text-purple-500 mt-1">∫[a,b] f(x) dx</div>
                </div>
                <div className="text-center p-3 bg-green-100 rounded-lg">
                  <div className="text-sm text-green-600">Área del Rectángulo</div>
                  <div className="text-xl font-bold text-green-800">{calculateRectangleArea().toFixed(4)}</div>
                  <div className="text-xs text-green-500 mt-1">Valor Medio × Ancho</div>
                </div>
              </div>

              {/* Theory Explanation */}
              <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-purple-50 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Teorema del Valor Medio para Integrales
                </h4>
                <div className="text-sm text-gray-700 space-y-2">
                  <p>
                    <strong>Teorema:</strong> Si f es continua en [a,b], existe un punto c ∈ (a,b) tal que:
                  </p>
                  <div className="bg-white p-2 rounded border font-mono text-center">
                    f(c) = (1/(b-a)) ∫[a,b] f(x) dx
                  </div>
                  <p>
                    Esto significa que hay un punto donde la función alcanza exactamente su valor promedio.
                  </p>
                  <p className="text-xs text-gray-600">
                    💡 La torre tiene alturas variables, pero existe una altura promedio que, 
                    si se mantuviera constante, daría la misma área total.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Controls Panel */}
          <div className="space-y-4">
            {/* Function Selection */}
            <Card className="p-4 bg-white/90 backdrop-blur">
              <h3 className="font-semibold mb-3 text-purple-800">Función de la Torre</h3>
              <div className="space-y-2">
                {Object.keys(functions).map((func) => (
                  <Button
                    key={func}
                    onClick={() => setSelectedFunction(func)}
                    variant={selectedFunction === func ? "default" : "outline"}
                    className="w-full justify-start"
                  >
                    {func === "quadratic" && "🏰 Parábola Mágica"}
                    {func === "sine" && "🌊 Onda Senoidal"}
                    {func === "cubic" && "🌿 Curva Cúbica"}
                  </Button>
                ))}
              </div>
            </Card>

            {/* Search Controls */}
            <Card className="p-4 bg-white/90 backdrop-blur">
              <h3 className="font-semibold mb-3 text-purple-800">Búsqueda Mágica</h3>
              <div className="space-y-3">
                <Button
                  onClick={handleFindC}
                  disabled={isSearching}
                  className="w-full"
                  variant={isSearching ? "secondary" : "default"}
                >
                  <Search className="w-4 h-4 mr-2" />
                  {isSearching ? "Buscando..." : "Encontrar Punto c"}
                </Button>
                
                {foundC !== null && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-sm text-green-700">
                      <strong>¡Encontrado!</strong>
                    </div>
                    <div className="text-xs text-green-600">
                      c = {foundC.toFixed(3)}
                    </div>
                    <div className="text-xs text-green-600">
                      f(c) = {currentFunc.f(foundC).toFixed(3)}
                    </div>
                  </div>
                )}

                <Button 
                  onClick={() => setFoundC(null)} 
                  variant="outline" 
                  className="w-full"
                  disabled={!foundC}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reiniciar Búsqueda
                </Button>
              </div>
            </Card>

            {/* Display Options */}
            <Card className="p-4 bg-white/90 backdrop-blur">
              <h3 className="font-semibold mb-3 text-purple-800">Visualización</h3>
              <div className="space-y-2">
                <Button
                  onClick={() => setShowMeanValue(!showMeanValue)}
                  variant={showMeanValue ? "default" : "outline"}
                  className="w-full justify-start"
                >
                  📊 {showMeanValue ? "Ocultar" : "Mostrar"} Valor Medio
                </Button>
                <Button
                  onClick={() => setShowAreaComparison(!showAreaComparison)}
                  variant={showAreaComparison ? "default" : "outline"}
                  className="w-full justify-start"
                >
                  🎯 {showAreaComparison ? "Ocultar" : "Mostrar"} Comparación de Áreas
                </Button>
              </div>
            </Card>

            {/* Limits Control */}
            <Card className="p-4 bg-white/90 backdrop-blur">
              <h3 className="font-semibold mb-3 text-purple-800">Límites de la Torre</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-purple-600">Límite Izquierdo</label>
                  <Slider
                    value={[leftLimit]}
                    onValueChange={(value) => setLeftLimit(value[0])}
                    min={-5}
                    max={0}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="text-center text-xs text-purple-500">a = {leftLimit.toFixed(1)}</div>
                </div>
                <div>
                  <label className="text-sm text-purple-600">Límite Derecho</label>
                  <Slider
                    value={[rightLimit]}
                    onValueChange={(value) => setRightLimit(value[0])}
                    min={1}
                    max={6}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="text-center text-xs text-purple-500">b = {rightLimit.toFixed(1)}</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}


