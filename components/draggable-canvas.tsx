"use client"

import type React from "react"

import { useRef, useEffect, useState, useCallback, useMemo } from "react"

interface DraggablePoint {
  id: string
  x: number
  y: number
  screenX: number
  screenY: number
  isDragging: boolean
  color: string
  size: number
  label: string
}

interface DraggableCanvasProps {
  width: number
  height: number
  functions: Record<string, (x: number) => number>
  currentFunction: string
  partitions: number
  leftLimit: number
  rightLimit: number
  approximationType: "left" | "right" | "middle"
  showArea: boolean
  onLimitChange: (left: number, right: number) => void
  onFunctionPointDrag?: (x: number, y: number) => void
  mode: "guided" | "free"
  tutorialStep: number
}

export function DraggableCanvas({
  width,
  height,
  functions,
  currentFunction,
  partitions,
  leftLimit,
  rightLimit,
  approximationType,
  showArea,
  onLimitChange,
  onFunctionPointDrag,
  mode,
  tutorialStep,
}: DraggableCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [draggablePoints, setDraggablePoints] = useState<DraggablePoint[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [dragTarget, setDragTarget] = useState<string | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  // Helper function to get function display string
  const getFunctionDisplay = (funcName: string) => {
    switch (funcName) {
      case "quadratic":
        return "0.5x² + 1"
      case "sine":
        return "2sin(x) + 3"
      case "cubic":
        return "0.1x³ + 0.5x² + 2"
      default:
        return "f(x)"
    }
  }

  // Initialize draggable points
  useEffect(() => {
    const points: DraggablePoint[] = [
      {
        id: "leftLimit",
        x: leftLimit,
        y: 0,
        screenX: 100 + ((leftLimit - leftLimit) / (rightLimit - leftLimit)) * (width - 200),
        screenY: height - 100,
        isDragging: false,
        color: "#FF6B6B",
        size: 12,
        label: "a",
      },
      {
        id: "rightLimit",
        x: rightLimit,
        y: 0,
        screenX: 100 + ((rightLimit - leftLimit) / (rightLimit - leftLimit)) * (width - 200),
        screenY: height - 100,
        isDragging: false,
        color: "#4ECDC4",
        size: 12,
        label: "b",
      },
    ]

    // Add function control points for free mode
    if (mode === "free") {
      const func = functions[currentFunction]
      const numControlPoints = 5
      for (let i = 0; i <= numControlPoints; i++) {
        const x = leftLimit + (i / numControlPoints) * (rightLimit - leftLimit)
        const y = func(x)
        points.push({
          id: `control_${i}`,
          x,
          y,
          screenX: 100 + ((x - leftLimit) / (rightLimit - leftLimit)) * (width - 200),
          screenY: height - 100 - y * 40,
          isDragging: false,
          color: "#9B59B6",
          size: 8,
          label: `P${i}`,
        })
      }
    }

    setDraggablePoints(points)
  }, [leftLimit, rightLimit, currentFunction, mode, width, height, functions])

  // Optimized redraw with throttling for smooth performance
  useEffect(() => {
    // Use requestAnimationFrame for smooth updates
    const frameId = requestAnimationFrame(() => {
      if (drawGarden) {
        drawGarden()
      }
    })
    return () => cancelAnimationFrame(frameId)
  }, [leftLimit, rightLimit, currentFunction, partitions, approximationType])

  // Memoize expensive calculations
  const memoizedCalculations = useMemo(() => {
    return {
      leftLimit: leftLimit,
      rightLimit: rightLimit,
      partitions: partitions,
      currentFunction: currentFunction,
      approximationType: approximationType
    }
  }, [leftLimit, rightLimit, partitions, currentFunction, approximationType])

  // Smooth dragging with controlled updates
  useEffect(() => {
    if (isDragging) {
      const frameId = requestAnimationFrame(() => {
        if (drawGarden) {
          drawGarden()
        }
      })
      return () => cancelAnimationFrame(frameId)
    }
  }, [isDragging])

  // Convert screen coordinates to mathematical coordinates
  const screenToMath = useCallback(
    (screenX: number, screenY: number) => {
      const mathX = leftLimit + ((screenX - 100) / (width - 200)) * (rightLimit - leftLimit)
      const mathY = (height - 100 - screenY) / 40
      return { x: mathX, y: mathY }
    },
    [leftLimit, rightLimit, width, height],
  )

  // Convert mathematical coordinates to screen coordinates
  const mathToScreen = useCallback(
    (mathX: number, mathY: number) => {
      const screenX = 100 + ((mathX - leftLimit) / (rightLimit - leftLimit)) * (width - 200)
      const screenY = height - 100 - mathY * 40
      return { x: screenX, y: screenY }
    },
    [leftLimit, rightLimit, width, height],
  )

  // Check if point is near mouse
  const isPointNearMouse = (point: DraggablePoint, mouseX: number, mouseY: number) => {
    const distance = Math.sqrt((point.screenX - mouseX) ** 2 + (point.screenY - mouseY) ** 2)
    return distance <= point.size + 5
  }

  // Mouse event handlers
  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode === "guided" && tutorialStep !== 5) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const mouseX = event.clientX - rect.left
    const mouseY = event.clientY - rect.top

    // Check if clicking on any draggable point
    for (const point of draggablePoints) {
      if (isPointNearMouse(point, mouseX, mouseY)) {
        setIsDragging(true)
        setDragTarget(point.id)
        setMousePos({ x: mouseX, y: mouseY })

        // Update point dragging state
        setDraggablePoints((prev) => prev.map((p) => ({ ...p, isDragging: p.id === point.id })))
        break
      }
    }
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const mouseX = event.clientX - rect.left
    const mouseY = event.clientY - rect.top

    setMousePos({ x: mouseX, y: mouseY })

    if (isDragging && dragTarget) {
      const mathCoords = screenToMath(mouseX, mouseY)

      setDraggablePoints((prev) =>
        prev.map((point) => {
          if (point.id === dragTarget) {
            let newX = mathCoords.x
            let newY = mathCoords.y

            // Constrain limit points
            if (point.id === "leftLimit") {
              newX = Math.max(-5, Math.min(-0.1, newX))
              newY = 0
              onLimitChange(newX, rightLimit)
              // Force immediate redraw during limit dragging
              setTimeout(() => {
                drawGarden()
              }, 0)
            } else if (point.id === "rightLimit") {
              newX = Math.max(0.1, Math.min(6, newX))
              newY = 0
              onLimitChange(leftLimit, newX)
              // Force immediate redraw during limit dragging
              setTimeout(() => {
                drawGarden()
              }, 0)
            } else if (point.id.startsWith("control_")) {
              // Constrain control points to reasonable bounds
              newY = Math.max(0, Math.min(8, newY))
              if (onFunctionPointDrag) {
                onFunctionPointDrag(newX, newY)
              }
            }

            const screenCoords = mathToScreen(newX, newY)
            return {
              ...point,
              x: newX,
              y: newY,
              screenX: screenCoords.x,
              screenY: screenCoords.y,
            }
          }
          return point
        }),
      )
    }

    // Update cursor style
    const canvas_element = canvas
    let isOverDraggable = false
    for (const point of draggablePoints) {
      if (isPointNearMouse(point, mouseX, mouseY)) {
        isOverDraggable = true
        break
      }
    }
    canvas_element.style.cursor = isOverDraggable ? "grab" : "default"
    if (isDragging) {
      canvas_element.style.cursor = "grabbing"
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setDragTarget(null)
    setDraggablePoints((prev) => prev.map((p) => ({ ...p, isDragging: false })))
  }

  // Drawing function
  const drawGarden = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas completely to ensure fresh drawing
    ctx.clearRect(0, 0, width, height)

    // Clear canvas with magical garden background
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, "#FFE4E1") // Soft pink sky
    gradient.addColorStop(0.3, "#E6F3FF") // Light blue
    gradient.addColorStop(0.7, "#F0FFF0") // Light green
    gradient.addColorStop(1, "#98FB98") // Garden green
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Add magical sparkles in the background
    ctx.fillStyle = "rgba(255, 255, 0, 0.3)"
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      ctx.beginPath()
      ctx.arc(x, y, 2, 0, 2 * Math.PI)
      ctx.fill()
    }

    // Draw magical garden path (X-axis)
    ctx.strokeStyle = "#8B4513"
    ctx.lineWidth = 8
    ctx.beginPath()
    ctx.moveTo(50, height - 100)
    ctx.lineTo(width - 50, height - 100)
    ctx.stroke()

    // Draw magical garden fence (Y-axis)
    ctx.strokeStyle = "#8B4513"
    ctx.lineWidth = 8
    ctx.beginPath()
    ctx.moveTo(100, 50)
    ctx.lineTo(100, height - 50)
    ctx.stroke()

    // Add garden decorations
    ctx.fillStyle = "#32CD32"
    ctx.font = "bold 24px Arial"
    ctx.textAlign = "center"
    ctx.fillText("🌱", 50, height - 120) // Left garden marker
    ctx.fillText("🌱", width - 50, height - 120) // Right garden marker
    ctx.fillText("🌿", 80, 40) // Top garden marker

    // Draw magical garden grid (softer and more friendly)
    ctx.strokeStyle = "rgba(144, 238, 144, 0.4)"
    ctx.lineWidth = 2

    // Vertical garden lines
    for (let i = 1; i < 10; i++) {
      const x = 100 + (i / 10) * (width - 200)
      ctx.beginPath()
      ctx.moveTo(x, 50)
      ctx.lineTo(x, height - 50)
      ctx.stroke()
    }

    // Horizontal garden lines
    for (let i = 1; i < 8; i++) {
      const y = 50 + (i / 8) * (height - 150)
      ctx.beginPath()
      ctx.moveTo(100, y)
      ctx.lineTo(width - 50, y)
      ctx.stroke()
    }

    // Add simple number labels for kids
    ctx.fillStyle = "#2E8B57"
    ctx.font = "bold 16px Arial"
    ctx.textAlign = "center"
    
    // X-axis labels (simplified) - Dynamic based on current limits
    for (let i = 0; i <= 5; i++) {
      const x = 100 + (i / 5) * (width - 200)
      const leftVal = Array.isArray(leftLimit) ? leftLimit[0] : leftLimit
      const rightVal = Array.isArray(rightLimit) ? rightLimit[0] : rightLimit
      const value = Math.round(leftVal + (i / 5) * (rightVal - leftVal))
      ctx.fillText(value.toString(), x, height - 80)
    }
    
    // Y-axis labels (simplified)
    ctx.textAlign = "right"
    for (let i = 0; i <= 4; i++) {
      const y = 50 + (i / 4) * (height - 150)
      const value = Math.round(i * 2)
      ctx.fillText(value.toString(), 90, y + 5)
    }

    // Draw magical rainbow fence (function curve) - Dynamic based on current limits
    const func = functions[currentFunction]
    const a = Array.isArray(leftLimit) ? leftLimit[0] : leftLimit
    const b = Array.isArray(rightLimit) ? rightLimit[0] : rightLimit

    // Create rainbow gradient for the fence
    const rainbowGradient = ctx.createLinearGradient(100, 0, width - 100, 0)
    rainbowGradient.addColorStop(0, "#FF0000") // Red
    rainbowGradient.addColorStop(0.2, "#FF8000") // Orange
    rainbowGradient.addColorStop(0.4, "#FFFF00") // Yellow
    rainbowGradient.addColorStop(0.6, "#00FF00") // Green
    rainbowGradient.addColorStop(0.8, "#0080FF") // Blue
    rainbowGradient.addColorStop(1, "#8000FF") // Purple

    ctx.strokeStyle = rainbowGradient
    ctx.lineWidth = 6
    ctx.beginPath()

    for (let x = a; x <= b; x += 0.1) {
      const screenX = 100 + ((x - a) / (b - a)) * (width - 200)
      const screenY = height - 100 - func(x) * 40

      if (x === a) {
        ctx.moveTo(screenX, screenY)
      } else {
        ctx.lineTo(screenX, screenY)
      }
    }
    ctx.stroke()

    // Add magical sparkles along the fence
    ctx.fillStyle = "#FFD700"
    for (let x = a; x <= b; x += 0.5) {
      const screenX = 100 + ((x - a) / (b - a)) * (width - 200)
      const screenY = height - 100 - func(x) * 40
      ctx.beginPath()
      ctx.arc(screenX, screenY, 3, 0, 2 * Math.PI)
      ctx.fill()
    }

    // Add dynamic function indicator with real-time update indicator
    ctx.fillStyle = "#8A2BE2"
    ctx.font = "bold 18px Arial"
    ctx.textAlign = "left"
    ctx.fillText(`f(x) = ${getFunctionDisplay(currentFunction)}`, 120, 30)
    
    // Add real-time update indicator
    if (isDragging) {
      ctx.fillStyle = "#FF6B35"
      ctx.font = "bold 12px Arial"
      ctx.fillText("🔄 Actualizando...", 120, 50)
    }
    
    // Add integration limits display with real-time values
    ctx.fillStyle = "#E74C3C"
    ctx.font = "bold 14px Arial"
    ctx.textAlign = "center"
    ctx.fillText(`a = ${a.toFixed(1)}`, 100 + ((a - a) / (b - a)) * (width - 200), height - 20)
    ctx.fillText(`b = ${b.toFixed(1)}`, 100 + ((b - a) / (b - a)) * (width - 200), height - 20)

    // Draw Riemann rectangles as flower pots
    if (showArea) {
      const n = Array.isArray(partitions) ? partitions[0] : partitions
      const dx = (b - a) / n

      for (let i = 0; i < n; i++) {
        let x: number
        switch (approximationType) {
          case "left":
            x = a + i * dx
            break
          case "right":
            x = a + (i + 1) * dx
            break
          case "middle":
            x = a + (i + 0.5) * dx
            break
        }

        const height_rect = func(x)
        const screenX = 100 + ((a + i * dx - a) / (b - a)) * (width - 200)
        const screenY = height - 100
        const rectWidth = (dx / (b - a)) * (width - 200)
        const rectHeight = height_rect * 40

        // Create magical flower pot colors for kids
        const colors = ["#FF6B9D", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F"]
        const potColor = colors[i % colors.length]

        // Draw magical flower pot (trapezoid shape)
        ctx.fillStyle = potColor
        ctx.beginPath()
        ctx.moveTo(screenX, screenY)
        ctx.lineTo(screenX + rectWidth, screenY)
        ctx.lineTo(screenX + rectWidth * 0.8, screenY - rectHeight)
        ctx.lineTo(screenX + rectWidth * 0.2, screenY - rectHeight)
        ctx.closePath()
        ctx.fill()

        // Add magical border
        ctx.strokeStyle = "#FFD700"
        ctx.lineWidth = 2
        ctx.stroke()

        // Add cute flowers on top
        ctx.fillStyle = "#FF69B4"
        ctx.font = "bold 16px Arial"
        ctx.textAlign = "center"
        ctx.fillText("🌸", screenX + rectWidth/2, screenY - rectHeight - 5)

        // Add happy faces on the pots
        ctx.fillStyle = "#000"
        ctx.font = "bold 14px Arial"
        ctx.fillText("😊", screenX + rectWidth/2, screenY - rectHeight/2)

        // Add measurement dots for kids to understand
        if (approximationType === "left") {
          ctx.fillStyle = "#FF0000"
          ctx.beginPath()
          ctx.arc(screenX + 3, screenY - rectHeight + 3, 4, 0, 2 * Math.PI)
          ctx.fill()
        } else if (approximationType === "right") {
          ctx.fillStyle = "#0000FF"
          ctx.beginPath()
          ctx.arc(screenX + rectWidth - 3, screenY - rectHeight + 3, 4, 0, 2 * Math.PI)
          ctx.fill()
        } else if (approximationType === "middle") {
          ctx.fillStyle = "#00FF00"
          ctx.beginPath()
          ctx.arc(screenX + rectWidth / 2, screenY - rectHeight + 3, 4, 0, 2 * Math.PI)
          ctx.fill()
        }

        // Add real-time update effect to flower pots
        if (isDragging) {
          ctx.strokeStyle = "#FFD700"
          ctx.lineWidth = 3
          ctx.setLineDash([5, 5])
          ctx.strokeRect(screenX, screenY - rectHeight, rectWidth, rectHeight)
          ctx.setLineDash([])
        }

        // Add sparkles for magical effect with density based on accuracy
        if (mode === "free") {
          const sparkleCount = Math.max(1, Math.floor(partitions / 10))
          ctx.fillStyle = "#FFD700"
          for (let j = 0; j < sparkleCount; j++) {
            const sparkleX = screenX + Math.random() * rectWidth
            const sparkleY = screenY - Math.random() * rectHeight
            const sparkleSize = 1 + Math.random() * 2
            ctx.beginPath()
            ctx.arc(sparkleX, sparkleY, sparkleSize, 0, 2 * Math.PI)
            ctx.fill()
          }
        }

        if (approximationType === "left") {
          ctx.fillStyle = "rgba(255, 0, 0, 0.6)"
          ctx.beginPath()
          ctx.arc(screenX + 3, screenY - rectHeight + 3, 2, 0, 2 * Math.PI)
          ctx.fill()
        } else if (approximationType === "right") {
          ctx.fillStyle = "rgba(0, 0, 255, 0.6)"
          ctx.beginPath()
          ctx.arc(screenX + rectWidth - 3, screenY - rectHeight + 3, 2, 0, 2 * Math.PI)
          ctx.fill()
        } else if (approximationType === "middle") {
          ctx.fillStyle = "rgba(0, 255, 0, 0.6)"
          ctx.beginPath()
          ctx.arc(screenX + rectWidth / 2, screenY - rectHeight + 3, 2, 0, 2 * Math.PI)
          ctx.fill()
        }
      }

      // Show additivity by highlighting middle division
      if (n >= 4) {
        const midPoint = Math.floor(n / 2)
        const midScreenX = 100 + ((a + midPoint * dx - a) / (b - a)) * (width - 200)

        ctx.strokeStyle = "rgba(255, 215, 0, 0.8)"
        ctx.lineWidth = 3
        ctx.setLineDash([10, 5])
        ctx.beginPath()
        ctx.moveTo(midScreenX, screenY)
        ctx.lineTo(midScreenX, 50)
        ctx.stroke()
        ctx.setLineDash([])

        // Add labels for additivity
        ctx.fillStyle = "rgba(255, 215, 0, 0.9)"
        ctx.font = "12px Arial"
        ctx.fillText("∫[a,c]", 110, screenY - 10)
        ctx.fillText("∫[c,b]", midScreenX + 10, screenY - 10)
      }
    }

    // Draw draggable points
    draggablePoints.forEach((point) => {
      // Draw point shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)"
      ctx.beginPath()
      ctx.arc(point.screenX + 2, point.screenY + 2, point.size, 0, 2 * Math.PI)
      ctx.fill()

      // Draw point
      ctx.fillStyle = point.isDragging ? "#FFD700" : point.color
      ctx.strokeStyle = "#FFFFFF"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(point.screenX, point.screenY, point.size, 0, 2 * Math.PI)
      ctx.fill()
      ctx.stroke()

      // Draw point label
      ctx.fillStyle = "#333333"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText(point.label, point.screenX, point.screenY - point.size - 5)

      // Draw connection lines for limit points
      if (point.id === "leftLimit" || point.id === "rightLimit") {
        ctx.strokeStyle = point.color
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])
        ctx.beginPath()
        ctx.moveTo(point.screenX, point.screenY)
        ctx.lineTo(point.screenX, 50)
        ctx.stroke()
        ctx.setLineDash([])
      }
    })

    // Draw magical fairy guide for kids
    if (mode === "guided" && tutorialStep > 0) {
      // Fairy body
      ctx.fillStyle = "#FFB6C1"
      ctx.beginPath()
      ctx.arc(50, 50, 12, 0, 2 * Math.PI)
      ctx.fill()

      // Fairy wings
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
      ctx.beginPath()
      ctx.ellipse(40, 45, 10, 15, -0.3, 0, 2 * Math.PI)
      ctx.ellipse(60, 45, 10, 15, 0.3, 0, 2 * Math.PI)
      ctx.fill()

      // Fairy face
      ctx.fillStyle = "#000"
      ctx.font = "bold 16px Arial"
      ctx.textAlign = "center"
      ctx.fillText("🧚‍♀️", 50, 55)

      // Add magical trail
      ctx.strokeStyle = "rgba(255, 215, 0, 0.6)"
      ctx.lineWidth = 3
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(50, 50)
      ctx.lineTo(100, 100)
      ctx.stroke()
      ctx.setLineDash([])
    }

    // Draw hover effects
    if (mode === "free") {
      draggablePoints.forEach((point) => {
        if (isPointNearMouse(point, mousePos.x, mousePos.y) && !isDragging) {
          ctx.strokeStyle = "#FFD700"
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.arc(point.screenX, point.screenY, point.size + 5, 0, 2 * Math.PI)
          ctx.stroke()
        }
      })
    }
  }, [
    width,
    height,
    functions,
    currentFunction,
    leftLimit,
    rightLimit,
    partitions,
    approximationType,
    showArea,
    draggablePoints,
    mode,
    tutorialStep,
    mousePos,
    isDragging,
  ])

  // Optimized animation loop - only redraw when necessary
  useEffect(() => {
    let animationId: number
    let lastDrawTime = 0
    const targetFPS = 30 // Reduce from 60fps to 30fps for better performance
    const frameDelay = 1000 / targetFPS

    const animate = (currentTime: number) => {
      if (currentTime - lastDrawTime >= frameDelay) {
        drawGarden()
        lastDrawTime = currentTime
      }
      animationId = requestAnimationFrame(animate)
    }
    
    animationId = requestAnimationFrame(animate)
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [drawGarden])

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full border-2 border-green-300 rounded-lg cursor-default function-curve rectangles"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      <div
        className="absolute inset-0 pointer-events-none function-curve-overlay"
        style={{ top: "20%", height: "30%" }}
      />
      <div className="absolute inset-0 pointer-events-none rectangles-overlay" style={{ top: "50%", height: "40%" }} />
    </div>
  )
}
