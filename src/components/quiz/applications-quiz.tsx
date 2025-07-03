"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle, RefreshCw, ArrowRight } from "lucide-react"

interface Question {
  id: number
  question: string
  options: string[]
  correct: number
  explanation: string
  category: string
}

const questions: Question[] = [
  {
    id: 1,
    question: "Dalam sebuah sistem keamanan, gerbang logika AND digunakan untuk mengaktifkan alarm. Alarm akan berbunyi jika:",
    options: [
      "Salah satu sensor mendeteksi gerakan ATAU sensor suhu mendeteksi panas berlebih",
      "Sensor gerak mendeteksi gerakan DAN sensor suhu mendeteksi panas berlebih",
      "Hanya sensor gerak yang aktif",
      "Tidak ada sensor yang aktif"
    ],
    correct: 1,
    explanation: "Gerbang AND memerlukan SEMUA input bernilai TRUE untuk menghasilkan output TRUE. Dalam sistem keamanan, ini berarti kedua kondisi harus terpenuhi.",
    category: "Keamanan"
  },
  {
    id: 2,
    question: "Pada rangkaian lampu otomatis, gerbang OR digunakan untuk menyalakan lampu. Lampu akan menyala jika:",
    options: [
      "Sensor cahaya mendeteksi gelap DAN sensor gerak mendeteksi ada orang",
      "Sensor cahaya mendeteksi gelap ATAU sensor gerak mendeteksi ada orang",
      "Kedua sensor tidak aktif",
      "Hanya saat sensor cahaya aktif"
    ],
    correct: 1,
    explanation: "Gerbang OR akan menghasilkan output TRUE jika SALAH SATU atau SEMUA input bernilai TRUE. Lampu menyala jika salah satu kondisi terpenuhi.",
    category: "Otomasi Rumah"
  },
  {
    id: 3,
    question: "Gerbang XOR sangat berguna dalam sistem enkripsi karena:",
    options: [
      "Selalu menghasilkan output yang sama dengan input",
      "Dapat membalikkan operasi enkripsi dengan operasi yang sama",
      "Hanya bekerja dengan satu input",
      "Tidak pernah menghasilkan output 1"
    ],
    correct: 1,
    explanation: "XOR memiliki sifat reversible: A XOR B XOR B = A. Ini memungkinkan enkripsi dan dekripsi menggunakan operasi yang sama.",
    category: "Kriptografi"
  },
  {
    id: 4,
    question: "Dalam kalkulator digital, gerbang XOR digunakan dalam half-adder untuk:",
    options: [
      "Menghitung carry (sisa) dari penjumlahan",
      "Menghitung sum (hasil) dari penjumlahan tanpa carry",
      "Mengurangi dua bilangan",
      "Mengalikan dua bilangan"
    ],
    correct: 1,
    explanation: "Dalam half-adder, XOR menghasilkan sum bit, sedangkan AND menghasilkan carry bit. XOR menghasilkan 1 jika input berbeda.",
    category: "Aritmatika Digital"
  },
  {
    id: 5,
    question: "Gerbang NAND disebut universal gate karena:",
    options: [
      "Hanya bisa membuat gerbang AND",
      "Bisa digunakan untuk membuat semua jenis gerbang logika lainnya",
      "Hanya bekerja dengan tegangan tinggi",
      "Memiliki lebih dari 3 input"
    ],
    correct: 1,
    explanation: "NAND adalah universal gate karena kombinasi gerbang NAND dapat digunakan untuk membuat AND, OR, NOT, dan gerbang lainnya.",
    category: "Desain Sirkuit"
  },
  {
    id: 6,
    question: "Dalam sistem komputer, gerbang NOT digunakan untuk:",
    options: [
      "Memperkuat sinyal",
      "Membalikkan logika sinyal (inverter)",
      "Menggabungkan dua sinyal",
      "Menyimpan data"
    ],
    correct: 1,
    explanation: "Gerbang NOT berfungsi sebagai inverter, mengubah 0 menjadi 1 dan sebaliknya. Ini penting untuk operasi komplemen dalam sistem digital.",
    category: "Sistem Komputer"
  },
  {
    id: 7,
    question: "XNOR gate sering disebut equivalence gate karena:",
    options: [
      "Output 1 jika input berbeda",
      "Output 1 jika input sama",
      "Selalu menghasilkan output 0",
      "Tidak memiliki kegunaan praktis"
    ],
    correct: 1,
    explanation: "XNOR menghasilkan output 1 ketika kedua input memiliki nilai yang sama, sehingga berguna untuk membandingkan kesetaraan.",
    category: "Komparator"
  },
  {
    id: 8,
    question: "Dalam sistem kontrol traffic light, gerbang logika digunakan untuk mengatur lampu. Jika lampu merah menyala, maka:",
    options: [
      "Semua lampu lain harus mati (menggunakan NOT gate)",
      "Lampu kuning juga harus menyala",
      "Lampu hijau harus menyala",
      "Semua lampu menyala bersamaan"
    ],
    correct: 0,
    explanation: "Dalam traffic light, ketika satu lampu menyala, lampu lain harus mati. NOT gate digunakan untuk memastikan kondisi saling eksklusif.",
    category: "Kontrol Lalu Lintas"
  },
  {
    id: 9,
    question: "Parity bit dalam sistem komunikasi menggunakan gerbang XOR untuk:",
    options: [
      "Mempercepat transmisi data",
      "Mendeteksi error dalam transmisi data",
      "Mengenkripsi data",
      "Mengompres data"
    ],
    correct: 1,
    explanation: "XOR digunakan dalam parity checking untuk mendeteksi error. Jika parity berubah, berarti ada error dalam transmisi.",
    category: "Komunikasi Data"
  },
  {
    id: 10,
    question: "Dalam desain sirkuit digital modern, mengapa IC NAND (seperti 7400) lebih populer dibanding IC lainnya?",
    options: [
      "Lebih murah dan bisa menggantikan fungsi semua gerbang lain",
      "Hanya bisa digunakan untuk satu fungsi",
      "Menggunakan daya lebih besar",
      "Lebih lambat dalam operasi"
    ],
    correct: 0,
    explanation: "IC NAND populer karena sifat universal gate yang memungkinkan implementasi semua fungsi logika, serta biaya produksi yang efisien.",
    category: "Desain IC"
  }
]

