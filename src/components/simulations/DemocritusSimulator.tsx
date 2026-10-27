import { useState } from 'react'
import {
  Scissors,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowRight
} from 'lucide-react'

interface GoldStage {
  level: number
  name: string
  category: 'Makroskopik' | 'Mikroskopik' | 'Submikroskopik'
  scaleDesc: string
  scaleSize: string
  description: string
}

const GOLD_STAGES: GoldStage[] = [
  {
    level: 0,
    name: 'Cincin Emas Murni (24 Karat)',
    category: 'Makroskopik',
    scaleDesc: 'Perhiasan Emas Utuh',
    scaleSize: '± 20 mm (2 cm)',
    description:
      'Perhiasan cincin emas utuh yang dapat kita lihat, pegang, dan kenakan sehari-hari. Berkilau kuning cerah, padat, dan memiliki massa nyata.',
  },
  {
    level: 1,
    name: 'Potongan / Keratan Keping Emas',
    category: 'Makroskopik',
    scaleDesc: 'Kepingan Emas Terbelah',
    scaleSize: '± 2 mm (0.2 cm)',
    description:
      'Cincin emas dipotong menjadi potongan kepingan kecil. Warnanya tetap kuning keemasan, berkilau, dan sifat materi kimianya tidak berubah.',
  },
  {
    level: 2,
    name: 'Serpihan & Serbuk Halus Emas',
    category: 'Makroskopik',
    scaleDesc: 'Serbuk Emas Kasar',
    scaleSize: '± 200 µm (0.2 mm)',
    description:
      'Kepingan emas ditumbuk dan dikikir menjadi serbuk halus berkilau. Masih dapat tampak berkilau dengan mata telanjang atau kaca pembesar.',
  },
  {
    level: 3,
    name: 'Debu Mikro Partikel Emas',
    category: 'Mikroskopik',
    scaleDesc: 'Mikroskopik Optik',
    scaleSize: '± 20 µm (0.02 mm)',
    description:
      'Serbuk dihaluskan terus-menerus hingga ukuran mikron. Tidak dapat dipotong lagi dengan pisau biasa, hanya tampak sebagai bintik mikroskopik.',
  },
  {
    level: 4,
    name: 'Kluster Nanometer Emas (Kumpulan Atom)',
    category: 'Submikroskopik',
    scaleDesc: 'Skala Nanometer',
    scaleSize: '± 2 nm (0.000002 mm)',
    description:
      'Sekelompok kecil partikel-partikel emas yang saling berkait rapat secara mekanis dalam ruang hampa menurut hipotesis Democritus.',
  },
  {
    level: 5,
    name: '1 Unit Partikel Tunggal: "ATOMOS EMAS"',
    category: 'Submikroskopik',
    scaleDesc: 'Unit Terkecil Tak Terbagi',
    scaleSize: '± 0.28 nm (2.8 Å)',
    description:
      'BATAS AKHIR PEMOTONGAN! Menurut Democritus, ini adalah unit partikel fundamental emas yang pejal, padat, homogen, kekal, dan MUSTAHIL dibagi lagi!',
  },
]

