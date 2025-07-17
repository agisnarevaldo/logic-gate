"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAcademicScoring } from "@/hooks/useAcademicScoring"
import { QuizDetailedResults, QuestionResult } from "@/types/academic-scoring"
import { formatTime } from "@/utils/academic-scoring"

interface TruthTableQuestion {
  id: number
  gate: string
  description: string
  inputs: string[]
  truthTable: { inputs: number[], output: number | null }[]
  missingOutputs: number[] // indices of outputs to be filled
}

const questions: TruthTableQuestion[] = [
  {
    id: 1,
    gate: "AND",
    description: "Lengkapi tabel kebenaran untuk gerbang AND",
    inputs: ["A", "B"],
    truthTable: [
      { inputs: [0, 0], output: null },
      { inputs: [0, 1], output: null },
      { inputs: [1, 0], output: null },
      { inputs: [1, 1], output: null }
    ],
    missingOutputs: [0, 1, 2, 3]
  },
  {
    id: 2,
    gate: "OR", 
    description: "Lengkapi tabel kebenaran untuk gerbang OR",
    inputs: ["A", "B"],
    truthTable: [
      { inputs: [0, 0], output: null },
      { inputs: [0, 1], output: null },
      { inputs: [1, 0], output: null },
      { inputs: [1, 1], output: null }
    ],
    missingOutputs: [0, 1, 2, 3]
  },
  {
    id: 3,
    gate: "NAND",
    description: "Lengkapi tabel kebenaran untuk gerbang NAND",
    inputs: ["A", "B"],
    truthTable: [
      { inputs: [0, 0], output: null },
      { inputs: [0, 1], output: null },
      { inputs: [1, 0], output: null },
      { inputs: [1, 1], output: null }
    ],
    missingOutputs: [0, 1, 2, 3]
  },
  {
    id: 4,
    gate: "XOR",
    description: "Lengkapi tabel kebenaran untuk gerbang XOR",
    inputs: ["A", "B"],
    truthTable: [
      { inputs: [0, 0], output: null },
      { inputs: [0, 1], output: null },
      { inputs: [1, 0], output: null },
      { inputs: [1, 1], output: null }
    ],
    missingOutputs: [0, 1, 2, 3]
  },
  {
    id: 5,
    gate: "NOR",
    description: "Lengkapi beberapa output untuk gerbang NOR",
    inputs: ["A", "B"],
    truthTable: [
      { inputs: [0, 0], output: 1 },
      { inputs: [0, 1], output: null },
      { inputs: [1, 0], output: null },
      { inputs: [1, 1], output: 0 }
    ],
    missingOutputs: [1, 2]
  }
]

// Correct answers for each gate
const correctAnswers: Record<string, number[]> = {
  "AND": [0, 0, 0, 1],
  "OR": [0, 1, 1, 1],
  "NAND": [1, 1, 1, 0],
  "XOR": [0, 1, 1, 0],
  "NOR": [1, 0, 0, 0]
}