export function ApplicationsQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState<boolean[]>(new Array(questions.length).fill(false))
  const [isComplete, setIsComplete] = useState(false)

  const handleAnswerSelect = useCallback((answerIndex: number) => {
    if (showResult) return
    setSelectedAnswer(answerIndex)
  }, [showResult])

  const handleSubmit = useCallback(() => {
    if (selectedAnswer === null) return

    setShowResult(true)
    const newAnswered = [...answered]
    newAnswered[currentQuestion] = true
    setAnswered(newAnswered)

    if (selectedAnswer === questions[currentQuestion].correct) {
      setScore(score + 1)
    }
  }, [selectedAnswer, currentQuestion, answered, score])

  const handleNext = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setIsComplete(true)
    }
  }, [currentQuestion])

  const handleRestart = useCallback(() => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setAnswered(new Array(questions.length).fill(false))
    setIsComplete(false)
  }, [])

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreMessage = (score: number, total: number) => {
    const percentage = (score / total) * 100
    if (percentage >= 90) return "Luar biasa! Anda memahami aplikasi gerbang logika dengan sangat baik!"
    if (percentage >= 80) return "Bagus! Pemahaman Anda tentang aplikasi gerbang logika sudah baik."
    if (percentage >= 70) return "Cukup baik! Terus belajar untuk memahami aplikasi gerbang logika lebih dalam."
    if (percentage >= 60) return "Lumayan! Anda perlu mempelajari lebih lanjut tentang aplikasi praktis gerbang logika."
    return "Perlu belajar lebih keras! Pastikan Anda memahami konsep dasar dan aplikasi gerbang logika."
  }

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold mb-4">Quiz Selesai!</h2>
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className={`text-4xl font-bold mb-2 ${getScoreColor(score, questions.length)}`}>
            {score}/{questions.length}
          </div>
          <div className="text-gray-600 mb-4">
            Skor: {Math.round((score / questions.length) * 100)}%
          </div>
          <p className="text-gray-700">{getScoreMessage(score, questions.length)}</p>
        </div>
        <button
          onClick={handleRestart}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
        >
          <RefreshCw size={20} />
          Coba Lagi
        </button>
      </motion.div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Pertanyaan {currentQuestion + 1} dari {questions.length}</span>
          <span>{question.category}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="mb-8"
      >
        <h2 className="text-xl font-semibold mb-6 text-gray-800">
          {question.question}
        </h2>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <motion.button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={showResult}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                selectedAnswer === index
                  ? showResult
                    ? index === question.correct
                      ? "border-green-500 bg-green-50"
                      : "border-red-500 bg-red-50"
                    : "border-blue-500 bg-blue-50"
                  : showResult && index === question.correct
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              } ${showResult ? "cursor-default" : "cursor-pointer"}`}
              whileHover={!showResult ? { scale: 1.02 } : {}}
              whileTap={!showResult ? { scale: 0.98 } : {}}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {showResult && (
                  <div>
                    {index === question.correct ? (
                      <CheckCircle className="text-green-500" size={20} />
                    ) : selectedAnswer === index ? (
                      <XCircle className="text-red-500" size={20} />
                    ) : null}
                  </div>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Explanation */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Penjelasan:</h3>
              <p className="text-blue-700">{question.explanation}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Button */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Skor: {score}/{currentQuestion + (showResult ? 1 : 0)}
        </div>
        
        {!showResult ? (
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Submit Jawaban
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            {currentQuestion < questions.length - 1 ? (
              <>
                Selanjutnya
                <ArrowRight size={20} />
              </>
            ) : (
              "Selesai"
            )}
          </button>
        )}
      </div>
    </div>
  )
}
