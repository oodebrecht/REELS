"use client"

import {
  Check,
  Star,
  ShoppingCart,
  Users,
  Clock,
  Shield,
  Gift,
  AlertTriangle
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function ProductSection() {
  const [liveViewers, setLiveViewers] = useState(2847)

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveViewers((prev) => {
        const change = Math.floor(Math.random() * 20) - 10 // entre -10 e +9
        let updated = prev + change
        if (updated < 2700) updated = 2700
        if (updated > 3000) updated = 3000
        return updated
      })
    }, Math.floor(Math.random() * 3000) + 3000) // entre 3 e 6 segundos

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-black px-4 py-8">
      {/* Social Proof */}
      <div className="text-center mb-8">
        <div className="flex justify-center items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
          ))}
          <span className="ml-2 text-white font-bold">4.9/5</span>
        </div>
        <p className="text-gray-400 text-sm">Mais de 31.000 Membros Ativos</p>
        <div className="flex justify-center items-center mt-2">
          <Users className="h-4 w-4 text-green-500 mr-1" />
          <span className="text-green-500 text-sm font-medium">
            {liveViewers.toLocaleString("pt-BR")} pessoas assistindo agora
          </span>
        </div>
      </div>

      {/* What You Get Section */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-6 text-center text-white">O que você vai receber:</h3>

        <div className="space-y-4">
          <div className="flex items-start bg-gray-800/50 p-4 rounded-xl">
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-2 rounded-lg mr-3 flex-shrink-0">
              <Check className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-white mb-1">Acesso Vitalício</h4>
              <p className="text-sm text-gray-300">
                Pague uma vez e tenha acesso para sempre a todo o conteúdo exclusivo! São mais de 20 Mil Vídeos completos, todos divididos por categoria, prontos para assistir! Liberado trocar mensagens, audios, vídeos, fotos e muito mais...
              </p>
            </div>
          </div>

          <div className="flex items-start bg-gray-800/50 p-4 rounded-xl">
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-2 rounded-lg mr-3 flex-shrink-0">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-white mb-1">+ De 3.609 Horas de Conteúdo Completo</h4>
              <p className="text-sm text-gray-300">Cansado de comprar um conteúdo e só ver prévias? Aqui os vídeos são complesto! Ao adquirir você leva um grupo com várias categorias diferentes, São mais de 20 Mil Vídeos já postados prontos para assistir...</p>
            </div>
          </div>

          <div className="flex items-start bg-gray-800/50 p-4 rounded-xl">
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-2 rounded-lg mr-3 flex-shrink-0">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-white mb-1">Grupo VIP no Telegram + Bônus Sites Ocultos</h4>
              <p className="text-sm text-gray-300">Achou que acabou? Tem mais... Ao adquirir a ZONA VIP BRASIL, Além de levar o grupo vip mais completo do telegram você leva um super pack de sites como bônus! Ao todo são 6 sites com vídeos completos! Assim como nos grupos, esses sites também são divididos por categorias.</p>
            </div>
          </div>

          <div className="flex items-start bg-gray-800/50 p-4 rounded-xl">
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-2 rounded-lg mr-3 flex-shrink-0">
              <Gift className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-white mb-1">Atualizações Gratuitas - Sem anúncios!</h4>
              <p className="text-sm text-gray-300">Assim como no grupo vip da ZONA VIP BRASIL, como também nos sites que você irá receber de bônus ao adquirir, você receberá atualizações gratuitas todos os dias! Além de não fazermos novas ofertas para você, ou seja, sem anúncios... Te daremos 7 dias de garantia. Pague, entre e teste sem compromisso! Tá esperando o que? Entre agora mesmo para a ZONA, antes que a ZONA feche...</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-2xl mb-6 border border-gray-700">
        <div className="text-center mb-4">
          <div className="flex justify-center items-center mb-2">
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
              OFERTA LIMITADA
            </span>
          </div>
          <div className="flex justify-center items-center space-x-2 mb-2">
            <span className="text-gray-400 line-through text-lg">R$ 99,65</span>
            <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">70% OFF</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">R$29,90</div>
          <div className="text-sm text-gray-400 mb-4">Pagamento único - Sem mensalidades</div>
        </div>

        <Link
          href="/redirect"
          className="block w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full font-bold text-white text-center flex items-center justify-center text-lg hover:from-pink-700 hover:to-purple-700 transition-all transform hover:scale-105"
        >
          <ShoppingCart className="mr-2 h-6 w-6" />
          GARANTIR MEU ACESSO TOTAL
        </Link>

        <div className="flex items-center justify-center mt-4">
          <Shield className="h-4 w-4 text-green-500 mr-2" />
          <span className="text-green-500 text-sm font-medium">Garantia de 7 dias ou seu dinheiro de volta</span>
        </div>
      </div>

      {/* Urgency Section */}
      <div className="bg-red-900/20 border border-red-800 p-4 rounded-xl text-center">
        <div className="flex justify-center items-center text-red-400 font-bold mb-2">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <h4 className="">ATENÇÃO: Oferta por tempo limitado!</h4>
        </div>
        <p className="text-gray-300 text-sm">
          Esta promoção pode sair do ar a qualquer momento. Não perca esta oportunidade única!
        </p>
      </div>
    </div>
  )
}