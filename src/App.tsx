import { useState, useEffect } from 'react'
import {
  Atom,
  Clock,
  HelpCircle,
  Layers,
  Library,
  X,
  ExternalLink,
  UserCheck,
  LogOut,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react'
import { ATOM_MODELS } from './data/atomModels'
import { HomeView } from './components/home/HomeView'
import { ComparisonView } from './components/comparison/ComparisonView'
import { QuizWorkspace } from './components/quiz/QuizWorkspace'
import { TimelineWorkspace } from './components/timeline/TimelineWorkspace'
import {
  authService,
  SyncService,
  type UserAccess,
  type GuestResultsSummary
} from './lib'

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'timeline' | 'comparison' | 'quiz'>('home')
  const [timelineModelId, setTimelineModelId] = useState<string>('democritus')

  // Status Autentikasi dari SDK
  const [userAccess, setUserAccess] = useState<UserAccess>(() => authService.getAccess())

  // Modal State
  const [showGlobalBibliographyModal, setShowGlobalBibliographyModal] = useState<boolean>(false)
  const [showGoogleLoginModal, setShowGoogleLoginModal] = useState<boolean>(false)
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false)
  const [showGuestMigrationModal, setShowGuestMigrationModal] = useState<boolean>(false)
  const [guestSummary, setGuestSummary] = useState<GuestResultsSummary | null>(null)
  const [unsentCount, setUnsentCount] = useState<number>(0)
  const [confirmWipeData, setConfirmWipeData] = useState<boolean>(false)

  // Form input login Google simulasi
  const [studentNameInput, setStudentNameInput] = useState<string>('Budi Santoso')
  const [classCodeInput, setClassCodeInput] = useState<string>('KIM-X-FASE-E')

  // Listener Sesi SDK untuk pembaruan akun aktif
  // Sesuai aturan: "Perbarui ID akun aktif dari listener sesi SDK"
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((access) => {
      setUserAccess(access)
      setUnsentCount(SyncService.getUnsentItemsCount())
    })
    return unsubscribe
  }, [])

  const navigateToTimelineWithModel = (modelId?: string) => {
    if (modelId) {
      setTimelineModelId(modelId)
    } else {
      setTimelineModelId('democritus')
    }
    setCurrentView('timeline')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Masuk dengan Google
  const handleLoginWithGoogle = async () => {
    await authService.loginWithGoogle({
      customName: studentNameInput.trim() || 'Siswa Kimia',
      classCode: classCodeInput.trim() || 'KIM-X-FASE-E',
      schoolName: 'SMA Negeri 1 Jakarta',
    })
    setShowGoogleLoginModal(false)

    // Tawarkan pemilihan hasil tamu; jangan otomatis menganggap hasil perangkat milik orang yang baru login!
    const unclaimed = SyncService.getUnclaimedGuestResults()
    if (unclaimed) {
      setGuestSummary(unclaimed)
      setShowGuestMigrationModal(true)
    }
  }

  // Resolusi Hasil Tamu: Tautkan ke Akun Saya
  const handleClaimGuestResults = () => {
    if (userAccess.userId) {
      SyncService.claimGuestResultsToAccount(userAccess.userId)
    }
    setShowGuestMigrationModal(false)
    setGuestSummary(null)
  }

  // Resolusi Hasil Tamu: Biarkan Terpisah / Mulai Sesi Baru
  const handleDismissGuestResults = () => {
    SyncService.dismissGuestResults()
    setShowGuestMigrationModal(false)
    setGuestSummary(null)
  }

  // Buka Modal Logout dengan pengecekan data belum terkirim
  const handleOpenLogoutModal = () => {
    setUnsentCount(SyncService.getUnsentItemsCount())
    setConfirmWipeData(false)
    setShowLogoutModal(true)
  }

  // Eksekusi Logout
  const handleConfirmLogout = (wipeDevice: boolean) => {
    authService.logout(wipeDevice)
    setShowLogoutModal(false)
    setConfirmWipeData(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/40 text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-slate-200/80 px-4 lg:px-8 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div
            onClick={() => {
              setCurrentView('home')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/25 text-white group-hover:scale-105 transition-transform">
              <Atom className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  AtomLab
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                  Fase E • Kimia SMA
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Media Pembelajaran Interaktif Model Atom</p>
            </div>
          </div>

          {/* Center Navigation Pills */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => {
                setCurrentView('home')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
                currentView === 'home'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Beranda
            </button>
            <button
              onClick={() => navigateToTimelineWithModel()}
              className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                currentView === 'timeline'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Model Atom (Alur Runtut)</span>
            </button>
            <button
              onClick={() => {
                setCurrentView('comparison')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                currentView === 'comparison'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Perbandingan</span>
            </button>
            <button
              onClick={() => {
                setCurrentView('quiz')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                currentView === 'quiz'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Uji Konsep (10 Soal)</span>
            </button>
          </nav>

          {/* Right Auth & Class Identity Section */}
          <div className="flex items-center gap-2">
            {!userAccess.isAuthenticated ? (
              <>
                <span className="hidden lg:inline-flex px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
                  Mode Tamu (Belajar Bebas)
                </span>

                {/* Tombol Masuk dengan Google */}
                <button
                  onClick={() => setShowGoogleLoginModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-300 shadow-xs flex items-center gap-2 cursor-pointer transition hover:border-indigo-400"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Masuk dengan Google</span>
                </button>
              </>
            ) : (
              <>
                {/* Akun kelas memakai alias dari getAccess */}
                <span className="hidden sm:inline-flex px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold items-center gap-1.5 shadow-2xs">
                  <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{userAccess.alias}</span>
                </span>

                {/* Tombol Keluar */}
                <button
                  onClick={handleOpenLogoutModal}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 shadow-xs flex items-center gap-1.5 cursor-pointer transition"
                  title="Keluar dari akun kelas"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-600" />
                  <span>Keluar</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Dynamic View Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-8">
        
        {/* VIEW 1: BERANDA */}
        {currentView === 'home' && (
          <HomeView
            onNavigateToTimeline={() => navigateToTimelineWithModel('democritus')}
            onNavigateToComparison={() => {
              setCurrentView('comparison')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            onNavigateToSimulation={(modelId) => navigateToTimelineWithModel(modelId)}
            onNavigateToQuiz={() => {
              setCurrentView('quiz')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
        )}

        {/* VIEW 2: TABEL PERBANDINGAN */}
        {currentView === 'comparison' && (
          <ComparisonView
            onBackToHome={() => {
              setCurrentView('home')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            onSelectModel={(modelId) => navigateToTimelineWithModel(modelId)}
          />
        )}

        {/* VIEW 3: UJI PEMAHAMAN KONSEP (10 Soal Variatif) */}
        {currentView === 'quiz' && (
          <QuizWorkspace
            onBackToHome={() => {
              setCurrentView('home')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            onOpenGoogleLogin={() => setShowGoogleLoginModal(true)}
          />
        )}

        {/* VIEW 4: TAHAPAN KRONOLOGIS PERKEMBANGAN MODEL ATOM */}
        {currentView === 'timeline' && (
          <TimelineWorkspace
            key={timelineModelId}
            initialModelId={timelineModelId}
            onBackToHome={() => {
              setCurrentView('home')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            onNavigateToQuiz={() => {
              setCurrentView('quiz')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-12 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-3">
          <button
            onClick={() => setShowGlobalBibliographyModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 font-bold text-xs transition shadow-xs cursor-pointer"
          >
            <Library className="w-4 h-4 text-indigo-600" />
            <span>Lihat Daftar Pustaka Lengkap Seluruh Web ({ATOM_MODELS.reduce((acc, m) => acc + m.references.length, 0)} Sumber Terverifikasi)</span>
          </button>
          <p className="font-semibold text-slate-600">© 2026 Web Pembelajaran Model-Model Atom (AtomLab) • Dirancang untuk Siswa SMA Kelas X (Fase E)</p>
          <p className="text-slate-400">Seluruh materi ilmiah diverifikasi berbasis buku teks standar universitas (Chang, Brown, Petrucci) dan Capaian Pembelajaran Kurikulum Merdeka (Kemendikbudristek RI).</p>
        </div>
      </footer>

      {/* ── MODAL 1: MASUK DENGAN GOOGLE (Dialog Autentikasi Siswa) ────────────── */}
      {showGoogleLoginModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Masuk dengan Akun Google</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Sinkronisasi hasil belajar ke kelas kimia Anda</p>
                </div>
              </div>
              <button
                onClick={() => setShowGoogleLoginModal(false)}
                className="w-8 h-8 rounded-xl hover:bg-slate-100 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-2xl text-indigo-950 font-medium leading-relaxed">
                💡 <strong>Belajar tanpa login tetap berfungsi penuh!</strong> Masuk dengan akun Google opsional bagi Anda yang ingin mencatat skor resmi ke dasbor guru.
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nama Siswa / Pengguna:</label>
                <input
                  type="text"
                  value={studentNameInput}
                  onChange={(e) => setStudentNameInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium text-slate-800 focus:outline-indigo-500"
                  placeholder="Contoh: Budi Santoso"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Kode Kelas Kimia:</label>
                <input
                  type="text"
                  value={classCodeInput}
                  onChange={(e) => setClassCodeInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-slate-800 uppercase focus:outline-indigo-500"
                  placeholder="Contoh: KIM-X-FASE-E"
                />
                <span className="text-[10px] text-slate-400">Alias kelas akan otomatis diformat: [Nama] ([Kode Kelas])</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={handleLoginWithGoogle}
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <span>Masuk Sekarang</span>
              </button>
              <button
                onClick={() => setShowGoogleLoginModal(false)}
                className="w-full py-2.5 rounded-xl text-slate-500 hover:text-slate-800 font-bold text-xs cursor-pointer"
              >
                Lanjutkan Sebagai Tamu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: RESOLUSI HASIL TAMU (Shared Device Choice) ──────────────── */}
      {/* Sesuai aturan: "Tawarkan pemilihan hasil tamu; jangan otomatis menganggap hasil perangkat milik orang yang baru login." */}
      {showGuestMigrationModal && guestSummary && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-2 border-amber-300 flex flex-col gap-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg shrink-0">
                🔔
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">Ditemukan Hasil Kuis Sesi Tamu</h3>
                <p className="text-[11px] text-slate-500 font-medium">Perangkat ini memiliki riwayat evaluasi dari sesi sebelumnya</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between font-mono font-bold text-slate-700">
                <span>ID Percobaan: {guestSummary.attemptId}</span>
                <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  Skor: {guestSummary.firstAttemptScore} / 100
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed font-medium mt-1">
                Apakah hasil evaluasi ini dikerjakan oleh Anda dan ingin ditautkan ke akun Anda (<strong>{userAccess.alias}</strong>), ataukah ini milik orang lain di perangkat bersama ini?
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
              <button
                onClick={handleClaimGuestResults}
                className="w-full sm:flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md shadow-indigo-600/25 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Tautkan Hasil Tamu ke Akun Saya</span>
              </button>

              <button
                onClick={handleDismissGuestResults}
                className="w-full sm:flex-1 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-300 cursor-pointer"
              >
                Biarkan Terpisah / Mulai Sesi Baru
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 3: LOGOUT DENGAN PERINGATAN DATA & PERANGKAT BERSAMA ────────── */}
      {/* Sesuai aturan: "Logout menjelaskan hasil belum terkirim dan pilihan perangkat bersama; konfirmasi sebelum penghapusan." */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
                  <LogOut className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Konfirmasi Keluar (Logout)</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Akun aktif: {userAccess.alias}</p>
                </div>
              </div>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="w-8 h-8 rounded-xl hover:bg-slate-100 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Peringatan Hasil Belum Terkirim */}
            {unsentCount > 0 ? (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Peringatan Berkas Belum Terkirim:</span>
                  <p className="leading-relaxed text-[11px] mt-0.5">
                    Ada <strong>{unsentCount} hasil kuis</strong> yang belum terkirim ke server riset (status: lokal / gagal). Data ini tetap tersimpan aman di penyimpanan perangkat lokal ini.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Seluruh hasil evaluasi Anda telah tersimpan secara aman.</span>
              </div>
            )}

            {/* Penjelasan Perangkat Bersama */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 space-y-2">
              <span className="font-bold text-slate-900 block">Perhatian untuk Perangkat Bersama (Laboratorium Sekolah / Warnet):</span>
              <p className="text-[11px] leading-relaxed text-slate-600">
                Jika komputer ini digunakan bergantian dengan siswa lain, Anda dapat memilih untuk membersihkan seluruh data sesi agar riwayat jawaban Anda tidak dapat dilihat oleh pengguna berikutnya.
              </p>

              <label className="flex items-start gap-2 pt-1 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={confirmWipeData}
                  onChange={(e) => setConfirmWipeData(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                />
                <span className="text-[11px] font-bold text-rose-800">
                  Saya mengonfirmasi ingin menghapus seluruh data sesi akun saya dari perangkat ini saat keluar.
                </span>
              </label>
            </div>

            {/* Pilihan Tombol Logout */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <button
                onClick={() => handleConfirmLogout(false)}
                className="w-full sm:flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer"
              >
                Keluar Saja (Simpan Data Lokal)
              </button>

              <button
                onClick={() => handleConfirmLogout(true)}
                disabled={!confirmWipeData}
                className="w-full sm:flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs transition shadow-xs cursor-pointer"
              >
                Keluar &amp; Bersihkan Perangkat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 4: GLOBAL MASTER BIBLIOGRAPHY ─────────────────────────────── */}
      {showGlobalBibliographyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 flex flex-col gap-4 max-h-[85vh] overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <Library className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Daftar Pustaka &amp; Rujukan Akademik Lengkap</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Buku teks internasional, jurnal ilmiah primer, dan dokumen kurikulum resmi</p>
                </div>
              </div>
              <button
                onClick={() => setShowGlobalBibliographyModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pr-1">
              {ATOM_MODELS.map((model) => (
                <div key={model.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full bg-gradient-to-tr ${model.theme.gradient}`} />
                      <h4 className="font-black text-slate-900 text-xs sm:text-sm">{model.name} ({model.scientist})</h4>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      {model.references.length} Rujukan
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {model.references.map((ref, idx) => (
                      <div key={ref.id} className="p-3 rounded-xl bg-white border border-slate-200 text-xs flex flex-col gap-1.5 shadow-2xs">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-slate-500 text-[10px]">[{idx + 1}] {ref.type.toUpperCase()}</span>
                          <span className="text-[10px] font-mono text-slate-400">{ref.sourceName} ({ref.year})</span>
                        </div>
                        <p className="font-serif text-slate-800 font-medium leading-relaxed">{ref.citation}</p>
                        {ref.url && (
                          <a
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:underline pt-0.5"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Tautan Sumber</span>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowGlobalBibliographyModal(false)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md cursor-pointer hover:bg-indigo-700"
            >
              Tutup Daftar Pustaka
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
