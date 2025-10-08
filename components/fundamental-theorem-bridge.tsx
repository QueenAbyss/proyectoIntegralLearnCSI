"use client"

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Sparkles, Wand2, Star, BookOpen, MousePointer, Play, Pause, RotateCcw } from "lucide-react"
import { TutorialSystem } from "./tutorial-system"
import { getTutorialSteps } from "./tutorial-configs"

// Funciones matemáticas recomendadas
const funciones = {
  cuadratica: {
    f: (x: number) => 0.5 * x * x - 2 * x + 3,
    nombre: "f(x) = 0.5x² - 2x + 3",
    dominio: [-2, 6]
  },
  cubica: {
    f: (x: number) => 0.1 * x * x * x - 0.5 * x * x + 2,
    nombre: "f(x) = 0.1x³ - 0.5x² + 2",
    dominio: [-3, 5]
  },
  seno: {
    f: (x: number) => 2 * Math.sin(x) + 3,
    nombre: "f(x) = 2sin(x) + 3",
    dominio: [0, 2 * Math.PI]
  },
  exponencial: {
    f: (x: number) => Math.exp(x * 0.3),
    nombre: "f(x) = e^(0.3x)",
    dominio: [-2, 4]
  },
  polinomio: {
    f: (x: number) => -0.1 * Math.pow(x - 2, 3) + 2 * (x - 2) + 4,
    nombre: "f(x) = -0.1(x-2)³ + 2(x-2) + 4",
    dominio: [-1, 5]
  }
}

