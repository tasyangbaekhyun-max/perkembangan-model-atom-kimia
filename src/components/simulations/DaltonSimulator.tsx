import { useState, useRef, useEffect } from 'react'
import { Zap, AlertCircle, RefreshCw, CheckCircle2, Info } from 'lucide-react'

type ReactionType = 'h2o' | 'co' | 'co2'

interface AtomConfig {
  id: string
  name: string
  fullName: string
  color: string
  size: number // Diameter visual berdasarkan jari-jari atom tren periodik (H < O < C)
  massLabel: string
  // Posisi relatif terhadap pusat visual arena (px)
  separatedPos: { x: number; y: number }
  reactedPos: { x: number; y: number }
}

interface ReactionDefinition {
  name: string
  formula: string
  ratio: string
  law: string
  geometryDescription: string
  reactants: AtomConfig[]
}

export interface DaltonSimulatorProps {
  onComplete?: () => void
  isCompleted?: boolean
}

export function DaltonSimulator({ onComplete, isCompleted }: DaltonSimulatorProps) {
  const [selectedReaction, setSelectedReaction] = useState<ReactionType>('h2o')
  const [isReacted, setIsReacted] = useState<boolean>(false)
  const [isTestingElectricity, setIsTestingElectricity] = useState<boolean>(false)
  const [showElectricityCard, setShowElectricityCard] = useState<boolean>(false)

  // Melacak penyelesaian 2 aksi wajib lab Dalton
  const [hasReactedOnce, setHasReactedOnce] = useState<boolean>(() => Boolean(isCompleted))
  const [hasTestedElectricityOnce, setHasTestedElectricityOnce] = useState<boolean>(() => Boolean(isCompleted))

  const timerRef = useRef<number | null>(null)
  const onCompleteCalledRef = useRef<boolean>(false)

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  // Fire onComplete when both mandatory lab actions are done (idempotent)
  useEffect(() => {
    if (hasReactedOnce && hasTestedElectricityOnce && !onCompleteCalledRef.current && !isCompleted) {
      onCompleteCalledRef.current = true
      onComplete?.()
    }
  }, [hasReactedOnce, hasTestedElectricityOnce, isCompleted, onComplete])

  // Proporsi Jari-Jari Atom Sebenarnya dalam Tabel Periodik:
  // Jari-jari kovalen / van der Waals: H (~37-120 pm) < O (~66-152 pm) < C (~77-170 pm)
  // Diameter visual: H = 36px, O = 52px, C = 68px (H paling kecil < O sedang < C paling besar)
  // Massa atom (keterangan terpisah): H = 1 sma, C = 12 sma, O = 16 sma
  const reactions: Record<ReactionType, ReactionDefinition> = {
    h2o: {
      name: 'Air',
      formula: 'H₂O',
      ratio: '2 Atom Hidrogen : 1 Atom Oksigen',
      law: 'Hukum Perbandingan Tetap (Proust)',
      geometryDescription: 'Geometri Bentuk V (Sudut ~104,5°)',
      reactants: [
        {
          id: 'h2o-h1',
          name: 'H',
          fullName: 'Hidrogen',
          color: 'from-slate-100 via-slate-200 to-slate-400 text-slate-800 border-2 border-slate-300',
          size: 36, // H paling kecil
          massLabel: 'H = 1 sma',
          separatedPos: { x: -82, y: 0 },
          // Sudut 104.5° bentuk V: O di tengah atas (0, -17), dua H di kiri-bawah (-35, 10) & kanan-bawah (35, 10)
          // Jarak pusat O ke H = sqrt(35^2 + 27^2) = 44px = R_O (26px) + R_H (18px) -> bersentuhan langsung!
          reactedPos: { x: -34.8, y: 10 }
        },
        {
          id: 'h2o-o',
          name: 'O',
          fullName: 'Oksigen',
          color: 'from-rose-500 via-red-600 to-rose-700 text-white border-2 border-rose-300',
          size: 52, // O sedang (lebih kecil dari C)
          massLabel: 'O = 16 sma',
          separatedPos: { x: 0, y: 0 },
          reactedPos: { x: 0, y: -17 }
        },
        {
          id: 'h2o-h2',
          name: 'H',
          fullName: 'Hidrogen',
          color: 'from-slate-100 via-slate-200 to-slate-400 text-slate-800 border-2 border-slate-300',
          size: 36, // H paling kecil
          massLabel: 'H = 1 sma',
          separatedPos: { x: 82, y: 0 },
          reactedPos: { x: 34.8, y: 10 }
        }
      ]
    },
    co: {
      name: 'Karbon Monoksida',
      formula: 'CO',
      ratio: '1 Atom Karbon : 1 Atom Oksigen (Rasio 1:1)',
      law: 'Hukum Perbandingan Berganda (Dalton)',
      geometryDescription: 'Geometri Linear (C-O Bersisian)',
      reactants: [
        {
          id: 'co-c',
          name: 'C',
          fullName: 'Karbon',
          color: 'from-slate-700 via-slate-800 to-neutral-900 text-white border-2 border-slate-500',
          size: 68, // C paling besar
          massLabel: 'C = 12 sma',
          separatedPos: { x: -62, y: 0 },
          // Linear bersentuhan langsung tanpa garis: R_C (34px) + R_O (26px) = 60px
          reactedPos: { x: -26, y: 0 }
        },
        {
          id: 'co-o',
          name: 'O',
          fullName: 'Oksigen',
          color: 'from-rose-500 via-red-600 to-rose-700 text-white border-2 border-rose-300',
          size: 52, // O sedang
          massLabel: 'O = 16 sma',
          separatedPos: { x: 62, y: 0 },
          reactedPos: { x: 34, y: 0 }
        }
      ]
    },
    co2: {
      name: 'Karbon Dioksida',
      formula: 'CO₂',
      ratio: '1 Atom Karbon : 2 Atom Oksigen (Rasio 1:2)',
      law: 'Hukum Perbandingan Berganda (Dalton)',
      geometryDescription: 'Geometri Linear Simetris (O-C-O)',
      reactants: [
        {
          id: 'co2-o1',
          name: 'O',
          fullName: 'Oksigen',
          color: 'from-rose-500 via-red-600 to-rose-700 text-white border-2 border-rose-300',
          size: 52, // O sedang
          massLabel: 'O = 16 sma',
          separatedPos: { x: -96, y: 0 },
          // Simetris mengapit C di tengah: Jarak pusat ke pusat = 60px (bersentuhan langsung di x = -34)
          reactedPos: { x: -60, y: 0 }
        },
        {
          id: 'co2-c',
          name: 'C',
          fullName: 'Karbon',
          color: 'from-slate-700 via-slate-800 to-neutral-900 text-white border-2 border-slate-500',
          size: 68, // C paling besar
          massLabel: 'C = 12 sma',
          separatedPos: { x: 0, y: 0 },
          reactedPos: { x: 0, y: 0 }
        },
        {
          id: 'co2-o2',
          name: 'O',
          fullName: 'Oksigen',
          color: 'from-rose-500 via-red-600 to-rose-700 text-white border-2 border-rose-300',
          size: 52, // O sedang
          massLabel: 'O = 16 sma',
          separatedPos: { x: 96, y: 0 },
          // Simetris mengapit C di tengah: Jarak pusat ke pusat = 60px (bersentuhan langsung di x = +34)
          reactedPos: { x: 60, y: 0 }
        }
      ]
    }
  }

  const current = reactions[selectedReaction]

  const handleTestElectricity = () => {
    setShowElectricityCard(false)
    setIsTestingElectricity(true)
    setHasTestedElectricityOnce(true)

    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    // Efek visual kilatan dan partikel muatan berlangsung selama 1.2 detik, lalu kartu penjelasan muncul
    timerRef.current = window.setTimeout(() => {
      setIsTestingElectricity(false)
      setShowElectricityCard(true)
    }, 1200)
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Simulation Screen */}
      <div className="relative w-full h-80 rounded-2xl bg-gradient-to-b from-sky-50/90 via-white to-blue-50/90 border-2 border-sky-200/80 flex flex-col items-center justify-between p-4 overflow-hidden shadow-inner">

        {/* Header Tag */}
        <div className="w-full flex items-center justify-between z-10">
          <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 border border-sky-300 flex items-center gap-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            Model Bola Pejal (Billiard Ball) • 1803
          </span>
          <span className="text-xs font-semibold text-slate-600 bg-white/80 px-2.5 py-1 rounded-full border border-slate-200">
            {isReacted ? 'Molekul Senyawa Terbentuk' : 'Atom Unsur Bebas'}
          </span>
        </div>

        {/* Visual Arena */}
        <div className="relative flex items-center justify-center w-full flex-1 min-h-[170px] select-none">
          {/* Animated Electrical Shock & Charge Particles (+/-) Overlay */}
          {isTestingElectricity && (
            <div className="absolute inset-0 z-30 pointer-events-none flex flex-col items-center justify-between p-2">
              {/* Lightning flash ambient aura */}
              <div className="absolute inset-0 bg-radial from-amber-300/35 via-cyan-300/20 to-transparent animate-electric-flash rounded-xl" />

              {/* Lightning Bolt Sparks (Zap) */}
              <div className="absolute top-3 left-6 text-amber-500 animate-pulse">
                <Zap className="w-5 h-5 drop-shadow-[0_0_8px_rgba(245,158,11,0.95)]" />
              </div>
              <div className="absolute top-4 right-8 text-cyan-500 animate-pulse" style={{ animationDelay: '0.12s' }}>
                <Zap className="w-6 h-6 drop-shadow-[0_0_8px_rgba(6,182,212,0.95)]" />
              </div>
              <div className="absolute bottom-4 left-10 text-cyan-400 animate-pulse" style={{ animationDelay: '0.25s' }}>
                <Zap className="w-5 h-5 drop-shadow-[0_0_8px_rgba(6,182,212,0.9)]" />
              </div>
              <div className="absolute bottom-5 right-12 text-amber-500 animate-pulse" style={{ animationDelay: '0.18s' }}>
                <Zap className="w-6 h-6 drop-shadow-[0_0_8px_rgba(245,158,11,0.95)]" />
              </div>

              {/* Floating Positive Charge Particles (+) */}
              <div
                className="absolute top-2 left-1/4 w-6 h-6 rounded-full bg-rose-500 text-white font-mono font-black text-xs flex items-center justify-center shadow-[0_0_12px_rgba(244,63,94,0.9)] border border-rose-200 animate-charge-float"
                title="Muatan Positif (+)"
              >
                +
              </div>
              <div
                className="absolute bottom-3 left-1/3 w-6 h-6 rounded-full bg-amber-500 text-white font-mono font-black text-xs flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.9)] border border-amber-200 animate-charge-float"
                style={{ animationDelay: '0.35s' }}
                title="Muatan Positif (+)"
              >
                +
              </div>
              <div
                className="absolute top-8 right-1/4 w-6 h-6 rounded-full bg-rose-500 text-white font-mono font-black text-xs flex items-center justify-center shadow-[0_0_12px_rgba(244,63,94,0.9)] border border-rose-200 animate-charge-float"
                style={{ animationDelay: '0.7s' }}
                title="Muatan Positif (+)"
              >
                +
              </div>

              {/* Floating Negative Charge Particles (−) */}
              <div
                className="absolute top-6 left-12 w-6 h-6 rounded-full bg-cyan-500 text-white font-mono font-black text-xs flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.9)] border border-cyan-200 animate-charge-float-reverse"
                title="Muatan Negatif (−)"
              >
                −
              </div>
              <div
                className="absolute bottom-5 right-1/3 w-6 h-6 rounded-full bg-blue-600 text-white font-mono font-black text-xs flex items-center justify-center shadow-[0_0_12px_rgba(37,99,235,0.9)] border border-blue-200 animate-charge-float-reverse"
                style={{ animationDelay: '0.45s' }}
                title="Muatan Negatif (−)"
              >
                −
              </div>
              <div
                className="absolute top-3 right-1/3 w-6 h-6 rounded-full bg-cyan-500 text-white font-mono font-black text-xs flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.9)] border border-cyan-200 animate-charge-float-reverse"
                style={{ animationDelay: '0.2s' }}
                title="Muatan Negatif (−)"
              >
                −
              </div>

              {/* Live status banner */}
              <div className="z-10 bg-amber-500 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg border border-amber-300 animate-pulse flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>Menerapkan Medan Listrik (+ / −)... Bola Dalton tidak berinteraksi!</span>
              </div>
            </div>
          )}

          {/* Solid Spheres Display */}
          <div className="relative flex items-center justify-center w-64 h-36">
            {current.reactants.map((atom) => {
              const pos = isReacted ? atom.reactedPos : atom.separatedPos

              return (
                <div
                  key={atom.id}
                  className={`absolute flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${isTestingElectricity ? 'animate-electric-jitter' : ''
                    }`}
                  style={{
                    transform: `translate(${pos.x}px, ${pos.y}px)`,
                  }}
                >
                  {/* 3D-shaded Solid Billiard Ball Sphere (Touching directly without bonds) */}
                  <div
                    className={`rounded-full bg-gradient-to-br ${atom.color} flex items-center justify-center font-black font-mono transition-transform duration-500 relative select-none ${isReacted ? 'scale-100' : 'hover:scale-105'
                      }`}
                    style={{
                      width: `${atom.size}px`,
                      height: `${atom.size}px`,
                      boxShadow:
                        'inset 3px 3px 6px rgba(255,255,255,0.45), inset -4px -4px 8px rgba(0,0,0,0.4), 0 8px 18px rgba(0,0,0,0.18)',
                    }}
                    title={`${atom.fullName} (${atom.name}) - Diameter: ${atom.size}px`}
                  >
                    <span
                      className="drop-shadow-sm select-none"
                      style={{
                        fontSize: atom.size >= 65 ? '16px' : atom.size >= 50 ? '13px' : '11px',
                      }}
                    >
                      {atom.name}
                    </span>
                  </div>

                  {/* Mass Label when separated */}
                  <div
                    className={`absolute -bottom-6 transition-all duration-300 pointer-events-none ${isReacted ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
                      }`}
                  >
                    <span className="text-[10px] font-mono font-bold text-slate-700 bg-white/95 px-2 py-0.5 rounded-full border border-slate-200 shadow-2xs whitespace-nowrap">
                      {atom.massLabel}
                    </span>
                  </div>
                </div>
              )
            })}

            {/* Molecule Geometry Badge when Reacted */}
            {isReacted && (
              <div className="absolute -bottom-5 flex flex-col items-center animate-fade-in pointer-events-none">
                <span className="text-[10px] font-mono font-bold text-sky-800 bg-sky-100/90 px-2.5 py-0.5 rounded-full border border-sky-300 shadow-2xs flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-sky-600" />
                  {current.geometryDescription} • Bola pejal bersentuhan langsung
                </span>
              </div>
            )}
          </div>

          {/* Explanation Card: Keterbatasan Dalton atas Fenomena Kelistrikan */}
          {showElectricityCard && (
            <div className="absolute inset-0 bg-white/98 backdrop-blur-md rounded-xl flex flex-col items-center justify-between p-4 z-40 shadow-2xl border-2 border-amber-300 overflow-y-auto animate-fade-in">
              {/* Card Header */}
              <div className="flex flex-col items-center text-center">
                <div className="w-9 h-9 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center mb-1 shadow-xs">
                  <Zap className="w-5 h-5 text-amber-600 animate-bounce" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  Keterbatasan Teori Atom Dalton
                </span>
                <h5 className="text-xs font-bold text-slate-800 mt-1">
                  Kegagalan Menjelaskan Fenomena Kelistrikan Materi
                </h5>
              </div>

              {/* Explanation Content */}
              <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 my-2 text-[11px] text-slate-700 space-y-1.5 leading-relaxed text-left">
                <p>
                  <strong className="text-slate-900">1. Postulat Bola Pejal Dalton (1803):</strong> Dalton mempostulatkan bahwa atom adalah partikel terkecil berbentuk bola pejal padat tanpa muatan listrik (netral mutlak) yang tidak dapat dibagi-bagi.
                </p>
                <p>
                  <strong className="text-amber-900">2. Anomali Kelistrikan:</strong> Berbagai gejala alam (seperti listrik statis saat menggosok kaca/ebonit atau hantaran arus tabung lucutan gas) membuktikan bahwa materi memiliki <strong>muatan listrik positif (+) dan negatif (−)</strong>.
                </p>
                <p>
                  <strong className="text-rose-800">3. Keterbatasan Model:</strong> Model bola pejal Dalton <strong>gagal total menjelaskan kelistrikan materi</strong> karena menolak keberadaan partikel penyusun yang lebih kecil (subatomik) di dalam atom.
                </p>
                <p className="text-[10px] text-slate-500 italic border-t border-slate-200 pt-1">
                  👉 <strong>Kelanjutan Sejarah:</strong> Keterbatasan fundamental ini kemudian mendorong <strong>J.J. Thomson (1897)</strong> menemukan partikel bermuatan negatif (<strong>elektron</strong>) dan meruntuhkan konsep atom pejal tak terbagi!
                </p>
              </div>

              {/* Card Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTestElectricity}
                  className="px-3 py-1.5 rounded-lg text-xs bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold border border-amber-300 flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-600" />
                  Uji Ulang Efek Listrik
                </button>
                <button
                  onClick={() => setShowElectricityCard(false)}
                  className="px-3.5 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-900 text-white font-semibold transition shadow-xs cursor-pointer"
                >
                  Tutup Penjelasan
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Reaction Law Info */}
        <div className="w-full text-center z-10 bg-white/85 py-1.5 px-3 rounded-xl border border-sky-100 shadow-2xs">
          <p className="text-xs text-sky-900 font-bold">
            {current.name} ({current.formula}): {current.ratio}
          </p>
          <p className="text-[11px] text-slate-500 font-medium">{current.law}</p>
        </div>
      </div>

      {/* Checklist Aksi Wajib Laboratorium */}
      <div className={`p-3 rounded-2xl border text-xs flex flex-wrap items-center justify-between gap-2 shadow-2xs ${
        isCompleted || (hasReactedOnce && hasTestedElectricityOnce)
          ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
          : 'bg-amber-50/90 border-amber-300 text-amber-950'
      }`}>
        <span className="font-bold text-[11px] uppercase tracking-wider">Aksi Wajib Lab:</span>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
              hasReactedOnce || isCompleted ? 'bg-emerald-600 text-white' : 'bg-amber-200 text-amber-800'
            }`}>
              {hasReactedOnce || isCompleted ? '✓' : '1'}
            </span>
            <span className={hasReactedOnce || isCompleted ? 'line-through text-slate-500 font-medium' : 'font-bold'}>
              Reaksikan jadi senyawa
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
              hasTestedElectricityOnce || isCompleted ? 'bg-emerald-600 text-white' : 'bg-amber-200 text-amber-800'
            }`}>
              {hasTestedElectricityOnce || isCompleted ? '✓' : '2'}
            </span>
            <span className={hasTestedElectricityOnce || isCompleted ? 'line-through text-slate-500 font-medium' : 'font-bold'}>
              Uji sifat kelistrikan materi
            </span>
          </div>
          {(isCompleted || (hasReactedOnce && hasTestedElectricityOnce)) && (
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-xs">
              +35 XP Tuntas
            </span>
          )}
        </div>
      </div>

      {/* Selector and Actions */}
      <div className="flex flex-col gap-2">
        {/* Compound Selector Buttons */}
        <div className="grid grid-cols-3 gap-2">
          {(['h2o', 'co', 'co2'] as ReactionType[]).map((type) => (
            <button
              key={type}
              onClick={() => {
                setSelectedReaction(type)
                setIsReacted(false)
                setShowElectricityCard(false)
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition border cursor-pointer ${selectedReaction === type
                ? 'bg-gradient-to-r from-blue-600 to-sky-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`}
            >
              {type === 'h2o' ? 'H₂O (Air)' : type === 'co' ? 'CO (Monoksida)' : 'CO₂ (Dioksida)'}
            </button>
          ))}
        </div>

        {/* Reaction and Electricity Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-1">
          <button
            onClick={() => {
                const newReacted = !isReacted
                setIsReacted(newReacted)
                if (newReacted) setHasReactedOnce(true)
              }}
            className="py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-500 to-blue-600 hover:brightness-105 text-white transition flex items-center justify-center gap-2 shadow-md shadow-sky-500/20 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isReacted ? 'rotate-180' : ''} transition-transform duration-500`} />
            {isReacted ? 'Pisahkan Unsur' : 'Reaksikan Jadi Senyawa'}
          </button>

          <button
            onClick={handleTestElectricity}
            disabled={isTestingElectricity}
            className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-white hover:bg-amber-50 text-amber-800 border border-amber-300 transition flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Zap className={`w-3.5 h-3.5 text-amber-500 ${isTestingElectricity ? 'animate-bounce' : ''}`} />
            {isTestingElectricity ? 'Menguji Kelistrikan...' : 'Uji Sifat Kelistrikan (Keterbatasan Dalton)'}
          </button>
        </div>
      </div>

      {/* Concept Notes: Periodic Trend Radius & Dalton Rules */}
      <div className="flex flex-col gap-2">
        {/* Periodic Radius Note */}
        <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5 shadow-2xs">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong>Proporsi Jari-Jari (Tren Periodik):</strong> Diameter visual bola atom disusun berdasarkan jari-jari atom sebenarnya: <strong>H (paling kecil: 36px) &lt; O (sedang: 52px) &lt; C (paling besar: 68px)</strong>. Walaupun massa atom O (16 sma) &gt; C (12 sma), jari-jari atom C lebih besar karena muatan inti efektif O pada periode 2 lebih kuat menarik elektron ke pusat.
          </p>
        </div>

        {/* Dalton Law Note */}
        <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-900 flex items-start gap-2.5 shadow-2xs">
          <AlertCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong>Aturan Bola Pejal Dalton:</strong> Atom tidak dapat diciptakan atau dimusnahkan. Dalam reaksi kimia, bola pejal atom hanya mengalami penataan ulang dengan saling bersentuhan langsung (tanpa garis ikatan kimia modern) dalam rasio perbandingan bilangan bulat sederhana.
          </p>
        </div>
      </div>
    </div>
  )
}
