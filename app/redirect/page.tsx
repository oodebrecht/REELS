"use client"

import { useEffect } from "react"

export default function RedirectPage() {
  useEffect(() => {
    const urls = [
      "https://clipeporno.com/bot",
      
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
