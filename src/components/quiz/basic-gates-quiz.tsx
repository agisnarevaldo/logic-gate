"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  category: "AND" | "OR" | "NOT"
}

const questions: Question[] = [
  {
    id: 1,
    question: "Gerbang AND menghasilkan output 1 hanya jika:",
    options: [
      "Salah satu input bernilai 1",
      "Semua input bernilai 1", 
      "Semua input bernilai 0",
      "Input pertama bernilai 1"
    ],
    correctAnswer: 1,
    explanation: "Gerbang AND hanya menghasilkan output 1 ketika SEMUA input bernilai 1. Jika ada satu saja input yang 0, maka output akan 0.",
    category: "AND"
  },
  {
    id: 2,
    question: "Dalam kehidupan nyata, gerbang AND dapat dianalogikan dengan:",
    options: [
      "Lampu dengan satu saklar",
      "Lampu dengan dua saklar seri",
      "Lampu dengan dua saklar paralel", 
      "Lampu yang selalu menyala"
    ],
    correctAnswer: 1,
    explanation: "Gerbang AND seperti rangkaian seri - semua saklar harus ON agar lampu menyala.",
    category: "AND"
  },
  {
    id: 3,
    question: "Gerbang OR menghasilkan output 0 hanya jika:",
    options: [
      "Salah satu input bernilai 0",
      "Semua input bernilai 1",
      "Semua input bernilai 0",
      "Input pertama bernilai 0"
    ],
    correctAnswer: 2,
    explanation: "Gerbang OR menghasilkan output 0 hanya ketika SEMUA input bernilai 0. Jika minimal ada satu input yang 1, output akan 1.",
    category: "OR"
  },
  {
    id: 4,
    question: "Notasi Boolean untuk gerbang OR adalah:",
    options: [
      "A · B",
      "A + B",
      "Ā",
      "A ⊕ B"
    ],
    correctAnswer: 1,
    explanation: "Gerbang OR menggunakan notasi + (plus) dalam aljabar Boolean, yang berarti operasi OR.",
    category: "OR"
  },
  {
    id: 5,
    question: "Gerbang NOT disebut juga sebagai:",
    options: [
      "Amplifier",
      "Buffer",
      "Inverter",
      "Multiplier"
    ],
    correctAnswer: 2,
    explanation: "Gerbang NOT disebut Inverter karena berfungsi membalik (invert) kondisi input - jika input 1 maka output 0, dan sebaliknya.",
    category: "NOT"
  },
  {
    id: 6,
    question: "Jika input gerbang NOT adalah 0, maka outputnya adalah:",
    options: [
      "0",
      "1",
      "Tidak ada output",
      "Tergantung rangkaian"
    ],
    correctAnswer: 1,
    explanation: "Gerbang NOT membalik input. Jika input 0, maka output 1. Jika input 1, maka output 0.",
    category: "NOT"
  },
  {
    id: 7,
    question: "Manakah yang merupakan contoh aplikasi gerbang AND?",
    options: [
      "Sistem alarm dengan berbagai sensor",
      "Sistem keamanan yang memerlukan semua kondisi terpenuhi",
      "Saklar lampu biasa",
      "Speaker dengan volume control"
    ],
    correctAnswer: 1,
    explanation: "Gerbang AND digunakan dalam sistem keamanan dimana SEMUA kondisi harus terpenuhi (misal: kartu akses + PIN + sidik jari) untuk memberikan akses.",
    category: "AND"
  },
  {
    id: 8,
    question: "IC yang mengandung gerbang OR adalah:",
    options: [
      "IC 7400",
      "IC 7432",
      "IC 7404",
      "IC 7486"
    ],
    correctAnswer: 1,
    explanation: "IC 7432 adalah integrated circuit yang mengandung 4 buah gerbang OR 2-input.",
    category: "OR"
  }
]

export function BasicGatesQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(new Array(questions.length).fill(false))
  const [userAnswers, setUserAnswers] = useState<number[]>(new Array(questions.length).fill(-1))
  const [quizCompleted, setQuizCompleted] = useState(false)

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return
    setSelectedAnswer(answerIndex)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return

    const newAnsweredQuestions = [...answeredQuestions]
    const newUserAnswers = [...userAnswers]
    
    newAnsweredQuestions[currentQuestion] = true
    newUserAnswers[currentQuestion] = selectedAnswer
    
    setAnsweredQuestions(newAnsweredQuestions)
    setUserAnswers(newUserAnswers)

    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }

    setShowExplanation(true)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      setQuizCompleted(true)
    }
  }

  const handleRestartQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setScore(0)
    setAnsweredQuestions(new Array(questions.length).fill(false))
    setUserAnswers(new Array(questions.length).fill(-1))
    setQuizCompleted(false)
  }

  const getScorePercentage = () => {
    return Math.round((score / questions.length) * 100)
  }

  const getScoreMessage = () => {
    const percentage = getScorePercentage()
    if (percentage >= 90) return "Excellent! 🎉"
    if (percentage >= 70) return "Good Job! 👍"
    if (percentage >= 50) return "Not Bad! 😊"
    return "Keep Learning! 📚"
  }

  if (quizCompleted) {
    return (
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mb-6"
        >
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-2xl font-bold mb-2">Kuis Selesai!</h2>
          <p className="text-lg text-gray-600 mb-4">{getScoreMessage()}</p>
        </motion.div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {score}/{questions.length}
          </div>
          <div className="text-lg text-gray-700 mb-4">
            Skor: {getScorePercentage()}%
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-green-100 p-3 rounded">
              <div className="font-semibold text-green-800">Benar</div>
              <div className="text-green-600">{score} soal</div>
            </div>
            <div className="bg-red-100 p-3 rounded">
              <div className="font-semibold text-red-800">Salah</div>
              <div className="text-red-600">{questions.length - score} soal</div>
            </div>
            <div className="bg-blue-100 p-3 rounded">
              <div className="font-semibold text-blue-800">Total</div>
              <div className="text-blue-600">{questions.length} soal</div>
            </div>
          </div>
        </div>

        <Button onClick={handleRestartQuiz} className="bg-blue-600 hover:bg-blue-700">
          <RotateCcw className="w-4 h-4 mr-2" />
          Ulangi Kuis
        </Button>
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Soal {currentQuestion + 1} dari {questions.length}</span>
          <span>Kategori: {question.category}</span>
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
        className="bg-white"
      >
        <h3 className="text-xl font-semibold mb-6 text-gray-800">
          {question.question}
        </h3>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {question.options.map((option, index) => (
            <motion.button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                selectedAnswer === index
                  ? showExplanation
                    ? index === question.correctAnswer
                      ? "border-green-500 bg-green-50"
                      : "border-red-500 bg-red-50"
                    : "border-blue-500 bg-blue-50"
                  : showExplanation && index === question.correctAnswer
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
              disabled={showExplanation}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {showExplanation && (
                  <div>
                    {index === question.correctAnswer && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                    {selectedAnswer === index && index !== question.correctAnswer && (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
          >
            <h4 className="font-semibold text-blue-800 mb-2">Penjelasan:</h4>
            <p className="text-blue-700">{question.explanation}</p>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          {!showExplanation ? (
            <Button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
            >
              Submit Jawaban
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              className="bg-green-600 hover:bg-green-700"
            >
              {currentQuestion < questions.length - 1 ? (
                <>
                  Soal Selanjutnya
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              ) : (
                "Selesai"
              )}
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
