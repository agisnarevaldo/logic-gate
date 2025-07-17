import { SupabaseAuthForm } from "@/components/auth/supabase-auth-form";
import { AuthDebug } from "@/components/auth/auth-debug";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center py-12 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Logic Gate</h1>
        <p className="text-gray-600">Platform Pembelajaran Gerbang Logika</p>
      </div>
      <SupabaseAuthForm />
      <AuthDebug />
    </main>
  )
}
