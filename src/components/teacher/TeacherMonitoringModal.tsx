import { useState, useEffect } from 'react'
import {
  GraduationCap,
  X,
  Search,
  Award,
  HelpCircle,
  Users,
  TrendingUp,
  RefreshCw,
  ChevronRight
} from 'lucide-react'
import {
  learningProgressService,
  type StudentProgressSummary,
  TOTAL_MAX_XP,
} from '../../services/learningProgressService'
import { ATOM_MODELS } from '../../data/atomModels'

interface TeacherMonitoringModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TeacherMonitoringModal({ isOpen, onClose }: TeacherMonitoringModalProps) {
  const [students, setStudents] = useState<StudentProgressSummary[]>(() =>
    learningProgressService.getAllStudentsProgress()
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'in_progress'>('all')
  const [isSyncing, setIsSyncing] = useState(false)
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<StudentProgressSummary | null>(null)

  const handleManualRefresh = async () => {
    setIsSyncing(true)
    const list = await learningProgressService.fetchRemoteProgressForTeacher()
    setStudents(list)
    setIsSyncing(false)
  }

  useEffect(() => {
    if (!isOpen) return
    let active = true
    learningProgressService.fetchRemoteProgressForTeacher().then((list) => {
      if (active) {
        setStudents(list)
      }
    })
    return () => {
      active = false
    }
  }, [isOpen])

  if (!isOpen) return null

  // Filter students based on search and status
  const filteredStudents = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.email && s.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      s.classCode.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchSearch) return false

    if (filterStatus === 'completed') {
      return s.totalXP >= TOTAL_MAX_XP
    }
    if (filterStatus === 'in_progress') {
      return s.totalXP > 0 && s.totalXP < TOTAL_MAX_XP
    }

