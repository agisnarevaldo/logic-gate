"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { PageLoadingScreen } from "@/components/page-loading-screen"
import { FeaturePageLayout } from "@/components/feature-page-layout"
import { ChecklistIcon } from "@/components/icon"
import { 
    Brain, 
    Eye, 
    Wrench, 
    Monitor, 
    BarChart3, 
    Smartphone,
    Lightbulb
} from "lucide-react"

export default function TujuanBelajarPage() {
    const [showLoading, setShowLoading] = useState(true)

    const objectives = [
        {
            id: 1,
            title: "Memahami Konsep Dasar Gerbang Logika",
            description: "Siswa mampu memahami fungsi dan prinsip kerja gerbang logika dasar (AND, OR, NOT) serta gerbang logika kombinasi (NAND, NOR, XOR, XNOR) dalam sistem digital.",
            icon: <Brain className="w-6 h-6" />,
        },
        {
            id: 2,
            title: "Mengidentifikasi Simbol dan Tabel Kebenaran",
            description: "Siswa dapat mengenali simbol-simbol gerbang logika standar dan memahami hubungan antara input dan output melalui tabel kebenaran masing-masing gerbang.",
            icon: <Eye className="w-6 h-6" />,
        },
        {
            id: 3,
            title: "Merancang Rangkaian Logika Sederhana",
            description: "Siswa mampu merancang dan membangun rangkaian logika sederhana menggunakan kombinasi berbagai gerbang logika untuk menyelesaikan masalah digital tertentu.",
            icon: <Wrench className="w-6 h-6" />,
        },
        {
            id: 4,
            title: "Menggunakan Simulator Gerbang Logika",
            description: "Siswa dapat mengoperasikan simulator digital untuk menguji dan memvalidasi rangkaian gerbang logika, serta memahami alur sinyal dalam rangkaian digital.",
            icon: <Monitor className="w-6 h-6" />,
        },
        {
            id: 5,
            title: "Menganalisis Hasil Simulasi",
            description: "Siswa mampu menganalisis dan mengevaluasi hasil simulasi rangkaian gerbang logika untuk memverifikasi kesesuaian dengan desain yang diharapkan.",
            icon: <BarChart3 className="w-6 h-6" />,
        },
        {
            id: 6,
            title: "Menerapkan Konsep dalam Konteks Nyata",
            description: "Siswa dapat mengaitkan konsep gerbang logika dengan aplikasi nyata dalam teknologi digital seperti komputer, smartphone, dan perangkat elektronik lainnya.",
            icon: <Smartphone className="w-6 h-6" />,
        },
    ]

    return (
        <>
            <AnimatePresence mode="wait">
                {showLoading && (
                    <PageLoadingScreen
                        bgColor="bg-green-500"
                        icon={<ChecklistIcon />}
                        text="Tujuan Belajar"
                        onComplete={() => setShowLoading(false)}
                    />
                )}
            </AnimatePresence>

            <div className={showLoading ? "hidden" : ""}>
                <FeaturePageLayout title="Tujuan Pembelajaran" icon={<ChecklistIcon />} bgColor="bg-green-500">
                    <div className="space-y-4">
                        <div className="bg-white rounded-xl p-6 shadow-lg">
                            <h2 className="text-2xl font-bold text-green-700 mb-4">Capaian Pembelajaran</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Setelah menyelesaikan pembelajaran ini, siswa diharapkan dapat memahami, menganalisis, 
                                dan menerapkan konsep gerbang logika dalam perancangan rangkaian digital sederhana.
                            </p>
                        </div>
                        
                        {objectives.map((objective, index) => (
                            <div key={objective.id} className="bg-green-500 rounded-xl p-6 text-white shadow-lg transform hover:scale-[1.02] transition-transform duration-200">
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-white text-green-500 rounded-full flex items-center justify-center font-bold text-lg relative">
                                            {objective.icon}
                                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                                {index + 1}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold mb-3">{objective.title}</h3>
                                        <p className="leading-relaxed opacity-95">{objective.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        <div className="bg-green-100 rounded-xl p-6 border-l-4 border-green-500">
                            <div className="flex items-center space-x-2 mb-3">
                                <Lightbulb className="w-6 h-6 text-green-600" />
                                <h3 className="text-lg font-bold text-green-800">Tips Pembelajaran</h3>
                            </div>
                            <ul className="text-green-700 space-y-2">
                                <li>• Mulai dengan memahami gerbang logika dasar (AND, OR, NOT)</li>
                                <li>• Praktikkan langsung menggunakan simulator yang tersedia</li>
                                <li>• Coba buat rangkaian sederhana dan amati hasilnya</li>
                                <li>• Jangan ragu untuk mengulang materi jika diperlukan</li>
                            </ul>
                        </div>
                    </div>
                </FeaturePageLayout>
            </div>
        </>
    )
}
