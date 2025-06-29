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
      id: 1,
      title: "Logic Gate Matching",
      href: "/kuis/matching",
      description: "Match logic gate symbols with their names",
    },
    // { id: 2, title: "Basic Logic Gates", href: "/kuis/basic", description: "Test your knowledge of basic logic gates" },
    // {
    //   id: 3,
    //   title: "Combination Logic",
    //   href: "/kuis/combination",
    //   description: "Questions about combination logic circuits",
    // },
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
          {quizzes.map((quiz) => (
            <Link key={quiz.id} href={quiz.href} className="block bg-lightblue-card rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-bold text-white">{quiz.title}</h3>
              <p className="text-white/80">{quiz.description}</p>
            </Link>
          ))}
        </FeaturePageLayout>
      </div>
    </>
  )
}
