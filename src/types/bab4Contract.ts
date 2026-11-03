/**
 * KONTRAK SISTEM DAN BASIS DATA BAB 4 (Perancangan Sistem & Basis Data)
 * Web Pembelajaran Interaktif Model-Model Atom (AtomLab)
 * Sesuai Dokumen PRD v1.0 dan Panduan AGENT.md
 */

// ==========================================
// 1. ENTITAS PENGGUNA & AUTENTIKASI (Bab 4.1)
// ==========================================

export type UserRole = 'student' | 'teacher' | 'admin' | 'guest'

export interface Bab4User {
  id: string
  name: string
  email?: string
  role: UserRole
  classCode?: string
  schoolName?: string
  createdAt: string
  lastLoginAt: string
}

export interface Bab4LoginRequest {
  email: string
  passwordHash: string
  classCode?: string
}

export interface Bab4LoginResponse {
  token: string
  user: Bab4User
  expiresAt: string
}

export interface Bab4GuestSessionRequest {
  clientGuestId: string
  deviceInfo?: string
}

export interface Bab4GuestSessionResponse {
  guestSessionId: string
  role: 'guest'
  allocatedAt: string
  expiresAt: string
}

// ==========================================
// 2. KONTRAK EVALUASI & PENGIRIMAN BASIS DATA (Bab 4.2)
// ==========================================

export interface Bab4ItemResponsePayload {
  questionId: number
  questionType: 'multiple_choice' | 'matching' | 'drag_drop_classify' | 'drag_drop_order'
  firstAnswer: any
  finalAnswer: any
  attemptsCount: number
  isCorrect: boolean
  firstAttemptCorrect: boolean
  durationSeconds?: number
  submittedAt: string
}

export interface Bab4QuizSubmissionPayload {
  submissionId: string
  attemptId: string
  guestSessionId?: string
  userId?: string
  classCode?: string
  questionVersion: string
  totalQuestions: number
  firstAttemptScore: number // 0 - 100
  masteryScore: number      // 0 - 100
  totalAttemptsMade: number
  startedAt: string
  completedAt: string
  itemResponses: Bab4ItemResponsePayload[]
  telemetry: {
    browserAgent: string
    screenResolution: string
    inputMethod: 'mouse' | 'touch' | 'keyboard' | 'mixed'
    storageMode: 'localStorage' | 'memoryFallback'
  }
}

export interface Bab4QuizSubmissionResponse {
  status: 'success' | 'queued' | 'error'
  recordedAt: string
  submissionId: string
  attemptId: string
  message: string
}

// ==========================================
// 3. KONTRAK LOG JEJAK RISET (D-01 s.d D-04)
// ==========================================

export interface Bab4TelemetryEvent {
  eventId: string
  attemptId: string
  guestSessionId: string
  eventType: 'view_question' | 'select_option' | 'submit_check' | 'try_again' | 'navigate' | 'keyboard_shortcut'
  payload: Record<string, any>
  timestamp: string
}

