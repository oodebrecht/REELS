"use client"

import { useState, useEffect } from "react"
import VideoPlayer from "@/components/video-player"
import ProductSection from "@/components/product-section"
import StickyCTA from "@/components/sticky-cta"
import EnhancedNotifications from "@/components/enhanced-notifications"
import ExitIntentModal from "@/components/exit-intent-modal"
import ProgressIndicator from "@/components/progress-indicator"
import { videoData } from "@/lib/data"
import { Play } from "lucide-react"

export default function Home() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    const handleContextMenu = (e: MouseEvent) => e.preventDefault()
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
        (e.ctrlKey && e.key === "U")
      ) {
        e.preventDefault()
      }
    }

    document.addEventListener("contextmenu", handleContextMenu)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      clearTimeout(timeout)
      document.removeEventListener("contextmenu", handleContextMenu)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const nextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videoData.length)
  }

  const prevVideo = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + videoData.length) % videoData.length)
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-pink-500 border-opacity-70 mx-auto mb-4"></div>
          <p className="text-sm text-gray-400">Carregando acesso privado...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <ProgressIndicator />

      <header className="fixed top-0 w-full bg-black/90 backdrop-blur-sm z-50 p-4 border-b border-gray-800">
        <div className="max-w-md mx-auto flex justify-center">
          <h1 className="text-xl font-bold text-center">ZONA VIP BRASIL</h1>
        </div>
      </header>

      <div className="pt-16 max-w-md mx-auto">
        <div className="px-4 py-6 bg-gradient-to-b from-black via-gray-900 to-black">
          <div className="text-center mb-4">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-1 w-20 mx-auto mb-3"></div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight mb-2">
              CONTEÚDO EXCLUSIVO E
              <span className="block bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                100% ANÔNIMO
              </span>
            </h1>
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-1 w-32 mx-auto mb-4"></div>
            <div className="flex items-center justify-center mb-2">
              <Play className="h-4 w-4 text-gray-300 mr-2" />
              <p className="text-gray-300 text-sm md:text-base">Prévia gratuita de 1 minuto</p>
            </div>
            <p className="text-pink-400 text-sm font-bold">ZONA VIP BRASIL: Tudo Dividido Por Categorias!</p>
          </div>
        </div>

        <div className="relative">
          <VideoPlayer
            video={videoData[currentVideoIndex]}
            onNext={nextVideo}
            onPrev={prevVideo}
            currentIndex={currentVideoIndex}
            totalVideos={videoData.length}
          />
        </div>

        <ProductSection />

        <footer className="bg-gray-900 px-4 py-8 border-t border-gray-800">
          <div className="text-center">
            <div className="flex justify-center space-x-4 mb-4">
              <img src="/placeholder.svg?height=30&width=50&text=SSL" alt="SSL Seguro" className="h-8 opacity-70" />
              <img src="/placeholder.svg?height=30&width=50&text=VISA" alt="Visa" className="h-8 opacity-70" />
              <img src="/placeholder.svg?height=30&width=50&text=MASTER" alt="Mastercard" className="h-8 opacity-70" />
              <img src="/placeholder.svg?height=30&width=50&text=PIX" alt="PIX" className="h-8 opacity-70" />
            </div>
            <p className="text-xs text-gray-500 mb-2">© 2024 Acesso Privado. Navegação 100% anônima.</p>
            <p className="text-xs text-gray-600">Privacidade garantida • Suporte discreto 24/7</p>
            <p className="text-xs text-gray-600 text-justify">
              Ao utilizar esta plataforma, você concorda automaticamente com nossos <strong>Termos de Uso</strong> e nossa <strong>Política de Privacidade</strong>, disponíveis para leitura e aceitação. É essencial que o usuário compreenda plenamente as responsabilidades, obrigações e limitações previstas nestes documentos, sendo o acesso e uso deste site restritos apenas a maiores de 18 anos.
              <br />
              Esclarecemos que este site <strong>não hospeda</strong> nem armazena fisicamente qualquer vídeo. Todo o conteúdo exibido aqui provém de fontes públicas e já disponíveis na internet, como: xGroovy, PornHub, Xvideos, Xpaja, DarknessPorn, ThisVid, Erome, entre outros. Atuamos unicamente como uma plataforma que <strong>exibe diretamente</strong> estes vídeos em nossos players, sem redirecionar o usuário para as páginas de origem, e sem qualquer vínculo ou relação direta com os provedores originais.
              <br />
              Caso algum usuário deseje remover um vídeo exibido nesta página, deverá entrar em contato diretamente com o provedor responsável pela hospedagem do conteúdo ou utilizar os serviços de remoção de indexação de buscadores como o Google. Para contato sobre questões relacionadas à exibição ou solicitação de remoção, utilize nosso canal de suporte: <a href="mailto:30tame@punkproof.com" className="underline">30tame@punkproof.com</a>.
              <br />
              Esta plataforma <strong>repudia veementemente</strong> qualquer prática ilegal ou criminosa, incluindo, mas não se limitando a, pornografia infantil, zoofilia, abuso sexual ou qualquer forma de exploração. Qualquer conteúdo que infrinja a legislação brasileira será removido assim que tomado conhecimento.
              <br />
              Todos os vídeos de fetiches apresentados neste site são <strong>100% encenados</strong> e representam apenas atuações artísticas e fictícias de práticas consensuais. É responsabilidade do usuário compreender a natureza do conteúdo.
              <br />
              Este site utiliza tecnologia de proteção avançada contra cópia e rastreamento indevido de conteúdo.
            </p>
          </div>
        </footer>
      </div>

      <StickyCTA />
      <EnhancedNotifications />
      <ExitIntentModal />
    </main>
  )
}
