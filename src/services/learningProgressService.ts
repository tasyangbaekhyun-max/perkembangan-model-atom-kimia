/**
 * SERVICE SISTEM POIN BELAJAR (XP) & KETUNTASAN MODEL ATOM
 * Terintegrasi langsung dengan 4 tahap di setiap model atom:
 * - Tahap 1: Latar Belakang & Tokoh (+15 XP)
 * - Tahap 2: Laboratorium Interaktif (+35 XP)
 * - Tahap 3: Konsep & Aturan Kimia (+20 XP)
 * - Tahap 4: Keterbatasan & Refleksi (+30 XP)
 * Total: 100 XP per Model Atom, Maksimal 600 XP untuk 6 Model Atom (Democritus, Dalton, Thomson, Rutherford, Bohr, Quantum).
 * Menjamin sifat IDEMPOTENT (tidak ada poin ganda jika tahap diulang).
 * Terhubung ke localStorage dan Firebase Cloud Firestore untuk sinkronisasi ke Mode Guru.
 */

import { authService } from '../lib/authService'
import { db, isFirebaseConfigured } from '../lib/firebase'
import { doc, setDoc, getDocs, collection, serverTimestamp, onSnapshot } from 'firebase/firestore'
import { ATOM_MODELS } from '../data/atomModels'

/**
 * Memformat berbagai format tanggal/timestamp Firebase ke waktu standar Indonesia (e.g. "22 Nov 2026, 17:15")
 */
export function formatIndonesianDateTime(dateInput: any): string {
  if (!dateInput) return '-'
  try {
    let d: Date
    if (typeof dateInput === 'object' && dateInput !== null) {
      if (typeof dateInput.toDate === 'function') {
        d = dateInput.toDate()
      } else if (typeof dateInput.seconds === 'number') {
        d = new Date(dateInput.seconds * 1000)
      } else if (dateInput instanceof Date) {
        d = dateInput
      } else {
        d = new Date(dateInput)
      }
    } else if (typeof dateInput === 'number') {
      d = new Date(dateInput)
    } else if (typeof dateInput === 'string') {
      d = new Date(dateInput)
    } else {
      return '-'
    }

    if (isNaN(d.getTime())) return '-'

    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(d).replace(/\./g, ':')
  } catch {
    return '-'
  }
}

export type AtomicStageNumber = 1 | 2 | 3 | 4

export interface StageConfig {
  points: number
  title: string
  subtitle: string
}

export const STAGE_XP_CONFIG: Record<AtomicStageNumber, StageConfig> = {
  1: { points: 15, title: 'Latar Belakang & Tokoh', subtitle: 'Siapa & Masalah Sejarah' },
  2: { points: 35, title: 'Laboratorium Interaktif', subtitle: 'Eksperimen Pembuktian' },
  3: { points: 20, title: 'Konsep & Aturan Kimia', subtitle: 'Postulat & Analogi Model' },
  4: { points: 30, title: 'Keterbatasan & Refleksi', subtitle: 'Evaluasi & Refleksi Konsep' },
}

export const TOTAL_MAX_XP = 600 // 6 model atom x 100 XP
export const XP_PER_MODEL = 100

export interface StageCompletionResult {
  added: boolean
  pointsEarned: number
  newTotalXP: number
  stageNumber: AtomicStageNumber
  stageName: string
  modelId: string
  modelName: string
}

export interface StudentProgressSummary {
  userId: string
  name: string
  email?: string
  alias: string
  classCode: string
  className?: string
  teacherId?: string
  totalXP: number // 0 s.d. 600 XP
  completedStages: string[] // Format: `${modelId}_stage_${stageNumber}`
  completedModelsCount: number // 0 s.d. 6 model
  lastCompletedAt: string
  quizScore: number | null // Skor Uji Konsep (0 s.d. 100)
  quizAttemptId?: string | null
  quizCompletedAt?: string | null
  quizStatus?: 'terkirim' | 'lokal' | 'belum kuis' | 'gagal'
}

