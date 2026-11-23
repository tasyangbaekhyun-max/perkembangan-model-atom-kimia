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
import { learningContentService } from '../services/learningContentService'

export class SyncService {
  // Memory fallback maps per partisi akun untuk menjaga pekerjaan pengguna tetap aman
  // jika localStorage diblokir/ditolak (incognito) atau mengalami QuotaExceededError
  private static memorySessions: Map<string, QuizAttemptSession> = new Map()
  private static memoryHistories: Map<string, FinalScoreHistory[]> = new Map()
  private static memoryQueues: Map<string, SubmissionQueueItem[]> = new Map()

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
   * Memuat sesi kuis dari ruang akun aktif secara aman.
   * Jika pembacaan storage ditolak atau gagal, sistem mempertahankan draf yang ada di memori.
   */
  public static loadActiveSession(): QuizAttemptSession {
    const key = this.getSessionStorageKey()

    // 1. Coba baca dari localStorage secara aman dengan try...catch
    if (typeof window !== 'undefined') {
      try {
        if (window.localStorage) {
          const raw = window.localStorage.getItem(key)
          if (raw) {
            const parsed = JSON.parse(raw) as QuizAttemptSession
            if (parsed && parsed.attemptId) {
              this.memorySessions.set(key, parsed)
              return parsed
            }
          }
        }
      } catch (err) {
        console.warn('[SyncService] Gagal membaca sesi dari localStorage, beralih ke cache memori:', err)
      }
    }

    // 2. Pertahankan draf di memori jika penyimpanan lokal kosong/ditolak/gagal
    const inMemory = this.memorySessions.get(key)
    if (inMemory && inMemory.attemptId) {
      return inMemory
    }

    // 3. Hanya buat sesi inisial baru jika benar-benar belum ada draf di storage maupun memori
    const newSession = this.createInitialSession()
    this.saveDraftLocally(newSession)
    return newSession
  }

  /**
   * Simpan draf secara lokal sebelum request jaringan.
   * Draf selalu disimpan di memori aplikasi terlebih dahulu agar tidak hilang jika localStorage ditolak/kuota habis.
   */
  public static saveDraftLocally(session: QuizAttemptSession): void {
    session.updatedAt = new Date().toISOString()
    const key = this.getSessionStorageKey()

    // SELALU pertahankan draf di memori aplikasi
    this.memorySessions.set(key, { ...session })

    if (typeof window === 'undefined') return

    try {
      if (window.localStorage) {
        window.localStorage.setItem(key, JSON.stringify(session))
      }
    } catch (err) {
      console.warn('[SyncService] Penyimpanan localStorage ditolak/penuh. Draf tetap aman di memori aplikasi:', err)
    }
  }

  /**
   * Memuat riwayat skor dari ruang akun aktif
   */
  public static loadScoreHistory(): FinalScoreHistory[] {
    const key = this.getHistoryStorageKey()
    if (typeof window !== 'undefined') {
      try {
        if (window.localStorage) {
          const raw = window.localStorage.getItem(key)
          if (raw) {
            const parsed = JSON.parse(raw)
            if (Array.isArray(parsed)) {
              this.memoryHistories.set(key, parsed)
              return parsed
            }
          }
        }
      } catch (err) {
        console.warn('[SyncService] Gagal membaca riwayat skor dari localStorage:', err)
      }
    }
    return this.memoryHistories.get(key) || []
  }

  /**
   * Simpan skor akhir ke riwayat ruang akun aktif sebelum jaringan
   */
  public static saveFinalScoreLocally(historyItem: FinalScoreHistory): void {
    const key = this.getHistoryStorageKey()
    const list = this.loadScoreHistory()
    const updated = [historyItem, ...list.filter((h) => h.attemptId !== historyItem.attemptId)].slice(0, 10)

    this.memoryHistories.set(key, updated)

    if (typeof window === 'undefined') return

    try {
      if (window.localStorage) {
        window.localStorage.setItem(key, JSON.stringify(updated))
      }
    } catch (err) {
      console.warn('[SyncService] Gagal menyimpan riwayat skor ke localStorage, disimpan di memori:', err)
    }
  }

  /**
   * Memuat antrean pengiriman ruang akun aktif
   */
  public static loadQueue(): SubmissionQueueItem[] {
    const key = this.getQueueStorageKey()
    if (typeof window !== 'undefined') {
      try {
        if (window.localStorage) {
          const raw = window.localStorage.getItem(key)
          if (raw) {
            const parsed = JSON.parse(raw)
            if (Array.isArray(parsed)) {
              this.memoryQueues.set(key, parsed)
              return parsed
            }
          }
        }
      } catch (err) {
        console.warn('[SyncService] Gagal membaca antrean dari localStorage:', err)
      }
    }
    return this.memoryQueues.get(key) || []
  }

