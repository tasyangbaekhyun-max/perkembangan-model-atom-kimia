import {
  Clock,
  Layers,
  FlaskConical,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Eye,
  Atom,
  BookOpen,
  Award,
  Compass
} from 'lucide-react'

interface HomeViewProps {
  onNavigateToTimeline: () => void
  onNavigateToComparison: () => void
  onNavigateToSimulation: (modelId?: string) => void
  onNavigateToQuiz: () => void
}

export function HomeView({
  onNavigateToTimeline,
  onNavigateToComparison,
  onNavigateToSimulation,
  onNavigateToQuiz,
}: HomeViewProps) {
  return (
    <div className="flex flex-col gap-10 w-full animate-fade-in">
      
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
              <span>Tahapan Kronologis Perkembangan Model Atom</span>
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

      {/* Main Exploration Grid - Clean, Colorful & Modular */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-600" /> Menu Utama Pembelajaran
            </h2>
            <p className="text-xs text-slate-500 font-medium">Pilih modul pembelajaran yang ingin Anda jelajahi terlebih dahulu</p>
          </div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 self-start sm:self-auto">
            4 Pilihan Modul
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card 1: Main Timeline (Primary) */}
          <div
            onClick={onNavigateToTimeline}
            className="group relative p-6 rounded-3xl bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/80 border-2 border-indigo-200/90 hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-110 transition-transform">
                  <Clock className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  ★ Paling Disarankan
                </span>
              </div>

              <h3 className="text-lg font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                Tahapan Kronologis Perkembangan Model Atom
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed font-medium mb-4">
                Pelajari 6 tonggak evolusi model atom (Democritus, Dalton, Thomson, Rutherford, Bohr, Mekanika Kuantum) lengkap dengan simulator visual otentik, aturan kimia asli, dan 3 level representasi.
              </p>
            </div>

            <div className="pt-3 border-t border-indigo-100/80 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
              <span>Mulai Telusuri Garis Waktu</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 2: Model Comparison */}
          <div
            onClick={onNavigateToComparison}
            className="group relative p-6 rounded-3xl bg-gradient-to-br from-purple-50/80 via-white to-pink-50/80 border-2 border-purple-200/90 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-md shadow-purple-500/25 group-hover:scale-110 transition-transform">
                  <Layers className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-900 border border-purple-200">
                  Komparasi Berdampingan
                </span>
              </div>

              <h3 className="text-lg font-black text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">
                Tabel Perbandingan Antarmodel
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed font-medium mb-4">
                Bandingkan gagasan penemu, bentuk fisik atom, kelebihan konseptual, dan anomali/keterbatasan yang mendorong lahirnya teori model atom berikutnya dalam satu tabel ringkas.
              </p>
            </div>

            <div className="pt-3 border-t border-purple-100/80 flex items-center justify-between text-xs font-bold text-purple-600 group-hover:translate-x-1 transition-transform">
              <span>Buka Tabel Perbandingan</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 3: Interactive Classic Lab */}
          <div
            onClick={() => onNavigateToSimulation('thomson')}
            className="group relative p-6 rounded-3xl bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/80 border-2 border-emerald-200/90 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/25 group-hover:scale-110 transition-transform">
                  <FlaskConical className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                  Praktikum Virtual
                </span>
              </div>

              <h3 className="text-lg font-black text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                Laboratorium Eksperimen Klasik
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed font-medium mb-4">
                Coba langsung eksperimen penting dalam sejarah kimia: pembelokan sinar katoda (Thomson CRT), hamburan sinar alfa lempeng emas (Rutherford), dan spektrum garis emisi Bohr.
              </p>
            </div>

            <div className="pt-3 border-t border-emerald-100/80 flex items-center justify-between text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
              <span>Masuk Laboratorium Simulasi</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 4: Diagnostic Quiz */}
          <div
            onClick={onNavigateToQuiz}
            className="group relative p-6 rounded-3xl bg-gradient-to-br from-amber-50/80 via-white to-orange-50/80 border-2 border-amber-200/90 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-500/25 group-hover:scale-110 transition-transform">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                  Deteksi Miskonsepsi
                </span>
              </div>

              <h3 className="text-lg font-black text-slate-900 mb-2 group-hover:text-amber-700 transition-colors">
                Tes Diagnostik & Kuis Evaluasi
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed font-medium mb-4">
                Uji pemahaman konseptual Anda untuk memastikan tidak ada miskonsepsi seperti anggapan elektron berputar seperti planet pada model atom modern.
              </p>
            </div>

            <div className="pt-3 border-t border-amber-100/80 flex items-center justify-between text-xs font-bold text-amber-700 group-hover:translate-x-1 transition-transform">
              <span>Mulai Uji Pemahaman</span>
              <ArrowRight className="w-4 h-4" />
            </div>
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

    </div>
  )
}

