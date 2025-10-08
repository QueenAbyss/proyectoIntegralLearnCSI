"use client"

import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, User, Lock, Eye, EyeOff, BookOpen, Users } from "lucide-react"

interface LoginFormProps {
  onLogin: (email: string, password: string, role: "student" | "teacher") => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"student" | "teacher">("student")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate login process
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    onLogin(email, password, role)
    setIsLoading(false)
  }

  const demoAccounts = [
    {
      role: "student" as const,
      email: "estudiante@universidad.edu.co",
      password: "estudiante123",
      name: "Estudiante Demo",
      description: "Acceso completo a simulaciones"
    },
    {
      role: "teacher" as const,
      email: "profesor@universidad.edu.co", 
      password: "profesor123",
      name: "Prof. Sergio Demo",
      description: "Panel de control docente"
    }
  ]

  const fillDemoAccount = (account: typeof demoAccounts[0]) => {
    setEmail(account.email)
    setPassword(account.password)
    setRole(account.role)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">IntegraLearn</h1>
          <p className="text-gray-600">
            Software educativo de simulaciones interactivas de integrales
          </p>
        </div>

        {/* Login Form */}
        <Card className="p-6 bg-white/90 backdrop-blur shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700">Tipo de Usuario</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  onClick={() => setRole("student")}
                  variant={role === "student" ? "default" : "outline"}
                  className="flex items-center gap-2 h-12"
                >
                  <BookOpen className="w-4 h-4" />
                  Estudiante
                </Button>
                <Button
                  type="button"
                  onClick={() => setRole("teacher")}
                  variant={role === "teacher" ? "default" : "outline"}
                  className="flex items-center gap-2 h-12"
                >
                  <Users className="w-4 h-4" />
                  Profesor
                </Button>
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                Correo Electrónico
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@universidad.edu.co"
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-12"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Iniciando sesión...
                </div>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <Label className="text-sm font-semibold text-gray-700 mb-3 block">
              Cuentas de Demostración
            </Label>
            <div className="space-y-2">
              {demoAccounts.map((account, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  className="w-full justify-start h-auto p-3"
                  onClick={() => fillDemoAccount(account)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      account.role === "student" 
                        ? "bg-green-100 text-green-600" 
                        : "bg-blue-100 text-blue-600"
                    }`}>
                      {account.role === "student" ? <BookOpen className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-sm">{account.name}</div>
                      <div className="text-xs text-gray-500">{account.description}</div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {account.role === "student" ? "Estudiante" : "Profesor"}
                    </Badge>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Features Preview */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">¿Qué puedes hacer?</h3>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Simulaciones interactivas
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Aprendizaje guiado
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Retroalimentación inmediata
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Temática de hadas
              </div>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Desarrollado para la Universidad de la Amazonia
          </p>
          <p className="text-xs text-gray-400">
            Programa de Ingeniería de Sistemas
          </p>
        </div>
      </div>
    </div>
  )
}