  /**
   * Simpan antrean pengiriman ruang akun aktif
   */
  public static saveQueue(items: SubmissionQueueItem[]): void {
    const key = this.getQueueStorageKey()
    this.memoryQueues.set(key, items)

    if (typeof window === 'undefined') return

    try {
      if (window.localStorage) {
        window.localStorage.setItem(key, JSON.stringify(items))
      }
    } catch (err) {
      console.warn('[SyncService] Gagal menyimpan antrean ke localStorage, disimpan di memori:', err)
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
    const activeQuestions = learningContentService.getQuizQuestions()
    const currentTotalQuestions = activeQuestions.length > 0 ? activeQuestions.length : 25
    const currentQuestionVersion = session.questionVersion || learningContentService.getQuestionVersion() || QUESTION_SET_VERSION

    const payload: Bab4QuizSubmissionPayload = {
      submissionId,
      attemptId: session.attemptId, // Pertahankan satu ID percobaan ketika retry!
      guestSessionId: session.guestSessionId,
      userId: access.isAuthenticated ? access.userId : undefined,
      classCode: access.classCode,
      questionVersion: currentQuestionVersion,
      totalQuestions: currentTotalQuestions,
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

    // 3. Cek guard offline sebelum melakukan request jaringan
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      const currentQueue = this.loadQueue()
      const itemToUpdate = currentQueue.find((q) => q.attemptId === session.attemptId)
      if (itemToUpdate) {
        itemToUpdate.status = 'gagal'
        itemToUpdate.errorMessage = 'Jaringan offline: Perangkat tidak terhubung ke internet.'
        itemToUpdate.lastAttemptAt = new Date().toISOString()
        this.saveQueue(currentQueue)
      }
      return {
        status: 'gagal',
        message: 'Perangkat sedang offline. Hasil kuis tetap tersimpan di antrean perangkat dan dapat dikirim kembali saat online.',
      }
    }

    // 4. Catat ID akun pemohon saat request jaringan dilepas
    const requestAccountId = activeAccountId

    try {
      const res = await Bab4ApiService.submitQuizResults(payload)

      // 5. ATURAN KRUSIAL: Abaikan respons request lama jika akun sudah berubah!
      if (authService.getActiveAccountId() !== requestAccountId) {
        // Akun sudah beralih di tengah proses jaringan, abaikan respons!
        return {
          status: 'gagal',
          message: 'Respons jaringan diabaikan karena akun pengguna telah beralih.',
        }
      }

      // Validasi ketat: Layanan API tidak boleh mengembalikan status berhasil saat gagal
      if (!res || res.status !== 'success') {
        throw new Error(res?.message || 'Pengiriman data kuis belum berhasil diterima server riset.')
      }

      // Update antrean pada ruang akun aktif HANYA jika server benar-benar menerima
      const currentQueue = this.loadQueue()
      const itemToUpdate = currentQueue.find((q) => q.attemptId === session.attemptId)
      if (itemToUpdate) {
        itemToUpdate.status = 'terkirim'
        itemToUpdate.errorMessage = undefined
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

      // Pertahankan item di antrean dengan status "gagal" (belum terkirim)
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
   * Menyinkronkan ulang seluruh antrean kuis yang tertunda/gagal pada akun aktif
   */
  public static async syncPendingQueue(): Promise<{
    totalPending: number
    synced: number
    failed: number
  }> {
    const queue = this.loadQueue()
    const pendingItems = queue.filter((q) => q.status === 'menunggu kirim' || q.status === 'gagal')

    if (pendingItems.length === 0) {
      return { totalPending: 0, synced: 0, failed: 0 }
    }

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return { totalPending: pendingItems.length, synced: 0, failed: pendingItems.length }
    }

    let synced = 0
    let failed = 0

    for (const item of pendingItems) {
      try {
        const res = await Bab4ApiService.submitQuizResults(item.payload)
        if (res && res.status === 'success') {
          item.status = 'terkirim'
          item.errorMessage = undefined
          item.lastAttemptAt = new Date().toISOString()
          synced++
        } else {
          item.status = 'gagal'
          item.lastAttemptAt = new Date().toISOString()
          failed++
        }
      } catch (err: any) {
        item.status = 'gagal'
        item.errorMessage = err?.message || 'Gagal sinkronisasi antrean.'
        item.lastAttemptAt = new Date().toISOString()
        failed++
      }
    }

    this.saveQueue(queue)
    return { totalPending: pendingItems.length, synced, failed }
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
        const activeQuestions = learningContentService.getQuizQuestions()
        return {
          guestSessionId: parsed.guestSessionId,
          attemptId: parsed.attemptId,
          totalQuestions: activeQuestions.length > 0 ? activeQuestions.length : 25,
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
    const guestSessionKey = 'atomlab_acc_guest_active_session'
    const guestHistoryKey = 'atomlab_acc_guest_score_history'
    const guestQueueKey = 'atomlab_acc_guest_submission_queue'
    const targetSessionKey = `atomlab_acc_${targetAccountId}_active_session`
    const targetHistoryKey = `atomlab_acc_${targetAccountId}_score_history`
    const targetQueueKey = `atomlab_acc_${targetAccountId}_submission_queue`

    // Pindahkan di memori aplikasi terlebih dahulu
    const memSession = this.memorySessions.get(guestSessionKey)
    if (memSession) {
      this.memorySessions.set(targetSessionKey, memSession)
      this.memorySessions.delete(guestSessionKey)
    }
    const memHistory = this.memoryHistories.get(guestHistoryKey)
    if (memHistory) {
      this.memoryHistories.set(targetHistoryKey, memHistory)
      this.memoryHistories.delete(guestHistoryKey)
    }
    const memQueue = this.memoryQueues.get(guestQueueKey)
    if (memQueue) {
      const existingTargetQueue = this.memoryQueues.get(targetQueueKey) || []
      const migrated = memQueue.map((item) => ({ ...item, accountId: targetAccountId }))
      this.memoryQueues.set(targetQueueKey, [
        ...migrated,
        ...existingTargetQueue.filter((t) => !migrated.some((m) => m.attemptId === t.attemptId)),
      ])
      this.memoryQueues.delete(guestQueueKey)
    }

    if (typeof window === 'undefined') return
    try {
      if (window.localStorage) {
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

        // Pindahkan antrean tertunda dari akun tamu ke akun login agar tidak hilang
        const rawGuestQueue = window.localStorage.getItem(guestQueueKey)
        if (rawGuestQueue) {
          try {
            const guestQueue = JSON.parse(rawGuestQueue)
            if (Array.isArray(guestQueue) && guestQueue.length > 0) {
              const rawTargetQueue = window.localStorage.getItem(targetQueueKey)
              const targetQueue: SubmissionQueueItem[] = rawTargetQueue ? JSON.parse(rawTargetQueue) : []
              const migratedQueue: SubmissionQueueItem[] = guestQueue.map((item: SubmissionQueueItem) => ({
                ...item,
                accountId: targetAccountId,
              }))
              const mergedQueue = [
                ...migratedQueue,
                ...targetQueue.filter((t) => !migratedQueue.some((m) => m.attemptId === t.attemptId)),
              ]
              window.localStorage.setItem(targetQueueKey, JSON.stringify(mergedQueue))
            }
          } catch {
            // ignore
          }
          window.localStorage.removeItem(guestQueueKey)
        }
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
   * Membersihkan seluruh data kuis aktif dari localStorage dan memori aplikasi:
   * - Sesi kuis aktif (seluruh partisi atomlab_acc_*_active_session)
   * - Riwayat skor (seluruh partisi atomlab_acc_*_score_history)
   * - Antrean pengiriman/sinkronisasi (seluruh partisi atomlab_acc_*_submission_queue)
   * - Kunci penyimpanan Lampiran B (atomlab_lampiran_b_*)
   */
  public static clearAllQuizStorage(): void {
    this.memorySessions.clear()
    this.memoryHistories.clear()
    this.memoryQueues.clear()

    if (typeof window === 'undefined') return

    try {
      if (window.localStorage) {
        const keysToRemove: string[] = []
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i)
          if (!key) continue
          if (
            key.endsWith('_active_session') ||
            key.endsWith('_score_history') ||
            key.endsWith('_submission_queue') ||
            key.startsWith('atomlab_lampiran_b_')
          ) {
            keysToRemove.push(key)
          }
        }
        keysToRemove.forEach((k) => {
          try {
            window.localStorage.removeItem(k)
          } catch {
            // ignore
          }
        })
      }
    } catch (err) {
      console.warn('[SyncService] Gagal membersihkan storage:', err)
    }
  }

  /**
   * Membuat sesi inisial baru dengan ID Percobaan baru
   */
  public static createInitialSession(): QuizAttemptSession {
    const accountId = authService.getActiveAccountId()
    const attemptId = `ATT-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
    const now = new Date().toISOString()
    const activeVersion = learningContentService.getQuestionVersion() || QUESTION_SET_VERSION

    return {
      attemptId,
      guestSessionId: accountId === 'guest' ? `GST-${Date.now().toString(36)}` : accountId,
      questionVersion: activeVersion,
      createdAt: now,
      updatedAt: now,
      isCompleted: false,
      currentQuestionIndex: 0,
      draftAnswers: {},
      frozenQuestions: {},
      itemResponses: {},
      firstAttemptScore: 0,
      masteryScore: 0,
    }
  }
}

