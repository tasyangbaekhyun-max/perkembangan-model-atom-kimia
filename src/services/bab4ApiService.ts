/**
 * SERVICE ADAPTER PENGIRIMAN BASIS DATA & LOGIN BAB 4
 * Menyediakan implementasi kontrak API Bab 4:
 * - Autentikasi Guest & Login User
 * - Pengiriman Berkas Evaluasi Kuis (Bab 4.2) -> Terhubung ke Cloud Firestore
 * - Pengiriman Telemetri Jejak Belajar (D-01 s.d D-04) -> Terhubung ke Cloud Firestore
 */

import type {
  Bab4LoginRequest,
  Bab4LoginResponse,
  Bab4GuestSessionRequest,
  Bab4GuestSessionResponse,
  Bab4QuizSubmissionPayload,
  Bab4QuizSubmissionResponse,
  Bab4TelemetryEvent,
} from '../types/bab4Contract'
import { db, isFirebaseConfigured } from '../lib/firebase'
import { collection, doc, setDoc, addDoc, serverTimestamp } from 'firebase/firestore'

export class Bab4ApiService {
  private static apiBaseUrl = '/api/v1'

  /**
   * Kontrak Login Siswa/Guru (Bab 4.1)
   */
  public static async login(req: Bab4LoginRequest): Promise<Bab4LoginResponse> {
    try {
      const res = await fetch(`${this.apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      })
      if (res.ok) {
        return (await res.json()) as Bab4LoginResponse
      }
    } catch {
      // Mock fallback respons kontrak
    }

    // Mock response yang mematuhi skema kontrak Bab 4
    return {
      token: `jwt_mock_${Date.now()}`,
      user: {
        id: 'usr_mock_student_01',
        name: req.email.split('@')[0] || 'Siswa Kimia',
        email: req.email,
        role: 'student',
        classCode: req.classCode || 'KIM-X-FASE-E',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      },
      expiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    }
  }

  /**
   * Kontrak Alokasi Sesi Tamu (Bab 4.1 Guest Workspace)
   */
  public static async createGuestSession(req: Bab4GuestSessionRequest): Promise<Bab4GuestSessionResponse> {
    try {
      const res = await fetch(`${this.apiBaseUrl}/auth/guest-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      })
      if (res.ok) {
        return (await res.json()) as Bab4GuestSessionResponse
      }
    } catch {
      // Offline / client mock
    }

    return {
      guestSessionId: req.clientGuestId,
      role: 'guest',
      allocatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
    }
  }

  /**
   * Kontrak Pengiriman Data Hasil Kuis ke Basis Data Riset (Bab 4.2)
   * Menyimpan secara nyata ke Cloud Firestore saat Firebase aktif.
   */
  public static async submitQuizResults(payload: Bab4QuizSubmissionPayload): Promise<Bab4QuizSubmissionResponse> {
    // Validasi kelengkapan payload sesuai Bab 4
    if (!payload.attemptId || !payload.itemResponses || payload.itemResponses.length === 0) {
      throw new Error('Kontrak Bab 4: Payload pengiriman kuis tidak valid atau kosong.')
    }

    // 1. Cek konektivitas jaringan pengguna (offline guard)
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      throw new Error('Jaringan offline: Perangkat tidak terhubung ke internet. Pengiriman kuis ditunda.')
    }

    let firestoreError: Error | null = null

    // 2. Simpan secara nyata ke Firebase Cloud Firestore jika terhubung
    // Menggunakan attemptId sebagai ID dokumen agar pengiriman ulang bersifat idempoten (tidak menghasilkan dokumen ganda)
    if (isFirebaseConfigured() && db) {
      try {
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(new Error('Batas waktu koneksi ke Cloud Firestore habis (Timeout 10s). Pengiriman ditunda.'))
          }, 10000)
        })

        const docRef = doc(db, 'quiz_submissions', payload.attemptId)

        await Promise.race([
          setDoc(
            docRef,
            {
              ...payload,
              firebaseRecordedAt: serverTimestamp(),
              clientRecordedAt: new Date().toISOString(),
              lastUpdatedAt: new Date().toISOString(),
            },
            { merge: true }
          ),
          timeoutPromise,
        ])

        return {
          status: 'success',
          recordedAt: new Date().toISOString(),
          submissionId: docRef.id || payload.attemptId,
          attemptId: payload.attemptId,
          message: 'Data evaluasi kuis berhasil disimpan secara nyata di Cloud Firestore.',
        }
      } catch (firestoreErr: any) {
        firestoreError = firestoreErr instanceof Error ? firestoreErr : new Error(String(firestoreErr?.message || firestoreErr))
        console.warn('[Firebase] Gagal menyimpan evaluasi ke Cloud Firestore:', firestoreErr)
      }
    } else if (!isFirebaseConfigured()) {
      firestoreError = new Error('Firebase belum terkonfigurasi dengan benar di environment.')
    } else {
      firestoreError = new Error('Layanan Cloud Firestore belum terinisialisasi atau tidak tersedia.')
    }

    // 3. Fallback REST API jika endpoint server tersedia
    let restError: Error | null = null
    try {
      const res = await fetch(`${this.apiBaseUrl}/research/quiz-submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        const data = (await res.json()) as Bab4QuizSubmissionResponse
        if (data && data.status === 'success') {
          return data
        }
        restError = new Error(data?.message || 'Server API mengembalikan respons bukan sukses.')
      } else {
        restError = new Error(`Server API merespons dengan kode HTTP ${res.status}.`)
      }
    } catch (err: any) {
      restError = err instanceof Error ? err : new Error(String(err?.message || err))
    }

    // JANGAN LAPORKAN SUKSES PALSU: Jika sampai di titik ini, pengiriman gagal dan data belum diterima server!
    const finalErrorMessage =
      firestoreError?.message ||
      restError?.message ||
      'Pengiriman data kuis ke server gagal atau tidak dapat dijangkau.'

    throw new Error(finalErrorMessage)
  }

  /**
   * Kontrak Pengiriman Telemetri Interaksi Riset (D-02, D-03)
   * Menyimpan secara nyata ke Cloud Firestore saat Firebase aktif.
   */
  public static async sendTelemetry(event: Bab4TelemetryEvent): Promise<void> {
    if (isFirebaseConfigured() && db) {
      try {
        await addDoc(collection(db, 'telemetry_events'), {
          ...event,
          firebaseRecordedAt: serverTimestamp(),
        })
        return
      } catch {
        // Non-blocking telemetry
      }
    }

    try {
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        navigator.sendBeacon(
          `${this.apiBaseUrl}/research/telemetry`,
          JSON.stringify(event)
        )
      }
    } catch {
      // Non-blocking telemetry
    }
  }
}
