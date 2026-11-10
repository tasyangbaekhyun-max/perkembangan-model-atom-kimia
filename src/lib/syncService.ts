/**
 * SYNC SERVICE: Manajemen Pengiriman, Antrean, dan Partisi Ruang Akun
 * Memenuhi Aturan:
 * 1. Simpan draf dan hasil sebelum request jaringan (Offline-first)
 * 2. Pertahankan satu ID percobaan ketika retry; percobaan baru memakai ID baru
 * 3. Abaikan respons request lama jika akun sudah berubah (Race-condition protection)
 * 4. Hasil/antrean selalu dibaca dari ruang akun aktif
 * 5. Tawarkan pemilihan hasil tamu; jangan otomatis menganggap hasil perangkat milik orang yang baru login
 * 6. Tampilkan lokal / menunggu kirim / terkirim / gagal dengan teks yang benar
 * 7. Jangan menyalin token/email ke log atau UI hasil
 */

import { authService } from './authService'
import type { SubmissionStatus, SubmissionQueueItem, GuestResultsSummary } from './types'
import type { QuizAttemptSession, FinalScoreHistory } from '../types/quiz'
import type { Bab4QuizSubmissionPayload } from '../types/bab4Contract'
import { Bab4ApiService } from '../services/bab4ApiService'
import { QUESTION_SET_VERSION } from '../data/quizQuestions'

export class SyncService {
  private static getPartitionPrefix(): string {
    const accountId = authService.getActiveAccountId()
    return `atomlab_acc_${accountId}`
  }

  public static getSessionStorageKey(): string {
    return `${this.getPartitionPrefix()}_active_session`
  }

  public static getHistoryStorageKey(): string {
    return `${this.getPartitionPrefix()}_score_history`
  }

  public static getQueueStorageKey(): string {
    return `${this.getPartitionPrefix()}_submission_queue`
  }

  /**
   * Memuat sesi kuis dari ruang akun aktif
   */
  public static loadActiveSession(): QuizAttemptSession {
    const key = this.getSessionStorageKey()
    if (typeof window === 'undefined') return this.createInitialSession()

    try {
      const raw = window.localStorage.getItem(key)
      if (raw) {
        const parsed = JSON.parse(raw) as QuizAttemptSession
        if (parsed && parsed.attemptId) {
          return parsed
        }
      }
    } catch {
      // Fallback
    }

    const newSession = this.createInitialSession()
    this.saveDraftLocally(newSession)
    return newSession
  }

  /**
   * Simpan draf secara lokal sebelum request jaringan
   * Sesuai aturan: "Simpan draf dan hasil sebelum request jaringan"
   */
  public static saveDraftLocally(session: QuizAttemptSession): void {
    session.updatedAt = new Date().toISOString()
    const key = this.getSessionStorageKey()
    try {
      window.localStorage.setItem(key, JSON.stringify(session))
    } catch {
      // Memory fallback jika quota habis
    }
  }

