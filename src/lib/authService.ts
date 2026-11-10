/**
 * AUTH SERVICE & SDK SESSION LISTENER ADAPTER
 * Mengelola autentikasi:
 * - Masuk dengan Google
 * - Masuk & Daftar Akun Email & Password
 * - Fitur Reset / Lupa Password
 * - Sesi Tamu (Belajar tanpa login tetap berfungsi)
 * - getAccess() mengembalikan alias akun kelas
 * - onAuthStateChanged() untuk pembaruan reaktif ID akun aktif
 * - Proteksi privasi: Tidak menyalin token/email ke log atau UI hasil
 */

import type { UserAccess } from './types'
import { getOrCreateGuestId } from '../services/quizStorage'

const AUTH_STORAGE_KEY = 'atomlab_sdk_auth_session'
const REGISTERED_USERS_KEY = 'atomlab_registered_users'

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

export interface RegisteredAccount {
  id: string
  name: string
  email: string
  passwordHash: string
  role: 'student' | 'teacher' | 'admin'
  classCode?: string
  schoolName?: string
  createdAt: string
}

type AuthListener = (access: UserAccess) => void

// Akun default demonstrasi untuk kemudahan uji coba cepat
const DEFAULT_DEMO_ACCOUNTS: RegisteredAccount[] = [
  {
    id: 'usr_demo_student_01',
    name: 'Budi Santoso',
    email: 'siswa@atomlab.sch.id',
    passwordHash: 'kimia123',
    role: 'student',
    classCode: 'KIM-X-FASE-E',
    schoolName: 'SMA Negeri 1 Jakarta',
    createdAt: '2026-01-01T08:00:00.000Z',
  },
  {
    id: 'usr_demo_teacher_01',
    name: 'Dr. Ahmad Hidayat, M.Pd.',
    email: 'guru@atomlab.sch.id',
    passwordHash: 'guru123',
    role: 'teacher',
    classCode: 'GURU-KIMIA-X',
    schoolName: 'SMA Negeri 1 Jakarta',
    createdAt: '2026-01-01T08:00:00.000Z',
  },
]

class AuthService {
  private listeners: Set<AuthListener> = new Set()
  private currentSession: StoredSession | null = null

  constructor() {
    this.initSessionFromStorage()
    this.ensureDefaultAccounts()
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

  private ensureDefaultAccounts(): void {
    if (typeof window === 'undefined') return
    try {
      const existing = window.localStorage.getItem(REGISTERED_USERS_KEY)
      if (!existing) {
        window.localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(DEFAULT_DEMO_ACCOUNTS))
      }
    } catch {
      // In-memory fallback
    }
  }

  public getRegisteredAccounts(): RegisteredAccount[] {
    if (typeof window === 'undefined') return DEFAULT_DEMO_ACCOUNTS
    try {
      const raw = window.localStorage.getItem(REGISTERED_USERS_KEY)
      if (raw) {
        return JSON.parse(raw) as RegisteredAccount[]
      }
    } catch {
      // Fallback
    }
    return DEFAULT_DEMO_ACCOUNTS
  }

