"use client"

import { useState } from "react"
import { Shield, AlertTriangle, Calendar, X, Lock } from "lucide-react"

interface AgeVerificationModalProps {
  onVerify: () => void
}

export default function AgeVerificationModal({ onVerify }: AgeVerificationModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirmAge = () => {
    setIsLoading(true)
    setTimeout(() => {
      localStorage.setItem("age-verified", "true")
      setIsLoading(false)
      onVerify()
    }, 1000)
  }

  const handleExit = () => {
    window.location.href = "https://www.google.com"
  }

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[9999] p-4">
      <div className="bg-gray-900 rounded-2xl max-w-md w-full p-8 text-center border border-gray-700 shadow-2xl animate-in zoom-in duration-500">
        {/* Warning Icon */}
        <div className="mb-6">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center shadow-lg">
            <AlertTriangle className="h-10 w-10 text-white" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-extrabold text-white mb-4">Verificação de Idade</h2>

        {/* Warning Message */}
<div className="bg-red-900/30 border border-red-700 rounded-xl p-4 mb-6">
  <div className="flex items-center justify-center mb-2">
    <AlertTriangle className="h-4 w-4 text-red-300 mr-2" />
    <p className="text-red-300 text-[10px] font-medium tracking-tight uppercase">
      Conteúdo restrito para maiores de 18 anos
    </p>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            Este site contém material exclusivamente para adultos. Ao continuar, você confirma que tem pelo menos 18 anos de idade.
          </p>
        </div>

        {/* Age Confirmation */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-3">
            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-gray-300 text-sm">Confirmação necessária</span>
          </div>
          <p className="text-white font-semibold text-lg mb-1">Você tem 18 anos ou mais?</p>
          <p className="text-gray-400 text-xs">Clique em confirmar para acessar o conteúdo com segurança</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
  onClick={handleConfirmAge}
  disabled={isLoading}
  className="w-full py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full font-bold text-black hover:from-yellow-500 hover:to-yellow-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
>
  {isLoading ? (
    <>
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
      Verificando...
    </>
  ) : (
    <>
      <Shield className="h-5 w-5 mr-2 text-black" />
      SIM, TENHO 18 ANOS OU MAIS
    </>
  )}
</button>

          <button
            onClick={handleExit}
            disabled={isLoading}
            className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-full font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <X className="h-4 w-4 mr-2" />
            NÃO, SAIR DO SITE
          </button>
        </div>

        {/* Legal Notice */}
        <div className="mt-6 pt-4 border-t border-gray-700">
          <p className="text-xs text-gray-500 leading-relaxed">
            Ao confirmar sua idade, você declara estar ciente da natureza do conteúdo e assume total responsabilidade pelo acesso ao mesmo.
          </p>
        </div>

        {/* Privacy Notice */}
        <div className="mt-4 flex items-center justify-center">
          <Lock className="h-3 w-3 text-gray-600 mr-1" />
          <p className="text-xs text-gray-600">Sua navegação é segura e 100% privada</p>
        </div>
      </div>
    </div>
  )
}
