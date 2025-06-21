import Link from "next/link"
import { Play } from "lucide-react"

interface VideoCardProps {
  video: {
    id: string
    title: string
    description: string
    views: string
    thumbnail: string
  }
}

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <div className="relative rounded-lg overflow-hidden">
      <Link href="/redirect">
        <div className="relative aspect-[9/16] overflow-hidden">
          <img src={video.thumbnail || "/placeholder.svg"} alt={video.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
              <Play className="h-6 w-6 fill-white" />
            </div>
          </div>
        </div>
        <div className="p-2">
          <h3 className="font-medium text-sm line-clamp-1">{video.title}</h3>
          <p className="text-xs text-gray-400 mt-1">{video.views} visualizações</p>
        </div>
      </Link>
    </div>
  )
}
