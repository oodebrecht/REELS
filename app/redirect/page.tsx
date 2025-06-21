"use client"

import { useEffect } from "react"

export default function RedirectPage() {
  useEffect(() => {
    const urls = [
      "https://t.me/BotDoBotizinho_bot?start=cmbph4yxz04oznx0strkvz8xd",
      "https://t.me/topdanadinhasbot?start=cmbph5asw04pjnx0s9rjofsih",
      "https://t.me/aacesssevzzzdsssbot?start=start",
      "https://t.me/lliberaracessobot?start=cmbph52iq04pcnx0s2my3pkri",
      "https://t.me/topocultinhosbot?start=start",
      
      
    ]
    const randomIndex = Math.floor(Math.random() * urls.length)
    window.location.href = urls[randomIndex]
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen text-center text-white">
      <p>Redirecionando...</p>
    </div>
  )
}