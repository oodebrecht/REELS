"use client"

import { useEffect } from "react"

export default function RedirectPage() {
  useEffect(() => {
    const urls = [
      "https://t.me/BrazaPacksBot?start=cmbph2ijs04hlnx0s2tbkg3qj",
      "https://t.me/topdanadinhasbot?start=cmbph5asw04pjnx0s9rjofsih",
      "https://t.me/MeiaNoveBot?start=cmbph52iq04pcnx0s2my3pkri",
      "https://t.me/BlazaFilmesBot?start=start",
      "https://t.me/TheBricsBot?start=start",
      "https://t.me/addlist/SpWRdb4MCWc1NzVh",
      
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
