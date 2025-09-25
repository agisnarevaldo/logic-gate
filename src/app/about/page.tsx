"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { PageLoadingScreen } from "@/components/page-loading-screen"
import { FeaturePageLayout } from "@/components/feature-page-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Info,
  Code,
  BookOpen,
  Gamepad2,
  Brain,
  Settings
} from "lucide-react"

export default function AboutPage() {
  const [showLoading, setShowLoading] = useState(true)

  const features = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Materi Pembelajaran",
      description: "Materi lengkap tentang gerbang logika dari dasar hingga mahir"
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Simulator Interaktif",
      description: "Simulator gerbang logika dengan drag & drop interface"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Sistem Kuis",
      description: "Kuis interaktif dengan berbagai tingkat kesulitan"
    },
    {
      icon: <Gamepad2 className="w-6 h-6" />,
      title: "Games & Aktivitas",
      description: "Game edukatif untuk memperdalam pemahaman"
    }
  ]

  const techStack = [
    "Next.js 15", "React 19", "TypeScript", "Tailwind CSS",
    "Supabase", "Framer Motion", "Lucide Icons"
  ]

  return (
    <>
      <AnimatePresence mode="wait">
        {showLoading && (
          <PageLoadingScreen
            bgColor="bg-blue-500"
            icon={<Info className="w-16 h-16" />}
            text="About"
            onComplete={() => setShowLoading(false)}
          />
        )}
      </AnimatePresence>

      <div className={showLoading ? "hidden" : ""}>
        <FeaturePageLayout title="About LogiFun" icon={<Info size={50} />} bgColor="bg-blue-500">
          <div className="space-y-6">

            {/* Hero Section */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold text-blue-900">LogiFun</h2>
                  <p className="text-lg text-blue-700 font-medium">
                    Platform Pembelajaran Interaktif Gerbang Logika
                  </p>
                  <p className="text-blue-600 max-w-2xl mx-auto">
                    LogiFun adalah platform pembelajaran yang dirancang untuk membantu siswa
                    memahami konsep gerbang logika dan elektronika digital melalui pendekatan
                    interaktif dan menyenangkan.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Mission & Vision */}
            {/* <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-green-700">
                    <Target className="w-5 h-5" />
                    <span>Misi</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    Menyediakan platform pembelajaran yang mudah dipahami dan interaktif 
                    untuk mempelajari gerbang logika, sehingga siswa dapat menguasai 
                    konsep elektronika digital dengan lebih efektif.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-blue-700">
                    <Users className="w-5 h-5" />
                    <span>Visi</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    Menjadi platform pembelajaran terdepan dalam bidang elektronika digital 
                    yang dapat diakses oleh semua kalangan dan membantu menciptakan 
                    generasi yang kompeten di bidang teknologi.
                  </p>
                </CardContent>
              </Card>
            </div> */}

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-purple-700">Fitur Utama</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50">
                      <div className="text-purple-600 mt-1">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tech Stack */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-indigo-700">
                  <Code className="w-5 h-5" />
                  <span>Teknologi yang Digunakan</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Developer Info */}
            <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  LogiFun dikembangkan sebagai proyek pembelajaran untuk membantu siswa
                  dalam memahami konsep gerbang logika dengan cara yang menyenangkan dan interaktif.
                </p>

              </CardContent>
            </Card>

            {/* Version Info */}
            <Card className="bg-gray-50">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600">
                    LogiFun v1.0.0 - Platform Pembelajaran Gerbang Logika
                  </p>
                  <p className="text-xs text-gray-500">
                    © 2024 LogiFun. Dibuat untuk tujuan edukasi.
                  </p>
                </div>
              </CardContent>
            </Card>

          </div>
        </FeaturePageLayout>
      </div>
    </>
  )
}
