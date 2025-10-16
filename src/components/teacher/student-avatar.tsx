"use client"

import { User } from 'lucide-react'
import { useState } from 'react'

interface StudentAvatarProps {
    avatar_url?: string
    full_name: string
    size: number
    className?: string
}

export function StudentAvatar({ avatar_url, full_name, size, className = "" }: StudentAvatarProps) {
    const [imageError, setImageError] = useState(false)
    const [imageLoading, setImageLoading] = useState(true)

    // Don't show image if there's no URL or if there was an error
    const showImage = avatar_url && !imageError

    // Process avatar URL to avoid CORS issues
    const processedAvatarUrl = avatar_url ? avatar_url.replace('=s96-c', '=s400-c') : ''

    return (
        <div
            className={`bg-orange-100 rounded-full flex items-center justify-center overflow-hidden ${className}`}
            style={{ width: size, height: size }}
        >
            {showImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={processedAvatarUrl}
                    alt={`${full_name} avatar`}
                    className="w-full h-full object-cover rounded-full"
                    loading="lazy"
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                    onError={() => {
                        console.log('Avatar failed to load for:', full_name)
                        setImageError(true)
                        setImageLoading(false)
                    }}
                    onLoad={() => {
                        console.log('Avatar loaded successfully for:', full_name)
                        setImageLoading(false)
                    }}
                    style={{
                        display: imageError ? 'none' : 'block',
                        opacity: imageLoading ? 0.5 : 1,
                        transition: 'opacity 0.3s ease',
                        width: size,
                        height: size
                    }}
                />
            ) : (
                <User size={size * 0.5} className="text-orange-600" />
            )}
        </div>
    )
}
