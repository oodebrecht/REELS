"use client"

import { useState, useEffect } from "react"
import { CheckCircle, X, Zap, Users, TrendingUp, Eye, Clock, Shield } from "lucide-react"

export default function EnhancedNotifications() {
  const [currentNotification, setCurrentNotification] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [activeUsers, setActiveUsers] = useState(127)

  // Atualiza o número de usuários ativos
  useEffect(() => {
    const updateActiveUsers = () => {
      setActiveUsers((prevUsers) => {
        const variation = Math.floor(Math.random() * 31) - 10 // -10 a +20
        let newUsers = prevUsers + variation
        newUsers = Math.max(127, Math.min(3691, newUsers))
        return newUsers
      })
    }

    const interval = setInterval(updateActiveUsers, 4000)
    return () => clearInterval(interval)
  }, [])

  const formatNumber = (num: number) => {
    return num.toLocaleString("pt-BR")
  }

  const notifications = [
    {
      type: "purchase",
      icon: CheckCircle,
      color: "bg-green-600",
      message: "Novo acesso liberado há poucos minutos",
    },
    {
      type: "viewing",
      icon: Eye,
      color: "bg-blue-600",
      message: `${formatNumber(activeUsers)} pessoas assistindo agora`,
    },
    {
      type: "trending",
      icon: TrendingUp,
      color: "bg-purple-600",
      message: "Conteúdo em alta: 89% de aprovação",
    },
    {
      type: "limited",
      icon: Zap,
      color: "bg-orange-600",
      message: "Restam apenas 18 vagas com desconto",
    },
    {
      type: "activity",
      icon: Users,
      color: "bg-pink-600",
      message: "Pico de atividade: +156% de acessos hoje",
    },
    {
      type: "recent",
      icon: Clock,
      color: "bg-indigo-600",
      message: "3 novos acessos nos últimos 5 minutos",
    },
    {
      type: "secure",
      icon: Shield,
      color: "bg-gray-600",
      message: "Acesso 100% anônimo e seguro",
    },
  ]

  useEffect(() => {
    if (isDismissed) return

    const showNotification = () => {
      setIsVisible(true)
      setTimeout(() => setIsVisible(false), 4000)

      setTimeout(() => {
        setCurrentNotification((prev) => (prev + 1) % notifications.length)
      }, 6000)
    }

    // Show first notification after 3 seconds
    const initialTimer = setTimeout(showNotification, 3000)

    // Then show every 12 seconds
    const interval = setInterval(showNotification, 12000)

    return () => {
      clearTimeout(initialTimer)
      clearInterval(interval)
    }
  }, [isDismissed, notifications.length])

  if (!isVisible || isDismissed) return null

  const notification = notifications[currentNotification]
  const Icon = notification.icon

  return (
    <div className="fixed top-20 left-4 right-4 z-40 max-w-md mx-auto">
      <div
        className={`${notification.color} text-white p-3 rounded-lg shadow-lg animate-in slide-in-from-top duration-500 relative`}
      >
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute top-1 right-1 text-white/70 hover:text-white"
          aria-label="Fechar notificação"
        >
          <X className="h-3 w-3" />
        </button>

        <div className="flex items-center">
          <Icon className="h-5 w-5 mr-2 flex-shrink-0" />
          <div className="text-sm">{notification.message}</div>
        </div>
      </div>
    </div>
  )
}