  /**
   * Memuat riwayat skor dari ruang akun aktif
   */
  public static loadScoreHistory(): FinalScoreHistory[] {
    const key = this.getHistoryStorageKey()
    if (typeof window === 'undefined') return []
    try {
      const raw = window.localStorage.getItem(key)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) return parsed
      }
    } catch {
      // Fallback
    }
    return []
  }

  /**
   * Simpan skor akhir ke riwayat ruang akun aktif sebelum jaringan
   */
  public static saveFinalScoreLocally(historyItem: FinalScoreHistory): void {
    const list = this.loadScoreHistory()
    const updated = [historyItem, ...list].slice(0, 10)
    const key = this.getHistoryStorageKey()
    try {
      window.localStorage.setItem(key, JSON.stringify(updated))
    } catch {
      // Fallback
    }
  }

  /**
   * Memuat antrean pengiriman ruang akun aktif
   */
  public static loadQueue(): SubmissionQueueItem[] {
    const key = this.getQueueStorageKey()
    if (typeof window === 'undefined') return []
    try {
      const raw = window.localStorage.getItem(key)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) return parsed
      }
    } catch {
      // Fallback
    }
    return []
  }

  /**
   * Simpan antrean pengiriman ruang akun aktif
   */
  public static saveQueue(items: SubmissionQueueItem[]): void {
    const key = this.getQueueStorageKey()
    try {
      window.localStorage.setItem(key, JSON.stringify(items))
    } catch {
      // Fallback
    }
  }

  /**
   * Mengambil status pengiriman untuk attemptId tertentu di ruang akun aktif
   */
  public static getSubmissionStatus(attemptId: string): SubmissionStatus {
    const queue = this.loadQueue()
    const item = queue.find((q) => q.attemptId === attemptId)
    if (!item) return 'lokal'
    return item.status
  }

  /**
   * Kirim atau Coba Kirim Lagi (Retry) hasil kuis
   * Sesuai aturan:
   * - Pertahankan satu ID percobaan ketika retry; percobaan baru memakai ID baru
   * - Abaikan respons request lama jika akun sudah berubah
   * - Tampilkan lokal / menunggu kirim / terkirim/gagal dengan teks yang benar
   */
  public static async submitQuizAttempt(
    session: QuizAttemptSession,
    isRetry = false
  ): Promise<{ status: SubmissionStatus; message: string }> {
    const activeAccountId = authService.getActiveAccountId()
    const access = authService.getAccess()

    // 1. Simpan draf dan hasil secara lokal SEBELUM request jaringan
    this.saveDraftLocally(session)

    // Bentuk payload yang mematuhi Kontrak Bab 4
    // PENTING: Jangan menyalin token/email ke log atau UI hasil!
    const submissionId = `SUB-${Date.now()}-${session.attemptId.slice(-4)}`
    const payload: Bab4QuizSubmissionPayload = {
      submissionId,
      attemptId: session.attemptId, // Pertahankan satu ID percobaan ketika retry!
      guestSessionId: session.guestSessionId,
      userId: access.isAuthenticated ? access.userId : undefined,
      classCode: access.classCode,
      questionVersion: session.questionVersion || QUESTION_SET_VERSION,
      totalQuestions: 10,
      firstAttemptScore: session.firstAttemptScore,
      masteryScore: session.masteryScore,
      totalAttemptsMade: Object.values(session.itemResponses).reduce((sum, r) => sum + r.attemptsCount, 0),
      startedAt: session.createdAt,
      completedAt: session.completedAt || new Date().toISOString(),
      itemResponses: Object.values(session.itemResponses).map((r) => ({
        questionId: r.questionId,
        questionType: r.questionType,
        firstAnswer: r.firstAnswer,
        finalAnswer: r.finalAnswer,
        attemptsCount: r.attemptsCount,
        isCorrect: r.isCorrect,
        firstAttemptCorrect: r.firstAttemptCorrect,
        submittedAt: r.submittedAt,
      })),
      telemetry: {
        browserAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Browser',
        screenResolution: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : '1920x1080',
        inputMethod: 'mixed',
        storageMode: 'localStorage',
      },
    }

    // 2. Simpan ke antrean dengan status "menunggu kirim"
    const queue = this.loadQueue()
    const existingIndex = queue.findIndex((q) => q.attemptId === session.attemptId)

    const queueItem: SubmissionQueueItem = {
      submissionId,
      attemptId: session.attemptId, // ID tetap sama saat retry
      accountId: activeAccountId,
      payload,
      status: 'menunggu kirim',
      createdAt: existingIndex >= 0 ? queue[existingIndex].createdAt : new Date().toISOString(),
      lastAttemptAt: new Date().toISOString(),
      retryCount: isRetry && existingIndex >= 0 ? queue[existingIndex].retryCount + 1 : 0,
    }

    if (existingIndex >= 0) {
      queue[existingIndex] = queueItem
    } else {
      queue.unshift(queueItem)
    }
    this.saveQueue(queue)

    // 3. Catat ID akun pemohon saat request jaringan dilepas
    const requestAccountId = activeAccountId

    try {
      const res = await Bab4ApiService.submitQuizResults(payload)

      // 4. ATURAN KRUSIAL: Abaikan respons request lama jika akun sudah berubah!
      if (authService.getActiveAccountId() !== requestAccountId) {
        // Akun sudah beralih di tengah proses jaringan, abaikan respons!
        return {
          status: 'gagal',
          message: 'Respons jaringan diabaikan karena akun pengguna telah beralih.',
        }
      }

      // Update antrean pada ruang akun aktif
      const currentQueue = this.loadQueue()
      const itemToUpdate = currentQueue.find((q) => q.attemptId === session.attemptId)
      if (itemToUpdate) {
        itemToUpdate.status = 'terkirim'
        itemToUpdate.lastAttemptAt = new Date().toISOString()
        this.saveQueue(currentQueue)
      }

      return {
        status: 'terkirim',
        message: res.message || 'Hasil kuis berhasil terkirim ke basis data riset.',
      }
    } catch (err: any) {
      // Periksa kembali apakah akun sudah berubah
      if (authService.getActiveAccountId() !== requestAccountId) {
        return {
          status: 'gagal',
          message: 'Respons diabaikan karena akun beralih.',
        }
      }

      const currentQueue = this.loadQueue()
      const itemToUpdate = currentQueue.find((q) => q.attemptId === session.attemptId)
      if (itemToUpdate) {
        itemToUpdate.status = 'gagal'
        itemToUpdate.errorMessage = err?.message || 'Gagal tersambung ke server riset.'
        itemToUpdate.lastAttemptAt = new Date().toISOString()
        this.saveQueue(currentQueue)
      }

      return {
        status: 'gagal',
        message: err?.message || 'Gagal mengirimkan hasil ke server. Tersedia tombol Coba Kirim Lagi.',
      }
    }
  }

  /**
   * Cek apakah ada data kuis tamu di perangkat ini
   * Sesuai aturan: "Tawarkan pemilihan hasil tamu; jangan otomatis menganggap hasil perangkat milik orang yang baru login."
   */
  public static getUnclaimedGuestResults(): GuestResultsSummary | null {
    if (typeof window === 'undefined') return null
    try {
      const guestKey = 'atomlab_acc_guest_active_session'
      const raw = window.localStorage.getItem(guestKey)
      if (!raw) return null

      const parsed = JSON.parse(raw) as QuizAttemptSession
      if (parsed && parsed.attemptId && Object.keys(parsed.itemResponses).length > 0) {
        return {
          guestSessionId: parsed.guestSessionId,
          attemptId: parsed.attemptId,
          totalQuestions: 10,
          firstAttemptScore: parsed.firstAttemptScore,
          masteryScore: parsed.masteryScore,
          completedAt: parsed.completedAt,
          hasCompletedAttempt: parsed.isCompleted,
        }
      }
    } catch {
      // Fallback
    }
    return null
  }

  /**
   * Tautkan hasil tamu ke akun yang baru login (Pilihan Pengguna)
   */
  public static claimGuestResultsToAccount(targetAccountId: string): void {
    if (typeof window === 'undefined') return
    try {
      const guestSessionKey = 'atomlab_acc_guest_active_session'
      const guestHistoryKey = 'atomlab_acc_guest_score_history'
      const targetSessionKey = `atomlab_acc_${targetAccountId}_active_session`
      const targetHistoryKey = `atomlab_acc_${targetAccountId}_score_history`

      const rawSession = window.localStorage.getItem(guestSessionKey)
      if (rawSession) {
        window.localStorage.setItem(targetSessionKey, rawSession)
        window.localStorage.removeItem(guestSessionKey)
      }

      const rawHistory = window.localStorage.getItem(guestHistoryKey)
      if (rawHistory) {
        window.localStorage.setItem(targetHistoryKey, rawHistory)
        window.localStorage.removeItem(guestHistoryKey)
      }
    } catch {
      // Fallback
    }
  }

  /**
   * Biarkan hasil tamu terpisah / Bersihkan slot tamu tanpa menyentuh akun
   */
  public static dismissGuestResults(): void {
    // Sesi tamu dibiarkan tetap di slot tamu atau diabaikan oleh akun baru
  }

  /**
   * Periksa apakah ada hasil yang belum terkirim di akun aktif
   * Sesuai aturan: "Logout menjelaskan hasil belum terkirim dan pilihan perangkat bersama"
   */
  public static getUnsentItemsCount(): number {
    const queue = this.loadQueue()
    return queue.filter((q) => q.status === 'menunggu kirim' || q.status === 'gagal').length
  }

  /**
   * Membuat sesi inisial baru dengan ID Percobaan baru
   */
  public static createInitialSession(): QuizAttemptSession {
    const accountId = authService.getActiveAccountId()
    const attemptId = `ATT-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
    const now = new Date().toISOString()

    return {
      attemptId,
      guestSessionId: accountId === 'guest' ? `GST-${Date.now().toString(36)}` : accountId,
      questionVersion: QUESTION_SET_VERSION,
      createdAt: now,
      updatedAt: now,
      isCompleted: false,
      currentQuestionIndex: 0,
      draftAnswers: {
        8: ['ord_rutherford', 'ord_dalton', 'ord_quantum', 'ord_democritus', 'ord_bohr', 'ord_thomson'],
      },
      frozenQuestions: {},
      itemResponses: {},
      firstAttemptScore: 0,
      masteryScore: 0,
    }
  }
}

