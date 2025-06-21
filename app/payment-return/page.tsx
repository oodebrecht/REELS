"use client"

import { useEffect, useState } from "react"
import { CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function PaymentReturn() {
  const searchParams = useSearchParams()
  const botLink = searchParams.get("bot") || "https://t.me/example_bot"
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    // Facebook Pixel event (commented)
    // if (window.fbq) {
    //   window.fbq('track', 'CompleteRegistration');
    // }

    // Hide confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {showConfetti && (
        <div className="absolute inset-0 z-0">
          {/* This would be replaced with actual confetti animation */}
          <div className="absolute top-0 left-1/4 w-2 h-2 bg-pink-500 animate-fall"></div>
          <div className="absolute top-0 left-1/3 w-3 h-3 bg-purple-500 animate-fall-slow"></div>
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-blue-500 animate-fall-slower"></div>
          <div className="absolute top-0 left-2/3 w-4 h-4 bg-pink-500 animate-fall"></div>
          <div className="absolute top-0 left-3/4 w-2 h-2 bg-purple-500 animate-fall-slow"></div>
          {/* More confetti particles would be added here */}
        </div>
      )}

      <div className="text-center max-w-md mx-auto z-10 bg-gray-900/80 p-8 rounded-2xl backdrop-blur-sm">
        <div className="mb-6 flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Pagamento Confirmado!</h1>
        <p className="text-gray-300 mb-8">
          Seu acesso foi liberado com sucesso! Clique no botão abaixo para acessar o grupo no Telegram e começar a
          aproveitar o conteúdo exclusivo.
        </p>
        <a
          href={botLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full font-bold text-white flex items-center justify-center"
        >
          IR PARA O TELEGRAM
          <ArrowRight className="ml-2 h-5 w-5" />
        </a>

        <div className="mt-8 pt-6 border-t border-gray-800">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    </main>
  )
}
