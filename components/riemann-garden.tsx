"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, BookOpen, MousePointer, Hand, ChevronDown, ChevronUp } from "lucide-react"
import { TutorialSystem, type TutorialStep } from "@/components/tutorial-system"
import { DraggableCanvas } from "@/components/draggable-canvas"
import { ErrorVerification } from "@/components/error-verification"
import { IntegralProperties } from "@/components/integral-properties"
import { TheorySection } from "@/components/theory-section"
import { RiemannNavigation } from "@/components/riemann-navigation"
import { RiemannExamples } from "@/components/riemann-examples"
import { LinearityDemo } from "@/components/linearity-demo"
import { AdditivityDemo } from "@/components/additivity-demo"
import { ReverseLimitsDemo } from "@/components/reverse-limits-demo"
import { ComparisonDemo } from "@/components/comparison-demo"

// Mathematical functions for the garden
const functions = {
  quadratic: (x: number) => 0.5 * x * x + 1,
  sine: (x: number) => 2 * Math.sin(x) + 3,
  cubic: (x: number) => 0.1 * x * x * x + 0.5 * x * x + 2,
}

type FunctionType = keyof typeof functions

// Pasos del tutorial básico
const TUTORIAL_STEPS_BASIC: TutorialStep[] = [
  {
    id: 1,
    title: "¡Bienvenida al Jardín Mágico!",
    description:
      "Soy Aria, el hada jardinera. Te ayudaré a entender las integrales de Riemann plantando macetas mágicas en nuestro jardín encantado.",
    target: "fairy",
    position: { x: 50, y: 20 },
    fairyMessage:
      "¡Hola! Estoy muy emocionada de enseñarte sobre las integrales. ¿Estás listo para esta aventura mágica?",
    hint: "💡 Las integrales de Riemann son una forma de calcular el área bajo una curva dividiéndola en pequeños rectángulos. ¡Es como contar cuadraditos en papel cuadriculado, pero de forma más precisa!",
    isObservationOnly: true,
  },
  {
    id: 2,
    title: "La Cerca Mágica",
    description:
      "Esta cerca ondulada representa nuestra función f(x). Necesitamos calcular cuánta tierra mágica hay debajo de ella para plantar nuestras flores.",
    target: "canvas",
    position: { x: 400, y: 150 },
    action: "Observa cómo la curva morada forma la cerca de nuestro jardín",
    fairyMessage: "Esta cerca cambia de altura. Nuestra misión es encontrar el área total debajo de ella.",
    hint: "🔍 La función f(x) = 0.5x² + 1 es una parábola que siempre es positiva. Su forma crea un área específica entre los límites que podemos calcular exactamente, pero las integrales de Riemann nos permiten aproximarla usando rectángulos.",
    isObservationOnly: true,
  },
  {
    id: 3,
    title: "Macetas de Aproximación",
    description:
      "Estas macetas coloridas representan los rectángulos de Riemann. Cada maceta nos ayuda a aproximar el área bajo la cerca. ¡Más macetas significan mejor aproximación!",
    target: "canvas",
    position: { x: 300, y: 300 },
    action: "Observa cómo las macetas se ajustan bajo la cerca",
    fairyMessage: "Cada maceta tiene una altura específica. Juntas, nos dan una idea del área total.",
    hint: "📐 Cada rectángulo tiene un ancho fijo (Δx = (b-a)/n) y una altura determinada por el valor de la función en un punto específico. La suma de todas las áreas rectangulares nos da la aproximación: Σf(xi)·Δx",
    isObservationOnly: true,
  },
  {
    id: 4,
    title: "Cristal de Particiones",
    description:
      "Este cristal mágico controla cuántas macetas plantamos. Muévelo para ver cómo más macetas nos dan una aproximación más precisa del área real.",
    target: "#partitions-slider",
    position: { x: 150, y: 500 },
    action: "Mueve el deslizador para cambiar el número de macetas",
    fairyMessage: "¡Experimenta! Verás que más macetas pequeñas aproximan mejor el área verdadera.",
    hint: "🎯 Prueba estos valores para ver la mejora: 8 macetas (error ~0.5), 16 macetas (error ~0.25), 32 macetas (error ~0.12). ¡Nota cómo el error se reduce aproximadamente a la mitad cada vez que duplicas las particiones!",
    requirement: (partitions: number[]) => {
      console.log("[v0] Checking partitions requirement:", partitions)
      const hasChanged = partitions && partitions[0] !== 8
      console.log("[v0] Requirement result:", hasChanged)
      return hasChanged
    },
  },
  {
    id: 5,
    title: "Cristales de Límites Mágicos",
    description:
      "Estos cristales rojos y azules marcan dónde empieza y termina nuestro jardín. En el modo libre, podrás arrastrarlos directamente en el gráfico.",
    target: "#limits",
    position: { x: 500, y: 400 },
    action: "Ajusta los límites izquierdo y derecho del jardín",
    fairyMessage: "Los límites de integración definen exactamente qué parte del jardín estamos midiendo.",
    hint: "📏 Los límites de integración [a,b] definen el intervalo donde calculamos el área. Si cambias de [-2,4] a [-1,3], estás calculando ∫₋₁³ f(x)dx en lugar de ∫₋₂⁴ f(x)dx. ¡Prueba [-1,2] para ver un área más pequeña!",
    requirement: (leftLimit: number[], rightLimit: number[]) => {
      console.log("[v0] Checking limits requirement:", leftLimit, rightLimit)
      return leftLimit && rightLimit && (leftLimit[0] !== -2 || rightLimit[0] !== 4)
    },
  },
  {
    id: 6,
    title: "Tipos de Hechizo",
    description:
      "Podemos usar diferentes hechizos para determinar la altura de cada maceta: por la izquierda, derecha, o centro de cada sección.",
    target: "#approximation-type",
    position: { x: 600, y: 300 },
    action: "Prueba los diferentes tipos de aproximación",
    fairyMessage: "Cada hechizo da un resultado ligeramente diferente. ¡El del centro suele ser el más preciso!",
    hint: "⚖️ Método Izquierdo: usa f(xi) donde xi es el extremo izquierdo. Método Derecho: usa f(xi+1). Método Centro: usa f((xi+xi+1)/2). Para funciones cóncavas hacia arriba como nuestra parábola, el método del centro es más preciso porque compensa mejor la curvatura.",
    isObservationOnly: true,
  },
  {
    id: 7,
    title: "¡Felicidades, Aprendiz!",
    description:
      "Has completado el tutorial básico. Ahora puedes explorar libremente el jardín mágico y experimentar con todas las herramientas. ¡En el modo libre podrás arrastrar elementos directamente!",
    target: "completion",
    position: { x: 300, y: 200 },
    fairyMessage:
      "¡Excelente trabajo! Ahora eres oficialmente mi aprendiz de jardinería mágica. ¡Ve y experimenta arrastrando los elementos!",
    hint: "🌟 ¡Ahora eres un experto en integrales de Riemann! En el modo libre puedes: arrastrar los límites directamente en el gráfico, probar diferentes funciones (seno, cúbica), y ver cómo el error disminuye con más particiones. ¡La integral exacta es tu objetivo!",
    isObservationOnly: true,
  },
]

