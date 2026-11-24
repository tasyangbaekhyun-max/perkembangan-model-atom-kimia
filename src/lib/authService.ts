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
  getDocs,
  setDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore'
import {
  auth,
  db,
  googleProvider,
  isFirebaseConfigured,
  mapFirebaseAuthError,
} from './firebase'

export const GENERAL_CLASS_CODE = 'UMUM-01'
export const GENERAL_CLASS_NAME = 'Kelas Umum'

const AUTH_STORAGE_KEY = 'atomlab_sdk_auth_session'
const USERS_STORAGE_KEY = 'atomlab_registered_users'
const CLASSES_STORAGE_KEY = 'atomlab_registered_classes'

export interface TeacherClassInfo {
  classCode: string
  className: string
  teacherId: string
  teacherName?: string
  createdAt?: string
  isGeneral?: boolean
}

export interface StoredSession {
  userId: string
  name: string
  email?: string
  role: 'student' | 'teacher' | 'admin'
  classCode?: string
  className?: string
  teacherId?: string
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
  className?: string
  teacherId?: string
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
    classCode: 'SITI-0001',
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
    classCode: 'SITI-0001',
    className: 'Kelas Siti Nurhaliza',
    teacherId: 'usr_guru_01',
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
    classCode: 'AHMA-0002',
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
    classCode: 'AHMA-0002',
    className: 'Kelas Ahmad Hidayat',
    teacherId: 'usr_demo_teacher_01',
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
            let classCode = ''
            let className: string | undefined = undefined
            let teacherId: string | undefined = undefined
            let schoolName = 'SMA Negeri 1 Jakarta'

            if (db) {
              const userSnap = await getDoc(doc(db, 'users', fbUser.uid))
              if (userSnap.exists()) {
                const data = userSnap.data() || {}
                if (data.name) name = data.name
                if (data.role) role = data.role
                if (data.classCode) classCode = data.classCode
                if (data.schoolName) schoolName = data.schoolName
                if (data.className) className = data.className
                if (data.teacherId) teacherId = data.teacherId
              }
            }

            // Fallback classCode berdasarkan role jika belum ada di database
            if (!classCode) {
              if (role === 'teacher') {
                classCode = await this.generateUniqueClassCode(name)
                className = className || `Kelas ${name}`
                teacherId = fbUser.uid
                if (db) {
                  try {
                    await setDoc(doc(db, 'users', fbUser.uid), { classCode, className, teacherId }, { merge: true })
                    await setDoc(doc(db, 'classes', classCode), {
                      classCode,
                      className,
                      teacherId: fbUser.uid,
                      teacherName: name,
                      createdAt: serverTimestamp(),
                    }, { merge: true })
                  } catch {
                    // ignore
                  }
                }
              } else {
                classCode = GENERAL_CLASS_CODE
              }
            }

