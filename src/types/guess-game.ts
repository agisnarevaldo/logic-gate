export interface GuessGameImage {
  id: string
  filename: string
  category: string
  isCorrect: boolean
}

export interface GuessGameChallenge {
  id: string
  title: string
  description: string
  targetDescription: string
  gateType: string
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  correctCount: number
  totalImages: number
  timeLimit: number // dalam detik
}

export interface GuessGameSession {
  challengeIndex: number
  challenges: GuessGameChallenge[]
  selectedImages: string[]
  correctSelections: string[]
  incorrectSelections: string[]
  score: number
  lives: number
  maxLives: number
  isCompleted: boolean
  timeStarted: number
  timeRemaining: number
  currentImages: GuessGameImage[]
}

export type GuessGameState = 'instructions' | 'playing' | 'checking' | 'result' | 'completed'
