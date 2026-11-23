/**
 * LEARNING CONTENT SERVICE
 * Mengelola penyimpanan materi (Model Atom) dan soal kuis secara persisten.
 * Mendukung operasi CRUD mandiri untuk Mode Guru tanpa perlu mengubah kode sumber.
 * Data disimpan secara lokal di browser (localStorage) dan kompatibel dengan data bawaan.
 */

import { ATOM_MODELS } from '../data/atomModels'
import { QUIZ_QUESTIONS, QUESTION_SET_VERSION } from '../data/quizQuestions'
import type { AtomModel } from '../types/atom'
import type { QuizQuestion } from '../types/quiz'

const STORAGE_KEYS = {
  MODELS: 'atomlab_custom_atom_models',
  QUESTIONS: 'atomlab_custom_quiz_questions',
  QUESTIONS_VERSION: 'atomlab_quiz_questions_version',
} as const

type ContentListener<T> = (data: T) => void

class LearningContentService {
  private modelListeners: Set<ContentListener<AtomModel[]>> = new Set()
  private questionListeners: Set<ContentListener<QuizQuestion[]>> = new Set()

  constructor() {
    this.ensureInitialData()
  }

  private isStorageAvailable(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
  }

  /**
   * Memastikan data bawaan terinisialisasi di penyimpanan
   */
  private ensureInitialData(): void {
    if (!this.isStorageAvailable()) return

    try {
      if (!window.localStorage.getItem(STORAGE_KEYS.MODELS)) {
        window.localStorage.setItem(STORAGE_KEYS.MODELS, JSON.stringify(ATOM_MODELS))
      }
      
      const storedQuestionsRaw = window.localStorage.getItem(STORAGE_KEYS.QUESTIONS)
      const storedVersion = window.localStorage.getItem(STORAGE_KEYS.QUESTIONS_VERSION)

      // Jika belum ada soal atau data soal lama masih berisi 10 soal standar awal tanpa versi 25 soal
      if (!storedQuestionsRaw) {
        window.localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(QUIZ_QUESTIONS))
        window.localStorage.setItem(STORAGE_KEYS.QUESTIONS_VERSION, QUESTION_SET_VERSION)
      } else {
        try {
          const parsed = JSON.parse(storedQuestionsRaw)
          // Jika soal di localStorage masih versi lama (misal 10 soal) dan belum pernah diedit secara khusus
          if (Array.isArray(parsed) && parsed.length < QUIZ_QUESTIONS.length && !storedVersion) {
            window.localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(QUIZ_QUESTIONS))
            window.localStorage.setItem(STORAGE_KEYS.QUESTIONS_VERSION, QUESTION_SET_VERSION)
          } else if (!storedVersion) {
            window.localStorage.setItem(STORAGE_KEYS.QUESTIONS_VERSION, QUESTION_SET_VERSION)
          }
        } catch {
          window.localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(QUIZ_QUESTIONS))
          window.localStorage.setItem(STORAGE_KEYS.QUESTIONS_VERSION, QUESTION_SET_VERSION)
        }
      }
    } catch {
      // In-memory fallback
    }
  }

  // =========================================================================
  // 1. MANAJEMEN MATERI PEMBELAJARAN (ATOM MODELS)
  // =========================================================================

  /**
   * Mengambil seluruh materi model atom (termasuk hasil kreasi/revisi guru)
   */
  public getAtomModels(): AtomModel[] {
    if (!this.isStorageAvailable()) return ATOM_MODELS

    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.MODELS)
      if (raw) {
        const parsed = JSON.parse(raw) as AtomModel[]
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
        }
      }
    } catch {
      // Fallback ke data bawaan jika format rusak
    }

    return ATOM_MODELS
  }

  /**
   * Mengambil satu materi berdasarkan ID
   */
  public getAtomModelById(id: string): AtomModel | undefined {
    return this.getAtomModels().find((m) => m.id === id)
  }

  /**
   * Menyimpan (Create / Update) materi model atom
   */
  public saveAtomModel(model: AtomModel): void {
    const models = this.getAtomModels()
    const index = models.findIndex((m) => m.id === model.id)

    if (index >= 0) {
      // Update data yang sudah ada
      models[index] = { ...models[index], ...model }
    } else {
      // Tambah materi baru
      models.push(model)
    }

    if (this.isStorageAvailable()) {
      try {
        window.localStorage.setItem(STORAGE_KEYS.MODELS, JSON.stringify(models))
      } catch (err) {
        console.error('Gagal menyimpan materi ke localStorage:', err)
      }
    }

    this.notifyModelListeners(models)
  }

  /**
   * Menghapus materi model atom berdasarkan ID
   */
  public deleteAtomModel(id: string): { success: boolean; error?: string } {
    const models = this.getAtomModels()
    if (models.length <= 1) {
      return {
        success: false,
        error: 'Tidak dapat menghapus. Setidaknya harus tersisa 1 materi pembelajaran di web.',
      }
    }

    const filtered = models.filter((m) => m.id !== id)
    if (filtered.length === models.length) {
      return { success: false, error: 'Materi tidak ditemukan.' }
    }

    if (this.isStorageAvailable()) {
      try {
        window.localStorage.setItem(STORAGE_KEYS.MODELS, JSON.stringify(filtered))
      } catch (err) {
        console.error('Gagal menghapus materi dari localStorage:', err)
      }
    }

    this.notifyModelListeners(filtered)
    return { success: true }
  }

  /**
   * Mengembalikan materi ke data bawaan kurikulum
   */
  public resetAtomModelsToDefault(): void {
    if (this.isStorageAvailable()) {
      try {
        window.localStorage.setItem(STORAGE_KEYS.MODELS, JSON.stringify(ATOM_MODELS))
      } catch {
        // Fallback
      }
    }
    this.notifyModelListeners(ATOM_MODELS)
  }

  /**
   * Berlangganan (subscribe) pada perubahan data materi
   */
  public subscribeModels(listener: ContentListener<AtomModel[]>): () => void {
    this.modelListeners.add(listener)
    listener(this.getAtomModels())
    return () => {
      this.modelListeners.delete(listener)
    }
  }

  private notifyModelListeners(data: AtomModel[]): void {
    for (const listener of this.modelListeners) {
      try {
        listener(data)
      } catch {
        // Abaikan error pada subscriber
      }
    }
  }

  // =========================================================================
  // 2. MANAJEMEN SOAL KUIS (QUIZ QUESTIONS)
  // =========================================================================

  /**
   * Mengambil versi bank soal saat ini (termasuk tag revisi jika diedit)
   */
  public getQuestionVersion(): string {
    if (!this.isStorageAvailable()) return QUESTION_SET_VERSION
    return window.localStorage.getItem(STORAGE_KEYS.QUESTIONS_VERSION) || QUESTION_SET_VERSION
  }

  /**
   * Memperbarui nomor versi soal saat terjadi perubahan (tambah/edit/hapus)
   */
  private bumpQuestionVersion(): string {
    const currentVer = this.getQuestionVersion()
    const nowTimestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase()
    const newVersion = `${currentVer.split('-rev')[0]}-rev-${nowTimestamp}-${randomSuffix}`

    if (this.isStorageAvailable()) {
      try {
        window.localStorage.setItem(STORAGE_KEYS.QUESTIONS_VERSION, newVersion)
      } catch {
        // Fallback
      }
    }
    return newVersion
  }

  /**
   * Mengambil seluruh soal kuis (termasuk hasil kreasi/revisi guru)
   */
  public getQuizQuestions(): QuizQuestion[] {
    if (!this.isStorageAvailable()) return QUIZ_QUESTIONS

    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.QUESTIONS)
      if (raw) {
        const parsed = JSON.parse(raw) as QuizQuestion[]
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
        }
      }
    } catch {
      // Fallback
    }

    return QUIZ_QUESTIONS
  }

  /**
   * Mengambil soal kuis berdasarkan ID angka
   */
  public getQuizQuestionById(id: number): QuizQuestion | undefined {
    return this.getQuizQuestions().find((q) => q.id === id)
  }

  /**
   * Menyimpan (Create / Update) soal kuis
   */
  public saveQuizQuestion(question: QuizQuestion): void {
    const questions = this.getQuizQuestions()
    const index = questions.findIndex((q) => q.id === question.id)

    if (index >= 0) {
      questions[index] = { ...questions[index], ...question }
    } else {
      // Buat ID baru jika belum ada
      if (!question.id) {
        const maxId = questions.reduce((max, q) => Math.max(max, q.id), 0)
        question.id = maxId + 1
      }
      questions.push(question)
    }

    if (this.isStorageAvailable()) {
      try {
        window.localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions))
      } catch (err) {
        console.error('Gagal menyimpan soal ke localStorage:', err)
      }
    }

    this.bumpQuestionVersion()
    this.notifyQuestionListeners(questions)
  }

  /**
   * Menghapus butir soal kuis berdasarkan ID
   */
  public deleteQuizQuestion(id: number): { success: boolean; error?: string } {
    const questions = this.getQuizQuestions()
    if (questions.length <= 1) {
      return {
        success: false,
        error: 'Tidak dapat menghapus. Setidaknya harus tersisa 1 soal kuis pada sistem evaluasi.',
      }
    }

    const filtered = questions.filter((q) => q.id !== id)
    if (filtered.length === questions.length) {
      return { success: false, error: 'Soal tidak ditemukan.' }
    }

    if (this.isStorageAvailable()) {
      try {
        window.localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(filtered))
      } catch (err) {
        console.error('Gagal menghapus soal dari localStorage:', err)
      }
    }

    this.bumpQuestionVersion()
    this.notifyQuestionListeners(filtered)
    return { success: true }
  }

  /**
   * Mengembalikan seluruh soal kuis ke bank soal bawaan
   */
  public resetQuizQuestionsToDefault(): void {
    if (this.isStorageAvailable()) {
      try {
        window.localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(QUIZ_QUESTIONS))
        window.localStorage.setItem(STORAGE_KEYS.QUESTIONS_VERSION, QUESTION_SET_VERSION)
      } catch {
        // Fallback
      }
    }
    this.notifyQuestionListeners(QUIZ_QUESTIONS)
  }

  /**
   * Berlangganan (subscribe) pada perubahan data soal
   */
  public subscribeQuestions(listener: ContentListener<QuizQuestion[]>): () => void {
    this.questionListeners.add(listener)
    listener(this.getQuizQuestions())
    return () => {
      this.questionListeners.delete(listener)
    }
  }

  private notifyQuestionListeners(data: QuizQuestion[]): void {
    for (const listener of this.questionListeners) {
      try {
        listener(data)
      } catch {
        // Abaikan error pada subscriber
      }
    }
  }
}

export const learningContentService = new LearningContentService()
