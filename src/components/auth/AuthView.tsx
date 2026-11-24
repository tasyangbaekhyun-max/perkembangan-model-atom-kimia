import { useState, useId } from 'react'
import {
  Atom,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  X,
  GraduationCap
} from 'lucide-react'
import { authService, type UserAccess, isFirebaseConfigured, firebaseConfig } from '../../lib'

type AuthMode = 'login' | 'register' | 'forgot'

interface AuthViewProps {
  onSuccessLogin: (userAccess: UserAccess) => void
  onContinueAsGuest: () => void
}

export function AuthView({ onSuccessLogin, onContinueAsGuest }: AuthViewProps) {
  const rememberCheckboxId = useId()
  const [mode, setMode] = useState<AuthMode>('login')

  // Form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [classCode, setClassCode] = useState('KIM-X-FASE-E')
  const [role, setRole] = useState<'student' | 'teacher'>('student')
  const [lockedRole, setLockedRole] = useState<'student' | 'teacher' | null>(null)
  const [teacherPasskey, setTeacherPasskey] = useState('')
  const [showTeacherPasskey, setShowTeacherPasskey] = useState(false)
  const [rememberDevice, setRememberDevice] = useState(true)

  // Password visibility
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Forgot password state
  const [forgotStep, setForgotStep] = useState<1 | 2>(1)
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)

  // Google Modal State
  const [showGoogleModal, setShowGoogleModal] = useState(false)
  const [googleNameInput, setGoogleNameInput] = useState('Budi Santoso')
  const [googleEmailInput, setGoogleEmailInput] = useState('budi.santoso@gmail.com')
  const [googleClassInput, setGoogleClassInput] = useState('KIM-X-FASE-E')
  const [googleRole, setGoogleRole] = useState<'student' | 'teacher'>('student')

  const resetMessages = () => {
    setErrorMessage(null)
    setSuccessMessage(null)
  }

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode)
    resetMessages()
    setForgotStep(1)
    if (newMode !== 'register') {
      setLockedRole(null)
    }
  }

  const handleRegisterAsTeacher = () => {
    setRole('teacher')
    setLockedRole('teacher')
    setMode('register')
    resetMessages()
  }

  const handleRegisterAsStudent = () => {
    setRole('student')
    setLockedRole('student')
    setMode('register')
    resetMessages()
  }

  // 1. LOGIN HANDLER
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    resetMessages()

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Silakan lengkapi alamat email dan kata sandi kamu.')
      return
    }

    if (role === 'student' && !classCode.trim()) {
      setErrorMessage('Silakan masukkan Kode Kelas kamu agar dapat masuk ke rombel kelas yang sesuai.')
      return
    }

    setIsLoading(true)
    try {
      const res = await authService.loginWithEmail({
        email,
        password,
        rememberDevice,
        classCode: role === 'student' ? classCode.trim().toUpperCase() : undefined,
        role,
      })

      if (res.success && res.user) {
        onSuccessLogin(res.user)
      } else {
        setErrorMessage(res.error || 'Gagal masuk. Periksa kembali email dan kata sandi Anda.')
      }
    } catch {
      setErrorMessage('Terjadi kesalahan saat masuk. Silakan coba beberapa saat lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  // 2. REGISTER HANDLER
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    resetMessages()

    if (!email.trim()) {
      setErrorMessage('Alamat email wajib diisi.')
      return
    }

    if (!password || password.length < 6) {
      setErrorMessage('Kata sandi minimal 6 karakter.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok. Harap periksa kembali.')
      return
    }

    if (role === 'student' && !classCode.trim()) {
      setErrorMessage('Kode Kelas wajib diisi untuk siswa agar masuk ke kelas kimia yang sesuai.')
      return
    }

    // Verifikasi Keamanan Khusus Mode Guru
    if (role === 'teacher') {
      const trimmedTeacherPasskey = teacherPasskey.trim()
      if (!trimmedTeacherPasskey) {
        setErrorMessage('Sandi Verifikasi Guru wajib diisi. Silakan cek sandi resmi di Buku Panduan Guru.')
        return
      }

      if (trimmedTeacherPasskey !== '1945IndonesiaMerdeka') {
        setErrorMessage(
          'Akses Ditolak: Sandi Verifikasi Guru salah! Jika Anda seorang murid, silakan daftar atau masuk sebagai murid saja. Jika Anda seorang guru, pastikan memasukkan sandi verifikasi resmi yang telah disediakan di Buku Panduan Guru.'
        )
        return
      }
    }

    setIsLoading(true)
    try {
      const res = await authService.registerWithEmail({
        name: fullName.trim() || undefined,
        email,
        password,
        confirmPassword,
        classCode: role === 'student' ? classCode.trim().toUpperCase() : (classCode.trim().toUpperCase() || 'GURU-KIMIA-X'),
        role,
        rememberDevice,
      })

      if (res.success && res.user) {
        setSuccessMessage('Pendaftaran berhasil! Mengalihkan ke ruang belajar...')
        setTimeout(() => {
          if (res.user) onSuccessLogin(res.user)
        }, 600)
      } else {
        setErrorMessage(res.error || 'Gagal mendaftar. Silakan coba kembali.')
      }
    } catch {
      setErrorMessage('Terjadi kendala saat registrasi. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  // 3. FORGOT PASSWORD STEP 1: Request Reset
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    resetMessages()

    if (!email.trim()) {
      setErrorMessage('Silakan masukkan alamat email akun kamu.')
      return
    }

    setIsLoading(true)
    try {
      const res = await authService.requestPasswordReset(email)
      if (res.success) {
        if (res.token) {
          // Mode kode token lokal
          setResetToken(res.token)
          setForgotStep(2)
          setSuccessMessage(res.message || `Kode pemulihan: ${res.token} (Telah dikirim ke ${email}).`)
        } else {
          // Mode live Firebase (link reset dikirim ke email asli pengguna)
          setSuccessMessage(res.message || `Tautan pemulihan kata sandi telah dikirim ke email ${email}. Silakan cek kotak masuk Anda.`)
        }
      } else {
        setErrorMessage(res.error || 'Email tidak ditemukan dalam sistem AtomLab.')
      }
    } catch {
      setErrorMessage('Gagal memproses permintaan reset kata sandi.')
    } finally {
      setIsLoading(false)
    }
  }

  // 4. FORGOT PASSWORD STEP 2: Save New Password
  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault()
    resetMessages()

    if (!newPassword || newPassword.length < 6) {
      setErrorMessage('Kata sandi baru minimal 6 karakter.')
      return
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMessage('Konfirmasi kata sandi baru tidak sama.')
      return
    }

    setIsLoading(true)
    try {
      const res = await authService.resetPassword({
        email,
        newPassword,
        confirmPassword: confirmNewPassword,
        token: resetToken,
      })

      if (res.success) {
        setSuccessMessage(res.message || 'Kata sandi berhasil diperbarui! Silakan masuk kembali.')
        setTimeout(() => {
          setPassword(newPassword)
          switchMode('login')
          setSuccessMessage('Kata sandi telah diperbarui! Silakan klik Masuk.')
        }, 1200)
      } else {
        setErrorMessage(res.error || 'Gagal memperbarui kata sandi.')
      }
    } catch {
      setErrorMessage('Gagal memperbarui kata sandi.')
    } finally {
      setIsLoading(false)
    }
  }

  // 5. GOOGLE AUTH HANDLER
  const handleGoogleAuth = async () => {
    resetMessages()
    if (isFirebaseConfigured()) {
      setIsLoading(true)
      try {
        const access = await authService.loginWithGoogle()
        onSuccessLogin(access)
      } catch (err: any) {
        setErrorMessage(err?.message || 'Gagal masuk dengan akun Google.')
      } finally {
        setIsLoading(false)
      }
    } else {
      setShowGoogleModal(true)
    }
  }

  const handleGoogleSubmit = async () => {
    if (googleRole === 'student' && !googleClassInput.trim()) {
      setErrorMessage('Kode Kelas wajib diisi untuk siswa agar masuk sesuai kelas masing-masing.')
      return
    }
    setIsLoading(true)
    setShowGoogleModal(false)
    try {
      const access = await authService.loginWithGoogle({
        customName: googleNameInput.trim() || (googleRole === 'teacher' ? 'Dr. Guru Kimia' : 'Siswa Kimia'),
        email: googleEmailInput.trim() || undefined,
        classCode: googleClassInput.trim().toUpperCase() || 'KIM-X-FASE-E',
        role: googleRole,
        rememberDevice,
      })
      onSuccessLogin(access)
    } catch (err: any) {
      setErrorMessage(err?.message || 'Gagal masuk dengan akun Google.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-3 sm:p-6 lg:p-10 font-sans selection:bg-blue-500 selection:text-white">
      
      {/* Outer Card Container matching the 2-column reference layout */}
      <div className="w-full max-w-6xl bg-white rounded-3xl sm:rounded-[36px] shadow-2xl shadow-indigo-100/70 border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        
        {/* ============================================================== */}
        {/* LEFT COLUMN: CUTE CHIBI ATOM EXPLORER ILLUSTRATION (5 Cols)   */}
        {/* ============================================================== */}
        <div className="lg:col-span-5 relative bg-[#fff4f0] p-6 sm:p-8 flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-rose-100/80">
          
          {/* Soft pastel ambient background blobs */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-72 h-72 bg-rose-200/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-purple-200/25 rounded-full blur-2xl pointer-events-none" />

          {/* Top Header / Welcome Tag */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-rose-700 text-[11px] font-extrabold shadow-2xs border border-rose-200/80 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
              <span>Petualangan Model Atom • Fase E SMA</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight leading-snug">
              Halo Penjelajah Cilik!{' '}
              <span className="text-rose-600 block sm:inline">Yuk Eksplorasi Atom! ⚛️</span>
            </h1>
            <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
              Temukan misteri 6 model atom mulai dari bola pejal Democritus hingga awan mekanika kuantum.
            </p>
          </div>

          {/* Cute Character & Atomic Relics Showcase */}
          <div className="relative my-4 flex flex-col items-center justify-center">
            
            {/* Main Chibi Scientist Image */}
            <div className="relative w-full max-w-[340px] aspect-square rounded-3xl overflow-hidden shadow-xl shadow-rose-200/50 border-4 border-white group">
              <img
                src="/atomlab_login_mascot.jpg"
                alt="Chibi Atom Explorer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />

              {/* Floating Little Badge: Democritus -> Kuantum */}
              <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-md rounded-2xl p-2.5 shadow-md border border-white/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-black shadow-2xs">
                    Au
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] font-black text-slate-800 leading-tight">6 Evolusi Model Atom</p>
                    <p className="text-[9px] font-bold text-rose-500">Democritus s.d Kuantum</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                  Lengkap 🔬
                </span>
              </div>
            </div>

            {/* Kawaii Model Atom Pills Floating Below */}
            <div className="w-full max-w-[340px] grid grid-cols-3 gap-1.5 mt-3">
              <div className="bg-white/80 border border-amber-200/80 rounded-xl p-1.5 text-center shadow-2xs">
                <span className="text-[10px] block font-black text-amber-900">Democritus</span>
                <span className="text-[8px] text-amber-700 font-medium">Atomos Pejal</span>
              </div>
              <div className="bg-white/80 border border-purple-200/80 rounded-xl p-1.5 text-center shadow-2xs">
                <span className="text-[10px] block font-black text-purple-900">Thomson &amp; Bohr</span>
                <span className="text-[8px] text-purple-700 font-medium">Elektron &amp; Orbit</span>
              </div>
              <div className="bg-white/80 border border-sky-200/80 rounded-xl p-1.5 text-center shadow-2xs">
                <span className="text-[10px] block font-black text-sky-900">Kuantum</span>
                <span className="text-[8px] text-sky-700 font-medium">Awan Probabilitas</span>
              </div>
            </div>

          </div>

          {/* Bottom Trust & Educational Highlights */}
          <div className="relative z-10 pt-2 border-t border-rose-200/60 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-700">
              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[9px] font-bold">✓</span>
              <span>Laboratorium Interaktif &amp; Simulasi Nyata</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-700">
              <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[9px] font-bold">✓</span>
              <span>25 Kuis Evaluasi Mencegah Miskonsepsi Kimia</span>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: LOGIN / REGISTER / LUPA SANDI FORM (7 Cols)      */}
        {/* ============================================================== */}
        <div className="lg:col-span-7 bg-white/95 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
          
          <div className="max-w-md w-full mx-auto flex flex-col">
            
            {/* Brand Logo Header matching reference */}
            <div className="flex items-center justify-between pb-6 mb-4 border-b border-rose-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
                  <Atom className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black tracking-tight text-slate-900 leading-none">
                    my<span className="text-rose-500">Edlinks</span>
                    <span className="text-[11px] font-bold text-slate-400 ml-1.5">• AtomLab</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Smart Chemistry Learning Portal</span>
                </div>
              </div>

              {/* Guest / Explore directly button */}
              <button
                type="button"
                onClick={onContinueAsGuest}
                className="text-xs font-bold text-slate-600 hover:text-rose-600 px-3 py-1.5 rounded-xl hover:bg-rose-50/60 border border-rose-100 transition flex items-center gap-1 cursor-pointer"
                title="Masuk sebagai Siswa Tamu tanpa login"
              >
                <span>Mode Tamu</span>
                <ArrowRight className="w-3.5 h-3.5 text-rose-500" />
              </button>
            </div>

            {/* Status Koneksi Firebase Live */}
            <div className="mb-4">
              {isFirebaseConfigured() ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Firebase Terhubung (Live Auth &amp; Firestore)</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Mode Demo Lokal (Isi .env.local untuk Live Firebase)</span>
                </div>
              )}
            </div>

            {/* Greeting Heading & Subtitle */}
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {mode === 'login' && 'Hai, selamat datang kembali'}
                {mode === 'register' && (role === 'teacher' ? 'Daftar Akun Guru' : 'Daftar Akun Murid')}
                {mode === 'forgot' && 'Atur Ulang Kata Sandi'}
              </h2>

              <div className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5">
                {mode === 'login' && (
                  <div className="flex flex-col gap-1 text-xs sm:text-sm text-slate-600">
                    <div>
                      Apakah anda seorang guru?{' '}
                      <button
                        type="button"
                        onClick={handleRegisterAsTeacher}
                        className="text-rose-600 font-bold hover:underline cursor-pointer"
                      >
                        Daftar Gratis
                      </button>
                    </div>
                    <div>
                      Apakah anda seorang murid?{' '}
                      <button
                        type="button"
                        onClick={handleRegisterAsStudent}
                        className="text-rose-600 font-bold hover:underline cursor-pointer"
                      >
                        Daftar Gratis
                      </button>
                    </div>
                  </div>
                )}
                {mode === 'register' && (
                  <div className="flex flex-col gap-1">
                    <p>
                      Sudah memiliki akun?{' '}
                      <button
                        type="button"
                        onClick={() => switchMode('login')}
                        className="text-rose-600 font-bold hover:underline cursor-pointer"
                      >
                        Masuk di Sini
                      </button>
                    </p>
                    {lockedRole === 'teacher' ? (
                      <p className="text-[11px] text-slate-500">
                        Bukan guru?{' '}
                        <button
                          type="button"
                          onClick={handleRegisterAsStudent}
                          className="text-rose-600 font-bold hover:underline cursor-pointer"
                        >
                          Daftar sebagai murid
                        </button>
                      </p>
                    ) : lockedRole === 'student' ? (
                      <p className="text-[11px] text-slate-500">
                        Bukan murid?{' '}
                        <button
                          type="button"
                          onClick={handleRegisterAsTeacher}
                          className="text-rose-600 font-bold hover:underline cursor-pointer"
                        >
                          Daftar sebagai guru
                        </button>
                      </p>
                    ) : null}
                  </div>
                )}
                {mode === 'forgot' && (
                  <p>
                    Sudah ingat kata sandi kamu?{' '}
                    <button
                      type="button"
                      onClick={() => switchMode('login')}
                      className="text-rose-600 font-bold hover:underline cursor-pointer"
                    >
                      Kembali ke Masuk
                    </button>
                  </p>
                )}
              </div>
            </div>

            {/* Alert Messages (Error / Success) */}
            {errorMessage && !errorMessage.includes('Sandi Verifikasi Guru') && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                <div className="flex-1 space-y-2">
                  <p className="leading-relaxed">{errorMessage}</p>
                  {errorMessage.includes('Firebase Console') && (
                    <div>
                      <a
                        href={`https://console.firebase.google.com/project/${firebaseConfig.projectId || 'proyek-cad24'}/authentication/providers`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 text-white font-medium hover:bg-rose-700 transition shadow-sm text-xs cursor-pointer"
                      >
                        <span>Buka Firebase Console Proyek Ini ↗</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {successMessage && (
              <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-start gap-2.5 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span className="leading-relaxed">{successMessage}</span>
              </div>
            )}

            {/* ============================================================== */}
            {/* FORM 1: LOGIN MODE                                             */}
            {/* ============================================================== */}
            {mode === 'login' && (
              <form onSubmit={handleLogin} className="flex flex-col gap-3.5">
                
                {/* PILIHAN PERAN MASUK (Mode Siswa vs Mode Guru) */}
                <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl mb-1">
                  <button
                    type="button"
                    onClick={() => {
                      setRole('student')
                      resetMessages()
                    }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      role === 'student'
                        ? 'bg-white text-rose-600 shadow-2xs border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>👤 Mode Siswa</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRole('teacher')
                      resetMessages()
                    }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      role === 'teacher'
                        ? 'bg-rose-500 text-white shadow-2xs font-extrabold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>🎓 Mode Guru</span>
                  </button>
                </div>

                {/* Kolom Khusus KODE KELAS untuk Mode Siswa */}
                {role === 'student' && (
                  <div className="space-y-1.5 animate-fade-in">
                    <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-rose-500" />
                        <span>Kode Kelas Kimia</span>
                      </span>
                      <span className="text-[10px] text-rose-600 font-bold px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200">
                        *Wajib Siswa
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={classCode}
                        onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                        placeholder="Contoh: KIM-X-FASE-E"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-rose-200/80 font-mono font-bold text-slate-800 text-sm placeholder:text-slate-400 uppercase focus:outline-none focus:border-rose-400 focus:ring-3 focus:ring-rose-100 transition bg-rose-50/20"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Siswa harus masuk sesuai kode kelas yang diberikan oleh guru masing-masing.
                    </p>
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-1.5">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={role === 'teacher' ? 'Email Guru (Contoh: guru@sekolah.sch.id)' : 'Email Siswa (Contoh: siswa@example.com)'}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-rose-200/80 font-medium text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-rose-400 focus:ring-3 focus:ring-rose-100 transition bg-rose-50/20"
                    />
                  </div>
                </div>

                {/* Password Field with Eye Toggle */}
                <div className="space-y-1.5">
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi kamu"
                      required
                      className="w-full px-4 py-3 pr-11 rounded-xl border border-rose-200/80 font-medium text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-rose-400 focus:ring-3 focus:ring-rose-100 transition bg-rose-50/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                      title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Warm Coral Masuk Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-extrabold text-sm shadow-md shadow-rose-500/25 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-1"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sedang Masuk...</span>
                    </span>
                  ) : (
                    <span>{role === 'teacher' ? 'Masuk sebagai Guru' : 'Masuk sebagai Siswa'}</span>
                  )}
                </button>

                {/* Lupa Kata Sandi Link */}
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => switchMode('forgot')}
                    className="text-xs font-bold text-rose-600 hover:text-rose-800 hover:underline cursor-pointer"
                  >
                    Lupa kata sandi?
                  </button>
                </div>
              </form>
            )}

            {/* ============================================================== */}
            {/* FORM 2: REGISTER MODE                                          */}
            {/* ============================================================== */}
            {mode === 'register' && (
              <form onSubmit={handleRegister} className="flex flex-col gap-3.5">
                
                {/* STRICT ROLE PRESENTATION: Locked based on initial button clicked */}
                {lockedRole ? (
                  <div className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-between ${
                    lockedRole === 'teacher'
                      ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                      : 'bg-rose-50/80 border-rose-200 text-rose-900'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="text-base">{lockedRole === 'teacher' ? '🎓' : '👤'}</span>
                      <div>
                        <div className="font-bold">
                          {lockedRole === 'teacher' ? 'Pendaftaran Mode Guru' : 'Pendaftaran Mode Murid'}
                        </div>
                        <div className="text-[11px] font-normal opacity-80">
                          {lockedRole === 'teacher' ? 'Akses penuh kelola materi & kuis' : 'Akses eksplorasi materi & asesmen siswa'}
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-white/80 border border-current text-[10px] font-bold uppercase tracking-wider">
                      Terkunci
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setRole('student')}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        role === 'student'
                          ? 'bg-white text-rose-600 shadow-2xs border border-slate-200'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>👤 Mode Siswa</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('teacher')}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        role === 'teacher'
                          ? 'bg-rose-500 text-white shadow-2xs font-extrabold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>🎓 Mode Guru</span>
                    </button>
                  </div>
                )}

                {role === 'teacher' && (
                  <div className="p-3 bg-amber-50/90 border border-amber-200 rounded-xl text-amber-900 text-xs font-medium leading-relaxed">
                    💡 <strong>Mode Guru:</strong> Anda akan memiliki hak akses penuh untuk mengelola materi (CRUD) dan butir soal kuis tanpa pembatasan Lock Materi.
                  </div>
                )}
                
                {/* Nama Lengkap */}
                <div className="relative">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={role === 'teacher' ? 'Nama Guru & Gelar (Contoh: Dra. Siti Rahma, M.Pd)' : 'Nama Lengkap Siswa (Contoh: Budi Santoso)'}
                    className="w-full px-4 py-3 rounded-xl border border-rose-200/80 font-medium text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-rose-400 focus:ring-3 focus:ring-rose-100 transition bg-rose-50/20"
                  />
                </div>

                {/* Email */}
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Contoh: email@example.com"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-rose-200/80 font-medium text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-rose-400 focus:ring-3 focus:ring-rose-100 transition bg-rose-50/20"
                  />
                </div>

                {/* Password with Eye */}
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi kamu (min. 6 karakter)"
                    required
                    className="w-full px-4 py-3 pr-11 rounded-xl border border-rose-200/80 font-medium text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-rose-400 focus:ring-3 focus:ring-rose-100 transition bg-rose-50/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Konfirmasi Password with Eye */}
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Konfirmasi kata sandi kamu"
                    required
                    className="w-full px-4 py-3 pr-11 rounded-xl border border-rose-200/80 font-medium text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-rose-400 focus:ring-3 focus:ring-rose-100 transition bg-rose-50/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Kode Kelas Khusus Mode Siswa (Wajib Diisi) */}
                {role === 'student' && (
                  <div className="space-y-1.5 animate-fade-in">
                    <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-rose-500" />
                        <span>Kode Kelas Kimia</span>
                      </span>
                      <span className="text-[10px] text-rose-600 font-bold px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200">
                        *Wajib Siswa
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={classCode}
                        onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                        placeholder="Contoh: KIM-X-FASE-E"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-rose-200/80 font-mono font-bold text-slate-800 text-sm placeholder:text-slate-400 uppercase focus:outline-none focus:border-rose-400 focus:ring-3 focus:ring-rose-100 transition bg-rose-50/20"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Siswa wajib mendaftar menggunakan kode kelas yang diberikan oleh guru kimia Anda.
                    </p>
                  </div>
                )}

                {/* Kolom Khusus SANDI VERIFIKASI GURU (Hanya Tampil Jika Mode Guru) */}
                {role === 'teacher' && (
                  <div className="p-3.5 rounded-2xl bg-amber-50/90 border-2 border-amber-300/80 shadow-xs flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                        <span>🔐 Sandi Verifikasi Guru</span>
                        <span className="text-[10px] text-rose-600 font-bold">*Wajib</span>
                      </label>
                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-100/90 px-2 py-0.5 rounded-md">
                        Cek Buku Panduan
                      </span>
                    </div>

                    <div className="relative">
                      <input
                        type={showTeacherPasskey ? 'text' : 'password'}
                        value={teacherPasskey}
                        onChange={(e) => {
                          setTeacherPasskey(e.target.value)
                          if (errorMessage?.includes('Sandi Verifikasi Guru')) {
                            setErrorMessage(null)
                          }
                        }}
                        placeholder="Masukkan sandi verifikasi guru resmi"
                        required
                        className={`w-full px-4 py-2.5 pr-11 rounded-xl border font-medium text-slate-900 text-sm placeholder:text-amber-700/50 focus:outline-none transition bg-white ${
                          errorMessage?.includes('Sandi Verifikasi Guru')
                            ? 'border-rose-500 ring-2 ring-rose-200'
                            : 'border-amber-300 focus:border-amber-500 focus:ring-3 focus:ring-amber-200'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowTeacherPasskey(!showTeacherPasskey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-700/60 hover:text-amber-900 cursor-pointer p-1"
                        title={showTeacherPasskey ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                      >
                        {showTeacherPasskey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* WARNING TEPAT DI BAWAH KOLOM SANDI VERIFIKASI GURU */}
                    {errorMessage && errorMessage.includes('Sandi Verifikasi Guru') ? (
                      <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2 animate-shake">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div className="space-y-1 leading-relaxed">
                          <p>{errorMessage}</p>
                          <div className="pt-1">
                            <button
                              type="button"
                              onClick={handleRegisterAsStudent}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] shadow-xs cursor-pointer transition"
                            >
                              <span>👉 Beralih &amp; Daftar Sebagai Murid Saja</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[10px] text-amber-800 font-medium leading-tight">
                        Sandi verifikasi khusus ini diberikan hanya kepada Guru Pengampu di Buku Panduan untuk mencegah siswa menyamar.
                      </p>
                    )}
                  </div>
                )}

                {/* Tombol Daftar */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-extrabold text-sm shadow-md shadow-rose-500/25 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-1"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Mendaftarkan Akun...</span>
                    </span>
                  ) : (
                    <span>{role === 'teacher' ? 'Daftar Sebagai Guru' : 'Daftar Sebagai Murid'}</span>
                  )}
                </button>
              </form>
            )}

            {/* ============================================================== */}
            {/* FORM 3: LUPA PASSWORD (RESET SANDI)                             */}
            {/* ============================================================== */}
            {mode === 'forgot' && (
              <div>
                {forgotStep === 1 ? (
                  <form onSubmit={handleRequestReset} className="flex flex-col gap-4">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Masukkan alamat email akun yang telah terdaftar. Kami akan memberikan token/kode pemulihan untuk mengatur ulang kata sandi kamu.
                    </p>

                    <div className="space-y-1.5">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Masukkan email terdaftar kamu"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-rose-200/80 font-medium text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-rose-400 focus:ring-3 focus:ring-rose-100 transition bg-rose-50/20"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-extrabold text-sm shadow-md shadow-rose-500/25 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                    >
                      {isLoading ? 'Memeriksa Email...' : 'Kirim Kode Pemulihan'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleConfirmReset} className="flex flex-col gap-3.5">
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
                      Kode verifikasi telah dibuat untuk <strong>{email}</strong>. Silakan buat kata sandi baru Anda:
                    </div>

                    {/* Reset Token / OTP */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Kode Pemulihan:</label>
                      <input
                        type="text"
                        value={resetToken}
                        onChange={(e) => setResetToken(e.target.value)}
                        placeholder="Contoh: ATOM-2026"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-rose-200 font-mono font-bold text-slate-800 text-sm focus:outline-none focus:border-rose-400"
                      />
                    </div>

                    {/* New Password */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Kata Sandi Baru:</label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Minimal 6 karakter"
                          required
                          className="w-full px-4 py-2.5 pr-11 rounded-xl border border-rose-200 font-medium text-slate-800 text-sm focus:outline-none focus:border-rose-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm New Password */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Ulangi Kata Sandi Baru:</label>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Ketik ulang kata sandi baru"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-rose-200 font-medium text-slate-800 text-sm focus:outline-none focus:border-rose-400"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-sm shadow-md shadow-emerald-600/25 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-1"
                    >
                      {isLoading ? 'Menyimpan Kata Sandi...' : 'Simpan Kata Sandi Baru'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* ============================================================== */}
            {/* SOCIAL AUTH SECTION (Matches Reference Image)                  */}
            {/* ============================================================== */}
            <div className="mt-6 flex flex-col gap-4">
              
              {/* Divider: "Atau masuk menggunakan" */}
              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-slate-200" />
                <span className="bg-white px-3 text-[11px] font-medium text-slate-400 whitespace-nowrap">
                  {mode === 'register' ? 'Atau daftar menggunakan' : 'Atau masuk menggunakan'}
                </span>
                <div className="w-full border-t border-slate-200" />
              </div>

              {/* Google Social Button (Facebook & Apple Dihilangkan Sesuai Permintaan) */}
              <div>
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  className="w-full py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 hover:border-slate-400 flex items-center justify-center gap-3 transition cursor-pointer group shadow-2xs font-bold text-xs text-slate-700 bg-white"
                  title={isFirebaseConfigured() ? 'Masuk dengan Google (Firebase)' : 'Masuk dengan Google (Akun Demo)'}
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
                  <span>{mode === 'register' ? 'Daftar Menggunakan Akun Google' : 'Masuk Menggunakan Akun Google'}</span>
                </button>
              </div>

              {/* Checkbox: Ingat perangkat ini */}
              <label htmlFor={rememberCheckboxId} className="flex items-center gap-2.5 mt-2 cursor-pointer select-none">
                <input
                  id={rememberCheckboxId}
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="w-4 h-4 rounded-md text-rose-500 focus:ring-rose-400 border-rose-300 cursor-pointer accent-rose-500"
                />
                <span className="text-xs font-semibold text-slate-700">
                  Ingat perangkat ini
                </span>
              </label>

              {/* Legal disclaimer matching reference */}
              <p className="text-[11px] text-slate-400 text-center leading-relaxed mt-2">
                Dengan melanjutkan, kamu menerima{' '}
                <a href="#terms" onClick={(e) => e.preventDefault()} className="text-rose-600 hover:underline">
                  Syarat Penggunaan
                </a>{' '}
                dan{' '}
                <a href="#privacy" onClick={(e) => e.preventDefault()} className="text-rose-600 hover:underline">
                  Kebijakan Privasi
                </a>{' '}
                kami.
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* ============================================================== */}
      {/* GOOGLE SIGN-IN MODAL POPUP                                     */}
      {/* ============================================================== */}
      {showGoogleModal && (
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
                  <p className="text-[11px] text-slate-500 font-medium">Autentikasi resmi untuk platform pendidikan</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="w-8 h-8 rounded-xl hover:bg-slate-100 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick account chooser cards */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold text-slate-500">Pilih Akun yang Tersedia di Perangkat:</span>
              
              <button
                type="button"
                onClick={() => {
                  setGoogleNameInput('Budi Santoso')
                  setGoogleEmailInput('budi.santoso@gmail.com')
                  setGoogleClassInput('KIM-X-FASE-E')
                  setGoogleRole('student')
                }}
                className={`p-3 rounded-2xl border text-left flex items-center justify-between cursor-pointer transition ${
                  googleEmailInput === 'budi.santoso@gmail.com'
                    ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-100'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                    BS
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-800">Budi Santoso</div>
                    <div className="text-[10px] text-slate-500">budi.santoso@gmail.com</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                  Siswa
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setGoogleNameInput('Dra. Siti Nurhaliza')
                  setGoogleEmailInput('siti.nurhaliza.guru@gmail.com')
                  setGoogleClassInput('GURU-KIMIA-X')
                  setGoogleRole('teacher')
                }}
                className={`p-3 rounded-2xl border text-left flex items-center justify-between cursor-pointer transition ${
                  googleEmailInput === 'siti.nurhaliza.guru@gmail.com'
                    ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-100'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    SN
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-800">Dra. Siti Nurhaliza</div>
                    <div className="text-[10px] text-slate-500">siti.nurhaliza.guru@gmail.com</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md">
                  Guru
                </span>
              </button>
            </div>

            {/* Custom inputs */}
            <div className="flex flex-col gap-2.5 pt-2 border-t border-slate-100 text-xs">
              <div>
                <label className="font-bold text-slate-700 text-[11px]">Nama Pengguna:</label>
                <input
                  type="text"
                  value={googleNameInput}
                  onChange={(e) => setGoogleNameInput(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-300 font-medium text-slate-800 focus:outline-blue-500 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 text-[11px]">Email Akun Google:</label>
                <input
                  type="email"
                  value={googleEmailInput}
                  onChange={(e) => setGoogleEmailInput(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-300 font-medium text-slate-800 focus:outline-blue-500 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 text-[11px] flex items-center justify-between">
                  <span>Kode Kelas Kimia:</span>
                  {googleRole === 'student' && (
                    <span className="text-[10px] text-rose-600 font-bold">*Wajib Siswa</span>
                  )}
                </label>
                <input
                  type="text"
                  value={googleClassInput}
                  onChange={(e) => setGoogleClassInput(e.target.value.toUpperCase())}
                  placeholder="Contoh: KIM-X-FASE-E"
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-slate-800 uppercase focus:outline-blue-500 text-xs"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={handleGoogleSubmit}
                className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <span>Lanjutkan dengan Akun Ini</span>
              </button>
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="w-full py-2 rounded-xl text-slate-500 hover:text-slate-800 font-bold text-xs cursor-pointer"
              >
                Batal
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