type ProgressListener = (progress: StudentProgressSummary) => void

const CLASS_REGISTRY_KEY = 'atomlab_class_students_progress'

// Data bawaan kelas untuk referensi awal pemantauan guru
const DEFAULT_CLASS_STUDENTS: StudentProgressSummary[] = [
  {
    userId: 'usr_demo_student_01',
    name: 'Budi Santoso',
    email: 'siswa@atomlab.sch.id',
    alias: 'Budi Santoso (KIM-X-FASE-E)',
    classCode: 'KIM-X-FASE-E',
    totalXP: 450,
    completedStages: [
      'democritus_stage_1', 'democritus_stage_2', 'democritus_stage_3', 'democritus_stage_4',
      'dalton_stage_1', 'dalton_stage_2', 'dalton_stage_3', 'dalton_stage_4',
      'thomson_stage_1', 'thomson_stage_2', 'thomson_stage_3', 'thomson_stage_4',
      'rutherford_stage_1', 'rutherford_stage_2', 'rutherford_stage_3', 'rutherford_stage_4',
      'bohr_stage_1', 'bohr_stage_2'
    ],
    completedModelsCount: 4,
    lastCompletedAt: '2026-01-15T09:30:00.000Z',
    quizScore: 88,
    quizAttemptId: 'ATT-2026-BUDI',
    quizCompletedAt: '2026-01-15T10:15:00.000Z',
    quizStatus: 'terkirim'
  },
  {
    userId: 'usr_mock_siti',
    name: 'Siti Rahmawati',
    email: 'siti.rahma@sekolah.sch.id',
    alias: 'Siti Rahmawati (KIM-X-FASE-E)',
    classCode: 'KIM-X-FASE-E',
    totalXP: 600,
    completedStages: [
      'democritus_stage_1', 'democritus_stage_2', 'democritus_stage_3', 'democritus_stage_4',
      'dalton_stage_1', 'dalton_stage_2', 'dalton_stage_3', 'dalton_stage_4',
      'thomson_stage_1', 'thomson_stage_2', 'thomson_stage_3', 'thomson_stage_4',
      'rutherford_stage_1', 'rutherford_stage_2', 'rutherford_stage_3', 'rutherford_stage_4',
      'bohr_stage_1', 'bohr_stage_2', 'bohr_stage_3', 'bohr_stage_4',
      'quantum_stage_1', 'quantum_stage_2', 'quantum_stage_3', 'quantum_stage_4'
    ],
    completedModelsCount: 6,
    lastCompletedAt: '2026-01-16T11:45:00.000Z',
    quizScore: 96,
    quizAttemptId: 'ATT-2026-SITI',
    quizCompletedAt: '2026-01-16T12:30:00.000Z',
    quizStatus: 'terkirim'
  },
  {
    userId: 'usr_mock_ahmad',
    name: 'Ahmad Fauzi',
    email: 'ahmad.fauzi@sekolah.sch.id',
    alias: 'Ahmad Fauzi (KIM-X-FASE-E)',
    classCode: 'KIM-X-FASE-E',
    totalXP: 270,
    completedStages: [
      'democritus_stage_1', 'democritus_stage_2', 'democritus_stage_3', 'democritus_stage_4',
      'dalton_stage_1', 'dalton_stage_2', 'dalton_stage_3', 'dalton_stage_4',
      'thomson_stage_1', 'thomson_stage_2', 'thomson_stage_3'
    ],
    completedModelsCount: 2,
    lastCompletedAt: '2026-01-16T08:20:00.000Z',
    quizScore: 72,
    quizAttemptId: 'ATT-2026-AHMAD',
    quizCompletedAt: '2026-01-16T09:00:00.000Z',
    quizStatus: 'terkirim'
  },
  {
    userId: 'usr_mock_dewi',
    name: 'Dewi Anggraini',
    email: 'dewi.ang@sekolah.sch.id',
    alias: 'Dewi Anggraini (KIM-X-FASE-E)',
    classCode: 'KIM-X-FASE-E',
    totalXP: 100,
    completedStages: [
      'democritus_stage_1', 'democritus_stage_2', 'democritus_stage_3', 'democritus_stage_4'
    ],
    completedModelsCount: 1,
    lastCompletedAt: '2026-01-14T14:10:00.000Z',
    quizScore: null,
    quizStatus: 'belum kuis'
  }
]

