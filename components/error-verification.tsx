"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Target, Trophy, Sparkles, Timer } from "lucide-react"

interface ErrorVerificationProps {
  riemannSum: number
  exactIntegral: number
  error: number
  partitions: number
  onSuccess: () => void
  onReset: () => void
  isActive: boolean
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  requirement: (error: number, partitions: number) => boolean
}

export function ErrorVerification({
  riemannSum,
  exactIntegral,
  error,
  partitions,
  onSuccess,
  onReset,
  isActive,
}: ErrorVerificationProps) {
  const [accuracy, setAccuracy] = useState(0)
  const [status, setStatus] = useState<"calculating" | "good" | "excellent" | "perfect">("calculating")
  const [showCelebration, setShowCelebration] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "first_good",
      name: "Primer Éxito",
      description: "Logra tu primera aproximación buena (error < 0.5)",
      icon: "🌱",
      unlocked: false,
      requirement: (error) => error < 0.5,
    },
    {
      id: "excellent_approximation",
      name: "Aproximación Excelente",
      description: "Consigue una aproximación excelente (error < 0.1)",
      icon: "🌸",
      unlocked: false,
      requirement: (error) => error < 0.1,
    },
    {
      id: "perfect_master",
      name: "Maestro Perfecto",
      description: "Alcanza la perfección (error < 0.01)",
      icon: "🏆",
      unlocked: false,
      requirement: (error) => error < 0.01,
    },
    {
      id: "efficiency_expert",
      name: "Experto en Eficiencia",
      description: "Logra excelencia con menos de 20 macetas",
      icon: "⚡",
      unlocked: false,
      requirement: (error, partitions) => error < 0.1 && partitions < 20,
    },
    {
      id: "speed_demon",
      name: "Velocista Mágico",
      description: "Consigue excelencia en menos de 30 segundos",
      icon: "🚀",
      unlocked: false,
      requirement: (error) => error < 0.1,
    },
  ])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerActive && isActive) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerActive, isActive])

  // Start timer when component becomes active
  useEffect(() => {
    if (isActive && !isTimerActive) {
      setIsTimerActive(true)
    }
  }, [isActive, isTimerActive])

  // Calculate accuracy and status
  useEffect(() => {
    if (exactIntegral === 0) return

    const relativeError = Math.abs(error / exactIntegral)
    const accuracyPercent = Math.max(0, (1 - relativeError) * 100)
    setAccuracy(accuracyPercent)

    // Determine status based on absolute error
    if (error < 0.01) {
      setStatus("perfect")
    } else if (error < 0.1) {
      setStatus("excellent")
    } else if (error < 0.5) {
      setStatus("good")
    } else {
      setStatus("calculating")
    }

    // Check achievements
    setAchievements((prev) =>
      prev.map((achievement) => {
        if (!achievement.unlocked && achievement.requirement(error, partitions)) {
          // Special case for speed achievement
          if (achievement.id === "speed_demon" && timeElapsed > 30) {
            return achievement
          }
          if (achievement.id === "speed_demon" && timeElapsed <= 30) {
            return { ...achievement, unlocked: true }
          }
          return { ...achievement, unlocked: true }
        }
        return achievement
      }),
    )

    // Show celebration for excellent or perfect
    if ((status === "excellent" || status === "perfect") && !showCelebration) {
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }

    // Call success callback for excellent approximations
    if (status === "excellent" || status === "perfect") {
      onSuccess()
    }
  }, [error, exactIntegral, partitions, status, showCelebration, timeElapsed, onSuccess])

  const getStatusColor = () => {
    switch (status) {
      case "perfect":
        return "text-purple-600 bg-purple-100 border-purple-300"
      case "excellent":
        return "text-green-600 bg-green-100 border-green-300"
      case "good":
        return "text-blue-600 bg-blue-100 border-blue-300"
      default:
        return "text-orange-600 bg-orange-100 border-orange-300"
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case "perfect":
        return <Trophy className="w-5 h-5" />
      case "excellent":
        return <CheckCircle className="w-5 h-5" />
      case "good":
        return <Target className="w-5 h-5" />
      default:
        return <XCircle className="w-5 h-5" />
    }
  }

  const getStatusMessage = () => {
    switch (status) {
      case "perfect":
        return "¡PERFECTO! Eres un verdadero maestro de las integrales"
      case "excellent":
        return "¡EXCELENTE! Tu aproximación es muy precisa"
      case "good":
        return "¡BIEN! Vas por buen camino, intenta con más macetas"
      default:
        return "Sigue intentando, puedes mejorar la aproximación"
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const resetTimer = () => {
    setTimeElapsed(0)
    setIsTimerActive(true)
    onReset()
  }

  return (
    <div className="flex flex-col xl:flex-row gap-4">
      {/* Main Status Card */}
      <div className="flex-1">
        <Card className={`p-4 border-2 ${getStatusColor()} relative overflow-hidden`}>
        {showCelebration && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <h3 className="font-bold text-lg">Verificación Mágica</h3>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Timer className="w-4 h-4" />
            <span>{formatTime(timeElapsed)}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Precisión</span>
              <span className="text-sm font-bold">{accuracy.toFixed(1)}%</span>
            </div>
            <Progress value={accuracy} className="h-3" />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center p-2 bg-white/50 rounded">
              <div className="font-semibold">Tu Aproximación</div>
              <div className="text-lg font-bold">{riemannSum.toFixed(4)}</div>
            </div>
            <div className="text-center p-2 bg-white/50 rounded">
              <div className="font-semibold">Valor Exacto</div>
              <div className="text-lg font-bold">{exactIntegral.toFixed(4)}</div>
            </div>
          </div>

          <div className="text-center p-2 bg-white/70 rounded">
            <div className="font-semibold text-sm">Error Absoluto</div>
            <div className="text-xl font-bold">{error.toFixed(6)}</div>
          </div>

          <div className="text-center">
            <Badge className={`${getStatusColor()} border-0 text-sm px-3 py-1`}>{getStatusMessage()}</Badge>
          </div>
        </div>
        </Card>
      </div>

      {/* Achievements Panel */}
      <div className="flex-1">
        <Card className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="w-5 h-5 text-yellow-600" />
          <h3 className="font-bold text-yellow-800">Logros del Jardín Mágico</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-2 rounded-lg border-2 transition-all ${
                achievement.unlocked
                  ? "bg-green-100 border-green-300 text-green-800"
                  : "bg-gray-100 border-gray-300 text-gray-600"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{achievement.icon}</span>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{achievement.name}</div>
                  <div className="text-xs">{achievement.description}</div>
                </div>
                {achievement.unlocked && <CheckCircle className="w-4 h-4 text-green-600" />}
              </div>
            </div>
          ))}
        </div>
        </Card>
      </div>

    </div>
  )
}
