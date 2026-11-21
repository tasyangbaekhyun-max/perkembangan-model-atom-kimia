/**
 * AUTH SERVICE & SDK SESSION LISTENER ADAPTER
 * Mengelola autentikasi:
 * - Registrasi akun baru (Email, Password, Konfirmasi Password)
 * - Masuk dengan Email terdaftar
 * - Masuk / Daftar dengan Akun Google
 * - Pemulihan dan Reset Kata Sandi (Lupa Password)
 * - Sesi Tamu (Belajar tanpa login tetap berfungsi)
 * - getAccess() mengembalikan alias akun kelas
 * - onAuthStateChanged() untuk pembaruan reaktif ID akun aktif
 * - Proteksi privasi: Tidak menyalin token/email ke log atau UI hasil
 */

import type { UserAccess } from './types'
import { getOrCreateGuestId } from '../services/quizStorage'

const AUTH_STORAGE_KEY = 'atomlab_sdk_auth_session'
const USERS_STORAGE_KEY = 'atomlab_registered_users'

export interface StoredSession {
  userId: string
  name: string
  email?: string
  role: 'student' | 'teacher' | 'admin'
  classCode?: string
  schoolName?: string
  token: string
  expiresAt: string
  rememberDevice?: boolean
}

export interface RegisteredUser {
  id: string
  name: string
  email: string
  password: string
  passwordHash?: string
  role: 'student' | 'teacher' | 'admin'
  classCode?: string
  schoolName?: string
  createdAt: string
  provider: 'local' | 'google'
}

export type RegisteredAccount = RegisteredUser

type AuthListener = (access: UserAccess) => void

const DEFAULT_USERS: RegisteredUser[] = [
  {
    id: 'usr_siswa_01',
    name: 'Budi Santoso',
    email: 'siswa@sekolah.id',
    password: 'password123',
    passwordHash: 'password123',
    role: 'student',
    classCode: 'KIM-X-FASE-E',
    schoolName: 'SMA Negeri 1 Jakarta',
    createdAt: '2026-01-10T08:00:00.000Z',
    provider: 'local',
  },
  {
    id: 'usr_guru_01',
    name: 'Dra. Siti Nurhaliza, M.Pd',
    email: 'guru@sekolah.id',
    password: 'password123',
    passwordHash: 'password123',
    role: 'teacher',
    classCode: 'GURU-KIMIA-X',
    schoolName: 'SMA Negeri 1 Jakarta',
    createdAt: '2026-01-10T08:00:00.000Z',
    provider: 'local',
  },
  {
    id: 'usr_demo_student_01',
    name: 'Budi Santoso',
    email: 'siswa@atomlab.sch.id',
    password: 'kimia123',
    passwordHash: 'kimia123',
    role: 'student',
    classCode: 'KIM-X-FASE-E',
    schoolName: 'SMA Negeri 1 Jakarta',
    createdAt: '2026-01-01T08:00:00.000Z',
    provider: 'local',
  },
  {
    id: 'usr_demo_teacher_01',
    name: 'Dr. Ahmad Hidayat, M.Pd.',
    email: 'guru@atomlab.sch.id',
    password: 'guru123',
    passwordHash: 'guru123',
    role: 'teacher',
    classCode: 'GURU-KIMIA-X',
    schoolName: 'SMA Negeri 1 Jakarta',
    createdAt: '2026-01-01T08:00:00.000Z',
    provider: 'local',
  },
]

class AuthService {
  private listeners: Set<AuthListener> = new Set()
  private currentSession: StoredSession | null = null
  private previewRoleOverride: 'student' | 'teacher' | null = null

  constructor() {
    this.initUsersFromStorage()
    this.initSessionFromStorage()
  }

  /**
   * Mengatur override mode peran untuk pengujian pratinjau (Mode Guru <-> Mode Siswa)
   */
  public setPreviewRole(role: 'student' | 'teacher' | null): void {
    this.previewRoleOverride = role
    this.notifyListeners()
  }

  public getPreviewRole(): 'student' | 'teacher' | null {
    return this.previewRoleOverride
  }

