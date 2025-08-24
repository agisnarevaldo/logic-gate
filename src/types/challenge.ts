export interface ChallengeComponent {
  id: string
  type: "INPUT" | "OUTPUT" | "MISSING" | "AND" | "OR" | "NOT" | "NAND" | "NOR" | "XOR" | "XNOR"
  position: { x: number; y: number }
  width: number
  height: number
  inputs: { id: string; name: string; value: boolean }[]
  outputs: { id: string; name: string; value: boolean }[]
  isFixed?: boolean // Komponen yang tidak bisa diubah
}

export interface ChallengeConnection {
  id: string
  from: { componentId: string; portId: string }
  to: { componentId: string; portId: string }
}

export interface Challenge {
  id: number
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  components: ChallengeComponent[]
  connections: ChallengeConnection[]
  missingComponentId: string // ID komponen yang harus dijawab
  correctAnswer: "AND" | "OR" | "NOT" | "NAND" | "NOR" | "XOR" | "XNOR"
  inputValues: { [componentId: string]: boolean } // Nilai input untuk testing
  expectedOutput: boolean // Output yang diharapkan
  explanation?: string
}

export interface ChallengeSession {
  currentChallengeIndex: number
  challenges: Challenge[]
  score: number
  completed: boolean
  answers: { [challengeId: number]: string }
}
