export type QuestionType =
  | 'multiple_choice'
  | 'matching'
  | 'drag_drop_classify'
  | 'drag_drop_order'

export interface MultipleChoiceQuestion {
  id: number
  type: 'multiple_choice'
  title: string
  question: string
  options: string[]
  correctAnswer: number
  hint: string
  explanation: string
}

export interface MatchingPair {
  id: string
  left: string
  right: string
}

export interface MatchingQuestion {
  id: number
  type: 'matching'
  title: string
  instruction: string
  pairs: MatchingPair[]
  hint: string
  explanation: string
}

export interface DragDropClassifyCategory {
  id: string
  title: string
  badge: string
  borderColor: string
  bgColor: string
}

export interface DragDropClassifyItem {
  id: string
  text: string
  targetCategoryId: string
}

export interface DragDropClassifyQuestion {
  id: number
  type: 'drag_drop_classify'
  title: string
  instruction: string
  categories: DragDropClassifyCategory[]
  items: DragDropClassifyItem[]
  hint: string
  explanation: string
}

export interface OrderItem {
  id: string
  title: string
  period: string
  scientist: string
}

export interface DragDropOrderQuestion {
  id: number
  type: 'drag_drop_order'
  title: string
  instruction: string
  correctOrder: OrderItem[]
  hint: string
  explanation: string
}

export type QuizQuestion =
  | MultipleChoiceQuestion
  | MatchingQuestion
  | DragDropClassifyQuestion
  | DragDropOrderQuestion

export interface QuestionStatus {
  answered: boolean
  isCorrect: boolean
  attempts: number
  checked?: boolean
  frozen?: boolean
}

// ==========================================
// SPESIFIKASI LAMPIRAN B: STRUKTUR DATA LOCALSTORAGE
// ==========================================

export interface ItemResponseRecord {
  questionId: number
  questionType: QuestionType
  firstAnswer: any
  finalAnswer: any
  attemptsCount: number
  isCorrect: boolean
  firstAttemptCorrect: boolean
  submittedAt: string
}

export interface QuizAttemptSession {
  attemptId: string
  guestSessionId: string
  questionVersion: string
  createdAt: string
  updatedAt: string
  isCompleted: boolean
  completedAt?: string
  currentQuestionIndex: number
  draftAnswers: Record<number, any>
  frozenQuestions: Record<number, boolean>
  itemResponses: Record<number, ItemResponseRecord>
  firstAttemptScore: number
  masteryScore: number
}

export interface FinalScoreHistory {
  attemptId: string
  guestSessionId: string
  questionVersion: string
  completedAt: string
  totalQuestions: number
  firstAttemptCorrectCount: number
  firstAttemptScore: number
  masteryScore: number
  totalAttemptsMade: number
}

export interface StorageOperationResult<T = void> {
  success: boolean
  data?: T
  error?: string
  quotaExceeded?: boolean
  isFallbackMemory?: boolean
}
