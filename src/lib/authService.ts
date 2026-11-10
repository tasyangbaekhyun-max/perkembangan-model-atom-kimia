/**
 * AUTH SERVICE & SDK SESSION LISTENER ADAPTER
 * Mengelola autentikasi:
 * - Masuk dengan Google
 * - Sesi Tamu (Belajar tanpa login tetap berfungsi)
 * - getAccess() mengembalikan alias akun kelas
 * - onAuthStateChanged() untuk pembaruan reaktif ID akun aktif
 * - Proteksi privasi: Tidak menyalin token/email ke log atau UI hasil
 */

import type { UserAccess } from './types'
import { getOrCreateGuestId } from '../services/quizStorage'

const AUTH_STORAGE_KEY = 'atomlab_sdk_auth_session'

interface StoredSession {
  userId: string
  name: string
  email?: string
  role: 'student' | 'teacher' | 'admin'
  classCode?: string
  schoolName?: string
  token: string
  expiresAt: string
}

type AuthListener = (access: UserAccess) => void

class AuthService {
  private listeners: Set<AuthListener> = new Set()
  private currentSession: StoredSession | null = null

  constructor() {
    this.initSessionFromStorage()
  }

  private initSessionFromStorage(): void {
    if (typeof window === 'undefined') return
    try {
      const raw = window.localStorage.getItem(AUTH_STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as StoredSession
        // Periksa apakah token belum kadaluarsa
        if (new Date(parsed.expiresAt).getTime() > Date.now()) {
          this.currentSession = parsed
        } else {
          window.localStorage.removeItem(AUTH_STORAGE_KEY)
          this.currentSession = null
        }
      }
    } catch {
      this.currentSession = null
    }
  }

  /**
   * Mengambil kredensial dan alias akses kelas saat ini
   * Sesuai instruksi: "Akun kelas memakai alias dari getAccess"
   */
  public getAccess(): UserAccess {
    if (this.currentSession) {
      const classPart = this.currentSession.classCode || 'Fase E'
      return {
        userId: this.currentSession.userId,
        name: this.currentSession.name,
        // email disimpan privat di session, tidak diekspos ke UI hasil
        alias: `${this.currentSession.name} (${classPart})`,
        role: this.currentSession.role,
        classCode: this.currentSession.classCode,
        schoolName: this.currentSession.schoolName,
        isAuthenticated: true,
      }
    }

    const guestId = getOrCreateGuestId()
    return {
      userId: guestId,
      name: 'Siswa Tamu',
      alias: 'Tamu (Tanpa Login)',
      role: 'guest',
      classCode: 'Belum Gabung Kelas',
      isAuthenticated: false,
    }
  }

  /**
   * Mengambil ID akun aktif saat ini untuk partisi penyimpanan
   */
  public getActiveAccountId(): string {
    return this.currentSession ? this.currentSession.userId : 'guest'
  }

  /**
   * Listener sesi SDK untuk mendengarkan perubahan status autentikasi
   * Sesuai instruksi: "Perbarui ID akun aktif dari listener sesi SDK"
   */
  public onAuthStateChanged(listener: AuthListener): () => void {
    this.listeners.add(listener)
    // Langsung berikan nilai terkini
    listener(this.getAccess())
    return () => {
      this.listeners.delete(listener)
    }
  }

  private notifyListeners(): void {
    const access = this.getAccess()
    for (const listener of this.listeners) {
      try {
        listener(access)
      } catch {
        // Abaikan error pada listener subscriber
      }
    }
  }

  /**
   * Masuk dengan Google
   * Mensimulasikan autentikasi OAuth Google resmi untuk platform pendidikan
   */
  public async loginWithGoogle(options?: {
    customName?: string
    classCode?: string
    schoolName?: string
  }): Promise<UserAccess> {
    // Simulasi jeda autentikasi SDK Google
    await new Promise((resolve) => setTimeout(resolve, 600))

    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase()
    const name = options?.customName || 'Budi Santoso'
    const classCode = options?.classCode || 'KIM-X-FASE-E'
    const schoolName = options?.schoolName || 'SMA Negeri 1 Jakarta'

    const session: StoredSession = {
      userId: `usr_google_${Date.now().toString(36)}_${randomSuffix}`,
      name,
      // email internal aman (TIDAK dicetak ke log)
      email: `${name.toLowerCase().replace(/\s+/g, '.')}.${randomSuffix.toLowerCase()}@sekolah.sch.id`,
      role: 'student',
      classCode,
      schoolName,
      token: `jwt_google_secure_${Date.now()}_${randomSuffix}`,
      expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
    }

    this.currentSession = session
    try {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
    } catch {
      // In-memory fallback
    }

    // PENTING: Jangan menyalin token/email ke log!
    this.notifyListeners()
    return this.getAccess()
  }

  /**
   * Keluar dari Akun (Logout)
   * Mendukung opsi pembersihan perangkat bersama
   */
  public logout(clearDeviceData = false): void {
    this.currentSession = null
    try {
      window.localStorage.removeItem(AUTH_STORAGE_KEY)
      if (clearDeviceData) {
        // Bersihkan partisi akun yang baru saja logout
        const keysToRemove: string[] = []
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i)
          if (key && key.startsWith('atomlab_')) {
            keysToRemove.push(key)
          }
        }
        for (const k of keysToRemove) {
          window.localStorage.removeItem(k)
        }
      }
    } catch {
      // Abaikan galat penyimpanan
    }

    this.notifyListeners()
  }
}

export const authService = new AuthService()

