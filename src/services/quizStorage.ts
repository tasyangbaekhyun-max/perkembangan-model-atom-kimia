/**
 * SPESIFIKASI LAMPIRAN B: Modul Penyimpanan Lokal (localStorage)
 * Untuk Rekaman Evaluasi dan Diagnostik Konsep AtomLab
 *
 * Mengakomodasi:
 * - ID Percobaan Tetap (attemptId)
 * - Sesi Tamu (guestSessionId)
 * - Versi Instrumen Soal (questionVersion)
 * - Draf Pilihan Jawaban per butir
 * - Pembekuan Jawaban Diagnostik (frozenState)
 * - Rekaman Jawaban per butir (first attempt, final attempt, attempts count, timestamp)
 * - Pemisahan Skor Akhir Historis dari Draf Aktif
 * - Penanganan Kesalahan: Storage Ditolak / QuotaExceeded / JSON Rusak
 */

import type {
  QuizAttemptSession,
  FinalScoreHistory,
  StorageOperationResult,
} from '../types/quiz'
import { QUESTION_SET_VERSION } from '../data/quizQuestions'

// Namespace kunci penyimpanan Lampiran B
export const STORAGE_KEYS = {
  ACTIVE_SESSION: 'atomlab_lampiran_b_active_session',
  FINAL_HISTORY: 'atomlab_lampiran_b_final_score_history',
  GUEST_ID: 'atomlab_lampiran_b_guest_id',
} as const

// Memory fallback jika localStorage ditolak/diblokir oleh browser
let memorySessionStore: QuizAttemptSession | null = null
let memoryHistoryStore: FinalScoreHistory[] = []
let isLocalStorageAvailable = true
let lastStorageErrorMessage: string | null = null

// Helper uji ketersediaan localStorage secara aman
function checkStorageAvailability(): boolean {
  try {
    const testKey = '__atomlab_storage_test__'
    window.localStorage.setItem(testKey, '1')
    window.localStorage.removeItem(testKey)
    isLocalStorageAvailable = true
    lastStorageErrorMessage = null
    return true
  } catch (err: any) {
    isLocalStorageAvailable = false
    lastStorageErrorMessage = err?.message || 'Akses localStorage ditolak atau tidak didukung.'
    return false
  }
}

// Generate ID Acak Unik
export function generateId(prefix: string): string {
  const timestamp = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase()
  return `${prefix}-${timestamp}-${randomPart}`
}

/**
 * Mengambil atau membuat ID Tamu (Guest Session)
 */
export function getOrCreateGuestId(): string {
  if (!checkStorageAvailability()) {
    return 'GST-GUEST-OFFLINE'
  }

  try {
    const existing = window.localStorage.getItem(STORAGE_KEYS.GUEST_ID)
    if (existing && existing.startsWith('GST-')) {
      return existing
    }
    const newGuestId = generateId('GST')
    window.localStorage.setItem(STORAGE_KEYS.GUEST_ID, newGuestId)
    return newGuestId
  } catch {
    return 'GST-GUEST-FALLBACK'
  }
}

/**
 * Membuat Sesi Percobaan Kuis Baru
 */
export function createNewAttemptSession(): QuizAttemptSession {
  const guestId = getOrCreateGuestId()
  const attemptId = generateId('ATT')
  const now = new Date().toISOString()

  return {
    attemptId,
    guestSessionId: guestId,
    questionVersion: QUESTION_SET_VERSION,
    createdAt: now,
    updatedAt: now,
    isCompleted: false,
    currentQuestionIndex: 0,
    draftAnswers: {
      // Default initial order for question 8 (drag and drop timeline)
      8: ['ord_rutherford', 'ord_dalton', 'ord_quantum', 'ord_democritus', 'ord_bohr', 'ord_thomson'],
    },
    frozenQuestions: {},
    itemResponses: {},
    firstAttemptScore: 0,
    masteryScore: 0,
  }
}

/**
 * Menyimpan sesi kuis aktif secara aman (Lampiran B)
 */
