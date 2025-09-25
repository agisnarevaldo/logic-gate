"use client"

import { Volume2, VolumeX, Play, Pause } from "lucide-react"
import { useBackgroundMusic } from "@/hooks/use-background-music"

export function MusicControl() {
  const { musicState, toggleMusic, toggleMute, setVolume } = useBackgroundMusic()

  return (
    <div className="flex flex-col gap-3 p-4 bg-white/10 rounded-lg">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white">Musik Latar</span>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-1 hover:bg-white/10 rounded text-white"
            title={musicState.isMuted ? "Nyalakan suara" : "Matikan suara"}
          >
            {musicState.isMuted ? (
              <VolumeX size={16} />
            ) : (
              <Volume2 size={16} />
            )}
          </button>
          <button
            onClick={toggleMusic}
            className="p-1 hover:bg-white/10 rounded text-white"
            title={musicState.isPlaying ? "Pause" : "Play"}
          >
            {musicState.isPlaying ? (
              <Pause size={16} />
            ) : (
              <Play size={16} />
            )}
          </button>
        </div>
      </div>

      {!musicState.isMuted && (
        <div className="flex items-center gap-2">
          <Volume2 size={12} className="text-white/70" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={musicState.volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer
                            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 
                            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
                            [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <span className="text-xs text-white/70 min-w-[30px]">
            {Math.round(musicState.volume * 100)}%
          </span>
        </div>
      )}
    </div>
  )
}
