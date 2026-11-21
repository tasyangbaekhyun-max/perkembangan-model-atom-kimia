/**
 * AUTH SERVICE & SDK SESSION LISTENER ADAPTER
 * Mengelola autentikasi:
 * - Registrasi akun baru (Email, Password, Konfirmasi Password) -> Terhubung ke Firebase Auth & Firestore
 * - Masuk dengan Email terdaftar -> Terhubung ke Firebase Auth
 * - Masuk / Daftar dengan Akun Google -> Terhubung ke Firebase Google Auth Popup
 * - Pemulihan dan Reset Kata Sandi (Lupa Password) -> Terhubung ke Firebase sendPasswordResetEmail
 * - Sesi Tamu (Belajar tanpa login tetap berfungsi)
 * - getAccess() mengembalikan alias akun kelas
 * - onAuthStateChanged() untuk pembaruan reaktif ID akun aktif
 * - Proteksi privasi: Tidak menyalin token/email ke log atau UI hasil
 */

import type { UserAccess } from './types'
import { getOrCreateGuestId } from '../services/quizStorage'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged as onFirebaseAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth'
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore'
import {
  auth,
  db,
  googleProvider,
  isFirebaseConfigured,
  mapFirebaseAuthError,
} from './firebase'

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
  provider: 'local' | 'google' | 'firebase-email'
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

  constructor() {
    this.initUsersFromStorage()
    this.initSessionFromStorage()
    this.initFirebaseListener()
  }

  /**
   * Listener otomatis Firebase Auth untuk mempertahankan status login pengguna
   */
  private initFirebaseListener(): void {
    if (!isFirebaseConfigured() || !auth) return

    try {
      onFirebaseAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
        if (fbUser) {
          try {
            let name = fbUser.displayName || fbUser.email?.split('@')[0] || 'Siswa Kimia'
            let role: 'student' | 'teacher' | 'admin' = 'student'
            let classCode = 'KIM-X-FASE-E'
            let schoolName = 'SMA Negeri 1 Jakarta'

            if (db) {
              const userSnap = await getDoc(doc(db, 'users', fbUser.uid))
              if (userSnap.exists()) {
                const data = userSnap.data()
                if (data.name) name = data.name
                if (data.role) role = data.role
                if (data.classCode) classCode = data.classCode
                if (data.schoolName) schoolName = data.schoolName
              }
            }

            const token = await fbUser.getIdToken().catch(() => `fb_token_${Date.now()}`)
            const session: StoredSession = {
              userId: fbUser.uid,
              name,
              email: fbUser.email || undefined,
              role,
              classCode,
              schoolName,
              token,
              expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
              rememberDevice: true,
            }

            this.currentSession = session
            if (typeof window !== 'undefined') {
              window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
            }
            this.notifyListeners()
          } catch (err) {
            console.warn('[Firebase] Gagal sinkron status sesi login:', err)
          }
        } else {
          // Jika sebelumnya ada sesi Firebase yang aktif dan user telah logout di Firebase
          if (this.currentSession && !this.currentSession.userId.startsWith('usr_')) {
            this.currentSession = null
            if (typeof window !== 'undefined') {
              window.localStorage.removeItem(AUTH_STORAGE_KEY)
            }
            this.notifyListeners()
          }
        }
      })
    } catch (err) {
      console.warn('[Firebase] Inisialisasi onFirebaseAuthStateChanged gagal:', err)
    }
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
   * Terhubung secara nyata ke Firebase Auth & Cloud Firestore jika kredensial diisi.
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
    const email = params.email.trim().toLowerCase()
    const password = params.password.trim()
    const confirmPassword = params.confirmPassword?.trim()

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      return { success: false, error: 'Format email tidak valid. Masukkan alamat email yang benar.' }
    }

    // Validasi kata sandi
    if (!password || password.length < 6) {
      return { success: false, error: 'Kata sandi minimal 6 karakter.' }
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return { success: false, error: 'Konfirmasi kata sandi tidak cocok.' }
    }

    const derivedName = params.name?.trim() || email.split('@')[0].replace(/[._]/g, ' ')
    const formattedName = derivedName
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')

    const role = params.role || 'student'
    const classCode = params.classCode?.trim() || 'KIM-X-FASE-E'
    const schoolName = params.schoolName?.trim() || 'SMA Negeri 1 Jakarta'
    const rememberDevice = params.rememberDevice !== false

    // 1. INTEGRASI NYATA KE FIREBASE AUTH & FIRESTORE
    if (isFirebaseConfigured() && auth) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password)

        // Perbarui display name di Firebase Auth profile
        try {
          await updateProfile(cred.user, { displayName: formattedName })
        } catch {
          // ignore
        }

        // Simpan data profil pengguna ke Cloud Firestore
        if (db) {
          try {
            await setDoc(doc(db, 'users', cred.user.uid), {
              id: cred.user.uid,
              name: formattedName,
              email,
              role,
              classCode,
              schoolName,
              createdAt: serverTimestamp(),
              provider: 'firebase-email',
            }, { merge: true })
          } catch (dbErr) {
            console.warn('[Firebase] Gagal menyimpan data profil ke Firestore:', dbErr)
          }
        }

        const sessionDays = rememberDevice ? 30 : 1
        const token = await cred.user.getIdToken().catch(() => `fb_jwt_${Date.now()}`)
        const session: StoredSession = {
          userId: cred.user.uid,
          name: formattedName,
          email,
          role,
          classCode,
          schoolName,
          token,
          expiresAt: new Date(Date.now() + sessionDays * 24 * 3600 * 1000).toISOString(),
          rememberDevice,
        }

        this.currentSession = session
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
        }

        this.notifyListeners()
        return { success: true, user: this.getAccess() }
      } catch (err: any) {
        return { success: false, error: mapFirebaseAuthError(err) }
      }
    }

    // 2. FALLBACK LOKAL / DEMO JIKA FIREBASE BELUM DIISI DI .env.local
    await new Promise((resolve) => setTimeout(resolve, 350))
    const users = this.getRegisteredUsers()
    const existing = users.find((u) => u.email.toLowerCase() === email)
    if (existing) {
      return {
        success: false,
        error: 'Email ini sudah terdaftar! Silakan masuk menggunakan kata sandi Anda.',
      }
    }

    const newUser: RegisteredUser = {
      id: `usr_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      name: formattedName,
      email,
      password,
      passwordHash: password,
      role,
      classCode,
      schoolName,
      createdAt: new Date().toISOString(),
      provider: 'local',
    }

    users.push(newUser)
    this.saveRegisteredUsers(users)

    const sessionDays = rememberDevice ? 30 : 1
    const session: StoredSession = {
      userId: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      classCode: newUser.classCode,
      schoolName: newUser.schoolName,
      token: `jwt_local_${Date.now()}_${newUser.id}`,
      expiresAt: new Date(Date.now() + sessionDays * 24 * 3600 * 1000).toISOString(),
      rememberDevice,
    }

    this.currentSession = session
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
      } catch {
        // ignore
      }
    }

    this.notifyListeners()
    return { success: true, user: this.getAccess() }
  }

  /**
   * Masuk (Login) dengan Email & Password terdaftar
   * Terhubung secara nyata ke Firebase Auth jika kredensial diisi.
   */
  public async loginWithEmail(
    paramsOrEmail: { email: string; password: string; rememberDevice?: boolean } | string,
    maybePassword?: string
  ): Promise<{ success: boolean; error?: string; user?: UserAccess }> {
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

    // 1. INTEGRASI NYATA KE FIREBASE AUTH
    if (isFirebaseConfigured() && auth) {
      try {
        const cred = await signInWithEmailAndPassword(auth, email, password)

        let name = cred.user.displayName || email.split('@')[0]
        let role: 'student' | 'teacher' | 'admin' = 'student'
        let classCode = 'KIM-X-FASE-E'
        let schoolName = 'SMA Negeri 1 Jakarta'

        // Muat data profil dari Cloud Firestore
        if (db) {
          try {
            const userDoc = await getDoc(doc(db, 'users', cred.user.uid))
            if (userDoc.exists()) {
              const data = userDoc.data()
              if (data.name) name = data.name
              if (data.role) role = data.role
              if (data.classCode) classCode = data.classCode
              if (data.schoolName) schoolName = data.schoolName
            } else {
              // Simpan record dasar jika belum pernah ada
              await setDoc(doc(db, 'users', cred.user.uid), {
                id: cred.user.uid,
                name,
                email,
                role,
                classCode,
                schoolName,
                createdAt: serverTimestamp(),
                lastLoginAt: serverTimestamp(),
                provider: 'firebase-email',
              }, { merge: true })
            }
          } catch (dbErr) {
            console.warn('[Firebase] Gagal sinkron Firestore saat login email:', dbErr)
          }
        }

        const sessionDays = rememberDevice ? 30 : 1
        const token = await cred.user.getIdToken().catch(() => `fb_jwt_${Date.now()}`)
        const session: StoredSession = {
          userId: cred.user.uid,
          name,
          email,
          role,
          classCode,
          schoolName,
          token,
          expiresAt: new Date(Date.now() + sessionDays * 24 * 3600 * 1000).toISOString(),
          rememberDevice,
        }

        this.currentSession = session
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
        }

        this.notifyListeners()
        return { success: true, user: this.getAccess() }
      } catch (err: any) {
        return { success: false, error: mapFirebaseAuthError(err) }
      }
    }

    // 2. FALLBACK LOKAL / DEMO JIKA FIREBASE BELUM DIISI DI .env.local
    await new Promise((resolve) => setTimeout(resolve, 350))
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
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
      } catch {
        // ignore
      }
    }

    this.notifyListeners()
    return { success: true, user: this.getAccess() }
  }

  /**
   * Permintaan Lupa Kata Sandi (Kirim Email Reset Asli via Firebase Auth)
   */
  public async requestPasswordReset(email: string): Promise<{
    success: boolean
    error?: string
    message?: string
    token?: string
    emailExists?: boolean
  }> {
    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail) {
      return {
        success: false,
        error: 'Silakan masukkan alamat email terdaftar Anda.',
        emailExists: false,
      }
    }

    // 1. INTEGRASI NYATA KE FIREBASE AUTH (Kirim link reset ke email pengguna)
    if (isFirebaseConfigured() && auth) {
      try {
        await sendPasswordResetEmail(auth, cleanEmail)
        return {
          success: true,
          message: `Tautan pengaturan ulang kata sandi telah dikirim ke ${cleanEmail}. Silakan periksa kotak masuk atau spam email Anda.`,
          emailExists: true,
        }
      } catch (err: any) {
        return {
          success: false,
          error: mapFirebaseAuthError(err),
          emailExists: false,
        }
      }
    }

    // 2. FALLBACK LOKAL / DEMO:
    await new Promise((resolve) => setTimeout(resolve, 350))
    const users = this.getRegisteredUsers()
    const user = users.find((u) => u.email.toLowerCase() === cleanEmail)

    if (!user) {
      return {
        success: false,
        error: 'Email ini tidak terdaftar di sistem AtomLab. Silakan periksa kembali.',
        emailExists: false,
      }
    }

    const token = `ATOM-${Math.floor(1000 + Math.random() * 9000)}`
    return {
      success: true,
      message: `Kode pemulihan telah disiapkan untuk ${cleanEmail}. Gunakan kode untuk memperbarui kata sandi.`,
      token,
      emailExists: true,
    }
  }

  /**
   * Reset / Perbarui Kata Sandi Pengguna (Mode Lokal)
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
    await new Promise((resolve) => setTimeout(resolve, 350))

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
      return { success: false, error: 'Pengguna tidak ditemukan dalam sistem.' }
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
   * Terhubung secara nyata ke Google Popup Firebase Auth jika kredensial diisi.
   */
  public async loginWithGoogle(options?: {
    customName?: string
    email?: string
    classCode?: string
    schoolName?: string
    rememberDevice?: boolean
  }): Promise<UserAccess> {
    // 1. INTEGRASI NYATA KE GOOGLE AUTH FIREBASE
    if (isFirebaseConfigured() && auth && googleProvider) {
      try {
        const cred = await signInWithPopup(auth, googleProvider)
        const user = cred.user

        let name = user.displayName || options?.customName || 'Siswa Google'
        let email = user.email || ''
        let role: 'student' | 'teacher' | 'admin' = 'student'
        let classCode = options?.classCode || 'KIM-X-FASE-E'
        let schoolName = options?.schoolName || 'SMA Negeri 1 Jakarta'

        // Muat / simpan pengguna ke Cloud Firestore
        if (db) {
          try {
            const userSnap = await getDoc(doc(db, 'users', user.uid))
            if (userSnap.exists()) {
              const data = userSnap.data()
              if (data.name) name = data.name
              if (data.role) role = data.role
              if (data.classCode) classCode = data.classCode
              if (data.schoolName) schoolName = data.schoolName
            } else {
              await setDoc(doc(db, 'users', user.uid), {
                id: user.uid,
                name,
                email,
                role,
                classCode,
                schoolName,
                createdAt: serverTimestamp(),
                lastLoginAt: serverTimestamp(),
                provider: 'google',
              }, { merge: true })
            }
          } catch (dbErr) {
            console.warn('[Firebase] Gagal sinkron Firestore pengguna Google:', dbErr)
          }
        }

        const sessionDays = options?.rememberDevice !== false ? 30 : 1
        const token = await user.getIdToken().catch(() => `fb_jwt_${Date.now()}`)
        const session: StoredSession = {
          userId: user.uid,
          name,
          email,
          role,
          classCode,
          schoolName,
          token,
          expiresAt: new Date(Date.now() + sessionDays * 24 * 3600 * 1000).toISOString(),
          rememberDevice: options?.rememberDevice !== false,
        }

        this.currentSession = session
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
        }

        this.notifyListeners()
        return this.getAccess()
      } catch (err: any) {
        throw new Error(mapFirebaseAuthError(err))
      }
    }

    // 2. FALLBACK LOKAL / DEMO JIKA FIREBASE BELUM DIISI DI .env.local
    await new Promise((resolve) => setTimeout(resolve, 450))

    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase()
    const name = options?.customName || 'Budi Santoso'
    const email =
      options?.email ||
      `${name.toLowerCase().replace(/\s+/g, '.')}.${randomSuffix.toLowerCase()}@gmail.com`
    const classCode = options?.classCode || 'KIM-X-FASE-E'
    const schoolName = options?.schoolName || 'SMA Negeri 1 Jakarta'

    const users = this.getRegisteredUsers()
    let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (!user) {
      user = {
        id: `usr_google_${Date.now().toString(36)}_${randomSuffix}`,
        name,
        email,
        password: `g_oauth_${randomSuffix}`,
        passwordHash: `g_oauth_${randomSuffix}`,
        role: 'student',
        classCode,
        schoolName,
        createdAt: new Date().toISOString(),
        provider: 'google',
      }
      users.push(user)
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
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
      } catch {
        // ignore
      }
    }

    this.notifyListeners()
    return this.getAccess()
  }

  /**
   * Keluar dari Akun (Logout)
   * Terhubung ke signOut(auth) Firebase dan pembersihan sesi lokal
   */
  public logout(clearDeviceData = false): void {
    if (isFirebaseConfigured() && auth) {
      try {
        signOut(auth).catch(() => {})
      } catch {
        // ignore
      }
    }

    this.currentSession = null
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(AUTH_STORAGE_KEY)
        if (clearDeviceData) {
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
      }
    } catch {
      // ignore
    }

    this.notifyListeners()
  }
}

export const authService = new AuthService()
