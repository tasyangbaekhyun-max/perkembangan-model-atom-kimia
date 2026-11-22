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
  ChevronRight,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Radio,
  BookOpen
} from 'lucide-react'
import * as XLSX from 'xlsx'
import {
  learningProgressService,
  formatIndonesianDateTime,
  type StudentProgressSummary,
  TOTAL_MAX_XP,
} from '../../services/learningProgressService'
import { ATOM_MODELS } from '../../data/atomModels'
import { isFirebaseConfigured } from '../../lib/firebase'

interface TeacherMonitoringModalProps {
  isOpen: boolean
  onClose: () => void
}

type FilterStatus = 'all' | 'completed' | 'in_progress' | 'not_started'

export function TeacherMonitoringModal({ isOpen, onClose }: TeacherMonitoringModalProps) {
  const [students, setStudents] = useState<StudentProgressSummary[]>(() =>
    learningProgressService.getAllStudentsProgress()
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [isSyncing, setIsSyncing] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<StudentProgressSummary | null>(null)

  // Manual refresh handler
  const handleManualRefresh = async () => {
    setIsSyncing(true)
    try {
      const list = await learningProgressService.fetchRemoteProgressForTeacher()
      setStudents(list)
    } finally {
      setIsSyncing(false)
    }
  }

  // Real-time synchronization via onSnapshot when modal is open
  useEffect(() => {
    if (!isOpen) return

    // 1. Initial fetch
    let active = true
    setIsSyncing(true)
    learningProgressService.fetchRemoteProgressForTeacher().then((list) => {
      if (active) {
        setStudents(list)
        setIsSyncing(false)
      }
    })

    // 2. Real-time subscription to Firebase
    const unsubscribe = learningProgressService.subscribeToRemoteProgressForTeacher((updatedList) => {
      if (active) {
        setStudents(updatedList)
      }
    })

    return () => {
      active = false
      unsubscribe()
    }
  }, [isOpen])

  // Filter students based on search and status
  const filteredStudents = students.filter((s) => {
    const sName = (s.name || '').toLowerCase()
    const sEmail = (s.email || '').toLowerCase()
    const sClass = (s.classCode || '').toLowerCase()
    const query = searchQuery.toLowerCase().trim()

    const matchSearch = !query || sName.includes(query) || sEmail.includes(query) || sClass.includes(query)
    if (!matchSearch) return false

    if (filterStatus === 'completed') {
      return s.totalXP >= TOTAL_MAX_XP || s.completedModelsCount === 6
    }
    if (filterStatus === 'in_progress') {
      return s.totalXP > 0 && s.totalXP < TOTAL_MAX_XP
    }
    if (filterStatus === 'not_started') {
      return s.totalXP === 0
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
  const fullyCompletedCount = students.filter(
    (s) => s.totalXP >= TOTAL_MAX_XP || s.completedModelsCount === 6
  ).length
  const inProgressCount = students.filter((s) => s.totalXP > 0 && s.totalXP < TOTAL_MAX_XP).length
  const notStartedCount = students.filter((s) => s.totalXP === 0).length

  // Download Rekap ke Excel (.xlsx) menggunakan SheetJS
  const handleExportExcel = () => {
    try {
      if (students.length === 0) {
        alert('Belum ada data siswa untuk diunduh.')
        return
      }

      // Format setiap baris data siswa dengan detail lengkap
      const rows = filteredStudents.map((student, index) => {
        // Rincian progres 4 tahap per model atom
        const stagesPerModel: Record<string, string> = {}
        ATOM_MODELS.forEach((m) => {
          const completedCount = [1, 2, 3, 4].filter((st) =>
            student.completedStages.includes(`${m.id}_stage_${st}`)
          ).length
          stagesPerModel[m.name] = `${completedCount}/4 Tahap${completedCount === 4 ? ' (Tuntas)' : ''}`
        })

        const percent = Math.min(100, Math.round((student.totalXP / TOTAL_MAX_XP) * 100))
        const lastActiveFormatted = formatIndonesianDateTime(student.lastCompletedAt)

        let quizScoreStr = '-'
        let quizCorrectStr = '-'
        let quizStatusStr = 'Belum Kuis'
        if (typeof student.quizScore === 'number') {
          quizScoreStr = `${student.quizScore}`
          const correct = Math.round((student.quizScore / 100) * 25)
          quizCorrectStr = `${correct}/25 Soal`
          quizStatusStr = student.quizScore >= 70 ? 'Lulus / Tuntas' : 'Perlu Pengayaan'
        }

        let studyStatusStr = 'Belum Mulai'
        if (student.totalXP >= TOTAL_MAX_XP || student.completedModelsCount === 6) {
          studyStatusStr = 'Tuntas 6 Model (Selesai Penuh)'
        } else if (student.totalXP > 0) {
          studyStatusStr = `Sedang Berjalan (${student.completedModelsCount}/6 Model)`
        }

        return {
          'No': index + 1,
          'Nama Lengkap Siswa': student.name || 'Siswa',
          'Email Siswa': student.email || '-',
          'Kelas': student.classCode || 'KIM-X-FASE-E',
          'Democritus (4 Tahap)': stagesPerModel['Democritus dari Abdera'] || '0/4 Tahap',
          'John Dalton (4 Tahap)': stagesPerModel['John Dalton'] || '0/4 Tahap',
          'J.J. Thomson (4 Tahap)': stagesPerModel['Sir Joseph John Thomson'] || '0/4 Tahap',
          'Ernest Rutherford (4 Tahap)': stagesPerModel['Ernest Rutherford'] || '0/4 Tahap',
          'Niels Bohr (4 Tahap)': stagesPerModel['Niels Bohr'] || '0/4 Tahap',
          'Mekanika Kuantum (4 Tahap)': stagesPerModel['Schrödinger, Heisenberg, & Dirac'] || '0/4 Tahap',
          'Model Tuntas (x/6)': `${student.completedModelsCount} / 6`,
          'Total Poin XP (0–600)': student.totalXP,
          'Persentase Ketuntasan': `${percent}%`,
          'Skor Uji Konsep (0–100)': quizScoreStr,
          'Jawaban Benar Kuis (x/25)': quizCorrectStr,
          'Status Evaluasi': quizStatusStr,
          'Status Belajar Siswa': studyStatusStr,
          'Waktu Aktivitas Terakhir': lastActiveFormatted,
        }
      })

      // Buat lembar kerja (worksheet)
      const worksheet = XLSX.utils.json_to_sheet(rows)

      // Hitung lebar kolom otomatis (auto-fit columns)
      if (rows.length > 0) {
        const colKeys = Object.keys(rows[0])
        const colWidths = colKeys.map((key) => {
          let maxLen = key.length
          rows.forEach((r: any) => {
            const val = r[key] != null ? String(r[key]) : ''
            if (val.length > maxLen) {
              maxLen = val.length
            }
          })
          return { wch: Math.min(Math.max(maxLen + 3, 10), 45) }
        })
        worksheet['!cols'] = colWidths
      }

      // Buat workbook dan lampirkan sheet
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Rekap Progres Siswa')

      // Generate nama file otomatis: Rekap_Data_Siswa_AtomLab_YYYY-MM-DD.xlsx
      const today = new Date()
      const yyyy = today.getFullYear()
      const mm = String(today.getMonth() + 1).padStart(2, '0')
      const dd = String(today.getDate()).padStart(2, '0')
      const filename = `Rekap_Data_Siswa_AtomLab_${yyyy}-${mm}-${dd}.xlsx`

      // Tulis file Excel dan mulai download di browser
      XLSX.writeFile(workbook, filename)

      setExportSuccess(true)
      setTimeout(() => setExportSuccess(false), 3500)
    } catch (err) {
      console.error('[Excel] Gagal mengekspor data siswa ke Excel:', err)
      alert('Terjadi kesalahan saat memproses ekspor Excel. Silakan coba kembali.')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-6xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* ── Modal Top Header ──────────────────────────────────────────────── */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white flex items-center justify-between gap-4 border-b border-indigo-700/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 font-black flex items-center justify-center shadow-md shadow-amber-400/20 shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-black tracking-tight text-white">
                  Dasbor Pemantauan Belajar Siswa (Mode Guru)
                </h3>
                {isFirebaseConfigured() ? (
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                    <Radio className="w-3 h-3 animate-pulse text-emerald-400" />
                    Firebase Real-Time Aktif
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    Penyimpanan Lokal Aktif
                  </span>
                )}
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                Pantau langsung ketuntasan <strong>Poin Eksplorasi (0–600 XP)</strong>, <strong>Progres 6 Model Atom</strong>, dan <strong>Skor Uji Konsep</strong> seluruh siswa dari basis data Firebase.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleManualRefresh}
              disabled={isSyncing}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              title="Perbarui / Sinkronkan Data dari Firebase"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              title="Tutup Dasbor"
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
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Siswa Terdaftar</span>
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

        {/* ── Toolbar: Search, Filters, & Download Excel ───────────────────── */}
        <div className="px-5 py-3.5 bg-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 shrink-0">
          {/* Search box */}
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama siswa, email, atau kelas..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Filters & Export Button */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  filterStatus === 'all'
                    ? 'bg-white text-indigo-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua ({students.length})
              </button>
              <button
                onClick={() => setFilterStatus('completed')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  filterStatus === 'completed'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tuntas ({fullyCompletedCount})
              </button>
              <button
                onClick={() => setFilterStatus('in_progress')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  filterStatus === 'in_progress'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sedang Berjalan ({inProgressCount})
              </button>
              <button
                onClick={() => setFilterStatus('not_started')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  filterStatus === 'not_started'
                    ? 'bg-slate-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Belum Mulai ({notStartedCount})
              </button>
            </div>

            {/* Tombol Download Rekap Excel (.xlsx) */}
            <button
              onClick={handleExportExcel}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-sm ${
                exportSuccess
                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white'
              }`}
              title="Unduh seluruh rekapitulasi data siswa ke file Excel (.xlsx)"
            >
              {exportSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>Excel Berhasil Diunduh!</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
                  <span>Download Rekap Excel (.xlsx)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Main Table of Students ────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs bg-white">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-700 font-bold">
                  <th className="py-3 px-3 text-center w-12">No</th>
                  <th className="py-3 px-4 min-w-[180px]">Nama Lengkap Siswa</th>
                  <th className="py-3 px-4 min-w-[140px]">Email / Kelas</th>
                  <th className="py-3 px-4 text-center min-w-[160px]">Progres Belajar</th>
                  <th className="py-3 px-4 text-center min-w-[160px]">Total Poin XP</th>
                  <th className="py-3 px-4 text-center min-w-[130px]">Nilai Evaluasi / Kuis</th>
                  <th className="py-3 px-4 text-center min-w-[140px]">Aktivitas Terakhir</th>
                  <th className="py-3 px-3 text-center w-20">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Users className="w-8 h-8 text-slate-300" />
                        <p className="font-semibold text-slate-500">Tidak ada data siswa yang cocok.</p>
                        <p className="text-[11px] text-slate-400">Coba ubah kata kunci pencarian atau ganti filter status di atas.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student, idx) => {
                    const isMax = student.totalXP >= TOTAL_MAX_XP || student.completedModelsCount === 6
                    const xpPercent = Math.min(100, Math.round((student.totalXP / TOTAL_MAX_XP) * 100))
                    const lastActiveStr = formatIndonesianDateTime(student.lastCompletedAt)

                    // Initials for avatar
                    const initials = (student.name || 'S')
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()

                    return (
                      <tr
                        key={student.userId || idx}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        {/* 1. No */}
                        <td className="py-3.5 px-3 text-center font-mono text-slate-500 font-bold">
                          {idx + 1}
                        </td>

                        {/* 2. Nama Lengkap Siswa */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                              {initials}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900 text-xs">
                                {student.name || 'Siswa'}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                ID: {student.userId.substring(0, 12)}...
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 3. Email / Kelas */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col gap-1 items-start">
                            <span className="text-slate-600 text-[11px] truncate max-w-[170px]" title={student.email || 'Tanpa Email'}>
                              {student.email || <span className="text-slate-400 italic">Mode Tamu</span>}
                            </span>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                              {student.classCode || 'KIM-X-FASE-E'}
                            </span>
                          </div>
                        </td>

                        {/* 4. Progres Belajar (6 Model Atom) */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex flex-col items-center">
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
                                    className={`w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black border transition-transform hover:scale-110 cursor-help ${
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
                            <div className="flex items-center gap-1 mt-1 text-[10px]">
                              <span className="font-bold text-slate-700">
                                {student.completedModelsCount} / 6 Model
                              </span>
                              <span className="text-slate-400 font-normal">
                                ({Math.round((student.completedModelsCount / 6) * 100)}%)
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 5. Total Poin XP (0–600 XP) */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex flex-col items-center">
                            <div className="flex items-center gap-1.5 font-mono font-black text-xs text-slate-900">
                              <span
                                className={`px-2.5 py-0.5 rounded-full border shadow-2xs ${
                                  isMax
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                    : student.totalXP >= 300
                                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                                    : student.totalXP > 0
                                    ? 'bg-blue-50 text-blue-800 border-blue-200'
                                    : 'bg-slate-100 text-slate-500 border-slate-200'
                                }`}
                              >
                                {student.totalXP} / 600 XP
                              </span>
                              <span className="text-[10px] text-slate-500 font-normal">
                                ({xpPercent}%)
                              </span>
                            </div>

                            {/* Progress bar */}
                            <div className="w-28 h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1.5">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  isMax
                                    ? 'bg-emerald-500'
                                    : student.totalXP >= 300
                                    ? 'bg-amber-500'
                                    : 'bg-blue-500'
                                }`}
                                style={{ width: `${xpPercent}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* 6. Nilai Evaluasi / Kuis */}
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

                        {/* 7. Tanggal & Waktu Aktivitas Terakhir */}
                        <td className="py-3.5 px-4 text-center text-slate-600">
                          <div className="flex items-center justify-center gap-1 text-[11px]">
                            <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{lastActiveStr}</span>
                          </div>
                        </td>

                        {/* 8. Aksi Detail */}
                        <td className="py-3.5 px-3 text-center">
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
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-900">
                      Rincian Belajar: {selectedStudentDetail.name}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Kelas: {selectedStudentDetail.classCode} • Total: {selectedStudentDetail.totalXP} / 600 XP ({selectedStudentDetail.completedModelsCount} / 6 Model Selesai)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStudentDetail(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
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
                  const isModelDone = stage1 && stage2 && stage3 && stage4

                  return (
                    <div
                      key={model.id}
                      className={`p-3 rounded-2xl border flex flex-col gap-2 ${
                        isModelDone
                          ? 'bg-emerald-50/60 border-emerald-200'
                          : modelXP > 0
                          ? 'bg-slate-50 border-slate-200'
                          : 'bg-slate-50/40 border-slate-200/60 opacity-70'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-slate-900">{model.name}</span>
                          {isModelDone && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                              Tuntas
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-xs font-bold text-indigo-700 bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
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
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition cursor-pointer"
              >
                Tutup Rincian
              </button>
            </div>
          </div>
        )}

        {/* ── Modal Bottom Bar ─────────────────────────────────────────────── */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0 flex-wrap">
          <span className="text-[11px] text-slate-500 font-medium">
            💡 <strong>Panduan Guru:</strong> Kolom <strong>Poin Eksplorasi</strong> mencatat keaktifan proses (maks 600 XP), sedangkan <strong>Nilai Uji Konsep</strong> mencatat skor penguasaan kuis akhir (skor 0–100).
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
