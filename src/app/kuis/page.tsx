"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { PageLoadingScreen } from "@/components/page-loading-screen"
import { FeaturePageLayout } from "@/components/feature-page-layout"
import { Brain } from "lucide-react"
import Link from "next/link"

export default function KuisPage() {
  const [showLoading, setShowLoading] = useState(true)

  const quizzes = [
    {
      id: 0,
      title: "Kuis Komprehensif",
      href: "/kuis/comprehensive",
      description: "Kuis lengkap dengan 25 soal dari semua kategori gerbang logika",
      difficulty: "Lengkap",
      time: "30 menit"
    },
    {
      id: 1,
      title: "Simbol Gerbang Logika",
      href: "/kuis/matching",
      description: "Cocokkan simbol gerbang logika dengan namanya",
      difficulty: "Mudah",
      time: "5 menit"
    },
    {
      id: 2,
      title: "Gerbang Logika Dasar",
      href: "/kuis/basic-gates",
      description: "Tes pengetahuan tentang gerbang AND, OR, dan NOT",
      difficulty: "Normal",
      time: "10 menit"
    },
    {
      id: 3,
      title: "Gerbang Logika Turunan",
      href: "/kuis/advanced-gates",
      description: "Kuis tentang NAND, NOR, XOR, dan XNOR",
      difficulty: "Normal",
      time: "10 mnt"
    },
    {
      id: 4,
      title: "Tabel Kebenaran",
      href: "/kuis/truth-table",
      description: "Lengkapi tabel kebenaran berbagai gerbang logika",
      difficulty: "Sulit",
      time: "12 menit"
    },
    // {
    //   id: 5,
    //   title: "Aplikasi Gerbang Logika",
    //   href: "/kuis/applications",
    //   description: "Soal tentang penggunaan gerbang logika dalam kehidupan nyata",
    //   difficulty: "Sulit",
    //   time: "20 menit"
    // }
  ]

  return (
    <>
      <AnimatePresence mode="wait">
        {showLoading && (
          <PageLoadingScreen
            bgColor="bg-lightblue-card"
            icon={<Brain size={60} />}
            text="Kuis"
            onComplete={() => setShowLoading(false)}
          />
        )}
      </AnimatePresence>

      <div className={showLoading ? "hidden" : ""}>
        <FeaturePageLayout title="Kuis" icon={<Brain size={60} />} bgColor="bg-lightblue-card">
          <div className="grid gap-4 md:gap-6">
            {quizzes.map((quiz) => (
              <Link key={quiz.id} href={quiz.href} className="block">
                <div className="bg-lightblue-card rounded-2xl p-6 hover:bg-blue-600 transition-colors group">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-100">
                      {quiz.title}
                    </h3>
                    <div className="flex gap-1 h-max">
                      <span className={`px-2 py-1 h-max rounded-full text-xs font-medium ${
                        quiz.difficulty === 'Mudah' ? 'bg-green-500 text-white' :
                        quiz.difficulty === 'Normal' ? 'bg-yellow-500 text-white' :
                        quiz.difficulty === 'Lengkap' ? 'bg-purple-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {quiz.difficulty}
                      </span>
                      <span className="px-2 py-1 h-max rounded-full text-xs font-medium bg-white/20 text-white">
                        {quiz.time}
                      </span>
                    </div>
                  </div>
                  <p className="text-white/80 group-hover:text-blue-100">{quiz.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </FeaturePageLayout>
      </div>
    </>
  )
}