// Pasos del tutorial avanzado
const TUTORIAL_STEPS_ADVANCED: TutorialStep[] = [
  {
    id: 1,
    title: "¡Bienvenida al Nivel Avanzado!",
    description:
      "Soy Aria, tu hada guía. Ahora exploraremos las sumas de Riemann con más profundidad: convergencia, precisión y diferentes funciones.",
    target: "fairy",
    position: { x: 50, y: 20 },
    fairyMessage:
      "¡Excelente! Ahora que dominas lo básico, profundicemos en la magia de las sumas de Riemann. ¡Prepárate para experimentar más!",
    hint: "🌟 ¡Nivel avanzado activado! Aquí explorarás la convergencia de las sumas de Riemann, análisis de error, y experimentarás con diferentes funciones. ¡Matemáticas de nivel superior!",
    isObservationOnly: true,
  },
  {
    id: 2,
    title: "Convergencia Mágica",
    description:
      "Observa cómo las sumas de Riemann convergen al valor exacto cuando aumentas las particiones. ¡Es la magia de las matemáticas!",
    target: "canvas",
    position: { x: 400, y: 150 },
    action: "Observa la convergencia de las sumas",
    fairyMessage: "¡Mira cómo las sumas se acercan al valor exacto! ¡Es la convergencia en acción!",
    hint: "📈 La convergencia significa que cuando n → ∞, la suma de Riemann → valor exacto. ¡Es el fundamento del cálculo integral!",
    isObservationOnly: true,
  },
  {
    id: 3,
    title: "Desliza hacia la Precisión",
    description:
      "Desliza el control de particiones hasta 40 para ver una aproximación muy precisa. ¡Observa cómo el error disminuye dramáticamente!",
    target: "#partitions-slider",
    position: { x: 150, y: 500 },
    action: "Desliza hasta 40 particiones",
    fairyMessage: "¡40 particiones! ¡Observa cómo el error se vuelve casi imperceptible!",
    hint: "🎯 Con 40 particiones, el error debería ser menor a 0.1. ¡La precisión aumenta cuadráticamente con el número de particiones!",
    requirement: (partitions: number[]) => {
      console.log("[v0] Advanced: Checking partitions requirement:", partitions)
      const hasReached40 = partitions && partitions[0] >= 40
      console.log("[v0] Advanced: Requirement result:", hasReached40)
      return hasReached40
    },
  },
  {
    id: 4,
    title: "Explora Diferentes Funciones",
    description:
      "Cambia la función a 'Onda Senoidal' para ver cómo las sumas de Riemann se adaptan a diferentes formas. ¡Cada función tiene su propia magia!",
    target: "#function-selector",
    position: { x: 150, y: 100 },
    action: "Selecciona 'Onda Senoidal'",
    fairyMessage: "¡La función seno tiene una forma ondulante! ¡Observa cómo las sumas se adaptan a esta nueva forma!",
    hint: "🌊 La función seno oscila entre -1 y 1. ¡Observa cómo las sumas de Riemann capturan estas oscilaciones!",
    requirement: (currentFunction: string) => {
      console.log("[v0] Advanced: Checking function requirement:", currentFunction)
      const hasChanged = currentFunction && currentFunction !== "quadratic"
      console.log("[v0] Advanced: Function requirement result:", hasChanged)
      return Boolean(hasChanged)
    },
  },
  {
    id: 5,
    title: "Experimenta con Tipos de Aproximación",
    description:
      "Prueba diferentes tipos de aproximación (izquierda, derecha, centro) y observa cómo afectan la precisión. ¡Cada uno tiene sus ventajas!",
    target: "#approximation-type",
    position: { x: 150, y: 300 },
    action: "Cambia el tipo de aproximación",
    fairyMessage: "¡Cada tipo de aproximación da resultados diferentes! ¡Experimenta para encontrar el mejor!",
    hint: "⚖️ Centro suele ser más preciso, pero izquierda y derecha son útiles para entender límites. ¡La elección depende de tu objetivo!",
    requirement: (approximationType: string) => {
      console.log("[v0] Advanced: Checking approximation type requirement:", approximationType)
      const hasChanged = approximationType && approximationType !== "middle"
      console.log("[v0] Advanced: Approximation type requirement result:", hasChanged)
      return Boolean(hasChanged)
    },
  },
  {
    id: 6,
    title: "¡Maestro de las Sumas de Riemann!",
    description:
      "Has dominado los conceptos avanzados. ¡Ahora eres un verdadero experto en integrales de Riemann! ¡Explora libremente y descubre más magia matemática!",
    target: "completion",
    position: { x: 300, y: 200 },
    fairyMessage:
      "¡Increíble! Has dominado las sumas de Riemann avanzadas. ¡Eres un verdadero mago de las matemáticas!",
    hint: "🏆 ¡Felicidades! Has completado el tutorial avanzado. Ahora puedes explorar libremente, experimentar con diferentes funciones, y entender la convergencia de las sumas de Riemann. ¡Eres un experto!",
    isObservationOnly: true,
  },
]

