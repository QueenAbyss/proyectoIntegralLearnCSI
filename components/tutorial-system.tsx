"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, ChevronLeft, Sparkles, Target } from "lucide-react"

export interface TutorialStep {
  id: number
  title: string
  description: string
  target: string
  position: { x: number; y: number }
  action?: string
  requirement?: (...args: any[]) => boolean
  hint?: string
  fairyMessage?: string
  isObservationOnly?: boolean
}

interface TutorialSystemProps {
  steps: TutorialStep[]
  currentStep: number
  onStepChange: (step: number) => void
  onComplete: () => void
  isVisible: boolean
  partitions?: number[]
  leftLimit?: number[]
  rightLimit?: number[]
  currentFunction?: string
  approximationType?: string
  isAnimating?: boolean
}

export function TutorialSystem({
  steps,
  currentStep,
  onStepChange,
  onComplete,
  isVisible,
  partitions,
  leftLimit,
  rightLimit,
  currentFunction,
  approximationType,
  isAnimating,
}: TutorialSystemProps) {
  const [showHint, setShowHint] = useState(false)
  const [animationClass, setAnimationClass] = useState("")
  const [hasInteracted, setHasInteracted] = useState(false)

  const currentStepData = steps[currentStep - 1]
  const progress = (currentStep / steps.length) * 100

  useEffect(() => {
    if (isVisible && currentStepData) {
      setAnimationClass("animate-bounce")
      const timer = setTimeout(() => setAnimationClass(""), 1000)
      return () => clearTimeout(timer)
    }
  }, [currentStep, isVisible, currentStepData])

  // ✅ CORREGIDO: Reset del estado en cada paso nuevo (como en el backup que funciona)
  useEffect(() => {
    setHasInteracted(false)  // ← Reset normal para todos los pasos
    setShowHint(false)
  }, [currentStep])

  // ✅ CORREGIDO: Detección de interacciones específicas (como en el backup que funciona)
  useEffect(() => {
    if (!isVisible || !currentStepData || currentStepData.isObservationOnly) return

    const checkInteraction = () => {
      // Paso 3: Detectar 40+ particiones (modo avanzado)
      if (currentStep === 3 && partitions && partitions[0] >= 40) {
        console.log("[v0] Step 3 interaction detected, partitions:", partitions[0])
        setHasInteracted(true)  // ← AQUÍ se habilita el botón
      }
      // Paso 4: Detectar cambio de función (modo avanzado) - SOLO cuando cambie a "sine"
      else if (currentStep === 4 && currentFunction && currentFunction === "sine") {
        console.log("[v0] Step 4 function change detected to sine:", currentFunction)
        setHasInteracted(true)  // ← AQUÍ se habilita el botón
      }
      // Paso 4: Detectar cambio en slider de particiones (SOLO nivel básico)
      else if (currentStep === 4 && partitions && partitions[0] !== 8 && currentStepData.target === "#partitions-slider") {
        console.log("[v0] Slider interaction detected, partitions:", partitions[0])
        setHasInteracted(true)  // ← AQUÍ se habilita el botón
      } 
      // Paso 5: Detectar cambio en tipo de aproximación (modo avanzado)
      else if (currentStep === 5 && approximationType && approximationType !== "middle") {
        console.log("[v0] Step 5 approximation type change detected:", approximationType)
        setHasInteracted(true)  // ← AQUÍ se habilita el botón
      }
    }

    checkInteraction()
  }, [partitions, leftLimit, rightLimit, currentFunction, approximationType, currentStep, isVisible, currentStepData])

  // ✅ NUEVO: Detectar cambio real de función en paso 4 - SOLO cuando cambie de otra función a sine
  const [previousFunction, setPreviousFunction] = useState<string>("")
  
  useEffect(() => {
    if (currentStep === 4 && currentFunction === "sine" && previousFunction !== "sine" && previousFunction !== "") {
      console.log("🎯 REAL FUNCTION CHANGE DETECTED in step 4:", previousFunction, "->", currentFunction)
      setHasInteracted(true)
    }
    setPreviousFunction(currentFunction || "")
  }, [currentFunction, currentStep, previousFunction])

  useEffect(() => {
    if (!isVisible || !currentStepData) return

    // Remove previous highlights and blocks
    document.querySelectorAll(".tutorial-highlight").forEach((el) => {
      el.classList.remove("tutorial-highlight")
    })
    document.querySelectorAll(".tutorial-blocked").forEach((el) => {
      el.classList.remove("tutorial-blocked")
      ;(el as HTMLElement).style.pointerEvents = ""
    })

    let targetElement: Element | null = null

    switch (currentStepData.target) {
      case ".function-curve":
      case "function-curve":
        // Highlight the entire canvas area for function observation
        targetElement = document.querySelector("canvas")
        break
      case ".rectangles":
      case "rectangles":
        // Highlight the canvas for rectangle observation
        targetElement = document.querySelector("canvas")
        break
      case "#partitions-slider":
        targetElement = document.querySelector("#partitions-slider")
        break
      case "#limits":
        targetElement = document.querySelector("#limits")
        break
      case "#approximation-type":
        targetElement = document.querySelector("#approximation-type")
        break
      default:
        if (currentStepData.target !== "fairy" && currentStepData.target !== "completion") {
          targetElement = document.querySelector(currentStepData.target)
        }
    }

    // Add highlight to target element
    if (targetElement) {
      targetElement.classList.add("tutorial-highlight")
      targetElement.classList.add("tutorial-spotlight")
    }

    if (!currentStepData.isObservationOnly) {
      const interactiveElements = document.querySelectorAll('button, input, [role="slider"], .draggable-point')
      interactiveElements.forEach((el) => {
        // ✅ CORREGIDO: Lógica especial para paso 4 del modo avanzado
        const isFunctionButton = el.closest('[data-function-button]') || 
                                el.textContent?.includes('Parábola') || 
                                el.textContent?.includes('Onda') || 
                                el.textContent?.includes('Cúbica')
        
        // En paso 4 del modo avanzado, solo permitir botones de función
        const isStep4Advanced = currentStep === 4 && currentStepData.target === "#function-selector"
        
        // En paso 5 del modo avanzado, solo permitir botones de aproximación
        const isStep5Advanced = currentStep === 5 && currentStepData.target === "#approximation-type"
        const isApproximationButton = el.closest('#approximation-type') || 
                                    el.textContent?.includes('Hechizo') ||
                                    el.textContent?.includes('Izquierdo') ||
                                    el.textContent?.includes('Derecho') ||
                                    el.textContent?.includes('Central') ||
                                    el.textContent?.includes('⬅️') ||
                                    el.textContent?.includes('➡️') ||
                                    el.textContent?.includes('🎯') ||
                                    el.closest('button[onclick*="setApproximationType"]')
        
        // ✅ CORREGIDO: No bloquear botones de pista en ningún paso
        const isHintButton = el.textContent?.includes('Necesito una pista') || 
                            el.textContent?.includes('pista')
        
        if (isStep4Advanced) {
          // Solo bloquear elementos que NO sean botones de función
          if (!isFunctionButton) {
            el.classList.add("tutorial-blocked")
            ;(el as HTMLElement).style.pointerEvents = "none"
          }
        } else if (isStep5Advanced) {
          // Solo bloquear elementos que NO sean botones de aproximación o pista
          console.log("🔍 STEP 5 BLOCKING CHECK:", {
            element: el,
            textContent: el.textContent,
            isApproximationButton,
            isHintButton,
            willBlock: !isApproximationButton && !isHintButton,
            isButton: el.tagName === 'BUTTON',
            hasOnClick: el.hasAttribute('onclick'),
            parentId: el.closest('#approximation-type') ? 'FOUND' : 'NOT_FOUND'
          })
          if (!isApproximationButton && !isHintButton) {
            el.classList.add("tutorial-blocked")
            ;(el as HTMLElement).style.pointerEvents = "none"
          }
        } else {
          // Lógica normal para otros pasos
          if (
            !el.closest(currentStepData.target) &&
            currentStepData.target !== "fairy" &&
            currentStepData.target !== "completion" &&
            !isFunctionButton
          ) {
            el.classList.add("tutorial-blocked")
            ;(el as HTMLElement).style.pointerEvents = "none"
          }
        }
      })
    }

    return () => {
      // Cleanup on unmount
      document.querySelectorAll(".tutorial-highlight").forEach((el) => {
        el.classList.remove("tutorial-highlight", "tutorial-spotlight")
      })
      document.querySelectorAll(".tutorial-blocked").forEach((el) => {
        el.classList.remove("tutorial-blocked")
        ;(el as HTMLElement).style.pointerEvents = ""
      })
    }
  }, [currentStep, isVisible, currentStepData])

  const nextStep = () => {
    console.log("🚀🚀🚀 NEXT STEP CLICKED 🚀🚀🚀")
    console.log("Current step:", currentStep)
    console.log("Total steps:", steps.length)
    console.log("Can proceed:", canProceed())
    console.log("Has interacted:", hasInteracted)
    console.log("Current step data:", currentStepData)
    console.log("Is observation only:", currentStepData?.isObservationOnly)
    console.log("Has requirement:", !!currentStepData?.requirement)
    console.log("Has action:", !!currentStepData?.action)
    
    if (!canProceed()) {
      console.log("❌ Cannot proceed - requirements not met")
      return
    }
    
    console.log("✅ Requirements met, proceeding...")
    
    if (currentStep < steps.length) {
      console.log("📈 Moving to step:", currentStep + 1)
      onStepChange(currentStep + 1)
      setShowHint(false)
    } else {
      console.log("🎉 Completing tutorial")
      onComplete()
    }
  }

  const prevStep = () => {
    console.log("[v0] Previous step clicked, current:", currentStep)
    if (currentStep > 1) {
      onStepChange(currentStep - 1)
      setShowHint(false)
    }
  }

  // ✅ CORREGIDO: Función canProceed() simplificada (como en el backup que funciona)
  const canProceed = () => {
    // Si es un paso de solo observación, siempre puede continuar
    if (currentStepData?.isObservationOnly) {
      console.log("[v0] Can proceed: observation step")
      return true
    }

    // Si tiene un requirement personalizado, verifica la interacción
    if (currentStepData?.requirement) {
      console.log("[v0] Can proceed:", hasInteracted, "hasInteracted:", hasInteracted)
      return hasInteracted
    }

    // Si no tiene requirements, puede continuar
    console.log("[v0] Can proceed: no requirement")
    return true
  }

  if (!isVisible || !currentStepData) return null

  return (
    <>
      {/* Tutorial Overlay - ✅ CORREGIDO: Overlay simple como en el backup que funciona */}
      <div 
        className="fixed inset-0 bg-black/10 z-40" 
        style={{ 
          pointerEvents: "none" // Permitir que todos los clics pasen a través
        }}
      />

      {/* Tutorial Card - Fixed positioning */}
      <div
        className={`fixed z-50 ${animationClass}`}
        style={{
          left: 20,
          top: 20,
          maxWidth: "380px",
          pointerEvents: "auto",
          zIndex: 9999,
        }}
        data-tutorial-card
      >
        <Card className="w-full p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 shadow-2xl max-h-[80vh] overflow-y-auto">
          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-yellow-700">
                Paso {currentStep} de {steps.length}
              </span>
              <span className="text-xs text-yellow-700">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-yellow-100" />
          </div>

          {/* Fairy Avatar */}
          <div className="flex items-start gap-3 mb-3">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-300 rounded-full animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-yellow-800 mb-1 text-sm">{currentStepData.title}</h3>
              <p className="text-yellow-700 text-xs leading-relaxed">{currentStepData.description}</p>
            </div>
          </div>

          {/* Fairy Message */}
          {currentStepData.fairyMessage && (
            <div className="mb-3 p-2 bg-purple-100 rounded-lg border border-purple-200">
              <p className="text-purple-700 text-xs italic">"{currentStepData.fairyMessage}"</p>
            </div>
          )}

          {/* Action Required */}
          {currentStepData.action && (
            <div className="mb-3 p-2 bg-blue-100 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="text-blue-700 text-xs font-medium">
                  {currentStepData.isObservationOnly ? "Observa:" : "Acción requerida:"}
                </span>
              </div>
              <p className="text-blue-600 text-xs mt-1">{currentStepData.action}</p>
              {currentStepData.isObservationOnly && (
                <p className="text-blue-500 text-xs mt-1 italic">
                  👀 Solo observa el área iluminada, luego presiona "Siguiente"
                </p>
              )}
              {!currentStepData.isObservationOnly && hasInteracted && (
                <p className="text-green-600 text-xs mt-1 font-medium">✅ ¡Perfecto! Ahora puedes continuar</p>
              )}
            </div>
          )}

          {/* Hint - ✅ CORREGIDO: Botón de pista siempre habilitado (como en el backup que funciona) */}
          <div className="mb-3">
            <Button
              onClick={() => {
                console.log("💡 Hint button clicked")
                setShowHint(!showHint)
              }}
              size="sm"
              variant="outline"
              className="flex items-center gap-1 h-8 text-xs"
            >
              {showHint ? "Ocultar pista" : "💡 Necesito una pista"}
            </Button>
            {showHint && currentStepData.hint && (
              <div className="mt-2 p-2 bg-green-100 rounded-lg border border-green-200">
                <p className="text-green-700 text-xs leading-relaxed">{currentStepData.hint}</p>
              </div>
            )}
            {showHint && !currentStepData.hint && (
              <div className="mt-2 p-2 bg-yellow-100 rounded-lg border border-yellow-200">
                <p className="text-yellow-700 text-xs leading-relaxed">
                  💡 No hay pista específica para este paso, pero puedes experimentar libremente con los controles.
                </p>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-2">
            <Button
              onClick={prevStep}
              disabled={currentStep === 1}
              variant="outline"
              size="sm"
              className="flex items-center gap-1 bg-transparent h-8 text-xs"
            >
              <ChevronLeft className="w-3 h-3" />
              Anterior
            </Button>

            <Button
              onClick={nextStep}
              disabled={!canProceed()}  // ← CONDICIÓN PRINCIPAL: deshabilitado si canProceed() es false
              size="sm"
              style={{ pointerEvents: canProceed() ? "auto" : "none" }}  // ← Bloquea clicks si está deshabilitado
              className={`flex items-center gap-1 h-8 text-xs ${
                canProceed()
                  ? "bg-yellow-500 hover:bg-yellow-600 text-white"  // ← ESTILO HABILITADO
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"  // ← ESTILO DESHABILITADO
              }`}
            >
              {currentStep === steps.length ? "¡Completar!" : "Siguiente"}
              <ChevronRight className="w-3 h-3" />
            </Button>
          </div>

          {/* Debug info */}
          <div className="mt-2 text-xs text-gray-500">
            Debug: Step {currentStep}, Can proceed: {canProceed() ? "Yes" : "No"}
            <div>Has interacted: {hasInteracted ? "Yes" : "No"}</div>
            {currentStep === 4 && <div>Partitions: {partitions?.[0] || "undefined"}</div>}
            <div>Button disabled: {!canProceed() ? "Yes" : "No"}</div>
          </div>
        </Card>
      </div>

      {/* ✅ CORREGIDO: Eliminar botón separado y overlays complejos */}
      {/* Ya no necesitamos el botón separado ni overlays complicados */}

      <style jsx global>{`
        .tutorial-highlight {
          position: relative;
          z-index: 45 !important;
          box-shadow: 0 0 0 4px rgba(255, 255, 0, 0.8), 0 0 30px rgba(255, 255, 0, 0.6) !important;
          border-radius: 12px !important;
          animation: tutorial-glow 2s ease-in-out infinite alternate;
        }
        
        .tutorial-spotlight {
          background: radial-gradient(circle, rgba(255,255,0,0.15) 0%, rgba(255,255,0,0.05) 50%, transparent 70%) !important;
        }
        
        .tutorial-blocked {
          opacity: 0.3 !important;
          cursor: not-allowed !important;
          pointer-events: none !important;
        }
        
        @keyframes tutorial-glow {
          from {
            box-shadow: 0 0 0 4px rgba(255, 255, 0, 0.8), 0 0 30px rgba(255, 255, 0, 0.6);
          }
          to {
            box-shadow: 0 0 0 4px rgba(255, 255, 0, 1), 0 0 40px rgba(255, 255, 0, 0.8);
          }
        }
      `}</style>
    </>
  )
}
