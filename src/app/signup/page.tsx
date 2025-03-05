"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function SignUp() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // In a real application, you would make an API call to create the user
    // For this demo, we'll simulate a successful signup and redirect to login
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to login page
      router.push("/")
    } catch {
      setError("Something went wrong. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-tertiary mb-12">LogiFun</h1>
          <h2 className="text-2xl font-medium mb-8">Create an Account</h2>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-4 bg-zinc-200 rounded-md outline-none"
            />
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-4 bg-zinc-200 rounded-md outline-none"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-4 bg-zinc-200 rounded-md outline-none pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-4 bg-tertiary text-white rounded-md font-medium hover:bg-tertiary/90 transition-colors cursor-pointer"
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500">
            Already have an account?{" "}
            <Link href="/" className="text-green-700 font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