    return true
  })

  // Class Statistics
  const totalStudents = students.length
  const avgXP =
    totalStudents > 0
      ? Math.round(students.reduce((acc, curr) => acc + curr.totalXP, 0) / totalStudents)
      : 0
  const quizSubmissions = students.filter((s) => typeof s.quizScore === 'number')
  const avgQuizScore =
    quizSubmissions.length > 0
      ? Math.round(
          quizSubmissions.reduce((acc, curr) => acc + (curr.quizScore || 0), 0) /
            quizSubmissions.length
        )
      : 0
  const fullyCompletedCount = students.filter((s) => s.totalXP >= TOTAL_MAX_XP).length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* ── Modal Top Header ──────────────────────────────────────────────── */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white flex items-center justify-between gap-4 border-b border-indigo-700/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 font-black flex items-center justify-center shadow-md shadow-amber-400/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black tracking-tight text-white">
                  Dasbor Pemantauan Belajar Siswa (Mode Guru)
                </h3>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  Data Sinkron Aktif
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                Rekapitulasi capaian <strong>Poin Eksplorasi (0–600 XP)</strong> dan <strong>Skor Uji Konsep (25 Soal)</strong> seluruh siswa.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleManualRefresh}
              disabled={isSyncing}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              title="Perbarui Data"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── Class Summary Metrics ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 border-b border-slate-200 shrink-0">
          <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Siswa</span>
              <p className="text-sm font-black text-slate-900">{totalStudents} Siswa</p>
            </div>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-amber-200 shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Rata-Rata XP Kelas</span>
              <p className="text-sm font-black text-slate-900">{avgXP} / 600 XP</p>
            </div>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-indigo-200 shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider">Rata-Rata Uji Konsep</span>
              <p className="text-sm font-black text-slate-900">
                {quizSubmissions.length > 0 ? `${avgQuizScore} / 100` : 'Belum Ada'}
              </p>
            </div>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-emerald-200 shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Tuntas 6 Model</span>
              <p className="text-sm font-black text-emerald-700">
                {fullyCompletedCount} Siswa ({totalStudents > 0 ? Math.round((fullyCompletedCount / totalStudents) * 100) : 0}%)
              </p>
            </div>
          </div>
        </div>

        {/* ── Filters & Search ─────────────────────────────────────────────── */}
        <div className="px-5 py-3 bg-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 shrink-0">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama siswa, email, atau kelas..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-bold mr-1">Filter:</span>
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterStatus === 'all'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua ({students.length})
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterStatus === 'completed'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tuntas 600 XP ({fullyCompletedCount})
            </button>
            <button
              onClick={() => setFilterStatus('in_progress')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterStatus === 'in_progress'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Sedang Belajar
            </button>
          </div>
        </div>

        {/* ── Main Table of Students ────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                  <th className="py-3 px-4">Nama Siswa / Akun</th>
                  <th className="py-3 px-4 text-center">Poin Eksplorasi (0–600 XP)</th>
                  <th className="py-3 px-4 text-center">Skor Uji Konsep (25 Soal)</th>
                  <th className="py-3 px-4 text-center">Ketuntasan Model</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      Tidak ada data siswa yang cocok dengan pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => {
                    const isMax = student.totalXP >= TOTAL_MAX_XP
                    const xpPercent = Math.min(100, Math.round((student.totalXP / TOTAL_MAX_XP) * 100))

                    return (
                      <tr
                        key={student.userId}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        {/* 1. Nama Siswa */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 text-xs">
                              {student.name}
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] text-slate-500 font-mono">
                                {student.email || 'Mode Tamu / Siswa'}
                              </span>
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                                {student.classCode}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 2. Poin Eksplorasi (0-600 XP) */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex flex-col items-center">
                            <div className="flex items-center gap-1.5 font-mono font-black text-xs text-slate-900">
                              <span
                                className={`px-2.5 py-0.5 rounded-full border shadow-2xs ${
                                  isMax
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                    : student.totalXP >= 300
                                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                                    : 'bg-slate-100 text-slate-700 border-slate-200'
                                }`}
                              >
                                {student.totalXP} / 600 XP
                              </span>
                              <span className="text-[10px] text-slate-500 font-normal">
                                ({xpPercent}%)
                              </span>
                            </div>

                            {/* Progress bar */}
                            <div className="w-32 h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1.5">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  isMax
                                    ? 'bg-emerald-500'
                                    : 'bg-gradient-to-r from-amber-500 to-yellow-500'
                                }`}
                                style={{ width: `${xpPercent}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* 3. Skor Uji Konsep (25 Soal) */}
                        <td className="py-3.5 px-4 text-center">
                          {typeof student.quizScore === 'number' ? (
                            <div className="flex flex-col items-center">
                              <span
                                className={`px-2.5 py-0.5 rounded-full font-mono font-bold text-xs border shadow-2xs ${
                                  student.quizScore >= 80
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                    : student.quizScore >= 65
                                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                                    : 'bg-rose-50 text-rose-800 border-rose-300'
                                }`}
                              >
                                {student.quizScore} / 100
                              </span>
                              <span className="text-[9px] text-slate-500 mt-0.5">
                                {Math.round((student.quizScore / 100) * 25)} / 25 Benar
                              </span>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">
                              Belum Evaluasi
                            </span>
                          )}
                        </td>

                        {/* 4. Ketuntasan Model (6 Model Atom) */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {ATOM_MODELS.map((model) => {
                              const stages = [1, 2, 3, 4]
                              const completedCount = stages.filter((st) =>
                                student.completedStages.includes(`${model.id}_stage_${st}`)
                              ).length
                              const isAllDone = completedCount === 4

                              return (
                                <div
                                  key={model.id}
                                  title={`${model.name}: ${completedCount}/4 Tahap Selesai`}
                                  className={`w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black border ${
                                    isAllDone
                                      ? 'bg-emerald-500 text-white border-emerald-600'
                                      : completedCount > 0
                                      ? 'bg-amber-400 text-slate-950 border-amber-500'
                                      : 'bg-slate-100 text-slate-400 border-slate-200'
                                  }`}
                                >
                                  {model.name.charAt(0)}
                                </div>
                              )
                            })}
                          </div>
                          <span className="text-[10px] text-slate-500 mt-1 block">
                            {student.completedModelsCount} / 6 Model Tuntas
                          </span>
                        </td>

                        {/* 5. Aksi Detail */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => setSelectedStudentDetail(student)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition flex items-center gap-1 mx-auto cursor-pointer"
                          >
                            <span>Rincian</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Sub-Modal: Detail Tahap Siswa ─────────────────────────────────── */}
        {selectedStudentDetail && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl p-5 shadow-2xl flex flex-col gap-4 animate-scale-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h4 className="font-black text-sm text-slate-900">
                    Rincian Belajar: {selectedStudentDetail.name}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {selectedStudentDetail.classCode} • Total: {selectedStudentDetail.totalXP} / 600 XP
                  </p>
                </div>
                <button
                  onClick={() => setSelectedStudentDetail(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {ATOM_MODELS.map((model) => {
                  const stage1 = selectedStudentDetail.completedStages.includes(`${model.id}_stage_1`)
                  const stage2 = selectedStudentDetail.completedStages.includes(`${model.id}_stage_2`)
                  const stage3 = selectedStudentDetail.completedStages.includes(`${model.id}_stage_3`)
                  const stage4 = selectedStudentDetail.completedStages.includes(`${model.id}_stage_4`)
                  const modelXP = (stage1 ? 15 : 0) + (stage2 ? 35 : 0) + (stage3 ? 20 : 0) + (stage4 ? 30 : 0)

                  return (
                    <div
                      key={model.id}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-800">{model.name}</span>
                        <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                          {modelXP} / 100 XP
                        </span>
                      </div>

                      <div className="grid grid-cols-4 gap-1.5 text-[10px]">
                        <div
                          className={`p-1.5 rounded-lg border text-center font-bold ${
                            stage1 ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-white text-slate-400 border-slate-200'
                          }`}
                        >
                          Tahap 1 (+15)
                        </div>
                        <div
                          className={`p-1.5 rounded-lg border text-center font-bold ${
                            stage2 ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-white text-slate-400 border-slate-200'
                          }`}
                        >
                          Tahap 2 (+35)
                        </div>
                        <div
                          className={`p-1.5 rounded-lg border text-center font-bold ${
                            stage3 ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-white text-slate-400 border-slate-200'
                          }`}
                        >
                          Tahap 3 (+20)
                        </div>
                        <div
                          className={`p-1.5 rounded-lg border text-center font-bold ${
                            stage4 ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-white text-slate-400 border-slate-200'
                          }`}
                        >
                          Tahap 4 (+30)
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <button
                onClick={() => setSelectedStudentDetail(null)}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition cursor-pointer"
              >
                Tutup Rincian
              </button>
            </div>
          </div>
        )}

        {/* ── Modal Bottom Bar ─────────────────────────────────────────────── */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] text-slate-500 font-medium">
            💡 <strong>Panduan Guru:</strong> Poin Eksplorasi mencatat ketuntasan proses (15+35+20+30 XP/model), sedangkan Skor Uji Konsep mengukur pemahaman konsep kuis (25 butir soal).
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
          >
            Selesai Memantau
          </button>
        </div>

      </div>
    </div>
  )
}
