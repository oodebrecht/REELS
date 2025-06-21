"use client"

import { useState, useEffect } from "react"
import { CheckCircle, Users, TrendingUp, Zap, Eye, Clock } from "lucide-react"

export default function PurchaseNotifications() {
  const [currentNotification, setCurrentNotification] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [activeUsers, setActiveUsers] = useState(127)

  // Atualiza o número de usuários ativos
  useEffect(() => {
    const updateActiveUsers = () => {
      setActiveUsers((prevUsers) => {
        const variation = Math.floor(Math.random() * 25) - 8 // -8 a +16
        let newUsers = prevUsers + variation
        newUsers = Math.max(127, Math.min(3691, newUsers))
        return newUsers
      })
    }

    const interval = setInterval(updateActiveUsers, 5000)
    return () => clearInterval(interval)
  }, [])

  const formatNumber = (num: number) => {
    return num.toLocaleString("pt-BR")
  }

  const anonymousNotifications = [
    {
      icon: CheckCircle,
      color: "bg-green-600",
      message: "Acesso liberado há 2 minutos",
    },
    {
      icon: Users,
      color: "bg-blue-600",
      message: `${formatNumber(activeUsers)} pessoas online agora`,
    },
    {
      icon: TrendingUp,
      color: "bg-purple-600",
      message: "Atividade em alta - +127% hoje",
    },
    {
      icon: Zap,
      color: "bg-orange-600",
      message: "⚡ Oferta limitada ativa",
    },
    {
      icon: Eye,
      color: "bg-pink-600",
      message: "Novo conteúdo sendo assistido",
    },
    {
      icon: Clock,
      color: "bg-indigo-600",
      message: "Último acesso há 1 minuto",
    },
  ]

  useEffect(() => {
    const showNotification = () => {
      setIsVisible(true)
      setTimeout(() => setIsVisible(false), 4000)

      setTimeout(() => {
        setCurrentNotification((prev) => (prev + 1) % anonymousNotifications.length)
      }, 6000)
    }

    // Show first notification after 3 seconds
    const initialTimer = setTimeout(showNotification, 3000)

    // Then show every 15 seconds
    const interval = setInterval(showNotification, 15000)

    return () => {
      clearTimeout(initialTimer)
      clearInterval(interval)
    }
  }, [anonymousNotifications.length])

  if (!isVisible) return null

  const notification = anonymousNotifications[currentNotification]
  const Icon = notification.icon

  return (
    <div className="fixed top-20 left-4 right-4 z-40 max-w-md mx-auto">
      <div
        className={`${notification.color} text-white p-3 rounded-lg shadow-lg animate-in slide-in-from-top duration-500`}
      >
        <div className="flex items-center">
          <Icon className="h-5 w-5 mr-2 flex-shrink-0" />
          <div className="text-sm">{notification.message}</div>
        </div>
      </div>
    </div>
  )
}
