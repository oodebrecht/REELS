"use client"

import { useState } from "react"
import { ArrowLeft, Check, Shield, Clock, Users, Star, CreditCard, Smartphone } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    id: "weekly",
    name: "Acesso Semanal",
    price: "R$ 19,90",
    originalPrice: "R$ 39,90",
    discount: "50%",
    features: ["Acesso a todos os conteúdos", "Suporte via Telegram", "Atualizações semanais"],
    popular: false,
    duration: "7 dias de acesso",
    badge: "TESTE",
    color: "from-blue-600 to-blue-700",
  },
  {
    id: "monthly",
    name: "Acesso Mensal",
    price: "R$ 49,90",
    originalPrice: "R$ 149,90",
    discount: "67%",
    features: ["Acesso a todos os conteúdos", "Suporte prioritário", "Atualizações semanais", "Conteúdos exclusivos"],
    popular: true,
    duration: "30 dias de acesso",
    badge: "MAIS POPULAR",
    color: "from-pink-600 to-purple-600",
  },
  {
    id: "lifetime",
    name: "Acesso Vitalício",
    price: "R$ 147,00",
    originalPrice: "R$ 497,00",
    discount: "70%",
    features: [
      "Acesso vitalício a todos os conteúdos",
      "Suporte VIP",
      "Atualizações ilimitadas",
      "Conteúdos exclusivos",
      "Acesso antecipado a novidades",
    ],
    popular: false,
    duration: "Acesso permanente",
    badge: "MELHOR VALOR",
    color: "from-green-600 to-green-700",
  },
]

const paymentMethods = [
  { id: "pix", name: "PIX", icon: Smartphone, description: "Aprovação instantânea" },
  { id: "card", name: "Cartão", icon: CreditCard, description: "Até 12x sem juros" },
]

export default function Checkout() {
  const [selectedPlan, setSelectedPlan] = useState("monthly")
  const [selectedPayment, setSelectedPayment] = useState("pix")
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayment = () => {
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      // Facebook Pixel event (commented)
      // if (window.fbq) {
      //   window.fbq('track', 'Purchase', {
      //     value: plans.find(p => p.id === selectedPlan)?.price.replace('R$ ', '').replace(',', '.'),
      //     currency: 'BRL'
      //   });
      // }

      window.location.href = "/redirect"
    }, 2000)
  }

  const selectedPlanData = plans.find((p) => p.id === selectedPlan)

  return (
    <main className="min-h-screen bg-black text-white pb-16">
      <header className="fixed top-0 w-full bg-black/90 backdrop-blur-sm z-50 p-4 flex items-center border-b border-gray-800">
        <Link href="/" className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-bold">Escolha seu Plano</h1>
      </header>

      <div className="pt-20 px-4 pb-4 max-w-md mx-auto">
        {/* Trust Indicators */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            ))}
            <span className="ml-2 text-white text-sm font-bold">4.9/5 (2.847 avaliações)</span>
          </div>
          <div className="flex justify-center items-center space-x-4 text-xs text-gray-400">
            <div className="flex items-center">
              <Shield className="h-3 w-3 mr-1" />
              SSL Seguro
            </div>
            <div className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              +10k usuários
            </div>
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Acesso imediato
            </div>
          </div>
        </div>

        <p className="text-gray-300 mb-6 text-center text-sm">
          Escolha o plano que melhor se adapta às suas necessidades e tenha acesso a conteúdos exclusivos.
        </p>

        {/* Plans */}
        <div className="space-y-4 mb-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`border rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                selectedPlan === plan.id
                  ? "border-pink-500 bg-gradient-to-br from-purple-900/30 to-pink-900/30 shadow-lg shadow-pink-500/20"
                  : "border-gray-800 bg-gray-900/30 hover:border-gray-700"
              } ${plan.popular ? "relative" : ""}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.badge && (
                <div
                  className={`absolute -top-3 right-4 bg-gradient-to-r ${plan.color} px-3 py-1 rounded-full text-xs font-bold`}
                >
                  {plan.badge}
                </div>
              )}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg">{plan.name}</h3>
                  <div className="text-xs text-gray-400">{plan.duration}</div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400 line-through text-sm">{plan.originalPrice}</span>
                    <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                      {plan.discount} OFF
                    </span>
                  </div>
                  <div className="text-xl font-bold text-white">{plan.price}</div>
                </div>
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-4 text-center">Forma de Pagamento</h3>
          <div className="grid grid-cols-2 gap-3">
            {paymentMethods.map((method) => {
              const Icon = method.icon
              return (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    selectedPayment === method.id
                      ? "border-pink-500 bg-pink-900/20"
                      : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                  }`}
                >
                  <Icon className="h-6 w-6 mx-auto mb-2" />
                  <div className="font-bold text-sm">{method.name}</div>
                  <div className="text-xs text-gray-400">{method.description}</div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Order Summary */}
        {selectedPlanData && (
          <div className="bg-gray-900/50 border border-gray-700 p-4 rounded-xl mb-6">
            <h4 className="font-bold mb-3">Resumo do Pedido</h4>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">{selectedPlanData.name}</span>
              <span className="font-bold">{selectedPlanData.price}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-400 mb-3">
              <span>Desconto ({selectedPlanData.discount})</span>
              <span className="text-green-400">
                -
                {(
                  Number.parseFloat(selectedPlanData.originalPrice.replace("R$ ", "").replace(",", ".")) -
                  Number.parseFloat(selectedPlanData.price.replace("R$ ", "").replace(",", "."))
                )
                  .toFixed(2)
                  .replace(".", ",")}{" "}
                R$
              </span>
            </div>
            <div className="border-t border-gray-700 pt-3 flex justify-between items-center font-bold text-lg">
              <span>Total</span>
              <span className="text-pink-400">{selectedPlanData.price}</span>
            </div>
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className={`w-full py-4 rounded-full font-bold text-white text-lg transition-all duration-300 ${
            isProcessing
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 transform hover:scale-105 shadow-lg"
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processando...
            </div>
          ) : (
            `FAZER PAGAMENTO - ${selectedPlanData?.price}`
          )}
        </button>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Shield className="h-4 w-4 text-green-500 mr-2" />
            <span className="text-green-500 text-sm font-medium">Pagamento 100% seguro</span>
          </div>
          <p className="text-xs text-gray-500">
            Seus dados são protegidos com criptografia SSL 256-bit. Processamento discreto e anônimo.
          </p>
        </div>
      </div>
    </main>
  )
}