  private initUsersFromStorage(): void {
    if (typeof window === 'undefined') return
    try {
      const raw = window.localStorage.getItem(USERS_STORAGE_KEY)
      if (!raw) {
        window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS))
      } else {
        const existingUsers = JSON.parse(raw) as RegisteredUser[]
        let modified = false
        for (const defaultUser of DEFAULT_USERS) {
          if (!existingUsers.some((u) => u.email.toLowerCase() === defaultUser.email.toLowerCase())) {
            existingUsers.push(defaultUser)
            modified = true
          }
        }
        if (modified) {
          window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(existingUsers))
        }
      }
    } catch {
      // In-memory fallback
    }
  }

  public getRegisteredUsers(): RegisteredUser[] {
    if (typeof window === 'undefined') return DEFAULT_USERS
    try {
      const raw = window.localStorage.getItem(USERS_STORAGE_KEY)
      if (raw) {
        return JSON.parse(raw) as RegisteredUser[]
      }
    } catch {
      // ignore
    }
    return DEFAULT_USERS
  }

  public getRegisteredAccounts(): RegisteredUser[] {
    return this.getRegisteredUsers()
  }

  public saveRegisteredUsers(users: RegisteredUser[]): void {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
    } catch {
      // ignore
    }
  }

  public saveRegisteredAccounts(users: RegisteredUser[]): void {
    this.saveRegisteredUsers(users)
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
      const effectiveRole = this.previewRoleOverride || this.currentSession.role
      const roleLabel = effectiveRole === 'teacher' ? 'Guru' : 'Siswa'
      return {
        userId: this.currentSession.userId,
        name: this.currentSession.name,
        email: this.currentSession.email,
        alias: `${this.currentSession.name} (${classPart})${this.previewRoleOverride ? ` [Mode ${roleLabel}]` : ''}`,
        role: effectiveRole,
        classCode: this.currentSession.classCode,
        schoolName: this.currentSession.schoolName,
        isAuthenticated: true,
      }
    }

    const guestId = getOrCreateGuestId()
    const guestRole = this.previewRoleOverride || 'guest'
    return {
      userId: guestId,
      name: guestRole === 'teacher' ? 'Guru Tamu' : 'Siswa Tamu',
      alias: guestRole === 'teacher' ? 'Guru Tamu (Uji Coba)' : 'Tamu (Tanpa Login)',
      role: guestRole,
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
   */
  public onAuthStateChanged(listener: AuthListener): () => void {
    this.listeners.add(listener)
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
   * Registrasi Akun Baru dengan Email & Password
   */
  public async registerWithEmail(params: {
    name?: string
    email: string
    password: string
    confirmPassword?: string
    classCode?: string
    schoolName?: string
    role?: 'student' | 'teacher' | 'admin'
    rememberDevice?: boolean
  }): Promise<{ success: boolean; error?: string; user?: UserAccess }> {
    // Simulasi jeda server
    await new Promise((resolve) => setTimeout(resolve, 450))

    const email = params.email.trim().toLowerCase()
    const password = params.password.trim()
    const confirmPassword = params.confirmPassword?.trim()

    // Validasi email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      return { success: false, error: 'Format email tidak valid. Masukkan alamat email yang benar.' }
    }

    // Validasi password
    if (!password || password.length < 6) {
      return { success: false, error: 'Kata sandi minimal 6 karakter.' }
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return { success: false, error: 'Konfirmasi kata sandi tidak cocok.' }
    }

    const users = this.getRegisteredUsers()
    const existing = users.find((u) => u.email.toLowerCase() === email)
    if (existing) {
      return {
        success: false,
        error: 'Email ini sudah terdaftar! Silakan masuk menggunakan kata sandi Anda.',
      }
    }

    // Ekstrak nama default jika tidak diisi
    const derivedName = params.name?.trim() || email.split('@')[0].replace(/[._]/g, ' ')
    const formattedName = derivedName
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')

    const role = params.role || 'student'
    const newUser: RegisteredUser = {
      id: `usr_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      name: formattedName,
      email,
      password,
      passwordHash: password,
      role,
      classCode: params.classCode?.trim() || 'KIM-X-FASE-E',
      schoolName: params.schoolName?.trim() || 'SMA Negeri 1 Jakarta',
      createdAt: new Date().toISOString(),
      provider: 'local',
    }

    users.push(newUser)
    this.saveRegisteredUsers(users)

    // Buat sesi aktif
    const sessionDays = params.rememberDevice !== false ? 30 : 1
    const session: StoredSession = {
      userId: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      classCode: newUser.classCode,
      schoolName: newUser.schoolName,
      token: `jwt_local_${Date.now()}_${newUser.id}`,
      expiresAt: new Date(Date.now() + sessionDays * 24 * 3600 * 1000).toISOString(),
      rememberDevice: params.rememberDevice !== false,
    }

    this.currentSession = session
    try {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
    } catch {
      // In-memory fallback
    }

    this.notifyListeners()
    return { success: true, user: this.getAccess() }
  }

  /**
   * Masuk (Login) dengan Email & Password terdaftar
   */
  public async loginWithEmail(
    paramsOrEmail: { email: string; password: string; rememberDevice?: boolean } | string,
    maybePassword?: string
  ): Promise<{ success: boolean; error?: string; user?: UserAccess }> {
    // Simulasi jeda server
    await new Promise((resolve) => setTimeout(resolve, 400))

    let email = ''
    let password = ''
    let rememberDevice = true

    if (typeof paramsOrEmail === 'string') {
      email = paramsOrEmail.trim().toLowerCase()
      password = (maybePassword || '').trim()
    } else {
      email = paramsOrEmail.email.trim().toLowerCase()
      password = paramsOrEmail.password.trim()
      rememberDevice = paramsOrEmail.rememberDevice !== false
    }

    if (!email) {
      return { success: false, error: 'Silakan masukkan alamat email kamu.' }
    }
    if (!password) {
      return { success: false, error: 'Silakan masukkan kata sandi kamu.' }
    }

    const users = this.getRegisteredUsers()
    const user = users.find((u) => u.email.toLowerCase() === email)

    if (!user) {
      return {
        success: false,
        error: 'Email belum terdaftar. Silakan lakukan pendaftaran akun terlebih dahulu.',
      }
    }

    const matchesPassword = user.password === password || user.passwordHash === password
    if (!matchesPassword) {
      return {
        success: false,
        error: 'Kata sandi salah. Silakan periksa kembali atau gunakan fitur Lupa Kata Sandi.',
      }
    }

    const sessionDays = rememberDevice ? 30 : 1
    const session: StoredSession = {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      classCode: user.classCode || 'KIM-X-FASE-E',
      schoolName: user.schoolName || 'SMA Negeri 1 Jakarta',
      token: `jwt_local_${Date.now()}_${user.id}`,
      expiresAt: new Date(Date.now() + sessionDays * 24 * 3600 * 1000).toISOString(),
      rememberDevice,
    }

    this.currentSession = session
    try {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
    } catch {
      // in-memory fallback
    }

    this.notifyListeners()
    return { success: true, user: this.getAccess() }
  }

  /**
   * Permintaan Lupa Kata Sandi (Kirim Kode / Token Verifikasi Reset)
   */
  public async requestPasswordReset(email: string): Promise<{
    success: boolean
    error?: string
    message?: string
    token?: string
    emailExists?: boolean
  }> {
    await new Promise((resolve) => setTimeout(resolve, 400))

    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail) {
      return {
        success: false,
        error: 'Silakan masukkan alamat email terdaftar Anda.',
        emailExists: false,
        message: 'Silakan masukkan alamat email terdaftar Anda.',
      }
    }

    const users = this.getRegisteredUsers()
    const user = users.find((u) => u.email.toLowerCase() === cleanEmail)

    if (!user) {
      return {
        success: false,
        error: 'Email ini tidak terdaftar di sistem AtomLab. Silakan periksa kembali.',
        emailExists: false,
        message: 'Email ini tidak terdaftar di sistem AtomLab. Silakan periksa kembali.',
      }
    }

    // Generate kode simulasi reset
    const token = `ATOM-${Math.floor(1000 + Math.random() * 9000)}`
    return {
      success: true,
      message: `Kode pemulihan telah disiapkan untuk ${cleanEmail}. Gunakan kode untuk memperbarui kata sandi.`,
      token,
      emailExists: true,
    }
  }

  /**
   * Reset / Perbarui Kata Sandi Pengguna
   */
  public async resetPassword(
    paramsOrEmail:
      | {
          email: string
          newPassword: string
          confirmPassword?: string
          token?: string
        }
      | string,
    maybeNewPassword?: string
  ): Promise<{ success: boolean; error?: string; message?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 450))

    let cleanEmail = ''
    let newPassword = ''
    let confirmPassword: string | undefined

    if (typeof paramsOrEmail === 'string') {
      cleanEmail = paramsOrEmail.trim().toLowerCase()
      newPassword = (maybeNewPassword || '').trim()
    } else {
      cleanEmail = paramsOrEmail.email.trim().toLowerCase()
      newPassword = paramsOrEmail.newPassword.trim()
      confirmPassword = paramsOrEmail.confirmPassword?.trim()
    }

    if (!cleanEmail) {
      return { success: false, error: 'Email tidak boleh kosong.' }
    }

    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'Kata sandi baru minimal 6 karakter.' }
    }

    if (confirmPassword !== undefined && newPassword !== confirmPassword) {
      return { success: false, error: 'Konfirmasi kata sandi tidak cocok.' }
    }

    const users = this.getRegisteredUsers()
    const userIndex = users.findIndex((u) => u.email.toLowerCase() === cleanEmail)

    if (userIndex === -1) {
      return { success: false, error: 'Pengguna tidak ditemukan.' }
    }

    users[userIndex].password = newPassword
    users[userIndex].passwordHash = newPassword
    this.saveRegisteredUsers(users)

    return {
      success: true,
      message: 'Kata sandi berhasil diperbarui! Silakan masuk dengan kata sandi baru Anda.',
    }
  }

  /**
   * Masuk atau Daftar dengan Google
   * Mensimulasikan autentikasi OAuth Google resmi untuk platform pendidikan
   */
  public async loginWithGoogle(options?: {
    customName?: string
    email?: string
    classCode?: string
    schoolName?: string
    role?: 'student' | 'teacher'
    rememberDevice?: boolean
  }): Promise<UserAccess> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase()
    const name = options?.customName || 'Budi Santoso'
    const email =
      options?.email ||
      `${name.toLowerCase().replace(/\s+/g, '.')}.${randomSuffix.toLowerCase()}@gmail.com`
    const classCode = options?.classCode || 'KIM-X-FASE-E'
    const schoolName = options?.schoolName || 'SMA Negeri 1 Jakarta'
    const role = options?.role || 'student'

    // Daftarkan ke pengguna terdaftar jika belum ada
    const users = this.getRegisteredUsers()
    let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (!user) {
      user = {
        id: `usr_google_${Date.now().toString(36)}_${randomSuffix}`,
        name,
        email,
        password: `g_oauth_${randomSuffix}`,
        passwordHash: `g_oauth_${randomSuffix}`,
        role,
        classCode,
        schoolName,
        createdAt: new Date().toISOString(),
        provider: 'google',
      }
      users.push(user)
      this.saveRegisteredUsers(users)
    } else if (options?.role && user.role !== options.role) {
      user.role = options.role
      this.saveRegisteredUsers(users)
    }

    const sessionDays = options?.rememberDevice !== false ? 30 : 1
    const session: StoredSession = {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      classCode: user.classCode || classCode,
      schoolName: user.schoolName || schoolName,
      token: `jwt_google_secure_${Date.now()}_${randomSuffix}`,
      expiresAt: new Date(Date.now() + sessionDays * 24 * 3600 * 1000).toISOString(),
      rememberDevice: options?.rememberDevice !== false,
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