export function TruthTableQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [totalQuestions] = useState(questions.length)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [currentAttemptId, setCurrentAttemptId] = useState<string | null>(null)
  const [quizResults, setQuizResults] = useState<{
    score: number
    percentage: number
    grade: string
    timeSpent: number
    feedback: {
      message: string
      suggestions: string[]
      achievements: string[]
    } | null
  } | null>(null)
  const [allQuestionScores, setAllQuestionScores] = useState<number[]>([])

  const { 
    startQuizAttempt, 
    completeQuizAttempt, 
    calculateGrade
  } = useAcademicScoring()

  // Initialize the quiz with academic scoring
  useEffect(() => {
    const initializeQuiz = async () => {
      setStartTime(new Date())
      
      // Start new attempt in database
      try {
        const attemptId = await startQuizAttempt('TRUTH_TABLE', questions.length)
        setCurrentAttemptId(attemptId)
      } catch (error) {
        console.error('Failed to start quiz attempt:', error)
      }
    }
    
    initializeQuiz()
  }, [startQuizAttempt])

  const question = questions[currentQuestion]

  // Initialize user answers for current question
  useEffect(() => {
    const initialAnswers = new Array(question.truthTable.length).fill(null)
    question.truthTable.forEach((row, index) => {
      if (row.output !== null) {
        initialAnswers[index] = row.output
      }
    })
    setUserAnswers(initialAnswers)
  }, [currentQuestion, question.truthTable])

  const handleOutputChange = (rowIndex: number, value: number) => {
    if (submitted) return
    
    const newAnswers = [...userAnswers]
    newAnswers[rowIndex] = value
    setUserAnswers(newAnswers)
  }

  const handleSubmit = () => {
    const correctOutputs = correctAnswers[question.gate]
    let correct = 0
    
    question.missingOutputs.forEach(index => {
      if (userAnswers[index] === correctOutputs[index]) {
        correct++
      }
    })

    // Store score for this question
    const newScores = [...allQuestionScores]
    newScores[currentQuestion] = correct
    setAllQuestionScores(newScores)

    if (correct === question.missingOutputs.length) {
      setScore(score + 1)
    }

    setSubmitted(true)
  }

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSubmitted(false)
      
      // Reset answers for next question
      const nextQuestion = questions[currentQuestion + 1]
      const initialAnswers = new Array(nextQuestion.truthTable.length).fill(null)
      nextQuestion.truthTable.forEach((row, index) => {
        if (row.output !== null) {
          initialAnswers[index] = row.output
        }
      })
      setUserAnswers(initialAnswers)
    } else {
      // Quiz completed - save to database
      if (currentAttemptId && startTime) {
        const timeSpentSeconds = Math.floor((new Date().getTime() - startTime.getTime()) / 1000)
        const totalCorrect = allQuestionScores.reduce((sum, score) => sum + score, 0)
        
        // Prepare detailed results
        const questionResults: QuestionResult[] = questions.map((q, index) => ({
          question_id: `truth_table_${q.id}`,
          question_text: q.description,
          user_answer: allQuestionScores[index]?.toString() || '0',
          correct_answer: q.missingOutputs.length.toString(),
          is_correct: allQuestionScores[index] === q.missingOutputs.length,
          time_taken_seconds: Math.floor(timeSpentSeconds / questions.length),
          difficulty: 'hard' as const,
          topic: 'truth_table'
        }))

        const detailedResults: QuizDetailedResults = {
          questions: questionResults,
          summary: {
            total_questions: questions.length,
            correct_answers: totalCorrect,
            incorrect_answers: (questions.length * 4) - totalCorrect, // Assuming 4 outputs per question
            time_taken_seconds: timeSpentSeconds
          }
        }

        try {
          // Complete the attempt in database
          const completedAttempt = await completeQuizAttempt(
            currentAttemptId,
            totalCorrect,
            questions.length * 4, // Total possible score (4 outputs per question)
            timeSpentSeconds,
            detailedResults
          )

          if (completedAttempt) {
            const grade = calculateGrade(completedAttempt.percentage || 0)
            
            setQuizResults({
              score: totalCorrect,
              percentage: completedAttempt.percentage || 0,
              grade: grade.grade,
              timeSpent: timeSpentSeconds,
              feedback: null
            })
          }
        } catch (error) {
          console.error('Failed to complete quiz:', error)
          // Fallback to local scoring
          const localPercentage = Math.round((totalCorrect / (questions.length * 4)) * 100)
          const localGrade = calculateGrade(localPercentage)
          
          setQuizResults({
            score: totalCorrect,
            percentage: localPercentage,
            grade: localGrade.grade,
            timeSpent: timeSpentSeconds,
            feedback: null
          })
        }
      }
      
      setQuizCompleted(true)
    }
  }

  const handleRestart = async () => {
    setCurrentQuestion(0)
    setSubmitted(false)
    setScore(0)
    setQuizCompleted(false)
    setQuizResults(null)
    setAllQuestionScores([])
    setStartTime(new Date())
    
    // Start new attempt in database
    try {
      const attemptId = await startQuizAttempt('TRUTH_TABLE', questions.length)
      setCurrentAttemptId(attemptId)
    } catch (error) {
      console.error('Failed to start quiz attempt:', error)
    }
    
    // Reset to first question
    const firstQuestion = questions[0]
    const initialAnswers = new Array(firstQuestion.truthTable.length).fill(null)
    firstQuestion.truthTable.forEach((row, index) => {
      if (row.output !== null) {
        initialAnswers[index] = row.output
      }
    })
    setUserAnswers(initialAnswers)
  }

  const isComplete = () => {
    return question.missingOutputs.every(index => userAnswers[index] !== null)
  }

  const getScorePercentage = () => {
    return Math.round((score / totalQuestions) * 100)
  }

  if (quizCompleted) {
    return (
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mb-6"
        >
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold mb-2">Kuis Selesai!</h2>
          <p className="text-lg text-gray-600 mb-4">
            {getScorePercentage() >= 80 ? "Excellent! 🎉" : 
             getScorePercentage() >= 60 ? "Good Job! 👍" : "Keep Learning! 📚"}
          </p>
        </motion.div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="text-4xl font-bold text-green-600 mb-2">
            {quizResults ? quizResults.score : score}/{quizResults ? questions.length * 4 : totalQuestions}
          </div>
          <div className="text-lg text-gray-700 mb-2">
            Skor: {quizResults?.percentage || getScorePercentage()}%
          </div>
          {quizResults && (
            <>
              <div className="text-lg font-semibold mb-2">
                Grade: <span className={`px-2 py-1 rounded ${
                  quizResults.grade === 'A+' || quizResults.grade === 'A' ? 'bg-green-100 text-green-800' :
                  quizResults.grade === 'A-' || quizResults.grade === 'B+' ? 'bg-blue-100 text-blue-800' :
                  quizResults.grade === 'B' || quizResults.grade === 'B-' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {quizResults.grade}
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-4">
                Waktu: {formatTime(quizResults.timeSpent)}
              </div>
            </>
          )}
          
          {quizResults && (
            <div className="mt-4 text-center text-sm text-gray-600">
              {quizResults.percentage >= 95 ? "Sempurna! 🎉" : 
               quizResults.percentage >= 85 ? "Excellent! ⭐" :
               quizResults.percentage >= 75 ? "Bagus! 👍" : 
               quizResults.percentage >= 60 ? "Cukup baik 📚" :
               "Perlu belajar lagi 📖"}
            </div>
          )}
        </div>

        <Button onClick={handleRestart} className="bg-green-600 hover:bg-green-700">
          <RotateCcw className="w-4 h-4 mr-2" />
          Ulangi Kuis
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Soal {currentQuestion + 1} dari {totalQuestions}</span>
          <span>Gerbang: {question.gate}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white"
      >
        <h3 className="text-xl font-semibold mb-6 text-gray-800">
          {question.description}
        </h3>

        {/* Truth Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse border border-gray-300 mx-auto max-w-md">
            <thead>
              <tr className="bg-gray-100">
                {question.inputs.map(input => (
                  <th key={input} className="border border-gray-300 p-3 font-semibold">
                    {input}
                  </th>
                ))}
                <th className="border border-gray-300 p-3 font-semibold">
                  Output
                </th>
              </tr>
            </thead>
            <tbody>
              {question.truthTable.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {row.inputs.map((input, inputIndex) => (
                    <td key={inputIndex} className="border border-gray-300 p-3 text-center">
                      {input}
                    </td>
                  ))}
                  <td className="border border-gray-300 p-3 text-center">
                    {question.missingOutputs.includes(rowIndex) ? (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleOutputChange(rowIndex, 0)}
                          className={`w-8 h-8 rounded border-2 font-semibold transition-all ${
                            userAnswers[rowIndex] === 0
                              ? submitted
                                ? correctAnswers[question.gate][rowIndex] === 0
                                  ? "border-green-500 bg-green-50 text-green-700"
                                  : "border-red-500 bg-red-50 text-red-700"
                                : "border-blue-500 bg-blue-50 text-blue-700"
                              : submitted && correctAnswers[question.gate][rowIndex] === 0
                              ? "border-green-500 bg-green-50 text-green-700"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                          disabled={submitted}
                        >
                          0
                        </button>
                        <button
                          onClick={() => handleOutputChange(rowIndex, 1)}
                          className={`w-8 h-8 rounded border-2 font-semibold transition-all ${
                            userAnswers[rowIndex] === 1
                              ? submitted
                                ? correctAnswers[question.gate][rowIndex] === 1
                                  ? "border-green-500 bg-green-50 text-green-700"
                                  : "border-red-500 bg-red-50 text-red-700"
                                : "border-blue-500 bg-blue-50 text-blue-700"
                              : submitted && correctAnswers[question.gate][rowIndex] === 1
                              ? "border-green-500 bg-green-50 text-green-700"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                          disabled={submitted}
                        >
                          1
                        </button>
                      </div>
                    ) : (
                      <span className="font-semibold">{row.output}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Feedback */}
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center gap-2 mb-2">
              {question.missingOutputs.every(index => userAnswers[index] === correctAnswers[question.gate][index]) ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-700">Benar!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="font-semibold text-red-700">Ada yang salah</span>
                </>
              )}
            </div>
            <p className="text-blue-700">
              Gerbang {question.gate}: {
                question.gate === "AND" ? "Output 1 hanya jika semua input 1" :
                question.gate === "OR" ? "Output 1 jika minimal satu input 1" :
                question.gate === "NAND" ? "Kebalikan dari AND" :
                question.gate === "NOR" ? "Kebalikan dari OR" :
                question.gate === "XOR" ? "Output 1 jika input berbeda" :
                "Output 1 jika input sama"
              }
            </p>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          {!submitted ? (
            <Button
              onClick={handleSubmit}
              disabled={!isComplete()}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300"
            >
              Submit Jawaban
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700"
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
