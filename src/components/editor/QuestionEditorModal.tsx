import React, { useState } from 'react'
import {
  X,
  Save,
  HelpCircle,
  Plus,
  Trash2,
  CheckCircle2,
  ListFilter,
  Check
} from 'lucide-react'
import type {
  QuizQuestion,
  QuestionType,
  MultipleChoiceQuestion,
  MatchingQuestion,
  MatchingPair
} from '../../types/quiz'
import { ChemistryRichTextEditor } from './ChemistryRichTextEditor'

interface QuestionEditorModalProps {
  isOpen: boolean
  questionToEdit?: QuizQuestion | null
  onSave: (question: QuizQuestion) => void
  onClose: () => void
}

export const QuestionEditorModal: React.FC<QuestionEditorModalProps> = ({
  isOpen,
  questionToEdit,
  onSave,
  onClose
}) => {
  const isEditing = !!questionToEdit

  // Question Type
  const [questionType, setQuestionType] = useState<QuestionType>(
    questionToEdit?.type || 'multiple_choice'
  )

  // Title
  const [title, setTitle] = useState(questionToEdit?.title || '')

  // Question / Instruction content
  const [questionText, setQuestionText] = useState(
    questionToEdit && 'question' in questionToEdit
      ? questionToEdit.question
      : questionToEdit && 'instruction' in questionToEdit
      ? questionToEdit.instruction
      : ''
  )

  // Hint & Explanation
  const [hint, setHint] = useState(questionToEdit?.hint || '')
  const [explanation, setExplanation] = useState(questionToEdit?.explanation || '')

  // Multiple Choice Specific State
  const initialOptions =
    questionToEdit && questionToEdit.type === 'multiple_choice'
      ? questionToEdit.options
      : [
          'Pilihan jawaban A',
          'Pilihan jawaban B',
          'Pilihan jawaban C',
          'Pilihan jawaban D'
        ]
  const [options, setOptions] = useState<string[]>(initialOptions)
  const [correctAnswer, setCorrectAnswer] = useState<number>(
    questionToEdit && questionToEdit.type === 'multiple_choice'
      ? questionToEdit.correctAnswer
      : 0
  )

  // Matching Specific State
  const initialPairs: MatchingPair[] =
    questionToEdit && questionToEdit.type === 'matching'
      ? questionToEdit.pairs
      : [
          { id: 'p1', left: 'Tokoh / Konsep 1', right: 'Karakteristik / Penemuan 1' },
          { id: 'p2', left: 'Tokoh / Konsep 2', right: 'Karakteristik / Penemuan 2' },
          { id: 'p3', left: 'Tokoh / Konsep 3', right: 'Karakteristik / Penemuan 3' }
        ]
  const [pairs, setPairs] = useState<MatchingPair[]>(initialPairs)

  if (!isOpen) return null

  // Option handlers for multiple choice
  const handleOptionChange = (index: number, val: string) => {
    const updated = [...options]
    updated[index] = val
    setOptions(updated)
  }

  const handleAddOption = () => {
    setOptions([...options, `Pilihan jawaban ${String.fromCharCode(65 + options.length)}`])
  }

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return
    const updated = options.filter((_, i) => i !== index)
    setOptions(updated)
    if (correctAnswer >= updated.length) {
      setCorrectAnswer(0)
    }
  }

  // Pair handlers for matching
  const handlePairChange = (index: number, field: 'left' | 'right', val: string) => {
    const updated = [...pairs]
    updated[index] = { ...updated[index], [field]: val }
    setPairs(updated)
  }

  const handleAddPair = () => {
    setPairs([
      ...pairs,
      {
        id: `p_${Date.now()}`,
        left: `Item kiri ${pairs.length + 1}`,
        right: `Pasangan kanan ${pairs.length + 1}`
      }
    ])
  }

  const handleRemovePair = (index: number) => {
    if (pairs.length <= 2) return
    setPairs(pairs.filter((_, i) => i !== index))
  }

  // Handle Submit Save
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      alert('Judul soal wajib diisi.')
      return
    }

    if (!questionText.trim()) {
      alert('Teks pertanyaan / instruksi soal wajib diisi.')
      return
    }

    const questionId = questionToEdit?.id || 0

    if (questionType === 'multiple_choice') {
      const mcq: MultipleChoiceQuestion = {
        id: questionId,
        type: 'multiple_choice',
        title: title.trim(),
        question: questionText.trim(),
        options: options.map((opt) => opt.trim()),
        correctAnswer,
        hint: hint.trim(),
        explanation: explanation.trim()
      }
      onSave(mcq)
    } else if (questionType === 'matching') {
      const matchQ: MatchingQuestion = {
        id: questionId,
        type: 'matching',
        title: title.trim(),
        instruction: questionText.trim(),
        pairs: pairs.map((p, idx) => ({
          id: p.id || `p_${idx}`,
          left: p.left.trim(),
          right: p.right.trim()
        })),
        hint: hint.trim(),
        explanation: explanation.trim()
      }
      onSave(matchQ)
    } else {
      // Untuk tipe lain (misal drag & drop order / classify yang sudah ada), pertahankan strukturnya
      const base: any = {
        ...(questionToEdit || {}),
        id: questionId,
        type: questionType,
        title: title.trim(),
        instruction: questionText.trim(),
        hint: hint.trim(),
        explanation: explanation.trim()
      }
      onSave(base)
    }

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shadow-xs">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                {isEditing ? `Edit Butir Soal (ID: ${questionToEdit.id})` : 'Tambah Soal Baru ke Bank Soal (Mode Guru)'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Soal yang disimpan akan otomatis muncul di evaluasi kuis siswa
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 text-xs">
          
          {/* Tipe Soal & Judul */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-800">Tipe Soal:</label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value as QuestionType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-800 bg-white focus:outline-indigo-500"
              >
                <option value="multiple_choice">Pilihan Ganda (Multiple Choice)</option>
                <option value="matching">Menjodohkan (Matching Pairs)</option>
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-slate-800">Judul / Topik Soal: *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Hukum Stoikiometri Dalton / Spektrum Emisi Bohr"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm focus:outline-indigo-500"
              />
            </div>
          </div>

          {/* Teks Pertanyaan / Instruksi (dengan Rich Text Editor Kimia) */}
          <div className="space-y-1">
            <ChemistryRichTextEditor
              label="Teks Pertanyaan / Instruksi Soal: *"
              description="Dukung simbol ion, rumus kimia, subscript/superscript, gambar reaksi, dan hyperlink."
              value={questionText}
              onChange={setQuestionText}
              minHeight="110px"
              placeholder="Tuliskan butir soal kimia di sini..."
            />
          </div>

          {/* PILIHAN GANDA (Jika type === multiple_choice) */}
          {questionType === 'multiple_choice' && (
            <div className="space-y-3 p-4 bg-slate-50/70 border border-slate-200 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Pilihan Jawaban & Kunci Jawaban Benar:</h4>
                  <p className="text-[11px] text-slate-500">
                    Klik radio button di sebelah kiri untuk menandai pilihan yang merupakan kunci jawaban benar
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Tambah Pilihan</span>
                </button>
              </div>

              <div className="flex flex-col gap-2.5">
                {options.map((opt, idx) => {
                  const letter = String.fromCharCode(65 + idx)
                  const isCorrect = correctAnswer === idx
                  return (
                    <div
                      key={idx}
                      className={`flex items-start gap-2.5 p-2 rounded-xl border transition ${
                        isCorrect
                          ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-200'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      {/* Radio Kunci Benar */}
                      <button
                        type="button"
                        onClick={() => setCorrectAnswer(idx)}
                        className={`mt-1.5 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 cursor-pointer transition ${
                          isCorrect
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                        title={isCorrect ? 'Kunci Jawaban Benar' : 'Jadikan sebagai Kunci Benar'}
                      >
                        {isCorrect ? <Check className="w-3.5 h-3.5" /> : letter}
                      </button>

                      <div className="flex-1">
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => handleOptionChange(idx, e.target.value)}
                          placeholder={`Pilihan ${letter}`}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-800 focus:outline-indigo-500"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveOption(idx)}
                        disabled={options.length <= 2}
                        className="mt-1 w-7 h-7 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 disabled:opacity-30 flex items-center justify-center cursor-pointer transition shrink-0"
                        title="Hapus opsi ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* MENJODOHKAN (Jika type === matching) */}
          {questionType === 'matching' && (
            <div className="space-y-3 p-4 bg-slate-50/70 border border-slate-200 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Pasangan Menjodohkan:</h4>
                  <p className="text-[11px] text-slate-500">
                    Masukkan pasangan yang tepat antara kolom kiri dan kolom kanan
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddPair}
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Tambah Pasangan</span>
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {pairs.map((pair, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={pair.left}
                      onChange={(e) => handlePairChange(idx, 'left', e.target.value)}
                      placeholder="Item Kiri (Tokoh/Konsep)"
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 font-medium text-slate-800"
                    />
                    <span className="text-slate-400 font-bold">↔</span>
                    <input
                      type="text"
                      value={pair.right}
                      onChange={(e) => handlePairChange(idx, 'right', e.target.value)}
                      placeholder="Pasangan Kanan (Karakteristik)"
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 font-medium text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePair(idx)}
                      disabled={pairs.length <= 2}
                      className="w-7 h-7 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 disabled:opacity-30 flex items-center justify-center cursor-pointer transition shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Petunjuk & Pembahasan (Masing-masing dengan Rich Text Editor Kimia) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <ChemistryRichTextEditor
                label="Petunjuk Bimbingan Konseptual (Hint):"
                description="Bantuan terarah tanpa langsung membocorkan jawaban benar."
                value={hint}
                onChange={setHint}
                minHeight="90px"
                placeholder="Petunjuk untuk memandu alur berpikir siswa..."
              />
            </div>

            <div className="space-y-1">
              <ChemistryRichTextEditor
                label="Pembahasan Lengkap (Explanation):"
                description="Penjelasan ilmiah yang muncul setelah siswa menjawab."
                value={explanation}
                onChange={setExplanation}
                minHeight="90px"
                placeholder="Penjelasan komprehensif mengapa jawaban tersebut benar..."
              />
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 mt-2 shrink-0">
            <div className="text-slate-500 text-[11px]">
              {isEditing ? 'Memperbarui butir soal yang sudah ada' : 'Soal baru akan ditambahkan ke daftar evaluasi'}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs cursor-pointer transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 flex items-center gap-2 cursor-pointer transition active:scale-98"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Butir Soal</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  )
}
