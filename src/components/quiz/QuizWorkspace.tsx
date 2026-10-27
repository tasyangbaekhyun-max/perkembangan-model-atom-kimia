import { useState } from 'react'
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
  Check
} from 'lucide-react'
import { QUIZ_QUESTIONS } from '../../data/quizQuestions'
import type {
  DragDropOrderQuestion
} from '../../types/quiz'

interface QuizWorkspaceProps {
  onBackToHome?: () => void
  embedded?: boolean
}

interface QuestionProgress {
  answered: boolean
  isCorrect: boolean
  attempts: number
  checked: boolean
}

export function QuizWorkspace({ onBackToHome, embedded = false }: QuizWorkspaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)
  
  // User answers per question ID
  const [answers, setAnswers] = useState<Record<number, any>>({
    // Initial shuffled state for order question (id: 8)
    8: ['ord_rutherford', 'ord_dalton', 'ord_quantum', 'ord_democritus', 'ord_bohr', 'ord_thomson'],
  })

  // Track progress and check state per question ID
  const [questionProgress, setQuestionProgress] = useState<Record<number, QuestionProgress>>({
    1: { answered: false, isCorrect: false, attempts: 0, checked: false },
    2: { answered: false, isCorrect: false, attempts: 0, checked: false },
    3: { answered: false, isCorrect: false, attempts: 0, checked: false },
    4: { answered: false, isCorrect: false, attempts: 0, checked: false },
    5: { answered: false, isCorrect: false, attempts: 0, checked: false },
    6: { answered: false, isCorrect: false, attempts: 0, checked: false },
    7: { answered: false, isCorrect: false, attempts: 0, checked: false },
    8: { answered: false, isCorrect: false, attempts: 0, checked: false },
    9: { answered: false, isCorrect: false, attempts: 0, checked: false },
    10: { answered: false, isCorrect: false, attempts: 0, checked: false },
  })

  // Selected item for click-to-move in Drag and Drop (Mobile-friendly)
  const [selectedDragItem, setSelectedDragItem] = useState<string | null>(null)

  // Overall completion state
  const [isAllCompleted, setIsAllCompleted] = useState<boolean>(false)

  const currentQ = QUIZ_QUESTIONS[currentQuestionIndex]
  const totalQuestions = QUIZ_QUESTIONS.length
  const currentProg = questionProgress[currentQ.id] || { answered: false, isCorrect: false, attempts: 0, checked: false }

  // Check if current question has an answer ready to be checked
  const hasSelectedAnswer = (): boolean => {
    const ans = answers[currentQ.id]
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
  }

  // Evaluate correctness of the current question
  const checkAnswer = () => {
    const ans = answers[currentQ.id]
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

    setQuestionProgress((prev) => {
      const existing = prev[currentQ.id] || { answered: false, isCorrect: false, attempts: 0, checked: false }
      const updated = {
        answered: true,
        isCorrect: correct,
        attempts: existing.attempts + 1,
        checked: true,
      }
      return {
        ...prev,
        [currentQ.id]: updated,
      }
    })

    // If it's the last question and correct, mark all completed
    if (correct && currentQuestionIndex === totalQuestions - 1) {
      setIsAllCompleted(true)
    }
  }

  // Allow student to retry after incorrect check
  const handleTryAgainOnThisQuestion = () => {
    setQuestionProgress((prev) => ({
      ...prev,
      [currentQ.id]: {
        ...(prev[currentQ.id] || { answered: false, isCorrect: false, attempts: 1, checked: false }),
        checked: false,
      },
    }))
    setSelectedDragItem(null)
  }

  // Move to next question after correct answer
  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setSelectedDragItem(null)
    } else {
      setIsAllCompleted(true)
    }
  }

  // Answer modification handlers
  const handleMultipleChoiceSelect = (optionIndex: number) => {
    if (currentProg.isCorrect) return // Locked once correct
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionIndex,
    }))
  }

  const handleMatchingSelect = (pairId: string, matchedText: string) => {
    if (currentProg.isCorrect) return
    setAnswers((prev) => {
      const currentMatching = prev[currentQ.id] || {}
      return {
        ...prev,
        [currentQ.id]: {
          ...currentMatching,
          [pairId]: matchedText,
        },
      }
    })
  }

  const handleClassifyItemToCategory = (itemId: string, categoryId: string) => {
    if (currentProg.isCorrect) return
    setAnswers((prev) => {
      const currentClassify = prev[currentQ.id] || {}
      return {
        ...prev,
        [currentQ.id]: {
          ...currentClassify,
          [itemId]: categoryId,
        },
      }
    })
    setSelectedDragItem(null)
  }

  const handleOrderMove = (index: number, direction: 'up' | 'down') => {
    if (currentProg.isCorrect) return
    const orderList: string[] = answers[currentQ.id] || (currentQ as DragDropOrderQuestion).correctOrder.map((o) => o.id)
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= orderList.length) return

    const newOrder = [...orderList]
    const temp = newOrder[index]
    newOrder[index] = newOrder[targetIndex]
    newOrder[targetIndex] = temp

    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: newOrder,
    }))
  }

  // Check if a question index is unlocked
  // Question 0 is always unlocked.
  // Question N is unlocked if question N-1 has been solved correctly.
  const isQuestionUnlocked = (index: number): boolean => {
    if (index === 0) return true
    const previousQuestionId = QUIZ_QUESTIONS[index - 1].id
    return questionProgress[previousQuestionId]?.isCorrect ?? false
  }

  // Full reset
  const handleResetQuiz = () => {
    setAnswers({
      8: ['ord_rutherford', 'ord_dalton', 'ord_quantum', 'ord_democritus', 'ord_bohr', 'ord_thomson'],
    })
    setQuestionProgress({
      1: { answered: false, isCorrect: false, attempts: 0, checked: false },
      2: { answered: false, isCorrect: false, attempts: 0, checked: false },
      3: { answered: false, isCorrect: false, attempts: 0, checked: false },
      4: { answered: false, isCorrect: false, attempts: 0, checked: false },
      5: { answered: false, isCorrect: false, attempts: 0, checked: false },
      6: { answered: false, isCorrect: false, attempts: 0, checked: false },
      7: { answered: false, isCorrect: false, attempts: 0, checked: false },
      8: { answered: false, isCorrect: false, attempts: 0, checked: false },
      9: { answered: false, isCorrect: false, attempts: 0, checked: false },
      10: { answered: false, isCorrect: false, attempts: 0, checked: false },
    })
    setIsAllCompleted(false)
    setCurrentQuestionIndex(0)
    setSelectedDragItem(null)
  }

  // Count total completed correctly
  const completedCorrectCount = Object.values(questionProgress).filter((p) => p.isCorrect).length

  return (
    <div className={`flex flex-col ${embedded ? 'gap-4' : 'gap-6'} w-full animate-fade-in`}>
      
      {/* Quiz Top Navigation Bar */}
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
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-slate-900 tracking-tight">
                Uji Pemahaman Konsep (Bimbingan Interaktif)
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Tuntas: {completedCorrectCount} / {totalQuestions} Soal
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Jawab langsung dicek • Bimbingan jika salah • Lanjut jika benar</p>
          </div>
        </div>

        <button
          onClick={handleResetQuiz}
          className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition border border-slate-200 shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Mulai Ulang</span>
        </button>
      </div>

      {/* Completion Celebration Banner */}
      {isAllCompleted && (
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
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Hebat! Kamu telah menyelesaikan <strong>seluruh 10 soal variatif</strong> dengan pemahaman mendalam tanpa miskonsepsi.
              </p>
            </div>
          </div>

          <button
            onClick={handleResetQuiz}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            Latihan Lagi
          </button>
        </div>
      )}

      {/* Scaffolded Question Palette: Locked until previous question is correct! */}
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
            const prog = questionProgress[q.id]
            const unlocked = isQuestionUnlocked(idx)

            let badgeStyle = 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
            if (prog?.isCorrect) {
              badgeStyle = isCurrent
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs ring-2 ring-emerald-300'
                : 'bg-emerald-50 border-emerald-400 text-emerald-800 font-bold hover:bg-emerald-100 cursor-pointer'
            } else if (isCurrent) {
              badgeStyle = prog?.checked && !prog.isCorrect
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
                    setCurrentQuestionIndex(idx)
                    setSelectedDragItem(null)
                  }
                }}
                className={`py-2 rounded-xl text-xs font-bold transition border-2 flex flex-col items-center justify-center ${badgeStyle}`}
              >
                <div className="flex items-center gap-0.5">
                  <span>{idx + 1}</span>
                  {prog?.isCorrect && <Check className="w-3 h-3 text-emerald-600" />}
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

      {/* Main Active Question Area */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 md:p-7 shadow-sm flex flex-col gap-5">
        
        {/* Question Header & Type Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center shadow-xs ${
              currentProg.isCorrect
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : currentProg.checked && !currentProg.isCorrect
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
            {currentProg.attempts > 0 && (
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                Percobaan: {currentProg.attempts}x
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

        {/* ---------------- VARIATION 1: PILIHAN GANDA (Multiple Choice) ---------------- */}
        {currentQ.type === 'multiple_choice' && (
          <div className="flex flex-col gap-4">
            <p className="text-sm md:text-base font-bold text-slate-800 leading-relaxed">
              {currentQ.question}
            </p>

            <div className="space-y-2.5">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = answers[currentQ.id] === optIdx
                const isCorrectOption = optIdx === currentQ.correctAnswer

                let optionStyle = 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                if (currentProg.isCorrect) {
                  if (isCorrectOption) optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-xs'
                  else optionStyle = 'bg-white border-slate-200 text-slate-400 opacity-60'
                } else if (currentProg.checked && !currentProg.isCorrect) {
                  if (isSelected) optionStyle = 'bg-rose-50 border-rose-400 text-rose-950 font-semibold'
                  else optionStyle = 'bg-white border-slate-200 text-slate-700'
                } else if (isSelected) {
                  optionStyle = 'bg-indigo-50 border-indigo-600 text-indigo-950 font-bold shadow-xs'
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleMultipleChoiceSelect(optIdx)}
                    disabled={currentProg.isCorrect}
                    className={`w-full p-4 rounded-2xl text-left text-xs md:text-sm transition border-2 flex items-center justify-between cursor-pointer ${optionStyle}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-300 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="leading-relaxed font-medium">{opt}</span>
                    </div>

                    {currentProg.isCorrect && isCorrectOption && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 ml-3" />
                    )}
                    {currentProg.checked && !currentProg.isCorrect && isSelected && (
                      <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 ml-3" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ---------------- VARIATION 2: MENJODOHKAN (Matching Pairs) ---------------- */}
        {currentQ.type === 'matching' && (
          <div className="flex flex-col gap-4">
            <p className="text-xs md:text-sm font-bold text-slate-800 leading-relaxed bg-indigo-50/70 p-3.5 rounded-2xl border border-indigo-100">
              {currentQ.instruction}
            </p>

            <div className="space-y-3">
              {currentQ.pairs.map((pair, pIdx) => {
                const currentAnswer = answers[currentQ.id]?.[pair.id] || ''
                const isPairCorrect = currentAnswer === pair.right

                let pairCardStyle = 'bg-slate-50 border-slate-200'
                if (currentProg.isCorrect) {
                  pairCardStyle = 'bg-emerald-50/70 border-emerald-300'
                } else if (currentProg.checked && !currentProg.isCorrect) {
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
                        value={currentAnswer}
                        onChange={(e) => handleMatchingSelect(pair.id, e.target.value)}
                        disabled={currentProg.isCorrect}
                        className="w-full md:w-80 p-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                      >
                        <option value="">-- Pilih Pasangan Penemuan/Analogi --</option>
                        {currentQ.pairs.map((p) => (
                          <option key={p.id} value={p.right}>
                            {p.right}
                          </option>
                        ))}
                      </select>

                      {currentProg.checked && (
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

        {/* ---------------- VARIATION 3: DRAG AND DROP KLASIFIKASI (Classification) ---------------- */}
        {currentQ.type === 'drag_drop_classify' && (
          <div className="flex flex-col gap-5">
            <p className="text-xs md:text-sm font-bold text-slate-800 leading-relaxed bg-indigo-50/70 p-3.5 rounded-2xl border border-indigo-100">
              {currentQ.instruction}
            </p>

            {/* Unplaced / Available Items Pool */}
            {!currentProg.isCorrect && (
              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col gap-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <GripVertical className="w-3.5 h-3.5 text-slate-500" />
                  Kartu Karakteristik yang Belum Ditempatkan: (Klik kartu, lalu klik wadah tujuan)
                </span>

                <div className="flex flex-wrap gap-2 pt-1">
                  {currentQ.items.map((item) => {
                    const assignedCategoryId = answers[currentQ.id]?.[item.id]
                    const isSelected = selectedDragItem === item.id

                    if (assignedCategoryId) return null

                    return (
                      <div
                        key={item.id}
                        draggable={!currentProg.isCorrect}
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

                  {currentQ.items.every((item) => answers[currentQ.id]?.[item.id]) && (
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                      ✓ Seluruh kartu sudah masuk ke wadah. Klik &quot;Cek Jawaban&quot; di bawah!
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Target Category Containers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQ.categories.map((cat) => {
                const itemsInThisCat = currentQ.items.filter(
                  (item) => answers[currentQ.id]?.[item.id] === cat.id
                )

                return (
                  <div
                    key={cat.id}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      const droppedItemId = e.dataTransfer.getData('text/plain')
                      if (droppedItemId) handleClassifyItemToCategory(droppedItemId, cat.id)
                    }}
                    onClick={() => {
                      if (selectedDragItem && !currentProg.isCorrect) {
                        handleClassifyItemToCategory(selectedDragItem, cat.id)
                      }
                    }}
                    className={`p-4 rounded-3xl border-2 ${cat.borderColor} ${cat.bgColor} min-h-[170px] flex flex-col justify-between transition-all duration-200 ${
                      selectedDragItem && !currentProg.isCorrect ? 'ring-2 ring-indigo-400 cursor-pointer shadow-md' : ''
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
                                currentProg.isCorrect
                                  ? 'bg-emerald-100/80 border-emerald-400 text-emerald-950 font-semibold'
                                  : currentProg.checked && !currentProg.isCorrect
                                  ? isItemInRightCategory
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                                    : 'bg-rose-100/90 border-rose-400 text-rose-950 font-bold'
                                  : 'bg-white border-slate-200 text-slate-800'
                              }`}
                            >
                              <span>{item.text}</span>
                              {!currentProg.isCorrect && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setAnswers((prev) => {
                                      const updated = { ...(prev[currentQ.id] || {}) }
                                      delete updated[item.id]
                                      return { ...prev, [currentQ.id]: updated }
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

        {/* ---------------- VARIATION 4: DRAG AND DROP URUTAN (Ordering) ---------------- */}
        {currentQ.type === 'drag_drop_order' && (
          <div className="flex flex-col gap-4">
            <p className="text-xs md:text-sm font-bold text-slate-800 leading-relaxed bg-indigo-50/70 p-3.5 rounded-2xl border border-indigo-100">
              {currentQ.instruction}
            </p>

            <div className="space-y-2.5">
              {((answers[currentQ.id] as string[]) || currentQ.correctOrder.map((o) => o.id)).map((itemId, idx, arr) => {
                const item = currentQ.correctOrder.find((o) => o.id === itemId)
                if (!item) return null

                const isCorrectPosition = currentQ.correctOrder[idx]?.id === itemId

                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3 transition shadow-xs ${
                      currentProg.isCorrect
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold'
                        : currentProg.checked && !currentProg.isCorrect
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

                    {!currentProg.isCorrect ? (
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

        {/* ---------------- INTERACTIVE FEEDBACK & GUIDANCE (IF INCORRECT - MACET DI SOAL) ---------------- */}
        {currentProg.checked && !currentProg.isCorrect && (
          <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-xs text-rose-950 flex flex-col gap-2.5 shadow-xs animate-fade-in">
            <div className="flex items-center gap-2 font-black text-rose-800 text-sm">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>Jawaban Kamu Belum Tepat! Jangan berkecil hati, mari perbaiki:</span>
            </div>

            <div className="p-3 bg-white/90 rounded-xl border border-rose-200 flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-900 block mb-0.5">Petunjuk Bimbingan Konseptual:</span>
                <p className="text-slate-700 leading-relaxed font-medium">{currentQ.hint}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-rose-700 font-semibold">
                ⚠️ Kamu perlu memperbaiki jawaban di soal ini agar dapat melanjutkan ke soal berikutnya!
              </span>
              <button
                onClick={handleTryAgainOnThisQuestion}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Perbaiki Jawaban</span>
              </button>
            </div>
          </div>
        )}

        {/* ---------------- INTERACTIVE PEMBAHASAN (IF CORRECT) ---------------- */}
        {currentProg.isCorrect && (
          <div className="p-4.5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-xs text-emerald-950 flex flex-col gap-2.5 shadow-xs animate-fade-in">
            <div className="flex items-center gap-2 font-black text-emerald-800 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>🎉 Luar Biasa, Jawaban Kamu Benar!</span>
            </div>

            <div className="p-3.5 bg-white/90 rounded-xl border border-emerald-200">
              <span className="font-bold text-emerald-900 block mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Pembahasan Ilmiah & Konsep Hakiki:
              </span>
              <p className="text-slate-700 leading-relaxed font-medium">{currentQ.explanation}</p>
            </div>
          </div>
        )}

        {/* ---------------- ACTION FOOTER BUTTONS ---------------- */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 mt-2">
          
          {/* Previous Question Button (Always allowed for answered questions) */}
          <button
            onClick={() => {
              if (currentQuestionIndex > 0) {
                setCurrentQuestionIndex((prev) => prev - 1)
                setSelectedDragItem(null)
              }
            }}
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

          {/* Center Check / Next Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            
            {/* If NOT yet answered correctly, show "Cek Jawaban" */}
            {!currentProg.isCorrect && (
              <button
                onClick={checkAnswer}
                disabled={!hasSelectedAnswer()}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 shadow-md ${
                  hasSelectedAnswer()
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:brightness-105 text-white shadow-indigo-500/25 cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Cek Jawaban</span>
                <Check className="w-4 h-4" />
              </button>
            )}

            {/* ONLY ONCE CORRECT: "Soal Selanjutnya →" emerges! */}
            {currentProg.isCorrect && (
              <button
                onClick={handleNextQuestion}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-105 text-white shadow-md shadow-emerald-500/25 transition flex items-center justify-center gap-2 cursor-pointer animate-bounce-short"
              >
                <span>
                  {currentQuestionIndex === totalQuestions - 1
                    ? 'Selesai & Lihat Pencapaian 🏆'
                    : 'Soal Selanjutnya'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

          </div>

        </div>

      </div>

    </div>
  )
}