class LearningProgressService {
  private listeners: Set<ProgressListener> = new Set()

  public getStageKey(modelId: string, stage: AtomicStageNumber): string {
    return `${modelId}_stage_${stage}`
  }

  private getStorageKey(): string {
    const accountId = authService.getActiveAccountId()
    return `atomlab_acc_${accountId}_learning_progress`
  }

  /**
   * Menghitung total XP secara deterministik dari daftar stage yang unik (0 - 600 XP)
   */
  public calculateTotalXP(completedStages: string[]): number {
    const uniqueStages = Array.from(new Set(completedStages))
    let total = 0

    for (const key of uniqueStages) {
      if (key.endsWith('_stage_1')) total += STAGE_XP_CONFIG[1].points
      else if (key.endsWith('_stage_2')) total += STAGE_XP_CONFIG[2].points
      else if (key.endsWith('_stage_3')) total += STAGE_XP_CONFIG[3].points
      else if (key.endsWith('_stage_4')) total += STAGE_XP_CONFIG[4].points
    }

    return Math.min(TOTAL_MAX_XP, total)
  }

  /**
   * Menghitung jumlah model yang seluruh 4 tahapnya sudah tuntas
   */
  public countCompletedModels(completedStages: string[]): number {
    const set = new Set(completedStages)
    let count = 0

    for (const model of ATOM_MODELS) {
      const has1 = set.has(`${model.id}_stage_1`)
      const has2 = set.has(`${model.id}_stage_2`)
      const has3 = set.has(`${model.id}_stage_3`)
      const has4 = set.has(`${model.id}_stage_4`)
      if (has1 && has2 && has3 && has4) {
        count++
      }
    }

    return count
  }

  /**
   * Memuat progres akun aktif dari ruang penyimpanan terpartisi
   */
  public loadCurrentProgress(): StudentProgressSummary {
    const userAccess = authService.getAccess()
    const defaultData: StudentProgressSummary = {
      userId: userAccess.userId,
      name: userAccess.name,
      email: userAccess.email,
      alias: userAccess.alias,
      classCode: userAccess.classCode || 'KIM-X-FASE-E',
      className: userAccess.className,
      teacherId: userAccess.teacherId,
      totalXP: 0,
      completedStages: [],
      completedModelsCount: 0,
      lastCompletedAt: new Date().toISOString(),
      quizScore: null,
      quizStatus: 'belum kuis',
    }

    if (typeof window === 'undefined') return defaultData

    try {
      const raw = window.localStorage.getItem(this.getStorageKey())
      if (raw) {
        const parsed = JSON.parse(raw) as StudentProgressSummary
        if (parsed && Array.isArray(parsed.completedStages)) {
          // Re-hitung XP untuk integritas data
          parsed.totalXP = this.calculateTotalXP(parsed.completedStages)
          parsed.completedModelsCount = this.countCompletedModels(parsed.completedStages)
          parsed.name = userAccess.name
          parsed.alias = userAccess.alias
          parsed.classCode = userAccess.classCode || 'KIM-X-FASE-E'
          parsed.className = userAccess.className || parsed.className
          parsed.teacherId = userAccess.teacherId || parsed.teacherId
          return parsed
        }
      }
    } catch {
      // Fallback
    }

    return defaultData
  }