  private saveRegisteredAccounts(accounts: RegisteredAccount[]): void {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(accounts))
    } catch {
      // Fallback
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
        email: this.currentSession.email,
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
    email?: string
  }): Promise<UserAccess> {
    // Simulasi jeda autentikasi SDK Google
    await new Promise((resolve) => setTimeout(resolve, 500))

    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase()
    const name = options?.customName || 'Budi Santoso'
    const classCode = options?.classCode || 'KIM-X-FASE-E'
    const schoolName = options?.schoolName || 'SMA Negeri 1 Jakarta'
    const email = options?.email || `${name.toLowerCase().replace(/\s+/g, '.')}.${randomSuffix.toLowerCase()}@sekolah.sch.id`

    const session: StoredSession = {
      userId: `usr_google_${Date.now().toString(36)}_${randomSuffix}`,
      name,
      // email internal aman (TIDAK dicetak ke log)
      email,
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
   * Masuk dengan Email dan Kata Sandi
   */
  public async loginWithEmail(email: string, password: string): Promise<UserAccess> {
    // Simulasi respons jaringan
    await new Promise((resolve) => setTimeout(resolve, 400))

    const cleanEmail = email.trim().toLowerCase()
    const cleanPass = password.trim()

    if (!cleanEmail || !cleanPass) {
      throw new Error('Email dan kata sandi wajib diisi.')
    }

    const accounts = this.getRegisteredAccounts()
    const account = accounts.find((acc) => acc.email.toLowerCase() === cleanEmail)

    if (!account) {
      throw new Error('Alamat email belum terdaftar. Silakan pilih tab "Daftar Akun Baru" atau gunakan akun demo.')
    }

    if (account.passwordHash !== cleanPass) {
      throw new Error('Kata sandi salah. Silakan coba lagi atau gunakan menu "Lupa Password".')
    }

    const session: StoredSession = {
      userId: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
      classCode: account.classCode || 'KIM-X-FASE-E',
      schoolName: account.schoolName || 'SMA Negeri 1 Jakarta',
      token: `jwt_email_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
    }

    this.currentSession = session
    try {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
    } catch {
      // Fallback
    }

    this.notifyListeners()
    return this.getAccess()
  }

  /**
   * Pendaftaran Akun Siswa/Guru Baru dengan Email & Password
   */
  public async registerWithEmail(params: {
    name: string
    email: string
    password: string
    classCode?: string
    schoolName?: string
    role?: 'student' | 'teacher'
  }): Promise<UserAccess> {
    await new Promise((resolve) => setTimeout(resolve, 450))

    const cleanName = params.name.trim()
    const cleanEmail = params.email.trim().toLowerCase()
    const cleanPass = params.password.trim()
    const cleanClass = params.classCode?.trim() || 'KIM-X-FASE-E'
    const cleanSchool = params.schoolName?.trim() || 'SMA Negeri 1 Jakarta'
    const role = params.role || 'student'

    if (!cleanName || cleanName.length < 2) {
      throw new Error('Nama lengkap minimal 2 karakter.')
    }
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      throw new Error('Format alamat email tidak valid.')
    }
    if (!cleanPass || cleanPass.length < 6) {
      throw new Error('Kata sandi minimal 6 karakter demi keamanan akun.')
    }

    const accounts = this.getRegisteredAccounts()
    const existing = accounts.find((acc) => acc.email.toLowerCase() === cleanEmail)
    if (existing) {
      throw new Error('Email ini sudah terdaftar. Silakan pilih tab "Masuk" atau reset kata sandi Anda.')
    }

    const newAccount: RegisteredAccount = {
      id: `usr_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      name: cleanName,
      email: cleanEmail,
      passwordHash: cleanPass,
      role,
      classCode: cleanClass,
      schoolName: cleanSchool,
      createdAt: new Date().toISOString(),
    }

    accounts.push(newAccount)
    this.saveRegisteredAccounts(accounts)

    // Langsung aktifkan sesi untuk akun yang baru didaftarkan
    const session: StoredSession = {
      userId: newAccount.id,
      name: newAccount.name,
      email: newAccount.email,
      role: newAccount.role,
      classCode: newAccount.classCode,
      schoolName: newAccount.schoolName,
      token: `jwt_email_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
    }

    this.currentSession = session
    try {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
    } catch {
      // Fallback
    }

    this.notifyListeners()
    return this.getAccess()
  }

  /**
   * Permintaan Reset Kata Sandi (Lupa Password)
   */
  public async requestPasswordReset(email: string): Promise<{ success: boolean; message: string; emailExists: boolean }> {
    await new Promise((resolve) => setTimeout(resolve, 400))
    const cleanEmail = email.trim().toLowerCase()

    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new Error('Masukkan alamat email yang valid.')
    }

    const accounts = this.getRegisteredAccounts()
    const account = accounts.find((acc) => acc.email.toLowerCase() === cleanEmail)

    if (!account) {
      return {
        success: false,
        emailExists: false,
        message: 'Alamat email tidak ditemukan dalam data akun terdaftar.',
      }
    }

    return {
      success: true,
      emailExists: true,
      message: `Tautan dan instruksi reset kata sandi telah dikirim ke ${cleanEmail}. Periksa kotak masuk atau spam email Anda.`,
    }
  }

  /**
   * Reset / Pembaruan Kata Sandi
   */
  public async resetPassword(email: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 350))
    const cleanEmail = email.trim().toLowerCase()
    const cleanPass = newPassword.trim()

    if (cleanPass.length < 6) {
      throw new Error('Kata sandi baru minimal 6 karakter.')
    }

    const accounts = this.getRegisteredAccounts()
    const index = accounts.findIndex((acc) => acc.email.toLowerCase() === cleanEmail)

    if (index === -1) {
      throw new Error('Email akun tidak ditemukan.')
    }

    accounts[index].passwordHash = cleanPass
    this.saveRegisteredAccounts(accounts)

    return {
      success: true,
      message: 'Kata sandi berhasil diperbarui! Silakan masuk menggunakan kata sandi baru Anda.',
    }
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
