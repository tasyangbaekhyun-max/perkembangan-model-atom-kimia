import {
  Clock,
  Layers,
  Sparkles,
  ArrowRight,
  Eye,
  Atom,
  BookOpen,
  Award,
  BookMarked,
  ExternalLink,
  Library,
  CheckCircle2
} from 'lucide-react'

interface HomeViewProps {
  onNavigateToTimeline: () => void
  onNavigateToComparison: () => void
  onNavigateToSimulation?: (modelId?: string) => void
  onNavigateToQuiz: () => void
  onOpenAuth?: () => void
  isAuthenticated?: boolean
}

export function HomeView({
  onNavigateToTimeline,
  onNavigateToComparison,
  onNavigateToQuiz: _onNavigateToQuiz,
  onOpenAuth,
  isAuthenticated = false,
}: HomeViewProps) {
  return (
    <div className="flex flex-col gap-10 w-full animate-fade-in">
      
      {/* Informational Guest Mode Notification */}
      {!isAuthenticated && onOpenAuth && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50/80 border border-blue-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Atom className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                Anda sedang belajar dalam <span className="text-blue-700 font-extrabold">Mode Tamu (Belajar Bebas)</span>
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                Masuk atau daftar dengan Google / Email untuk mencatat skor dan evaluasi kuis ke dasbor kelas kimia Anda.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenAuth}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition shrink-0 cursor-pointer active:scale-98"
          >
            Masuk / Buat Akun Baru
          </button>
        </div>
      )}
      
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 text-white p-7 md:p-12 shadow-xl shadow-indigo-500/15">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-24 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white text-xs font-bold mb-4 border border-white/30 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Media Belajar Interaktif Kimia SMA Kelas X (Fase E)
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4 leading-tight drop-shadow-xs">
            Jelajahi Misteri Atom{' '}
            <span className="text-cyan-200">
              Secara Nyata & Ilmiah
            </span>
          </h1>

          <p className="text-indigo-100 text-sm md:text-base leading-relaxed mb-8 max-w-2xl font-medium">
            Selamat datang di <strong>AtomLab</strong>! Platform belajar kimia interaktif berbasis sejarah sains dan multipel representasi (makroskopik, submikroskopik, dan simbolik) yang dirancang untuk mencegah miskonsepsi.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {/* Main Primary Button requested by the user */}
            <button
              onClick={onNavigateToTimeline}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm transition flex items-center gap-2.5 shadow-lg shadow-amber-500/30 active:scale-98 cursor-pointer"
            >
              <Clock className="w-4 h-4 text-slate-950" />
              <span>Mulai Alur Belajar Model Atom (Runtut dari Awal)</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>

            <button
              onClick={onNavigateToComparison}
              className="px-5 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm backdrop-blur-xs transition border border-white/30 flex items-center gap-2 cursor-pointer"
            >
              <Layers className="w-4 h-4 text-cyan-200" />
              Tabel Perbandingan
            </button>
          </div>
        </div>
      </section>

      {/* 3 Levels of Representation Chemistry Pillar Cards */}
      <section className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-xs flex flex-col gap-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-1">
            <Award className="w-3.5 h-3.5" /> Pendekatan Pedagogis Kimia
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            3 Tingkat Representasi Kimia (Johnstone)
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Web ini menyajikan seluruh materi melalui tiga sudut pandang agar konsep atom tidak lagi abstrak:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200/70 flex flex-col gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
              <Eye className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-black text-sky-900 uppercase">1. Makroskopik</h4>
            <p className="text-xs text-sky-950 font-medium leading-relaxed">
              Fenomena nyata di laboratorium yang dapat diamati panca indera, seperti nyala spektrum gas dan belokan sinar katoda.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 flex flex-col gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Atom className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-black text-emerald-900 uppercase">2. Submikroskopik</h4>
            <p className="text-xs text-emerald-950 font-medium leading-relaxed">
              Tingkat partikel tak kasat mata: bagaimana inti, elektron, dan orbital probabilitas tersusun dalam atom.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/70 flex flex-col gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-black text-purple-900 uppercase">3. Simbolik</h4>
            <p className="text-xs text-purple-950 font-medium leading-relaxed">
              Bahasa ilmiah, notasi kimia, persamaan gelombang, serta formula matematis kuantisasi energi (ΔE = hν).
            </p>
          </div>
        </div>
      </section>

      {/* Daftar Pustaka & Landasan Akademik Terpercaya */}
      <section className="bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 shadow-xs flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-1">
              <Library className="w-3.5 h-3.5" /> Standar Keilmuan &amp; Akurasi Materi
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              Daftar Pustaka &amp; Rujukan Akademik Utama
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Seluruh materi, visualisasi simulasi, dan instrumen evaluasi AtomLab disusun berdasarkan rujukan buku teks resmi dan literatur ilmiah terakreditasi:
            </p>
          </div>

          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Terverifikasi Ilmiah</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card 1: Kurikulum Merdeka */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-200 inline-block mb-2">
                1. Kurikulum Nasional (Kemendikbudristek RI)
              </span>
              <p className="text-xs font-serif font-bold text-slate-900 leading-relaxed">
                Puspaningsih, A. R., Tjahjadarmawan, E., &amp; Krisdianti, N. R. (2021). <em>Buku Panduan Guru dan Siswa Ilmu Pengetahuan Alam untuk SMA Kelas X</em>. Pusat Perbukuan Balitbangbud Kemendikbudristek RI.
              </p>
              <p className="text-[11px] text-slate-500 mt-2 font-medium leading-relaxed">
                Rujukan utama alur tujuan pembelajaran (ATP) dan capaian pembelajaran (CP) Fase E untuk pemahaman struktur materi dasar.
              </p>
            </div>
            <a
              href="https://buku.kemdikbud.go.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:underline pt-2 border-t border-slate-200"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Portal Buku Resmi Kemendikbudristek</span>
            </a>
          </div>

          {/* Card 2: Buku Teks Universitas Chang */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-100 text-sky-900 border border-sky-200 inline-block mb-2">
                2. Buku Teks Kimia Dasar Universitas
              </span>
              <p className="text-xs font-serif font-bold text-slate-900 leading-relaxed">
                Chang, R., &amp; Goldsby, K. A. (2016). <em>Chemistry</em> (12th ed.). New York: McGraw-Hill Education. ISBN: 978-0078021510.
              </p>
              <p className="text-[11px] text-slate-500 mt-2 font-medium leading-relaxed">
                Rujukan konsep dasar hukum kimia (Lavoisier, Proust, Dalton), struktur atom Thomson, Rutherford, dan teori kuantum Bohr.
              </p>
            </div>
            <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-200">
              Bab 2: Atoms, Molecules, and Ions • Bab 7: Quantum Theory
            </div>
          </div>

          {/* Card 3: Brown & LeMay Chemistry: The Central Science */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 border border-purple-200 inline-block mb-2">
                3. Kimia Modern &amp; Struktur Elektronik
              </span>
              <p className="text-xs font-serif font-bold text-slate-900 leading-relaxed">
                Brown, T. L., LeMay, H. E., Bursten, B. E., Murphy, C. J., Woodward, P. M., &amp; Stoltzfus, M. W. (2018). <em>Chemistry: The Central Science</em> (14th ed.). Pearson.
              </p>
              <p className="text-[11px] text-slate-500 mt-2 font-medium leading-relaxed">
                Rujukan eksperimen hamburan partikel alfa lempeng emas, bentuk orbital probabilitas 3D, dan konfigurasi elektron.
              </p>
            </div>
            <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-200">
              Bab 6: Electronic Structure of Atoms
            </div>
          </div>

          {/* Card 4: Nobel Prize & IUPAC Gold Book */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200 inline-block mb-2">
                4. Sumber Primer Sejarah Sains &amp; Standar Internasional
              </span>
              <p className="text-xs font-serif font-bold text-slate-900 leading-relaxed">
                The Nobel Foundation (NobelPrize.org) &amp; International Union of Pure and Applied Chemistry (IUPAC Gold Book, 2019).
              </p>
              <p className="text-[11px] text-slate-500 mt-2 font-medium leading-relaxed">
                Koleksi pidato Nobel asli J.J. Thomson (1906), Ernest Rutherford (1908), Niels Bohr (1922), dan Schrödinger &amp; Heisenberg.
              </p>
            </div>
            <a
              href="https://www.nobelprize.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:underline pt-2 border-t border-slate-200"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Arsip Resmi Nobel Foundation</span>
            </a>
          </div>

        </div>

        <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <BookMarked className="w-4 h-4 text-indigo-700 shrink-0" />
            <span className="text-indigo-950 font-medium">
              Ingin meninjau daftar pustaka per model atom secara spesifik?
            </span>
          </div>
          <button
            onClick={onNavigateToTimeline}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition cursor-pointer shrink-0"
          >
            Buka Per Model Atom →
          </button>
        </div>
      </section>

    </div>
  )
}