  /**
   * Menyimpan progres belajar siswa aktif secara lokal dan tersinkronkan
   */
  public saveCurrentProgress(progress: StudentProgressSummary): void {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(this.getStorageKey(), JSON.stringify(progress))
    } catch {
      // Memory fallback
    }
  }

  /**
   * Memberikan poin otomatis pada penyelesaian tahap model atom (IDEMPOTENT).
   * Mengembalikan hasil penambahan poin (added: true jika baru pertama tuntas).
   */
  public awardStagePoints(
    modelId: string,
    stage: AtomicStageNumber,
    modelName: string
  ): StageCompletionResult {
    const stageKey = this.getStageKey(modelId, stage)
    const current = this.loadCurrentProgress()

    // 1. Validasi Idempotensi: jika tahap sudah tercatat, jangan tambah poin ganda
    if (current.completedStages.includes(stageKey)) {
      return {
        added: false,
        pointsEarned: 0,
        newTotalXP: current.totalXP,
        stageNumber: stage,
        stageName: STAGE_XP_CONFIG[stage].title,
        modelId,
        modelName,
      }
    }

    // 2. Tambahkan tahap baru
    const updatedStages = [...current.completedStages, stageKey]
    const pointsEarned = STAGE_XP_CONFIG[stage].points
    const newTotalXP = this.calculateTotalXP(updatedStages)
    const completedModelsCount = this.countCompletedModels(updatedStages)

    const updatedProgress: StudentProgressSummary = {
      ...current,
      completedStages: updatedStages,
      totalXP: newTotalXP,
      completedModelsCount,
      lastCompletedAt: new Date().toISOString(),
    }

    // 3. Simpan secara lokal
    this.saveCurrentProgress(updatedProgress)

    // 4. Sinkronkan ke daftar kelas untuk Mode Guru
    this.syncToClassRegistry(updatedProgress)

    // 5. Sinkronkan ke Firebase Cloud Firestore jika terhubung
    this.syncToFirebase(updatedProgress)

    // 6. Beritahu listener UI
    this.notifyListeners(updatedProgress)

    return {
      added: true,
      pointsEarned,
      newTotalXP,
      stageNumber: stage,
      stageName: STAGE_XP_CONFIG[stage].title,
      modelId,
      modelName,
    }
  }

  /**
   * Memperbarui skor kuis evaluasi 25 soal di progres belajar siswa
   * Default status kuis adalah 'lokal' sampai benar-benar berhasil disinkronkan ke server riset
   */
  public updateQuizScore(score: number, attemptId: string, status: 'terkirim' | 'lokal' | 'gagal' = 'lokal'): void {
    const current = this.loadCurrentProgress()
    const updated: StudentProgressSummary = {
      ...current,
      quizScore: score,
      quizAttemptId: attemptId,
      quizCompletedAt: new Date().toISOString(),
      quizStatus: status,
    }

    this.saveCurrentProgress(updated)
    this.syncToClassRegistry(updated)
    this.syncToFirebase(updated)
    this.notifyListeners(updated)
  }

  /**
   * Memperbarui status pengiriman kuis siswa (terkirim / lokal / gagal)
   */
  public updateQuizStatus(status: 'terkirim' | 'lokal' | 'gagal'): void {
    const current = this.loadCurrentProgress()
    if (current.quizStatus === status) return
    const updated: StudentProgressSummary = {
      ...current,
      quizStatus: status,
    }

    this.saveCurrentProgress(updated)
    this.syncToClassRegistry(updated)
    this.syncToFirebase(updated)
    this.notifyListeners(updated)
  }

  /**
   * Mereset data progres evaluasi kuis siswa saat seluruh riwayat kuis perangkat dihapus
   */
  public resetQuizProgress(): void {
    const current = this.loadCurrentProgress()
    const updated: StudentProgressSummary = {
      ...current,
      quizScore: null,
      quizAttemptId: null,
      quizCompletedAt: null,
      quizStatus: 'belum kuis',
    }

    this.saveCurrentProgress(updated)
    this.syncToClassRegistry(updated)
    this.syncToFirebase(updated)
    this.notifyListeners(updated)
  }

  /**
   * Menyimpan ke registri kelas lokal untuk diakses Mode Guru
   */
  public syncToClassRegistry(student: StudentProgressSummary): void {
    if (typeof window === 'undefined') return
    try {
      const all = this.getAllStudentsProgress()
      const existingIdx = all.findIndex((s) => s.userId === student.userId)

      if (existingIdx >= 0) {
        all[existingIdx] = { ...all[existingIdx], ...student }
      } else {
        all.unshift(student)
      }

      window.localStorage.setItem(CLASS_REGISTRY_KEY, JSON.stringify(all))
    } catch {
      // ignore
    }
  }

  /**
   * Mengambil seluruh data progres siswa kelas untuk ditampilkan pada Mode Guru
   */
  public getAllStudentsProgress(): StudentProgressSummary[] {
    let list: StudentProgressSummary[] = []

    if (typeof window !== 'undefined') {
      try {
        const raw = window.localStorage.getItem(CLASS_REGISTRY_KEY)
        if (raw) {
          const parsed = JSON.parse(raw)
          if (Array.isArray(parsed) && parsed.length > 0) {
            list = parsed
          }
        }
      } catch {
        // fallback
      }
    }

    // Gabungkan dengan default siswa jika registri masih sedikit
    if (list.length === 0) {
      list = [...DEFAULT_CLASS_STUDENTS]
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(CLASS_REGISTRY_KEY, JSON.stringify(list))
        } catch {
          // ignore
        }
      }
    } else {
      // Pastikan demo siswa tetap ada untuk kelengkapan tampilan tabel kelas
      for (const def of DEFAULT_CLASS_STUDENTS) {
        if (!list.some((s) => s.userId === def.userId)) {
          list.push(def)
        }
      }
    }

    // Pastikan siswa aktif saat ini selalu ada di daftar teratas
    const current = this.loadCurrentProgress()
    const currentIdx = list.findIndex((s) => s.userId === current.userId)
    if (currentIdx >= 0) {
      list[currentIdx] = { ...list[currentIdx], ...current }
    } else if (current.totalXP > 0 || current.quizScore !== null) {
      list.unshift(current)
    }

    return list
  }

  /**
   * Sinkronisasi data ke Firebase Cloud Firestore jika terkonfigurasi
   */
  public async syncToFirebase(progress: StudentProgressSummary): Promise<void> {
    if (!isFirebaseConfigured() || !db) return

    try {
      const docRef = doc(db, 'student_learning_progress', progress.userId)
      await setDoc(
        docRef,
        {
          userId: progress.userId,
          name: progress.name,
          email: progress.email || '',
          alias: progress.alias,
          classCode: progress.classCode,
          className: progress.className || null,
          teacherId: progress.teacherId || null,
          totalXP: progress.totalXP,
          completedStages: progress.completedStages,
          completedModelsCount: progress.completedModelsCount,
          lastCompletedAt: progress.lastCompletedAt,
          quizScore: progress.quizScore,
          quizAttemptId: progress.quizAttemptId || null,
          quizCompletedAt: progress.quizCompletedAt || null,
          firebaseRecordedAt: serverTimestamp(),
        },
        { merge: true }
      )
    } catch (err) {
      console.warn('[Firebase] Sinkronisasi progres belajar ke Firestore ditunda/offline:', err)
    }
  }

  /**
   * Memuat data progres lengkap seluruh siswa langsung dari Firebase (Firestore) untuk Mode Guru.
   * Menggabungkan koleksi 'student_learning_progress', 'users', dan 'quiz_submissions',
   * serta menangani dengan aman field yang belum lengkap pada akun siswa.
   */
  public async fetchRemoteProgressForTeacher(): Promise<StudentProgressSummary[]> {
    if (!isFirebaseConfigured() || !db) {
      return this.getAllStudentsProgress()
    }

    try {
      const studentMap = new Map<string, StudentProgressSummary>()

      // 1. Ambil data dari koleksi student_learning_progress
      try {
        const snap = await getDocs(collection(db, 'student_learning_progress'))
        snap.forEach((d: any) => {
          const data = d.data() as any
          const stages: string[] = Array.isArray(data.completedStages) ? data.completedStages : []
          const totalXP = typeof data.totalXP === 'number' && data.totalXP > 0
            ? data.totalXP 
            : this.calculateTotalXP(stages)
          const completedModelsCount = typeof data.completedModelsCount === 'number' && data.completedModelsCount > 0
            ? data.completedModelsCount
            : this.countCompletedModels(stages)

          let lastCompletedAt = new Date().toISOString()
          if (data.lastCompletedAt && typeof data.lastCompletedAt === 'string') {
            lastCompletedAt = data.lastCompletedAt
          } else if (data.firebaseRecordedAt) {
            const dt = typeof data.firebaseRecordedAt.toDate === 'function' 
              ? data.firebaseRecordedAt.toDate() 
              : new Date(data.firebaseRecordedAt.seconds * 1000)
            lastCompletedAt = dt.toISOString()
          }

          const student: StudentProgressSummary = {
            userId: data.userId || d.id,
            name: data.name || data.alias || 'Siswa',
            email: data.email || undefined,
            alias: data.alias || data.name || 'Siswa',
            classCode: data.classCode || 'KIM-X-FASE-E',
            className: data.className || undefined,
            teacherId: data.teacherId || undefined,
            totalXP,
            completedStages: stages,
            completedModelsCount,
            lastCompletedAt,
            quizScore: typeof data.quizScore === 'number' ? data.quizScore : null,
            quizAttemptId: data.quizAttemptId || null,
            quizCompletedAt: data.quizCompletedAt || null,
            quizStatus: typeof data.quizScore === 'number' ? 'terkirim' : 'belum kuis',
          }

          studentMap.set(student.userId, student)
        })
      } catch (err) {
        console.warn('[Firebase] Gagal membaca koleksi student_learning_progress:', err)
      }

      // 2. Ambil dari koleksi users untuk mencatat akun siswa terdaftar yang belum memulai eksplorasi
      try {
        const usersSnap = await getDocs(collection(db, 'users'))
        usersSnap.forEach((ud: any) => {
          const udata = ud.data() as any
          // Lewati akun berstatus guru
          if (udata.role === 'teacher') return

          const uid = ud.id
          if (!studentMap.has(uid)) {
            let userCreatedStr = new Date().toISOString()
            if (udata.createdAt) {
              const dt = typeof udata.createdAt.toDate === 'function'
                ? udata.createdAt.toDate()
                : new Date(udata.createdAt.seconds * 1000)
              userCreatedStr = dt.toISOString()
            }

            studentMap.set(uid, {
              userId: uid,
              name: udata.name || 'Siswa',
              email: udata.email || undefined,
              alias: udata.name || 'Siswa',
              classCode: udata.classCode || 'KIM-X-FASE-E',
              className: udata.className || undefined,
              teacherId: udata.teacherId || undefined,
              totalXP: 0,
              completedStages: [],
              completedModelsCount: 0,
              lastCompletedAt: userCreatedStr,
              quizScore: null,
              quizAttemptId: null,
              quizCompletedAt: null,
              quizStatus: 'belum kuis',
            })
          } else {
            // Lengkapi data jika sebelumnya kosong di student_learning_progress
            const existing = studentMap.get(uid)!
            if (!existing.email && udata.email) existing.email = udata.email
            if ((!existing.name || existing.name === 'Siswa') && udata.name) existing.name = udata.name
            if ((!existing.classCode || existing.classCode === 'KIM-X-FASE-E') && udata.classCode) {
              existing.classCode = udata.classCode
            }
            if (!existing.className && udata.className) existing.className = udata.className
            if (!existing.teacherId && udata.teacherId) existing.teacherId = udata.teacherId
          }
        })
      } catch (err) {
        console.warn('[Firebase] Catatan pembacaan users Firestore:', err)
      }

      // 3. Ambil dari koleksi quiz_submissions untuk melengkapi nilai kuis siswa
      try {
        const quizSnap = await getDocs(collection(db, 'quiz_submissions'))
        quizSnap.forEach((qd: any) => {
          const qdata = qd.data() as any
          const score = typeof qdata.firstAttemptScore === 'number'
            ? qdata.firstAttemptScore
            : typeof qdata.finalScore === 'number'
            ? qdata.finalScore
            : null
          const email = (qdata.studentEmail || '').toLowerCase().trim()
          const name = (qdata.studentName || '').toLowerCase().trim()

          if (score !== null) {
            for (const s of studentMap.values()) {
              const sEmail = (s.email || '').toLowerCase().trim()
              const sName = (s.name || '').toLowerCase().trim()

              if (
                (email && sEmail && sEmail === email) ||
                (name && sName && sName === name) ||
                (qdata.userId && s.userId === qdata.userId)
              ) {
                if (s.quizScore === null || score > (s.quizScore || 0)) {
                  s.quizScore = score
                  s.quizAttemptId = qdata.attemptId || qd.id
                  s.quizCompletedAt = qdata.submittedAt || qdata.clientRecordedAt || new Date().toISOString()
                  s.quizStatus = 'terkirim'
                }
                break
              }
            }
          }
        })
      } catch (err) {
        console.warn('[Firebase] Catatan pembacaan quiz_submissions Firestore:', err)
      }

      // 4. Gabungkan dengan registri lokal/demo
      const remoteList = Array.from(studentMap.values())
      const localList = this.getAllStudentsProgress()

      for (const rem of remoteList) {
        const idx = localList.findIndex((l) => l.userId === rem.userId)
        if (idx >= 0) {
          localList[idx] = { ...localList[idx], ...rem }
        } else {
          localList.push(rem)
        }
      }

      // Perbarui registri lokal agar tetap sinkron jika offline sewaktu-waktu
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(CLASS_REGISTRY_KEY, JSON.stringify(localList))
      }

      return localList
    } catch (err) {
      console.warn('[Firebase] Gagal mengambil progres siswa dari Firestore:', err)
    }

    return this.getAllStudentsProgress()
  }

  /**
   * Berlangganan (Subscribe) perubahan real-time ke koleksi Firestore untuk Mode Guru
   */
  public subscribeToRemoteProgressForTeacher(
    onUpdate: (students: StudentProgressSummary[]) => void
  ): () => void {
    if (!isFirebaseConfigured() || !db) {
      onUpdate(this.getAllStudentsProgress())
      return () => {}
    }

    try {
      const unsub = onSnapshot(
        collection(db, 'student_learning_progress'),
        async () => {
          const freshList = await this.fetchRemoteProgressForTeacher()
          onUpdate(freshList)
        },
        (err: any) => {
          console.warn('[Firebase] Error listener real-time progress siswa:', err)
          onUpdate(this.getAllStudentsProgress())
        }
      )
      return unsub
    } catch {
      return () => {}
    }
  }

  public subscribe(listener: ProgressListener): () => void {
    this.listeners.add(listener)
    listener(this.loadCurrentProgress())
    return () => this.listeners.delete(listener)
  }

  private notifyListeners(progress: StudentProgressSummary): void {
    this.listeners.forEach((listener) => {
      try {
        listener(progress)
      } catch {
        // ignore
      }
    })
  }

  public isStageCompleted(modelId: string, stage: AtomicStageNumber): boolean {
    const current = this.loadCurrentProgress()
    return current.completedStages.includes(this.getStageKey(modelId, stage))
  }

  public getModelCompletedStages(modelId: string): AtomicStageNumber[] {
    const current = this.loadCurrentProgress()
    const result: AtomicStageNumber[] = []
    for (let s = 1; s <= 4; s++) {
      if (current.completedStages.includes(this.getStageKey(modelId, s as AtomicStageNumber))) {
        result.push(s as AtomicStageNumber)
      }
    }
    return result
  }
}

export const learningProgressService = new LearningProgressService()
