"use client"

import {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode,
} from "react"
import AgeVerificationModal from "@/components/age-verification-modal"

interface AgeGateContextType {
  isVerified: boolean
  setIsVerified: (value: boolean) => void
}

const AgeGateContext = createContext<AgeGateContextType | undefined>(undefined)

export default function AgeGateProvider({ children }: { children: ReactNode }) {
  const [isVerified, setIsVerified] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isPreloading, setIsPreloading] = useState(true)

  // Simulate preloader on every page load
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsPreloading(false)
          return 100
        }
        return prev + 4
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  // Prevent scrolling while not verified
  useEffect(() => {
    if (!isVerified) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isVerified])

  // Show loading animation
  if (isPreloading) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[9999] text-black text-center p-6">
        <img
          src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcHh0bWR4ZTdubzBhNzd4djN4Z2ttZ3ZsdDVjdmE0bng4bnlkb2VoZyZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/LrR1S5NKtyOWkHV9Gv/giphy.gif"
          alt="Carregando..."
          className="w-16 h-16 mb-4 animate-bounce"
        />
        <h1 className="text-xl font-bold mb-2">Carregando o conteúdo…</h1>
        <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-200"
            style={{ width: `${loadingProgress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-4">{loadingProgress}% concluído…</p>
      </div>
    )
  }

  return (
    <AgeGateContext.Provider value={{ isVerified, setIsVerified }}>
      {!isVerified ? (
        <AgeVerificationModal onVerify={() => setIsVerified(true)} />
      ) : (
        children
      )}
    </AgeGateContext.Provider>
  )
}

export const useAgeGate = () => {
  const context = useContext(AgeGateContext)
  if (context === undefined) {
    throw new Error("useAgeGate must be used within an AgeGateProvider")
  }
  return context
}
