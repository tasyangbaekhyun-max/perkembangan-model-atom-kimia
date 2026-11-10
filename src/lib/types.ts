import type { Bab4QuizSubmissionPayload, UserRole } from '../types/bab4Contract'

export interface UserAccess {
  userId: string
  name: string
  email?: string
  alias: string // Format: "Nama Siswa (Kode Kelas)"
  role: UserRole
  classCode?: string
  schoolName?: string
  isAuthenticated: boolean
}

export type SubmissionStatus = 'lokal' | 'menunggu kirim' | 'terkirim' | 'gagal'

export interface SubmissionQueueItem {
  submissionId: string
  attemptId: string
  accountId: string
  payload: Bab4QuizSubmissionPayload
  status: SubmissionStatus
  errorMessage?: string
  createdAt: string
  lastAttemptAt: string
  retryCount: number
}

export interface GuestResultsSummary {
  guestSessionId: string
  attemptId: string
  totalQuestions: number
  firstAttemptScore: number
  masteryScore: number
  completedAt?: string
  hasCompletedAttempt: boolean
}

