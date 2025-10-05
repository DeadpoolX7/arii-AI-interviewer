export interface InterviewQuestion {
  id: string
  question: string
  type: "technical" | "behavioral"
  answer?: string
  feedback?: string
  score?: number
}

export interface InterviewSession {
  sessionId: string
  userId: string
  role: string
  resumeText: string
  resumeFileName: string
  questions: InterviewQuestion[]
  answers: string[]
  feedback: string[]
  scores: number[]
  overallScore?: number
  createdAt: Date
  completedAt?: Date
  status: "draft" | "in-progress" | "completed"
}

export interface UserProfile {
  uid: string
  email: string
  createdAt: Date
  interviewCount: number
}
