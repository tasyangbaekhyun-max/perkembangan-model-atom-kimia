import { useState, useEffect, useCallback } from 'react'
import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  MoveUp,
  MoveDown,
  GripVertical,
  Lock,
  Lightbulb,
  Compass,
  Check,
  ShieldAlert,
  Database,
  Trash2,
  HelpCircle,
  Keyboard,
  UserCheck,
  History,
  X
} from 'lucide-react'
import { QUIZ_QUESTIONS, QUESTION_SET_VERSION } from '../../data/quizQuestions'
import type {
  DragDropOrderQuestion,
  QuizAttemptSession,
  FinalScoreHistory,
  ItemResponseRecord,
} from '../../types/quiz'
import {
  loadActiveSession,
  saveActiveSession,
  saveFinalScoreToHistory,
  loadFinalScoreHistory,
  resetCurrentAttemptDraftOnly,
  startNewAttemptWithNewId,
  clearAllDeviceHistory,
  getStorageHealthStatus,
} from '../../services/quizStorage'
import { Bab4ApiService } from '../../services/bab4ApiService'
import type { Bab4QuizSubmissionPayload } from '../../types/bab4Contract'

interface QuizWorkspaceProps {
  onBackToHome?: () => void
  embedded?: boolean
}

export function QuizWorkspace({ onBackToHome, embedded = false }: QuizWorkspaceProps) {
  // Sesi Aktif Kuis (Lampiran B)
  const [session, setSession] = useState<QuizAttemptSession>(() => {
    const loaded = loadActiveSession()
    return loaded.data!
  })

  // Riwayat Skor Akhir (Lampiran B)
  const [scoreHistory, setScoreHistory] = useState<FinalScoreHistory[]>(() => {
    const hist = loadFinalScoreHistory()
    return hist.data || []
  })

  // Status Kesehatan Penyimpanan
  const [storageWarning, setStorageWarning] = useState<string | null>(() => {
    const status = getStorageHealthStatus()
    return status.errorMessage
  })

  // State Dialog Modal
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false)
  const [showResetDraftModal, setShowResetDraftModal] = useState<boolean>(false)
  const [showClearHistoryModal, setShowClearHistoryModal] = useState<boolean>(false)
  const [showBab4PayloadModal, setShowBab4PayloadModal] = useState<boolean>(false)
  const [bab4SyncStatus, setBab4SyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle')
  const [bab4SyncMessage, setBab4SyncMessage] = useState<string>('')

  // Selected item for click-to-move in Drag and Drop (Mobile-friendly)
  const [selectedDragItem, setSelectedDragItem] = useState<string | null>(null)

  const currentQuestionIndex = session.currentQuestionIndex
  const currentQ = QUIZ_QUESTIONS[currentQuestionIndex]
  const totalQuestions = QUIZ_QUESTIONS.length

  const currentAnswer = session.draftAnswers[currentQ.id]
  const currentResponse: ItemResponseRecord | undefined = session.itemResponses[currentQ.id]
  const isQuestionFrozen = !!session.frozenQuestions[currentQ.id]
  const isCurrentCorrect = currentResponse?.isCorrect ?? false
  const currentAttempts = currentResponse?.attemptsCount ?? 0

  // Sinkronisasi penyimpanan saat sesi berubah
  const updateSession = useCallback((updater: (prev: QuizAttemptSession) => QuizAttemptSession) => {
    setSession((prev) => {
      const next = updater(prev)
      const saveResult = saveActiveSession(next)
      if (!saveResult.success) {
        setStorageWarning(saveResult.error || 'Penyimpanan lokal gagal disimpan.')
      } else {
        setStorageWarning(null)
      }
      return next
    })
  }, [])

  // Memeriksa apakah opsi jawaban sudah dipilih dan valid untuk dikirim
  const hasSelectedAnswer = useCallback((): boolean => {
    const ans = session.draftAnswers[currentQ.id]
    if (ans === undefined || ans === null) return false

    if (currentQ.type === 'multiple_choice') {
      return typeof ans === 'number'
    }
    if (currentQ.type === 'matching') {
      return Object.keys(ans).length === currentQ.pairs.length && Object.values(ans).every((v) => v !== '')
    }
    if (currentQ.type === 'drag_drop_classify') {
      return Object.keys(ans).length === currentQ.items.length
    }
    if (currentQ.type === 'drag_drop_order') {
      return Array.isArray(ans) && ans.length === currentQ.correctOrder.length
    }
    return false
  }, [session.draftAnswers, currentQ])

  // Evaluasi jawaban (Cek Jawaban)
  const handleCheckAnswer = useCallback(() => {
    if (!hasSelectedAnswer() || isQuestionFrozen) return

    const ans = session.draftAnswers[currentQ.id]
    let correct = false

    if (currentQ.type === 'multiple_choice') {
      correct = ans === currentQ.correctAnswer
    } else if (currentQ.type === 'matching') {
      correct = currentQ.pairs.every((p) => ans?.[p.id] === p.right)
    } else if (currentQ.type === 'drag_drop_classify') {
      correct = currentQ.items.every((item) => ans?.[item.id] === item.targetCategoryId)
    } else if (currentQ.type === 'drag_drop_order') {
      correct = currentQ.correctOrder.every((item, idx) => ans?.[idx] === item.id)
    }

    const existingRecord = session.itemResponses[currentQ.id]
    const attemptsCount = (existingRecord?.attemptsCount ?? 0) + 1
    const isFirstAttempt = attemptsCount === 1

    const newRecord: ItemResponseRecord = {
      questionId: currentQ.id,
      questionType: currentQ.type,
      firstAnswer: isFirstAttempt ? ans : existingRecord?.firstAnswer ?? ans,
      finalAnswer: ans,
      attemptsCount,
      isCorrect: correct,
      firstAttemptCorrect: isFirstAttempt ? correct : (existingRecord?.firstAttemptCorrect ?? false),
      submittedAt: new Date().toISOString(),
    }

    updateSession((prev) => {
      const updatedResponses = {
        ...prev.itemResponses,
        [currentQ.id]: newRecord,
      }

      // Hitung ulang skor
      const correctFirstCount = Object.values(updatedResponses).filter((r) => r.firstAttemptCorrect).length
      const correctFinalCount = Object.values(updatedResponses).filter((r) => r.isCorrect).length
      const firstScore = Math.round((correctFirstCount / totalQuestions) * 100)
      const masteryScore = Math.round((correctFinalCount / totalQuestions) * 100)
      const isCompleted = correctFinalCount === totalQuestions

      const nextSession: QuizAttemptSession = {
        ...prev,
        itemResponses: updatedResponses,
        // BEKUKAN JAWABAN DIAGNOSTIK SAAT PEMBAHASAN / EVALUASI DITAMPILKAN
        frozenQuestions: {
          ...prev.frozenQuestions,
          [currentQ.id]: true,
        },
        firstAttemptScore: firstScore,
        masteryScore,
        isCompleted,
        completedAt: isCompleted ? new Date().toISOString() : prev.completedAt,
      }

      // Jika baru saja menyelesaikan seluruh soal, simpan ke riwayat skor final
      if (isCompleted && !prev.isCompleted) {
        const historyItem: FinalScoreHistory = {
          attemptId: prev.attemptId,
          guestSessionId: prev.guestSessionId,
          questionVersion: QUESTION_SET_VERSION,
          completedAt: new Date().toISOString(),
          totalQuestions,
          firstAttemptCorrectCount: correctFirstCount,
          firstAttemptScore: firstScore,
          masteryScore: 100,
          totalAttemptsMade: Object.values(updatedResponses).reduce((sum, r) => sum + r.attemptsCount, 0),
        }
        const histResult = saveFinalScoreToHistory(historyItem)
        if (histResult.data) {
          setScoreHistory(histResult.data)
        }
      }

      return nextSession
    })
  }, [hasSelectedAnswer, isQuestionFrozen, session, currentQ, totalQuestions, updateSession])

  // Membuka pembekuan agar siswa dapat memperbaiki jawaban setelah salah
  const handleUnfreezeToTryAgain = () => {
    updateSession((prev) => ({
      ...prev,
      frozenQuestions: {
        ...prev.frozenQuestions,
        [currentQ.id]: false,
      },
    }))
    setSelectedDragItem(null)
  }

  // Berpindah ke soal berikutnya setelah jawaban benar
  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      updateSession((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }))
      setSelectedDragItem(null)
    }
  }, [currentQuestionIndex, totalQuestions, updateSession])

  // Berpindah ke soal sebelumnya
  const handlePrevQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      updateSession((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
      }))
      setSelectedDragItem(null)
    }
  }, [currentQuestionIndex, updateSession])

  // Cek apakah suatu soal terbuka (unlocked)
  // Soal 0 selalu terbuka. Soal N terbuka jika soal N-1 sudah dijawab benar.
  const isQuestionUnlocked = useCallback((index: number): boolean => {
    if (index === 0) return true
    const previousQuestionId = QUIZ_QUESTIONS[index - 1].id
    return session.itemResponses[previousQuestionId]?.isCorrect ?? false
  }, [session.itemResponses])

  // Handler Pilihan Ganda
  const handleMultipleChoiceSelect = useCallback((optionIndex: number) => {
    if (isQuestionFrozen) return // Terkunci jika beku
    updateSession((prev) => ({
      ...prev,
      draftAnswers: {
        ...prev.draftAnswers,
        [currentQ.id]: optionIndex,
      },
    }))
  }, [isQuestionFrozen, currentQ.id, updateSession])

  // Handler Menjodohkan
  const handleMatchingSelect = (pairId: string, matchedText: string) => {
    if (isQuestionFrozen) return
    updateSession((prev) => {
      const currentMatching = prev.draftAnswers[currentQ.id] || {}
      return {
        ...prev,
        draftAnswers: {
          ...prev.draftAnswers,
          [currentQ.id]: {
            ...currentMatching,
            [pairId]: matchedText,
          },
        },
      }
    })
  }

  // Handler Klasifikasi Drag & Drop
  const handleClassifyItemToCategory = (itemId: string, categoryId: string) => {
    if (isQuestionFrozen) return
    updateSession((prev) => {
      const currentClassify = prev.draftAnswers[currentQ.id] || {}
      return {
        ...prev,
        draftAnswers: {
          ...prev.draftAnswers,
          [currentQ.id]: {
            ...currentClassify,
            [itemId]: categoryId,
          },
        },
      }
    })
    setSelectedDragItem(null)
  }

  // Handler Urutan Drag & Drop
  const handleOrderMove = (index: number, direction: 'up' | 'down') => {
    if (isQuestionFrozen) return
    const orderList: string[] =
      session.draftAnswers[currentQ.id] || (currentQ as DragDropOrderQuestion).correctOrder.map((o) => o.id)
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= orderList.length) return

    const newOrder = [...orderList]
    const temp = newOrder[index]
    newOrder[index] = newOrder[targetIndex]
    newOrder[targetIndex] = temp

    updateSession((prev) => ({
      ...prev,
      draftAnswers: {
        ...prev.draftAnswers,
        [currentQ.id]: newOrder,
      },
    }))
  }

  // Eksekusi Reset Draf Saja
  const confirmResetDraftOnly = () => {
    const result = resetCurrentAttemptDraftOnly(session.attemptId)
    if (result.data) {
      setSession(result.data)
    }
    setShowResetDraftModal(false)
    setSelectedDragItem(null)
  }

  // Eksekusi Mulai Percobaan Ulang dengan ID Baru
  const handleStartNewAttempt = () => {
    const result = startNewAttemptWithNewId()
    if (result.data) {
      setSession(result.data)
    }
    setSelectedDragItem(null)
    setBab4SyncStatus('idle')
  }

  // Eksekusi Hapus Seluruh Riwayat Perangkat
  const confirmClearAllDeviceHistory = () => {
    clearAllDeviceHistory()
    const fresh = startNewAttemptWithNewId()
    if (fresh.data) {
      setSession(fresh.data)
    }
    setScoreHistory([])
    setShowClearHistoryModal(false)
    setSelectedDragItem(null)
  }

  // Simulasi Pengiriman ke Basis Data Riset Bab 4
  const handleSimulateBab4Submission = async () => {
    setBab4SyncStatus('syncing')
    setBab4SyncMessage('Memvalidasi kontrak Bab 4 dan menyinkronkan data...')

    const payload: Bab4QuizSubmissionPayload = {
      submissionId: `SUB-${Date.now()}-${session.guestSessionId.slice(-4)}`,
      attemptId: session.attemptId,
      guestSessionId: session.guestSessionId,
      questionVersion: session.questionVersion,
      totalQuestions,
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
        browserAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
        screenResolution: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : '1920x1080',
        inputMethod: 'mixed',
        storageMode: storageWarning ? 'memoryFallback' : 'localStorage',
      },
    }

    try {
      const res = await Bab4ApiService.submitQuizResults(payload)
      setBab4SyncStatus('synced')
      setBab4SyncMessage(res.message)
      setShowBab4PayloadModal(true)
    } catch (err: any) {
      setBab4SyncStatus('error')
      setBab4SyncMessage(err?.message || 'Gagal mengirimkan berkas riset Bab 4.')
    }
  }

  // Aksesibilitas Keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Abaikan jika modal sedang terbuka atau target adalah input/select
      if (
        showRulesModal ||
        showResetDraftModal ||
        showClearHistoryModal ||
        showBab4PayloadModal ||
        e.target instanceof HTMLSelectElement ||
        e.target instanceof HTMLInputElement
      ) {
        return
      }

      // Tombol A, B, C, D atau 1, 2, 3, 4 untuk pilihan ganda
      if (currentQ.type === 'multiple_choice' && !isQuestionFrozen) {
        const key = e.key.toUpperCase()
        if (key === 'A' || key === '1') handleMultipleChoiceSelect(0)
        else if (key === 'B' || key === '2') handleMultipleChoiceSelect(1)
        else if (key === 'C' || key === '3') handleMultipleChoiceSelect(2)
        else if (key === 'D' || key === '4') handleMultipleChoiceSelect(3)
      }

      // Enter untuk mengirim jawaban
      if (e.key === 'Enter') {
        if (!isQuestionFrozen && hasSelectedAnswer()) {
          e.preventDefault()
          handleCheckAnswer()
        } else if (isCurrentCorrect) {
          e.preventDefault()
          handleNextQuestion()
        }
      }

      // Panah Kiri / Kanan untuk navigasi antar soal yang terbuka
      if (e.key === 'ArrowLeft' && currentQuestionIndex > 0) {
        e.preventDefault()
        handlePrevQuestion()
      } else if (e.key === 'ArrowRight' && isQuestionUnlocked(currentQuestionIndex + 1)) {
        e.preventDefault()
        handleNextQuestion()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    currentQ,
    isQuestionFrozen,
    hasSelectedAnswer,
    isCurrentCorrect,
    currentQuestionIndex,
    showRulesModal,
    showResetDraftModal,
    showClearHistoryModal,
    showBab4PayloadModal,
    handleCheckAnswer,
    handleMultipleChoiceSelect,
    handleNextQuestion,
    handlePrevQuestion,
    isQuestionUnlocked,
  ])

  const completedCorrectCount = Object.values(session.itemResponses).filter((r) => r.isCorrect).length
  const lastScoreHistory = scoreHistory[0]

  return (
    <div className={`flex flex-col ${embedded ? 'gap-4' : 'gap-6'} w-full animate-fade-in`}>
      
      {/* ---------------- 1. TOP HEADER & GUEST WORKSPACE BAR ---------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition border border-slate-200 flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-indigo-600" />
              <span>Kembali</span>
            </button>
          )}

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-black text-slate-900 tracking-tight">
                Uji Pemahaman Konsep (Bimbingan Interaktif)
              </span>
              
              {/* Badge Ruang Tamu / Guest Space */}
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 flex items-center gap-1 shadow-xs">
                <UserCheck className="w-3 h-3 text-indigo-600" />
                <span>Ruang Guest ({session.guestSessionId})</span>
              </span>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                Versi: {session.questionVersion}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium mt-0.5">
              <span>ID Percobaan: <code className="font-bold text-slate-700">{session.attemptId}</code></span>
              <span>•</span>
              <span className="text-emerald-700 font-bold">Tuntas: {completedCorrectCount}/{totalQuestions} Soal</span>
            </div>
          </div>
        </div>

        {/* Action Header Pills */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            onClick={() => setShowRulesModal(true)}
            className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-xs transition border border-indigo-200 shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
            <span>Aturan & Skor</span>
          </button>

          <button
            onClick={() => setShowResetDraftModal(true)}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition border border-slate-200 shadow-xs flex items-center gap-1.5 cursor-pointer"
            title="Reset draf sesi saat ini"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Draf</span>
          </button>

          <button
            onClick={() => setShowClearHistoryModal(true)}
            className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition border border-rose-200 shadow-xs flex items-center gap-1 cursor-pointer"
            title="Hapus riwayat lokal di perangkat ini"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            <span>Hapus Riwayat</span>
          </button>
        </div>
      </div>

      {/* ---------------- 2. STORAGE HEALTH & WARNING NOTICE ---------------- */}
      {storageWarning && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-start gap-2.5 shadow-xs">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold block">Peringatan Penyimpanan Lokal (Lampiran B):</span>
            <p className="text-[11px] leading-relaxed text-amber-900">
              {storageWarning} (Jawaban tetap aman dalam sesi memori aktif ini, namun tidak dapat dipulihkan jika peramban ditutup).
            </p>
          </div>
        </div>
      )}

      {/* ---------------- 3. SKOR TERAKHIR BERBEDA DARI DRAF ---------------- */}
      {lastScoreHistory && !session.isCompleted && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 via-indigo-50/40 to-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-indigo-200 flex items-center justify-center text-indigo-700 font-black text-sm shadow-xs shrink-0">
              <History className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-800">Skor Terakhir Anda di Perangkat Ini</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                  {lastScoreHistory.firstAttemptScore} / 100
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Percobaan: <code className="text-slate-700 font-bold">{lastScoreHistory.attemptId}</code> • Selesai: {new Date(lastScoreHistory.completedAt).toLocaleTimeString('id-ID')}
              </p>
            </div>
          </div>

          <span className="text-[11px] font-semibold text-indigo-700 bg-white px-3 py-1 rounded-xl border border-indigo-100 shadow-xs">
            Draf Baru Aktif: {session.attemptId}
          </span>
        </div>
      )}

      {/* ---------------- 4. COMPLETION CELEBRATION & BAB 4 DATABASE CONTRACT ---------------- */}
      {session.isCompleted && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border-2 border-emerald-300 shadow-md flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 text-3xl font-black shrink-0">
              🏆
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Selamat! Seluruh Soal Telah Tuntas</span>
              <h3 className="text-xl font-black text-slate-900">
                Master Konsep Struktur Model Atom
              </h3>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                  Skor Percobaan Pertama: {session.firstAttemptScore} / 100
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-900 border border-sky-300">
                  Skor Penguasaan Tuntas: 100 / 100
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleSimulateBab4Submission}
              disabled={bab4SyncStatus === 'syncing'}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold text-xs shadow-md shadow-indigo-600/25 flex items-center gap-2 cursor-pointer"
            >
              <Database className="w-4 h-4" />
              <span>{bab4SyncStatus === 'syncing' ? 'Menyinkronkan...' : 'Kirim Basis Data (Bab 4)'}</span>
            </button>

            <button
              onClick={handleStartNewAttempt}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-300 shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Percobaan Baru (ID Baru)</span>
            </button>
          </div>
        </div>
      )}

      {/* ---------------- 5. MASTERY QUESTION PALETTE ---------------- */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
          <span className="flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-indigo-600" />
            <span>Alur Pengerjaan Bertahap (Mastery Flow):</span>
          </span>
          <span className="text-indigo-600 font-semibold text-[11px]">
            Sedang Mengerjakan: Soal {currentQuestionIndex + 1}
          </span>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {QUIZ_QUESTIONS.map((q, idx) => {
            const isCurrent = idx === currentQuestionIndex
            const response = session.itemResponses[q.id]
            const isFrozen = !!session.frozenQuestions[q.id]
            const unlocked = isQuestionUnlocked(idx)

            let badgeStyle = 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
            if (response?.isCorrect) {
              badgeStyle = isCurrent
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs ring-2 ring-emerald-300'
                : 'bg-emerald-50 border-emerald-400 text-emerald-800 font-bold hover:bg-emerald-100 cursor-pointer'
            } else if (isCurrent) {
              badgeStyle = isFrozen && !response?.isCorrect
                ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-300 shadow-xs'
                : 'bg-indigo-600 text-white border-indigo-600 shadow-xs ring-2 ring-indigo-300'
            } else if (unlocked) {
              badgeStyle = 'bg-white border-slate-300 text-slate-700 hover:border-indigo-400 cursor-pointer'
            }

            return (
              <button
                key={q.id}
                disabled={!unlocked}
                onClick={() => {
                  if (unlocked) {
                    updateSession((prev) => ({ ...prev, currentQuestionIndex: idx }))
                    setSelectedDragItem(null)
                  }
                }}
                className={`py-2 rounded-xl text-xs font-bold transition border-2 flex flex-col items-center justify-center ${badgeStyle}`}
              >
                <div className="flex items-center gap-0.5">
                  <span>{idx + 1}</span>
                  {response?.isCorrect && <Check className="w-3 h-3 text-emerald-600" />}
                  {!unlocked && <Lock className="w-2.5 h-2.5 text-slate-400" />}
                </div>
                <span className="text-[9px] font-normal opacity-75">
                  {q.type === 'multiple_choice' ? 'PG' : q.type === 'matching' ? 'Jodoh' : 'Drag'}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ---------------- 6. MAIN ACTIVE QUESTION AREA ---------------- */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 md:p-7 shadow-sm flex flex-col gap-5">
        
        {/* Header Soal & Indikator Beku */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center shadow-xs ${
              isCurrentCorrect
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : isQuestionFrozen && !isCurrentCorrect
                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                : 'bg-indigo-100 text-indigo-700'
            }`}>
              {currentQ.id}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {currentQ.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isQuestionFrozen && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-700" />
                <span>Jawaban Dibekukan</span>
              </span>
            )}
            {currentAttempts > 0 && (
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                Percobaan: {currentAttempts}x
              </span>
            )}
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
              {currentQ.type === 'multiple_choice'
                ? 'Pilihan Ganda'
                : currentQ.type === 'matching'
                ? 'Menjodohkan'
                : 'Drag and Drop'}
            </span>
          </div>
        </div>

        {/* VARIATION 1: PILIHAN GANDA */}
        {currentQ.type === 'multiple_choice' && (
          <div className="flex flex-col gap-4">
            <p className="text-sm md:text-base font-bold text-slate-800 leading-relaxed">
              {currentQ.question}
            </p>

            <div className="space-y-2.5" role="radiogroup" aria-label={currentQ.question}>
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = currentAnswer === optIdx
                const isCorrectOption = optIdx === currentQ.correctAnswer

                let optionStyle = 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                if (isCurrentCorrect) {
                  if (isCorrectOption) optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-xs'
                  else optionStyle = 'bg-white border-slate-200 text-slate-400 opacity-60'
                } else if (isQuestionFrozen && !isCurrentCorrect) {
                  if (isSelected) optionStyle = 'bg-rose-50 border-rose-400 text-rose-950 font-semibold'
                  else optionStyle = 'bg-white border-slate-200 text-slate-700'
                } else if (isSelected) {
                  optionStyle = 'bg-indigo-50 border-indigo-600 text-indigo-950 font-bold shadow-xs ring-2 ring-indigo-200'
                }

                return (
                  <button
                    key={optIdx}
                    role="radio"
                    aria-checked={isSelected}
                    tabIndex={0}
                    onClick={() => handleMultipleChoiceSelect(optIdx)}
                    disabled={isQuestionFrozen}
                    className={`w-full p-4 rounded-2xl text-left text-xs md:text-sm transition border-2 flex items-center justify-between ${
                      isQuestionFrozen ? 'cursor-not-allowed' : 'cursor-pointer'
                    } ${optionStyle}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-300 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="leading-relaxed font-medium">{opt}</span>
                    </div>

                    {isCurrentCorrect && isCorrectOption && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 ml-3" />
                    )}
                    {isQuestionFrozen && !isCurrentCorrect && isSelected && (
                      <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 ml-3" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* VARIATION 2: MENJODOHKAN */}
        {currentQ.type === 'matching' && (
          <div className="flex flex-col gap-4">
            <p className="text-xs md:text-sm font-bold text-slate-800 leading-relaxed bg-indigo-50/70 p-3.5 rounded-2xl border border-indigo-100">
              {currentQ.instruction}
            </p>

            <div className="space-y-3">
              {currentQ.pairs.map((pair, pIdx) => {
                const ansObj = currentAnswer || {}
                const selectedVal = ansObj[pair.id] || ''
                const isPairCorrect = selectedVal === pair.right

                let pairCardStyle = 'bg-slate-50 border-slate-200'
                if (isCurrentCorrect) {
                  pairCardStyle = 'bg-emerald-50/70 border-emerald-300'
                } else if (isQuestionFrozen && !isCurrentCorrect) {
                  pairCardStyle = isPairCorrect
                    ? 'bg-emerald-50/60 border-emerald-300'
                    : 'bg-rose-50/60 border-rose-300'
                }

                return (
                  <div
                    key={pair.id}
                    className={`p-4 rounded-2xl border-2 flex flex-col md:flex-row md:items-center justify-between gap-3 transition ${pairCardStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {pIdx + 1}
                      </span>
                      <span className="text-xs md:text-sm font-black text-slate-800">
                        {pair.left}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <select
                        value={selectedVal}
                        onChange={(e) => handleMatchingSelect(pair.id, e.target.value)}
                        disabled={isQuestionFrozen}
                        className={`w-full md:w-80 p-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          isQuestionFrozen ? 'cursor-not-allowed bg-slate-100' : 'cursor-pointer'
                        }`}
                      >
                        <option value="">-- Pilih Pasangan Penemuan/Analogi --</option>
                        {currentQ.pairs.map((p) => (
                          <option key={p.id} value={p.right}>
                            {p.right}
                          </option>
                        ))}
                      </select>

                      {isQuestionFrozen && (
                        isPairCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        )
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* VARIATION 3: DRAG AND DROP KLASIFIKASI */}
        {currentQ.type === 'drag_drop_classify' && (
          <div className="flex flex-col gap-5">
            <p className="text-xs md:text-sm font-bold text-slate-800 leading-relaxed bg-indigo-50/70 p-3.5 rounded-2xl border border-indigo-100">
              {currentQ.instruction}
            </p>

            {/* Pool kartu yang belum ditempatkan */}
            {!isQuestionFrozen && (
              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col gap-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <GripVertical className="w-3.5 h-3.5 text-slate-500" />
                  Kartu Karakteristik yang Belum Ditempatkan: (Klik kartu, lalu klik wadah tujuan)
                </span>

                <div className="flex flex-wrap gap-2 pt-1">
                  {currentQ.items.map((item) => {
                    const assignedCategoryId = (currentAnswer || {})[item.id]
                    const isSelected = selectedDragItem === item.id
                    if (assignedCategoryId) return null

                    return (
                      <div
                        key={item.id}
                        draggable={!isQuestionFrozen}
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', item.id)
                        }}
                        onClick={() => setSelectedDragItem(isSelected ? null : item.id)}
                        className={`p-3 rounded-xl border-2 text-xs font-semibold transition cursor-grab active:cursor-grabbing flex items-center gap-2 shadow-xs ${
                          isSelected
                            ? 'bg-amber-100 border-amber-500 text-amber-950 ring-2 ring-amber-400 scale-102'
                            : 'bg-white border-slate-300 text-slate-800 hover:border-indigo-400'
                        }`}
                      >
                        <GripVertical className="w-3 h-3 text-slate-400" />
                        <span>{item.text}</span>
                      </div>
                    )
                  })}

                  {currentQ.items.every((item) => (currentAnswer || {})[item.id]) && (
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                      ✓ Seluruh kartu sudah masuk ke wadah. Klik &quot;Kirim Jawaban&quot; di bawah!
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Wadah Kategori */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQ.categories.map((cat) => {
                const ansObj = currentAnswer || {}
                const itemsInThisCat = currentQ.items.filter((item) => ansObj[item.id] === cat.id)

                return (
                  <div
                    key={cat.id}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      if (isQuestionFrozen) return
                      const droppedItemId = e.dataTransfer.getData('text/plain')
                      if (droppedItemId) handleClassifyItemToCategory(droppedItemId, cat.id)
                    }}
                    onClick={() => {
                      if (selectedDragItem && !isQuestionFrozen) {
                        handleClassifyItemToCategory(selectedDragItem, cat.id)
                      }
                    }}
                    className={`p-4 rounded-3xl border-2 ${cat.borderColor} ${cat.bgColor} min-h-[170px] flex flex-col justify-between transition-all duration-200 ${
                      selectedDragItem && !isQuestionFrozen ? 'ring-2 ring-indigo-400 cursor-pointer shadow-md' : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200/60">
                        <h4 className="text-xs font-black text-slate-900">{cat.title}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                          {cat.badge}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {itemsInThisCat.map((item) => {
                          const isItemInRightCategory = item.targetCategoryId === cat.id

                          return (
                            <div
                              key={item.id}
                              className={`p-2.5 rounded-xl text-xs font-medium border flex items-center justify-between shadow-xs ${
                                isCurrentCorrect
                                  ? 'bg-emerald-100/80 border-emerald-400 text-emerald-950 font-semibold'
                                  : isQuestionFrozen && !isCurrentCorrect
                                  ? isItemInRightCategory
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                                    : 'bg-rose-100/90 border-rose-400 text-rose-950 font-bold'
                                  : 'bg-white border-slate-200 text-slate-800'
                              }`}
                            >
                              <span>{item.text}</span>
                              {!isQuestionFrozen && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    updateSession((prev) => {
                                      const updated = { ...(prev.draftAnswers[currentQ.id] || {}) }
                                      delete updated[item.id]
                                      return {
                                        ...prev,
                                        draftAnswers: { ...prev.draftAnswers, [currentQ.id]: updated },
                                      }
                                    })
                                  }}
                                  className="text-[10px] text-rose-600 hover:underline font-bold ml-2 cursor-pointer"
                                >
                                  Lepas
                                </button>
                              )}
                            </div>
                          )
                        })}

                        {itemsInThisCat.length === 0 && (
                          <div className="p-4 text-center text-xs text-slate-400 border border-dashed border-slate-300 rounded-xl">
                            {selectedDragItem
                              ? '👉 Klik di sini untuk meletakkan kartu terpilih'
                              : 'Tarik / klik kartu karakteristik ke wadah ini'}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-500 font-medium pt-2 text-right">
                      Terisi: {itemsInThisCat.length} kartu
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* VARIATION 4: DRAG AND DROP URUTAN */}
        {currentQ.type === 'drag_drop_order' && (
          <div className="flex flex-col gap-4">
            <p className="text-xs md:text-sm font-bold text-slate-800 leading-relaxed bg-indigo-50/70 p-3.5 rounded-2xl border border-indigo-100">
              {currentQ.instruction}
            </p>

            <div className="space-y-2.5">
              {((currentAnswer as string[]) || currentQ.correctOrder.map((o) => o.id)).map((itemId, idx, arr) => {
                const item = currentQ.correctOrder.find((o) => o.id === itemId)
                if (!item) return null
                const isCorrectPosition = currentQ.correctOrder[idx]?.id === itemId

                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3 transition shadow-xs ${
                      isCurrentCorrect
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold'
                        : isQuestionFrozen && !isCurrentCorrect
                        ? isCorrectPosition
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                          : 'bg-rose-50 border-rose-300 text-rose-950'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                        {idx + 1}
                      </span>
                      <div>
                        <h4 className="text-xs md:text-sm font-black text-slate-900">{item.title}</h4>
                        <span className="text-[11px] text-slate-500 font-semibold">{item.period} • {item.scientist}</span>
                      </div>
                    </div>

                    {!isQuestionFrozen ? (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleOrderMove(idx, 'up')}
                          disabled={idx === 0}
                          className={`p-1.5 rounded-lg border text-xs font-bold transition ${
                            idx === 0
                              ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                              : 'bg-white hover:bg-indigo-50 text-indigo-700 border-slate-300 shadow-xs cursor-pointer'
                          }`}
                          title="Geser ke Atas"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOrderMove(idx, 'down')}
                          disabled={idx === arr.length - 1}
                          className={`p-1.5 rounded-lg border text-xs font-bold transition ${
                            idx === arr.length - 1
                              ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                              : 'bg-white hover:bg-indigo-50 text-indigo-700 border-slate-300 shadow-xs cursor-pointer'
                          }`}
                          title="Geser ke Bawah"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ---------------- 7. FEEDBACK & BIMBINGAN JIKA SALAH (MACET DI SOAL) ---------------- */}
        {isQuestionFrozen && !isCurrentCorrect && (
          <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-xs text-rose-950 flex flex-col gap-2.5 shadow-xs animate-fade-in">
            <div className="flex items-center gap-2 font-black text-rose-800 text-sm">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>Jawaban Kamu Belum Tepat! (Jawaban Dibekukan Sementara)</span>
            </div>

            <div className="p-3 bg-white/90 rounded-xl border border-rose-200 flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-900 block mb-0.5">Petunjuk Bimbingan Konseptual:</span>
                <p className="text-slate-700 leading-relaxed font-medium">{currentQ.hint}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
              <span className="text-[11px] text-rose-700 font-semibold">
                ⚠️ Kamu perlu memperbaiki jawaban di soal ini agar dapat melanjutkan ke soal berikutnya!
              </span>
              <button
                onClick={handleUnfreezeToTryAgain}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Buka Pembekuan &amp; Perbaiki Jawaban</span>
              </button>
            </div>
          </div>
        )}

        {/* ---------------- 8. PEMBAHASAN ILMIAH JIKA BENAR ---------------- */}
        {isCurrentCorrect && (
          <div className="p-4.5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-xs text-emerald-950 flex flex-col gap-2.5 shadow-xs animate-fade-in">
            <div className="flex items-center gap-2 font-black text-emerald-800 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>🎉 Luar Biasa, Jawaban Kamu Benar!</span>
            </div>

            <div className="p-3.5 bg-white/90 rounded-xl border border-emerald-200">
              <span className="font-bold text-emerald-900 block mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Pembahasan Ilmiah &amp; Konsep Hakiki:
              </span>
              <p className="text-slate-700 leading-relaxed font-medium">{currentQ.explanation}</p>
            </div>
          </div>
        )}

        {/* ---------------- 9. ACTION FOOTER & ATURAN TOMBOL KIRIM ---------------- */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 mt-2">
          
          {/* Tombol Soal Sebelumnya */}
          <button
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
              currentQuestionIndex === 0
                ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-xs cursor-pointer'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Soal Sebelumnya</span>
          </button>

          {/* Tombol Kirim / Soal Selanjutnya */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            
            {/* SEBELUM JAWABAN DIPILIH: TOMBOL TIDAK BOLEH MENYELESAIKAN SOAL */}
            {!isCurrentCorrect && (
              <button
                onClick={handleCheckAnswer}
                disabled={!hasSelectedAnswer() || isQuestionFrozen}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 shadow-md ${
                  hasSelectedAnswer() && !isQuestionFrozen
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:brightness-105 text-white shadow-indigo-500/25 cursor-pointer'
                    : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed opacity-60'
                }`}
                title={!hasSelectedAnswer() ? 'Pilih jawaban terlebih dahulu' : 'Kirim jawaban'}
              >
                <span>Kirim Jawaban</span>
                <Check className="w-4 h-4" />
              </button>
            )}

            {/* HANYA MUNCUL SETELAH BENAR: "Soal Selanjutnya →" */}
            {isCurrentCorrect && (
              <button
                onClick={handleNextQuestion}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-105 text-white shadow-md shadow-emerald-500/25 transition flex items-center justify-center gap-2 cursor-pointer animate-bounce-short"
              >
                <span>
                  {currentQuestionIndex === totalQuestions - 1
                    ? 'Selesai &amp; Lihat Pencapaian 🏆'
                    : 'Soal Selanjutnya'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

          </div>

        </div>

      </div>

      {/* ---------------- MODAL 1: ATURAN BERPINDAH SOAL & MENGHITUNG SKOR ---------------- */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <h3 className="font-black text-slate-900 text-base">Aturan Kuis &amp; Perhitungan Skor</h3>
              </div>
              <button
                onClick={() => setShowRulesModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
              <div className="p-3 bg-indigo-50/70 rounded-2xl border border-indigo-100">
                <h4 className="font-bold text-indigo-950 mb-1 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-indigo-600" />
                  1. Aturan Berpindah Soal (Mastery Navigation):
                </h4>
                <ul className="list-disc pl-4 space-y-1 text-indigo-900">
                  <li>Soal disajikan bertahap secara kronologis (Soal 1 s.d. 10).</li>
                  <li><strong>Gating Penguasaan:</strong> Soal berikutnya terkunci sampai soal saat ini dijawab dengan benar.</li>
                  <li>Jika jawaban salah, Anda akan <strong>macet di soal</strong> dan dibimbing oleh petunjuk konseptual hingga menemukan jawaban yang tepat.</li>
                  <li>Setelah suatu soal tuntas, Anda bebas kembali ke soal-soal sebelumnya kapan saja untuk membaca ulang pembahasan.</li>
                </ul>
              </div>

              <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-100">
                <h4 className="font-bold text-emerald-950 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  2. Aturan Perhitungan Skor:
                </h4>
                <ul className="list-disc pl-4 space-y-1 text-emerald-900">
                  <li><strong>Skor Percobaan Pertama (First-Attempt Score):</strong> Dihitung murni berdasarkan butir yang langsung dijawab benar pada percobaan ke-1 tanpa bantuan hint (Maksimal 100 poin, 10 poin/butir).</li>
                  <li><strong>Skor Penguasaan Tuntas (Mastery Score):</strong> Mencapai 100 poin penuh setelah seluruh 10 soal berhasil diselesaikan melalui bimbingan interaktif.</li>
                  <li><strong>Pemisahan Skor Akhir:</strong> Saat kuis tuntas, skor terakhir diabadikan ke riwayat perangkat dan tidak tertimpa saat memulai draf latihan baru.</li>
                </ul>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <Keyboard className="w-3.5 h-3.5 text-slate-600" />
                  3. Pintasan Keyboard (Aksesibilitas):
                </h4>
                <p className="text-slate-600">
                  Tekan <kbd className="px-1.5 py-0.5 bg-white border rounded text-[10px] font-mono">A</kbd>/<kbd className="px-1.5 py-0.5 bg-white border rounded text-[10px] font-mono">B</kbd>/<kbd className="px-1.5 py-0.5 bg-white border rounded text-[10px] font-mono">C</kbd>/<kbd className="px-1.5 py-0.5 bg-white border rounded text-[10px] font-mono">D</kbd> untuk memilih opsi, <kbd className="px-1.5 py-0.5 bg-white border rounded text-[10px] font-mono">Enter</kbd> untuk mengirim jawaban, serta tombol panah kiri/kanan untuk berpindah soal.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowRulesModal(false)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md cursor-pointer hover:bg-indigo-700 transition"
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 2: KONFIRMASI RESET DRAF SESI ---------------- */}
      {showResetDraftModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-black text-slate-900 text-base">Reset Draf Sesi Ini?</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Pilihan draf pada sesi percobaan <code>{session.attemptId}</code> akan dikosongkan kembali ke soal pertama. <strong>Riwayat skor yang sudah tuntas sebelumnya tidak akan terhapus.</strong>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setShowResetDraftModal(false)}
                className="py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={confirmResetDraftOnly}
                className="py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md cursor-pointer"
              >
                Ya, Reset Draf
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 3: KONFIRMASI TERPISAH HAPUS RIWAYAT PERANGKAT ---------------- */}
      {showClearHistoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-rose-200 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-black text-slate-900 text-base">Hapus Seluruh Riwayat di Perangkat?</h3>
              <p className="text-xs text-rose-700 leading-relaxed font-medium">
                Tindakan ini akan <strong>menghapus permanen</strong> data sesi guest, skor tersimpan di perangkat ini, dan draf kuis. Sesi baru yang bersih akan dibuat.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setShowClearHistoryModal(false)}
                className="py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={confirmClearAllDeviceHistory}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md cursor-pointer"
              >
                Hapus Seluruh Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 4: PAYLOAD SINKRONISASI BASIS DATA BAB 4 ---------------- */}
      {showBab4PayloadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 flex flex-col gap-4 max-h-[85vh] overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-600" />
                <h3 className="font-black text-slate-900 text-base">Pengiriman Basis Data Riset (Bab 4)</h3>
              </div>
              <button
                onClick={() => setShowBab4PayloadModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{bab4SyncMessage}</span>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-[11px] leading-relaxed">
              <p className="text-slate-400 mb-2">// Payload Kontrak Bab 4 (/api/v1/research/quiz-submissions)</p>
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(
                  {
                    attemptId: session.attemptId,
                    guestSessionId: session.guestSessionId,
                    questionVersion: session.questionVersion,
                    firstAttemptScore: session.firstAttemptScore,
                    masteryScore: session.masteryScore,
                    itemResponsesCount: Object.keys(session.itemResponses).length,
                    itemResponsesSample: Object.values(session.itemResponses).slice(0, 2),
                    status: 'VALIDATED_BAB4_CONTRACT',
                  },
                  null,
                  2
                )}
              </pre>
            </div>

            <button
              onClick={() => setShowBab4PayloadModal(false)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md cursor-pointer hover:bg-indigo-700"
            >
              Tutup Pratinjau Kontrak
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
