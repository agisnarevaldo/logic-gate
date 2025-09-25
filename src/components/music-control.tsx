"use client"

import { Volume2, VolumeX, Play, Pause } from "lucide-react"
import { useBackgroundMusic } from "@/hooks/use-background-music"

export function MusicControl() {
  const { musicState, toggleMusic, toggleMute, setVolume } = useBackgroundMusic()

  return (
    <div className="flex flex-col gap-1.5 p-2.5 bg-white/10 rounded-lg">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-white">Musik</span>
        <div className="flex items-center gap-1">
          <button
            onClick={toggleMute}
            className="p-1 hover:bg-white/10 rounded text-white"
            title={musicState.isMuted ? "Nyalakan suara" : "Matikan suara"}
          >
            {musicState.isMuted ? (
              <VolumeX size={12} />
            ) : (
              <Volume2 size={12} />
            )}
          </button>
          <button
            onClick={toggleMusic}
            className="p-1 hover:bg-white/10 rounded text-white"
            title={musicState.isPlaying ? "Pause" : "Play"}
          >
            {musicState.isPlaying ? (
              <Pause size={12} />
            ) : (
              <Play size={12} />
            )}
          </button>
        </div>
      </div>

      {!musicState.isMuted && (
        <div className="flex items-center gap-1.5">
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={musicState.volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer
                            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:w-2 
                            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
                            [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <span className="text-xs text-white/70 min-w-[24px] flex-shrink-0">
            {Math.round(musicState.volume * 100)}%
          </span>
        </div>
      )}
    </div>
  )
}
