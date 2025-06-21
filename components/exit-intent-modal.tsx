"use client"

import { useState, useEffect } from "react"
import { X, Gift } from "lucide-react"
import Link from "next/link"

export default function ExitIntentModal() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasShown, setHasShown] = useState(false)

  // Detectar cursor saindo da tela
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true)
        setHasShown(true)
      }
    }

    document.addEventListener("mouseleave", handleMouseLeave)
    return () => document.removeEventListener("mouseleave", handleMouseLeave)
  }, [hasShown])

  // Detectar tentativa de voltar (botão voltar do navegador)
  useEffect(() => {
    const handleBackNavigation = (event: PopStateEvent) => {
      if (!hasShown) {
        setIsVisible(true)
        setHasShown(true)
        window.history.pushState(null, "", window.location.href)
      }
    }

    window.history.pushState(null, "", window.location.href)
    window.addEventListener("popstate", handleBackNavigation)

    return () => {
      window.removeEventListener("popstate", handleBackNavigation)
    }
  }, [hasShown])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 p-6 rounded-2xl max-w-md w-full text-center border border-gray-700 animate-in zoom-in duration-300 relative">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          aria-label="Fechar"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <Gift className="h-12 w-12 mx-auto text-pink-500 mb-3" />
          <h3 className="text-2xl font-bold mb-2 text-white">Espere! Oferta Especial!</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            Antes de sair, que tal garantir seu acesso vitalicio com{" "}
            <span className="text-pink-400 font-bold">75% de desconto</span>?
          </p>
        </div>

        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 rounded-xl mb-6">
          <div className="flex justify-center items-center space-x-2 mb-2">
            <span className="text-gray-400 line-through text-lg">R$ 79,60</span>
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">75% OFF</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">R$ 19,99</div>
          <div className="text-sm text-gray-400">Oferta válida apenas agora!</div>
        </div>

        <div className="space-y-3">
          <Link
            href="/redirect"
            className="block w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full font-bold text-white hover:from-pink-700 hover:to-purple-700 transition-all"
          >
            APROVEITAR DESCONTO EXTRA
          </Link>
          <button
            onClick={() => setIsVisible(false)}
            className="block w-full py-2 text-gray-400 hover:text-white transition-all text-sm"
          >
            Não, obrigado
          </button>
        </div>
      </div>
    </div>
  )
}