export function DemocritusSimulator() {
  const [stageIndex, setStageIndex] = useState<number>(0)
  const [bounceEffect, setBounceEffect] = useState<boolean>(false)

  const maxStage = GOLD_STAGES.length - 1
  const currentStage = GOLD_STAGES[stageIndex]
  const isAtomos = stageIndex === maxStage

  const handleNextStage = () => {
    if (stageIndex < maxStage) {
      setStageIndex((prev) => prev + 1)
      setBounceEffect(false)
    }
  }

  const handlePrevStage = () => {
    if (stageIndex > 0) {
      setStageIndex((prev) => prev - 1)
      setBounceEffect(false)
    }
  }

  const handleReset = () => {
    setStageIndex(0)
    setBounceEffect(false)
  }

  // Trigger bounce effect when trying to cut the uncuttable Atomos
  const handleTryCutAtomos = () => {
    setBounceEffect(true)
    setTimeout(() => {
      setBounceEffect(false)
    }, 1200)
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      
      {/* Simulation Screen */}
      <div className="relative w-full h-84 rounded-3xl bg-gradient-to-b from-amber-50/90 via-white to-orange-50/90 border-2 border-amber-200/90 flex flex-col items-center justify-between p-4 overflow-hidden shadow-inner">
        
        {/* Top Header Tag & Scale Indicator */}
        <div className="w-full flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              Eksperimen Pemotongan Emas (±400 SM)
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
              currentStage.category === 'Makroskopik'
                ? 'bg-sky-50 text-sky-800 border-sky-200'
                : currentStage.category === 'Mikroskopik'
                ? 'bg-purple-50 text-purple-800 border-purple-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}>
              {currentStage.category}
            </span>
          </div>

          <span className="text-xs font-mono font-bold text-amber-900 bg-white/90 px-2.5 py-0.5 rounded-full border border-amber-200 shadow-xs">
            Skala: {currentStage.scaleSize}
          </span>
        </div>

        {/* Visual Arena: Realistic Illustrated Gold Stages */}
        <div className="relative flex items-center justify-center w-full flex-1 my-2">
          
          {/* STAGE 0: Cincin Emas Perhiasan Utuh */}
          {stageIndex === 0 && (
            <div className="flex flex-col items-center animate-fade-in">
              <svg className="w-40 h-40 filter drop-shadow-xl" viewBox="0 0 200 200">
                <defs>
                  <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
                    <stop offset="60%" stopColor="#eab308" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#ca8a04" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="25%" stopColor="#facc15" />
                    <stop offset="50%" stopColor="#eab308" />
                    <stop offset="75%" stopColor="#ca8a04" />
                    <stop offset="100%" stopColor="#a16207" />
                  </linearGradient>
                </defs>

                {/* Ambient glow */}
                <circle cx="100" cy="100" r="90" fill="url(#goldGlow)" />

                {/* Ring Outer Ellipse */}
                <ellipse cx="100" cy="100" rx="65" ry="60" fill="none" stroke="url(#ringGrad)" strokeWidth="24" />
                {/* Inner hole */}
                <ellipse cx="100" cy="100" rx="53" ry="48" fill="#fff" opacity="0.9" />

                {/* Ring 3D reflections and gemstone / crest */}
                <ellipse cx="100" cy="40" rx="14" ry="12" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
                <circle cx="100" cy="40" r="6" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />

                {/* Sparkles */}
                <path d="M 60 70 Q 70 70 70 60 Q 70 70 80 70 Q 70 70 70 80 Q 70 70 60 70" fill="#fff" />
                <path d="M 130 130 Q 140 130 140 120 Q 140 130 150 130 Q 140 130 140 140 Q 140 130 130 130" fill="#fff" />
              </svg>
              <span className="text-xs font-bold text-amber-900 mt-1">Cincin Emas 24K Utuh</span>
            </div>
          )}

          {/* STAGE 1: Potongan / Kepingan Emas */}
          {stageIndex === 1 && (
            <div className="flex flex-col items-center animate-fade-in">
              <div className="flex items-center gap-4">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-600 border-2 border-yellow-100 shadow-lg transform rotate-6 flex items-center justify-center font-black text-amber-950 text-xs"
                    style={{
                      boxShadow: 'inset -3px -3px 6px rgba(161,98,7,0.6), 0 6px 12px rgba(202,138,4,0.3)',
                      transform: `rotate(${n * 12 - 15}deg)`,
                    }}
                  >
                    <span>Au</span>
                  </div>
                ))}
              </div>
              <span className="text-xs font-bold text-amber-900 mt-4">Kepingan Potongan Emas (± 2 mm)</span>
            </div>
          )}

          {/* STAGE 2: Serpihan & Serbuk Halus Emas */}
          {stageIndex === 2 && (
            <div className="flex flex-col items-center animate-fade-in">
              <div className="w-56 h-36 rounded-2xl bg-slate-900 border border-slate-700 shadow-md p-3 relative flex flex-wrap items-center justify-center gap-1.5 overflow-hidden">
                <span className="absolute top-2 left-2 text-[9px] font-mono text-amber-300 font-bold">
                  Bantalan Koleksi Serbuk
                </span>
                {Array.from({ length: 42 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-full bg-gradient-to-tr from-yellow-200 to-amber-400 shadow-xs animate-pulse"
                    style={{
                      width: `${4 + (i % 5) * 2}px`,
                      height: `${4 + (i % 5) * 2}px`,
                      animationDelay: `${(i % 7) * 0.2}s`,
                    }}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-amber-900 mt-2">Serpihan & Serbuk Emas (± 200 µm)</span>
            </div>
          )}

          {/* STAGE 3: Debu Mikro Partikel Emas (Kaca Pembesar) */}
          {stageIndex === 3 && (
            <div className="flex flex-col items-center animate-fade-in">
              <div className="relative w-40 h-40 rounded-full border-4 border-slate-700 bg-sky-950/20 shadow-xl flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-radial from-amber-200/20 via-transparent to-transparent pointer-events-none" />
                <div className="grid grid-cols-4 gap-3 p-4">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 rounded-full bg-gradient-to-tr from-yellow-300 to-amber-500 shadow-xs border border-yellow-100"
                    />
                  ))}
                </div>
                <div className="absolute bottom-2 text-[9px] font-mono font-bold text-slate-700 bg-white/90 px-2 py-0.5 rounded-full border border-slate-200">
                  Lensa Perbesaran 1000x
                </div>
              </div>
              <span className="text-xs font-bold text-amber-900 mt-2">Debu Mikro Emas (± 20 µm)</span>
            </div>
          )}

          {/* STAGE 4: Kluster Nanometer Emas (Kumpulan Atom) */}
          {stageIndex === 4 && (
            <div className="flex flex-col items-center animate-fade-in">
              <div className="relative flex items-center justify-center p-4">
                <div className="flex flex-wrap items-center justify-center gap-1 max-w-[140px]">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-200 via-amber-400 to-amber-600 border border-white shadow-md flex items-center justify-center text-[8px] font-black text-amber-950 font-mono select-none"
                    >
                      Au
                    </div>
                  ))}
                </div>
              </div>
              <span className="text-xs font-bold text-amber-900 mt-2">Kluster Nanometer Emas (Kumpulan Atom)</span>
            </div>
          )}

          {/* STAGE 5: 1 Unit Partikel Tunggal "ATOMOS EMAS" */}
          {stageIndex === 5 && (
            <div className="flex flex-col items-center relative animate-fade-in">
              
              {/* Clang / Bounce Spark Effect if user tried to cut it */}
              {bounceEffect && (
                <div className="absolute -top-12 z-30 flex flex-col items-center animate-bounce-short">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white font-black text-xs shadow-xl border-2 border-white animate-pulse">
                    <Zap className="w-4 h-4 text-yellow-300" />
                    <span>CLANG! PISAU MEMANTUL!</span>
                  </div>
                  <span className="text-[10px] font-bold text-rose-700 bg-white/95 px-2 py-0.5 rounded-md shadow-xs mt-1 border border-rose-200">
                    Materi tidak dapat dibagi lagi!
                  </span>
                </div>
              )}

              {/* The Fundamental Golden Atomos */}
              <div className={`relative flex items-center justify-center transition-transform ${bounceEffect ? 'scale-110' : ''}`}>
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-yellow-300 via-amber-400 to-amber-600 shadow-2xl shadow-amber-500/50 flex flex-col items-center justify-center border-4 border-white ring-4 ring-amber-300/80">
                  <span className="text-[11px] font-black text-amber-950 font-mono tracking-widest">ATOMOS</span>
                  <span className="text-2xl font-black text-white drop-shadow-md">Au</span>
                  <span className="text-[9px] font-mono text-amber-950/80 font-bold">EMAS</span>
                </div>
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-3xl ring-8 ring-amber-400/20 animate-pulse pointer-events-none" />
              </div>

              <span className="mt-3 text-xs font-black text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 flex items-center gap-1.5 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                Unit Fundamental Terkecil (A-tomos)
              </span>
            </div>
          )}

        </div>

        {/* Current Stage Information Card */}
        <div className="w-full bg-white/95 border border-amber-200 rounded-2xl p-3 z-10 shadow-xs">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-black text-amber-950 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Tahap {stageIndex}: {currentStage.name}
            </span>
            <span className="font-mono text-[11px] text-slate-500 font-bold">
              Level {stageIndex} / {maxStage}
            </span>
          </div>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            {currentStage.description}
          </p>
        </div>

      </div>

      {/* Interactive Step Slider (0 to 5) */}
      <div className="flex flex-col gap-1.5 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between text-xs text-slate-700 font-bold">
          <span>Geser Tingkat Pemotongan Emas:</span>
          <span className="font-mono text-amber-800">{currentStage.scaleDesc}</span>
        </div>
        <input
          type="range"
          min="0"
          max={maxStage}
          value={stageIndex}
          onChange={(e) => {
            setStageIndex(Number(e.target.value))
            setBounceEffect(false)
          }}
          className="w-full accent-amber-500 cursor-pointer"
        />
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium px-1">
          <span>0. Cincin Emas</span>
          <span>1. Potongan</span>
          <span>2. Serbuk</span>
          <span>3. Debu Mikro</span>
          <span>4. Kluster</span>
          <span className="font-bold text-amber-700">5. Atomos</span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        
        {/* Previous stage */}
        <button
          onClick={handlePrevStage}
          disabled={stageIndex === 0}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
            stageIndex === 0
              ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-xs cursor-pointer'
          }`}
        >
          <span>← Kembali ke Bentuk Awal</span>
        </button>

        {/* Next Cut / Try Cut Atomos Button */}
        {!isAtomos ? (
          <button
            onClick={handleNextStage}
            className="py-2.5 px-4 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-105 text-white shadow-md shadow-amber-500/25 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Scissors className="w-4 h-4" />
            <span>Potong / Perkecil Emas (½)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={handleTryCutAtomos}
            className="py-2.5 px-4 rounded-xl text-xs font-black bg-gradient-to-r from-rose-500 to-red-600 hover:brightness-105 text-white shadow-md shadow-rose-500/25 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 animate-pulse"
          >
            <Scissors className="w-4 h-4" />
            <span>Uji Coba Potong Atomos ⚔️</span>
          </button>
        )}

        {/* Reset button */}
        <button
          onClick={handleReset}
          className="py-2.5 px-3 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset ke Cincin 24K</span>
        </button>

      </div>

      {/* Pedagogical Note / Misconception Alert */}
      <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5 shadow-xs">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-amber-900">Konsep Kunci Filosofi Democritus:</p>
          <p className="text-[11px] leading-relaxed text-amber-800">
            Democritus menggunakan analogi pemotongan materi nyata (seperti membelah logam emas). Walaupun emas dipotong dari cincin besar hingga menjadi serpihan terkecil, <strong>sifat keemasannya tidak pernah berubah</strong>. Hal ini membuktikan bahwa unit dasar materi (atomos emas) bersifat kekal, pejal, padat, dan tidak dapat dibagi lagi!
          </p>
        </div>
      </div>

    </div>
  )
}
