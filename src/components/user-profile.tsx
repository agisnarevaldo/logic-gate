"use client"

import { Settings } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/providers/auth-provider"

export function UserProfile() {
  const { user } = useAuth()

  return (
    <div className="flex justify-end items-baseline bg-white rounded-full drop-shadow-xl w-full mx-2">
      <div className="absolute left-0 w-[85px] h-[85px] flex justify-center items-center rounded-full bg-white p-3.5 overflow-hidden shadow-xl">
        {user?.user_metadata?.avatar_url ? (
          <div className="relative w-16 h-16 rounded-full overflow-hidden mx-auto">
            <Image src={user.user_metadata.avatar_url || "/vercel.svg"} alt="Profile" fill className="object-cover" />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-16 h-16 text-black">
              <path
                d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                fill="currentColor"
              />
              <path
                d="M12 14.5C6.99 14.5 3 17.44 3 21C3 21.55 3.45 22 4 22H20C20.55 22 21 21.55 21 21C21 17.44 17.01 14.5 12 14.5Z"
                fill="currentColor"
              />
            </svg>
          </div>
        )}
      </div>
      <div className="grow-0 items-center flex ml-auto gap-3.5 p-3.5">
        <div className="flex flex-col flex-1 items-end text-center">
            <h2 className="font-semibold truncate md:max-w-full max-w-[19ch] mr-auto">{user?.user_metadata?.name || user?.email?.split('@')[0] || "Name"}</h2>
            <p className="text-gray-500 text-sm text-center w-full">{user?.email || "Example@gmail.com"}</p>
        </div>
        <button className="text-[#003459]">
            <Settings size={28} />
        </button>
      </div>
    </div>
  )
}