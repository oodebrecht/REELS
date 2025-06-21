"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import {
  Play,
  Pause,
  ChevronUp,
  ChevronDown,
  Lock,
  Loader2,
  AlertCircle,
  Volume2,
  VolumeX,
  Heart,
  Share2,
  Check,
} from "lucide-react"
import Link from "next/link"

interface VideoPlayerProps {
  video: {
    id: string
    title: string
    description: string
    views: string
    thumbnail: string
    videoUrl: string
    duration: string
  }
  onNext?: () => void
  onPrev?: () => void
  currentIndex?: number
  totalVideos?: number
}

// Global state to track preview time for each video individually
const videoPreviewState: { [videoId: string]: { timeWatched: number; hasExceeded: boolean } } = {}

export default function VideoPlayer({ video, onNext, onPrev, currentIndex, totalVideos }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [showTimeUpModal, setShowTimeUpModal] = useState(false)
  const [hasWatchedPreview, setHasWatchedPreview] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [buffering, setBuffering] = useState(false)
  const [generatedThumbnail, setGeneratedThumbnail] = useState<string | null>(null)
  const [corsError, setCorsError] = useState(false)
  const [showShareFeedback, setShowShareFeedback] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const [videoCurrentTime, setVideoCurrentTime] = useState(0)
  const [isGif, setIsGif] = useState(false)
  const [gifElement, setGifElement] = useState<HTMLImageElement | null>(null)
  const [volume, setVolume] = useState(0.7) // Default volume at 70%
  const [showPreviewWarning, setShowPreviewWarning] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const gifContainerRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const PREVIEW_TIME = 60 // 60 seconds preview
  const WARNING_TIME = 45 // Show warning at 45 seconds
  const minSwipeDistance = 50

  // Placeholder video URL - this ensures we always have a video to play
  const fallbackVideoUrl = "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"

  // Auto-hide controls
  const resetControlsTimeout = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    setShowControls(true)
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
  }, [isPlaying])

  // Check if URL is a GIF
  const checkIfGif = useCallback((url: string) => {
    return url.toLowerCase().endsWith(".gif") || url.toLowerCase().includes(".gif")
  }, [])

  useEffect(() => {
    // Check if the current video is a GIF
    const currentIsGif = checkIfGif(video.videoUrl)
    setIsGif(currentIsGif)

    // Initialize or restore video state for THIS specific video
    if (!videoPreviewState[video.id]) {
      videoPreviewState[video.id] = {
        timeWatched: 0,
        hasExceeded: false,
      }
    }

    const currentVideoState = videoPreviewState[video.id]

    // Set current time based on saved state for THIS video
    setCurrentTime(currentVideoState.timeWatched)
    setHasWatchedPreview(currentVideoState.hasExceeded)

    // If THIS video already exceeded the preview time, show modal immediately
    if (currentVideoState.hasExceeded) {
      setShowTimeUpModal(true)
    } else {
      setShowTimeUpModal(false)
    }

    // Reset other states
    setIsPlaying(false)
    setIsLoading(true)
    setLoadError(false)
    setBuffering(false)
    setGeneratedThumbnail(null)
    setCorsError(false)
    setIsNavigating(false)
    setShowPreviewWarning(false)
    setLikeCount(Math.floor(Math.random() * 1000) + 100)

    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    // Reset video element
    if (videoRef.current && !currentIsGif) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
      videoRef.current.volume = volume
      videoRef.current.load()
    }

    // Handle GIF loading
    if (currentIsGif) {
      loadGif(video.videoUrl)
    }
  }, [video.id, video.videoUrl, checkIfGif, volume])

  // Load and handle GIF
  const loadGif = (url: string) => {
    // Create a new image element for the GIF
    const img = new Image()
    img.onload = () => {
      setIsLoading(false)
      setLoadError(false)
      setGifElement(img)

      // Auto-start GIF "playback" (for timer purposes)
      if (!hasWatchedPreview) {
        setIsPlaying(true)
      }
    }

    img.onerror = () => {
      setIsLoading(false)
      setLoadError(true)
      console.error("Failed to load GIF:", url)
    }

    // Set crossOrigin to allow generating thumbnails from external sources
    img.crossOrigin = "anonymous"
    img.src = url
  }

  // Separate useEffect for timeupdate listener
  useEffect(() => {
    if (isGif) return // Skip for GIFs

    const videoElement = videoRef.current
    if (!videoElement) return

    const handleTimeUpdate = () => {
      if (isPlaying) {
        const currentVideoTime = Math.floor(videoElement.currentTime)
        setVideoCurrentTime(currentVideoTime)
      }
    }

    videoElement.addEventListener("timeupdate", handleTimeUpdate)

    return () => {
      videoElement.removeEventListener("timeupdate", handleTimeUpdate)
    }
  }, [isPlaying, isGif])

  useEffect(() => {
    // Only start timer if this specific video hasn't exceeded preview time
    if (isPlaying && !hasWatchedPreview) {
      timerRef.current = setInterval(() => {
        if (isGif || videoRef.current) {
          // For GIFs, we just increment time since there's no actual playback
          const realTime = isGif ? currentTime + 1 : Math.floor(videoRef.current!.currentTime)

          if (!isGif) {
            setVideoCurrentTime(realTime)
          }

          setCurrentTime((prev) => {
            const newTime = isGif ? prev + 1 : Math.max(prev, realTime)

            // Update global state for THIS specific video
            videoPreviewState[video.id].timeWatched = newTime

            // Show warning at 45 seconds
            if (newTime >= WARNING_TIME && newTime < PREVIEW_TIME) {
              setShowPreviewWarning(true)
            }

            if (newTime >= PREVIEW_TIME) {
              setIsPlaying(false)
              setShowTimeUpModal(true)
              setHasWatchedPreview(true)
              setShowPreviewWarning(false)

              // Mark THIS video as exceeded in global state
              videoPreviewState[video.id].hasExceeded = true

              if (!isGif && videoRef.current) {
                videoRef.current.pause()
              }

              if (timerRef.current) {
                clearInterval(timerRef.current)
              }
            }
            return newTime
          })
        }
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isPlaying, hasWatchedPreview, video.id, isGif, currentTime])

  // Mouse/touch activity detection
  useEffect(() => {
    const handleActivity = () => {
      resetControlsTimeout()
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("mousemove", handleActivity)
      container.addEventListener("touchstart", handleActivity)
      container.addEventListener("click", handleActivity)
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleActivity)
        container.removeEventListener("touchstart", handleActivity)
        container.removeEventListener("click", handleActivity)
      }
    }
  }, [resetControlsTimeout])

  const togglePlay = () => {
    if (loadError) {
      if (isGif) {
        // Retry loading the GIF
        loadGif(video.videoUrl)
        return
      }

      if (videoRef.current) {
        videoRef.current.load()
        setLoadError(false)
        setIsLoading(true)
      }
      return
    }

    // Check if THIS specific video has exceeded preview time
    if (hasWatchedPreview) {
      setShowTimeUpModal(true)
      return
    }

    if (isGif) {
      // For GIFs, we just toggle the playing state
      setIsPlaying(!isPlaying)
      return
    }

    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      } else {
        // Restore video position from our saved time for THIS video
        const savedTime = videoPreviewState[video.id].timeWatched
        if (savedTime > 0) {
          videoRef.current.currentTime = savedTime
        }

        // Ensure video is not muted when playing and set volume
        videoRef.current.muted = isMuted
        videoRef.current.volume = volume

        const playPromise = videoRef.current.play()

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true)
            })
            .catch((error) => {
              console.error("Error playing video:", error)
              setIsPlaying(false)
            })
        }
      }
    }
  }

  const toggleMute = () => {
    if (isGif) return // GIFs don't have sound

    if (videoRef.current) {
      const newMutedState = !isMuted
      videoRef.current.muted = newMutedState
      setIsMuted(newMutedState)

      // Show volume slider briefly when unmuting
      if (!newMutedState) {
        setShowVolumeSlider(true)
        setTimeout(() => setShowVolumeSlider(false), 3000)
      }
    }
  }

  const handleVolumeChange = (newVolume: number) => {
    if (isGif) return // GIFs don't have sound

    if (videoRef.current) {
      videoRef.current.volume = newVolume
      setVolume(newVolume)
      if (newVolume === 0) {
        setIsMuted(true)
        videoRef.current.muted = true
      } else if (isMuted) {
        setIsMuted(false)
        videoRef.current.muted = false
      }
    }
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))

    // Enhanced haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50])
    }

    // Create multiple heart animations for better effect
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.width / 2
      const centerY = rect.height / 2

      // Create 3 hearts with slight variations
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          createHeartAnimation(centerX + (Math.random() - 0.5) * 100, centerY + (Math.random() - 0.5) * 100)
        }, i * 100)
      }
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: video.description,
          url: window.location.href,
        })
        setShowShareFeedback(true)
        setTimeout(() => setShowShareFeedback(false), 2000)
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        setShowShareFeedback(true)
        setTimeout(() => setShowShareFeedback(false), 2000)
      } catch (error) {
        console.log("Error copying to clipboard:", error)
      }
    }
  }

  const handleNavigation = (direction: "prev" | "next") => {
    setIsNavigating(true)
    setTimeout(() => setIsNavigating(false), 300)

    if (direction === "prev") {
      onPrev?.()
    } else {
      onNext?.()
    }
  }

  const generateThumbnail = useCallback(() => {
    if (isGif && gifElement) {
      try {
        // Generate thumbnail from GIF
        const canvas = document.createElement("canvas")
        canvas.width = gifElement.width
        canvas.height = gifElement.height
        const ctx = canvas.getContext("2d")

        if (ctx) {
          ctx.drawImage(gifElement, 0, 0, canvas.width, canvas.height)
          const thumbnailUrl = canvas.toDataURL("image/jpeg", 0.8)
          setGeneratedThumbnail(thumbnailUrl)
        }
      } catch (error) {
        console.warn("Cannot generate thumbnail from GIF due to CORS policy:", error)
        setCorsError(true)
      }
      return
    }

    if (videoRef.current && !generatedThumbnail && !corsError) {
      const video = videoRef.current
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      if (ctx) {
        try {
          // Set canvas size to match video dimensions
          canvas.width = video.videoWidth || 360
          canvas.height = video.videoHeight || 640

          // Draw the current frame
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

          // Convert to data URL
          const thumbnailUrl = canvas.toDataURL("image/jpeg", 0.8)
          setGeneratedThumbnail(thumbnailUrl)
        } catch (error) {
          console.warn("Cannot generate thumbnail due to CORS policy:", error)
          setCorsError(true)
          // Use original thumbnail as fallback
          setGeneratedThumbnail(video.thumbnail)
        }
      }
    }
  }, [generatedThumbnail, corsError, isGif, gifElement])

  const handleVideoLoad = () => {
    setIsLoading(false)
    setLoadError(false)
    setBuffering(false)

    // Restore video position if it was previously watched for THIS video
    if (!isGif && videoRef.current) {
      const savedTime = videoPreviewState[video.id].timeWatched
      if (savedTime > 0) {
        videoRef.current.currentTime = savedTime
        setVideoCurrentTime(savedTime)
      } else {
        videoRef.current.currentTime = 0.1
      }

      // Set initial volume
      videoRef.current.volume = volume

      setTimeout(() => {
        generateThumbnail()
      }, 100)
    }

    console.log("Video loaded successfully")
  }

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error("Video error:", e)
    setIsLoading(false)
    setLoadError(true)
    setBuffering(false)
  }

  const handleWaiting = () => {
    setBuffering(true)
  }

  const handleCanPlay = () => {
    setBuffering(false)
    setIsLoading(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const progressPercentage = (currentTime / PREVIEW_TIME) * 100

  // Enhanced touch handlers for swipe navigation
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    })
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    })
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distanceY = touchStart.y - touchEnd.y
    const distanceX = touchStart.x - touchEnd.x
    const isVerticalSwipe = Math.abs(distanceY) > Math.abs(distanceX)

    if (isVerticalSwipe) {
      const isUpSwipe = distanceY > minSwipeDistance
      const isDownSwipe = distanceY < -minSwipeDistance

      if (isUpSwipe && currentIndex !== undefined && currentIndex < (totalVideos ?? 0) - 1) {
        handleNavigation("next")
      }
      if (isDownSwipe && currentIndex !== undefined && currentIndex > 0) {
        handleNavigation("prev")
      }
    }
  }

  // Double tap to like
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    handleLike()
  }

  const createHeartAnimation = (x: number, y: number) => {
    const heart = document.createElement("div")
    heart.innerHTML = "❤️"
    heart.style.position = "absolute"
    heart.style.left = `${x}px`
    heart.style.top = `${y}px`
    heart.style.fontSize = "2rem"
    heart.style.pointerEvents = "none"
    heart.style.zIndex = "100"
    heart.style.animation = "heartFloat 1.5s ease-out forwards"
    heart.style.filter = "drop-shadow(0 0 10px rgba(236, 72, 153, 0.5))"

    containerRef.current?.appendChild(heart)

    setTimeout(() => {
      heart.remove()
    }, 1500)
  }

  // Get the correct video URL - use fallback if needed
  const getVideoUrl = () => {
    const url = video.videoUrl

    // If it's a GIF, return as is
    if (checkIfGif(url)) {
      return url
    }

    // For placeholder.svg URLs, use the fallback video
    if (url.includes("placeholder.svg")) {
      return fallbackVideoUrl
    }

    // Return the URL as is - this allows using any external MP4 URL
    return url
  }

  // Calculate how many videos are blocked (for display purposes)
  const blockedVideosCount = Object.values(videoPreviewState).filter((state) => state.hasExceeded).length

  // Close modal function
  const closeTimeUpModal = () => {
    setShowTimeUpModal(false)
  }

  const retryLoading = () => {
    if (videoRef.current) {
      setIsLoading(true)
      setLoadError(false)
      videoRef.current.load()
    }
  }

  return (
    <div className="relative w-full">
      {/* Video Container - TikTok Standard Size (1080x1920 - 9:16) */}
      <div
  ref={containerRef}
  className="relative w-full max-w-[360px] mx-auto cursor-pointer"
  onTouchStart={onTouchStart}
  onTouchMove={onTouchMove}
  onTouchEnd={onTouchEnd}
  onDoubleClick={handleDoubleClick}
>
        <div
          className="relative w-full h-[640px] sm:h-[720px] md:h-[800px] lg:h-[900px] xl:h-[1000px] overflow-hidden rounded-xl bg-black shadow-2xl"
          style={{ aspectRatio: "9/16", maxWidth: "1080px", maxHeight: "1920px" }}
        >
          {/* Loading State */}
          {(isLoading || buffering) && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-pink-500 mx-auto mb-2" />
                <p className="text-white text-sm">{buffering ? "Carregando..." : "Preparando mídia..."}</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {loadError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
              <div className="text-center p-4">
                <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-white text-sm mb-4">Não foi possível carregar a mídia</p>
                <button
                  onClick={retryLoading}
                  className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          )}

          {/* GIF Element */}
          {isGif && gifElement && !loadError && (
            <div ref={gifContainerRef} className="w-full h-full flex items-center justify-center bg-black">
              <img
                src={getVideoUrl() || "/placeholder.svg"}
                alt={video.title}
                className="max-w-full max-h-full object-contain"
                style={{ display: isLoading ? "none" : "block" }}
              />
            </div>
          )}

          {/* Video Element - Only render if not a GIF */}
          {!isGif && (
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              poster={generatedThumbnail || video.thumbnail}
              loop
              playsInline
              onLoadedData={handleVideoLoad}
              onCanPlay={handleCanPlay}
              onError={handleVideoError}
              onLoadStart={() => setIsLoading(true)}
              onWaiting={handleWaiting}
              onPlaying={() => setBuffering(false)}
              controls={false}
            >
              {/* Multiple sources for better compatibility */}
              <source src={getVideoUrl()} type="video/mp4" />
              <source src={getVideoUrl()} type="video/webm" />
              <source src={fallbackVideoUrl} type="video/mp4" />
              Seu navegador não suporta vídeo HTML5.
            </video>
          )}

          {/* Transparent Play Button Overlay */}
          {!isPlaying && (
            <button onClick={togglePlay} className="absolute inset-0 z-10 w-full h-full" aria-label="Play video" />
          )}

          {/* Modern Controls Overlay */}
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Central Play/Pause Button - Larger and more prominent */}
            <button
              onClick={togglePlay}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-sm p-5 rounded-full hover:bg-black/60 transition-all hover:scale-110 border border-white/20 shadow-lg"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="h-8 w-8 text-white" />
              ) : (
                <Play className="h-8 w-8 text-white fill-white" />
              )}
            </button>
          </div>

          {/* Enhanced Video Info Overlay */}
          <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent pt-6 pb-12">
            <h2 className="text-white font-bold text-lg mb-1 line-clamp-2">{video.title}</h2>
            <p className="text-white/80 text-sm line-clamp-2">{video.description}</p>
            <div className="flex items-center mt-2">
              <div className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">{video.views} visualizações</div>
              <div className="bg-pink-500/20 text-pink-500 text-xs px-2 py-1 rounded-full ml-2">{video.duration}</div>
            </div>
          </div>

          {/* Preview Warning - Show at 45 seconds */}
          {showPreviewWarning && !hasWatchedPreview && (
            <div className="absolute bottom-40 left-4 right-4 animate-in slide-in-from-bottom duration-500 z-30">
              <div className="bg-orange-600/90 backdrop-blur-md rounded-xl p-4 shadow-xl border border-orange-500/30">
                <div className="flex items-center justify-center text-white text-sm font-bold">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Prévia terminando em {PREVIEW_TIME - currentTime}s
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Progress Bar - Only show if THIS video preview not exceeded */}
          {!hasWatchedPreview && !isLoading && !loadError && (
            <div className="absolute bottom-28 left-4 right-4 animate-in slide-in-from-bottom duration-500">
              <div className="bg-black/80 backdrop-blur-md rounded-2xl p-5 shadow-xl border border-white/10">
                <div className="flex items-center justify-between text-sm mb-4">
                  <span className="text-white font-bold flex items-center">
                    <Play className="h-4 w-4 mr-2" />
                    <span>Prévia Gratuita</span>
                  </span>
                  <span className="text-pink-400 font-bold text-lg">
                    {formatTime(PREVIEW_TIME - currentTime)} restantes
                  </span>
                </div>
                <div className="w-full bg-gray-700 h-4 rounded-full overflow-hidden progress-bar shadow-inner">
                  <div
                    className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 h-full transition-all duration-1000 rounded-full animate-gradient shadow-lg"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-300 mt-3 text-center leading-relaxed">
                  Desbloqueie o acesso completo para assistir até o final. São mais de 20 Mil Vídeos completos já postados prontos para assistir!
                </div>
                {blockedVideosCount > 0 && (
                  <div className="text-xs text-orange-400 mt-2 text-center font-medium">
                    {blockedVideosCount} vídeo{blockedVideosCount > 1 ? "s" : ""} já bloqueado
                    {blockedVideosCount > 1 ? "s" : ""}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Enhanced Blocked Video Overlay - Only for THIS video */}
          {hasWatchedPreview && (
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-30">
              <div className="text-center p-8 animate-in zoom-in duration-500">
                <Lock className="h-20 w-20 mx-auto text-pink-500 mb-6 animate-pulse" />
                <h3 className="text-2xl font-bold mb-3 text-white">Tempo Gratuito Esgotado</h3>
                <p className="text-gray-300 text-base mb-8 leading-relaxed">
                  Você já assistiu a prévia gratuita deste vídeo! Adquira a ZONA VIP BRASIL para continuar assistindo... São mais de 20 Mil Vídeos Completos prontos para assistir!
                </p>
                <Link
                  href="/redirect"
                  className="inline-block px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full font-bold text-white hover:from-pink-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-xl text-lg"
                >
                  DESBLOQUEAR ACESSO
                </Link>
              </div>
            </div>
          )}

          {/* Share Feedback */}
          {showShareFeedback && (
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium animate-in slide-in-from-top duration-300 shadow-lg">
              Link copiado!
            </div>
          )}

          {/* Time Up Modal - Only appears over the video player, not full screen */}
          {showTimeUpModal && (
            <div className="absolute inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-40 rounded-xl">
              <div className="bg-gray-900 p-6 rounded-2xl max-w-xs w-full mx-4 text-center border border-gray-700 animate-in zoom-in duration-500 shadow-2xl relative">
                {/* Close button */}
                <button
                  onClick={closeTimeUpModal}
                  className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
                  aria-label="Fechar"
                >
                  ✕
                </button>

                <div className="mb-6">
                  <Lock className="h-12 w-12 mx-auto text-pink-500 mb-3 animate-pulse" />
                  <h3 className="text-lg font-bold mb-2 text-white">Tempo Esgotado!</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Prévia gratuita deste vídeo finalizada. Desbloqueie para continuar assistindo.
                  </p>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/redirect"
                    className="block w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full font-bold text-white hover:from-pink-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-xl text-sm"
                  >
                    DESBLOQUEAR ACESSO
                  </Link>
                  <button
                    onClick={closeTimeUpModal}
                    className="block w-full py-2 text-gray-400 hover:text-white transition-all text-xs"
                  >
                    Continuar navegando
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Enhanced Navigation Buttons - ALWAYS VISIBLE */}
      <div className="absolute right-3 top-0 bottom-0 flex flex-col justify-center space-y-3 z-50 py-8">
        {/* Botão de ativar/desativar som - Posição superior */}
        <div className="flex flex-col items-center space-y-1">
          <button
            onClick={toggleMute}
            className="bg-black/70 backdrop-blur-md p-2.5 rounded-full hover:bg-black/90 transition-all duration-300 hover:scale-110 shadow-xl border border-white/10"
            aria-label={isMuted ? "Ativar som" : "Desativar som"}
          >
            {isMuted ? <VolumeX className="h-5 w-5 text-white" /> : <Volume2 className="h-5 w-5 text-white" />}
          </button>
        </div>

        {/* Espaçador flexível */}
        <div className="flex-1"></div>

        {/* Grupo de navegação - Centro */}
        <div className="flex flex-col items-center space-y-3">
          {/* Botão de rolar para cima */}
          <button
            onClick={() => handleNavigation("prev")}
            className={`bg-black/70 backdrop-blur-md p-2.5 rounded-full hover:bg-black/90 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 shadow-xl border border-white/10 ${isNavigating ? "scale-95" : ""}`}
            disabled={currentIndex !== undefined && currentIndex === 0}
            aria-label="Vídeo anterior"
          >
            <ChevronUp className="h-5 w-5 text-white" />
          </button>

          {/* Contador de vídeos */}
          <div className="bg-gradient-to-r from-pink-600/80 to-purple-600/80 backdrop-blur-md px-3 py-2 rounded-full text-xs text-center text-white font-bold shadow-xl border border-white/20">
            {currentIndex !== undefined && `${currentIndex + 1}/${totalVideos}`}
          </div>

          {/* Botão de rolar para baixo */}
          <button
            onClick={() => handleNavigation("next")}
            className={`bg-black/70 backdrop-blur-md p-2.5 rounded-full hover:bg-black/90 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 shadow-xl border border-white/10 ${isNavigating ? "scale-95" : ""}`}
            disabled={currentIndex !== undefined && currentIndex === (totalVideos ?? 0) - 1}
            aria-label="Próximo vídeo"
          >
            <ChevronDown className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Espaçador flexível */}
        <div className="flex-1"></div>

        {/* Grupo de interação - Parte inferior */}
        <div className="flex flex-col items-center space-y-3">
          {/* Botão de curtir */}
          <div className="flex flex-col items-center">
            <button
              onClick={handleLike}
              className="bg-black/70 backdrop-blur-md p-2.5 rounded-full hover:bg-black/90 transition-all duration-300 hover:scale-110 group shadow-xl border border-white/10"
              aria-label="Curtir vídeo"
            >
              <Heart
                className={`h-5 w-5 transition-all duration-300 ${isLiked ? "text-red-500 fill-red-500 scale-110" : "text-white group-hover:text-red-400"}`}
              />
            </button>
            <div className="text-xs text-white mt-1 text-center font-bold">
              {likeCount > 999 ? `${Math.floor(likeCount / 1000)}k` : likeCount}
            </div>
          </div>

          {/* Botão de compartilhar */}
          <button
            onClick={handleShare}
            className="bg-black/70 backdrop-blur-md p-2.5 rounded-full hover:bg-black/90 transition-all duration-300 hover:scale-110 group shadow-xl border border-white/10 relative"
            aria-label="Compartilhar vídeo"
          >
            {showShareFeedback ? (
              <Check className="h-5 w-5 text-green-400 animate-in zoom-in duration-300" />
            ) : (
              <Share2 className="h-5 w-5 text-white group-hover:text-blue-400 transition-colors duration-300" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