export function saveActiveSession(session: QuizAttemptSession): StorageOperationResult<QuizAttemptSession> {
  session.updatedAt = new Date().toISOString()

  if (!checkStorageAvailability()) {
    memorySessionStore = { ...session }
    return {
      success: false,
      data: session,
      error: lastStorageErrorMessage || 'Penyimpanan lokal ditolak oleh peramban.',
      isFallbackMemory: true,
    }
  }

  try {
    const serialized = JSON.stringify(session)
    window.localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, serialized)
    memorySessionStore = { ...session }
    return {
      success: true,
      data: session,
      isFallbackMemory: false,
    }
  } catch (err: any) {
    memorySessionStore = { ...session }
    const isQuota = err?.name === 'QuotaExceededError' || err?.code === 22
    const errorMsg = isQuota
      ? 'Kapasitas penyimpanan lokal perangkat penuh (QuotaExceededError).'
      : err?.message || 'Gagal menyimpan ke penyimpanan lokal perangkat.'

    lastStorageErrorMessage = errorMsg
    return {
      success: false,
      data: session,
      error: errorMsg,
      quotaExceeded: isQuota,
      isFallbackMemory: true,
    }
  }
}

/**
 * Memuat sesi kuis aktif dari localStorage
 */
export function loadActiveSession(): StorageOperationResult<QuizAttemptSession> {
  if (!checkStorageAvailability()) {
    if (memorySessionStore) {
      return {
        success: true,
        data: memorySessionStore,
        isFallbackMemory: true,
        error: 'Berjalan dalam mode memori sementara (localStorage tidak aktif).',
      }
    }
    const fresh = createNewAttemptSession()
    memorySessionStore = fresh
    return {
      success: false,
      data: fresh,
      error: lastStorageErrorMessage || 'Penyimpanan lokal tidak tersedia.',
      isFallbackMemory: true,
    }
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION)
    if (!raw) {
      const newSession = createNewAttemptSession()
      saveActiveSession(newSession)
      return { success: true, data: newSession, isFallbackMemory: false }
    }

    // Tangani kemungkinan JSON corrupt / rusak
    let parsed: any
    try {
      parsed = JSON.parse(raw)
    } catch {
      // JSON Corrupt! Jangan menyatakan berhasil simpan / load
      const recoveredSession = createNewAttemptSession()
      saveActiveSession(recoveredSession)
      return {
        success: false,
        data: recoveredSession,
        error: 'Data sesi di penyimpanan lokal rusak (JSON corrupt). Sesi baru telah diinisialisasi.',
        isFallbackMemory: false,
      }
    }

    // Validasi integritas struktur sesi
    if (!parsed || typeof parsed !== 'object' || !parsed.attemptId) {
      const recoveredSession = createNewAttemptSession()
      saveActiveSession(recoveredSession)
      return {
        success: false,
        data: recoveredSession,
        error: 'Struktur sesi tidak valid. Sesi baru telah diinisialisasi.',
        isFallbackMemory: false,
      }
    }

    // Deteksi jika versi instrumen berubah
    if (parsed.questionVersion !== QUESTION_SET_VERSION) {
      parsed.questionVersion = QUESTION_SET_VERSION
    }

    return {
      success: true,
      data: parsed as QuizAttemptSession,
      isFallbackMemory: false,
    }
  } catch (err: any) {
    const fallback = memorySessionStore || createNewAttemptSession()
    return {
      success: false,
      data: fallback,
      error: err?.message || 'Gagal membaca penyimpanan lokal.',
      isFallbackMemory: true,
    }
  }
}

/**
 * Menyimpan skor akhir yang telah tuntas ke riwayat tersendiri
 * (Membedakan skor terakhir dari draf yang sedang berlangsung)
 */