            const token = await fbUser.getIdToken().catch(() => `fb_token_${Date.now()}`)
            const session: StoredSession = {
              userId: fbUser.uid,
              name,
              email: fbUser.email || undefined,
              role,
              classCode,
              className,
              teacherId,
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

        // Tambahkan default user yang belum ada
        for (const defaultUser of DEFAULT_USERS) {
          const idx = existingUsers.findIndex((u) => u.email.toLowerCase() === defaultUser.email.toLowerCase())
          if (idx === -1) {
            existingUsers.push(defaultUser)
            modified = true
          } else {
            // Migrasi: perbarui classCode stale (KIM-X-FASE-E / GURU-KIMIA-X / KLS-SN-001) ke kode baru per guru
            const existing = existingUsers[idx]
            if (
              existing.role === 'teacher' &&
              (!existing.classCode ||
                existing.classCode === 'KIM-X-FASE-E' ||
                existing.classCode === 'GURU-KIMIA-X' ||
                existing.classCode === 'KLS-SN-001')
            ) {
              existingUsers[idx] = {
                ...existing,
                classCode: defaultUser.classCode,
                className: defaultUser.className || existing.className,
                teacherId: defaultUser.teacherId || existing.teacherId,
              }
              modified = true
            }
          }
        }

        if (modified) {
          window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(existingUsers))
        }
      }

      // Inisialisasi default class mappings jika belum ada (Termasuk Kelas Umum UMUM-01)
      const rawClasses = window.localStorage.getItem(CLASSES_STORAGE_KEY)
      if (!rawClasses) {
        const defaultClasses: TeacherClassInfo[] = [
          {
            classCode: GENERAL_CLASS_CODE,
            className: GENERAL_CLASS_NAME,
            teacherId: 'general_admin',
            teacherName: 'Tim Pembelajaran AtomLab',
            createdAt: '2026-01-01T00:00:00.000Z',
            isGeneral: true,
          },
          {
            classCode: 'SITI-0001',
            className: 'Kelas Siti Nurhaliza',
            teacherId: 'usr_guru_01',
            teacherName: 'Dra. Siti Nurhaliza, M.Pd',
            createdAt: '2026-01-10T08:00:00.000Z',
          },
          {
            classCode: 'AHMA-0002',
            className: 'Kelas Ahmad Hidayat',
            teacherId: 'usr_demo_teacher_01',
            teacherName: 'Dr. Ahmad Hidayat, M.Pd.',
            createdAt: '2026-01-01T08:00:00.000Z',
          },
        ]
        window.localStorage.setItem(CLASSES_STORAGE_KEY, JSON.stringify(defaultClasses))
      } else {
        // Migrasi: ganti kode stale lama dengan kode baru berbasis nama guru
        const STALE_CODES = ['KIM-X-FASE-E', 'GURU-KIMIA-X', 'KLS-SN-001']
        const MIGRATION_MAP: Record<string, TeacherClassInfo> = {
          'KIM-X-FASE-E': {
            classCode: 'SITI-0001',
            className: 'Kelas Siti Nurhaliza',
            teacherId: 'usr_guru_01',
            teacherName: 'Dra. Siti Nurhaliza, M.Pd',
            createdAt: '2026-01-10T08:00:00.000Z',
          },
          'KLS-SN-001': {
            classCode: 'SITI-0001',
            className: 'Kelas Siti Nurhaliza',
            teacherId: 'usr_guru_01',
            teacherName: 'Dra. Siti Nurhaliza, M.Pd',
            createdAt: '2026-01-10T08:00:00.000Z',
          },
          'GURU-KIMIA-X': {
            classCode: 'AHMA-0002',
            className: 'Kelas Ahmad Hidayat',
            teacherId: 'usr_demo_teacher_01',
            teacherName: 'Dr. Ahmad Hidayat, M.Pd.',
            createdAt: '2026-01-01T08:00:00.000Z',
          },
        }
        const parsed = JSON.parse(rawClasses) as TeacherClassInfo[]
        let classModified = false
        const migrated: TeacherClassInfo[] = []
        const seenCodes = new Set<string>()

        for (const cls of parsed) {
          const upper = cls.classCode.toUpperCase()
          if (STALE_CODES.includes(upper) && MIGRATION_MAP[upper]) {
            const newEntry = MIGRATION_MAP[upper]
            if (!seenCodes.has(newEntry.classCode)) {
              migrated.push(newEntry)
              seenCodes.add(newEntry.classCode)
            }
            classModified = true
          } else {
            if (!seenCodes.has(upper)) {
              migrated.push(cls)
              seenCodes.add(upper)
            }
          }
        }

        // Pastikan Kelas Umum selalu ada
        if (!migrated.some((c) => c.classCode.toUpperCase() === GENERAL_CLASS_CODE)) {
          migrated.unshift({
            classCode: GENERAL_CLASS_CODE,
            className: GENERAL_CLASS_NAME,
            teacherId: 'general_admin',
            teacherName: 'Tim Pembelajaran AtomLab',
            createdAt: '2026-01-01T00:00:00.000Z',
            isGeneral: true,
          })
          classModified = true
        }

        if (classModified) {
          window.localStorage.setItem(CLASSES_STORAGE_KEY, JSON.stringify(migrated))
        }
      }
    } catch {
      // In-memory fallback
    }
  }

  /**
   * Mengambil daftar kelas terdaftar dari localStorage
   */
  public getRegisteredClasses(): TeacherClassInfo[] {
    const defaultClasses: TeacherClassInfo[] = [
      {
        classCode: GENERAL_CLASS_CODE,
        className: GENERAL_CLASS_NAME,
        teacherId: 'general_admin',
        teacherName: 'Tim Pembelajaran AtomLab',
        createdAt: '2026-01-01T00:00:00.000Z',
        isGeneral: true,
      },
    ]

    if (typeof window === 'undefined') return defaultClasses
    try {
      const raw = window.localStorage.getItem(CLASSES_STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as TeacherClassInfo[]
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Bersihkan kode default statis lama jika ada yang menempel
          const LEGACY_CODES = new Set(['KIM-X-FASE-E', 'GURU-KIMIA-X', 'KLS-SN-001'])
          const cleaned = parsed.filter(
            (c) => !LEGACY_CODES.has(c.classCode.toUpperCase())
          )
          if (!cleaned.some((c) => c.classCode.toUpperCase() === GENERAL_CLASS_CODE)) {
            cleaned.unshift(defaultClasses[0])
          }
          return cleaned
        }
      }
    } catch {
      // ignore
    }
    return defaultClasses
  }

  /**
   * Mengambil seluruh daftar kelas secara DINAMIS dari Firebase/Firestore dan lokal:
   * 1. Selalu memuat "Kelas Umum" (UMUM-01)
   * 2. Memuat kelas milik masing-masing guru yang terdaftar secara real-time dari Firestore
   */
  public async fetchDynamicClasses(): Promise<TeacherClassInfo[]> {
    const classMap = new Map<string, TeacherClassInfo>()

    // 1. Kelas Umum Bawaan
    classMap.set(GENERAL_CLASS_CODE, {
      classCode: GENERAL_CLASS_CODE,
      className: GENERAL_CLASS_NAME,
      teacherId: 'general_admin',
      teacherName: 'Tim Pembelajaran AtomLab',
      createdAt: '2026-01-01T00:00:00.000Z',
      isGeneral: true,
    })

    // 2. Ambil dari Firestore jika terhubung
    if (isFirebaseConfigured() && db) {
      try {
        // a. Ambil dari koleksi 'classes'
        const classesSnap = await getDocs(collection(db, 'classes'))
        classesSnap.forEach((docSnap) => {
          const data = docSnap.data() as any
          const code = (data.classCode || docSnap.id).toUpperCase().trim()
          if (!classMap.has(code)) {
            classMap.set(code, {
              classCode: code,
              className: data.className || `Kelas ${data.teacherName || code}`,
              teacherId: data.teacherId || '',
              teacherName: data.teacherName || '',
              createdAt: data.createdAt ? String(data.createdAt) : undefined,
              isGeneral: code === GENERAL_CLASS_CODE,
            })
          }
        })

        // b. Ambil juga dari koleksi 'users' dengan role 'teacher'
        const usersSnap = await getDocs(collection(db, 'users'))
        usersSnap.forEach((userSnap) => {
          const udata = userSnap.data() as any
          if (udata.role === 'teacher' && udata.classCode) {
            const code = udata.classCode.toUpperCase().trim()
            if (!classMap.has(code)) {
              classMap.set(code, {
                classCode: code,
                className: udata.className || `Kelas ${udata.name || 'Guru'}`,
                teacherId: userSnap.id,
                teacherName: udata.name || 'Guru Kimia',
                createdAt: udata.createdAt ? String(udata.createdAt) : undefined,
                isGeneral: code === GENERAL_CLASS_CODE,
              })
            }
          }
        })
      } catch (err) {
        console.warn('[Firebase] Gagal sinkron dynamic classes dari Firestore:', err)
      }
    }

    // 3. Gabungkan dengan data kelas lokal
    const localClasses = this.getRegisteredClasses()
    for (const lc of localClasses) {
      const code = lc.classCode.toUpperCase().trim()
      if (!classMap.has(code)) {
        classMap.set(code, lc)
      }
    }

    // Gabungkan dengan guru lokal yang terdaftar
    const localUsers = this.getRegisteredUsers()
    for (const u of localUsers) {
      if (u.role === 'teacher' && u.classCode) {
        const code = u.classCode.toUpperCase().trim()
        if (!classMap.has(code)) {
          classMap.set(code, {
            classCode: code,
            className: u.className || `Kelas ${u.name}`,
            teacherId: u.id,
            teacherName: u.name,
            createdAt: u.createdAt,
            isGeneral: code === GENERAL_CLASS_CODE,
          })
        }
      }
    }

    const mergedList = Array.from(classMap.values())
    this.saveRegisteredClasses(mergedList)
    return mergedList
  }

  /**
   * Menyimpan daftar kelas terdaftar ke localStorage
   */
  public saveRegisteredClasses(classes: TeacherClassInfo[]): void {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(CLASSES_STORAGE_KEY, JSON.stringify(classes))
    } catch {
      // ignore
    }
  }

  /**
   * Strip gelar akademik dari nama guru (Dra., Dr., Prof., S.Pd., M.Pd., M.Si., S.Si., Gr., Ir., dll.)
   * Contoh: "Dra. Siti Rahma, M.Pd" -> "Siti Rahma"
   */
  private stripAcademicTitles(fullName: string): string {
    // Hapus gelar di depan nama (prefix titles)
    let cleaned = fullName
      .replace(
        /^\s*(Prof\.|Drs?\.|Dr\.|Ir\.|Apt\.|Hj\.|H\.|Dra\.|Drs\.|Bapak|Ibu|Pak|Bu)\s+/gi,
        ''
      )
      .trim()
    // Hapus gelar di belakang nama setelah koma (suffix titles seperti M.Pd, S.Pd, M.Si, dll.)
    cleaned = cleaned
      .replace(/,\s*(S\.Pd|M\.Pd|S\.Si|M\.Si|M\.Sc|Ph\.D|M\.T|S\.T|S\.H|M\.H|Gr\.|M\.Kom|S\.Kom|M\.M|M\.A|M\.Ag|S\.Ag|S\.E|M\.E|S\.Farm|Apt\.?|S\.Hut|S\.Hum|M\.Hum|B\.Sc|MBA|M\.Kes|S\.Kes)\.?(\s*,.*)?$/gi,
        ''
      )
      .trim()
    return cleaned
  }

  /**
   * Membuat Kode Akses Kelas Siswa Unik per Guru berbasis nama guru.
   * Format: [NAMA/INISIAL]-[4 DIGIT ANGKA UNIK]
   * Contoh: "Dra. Siti Rahma, M.Pd"  -> SITI-4829  atau SR-4829
   *         "Finurika Rohmati"        -> FINU-3194  atau FR-3194
   *         "Ahmad"                  -> AHMA-7823
   * Cek ke Firestore & lokal agar dipastikan unik.
   */
  public async generateUniqueClassCode(teacherName?: string, _classOrRombelName?: string): Promise<string> {
    const digits = '0123456789'

    // --- Bangun prefix berbasis nama guru ---
    let prefix = 'GURU'
    if (teacherName) {
      const cleanName = this.stripAcademicTitles(teacherName)
      const words = cleanName.split(/\s+/).filter(Boolean)

      if (words.length >= 2) {
        // Dua kata atau lebih: gunakan 4 huruf pertama kata pertama (lebih deskriptif)
        // Contoh: "Siti Rahma" -> SITI, atau inisial jika kata pertama pendek: "Ana Budi" -> AB
        const firstWord = words[0].replace(/[^A-Za-z]/g, '').toUpperCase()
        const secondWord = words[1].replace(/[^A-Za-z]/g, '').toUpperCase()
        if (firstWord.length >= 4) {
          prefix = firstWord.substring(0, 4) // SITI, FINU, AHMA
        } else {
          // Gunakan inisial semua kata (maks 4 karakter)
          prefix = words
            .map((w) => w.replace(/[^A-Za-z]/g, '').charAt(0).toUpperCase())
            .join('')
            .substring(0, 4)
          if (prefix.length < 2) prefix = firstWord.substring(0, 4) || 'GURU'
        }
        // Pastikan minimal 2 karakter, tambah dari kata kedua jika perlu
        if (prefix.length < 2) prefix = (firstWord + secondWord).substring(0, 4)
      } else if (words.length === 1) {
        const word = words[0].replace(/[^A-Za-z]/g, '').toUpperCase()
        prefix = word.length >= 4 ? word.substring(0, 4) : word || 'GURU'
      }
    }

    // Pastikan prefix hanya alfanumerik kapital, minimal 2 karakter
    prefix = prefix.replace(/[^A-Z0-9]/g, '').toUpperCase()
    if (prefix.length < 2) prefix = 'GURU'

    const localClasses = this.getRegisteredClasses()
    const existingLocalCodes = new Set(localClasses.map((c) => c.classCode.toUpperCase()))
    existingLocalCodes.add(GENERAL_CLASS_CODE)

    let attempts = 0
    while (attempts < 100) {
      attempts++
      // Buat 4 digit angka acak
      let numPart = ''
      for (let i = 0; i < 4; i++) {
        numPart += digits.charAt(Math.floor(Math.random() * digits.length))
      }
      const candidate = `${prefix}-${numPart}` // e.g. SITI-4829

      // Cek lokal
      if (existingLocalCodes.has(candidate)) continue

      // Cek Firestore jika tersedia
      if (db) {
        try {
          const classDoc = await getDoc(doc(db, 'classes', candidate))
          if (classDoc.exists()) continue
        } catch {
          // Jika offline atau error, gunakan hasil yang lolos cek lokal
        }
      }

      return candidate
    }

    // Fallback jika loop habis (sangat jarang terjadi)
    return `${prefix}-${Date.now().toString().slice(-4)}`
  }

  /**
   * Validasi Kode Kelas Siswa ke Firestore dan penyimpanan lokal
   * Mendukung:
   * 1. Kode Kelas Umum (UMUM-01) -> Siswa masuk ke "Kelas Umum"
   * 2. Kode Kelas Guru spesifik -> Siswa otomatis terpetakan ke kelas guru tersebut
   * 3. Menolak kode yang tidak terdaftar dengan pesan error yang jelas
   */
  public async validateClassCode(rawCode: string): Promise<{
    valid: boolean
    classCode?: string
    className?: string
    teacherId?: string
    teacherName?: string
    isGeneral?: boolean
    error?: string
  }> {
    const code = (rawCode || '').trim().toUpperCase()
    if (!code) {
      return {
        valid: false,
        error: `Kode Kelas wajib diisi. Masukkan kode kelas dari guru kimia Anda, atau gunakan kode "${GENERAL_CLASS_CODE}" untuk Kelas Umum.`,
      }
    }

    // 1. Dukung KELAS UMUM
    if (code === GENERAL_CLASS_CODE || code === 'UMUM' || code === 'KELAS-UMUM') {
      return {
        valid: true,
        classCode: GENERAL_CLASS_CODE,
        className: GENERAL_CLASS_NAME,
        teacherId: 'general_admin',
        teacherName: 'Tim Pembelajaran AtomLab',
        isGeneral: true,
      }
    }

    // 2. Cek di Cloud Firestore jika tersedia
    if (db) {
      try {
        // Cek dokumen di koleksi 'classes'
        const classSnap = await getDoc(doc(db, 'classes', code))
        if (classSnap.exists()) {
          const data = classSnap.data() || {}
          return {
            valid: true,
            classCode: code,
            className: data.className || `Kelas ${data.teacherName || code}`,
            teacherId: data.teacherId || '',
            teacherName: data.teacherName || '',
            isGeneral: false,
          }
        }

        // Cek fallback jika guru menyimpan di profil 'users'
        const usersSnap = await getDoc(doc(db, 'users', code))
        if (usersSnap.exists()) {
          const data = usersSnap.data() || {}
          if (data.role === 'teacher') {
            return {
              valid: true,
              classCode: code,
              className: data.className || ("Kelas " + (data.name || code)),
              teacherId: usersSnap.id,
              teacherName: data.name || '',
              isGeneral: false,
            }
          }
        }
      } catch (err) {
        console.warn('[Firebase] Gagal verifikasi kode kelas ke Firestore, memeriksa registry lokal:', err)
      }
    }

    // 3. Cek di dynamic / registered classes lokal
    const localClasses = this.getRegisteredClasses()
    const foundClass = localClasses.find((c) => c.classCode.toUpperCase() === code)
    if (foundClass) {
      return {
        valid: true,
        classCode: foundClass.classCode.toUpperCase(),
        className: foundClass.className,
        teacherId: foundClass.teacherId,
        teacherName: foundClass.teacherName,
        isGeneral: foundClass.isGeneral || foundClass.classCode === GENERAL_CLASS_CODE,
      }
    }

    // Cek juga di registered users lokal jika guru punya classCode tersebut
    const localUsers = this.getRegisteredUsers()
    const teacherUser = localUsers.find(
      (u) => u.role === 'teacher' && u.classCode && u.classCode.toUpperCase() === code
    )
    if (teacherUser) {
      return {
        valid: true,
        classCode: teacherUser.classCode!.toUpperCase(),
        className: teacherUser.className || `Kelas ${teacherUser.name}`,
        teacherId: teacherUser.id,
        teacherName: teacherUser.name,
        isGeneral: false,
      }
    }

    // Dukung juga kode bawaan KIM-X-FASE-E untuk kompatibilitas
    if (code === 'KIM-X-FASE-E') {
      return {
        valid: true,
        classCode: 'KIM-X-FASE-E',
        className: 'Kimia X Fase E (Kelas Bawaan)',
        teacherId: 'usr_guru_01',
        teacherName: 'Dra. Siti Nurhaliza, M.Pd',
        isGeneral: false,
      }
    }

    return {
      valid: false,
      error: `Kode Kelas "${code}" tidak cocok dengan Kelas Umum (${GENERAL_CLASS_CODE}) maupun kode kelas Guru mana pun yang terdaftar. Harap periksa kembali atau gunakan kode "${GENERAL_CLASS_CODE}" untuk bergabung ke Kelas Umum.`,
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
      const effectiveRole = this.previewRoleOverride || this.currentSession.role
      const roleLabel = effectiveRole === 'teacher' ? 'Guru' : 'Siswa'
      return {
        userId: this.currentSession.userId,
        name: this.currentSession.name,
        email: this.currentSession.email,
        alias: `${this.currentSession.name} (${classPart})${this.previewRoleOverride ? ` [Mode ${roleLabel}]` : ''}`,
        role: effectiveRole,
        classCode: this.currentSession.classCode,
        className: this.currentSession.className,
        teacherId: this.currentSession.teacherId,
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
   * Terhubung secara nyata ke Firebase Auth & Cloud Firestore jika kredensial diisi.
   */
  public async registerWithEmail(params: {
    name?: string
    email: string
    password: string
    confirmPassword?: string
    classCode?: string
    className?: string
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
    const schoolName = params.schoolName?.trim() || 'SMA Negeri 1 Jakarta'
    const rememberDevice = params.rememberDevice !== false

    let effectiveClassCode = ''
    let effectiveClassName = ''
    let effectiveTeacherId = ''

    if (role === 'teacher') {
      // 1. Guru mendaftar: Nama Kelas dipetakan berdasarkan Nama Guru (dan/atau nama rombel jika diisi)
      const inputClassName = params.className?.trim()
      effectiveClassName = inputClassName
        ? (inputClassName.toLowerCase().includes(formattedName.toLowerCase()) ? inputClassName : `Kelas ${formattedName} (${inputClassName})`)
        : `Kelas ${formattedName}`
      // Generate Kode Akses Kelas Siswa Unik berbasis nama guru (misal: SITI-4829, FINU-3194)
      effectiveClassCode = await this.generateUniqueClassCode(formattedName, params.className?.trim())
    } else {
      // 2. Siswa mendaftar: Kode Kelas (mendukung Kode Kelas Umum UMUM-01 atau kode kelas guru)
      const rawStudentCode = (params.classCode || '').trim().toUpperCase()
      if (!rawStudentCode) {
        return {
          success: false,
          error: `Kode Kelas wajib diisi. Masukkan kode kelas dari guru kimia Anda, atau gunakan kode "${GENERAL_CLASS_CODE}" untuk Kelas Umum.`,
        }
      }

      const validation = await this.validateClassCode(rawStudentCode)
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error || `Kode Kelas "${rawStudentCode}" tidak valid atau belum terdaftar.`,
        }
      }

      effectiveClassCode = validation.classCode || rawStudentCode
      effectiveClassName = validation.className || (validation.isGeneral ? GENERAL_CLASS_NAME : 'Kelas Kimia')
      effectiveTeacherId = validation.teacherId || ''
    }

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

        if (role === 'teacher') {
          effectiveTeacherId = cred.user.uid
        }

        // Simpan data profil pengguna ke Cloud Firestore
        if (db) {
          try {
            await setDoc(doc(db, 'users', cred.user.uid), {
              id: cred.user.uid,
              name: formattedName,
              email,
              role,
              classCode: effectiveClassCode,
              className: effectiveClassName,
              teacherId: effectiveTeacherId,
              schoolName,
              createdAt: serverTimestamp(),
              provider: 'firebase-email',
            }, { merge: true })

            // Jika guru, simpan juga pemetaan kelas di koleksi 'classes'
            if (role === 'teacher') {
              await setDoc(doc(db, 'classes', effectiveClassCode), {
                classCode: effectiveClassCode,
                className: effectiveClassName,
                teacherId: cred.user.uid,
                teacherName: formattedName,
                createdAt: serverTimestamp(),
              }, { merge: true })
            }
          } catch (dbErr) {
            console.warn('[Firebase] Gagal menyimpan data profil ke Firestore:', dbErr)
          }
        }

        // Simpan juga kelas ke registry lokal untuk ketersediaan offline
        if (role === 'teacher') {
          const localClasses = this.getRegisteredClasses()
          if (!localClasses.some((c) => c.classCode === effectiveClassCode)) {
            localClasses.push({
              classCode: effectiveClassCode,
              className: effectiveClassName,
              teacherId: cred.user.uid,
              teacherName: formattedName,
              createdAt: new Date().toISOString(),
            })
            this.saveRegisteredClasses(localClasses)
          }
        }

        const sessionDays = rememberDevice ? 30 : 1
        const token = await cred.user.getIdToken().catch(() => `fb_jwt_${Date.now()}`)
        const session: StoredSession = {
          userId: cred.user.uid,
          name: formattedName,
          email,
          role,
          classCode: effectiveClassCode,
          className: effectiveClassName,
          teacherId: effectiveTeacherId,
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

    const newUserId = `usr_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`
    if (role === 'teacher') {
      effectiveTeacherId = newUserId
    }

    const newUser: RegisteredUser = {
      id: newUserId,
      name: formattedName,
      email,
      password,
      passwordHash: password,
      role,
      classCode: effectiveClassCode,
      className: effectiveClassName,
      teacherId: effectiveTeacherId,
      schoolName,
      createdAt: new Date().toISOString(),
      provider: 'local',
    }

    users.push(newUser)
    this.saveRegisteredUsers(users)

    if (role === 'teacher') {
      const localClasses = this.getRegisteredClasses()
      if (!localClasses.some((c) => c.classCode === effectiveClassCode)) {
        localClasses.push({
          classCode: effectiveClassCode,
          className: effectiveClassName,
          teacherId: newUserId,
          teacherName: formattedName,
          createdAt: new Date().toISOString(),
        })
        this.saveRegisteredClasses(localClasses)
      }
    }

    const sessionDays = rememberDevice ? 30 : 1
    const session: StoredSession = {
      userId: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      classCode: newUser.classCode,
      className: newUser.className,
      teacherId: newUser.teacherId,
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
    paramsOrEmail:
      | {
          email: string
          password: string
          rememberDevice?: boolean
          classCode?: string
          role?: 'student' | 'teacher'
        }
      | string,
    maybePassword?: string,
    maybeClassCode?: string
  ): Promise<{ success: boolean; error?: string; user?: UserAccess }> {
    let email = ''
    let password = ''
    let rememberDevice = true
    let customClassCode: string | undefined
    let expectedRole: 'student' | 'teacher' | undefined

    if (typeof paramsOrEmail === 'string') {
      email = paramsOrEmail.trim().toLowerCase()
      password = (maybePassword || '').trim()
      if (maybeClassCode) customClassCode = maybeClassCode.trim().toUpperCase()
    } else {
      email = paramsOrEmail.email.trim().toLowerCase()
      password = paramsOrEmail.password.trim()
      rememberDevice = paramsOrEmail.rememberDevice !== false
      if (paramsOrEmail.classCode) customClassCode = paramsOrEmail.classCode.trim().toUpperCase()
      expectedRole = paramsOrEmail.role
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
        let role: 'student' | 'teacher' | 'admin' = expectedRole || 'student'
        let classCode = customClassCode || ''
        let className: string | undefined = undefined
        let teacherId: string | undefined = undefined
        let schoolName = 'SMA Negeri 1 Jakarta'

        // Muat data profil dari Cloud Firestore
        if (db) {
          try {
            const userDoc = await getDoc(doc(db, 'users', cred.user.uid))
            if (userDoc.exists()) {
              const data = userDoc.data() || {}
              if (data.name) name = data.name
              if (data.role && !expectedRole) role = data.role
              if (data.classCode && !customClassCode) classCode = data.classCode
              if (data.className) className = data.className
              if (data.teacherId) teacherId = data.teacherId
              if (data.schoolName) schoolName = data.schoolName

              // Jika guru belum punya kode kelas unik, generate kode unik
              const STALE = new Set(['KIM-X-FASE-E', 'GURU-KIMIA-X', 'KLS-SN-001'])
              if (role === 'teacher' && (!classCode || STALE.has(classCode.toUpperCase()))) {
                classCode = await this.generateUniqueClassCode(name)
                className = className || `Kelas ${name}`
                teacherId = cred.user.uid
                await setDoc(doc(db, 'classes', classCode), {
                  classCode,
                  className,
                  teacherId: cred.user.uid,
                  teacherName: name,
                  createdAt: serverTimestamp(),
                }, { merge: true })
              }

              // Jika ada custom classCode atau role yang ditentukan saat login, perbarui Firestore
              if (customClassCode || expectedRole) {
                // Jika student memperbarui classCode saat login, validasi kode tersebut
                if (customClassCode && role === 'student') {
                  const val = await this.validateClassCode(customClassCode)
                  if (val.valid) {
                    className = val.className
                    teacherId = val.teacherId
                  }
                }

                await setDoc(
                  doc(db, 'users', cred.user.uid),
                  {
                    ...(customClassCode ? { classCode: customClassCode } : {}),
                    ...(className ? { className } : {}),
                    ...(teacherId ? { teacherId } : {}),
                    ...(expectedRole ? { role: expectedRole } : {}),
                    lastLoginAt: serverTimestamp(),
                  },
                  { merge: true }
                )
              }
            } else {
              if (role === 'teacher') {
                classCode = await this.generateUniqueClassCode(name)
                className = className || `Kelas ${name}`
                teacherId = cred.user.uid
                await setDoc(doc(db, 'classes', classCode), {
                  classCode,
                  className,
                  teacherId: cred.user.uid,
                  teacherName: name,
                  createdAt: serverTimestamp(),
                }, { merge: true })
              } else if (!classCode) {
                classCode = GENERAL_CLASS_CODE
              }

              // Simpan record dasar jika belum pernah ada
              await setDoc(
                doc(db, 'users', cred.user.uid),
                {
                  id: cred.user.uid,
                  name,
                  email,
                  role,
                  classCode,
                  className,
                  teacherId,
                  schoolName,
                  createdAt: serverTimestamp(),
                  lastLoginAt: serverTimestamp(),
                  provider: 'firebase-email',
                },
                { merge: true }
              )
            }
          } catch (dbErr) {
            console.warn('[Firebase] Gagal sinkron Firestore saat login email:', dbErr)
          }
        }

        if (!classCode) {
          classCode = role === 'teacher' ? await this.generateUniqueClassCode() : GENERAL_CLASS_CODE
        }

        const sessionDays = rememberDevice ? 30 : 1
        const token = await cred.user.getIdToken().catch(() => `fb_jwt_${Date.now()}`)
        const session: StoredSession = {
          userId: cred.user.uid,
          name,
          email,
          role,
          classCode,
          className,
          teacherId,
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

    const STALE_TEACHER_CODES = new Set(['KIM-X-FASE-E', 'GURU-KIMIA-X', 'KLS-SN-001'])
    if (user.role === 'teacher' && (!user.classCode || STALE_TEACHER_CODES.has(user.classCode.toUpperCase()))) {
      user.classCode = await this.generateUniqueClassCode(user.name)
      user.className = user.className || `Kelas ${user.name}`
      const localClasses = this.getRegisteredClasses()
      if (!localClasses.some((c) => c.classCode === user.classCode)) {
        localClasses.push({
          classCode: user.classCode,
          className: user.className,
          teacherId: user.id,
          teacherName: user.name,
          createdAt: new Date().toISOString(),
        })
        this.saveRegisteredClasses(localClasses)
      }
      this.saveRegisteredUsers(users)
    }

    if (customClassCode) {
      user.classCode = customClassCode
      if (user.role === 'student') {
        const val = await this.validateClassCode(customClassCode)
        if (val.valid) {
          user.className = val.className
          user.teacherId = val.teacherId
        }
      }
      this.saveRegisteredUsers(users)
    }

    const sessionDays = rememberDevice ? 30 : 1
    const session: StoredSession = {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: expectedRole || user.role,
      classCode: customClassCode || user.classCode || (user.role === 'teacher' ? await this.generateUniqueClassCode(user.name) : GENERAL_CLASS_CODE),
      className: user.className,
      teacherId: user.teacherId,
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
    role?: 'student' | 'teacher'
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
              const data = userSnap.data() || {}
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
    const role = options?.role || 'student'

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



