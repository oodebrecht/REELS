"use client"

import { useState, useEffect } from "react"
import { ShoppingCart, X, Zap } from "lucide-react"
import Link from "next/link"

export default function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight

      // Show after scrolling 50% of viewport height
      if (scrollPosition > windowHeight * 1.5 && !isDismissed) {
        setIsVisible(true)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isDismissed])

  if (!isVisible || isDismissed) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-4 rounded-2xl shadow-2xl border border-pink-500/20 animate-in slide-in-from-bottom duration-500">
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute top-2 right-2 text-white/70 hover:text-white"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center justify-between">
          <div className="flex-1 mr-3">
            <div className="flex items-center mb-1">
              <Zap className="h-4 w-4 text-white mr-1" />
              <div className="text-white font-bold text-sm">SUPER COMBO! + De 20 Mil Vídeos</div>
            </div>
            <div className="text-white/90 text-xs">70% OFF - Apenas R$ 29,90</div>
          </div>

          <Link
            href="/redirect"
            className="bg-white text-pink-600 px-4 py-2 rounded-full font-bold text-sm flex items-center hover:bg-gray-100 transition-all transform hover:scale-105"
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            COMPRAR
          </Link>
        </div>
      </div>
    </div>
  )
}