export function saveFinalScoreToHistory(historyItem: FinalScoreHistory): StorageOperationResult<FinalScoreHistory[]> {
  const existingListResult = loadFinalScoreHistory()
  const list = existingListResult.data || []
  const updatedList = [historyItem, ...list].slice(0, 10) // simpan maksimal 10 riwayat terakhir

  if (!checkStorageAvailability()) {
    memoryHistoryStore = updatedList
    return {
      success: false,
      data: updatedList,
      error: 'Riwayat skor hanya tersimpan di memori sesi saat ini.',
      isFallbackMemory: true,
    }
  }

  try {
    window.localStorage.setItem(STORAGE_KEYS.FINAL_HISTORY, JSON.stringify(updatedList))
    memoryHistoryStore = updatedList
    return {
      success: true,
      data: updatedList,
      isFallbackMemory: false,
    }
  } catch (err: any) {
    memoryHistoryStore = updatedList
    return {
      success: false,
      data: updatedList,
      error: err?.message || 'Gagal menyimpan riwayat skor akhir ke perangkat.',
      isFallbackMemory: true,
    }
  }
}

/**
 * Memuat riwayat skor akhir tersimpan
 */
export function loadFinalScoreHistory(): StorageOperationResult<FinalScoreHistory[]> {
  if (!checkStorageAvailability()) {
    return {
      success: true,
      data: memoryHistoryStore,
      isFallbackMemory: true,
    }
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.FINAL_HISTORY)
    if (!raw) {
      return { success: true, data: [], isFallbackMemory: false }
    }
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return {
        success: false,
        data: [],
        error: 'Format riwayat skor rusak. Di-reset menjadi kosong.',
      }
    }
    return { success: true, data: parsed as FinalScoreHistory[], isFallbackMemory: false }
  } catch (err: any) {
    return {
      success: false,
      data: memoryHistoryStore,
      error: err?.message || 'Gagal memuat riwayat skor.',
      isFallbackMemory: true,
    }
  }
}

/**
 * RESET DRAF SAJA:
 * Hanya mengosongkan draf pilihan dan jawaban sesi percobaan saat ini,
 * tanpa menghapus riwayat skor terakhir atau ID Tamu.
 */
export function resetCurrentAttemptDraftOnly(currentAttemptId: string): StorageOperationResult<QuizAttemptSession> {
  const guestId = getOrCreateGuestId()
  const freshSession: QuizAttemptSession = {
    attemptId: currentAttemptId, // mempertahankan ID percobaan sesi saat ini
    guestSessionId: guestId,
    questionVersion: QUESTION_SET_VERSION,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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

  return saveActiveSession(freshSession)
}

/**
 * PERCOBAAN ULANG DENGAN ID BARU:
 * Menghasilkan ID percobaan baru (`ATT-xxxx`), skor terakhir tetap aman di history.
 */
export function startNewAttemptWithNewId(): StorageOperationResult<QuizAttemptSession> {
  const freshSession = createNewAttemptSession()
  return saveActiveSession(freshSession)
}

/**
 * HAPUS SELURUH RIWAYAT PERANGKAT:
 * Menghapus sesi aktif, riwayat skor, dan ID tamu dari localStorage.
 * Memerlukan konfirmasi pengguna terpisah.
 */
export function clearAllDeviceHistory(): StorageOperationResult<void> {
  memorySessionStore = null
  memoryHistoryStore = []

  if (!checkStorageAvailability()) {
    return { success: true, isFallbackMemory: true }
  }

  try {
    window.localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION)
    window.localStorage.removeItem(STORAGE_KEYS.FINAL_HISTORY)
    window.localStorage.removeItem(STORAGE_KEYS.GUEST_ID)
    return { success: true, isFallbackMemory: false }
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Gagal membersihkan data dari penyimpanan perangkat.',
      isFallbackMemory: false,
    }
  }
}

/**
 * Helper untuk memeriksa status kesehatan storage
 */
export function getStorageHealthStatus(): {
  available: boolean
  errorMessage: string | null
} {
  checkStorageAvailability()
  return {
    available: isLocalStorageAvailable,
    errorMessage: lastStorageErrorMessage,
  }
}