export function FundamentalTheoremBridge() {
  const [currentView, setCurrentView] = useState<"theory" | "visualizations" | "examples">("theory")
  const [mode, setMode] = useState<"guided" | "free">("guided")
  const [complexityLevel, setComplexityLevel] = useState<"basic" | "advanced">("basic")
  
  // Estados del tutorial
  const [tutorialActive, setTutorialActive] = useState(false)
  const [tutorialStep, setTutorialStep] = useState(0)
  
  // Estados para las visualizaciones
  const [selectedFunction, setSelectedFunction] = useState<keyof typeof funciones>("cuadratica")
  const [leftLimit, setLeftLimit] = useState(-2)
  const [rightLimit, setRightLimit] = useState(4)
  const [currentX, setCurrentX] = useState(-2)
  const [isPlaying, setIsPlaying] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(0.02)
  
  // Referencias para canvas
  const bridgeCanvasRef = useRef<HTMLCanvasElement>(null)
  const graphCanvasRef = useRef<HTMLCanvasElement>(null)
  
  // Funciones del tutorial
  const startTutorial = useCallback(() => {
    setMode("guided")
    setTutorialActive(true)
    setTutorialStep(1)
    // Reset a valores por defecto para el tutorial
    setSelectedFunction("cuadratica")
    setLeftLimit(-1.6)
    setRightLimit(4.0)
    setCurrentX(-1.6)
    setIsPlaying(false)
  }, [])

  const completeTutorial = useCallback(() => {
    setTutorialActive(false)
    setTutorialStep(0)
    setMode("free")
  }, [])

  const handleTutorialStepChange = useCallback((step: number) => {
    setTutorialStep(step)
  }, [])

  // Función actual
  const currentFunc = funciones[selectedFunction]

  // Función para evaluar de forma segura
  const evaluarFuncionSegura = useCallback((f: (x: number) => number, x: number) => {
    try {
      const resultado = f(x)
      return isFinite(resultado) ? resultado : 0
    } catch (e) {
      console.error("Error evaluando función:", e)
      return 0
    }
  }, [])

  // Cálculo de la integral usando regla del trapecio
  const calcularIntegral = useCallback((f: (x: number) => number, a: number, x: number, numPasos = 1000) => {
    if (x <= a) return 0
    
    const h = (x - a) / numPasos
    let suma = 0
    
    for (let i = 0; i < numPasos; i++) {
      const t1 = a + i * h
      const t2 = a + (i + 1) * h
      const f1 = evaluarFuncionSegura(f, t1)
      const f2 = evaluarFuncionSegura(f, t2)
      suma += (f1 + f2) / 2 * h
    }
    
    return suma
  }, [evaluarFuncionSegura])

  // Valores calculados
  const fValue = useMemo(() => evaluarFuncionSegura(currentFunc.f, currentX), [currentFunc.f, currentX, evaluarFuncionSegura])
  const integralValue = useMemo(() => calcularIntegral(currentFunc.f, leftLimit, currentX), [currentFunc.f, leftLimit, currentX, calcularIntegral])

  // Función para dibujar el puente mágico (como en la primera imagen)
  const drawBridge = useCallback(() => {
    const canvas = bridgeCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Limpiar canvas
    ctx.clearRect(0, 0, width, height)

    // Fondo mágico degradado rosa a morado
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, "#FFB6C1") // Rosa claro
    gradient.addColorStop(1, "#DDA0DD") // Morado claro
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Sistema de coordenadas para el puente
    const marginLeft = 80
    const marginRight = 80
    const marginTop = 60
    const marginBottom = 120
    const graphWidth = width - marginLeft - marginRight
    const graphHeight = height - marginTop - marginBottom

    // Función de transformación de coordenadas
    const mathToScreen = (mathX: number, mathY: number) => {
      const screenX = marginLeft + ((mathX - leftLimit) / (rightLimit - leftLimit)) * graphWidth
      const screenY = height - marginBottom - mathY * (graphHeight / 8) // Escala Y ajustada
      return { x: screenX, y: screenY }
    }

    // Dibujar la función f(x) como puente (curva marrón)
    ctx.strokeStyle = "#8B4513" // Marrón oscuro
    ctx.lineWidth = 6
    ctx.beginPath()

    for (let x = leftLimit; x <= rightLimit; x += 0.1) {
      const y = evaluarFuncionSegura(currentFunc.f, x)
      const screenCoords = mathToScreen(x, y)
      if (Math.abs(x - leftLimit) < 0.01) {
        ctx.moveTo(screenCoords.x, screenCoords.y)
      } else {
        ctx.lineTo(screenCoords.x, screenCoords.y)
      }
    }
    ctx.stroke()

    // Dibujar segmentos del puente (vigas de soporte)
    ctx.strokeStyle = "#8B4513"
    ctx.lineWidth = 3
    for (let x = leftLimit; x <= rightLimit; x += 0.3) {
      const y = evaluarFuncionSegura(currentFunc.f, x)
      const screenCoords = mathToScreen(x, y)
      ctx.beginPath()
      ctx.moveTo(screenCoords.x, screenCoords.y)
      ctx.lineTo(screenCoords.x, screenCoords.y + 15)
      ctx.stroke()
    }

    // Dibujar área acumulada (integral) en dorado
    if (currentX > leftLimit) {
      ctx.fillStyle = "rgba(255, 215, 0, 0.4)" // Dorado transparente
      ctx.beginPath()
      ctx.moveTo(mathToScreen(leftLimit, 0).x, mathToScreen(leftLimit, 0).y)
      
      for (let x = leftLimit; x <= currentX; x += 0.1) {
        const y = evaluarFuncionSegura(currentFunc.f, x)
        const screenCoords = mathToScreen(x, y)
        ctx.lineTo(screenCoords.x, screenCoords.y)
      }
      
      ctx.lineTo(mathToScreen(currentX, 0).x, mathToScreen(currentX, 0).y)
      ctx.closePath()
      ctx.fill()
    }

    // Punto de inicio (a) - círculo morado con destellos
    const startPos = mathToScreen(leftLimit, evaluarFuncionSegura(currentFunc.f, leftLimit))
    ctx.fillStyle = "#8A2BE2" // Morado
    ctx.beginPath()
    ctx.arc(startPos.x, startPos.y, 12, 0, 2 * Math.PI)
    ctx.fill()

    // Destellos alrededor del punto de inicio
    ctx.fillStyle = "#FFFFFF"
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8
      const sparkleX = startPos.x + Math.cos(angle) * 20
      const sparkleY = startPos.y + Math.sin(angle) * 20
      ctx.beginPath()
      ctx.arc(sparkleX, sparkleY, 3, 0, 2 * Math.PI)
      ctx.fill()
    }

    // Punto final (b) - círculo azul
    const endPos = mathToScreen(rightLimit, evaluarFuncionSegura(currentFunc.f, rightLimit))
    ctx.fillStyle = "#4169E1" // Azul
    ctx.beginPath()
    ctx.arc(endPos.x, endPos.y, 12, 0, 2 * Math.PI)
    ctx.fill()

    // Hada en posición actual (si no está en el inicio)
    if (currentX > leftLimit) {
      const fairyPos = mathToScreen(currentX, fValue)
      
      // Cuerpo del hada (dorado)
      ctx.fillStyle = "#FFD700"
      ctx.beginPath()
      ctx.arc(fairyPos.x, fairyPos.y - 8, 10, 0, 2 * Math.PI)
      ctx.fill()

      // Alas del hada (blancas)
      ctx.fillStyle = "#FFFFFF"
      ctx.beginPath()
      ctx.ellipse(fairyPos.x - 12, fairyPos.y - 10, 8, 12, -0.3, 0, 2 * Math.PI)
      ctx.ellipse(fairyPos.x + 12, fairyPos.y - 10, 8, 12, 0.3, 0, 2 * Math.PI)
      ctx.fill()

      // Efecto de brillo
      ctx.fillStyle = "rgba(255, 255, 0, 0.3)"
      ctx.beginPath()
      ctx.arc(fairyPos.x, fairyPos.y - 8, 18, 0, 2 * Math.PI)
      ctx.fill()
    }

    // Título "El Puente del Hada Matemática"
    ctx.fillStyle = "#000000"
    ctx.font = "bold 18px Arial"
    ctx.textAlign = "left"
    ctx.fillText("✨ El Puente del Hada Matemática", 20, 30)

    // Área acumulada
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(width - 150, 20, 120, 40)
    ctx.strokeStyle = "#CCCCCC"
    ctx.lineWidth = 1
    ctx.strokeRect(width - 150, 20, 120, 40)
    
    ctx.fillStyle = "#666666"
    ctx.font = "12px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Área Acumulada", width - 90, 35)
    ctx.fillText(integralValue.toFixed(4), width - 90, 50)

    // Leyenda
    ctx.fillStyle = "#000000"
    ctx.font = "12px Arial"
    ctx.textAlign = "left"
    
    // Inicio (a)
    ctx.fillStyle = "#000000"
    ctx.beginPath()
    ctx.arc(20, height - 80, 6, 0, 2 * Math.PI)
    ctx.fill()
    ctx.fillText("Inicio (a)", 35, height - 75)

    // Hada en posición x
    ctx.fillStyle = "#8A2BE2"
    ctx.beginPath()
    ctx.arc(20, height - 60, 6, 0, 2 * Math.PI)
    ctx.fill()
    ctx.fillText("Hada en posición x", 35, height - 55)

    // Final (b)
    ctx.fillStyle = "#FFFFFF"
    ctx.beginPath()
    ctx.arc(20, height - 40, 6, 0, 2 * Math.PI)
    ctx.fill()
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.fillText("Final (b)", 35, height - 35)

    // Texto explicativo
    ctx.fillStyle = "#333333"
    ctx.font = "14px Arial"
    ctx.textAlign = "left"
    ctx.fillText("El hada cruza el puente acumulando el área bajo la curva.", 20, height - 15)
    ctx.font = "bold 14px Arial"
    ctx.fillText("¡Cada paso suma magia matemática!", 20, height - 2)
  }, [currentFunc, leftLimit, rightLimit, currentX, fValue, integralValue, evaluarFuncionSegura])

  // Función para dibujar la gráfica cartesiana (como en la segunda imagen)
  const drawGraph = useCallback(() => {
    const canvas = graphCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Limpiar canvas
    ctx.clearRect(0, 0, width, height)

    // Fondo blanco
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(0, 0, width, height)

    // Sistema de coordenadas
    const marginLeft = 80
    const marginRight = 40
    const marginTop = 40
    const marginBottom = 80
    const graphWidth = width - marginLeft - marginRight
    const graphHeight = height - marginTop - marginBottom

    // Calcular rango Y dinámicamente
    let minY = Infinity
    let maxY = -Infinity
    for (let x = leftLimit; x <= rightLimit; x += 0.1) {
      const y = evaluarFuncionSegura(currentFunc.f, x)
      if (isFinite(y)) {
        minY = Math.min(minY, y)
        maxY = Math.max(maxY, y)
      }
    }
    const yRange = maxY - minY
    const yMargin = yRange * 0.1
    minY -= yMargin
    maxY += yMargin

    // Función de transformación
    const mathToScreen = (mathX: number, mathY: number) => {
      const screenX = marginLeft + ((mathX - leftLimit) / (rightLimit - leftLimit)) * graphWidth
      const screenY = height - marginBottom - ((mathY - minY) / (maxY - minY)) * graphHeight
      return { x: screenX, y: screenY }
    }

    // Dibujar grid sutil
    ctx.strokeStyle = "#F0F0F0"
    ctx.lineWidth = 1
    for (let i = 0; i <= 10; i++) {
      const x = marginLeft + (i / 10) * graphWidth
      const y = marginTop + (i / 10) * graphHeight
      
      ctx.beginPath()
      ctx.moveTo(x, marginTop)
      ctx.lineTo(x, height - marginBottom)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(marginLeft, y)
      ctx.lineTo(width - marginRight, y)
      ctx.stroke()
    }

    // Dibujar ejes principales
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(marginLeft, marginTop)
    ctx.lineTo(marginLeft, height - marginBottom)
    ctx.moveTo(marginLeft, height - marginBottom)
    ctx.lineTo(width - marginRight, height - marginBottom)
    ctx.stroke()

    // Dibujar números en el eje X
    ctx.fillStyle = "#000000"
    ctx.font = "12px Arial"
    ctx.textAlign = "center"
    for (let i = Math.ceil(leftLimit); i <= Math.floor(rightLimit); i++) {
      const screenX = mathToScreen(i, 0).x
      ctx.fillText(i.toString(), screenX, height - marginBottom + 20)
    }

    // Dibujar números en el eje Y
    ctx.textAlign = "right"
    const yStep = Math.ceil((maxY - minY) / 10)
    for (let i = Math.ceil(minY); i <= Math.floor(maxY); i += yStep) {
      const screenY = mathToScreen(0, i).y
      ctx.fillText(i.toString(), marginLeft - 10, screenY + 4)
    }

    // Dibujar la función f(x) en MORADO
    ctx.strokeStyle = "#8A2BE2" // Morado
      ctx.lineWidth = 3
      ctx.beginPath()

    for (let x = leftLimit; x <= rightLimit; x += 0.05) {
      const y = evaluarFuncionSegura(currentFunc.f, x)
      const screenCoords = mathToScreen(x, y)
        if (x === leftLimit) {
          ctx.moveTo(screenCoords.x, screenCoords.y)
        } else {
          ctx.lineTo(screenCoords.x, screenCoords.y)
        }
      }
      ctx.stroke()

    // Dibujar área bajo la curva en AZUL CLARO
    if (currentX > leftLimit) {
      ctx.fillStyle = "rgba(135, 206, 250, 0.5)" // Azul claro más visible
      ctx.beginPath()
      
      // Empezar desde el eje X (y=0) en leftLimit
      const startX = mathToScreen(leftLimit, 0)
      ctx.moveTo(startX.x, startX.y)
      
      // Seguir la curva desde leftLimit hasta currentX
      for (let x = leftLimit; x <= currentX; x += 0.1) {
        const y = evaluarFuncionSegura(currentFunc.f, x)
        // LIMITAR: No permitir que el área vaya por debajo del eje X
        const clampedY = Math.max(0, y)
        const screenCoords = mathToScreen(x, clampedY)
        ctx.lineTo(screenCoords.x, screenCoords.y)
      }
      
      // Cerrar el área: bajar al eje X en currentX, luego volver al inicio
      const endX = mathToScreen(currentX, 0)
      ctx.lineTo(endX.x, endX.y)
      ctx.lineTo(startX.x, startX.y)
      ctx.closePath()
    ctx.fill()

      // Dibujar borde del área para mayor visibilidad
      ctx.strokeStyle = "rgba(135, 206, 250, 0.8)"
      ctx.lineWidth = 2
      ctx.stroke()
    }

    // Línea vertical indicadora ROSA
    const indicatorPos = mathToScreen(currentX, 0)
    ctx.strokeStyle = "#FF69B4" // Rosa
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(indicatorPos.x, marginTop)
    ctx.lineTo(indicatorPos.x, height - marginBottom)
    ctx.stroke()

    // Punto en la función ROSA
    const pointPos = mathToScreen(currentX, fValue)
    ctx.fillStyle = "#FF69B4" // Rosa
    ctx.beginPath()
    ctx.arc(pointPos.x, pointPos.y, 5, 0, 2 * Math.PI)
    ctx.fill()

    // Símbolo 'x' ROSA en la parte superior
    ctx.fillStyle = "#FF69B4"
    ctx.font = "bold 16px Arial"
    ctx.textAlign = "center"
    ctx.fillText("x", indicatorPos.x, marginTop - 10)

    // Etiqueta f(x) dinámica
    ctx.fillStyle = "#000000"
    ctx.font = "12px Arial"
    ctx.textAlign = "left"
    const labelX = pointPos.x + 10
    const labelY = pointPos.y - 10
    ctx.fillText(`f(${currentX.toFixed(2)}) = ${fValue.toFixed(2)}`, labelX, labelY)

    // Línea vertical azul para límite 'b'
    const bPos = mathToScreen(rightLimit, 0)
    ctx.strokeStyle = "#4169E1" // Azul
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5]) // Línea punteada
      ctx.beginPath()
    ctx.moveTo(bPos.x, marginTop)
    ctx.lineTo(bPos.x, height - marginBottom)
      ctx.stroke()
    ctx.setLineDash([]) // Resetear línea sólida

    // Etiqueta 'b' azul
    ctx.fillStyle = "#4169E1"
    ctx.font = "bold 14px Arial"
    ctx.textAlign = "center"
    ctx.fillText("b", bPos.x, marginTop - 10)

    // Etiquetas de ejes
    ctx.fillStyle = "#000000"
    ctx.font = "14px Arial"
    ctx.textAlign = "center"
    ctx.fillText("x", width - 20, height - marginBottom + 30)
    ctx.textAlign = "center"
    ctx.save()
    ctx.translate(30, height / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText("f(x)", 0, 0)
    ctx.restore()

    // Recuadro "Haz clic para mover x"
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(width - 180, 20, 160, 30)
    ctx.strokeStyle = "#CCCCCC"
    ctx.lineWidth = 1
    ctx.strokeRect(width - 180, 20, 160, 30)
    ctx.fillStyle = "#666666"
    ctx.font = "12px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Haz clic para mover x", width - 100, 40)
  }, [currentFunc, leftLimit, rightLimit, currentX, fValue, integralValue, evaluarFuncionSegura])

  // Efecto de animación
  useEffect(() => {
    if (!isPlaying) return

    const animate = () => {
      setCurrentX(prev => {
        const next = prev + animationSpeed
        if (next >= rightLimit) {
          setIsPlaying(false)
          return leftLimit
        }
        return next
      })
    }

    const interval = setInterval(animate, 50)
    return () => clearInterval(interval)
  }, [isPlaying, animationSpeed, leftLimit, rightLimit])

  // Redibujar cuando cambien los valores
  useEffect(() => {
    drawBridge()
  }, [drawBridge])

  useEffect(() => {
    drawGraph()
  }, [drawGraph])

  // Componente de visualizaciones
  const VisualizationsContent = () => (
    <div className="p-6">
      <div className="space-y-8">
        {/* Controles de Modo y Tutorial */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2">
          <Button
            onClick={() => setMode("guided")}
            variant={mode === "guided" ? "default" : "outline"}
            className="flex items-center gap-2"
          >
              <Sparkles className="w-4 h-4" />
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

        {mode === "guided" && (
            <div className="flex gap-2">
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

          <Button 
            onClick={startTutorial} 
            variant="secondary"
            className="flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            Iniciar Tutorial
          </Button>
        </div>

        {/* Controles */}
        <Card className="p-6 bg-white/95 backdrop-blur border border-purple-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Selector de función */}
            <div>
              <label className="block text-sm font-medium text-purple-800 mb-2">
                🌟 Función Mágica
              </label>
              <select
                value={selectedFunction}
                onChange={(e) => {
                  setSelectedFunction(e.target.value as keyof typeof funciones)
                  const func = funciones[e.target.value as keyof typeof funciones]
                  setLeftLimit(func.dominio[0])
                  setRightLimit(func.dominio[1])
                  setCurrentX(func.dominio[0])
                }}
                className="w-full p-2 border border-purple-300 rounded-lg bg-white"
              >
                {Object.entries(funciones).map(([key, func]) => (
                  <option key={key} value={key}>
                    {func.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Límite inferior */}
            <div>
              <label className="block text-sm font-medium text-purple-800 mb-2">
                Límite a: {leftLimit.toFixed(1)}
              </label>
              <Slider
                value={[leftLimit]}
                onValueChange={([value]) => {
                  if (value < rightLimit) {
                    setLeftLimit(value)
                    if (currentX < value) setCurrentX(value)
                  }
                }}
                min={currentFunc.dominio[0]}
                max={rightLimit - 0.1}
                step={0.1}
                className="w-full cursor-pointer"
                disabled={false}
                />
              </div>

            {/* Límite superior */}
            <div>
              <label className="block text-sm font-medium text-purple-800 mb-2">
                Límite b: {rightLimit.toFixed(1)}
              </label>
              <Slider
                value={[rightLimit]}
                onValueChange={([value]) => {
                  if (value > leftLimit) {
                    setRightLimit(value)
                    if (currentX > value) setCurrentX(value)
                  }
                }}
                min={leftLimit + 0.1}
                max={currentFunc.dominio[1]}
                step={0.1}
                className="w-full cursor-pointer"
                disabled={false}
              />
                </div>

            {/* Posición actual x */}
            <div>
              <label className="block text-sm font-medium text-purple-800 mb-2">
                Posición x: {currentX.toFixed(2)}
              </label>
              <Slider
                value={[currentX]}
                onValueChange={([value]) => {
                  const clampedValue = Math.max(leftLimit, Math.min(rightLimit, value))
                  setCurrentX(clampedValue)
                }}
                min={leftLimit}
                max={rightLimit}
                step={0.01}
                className="w-full cursor-pointer"
                disabled={false}
              />
              </div>

            {/* Controles de animación */}
            <div>
              <label className="block text-sm font-medium text-purple-800 mb-2">
                🎬 Animación
              </label>
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsPlaying(!isPlaying)}
                  variant={isPlaying ? "destructive" : "default"}
                  size="sm"
                  className="flex-1"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlaying ? "Pausar" : "Reproducir"}
                </Button>
                <Button
                  onClick={() => {
                    setIsPlaying(false)
                    setCurrentX(leftLimit)
                  }}
                  variant="outline"
                  size="sm"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                  </div>
                </div>
              </div>
            </Card>

        {/* Primera visualización: Puente Mágico */}
        <Card className="p-6 bg-white/95 backdrop-blur border border-purple-200">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-purple-800 flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-600" />
              Puente Mágico del Hada
              <Sparkles className="w-6 h-6 text-purple-600" />
            </h3>
            <p className="text-sm text-purple-600 mt-1">
              Observa cómo el hada viaja por el puente y acumula área dorada
            </p>
          </div>

          <div className="bg-gradient-to-b from-sky-200 to-blue-300 rounded-lg p-4">
            <canvas
              ref={bridgeCanvasRef}
              width={800}
              height={400}
              className="w-full h-auto border border-purple-300 rounded-lg bg-white/80"
            />
              </div>
            </Card>

        {/* Segunda visualización: Gráfica Cartesiana */}
        <Card className="p-6 bg-white/95 backdrop-blur border border-purple-200">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-purple-800 flex items-center justify-center gap-2">
              <Wand2 className="w-6 h-6 text-blue-600" />
              Gráfica Interactiva
              <Wand2 className="w-6 h-6 text-blue-600" />
            </h3>
            <p className="text-sm text-purple-600 mt-1">
              Explora cómo cambia F(x) al mover el cursor sobre la función
            </p>
                </div>

          <div className="bg-gray-50 rounded-lg p-4">
                <canvas
              ref={graphCanvasRef}
              width={800}
              height={400}
              className="w-full h-auto border border-gray-300 rounded-lg bg-white"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const x = e.clientX - rect.left
                const mathX = leftLimit + (x / rect.width) * (rightLimit - leftLimit)
                const clampedX = Math.max(leftLimit, Math.min(rightLimit, mathX))
                setCurrentX(clampedX)
              }}
            />
              </div>
            </Card>

        {/* Panel de información */}
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-800">
                x = {currentX.toFixed(2)}
              </div>
              <div className="text-sm text-purple-600">Posición actual</div>
                </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-800">
                f(x) = {fValue.toFixed(2)}
                </div>
              <div className="text-sm text-blue-600">Valor de la función</div>
                </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-800">
                F(x) = {integralValue.toFixed(2)}
              </div>
              <div className="text-sm text-green-600">Área acumulada</div>
            </div>
              </div>
            </Card>

        {/* Explicación del teorema */}
        <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200">
          <h4 className="font-bold text-yellow-800 mb-3 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-600" />
            El Primer Teorema Fundamental del Cálculo
                </h4>
          <p className="text-yellow-700 text-sm mb-3">
            Si F(x) = ∫[a,x] f(t)dt, entonces F'(x) = f(x)
          </p>
          <p className="text-gray-700 text-sm">
            Esto significa que la derivada de la integral es la función original. 
            Mueve el cursor o reproduce la animación para ver cómo cambia el área acumulada F(x) 
            y observa que su pendiente en cualquier punto es exactamente f(x).
          </p>
        </Card>
                </div>
              </div>
  )

  const TheoryContent = () => (
    <div className="p-6">

      {/* Main Theory Content */}
      <Card className="p-6 bg-white/95 backdrop-blur border border-purple-200">
        <div className="space-y-6">
          {/* Section Header */}
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-lg border border-purple-300">
            <h3 className="text-xl font-bold text-purple-800 flex items-center gap-2">
              <Wand2 className="w-5 h-5" />
              El Primer Teorema Fundamental del Cálculo
            </h3>
          </div>

          {/* Introduction */}
              <div className="space-y-4">
            <p className="text-gray-700 text-lg leading-relaxed">
              Si <span className="font-semibold text-purple-700">f</span> es una función continua en el intervalo 
              <span className="font-semibold text-blue-700"> [a, b]</span> y definimos:
            </p>

            {/* First Equation */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border-2 border-blue-200 shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-800 mb-2">
                  F(x) = ∫<sub>a</sub><sup>x</sup> f(t) dt
                </div>
                <div className="text-sm text-gray-600">
                  La función F(x) representa el área acumulada bajo la curva f(t) desde a hasta x
                </div>
              </div>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed">
              Entonces es diferenciable en <span className="font-semibold text-green-700">(a, b)</span> y:
            </p>

            {/* Second Equation - Clear and Bold */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border-2 border-green-300 shadow-lg">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-800 mb-2">
                  F'(x) = f(x)
                </div>
                <div className="text-sm text-gray-600">
                  La derivada de la integral es la función original
                </div>
              </div>
            </div>

            {/* Explanation */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-300">
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-orange-800">Esto significa que la derivada de la integral es la función original.</strong> 
                En el puente mágico, cada paso que das (cambio en x) te muestra cómo el área acumulada cambia 
                exactamente según el valor de la función en ese punto.
              </p>
                </div>

            {/* Fairy Theme Explanation */}
            <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 p-6 rounded-lg border border-pink-300">
              <h4 className="text-lg font-bold text-purple-800 mb-3 flex items-center gap-2">
                <Star className="w-5 h-5" />
                🧚‍♀️ La Magia del Puente Mágico
              </h4>
              <div className="space-y-3 text-gray-700">
                <p>
                  <strong>Imagina que eres un hada constructora:</strong>
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">🌉</span>
                    <span><strong>f(x)</strong> es la altura del puente en cada punto x</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">📏</span>
                    <span><strong>F(x)</strong> es el área total de madera que has usado hasta el punto x</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">⚡</span>
                    <span><strong>F'(x)</strong> es qué tan rápido estás construyendo en el punto x</span>
                  </li>
                </ul>
                <p className="text-center font-semibold text-purple-700 mt-4">
                  ✨ ¡La magia es que tu velocidad de construcción es igual a la altura del puente! ✨
                </p>
              </div>
                </div>
                </div>
              </div>
            </Card>
          </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-pink-50 to-blue-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold text-purple-800">Puente Mágico del Cálculo</h1>
            <Sparkles className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-2xl font-semibold text-purple-700">
            Primer Teorema Fundamental del Cálculo
          </h2>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-6">
          <div className="bg-white/80 backdrop-blur rounded-lg p-1 border border-purple-200 shadow-lg">
            <div className="flex gap-1">
              <Button
                onClick={() => setCurrentView("theory")}
                variant={currentView === "theory" ? "default" : "ghost"}
                className={`flex items-center gap-2 px-6 py-3 ${
                  currentView === "theory" 
                    ? "bg-purple-600 text-white shadow-md" 
                    : "text-purple-700 hover:bg-purple-50"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Teoría
              </Button>
                <Button
                onClick={() => setCurrentView("visualizations")}
                variant={currentView === "visualizations" ? "default" : "ghost"}
                className={`flex items-center gap-2 px-6 py-3 ${
                  currentView === "visualizations" 
                    ? "bg-purple-600 text-white shadow-md" 
                    : "text-purple-700 hover:bg-purple-50"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Visualizaciones
                </Button>
                <Button
                onClick={() => setCurrentView("examples")}
                variant={currentView === "examples" ? "default" : "ghost"}
                className={`flex items-center gap-2 px-6 py-3 ${
                  currentView === "examples" 
                    ? "bg-purple-600 text-white shadow-md" 
                    : "text-purple-700 hover:bg-purple-50"
                }`}
              >
                <Wand2 className="w-4 h-4" />
                Ejemplos
                </Button>
              </div>
          </div>
        </div>


                {/* Content based on current view */}
                {currentView === "theory" && <TheoryContent />}
                {currentView === "visualizations" && <VisualizationsContent />}
                {currentView === "examples" && (
                  <div className="p-6 text-center">
                    <h3 className="text-2xl font-bold text-purple-800 mb-4">
                      📚 Ejemplos Prácticos
                    </h3>
                    <p className="text-gray-600">
                      Los ejemplos prácticos estarán disponibles próximamente...
                    </p>
                  </div>
                )}

        {/* Sistema de Tutoriales */}
        <TutorialSystem
          steps={getTutorialSteps('bridge', complexityLevel)}
          currentStep={tutorialStep}
          onStepChange={handleTutorialStepChange}
          onComplete={completeTutorial}
          isVisible={tutorialActive}
          leftLimit={[leftLimit]}
          rightLimit={[rightLimit]}
          currentFunction={selectedFunction}
          isAnimating={isPlaying}
        />

        {/* Exit Button */}
        <div className="fixed bottom-6 left-6">
          <Button
            onClick={() => window.history.back()}
            className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
          >
            Salir
          </Button>
        </div>
      </div>
    </div>
  )
}