import { useState, useId } from 'react'
import {
  Atom,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  X
} from 'lucide-react'
import { authService, type UserAccess } from '../../lib'

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
  }

  // Auto-fill demo credentials
  const handleAutoFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail)
    setPassword(demoPass)
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

    setIsLoading(true)
    try {
      const res = await authService.loginWithEmail({
        email,
        password,
        rememberDevice,
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

    setIsLoading(true)
    try {
      const res = await authService.registerWithEmail({
        name: fullName.trim() || undefined,
        email,
        password,
        confirmPassword,
        classCode: classCode.trim() || 'KIM-X-FASE-E',
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
      if (res.success && res.token) {
        setResetToken(res.token)
        setForgotStep(2)
        setSuccessMessage(`Kode pemulihan: ${res.token} (Telah dikirim ke ${email}).`)
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
  const handleGoogleSubmit = async () => {
    setIsLoading(true)
    setShowGoogleModal(false)
    try {
      const access = await authService.loginWithGoogle({
        customName: googleNameInput.trim() || (googleRole === 'teacher' ? 'Dr. Guru Kimia' : 'Siswa Kimia'),
        email: googleEmailInput.trim() || undefined,
        classCode: googleClassInput.trim() || 'KIM-X-FASE-E',
        role: googleRole,
        rememberDevice,
      })
      onSuccessLogin(access)
    } catch {
      setErrorMessage('Gagal masuk dengan akun Google.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-3 sm:p-6 lg:p-10 font-sans selection:bg-blue-500 selection:text-white">
      
      {/* Outer Card Container matching the 2-column reference layout */}
      <div className="w-full max-w-6xl bg-white rounded-3xl sm:rounded-[36px] shadow-2xl shadow-indigo-100/70 border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        
        {/* ============================================================== */}
        {/* LEFT COLUMN: HERO 3D ILLUSTRATION & EDUCATIONAL VALUE (5 Cols) */}
        {/* ============================================================== */}
        <div className="lg:col-span-5 relative bg-gradient-to-br from-sky-50 via-indigo-50/50 to-blue-100/60 p-6 sm:p-10 flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-200/70">
          
          {/* Subtle decorative background circles */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-300/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-72 h-72 bg-indigo-300/25 rounded-full blur-3xl pointer-events-none" />

          {/* Headline matching reference style */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 backdrop-blur-xs text-indigo-700 text-[11px] font-extrabold shadow-2xs border border-indigo-100 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Platform Pembelajaran Kimia Fase E</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight leading-snug">
              Permudah interaksi antar{' '}
              <span className="text-orange-600 font-black">Guru / Dosen</span> dan{' '}
              <span className="text-rose-600 font-black">Siswa / Mahasiswa</span> secara online!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-2 leading-relaxed">
              Jelajahi alur sejarah dan pembuktian ilmiah model atom Democritus, Dalton, Thomson, Rutherford, Bohr, hingga Kuantum.
            </p>
          </div>

          {/* Central 3D Illustration Scene */}
          <div className="relative my-8 sm:my-10 flex items-center justify-center">
            
            {/* FLOATING 3D ICON 1: Pencil & Notepad (Top-Left) */}
            <div className="absolute -top-3 left-4 sm:left-6 z-20 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl shadow-slate-300/50 border border-white flex items-center justify-center hover:scale-105 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                <span className="text-2xl" role="img" aria-label="pencil">✏️</span>
              </div>
            </div>

            {/* FLOATING 3D ICON 2: Ribbon Bookmark (Top-Right) */}
            <div className="absolute top-2 right-4 sm:right-6 z-20 bg-white/95 backdrop-blur-md p-2.5 rounded-2xl shadow-xl shadow-slate-300/50 border border-white flex items-center justify-center hover:scale-105 transition-transform">
              <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center">
                <span className="text-xl" role="img" aria-label="bookmark">🔖</span>
              </div>
            </div>

            {/* FLOATING 3D ICON 3: Folder / Document (Bottom-Left) */}
            <div className="absolute -bottom-2 left-6 z-20 bg-white/95 backdrop-blur-md p-2.5 rounded-2xl shadow-xl shadow-slate-300/50 border border-white flex items-center justify-center hover:scale-105 transition-transform">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <span className="text-xl" role="img" aria-label="folder">📁</span>
              </div>
            </div>

            {/* Main Interactive Artwork Card */}
            <div className="relative w-full max-w-[320px] aspect-4/3 bg-white/90 backdrop-blur-md rounded-3xl p-5 shadow-2xl shadow-blue-500/10 border-2 border-white flex flex-col items-center justify-center text-center overflow-hidden">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 text-white mb-3 animate-pulse">
                <Atom className="w-11 h-11" />
              </div>

              <h2 className="text-base font-black text-slate-800">
                AtomLab Interactive Studio
              </h2>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                Laboratorium visual submikroskopik dan evaluasi otomatis
              </p>

              {/* Accept / Connect Pill Button */}
              <div className="mt-4 px-4 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-500/25 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>Terhubung ke Sesi Pembelajaran</span>
              </div>
            </div>
          </div>

          {/* Bottom Trust & Feature Highlights */}
          <div className="relative z-10 pt-2 border-t border-slate-200/60 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">✓</span>
              <span>5 Model Pembelajaran Runtut Sesuai Fase E Kurikulum Merdeka</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <span className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">✓</span>
              <span>Uji Pemahaman Konsep 10 Soal Berbasis Investigasi Ilmiah</span>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: LOGIN / REGISTER / LUPA SANDI FORM (7 Cols)      */}
        {/* ============================================================== */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
          
          <div className="max-w-md w-full mx-auto flex flex-col">
            
            {/* Brand Logo Header matching reference */}
            <div className="flex items-center justify-between pb-6 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                  <Atom className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black tracking-tight text-blue-900 leading-none">
                    my<span className="text-blue-600">Edlinks</span>
                    <span className="text-[11px] font-bold text-slate-400 ml-1.5">• AtomLab</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Smart Chemistry Learning Portal</span>
                </div>
              </div>

              {/* Guest / Explore directly button */}
              <button
                type="button"
                onClick={onContinueAsGuest}
                className="text-xs font-bold text-slate-500 hover:text-indigo-600 px-3 py-1.5 rounded-xl hover:bg-slate-50 border border-slate-200 transition flex items-center gap-1 cursor-pointer"
                title="Masuk sebagai Siswa Tamu tanpa login"
              >
                <span>Mode Tamu</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Greeting Heading & Subtitle */}
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {mode === 'login' && 'Hai, selamat datang kembali'}
                {mode === 'register' && 'Daftar Akun Baru'}
                {mode === 'forgot' && 'Atur Ulang Kata Sandi'}
              </h2>

              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5">
                {mode === 'login' && (
                  <>
                    Baru di AtomLab?{' '}
                    <button
                      type="button"
                      onClick={() => switchMode('register')}
                      className="text-blue-600 font-bold hover:underline cursor-pointer"
                    >
                      Daftar Gratis
                    </button>
                  </>
                )}
                {mode === 'register' && (
                  <>
                    Sudah memiliki akun?{' '}
                    <button
                      type="button"
                      onClick={() => switchMode('login')}
                      className="text-blue-600 font-bold hover:underline cursor-pointer"
                    >
                      Masuk di Sini
                    </button>
                  </>
                )}
                {mode === 'forgot' && (
                  <>
                    Sudah ingat kata sandi kamu?{' '}
                    <button
                      type="button"
                      onClick={() => switchMode('login')}
                      className="text-blue-600 font-bold hover:underline cursor-pointer"
                    >
                      Kembali ke Masuk
                    </button>
                  </>
                )}
              </p>
            </div>

            {/* Alert Messages (Error / Success) */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                <span className="leading-relaxed">{errorMessage}</span>
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
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                
                {/* Email Field */}
                <div className="space-y-1.5">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Contoh: email@example.com"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 font-medium text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100 transition"
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
                      className="w-full px-4 py-3 pr-11 rounded-xl border border-slate-300 font-medium text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100 transition"
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

                {/* Blue Masuk Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-[#1b74e4] hover:bg-blue-600 text-white font-extrabold text-sm shadow-md shadow-blue-500/25 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-1"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sedang Masuk...</span>
                    </span>
                  ) : (
                    <span>Masuk</span>
                  )}
                </button>

                {/* Lupa Kata Sandi Link */}
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => switchMode('forgot')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
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
                
                {/* Pilihan Peran: Siswa vs Guru */}
                <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      role === 'student'
                        ? 'bg-white text-blue-700 shadow-2xs border border-slate-200'
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
                        ? 'bg-indigo-600 text-white shadow-2xs font-extrabold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>🎓 Mode Guru</span>
                  </button>
                </div>

                {role === 'teacher' && (
                  <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-900 text-xs font-medium leading-relaxed">
                    💡 <strong>Mode Guru:</strong> Anda akan memiliki hak akses penuh untuk mengelola materi (CRUD) dan butir soal kuis tanpa pembatasan Lock Materi.
                  </div>
                )}
                
                {/* Nama Lengkap */}
                <div className="relative">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nama Lengkap (Contoh: Budi Santoso)"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 font-medium text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100 transition"
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
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 font-medium text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100 transition"
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
                    className="w-full px-4 py-3 pr-11 rounded-xl border border-slate-300 font-medium text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100 transition"
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
                    className="w-full px-4 py-3 pr-11 rounded-xl border border-slate-300 font-medium text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Kode Kelas Opsional */}
                <div className="relative">
                  <input
                    type="text"
                    value={classCode}
                    onChange={(e) => setClassCode(e.target.value)}
                    placeholder="Kode Kelas (Contoh: KIM-X-FASE-E) - Opsional"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 font-medium text-slate-800 text-sm placeholder:text-slate-400 uppercase focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100 transition"
                  />
                </div>

                {/* Tombol Daftar */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-[#1b74e4] hover:bg-blue-600 text-white font-extrabold text-sm shadow-md shadow-blue-500/25 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-1"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Mendaftarkan Akun...</span>
                    </span>
                  ) : (
                    <span>Daftar Akun Baru</span>
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
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 font-medium text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100 transition"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 rounded-xl bg-[#1b74e4] hover:bg-blue-600 text-white font-extrabold text-sm shadow-md shadow-blue-500/25 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
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
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-slate-800 text-sm focus:outline-none focus:border-blue-600"
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
                          className="w-full px-4 py-2.5 pr-11 rounded-xl border border-slate-300 font-medium text-slate-800 text-sm focus:outline-none focus:border-blue-600"
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
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-medium text-slate-800 text-sm focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md shadow-emerald-600/25 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-1"
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

              {/* 3 Social Buttons: Facebook, Google, Apple */}
              <div className="grid grid-cols-3 gap-3">
                
                {/* Facebook Button */}
                <button
                  type="button"
                  onClick={() => {
                    handleAutoFill('siswa@sekolah.id', 'password123')
                    setSuccessMessage('Mode Facebook demo: kredensial siswa terisi otomatis!')
                  }}
                  className="py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 hover:border-slate-400 flex items-center justify-center transition cursor-pointer group shadow-2xs"
                  title="Masuk dengan Facebook"
                >
                  <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>

                {/* Google Button (Official 4-color) */}
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(true)}
                  className="py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 hover:border-blue-400 flex items-center justify-center transition cursor-pointer group shadow-2xs"
                  title="Masuk dengan Google"
                >
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
                </button>

                {/* Apple Button */}
                <button
                  type="button"
                  onClick={() => {
                    handleAutoFill('guru@sekolah.id', 'password123')
                    setSuccessMessage('Mode Apple demo: kredensial guru terisi otomatis!')
                  }}
                  className="py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 hover:border-slate-400 flex items-center justify-center transition cursor-pointer group shadow-2xs"
                  title="Masuk dengan Apple"
                >
                  <svg className="w-5 h-5 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.42c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.56.65-1.06 1.7-0.93 2.71 1 .08 2.01-.46 2.63-1.21Z" />
                  </svg>
                </button>
              </div>

              {/* Checkbox: Ingat perangkat ini */}
              <label htmlFor={rememberCheckboxId} className="flex items-center gap-2.5 mt-2 cursor-pointer select-none">
                <input
                  id={rememberCheckboxId}
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="w-4 h-4 rounded-md text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-700">
                  Ingat perangkat ini
                </span>
              </label>

              {/* Legal disclaimer matching reference */}
              <p className="text-[11px] text-slate-400 text-center leading-relaxed mt-2">
                Dengan melanjutkan, kamu menerima{' '}
                <a href="#terms" onClick={(e) => e.preventDefault()} className="text-blue-600 hover:underline">
                  Syarat Penggunaan
                </a>{' '}
                dan{' '}
                <a href="#privacy" onClick={(e) => e.preventDefault()} className="text-blue-600 hover:underline">
                  Kebijakan Privasi
                </a>{' '}
                kami.
              </p>
            </div>

            {/* Quick Demo Credentials Footer Helper */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-2">
              <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                Akses Cepat Pengujian (1-Klik):
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleAutoFill('siswa@sekolah.id', 'password123')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-medium text-[11px] border border-slate-200 transition cursor-pointer"
                >
                  👤 Akun Siswa (<code className="text-blue-600 font-bold">siswa@sekolah.id</code>)
                </button>
                <button
                  type="button"
                  onClick={() => handleAutoFill('guru@sekolah.id', 'password123')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-medium text-[11px] border border-slate-200 transition cursor-pointer"
                >
                  🎓 Akun Guru (<code className="text-indigo-600 font-bold">guru@sekolah.id</code>)
                </button>
              </div>
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
                <label className="font-bold text-slate-700 text-[11px]">Kode Kelas Kimia:</label>
                <input
                  type="text"
                  value={googleClassInput}
                  onChange={(e) => setGoogleClassInput(e.target.value)}
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