export default function RiemannGarden() {
  // State management
  const [mode, setMode] = useState<"guided" | "free">("free")
  const [currentFunction, setCurrentFunction] = useState<FunctionType>("quadratic")
  const [partitions, setPartitions] = useState([8])
  const [leftLimit, setLeftLimit] = useState([-2])
  const [rightLimit, setRightLimit] = useState([4])
  const [approximationType, setApproximationType] = useState<"left" | "right" | "middle">("middle")
  const [showArea, setShowArea] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(1)
  const [tutorialActive, setTutorialActive] = useState(false)
  const [tutorialStep, setTutorialStep] = useState(0)
  const [complexityLevel, setComplexityLevel] = useState<"basic" | "advanced">("basic")
  const [currentView, setCurrentView] = useState<"main" | "properties">("main")
  const [currentDemo, setCurrentDemo] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isTransitioningToFree, setIsTransitioningToFree] = useState(false)
  const [activeTab, setActiveTab] = useState<"theory" | "visualizations" | "examples">("visualizations")
  const [showConfigPanel, setShowConfigPanel] = useState(false)
  
  // Debug tutorial state
  useEffect(() => {
    console.log("Tutorial state changed:", { tutorialActive, complexityLevel, tutorialStep, mode })
    if (tutorialActive) {
      console.log("Tutorial is active, current step:", tutorialStep)
      console.log("Steps available:", complexityLevel === "basic" ? TUTORIAL_STEPS_BASIC.length : TUTORIAL_STEPS_ADVANCED.length)
    }
  }, [tutorialActive, complexityLevel, tutorialStep, mode])

  // Navigation handlers
  const handleNavigateToDemo = useCallback((demoId: string) => {
    setCurrentDemo(demoId)
    setCurrentView("main")
  }, [])

  const handleBackFromDemo = useCallback(() => {
    setCurrentDemo(null)
    setCurrentView("main")
  }, [])

  // Tutorial management
  const startTutorial = useCallback(() => {
    setTutorialActive(true)
    setTutorialStep(0)
    setMode("guided")
  }, [])

  const completeTutorial = useCallback(() => {
    setTutorialActive(false)
    setTutorialStep(0)
    setIsTransitioningToFree(true)
    setTimeout(() => {
      setMode("free")
      setIsTransitioningToFree(false)
    }, 2000)
  }, [])

  const handleTutorialStepChange = useCallback((step: number) => {
    console.log("[DEBUG] handleTutorialStepChange called with step:", step)
    setTutorialStep(step)
  }, [])

  // Animation and updates
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setPartitions(prev => {
          const newValue = Math.min(prev[0] + 1, 50)
          return [newValue]
        })
      }, 1000 / animationSpeed)
      return () => clearInterval(interval)
    }
  }, [isPlaying, animationSpeed])

  // Optimized mathematical calculations with useMemo
  const riemannSum = useMemo(() => {
    const a = leftLimit[0]
    const b = rightLimit[0]
    const n = Math.floor(partitions[0])
    const dx = (b - a) / n
    let sum = 0

    for (let i = 0; i < n; i++) {
      let xi
      switch (approximationType) {
        case "left":
          xi = a + i * dx
          break
        case "right":
          xi = a + (i + 1) * dx
          break
        case "middle":
          xi = a + (i + 0.5) * dx
          break
      }
      sum += functions[currentFunction](xi) * dx
    }
    return sum
  }, [currentFunction, leftLimit, rightLimit, partitions, approximationType])

  const exactIntegral = useMemo(() => {
    const a = leftLimit[0]
    const b = rightLimit[0]

    switch (currentFunction) {
      case "quadratic":
        return (b * b * b / 6 + b) - (a * a * a / 6 + a)
      case "sine":
        return (-2 * Math.cos(b) + 3 * b) - (-2 * Math.cos(a) + 3 * a)
      case "cubic":
        return (b * b * b * b / 40 + b * b * b / 6 + 2 * b) - (a * a * a * a / 40 + a * a * a / 6 + 2 * a)
      default:
        return 0
    }
  }, [currentFunction, leftLimit, rightLimit])

  const error = useMemo(() => {
    return Math.abs(riemannSum - exactIntegral)
  }, [riemannSum, exactIntegral])

  const isApproximationGood = useMemo(() => {
    return error < 0.1
  }, [error])

  // Optimized display functions with useMemo
  const functionDisplay = useMemo(() => {
    switch (currentFunction) {
      case "quadratic":
        return `f(x) = 0.5x² + 1`
      case "sine":
        return `f(x) = 2sin(x) + 3`
      case "cubic":
        return `f(x) = 0.1x³ + 0.5x² + 2`
      default:
        return "f(x)"
    }
  }, [currentFunction])

  const integralDisplay = useMemo(() => {
    const a = leftLimit[0]
    const b = rightLimit[0]
    return `∫[${a.toFixed(1)}, ${b.toFixed(1)}] f(x)dx`
  }, [leftLimit, rightLimit])

  const functionName = useMemo(() => {
    switch (currentFunction) {
      case "quadratic":
        return "Parábola Mágica"
      case "sine":
        return "Onda Senoidal"
      case "cubic":
        return "Curva Cúbica"
      default:
        return "Función"
    }
  }, [currentFunction])

  // Optimized helper function for calculating Riemann sum over an interval
  const calculateRiemannSumForInterval = useCallback((start: number, end: number) => {
    const n = Math.floor(partitions[0])
    const dx = (end - start) / n
    let sum = 0

    for (let i = 0; i < n; i++) {
      let xi
      switch (approximationType) {
        case "left":
          xi = start + i * dx
          break
        case "right":
          xi = start + (i + 1) * dx
          break
        case "middle":
          xi = start + (i + 0.5) * dx
          break
      }
      sum += functions[currentFunction](xi) * dx
    }
    return sum
  }, [currentFunction, partitions, approximationType])

  // Demo calculations for properties (using optimized values)

  const demonstrateLinearity = useMemo(() => {
    const originalSum = riemannSum
    const scaledSum = originalSum * 2 // Demonstrate c·∫f(x)dx = ∫c·f(x)dx
    return { original: originalSum, scaled: scaledSum }
  }, [riemannSum])

  const demonstrateAdditivity = useMemo(() => {
    const a = leftLimit[0]
    const b = rightLimit[0]
    const c = (a + b) / 2

    // Calculate ∫[a,c] + ∫[c,b] and compare with ∫[a,b]
    const leftPart = calculateRiemannSumForInterval(a, c)
    const rightPart = calculateRiemannSumForInterval(c, b)
    const total = leftPart + rightPart
    const original = riemannSum

    return { leftPart, rightPart, total, original }
  }, [riemannSum, leftLimit, rightLimit, calculateRiemannSumForInterval])

  const demonstrateNullInterval = () => {
    // ∫[a,a]f(x)dx = 0
    const a = leftLimit[0]
    const b = a // Same point
    return calculateRiemannSumForInterval(a, b)
  }

  const demonstrateComparison = useMemo(() => {
    const a = leftLimit[0]
    const b = rightLimit[0]
    
    // Create two functions: f(x) and g(x) = f(x) + 1
    const f = (x: number) => functions[currentFunction](x)
    const g = (x: number) => functions[currentFunction](x) + 1
    
    const integralF = calculateRiemannSumForInterval(a, b)
    const integralG = calculateRiemannSumForInterval(a, b) + (b - a) // Add the constant term
    
    return { f: integralF, g: integralG, difference: integralG - integralF }
  }, [currentFunction, leftLimit, rightLimit, calculateRiemannSumForInterval])

  // Render demo components
  const renderDemo = () => {
    if (currentDemo === "linearity") {
      return <LinearityDemo onBack={handleBackFromDemo} />
    } else if (currentDemo === "additivity") {
      return <AdditivityDemo onBack={handleBackFromDemo} />
    } else if (currentDemo === "reverse-limits") {
      return <ReverseLimitsDemo onBack={handleBackFromDemo} />
    } else if (currentDemo === "comparison") {
      return <ComparisonDemo onBack={handleBackFromDemo} />
    }
    // Aquí se pueden agregar más demos para otras propiedades
  }

  // Si estamos en la vista de propiedades, mostrar solo la página de propiedades
  if (currentView === "properties") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <Button
              onClick={() => setCurrentView("main")}
              variant="outline"
              className="mb-4"
            >
              ← Volver al Jardín Mágico
            </Button>
            <h1 className="text-4xl font-bold text-purple-800 mb-4">
              ✨ Propiedades Mágicas de las Integrales
            </h1>
            <p className="text-lg text-purple-600">
              Explora las cuatro propiedades fundamentales del cálculo integral
            </p>
          </div>
          
          <IntegralProperties 
            onNavigateToDemo={handleNavigateToDemo}
            riemannSum={riemannSum}
            exactIntegral={exactIntegral}
            leftLimit={leftLimit[0]}
            rightLimit={rightLimit[0]}
            partitions={partitions[0]}
            onPropertySelect={() => {}}
            activeProperty=""
          />
        </div>
      </div>
    )
  }

  // Si estamos mostrando una demo específica
  if (currentDemo) {
    return renderDemo()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-green-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-2xl">🌸</div>
              <div>
                <h1 className="text-2xl font-bold text-green-800">
                  El Jardín Mágico de Riemann
                </h1>
                <p className="text-green-600 text-sm">
                  Aprende integrales definidas plantando macetas mágicas con el Hada Aria
                </p>
            </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setCurrentView("properties")}
                variant="outline"
                className="flex items-center gap-2"
              >
                ✨ Propiedades Mágicas
              </Button>
          </div>
        </div>
          </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-6">
          <div className="bg-white/90 backdrop-blur rounded-lg p-1 flex gap-1">
            <Button
              onClick={() => setActiveTab("theory")}
              variant={activeTab === "theory" ? "default" : "outline"}
              className="px-6 py-2"
            >
              📚 Teoría
            </Button>
            <Button
              onClick={() => setActiveTab("visualizations")}
              variant={activeTab === "visualizations" ? "default" : "outline"}
              className="px-6 py-2 bg-green-600 text-white"
            >
              📊 Visualizaciones
            </Button>
            <Button
              onClick={() => setActiveTab("examples")}
              variant={activeTab === "examples" ? "default" : "outline"}
              className="px-6 py-2"
            >
              📝 Ejemplos
            </Button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "theory" && (
          <div className="text-center">
            <div className="bg-white/90 backdrop-blur rounded-lg p-8">
              <h2 className="text-2xl font-bold text-green-800 mb-4">Teoría del Jardín Mágico</h2>
              <p className="text-green-600">Conceptos fundamentales de las integrales de Riemann</p>
            </div>
            <TheorySection currentScenario="riemann" />
          </div>
        )}

        {activeTab === "examples" && (
          <div>
            <RiemannExamples />
      </div>
        )}

        {activeTab === "visualizations" && (
          <div>
            {/* Main Content - Graph and Controls Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Graph Area - Takes 2 columns */}
              <div className="lg:col-span-2">
                <Card className="p-6 bg-white/90 backdrop-blur">
                  <div className="text-center mb-4">
                    <h2 className="text-xl font-bold text-green-800 mb-2">Visualización Mágica</h2>
                    <p className="text-green-600 text-sm">
                      Arrastra los puntos rojos y azules para cambiar los límites de integración
                    </p>
                  </div>
                  
                  <DraggableCanvas
                    width={800}
                    height={400}
                    functions={functions}
                    currentFunction={currentFunction}
                    partitions={partitions[0]}
                    leftLimit={leftLimit[0]}
                    rightLimit={rightLimit[0]}
                    approximationType={approximationType}
                    showArea={showArea}
                    onLimitChange={(left: number, right: number) => {
                      setLeftLimit([left])
                      setRightLimit([right])
                    }}
                    mode={mode}
                    tutorialStep={tutorialStep}
                  />
                </Card>

                {/* Metrics right below the graph */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-100 rounded-lg">
                    <div className="text-sm text-blue-600 mb-1">Aproximación de Riemann</div>
                    <div className="text-2xl font-bold text-blue-800">{riemannSum.toFixed(4)}</div>
                    <div className="text-xs text-blue-500 mt-1">Σf(xi)·Δx con {partitions[0]} términos</div>
                  </div>
                  <div className="text-center p-4 bg-green-100 rounded-lg">
                    <div className="text-sm text-green-600 mb-1">Integral Exacta</div>
                    <div className="text-2xl font-bold text-green-800">{exactIntegral.toFixed(4)}</div>
                    <div className="text-xs text-green-500 mt-1">Teorema Fundamental del Cálculo</div>
                  </div>
                  <div className="text-center p-4 bg-purple-100 rounded-lg">
                    <div className="text-sm text-purple-600 mb-1">Error</div>
                    <div className="text-2xl font-bold text-purple-800">{error.toFixed(4)}</div>
                    {isApproximationGood && <Badge className="mt-1 bg-green-500">¡Excelente!</Badge>}
                    <div className="text-xs text-purple-500 mt-1">|Aproximación - Exacta|</div>
                  </div>
                </div>

                {/* Error Verification */}
                <div className="mt-4">
                  <ErrorVerification
                    riemannSum={riemannSum}
                    exactIntegral={exactIntegral}
                    error={error}
                    partitions={partitions[0]}
                    onSuccess={() => {}}
                    onReset={() => {
                      setPartitions([8])
                      setLeftLimit([-2])
                      setRightLimit([4])
                      setApproximationType("middle")
                    }}
                    isActive={true}
                  />
                </div>
              </div>

              {/* Controls Sidebar - Takes 1 column */}
              <div className="lg:col-span-1 space-y-4">
                {/* Mode Selection */}
                <Card className="p-3 bg-white/90 backdrop-blur">
                  <div className="text-center mb-3">
                    <h3 className="text-sm font-bold text-green-800 mb-2">Modo de Aprendizaje</h3>
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => {
                          setMode("guided")
                          setTutorialActive(true)
                          setTutorialStep(1)
                        }}
                        variant={mode === "guided" ? "default" : "outline"}
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <BookOpen className="w-3 h-3" />
                        Guiado
                      </Button>
                      <Button
                        onClick={() => {
                          console.log("Activating free mode")
                          setMode("free")
                          setTutorialActive(false)
                          setTutorialStep(0)
                        }}
                        variant={mode === "free" ? "default" : "outline"}
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <MousePointer className="w-3 h-3" />
                        Libre
                      </Button>
                    </div>
                  </div>

                  {mode === "guided" && (
                    <div className="space-y-2">
                      <div className="text-center">
                        <h4 className="text-xs font-semibold text-green-700 mb-1">Nivel</h4>
                        <div className="flex flex-col gap-1">
                          <Button
                            onClick={() => {
                              setComplexityLevel("basic")
                              setTutorialActive(true)
                              setTutorialStep(1)
                            }}
                            variant={complexityLevel === "basic" ? "default" : "outline"}
                            size="sm"
                            className="text-xs"
                          >
                            🌱 Básico
                          </Button>
                          <Button
                            onClick={() => {
                              setComplexityLevel("advanced")
                              setTutorialActive(true)
                              setTutorialStep(1)
                            }}
                            variant={complexityLevel === "advanced" ? "default" : "outline"}
                            size="sm"
                            className="text-xs"
                          >
                            🌟 Avanzado
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>

                {/* Function Selection */}
                <Card className="p-3 bg-white/90 backdrop-blur">
                  <h3 className="font-semibold mb-2 text-green-800 text-sm">Función del Jardín</h3>
                  <div className="space-y-1">
                    {Object.keys(functions).map((func) => (
                      <Button
                        key={func}
                        onClick={() => setCurrentFunction(func as FunctionType)}
                        variant={currentFunction === func ? "default" : "outline"}
                        size="sm"
                        className="w-full justify-start text-xs"
                        disabled={mode === "guided" && tutorialStep > 0 && tutorialStep !== 4 && tutorialStep !== 5}
                      >
                        {func === "quadratic" && "🌺 Parábola"}
                        {func === "sine" && "🌊 Seno"}
                        {func === "cubic" && "🌿 Cúbica"}
                      </Button>
                    ))}
                  </div>
                </Card>

                {/* Partitions Control */}
                <Card className="p-3 bg-white/90 backdrop-blur">
                  <h3 className="font-semibold mb-2 text-green-800 text-sm">Número de Macetas</h3>
                  <div className="space-y-2">
                    <Slider
                      value={partitions}
                      onValueChange={setPartitions}
                      min={1}
                      max={50}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-center text-xs text-green-600">{Math.floor(partitions[0])} macetas</div>
                    <div className="text-center">
                      {partitions[0] < 10 && <Badge variant="destructive" className="text-xs">Burda</Badge>}
                      {partitions[0] >= 10 && partitions[0] < 25 && <Badge variant="secondary" className="text-xs">Buena</Badge>}
                      {partitions[0] >= 25 && <Badge className="bg-green-500 text-xs">Excelente</Badge>}
                    </div>
                  </div>
                </Card>

                {/* Animation Controls */}
                <Card className="p-3 bg-white/90 backdrop-blur">
                  <h3 className="font-semibold mb-2 text-green-800 text-sm">Animación</h3>
                  <div className="space-y-2">
                    <div className="flex gap-1">
                      <Button
                        onClick={() => setIsPlaying(!isPlaying)}
                        variant={isPlaying ? "destructive" : "default"}
                        size="sm"
                        className="flex-1 text-xs"
                      >
                        {isPlaying ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                        {isPlaying ? "Pausar" : "Play"}
                      </Button>
                      <Button
                        onClick={() => {
                          setPartitions([8])
                          setIsPlaying(false)
                        }}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </Button>
                    </div>
                    <div>
                      <label className="text-xs text-green-600">Velocidad</label>
                      <Slider
                        value={[animationSpeed]}
                        onValueChange={(value) => setAnimationSpeed(value[0])}
                        min={0.5}
                        max={3}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="text-center text-xs text-green-600">{animationSpeed.toFixed(1)}x</div>
                    </div>
                  </div>
                </Card>

                {/* Garden Controls */}
                <Card className="p-3 bg-white/90 backdrop-blur">
                  <h3 className="font-semibold mb-2 text-green-800 text-sm">Controles del Jardín</h3>
                  
                  {/* Limits */}
                  <div className="mb-3">
                    <h4 className="text-xs font-medium text-green-700 mb-1">Límites</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-green-600">Izquierdo</label>
                        <Slider
                          value={leftLimit}
                          onValueChange={setLeftLimit}
                          min={-10}
                          max={10}
                          step={0.1}
                          className="w-full"
                        />
                        <div className="text-center text-xs text-green-600">a = {leftLimit[0].toFixed(1)}</div>
                      </div>
                      <div>
                        <label className="text-xs text-green-600">Derecho</label>
                        <Slider
                          value={rightLimit}
                          onValueChange={setRightLimit}
                          min={-10}
                          max={10}
                          step={0.1}
                          className="w-full"
                        />
                        <div className="text-center text-xs text-green-600">b = {rightLimit[0].toFixed(1)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Approximation Type */}
                  <div className="mb-2">
                    <h4 className="text-xs font-medium text-green-700 mb-1">Tipo de Hechizo</h4>
                    <div className="grid grid-cols-3 gap-1">
                      {[
                        { key: "left", label: "⬅️", desc: "Izq" },
                        { key: "right", label: "➡️", desc: "Der" },
                        { key: "middle", label: "🎯", desc: "Cen" },
                      ].map((type) => (
                        <Button
                          key={type.key}
                          onClick={() => setApproximationType(type.key as "left" | "right" | "middle")}
                          variant={approximationType === type.key ? "default" : "outline"}
                          size="sm"
                          className="flex flex-col h-10 text-xs"
                          disabled={mode === "guided" && tutorialStep > 0 && tutorialStep !== 6}
                        >
                          <span>{type.label}</span>
                          <span className="text-xs">{type.desc}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="p-2 bg-yellow-50 rounded border border-yellow-200">
                    <p className="text-yellow-700 text-xs">
                      💡 Arrastra los puntos rojos y azules en el gráfico
                    </p>
                  </div>
                </Card>

                {/* Configuration Panel - Only in Free Mode */}
                {mode === "free" && (
                  <Card className="p-3 bg-white/90 backdrop-blur">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-purple-800 text-sm">⚙️ Configuración</h3>
                        <Button
                          onClick={() => setShowConfigPanel(!showConfigPanel)}
                          variant="ghost"
                          size="sm"
                          className="text-xs p-1 h-6 w-6"
                        >
                          {showConfigPanel ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </Button>
                      </div>
                      <Button
                        onClick={() => {
                          setCurrentFunction("quadratic")
                          setPartitions([8])
                          setLeftLimit([-2])
                          setRightLimit([4])
                          setApproximationType("middle")
                          setIsPlaying(false)
                        }}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        🔄 Reset
                      </Button>
                    </div>

                    {showConfigPanel && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-purple-700">Límite Izquierdo</label>
                          <input
                            type="number"
                            value={leftLimit[0]}
                            onChange={(e) => setLeftLimit([parseFloat(e.target.value) || -2])}
                            className="w-full px-2 py-1 text-xs border border-purple-300 rounded"
                            step="0.1"
                            min="-10"
                            max="10"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-purple-700">Límite Derecho</label>
                          <input
                            type="number"
                            value={rightLimit[0]}
                            onChange={(e) => setRightLimit([parseFloat(e.target.value) || 4])}
                            className="w-full px-2 py-1 text-xs border border-purple-300 rounded"
                            step="0.1"
                            min="-10"
                            max="10"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-purple-700">Macetas</label>
                          <input
                            type="number"
                            value={partitions[0]}
                            onChange={(e) => setPartitions([parseInt(e.target.value) || 8])}
                            className="w-full px-2 py-1 text-xs border border-purple-300 rounded"
                            min="1"
                            max="50"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-purple-700">Función</label>
                          <select
                            value={currentFunction}
                            onChange={(e) => setCurrentFunction(e.target.value as FunctionType)}
                            className="w-full px-2 py-1 text-xs border border-purple-300 rounded"
                          >
                            <option value="quadratic">🌺 Parábola</option>
                            <option value="sine">🌊 Seno</option>
                            <option value="cubic">🌿 Cúbica</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </Card>
                )}

                {/* Function Display */}
                <Card className="p-3 bg-white/90 backdrop-blur">
                  <div className="text-center mb-3">
                    <div className="p-2 bg-white/80 rounded-lg border border-green-300 inline-block">
                      <div className="text-xs text-green-600 mb-1">Función Actual:</div>
                      <div className="text-sm font-bold text-green-800">{functionDisplay}</div>
                      <div className="text-xs text-green-600">{functionName}</div>
                      <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                        <div className="text-xs text-blue-600 mb-1">Integral Dinámica:</div>
                        <div className="text-sm font-bold text-blue-800 flex items-center gap-2">
                          {integralDisplay}
                          {isUpdating && (
                            <span className="text-orange-500 animate-spin">🔄</span>
                          )}
                        </div>
                        <div className="text-xs text-blue-500">
                          {isUpdating ? "Actualizando límites..." : "Límites actualizados en tiempo real"}
                        </div>
                      </div>
                    </div>
                    
                    {mode === "free" && (
                      <div className="mt-2 flex items-center justify-center gap-2 text-xs text-green-600">
                        <Hand className="w-3 h-3" />
                        <span>Arrastra los puntos rojos y azules para cambiar los límites de integración</span>
                      </div>
                    )}
                    {isTransitioningToFree && (
                      <div className="mt-2 flex items-center justify-center gap-2 text-xs text-blue-600 bg-blue-50 p-2 rounded-lg border border-blue-200">
                        <div className="animate-spin">🔄</div>
                        <span>¡Tutorial completado! Activando modo libre...</span>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>

        </div>
      )}

        {/* Tutorial System - Always visible when active */}
        {tutorialActive && (
      <TutorialSystem
            steps={complexityLevel === "basic" ? TUTORIAL_STEPS_BASIC : TUTORIAL_STEPS_ADVANCED}
        currentStep={tutorialStep}
        onStepChange={handleTutorialStepChange}
        onComplete={completeTutorial}
        partitions={partitions}
        leftLimit={leftLimit}
        rightLimit={rightLimit}
            currentFunction={currentFunction}
            approximationType={approximationType}
            isVisible={tutorialActive}
      />
        )}
      </div>
    </div>
  )
}