import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, AlertTriangle, Radiation } from 'lucide-react'

interface AlphaParticle {
  id: number
  x: number
  y: number
  vy: number
  vx: number
  status: 'flying' | 'straight' | 'deflected' | 'bounced'
}

export function RutherfordSimulator({ onComplete, isCompleted }: { onComplete?: () => void; isCompleted?: boolean }) {
  const [activeTab, setActiveTab] = useState<'gold_foil' | 'atom_structure' | 'maxwell_paradox'>('gold_foil')
  const [visitedTabs, setVisitedTabs] = useState<Set<string>>(new Set(['gold_foil']))
  const onCompleteCalledRef = useRef<boolean>(false)
  
  // Gold foil simulation
  const [isRunning, setIsRunning] = useState<boolean>(true)
  const [particles, setParticles] = useState<AlphaParticle[]>([])
  const [stats, setStats] = useState({ straight: 0, deflected: 0, bounced: 0 })

  // Maxwell paradox state
  const [maxwellCollapsing, setMaxwellCollapsing] = useState<boolean>(false)
  const [electronRadius, setElectronRadius] = useState<number>(75)

  // Helper to switch tab and track visited
  const handleTabChange = (tab: 'gold_foil' | 'atom_structure' | 'maxwell_paradox') => {
    setActiveTab(tab)
    setVisitedTabs(prev => {
      const next = new Set(prev)
      next.add(tab)
      return next
    })
  }

  // Fire onComplete when all 3 tabs have been visited
  useEffect(() => {
    if (
      visitedTabs.has('gold_foil') &&
      visitedTabs.has('atom_structure') &&
      visitedTabs.has('maxwell_paradox') &&
      !onCompleteCalledRef.current &&
      !isCompleted
    ) {
      onCompleteCalledRef.current = true
      onComplete?.()
    }
  }, [visitedTabs, isCompleted, onComplete])

  // Gold foil animation loop
  useEffect(() => {
    if (!isRunning || activeTab !== 'gold_foil') return

    const interval = setInterval(() => {
      setParticles((prev) => {
        let updated = prev
          .map((p) => {
            let nextX = p.x + p.vx
            let nextY = p.y + p.vy
            let nextStatus = p.status

            // Gold nucleus center is at x = 160, y = 100
            const dx = nextX - 160
            const dy = nextY - 100
            const dist = Math.sqrt(dx * dx + dy * dy)

            // Coulomb repulsion when approaching the gold nucleus (+79)
            if (dist < 38 && p.status === 'flying') {
              if (Math.abs(dy) < 5) {
                p.vx = -3.5
                p.vy = (dy > 0 ? 1 : -1) * 2
                nextStatus = 'bounced'
              } else {
                const repulsionForce = 45 / (dist + 1)
                p.vy += (dy > 0 ? 1 : -1) * (repulsionForce * 0.15)
                p.vx = Math.max(1.5, p.vx - 0.5)
                nextStatus = 'deflected'
              }
            } else if (nextX > 320 && p.status === 'flying') {
              nextStatus = 'straight'
            }

            return {
              ...p,
              x: nextX,
              y: nextY,
              status: nextStatus,
            }
          })
          .filter((p) => p.x > -20 && p.x < 340 && p.y > -20 && p.y < 220)

        // Count stats for completed particles
        prev.forEach((p) => {
          if (p.x >= 320 && p.status === 'flying') {
            setStats((s) => ({ ...s, straight: s.straight + 1 }))
          } else if (p.status === 'deflected' && (p.x >= 320 || p.y <= 0 || p.y >= 200)) {
            setStats((s) => ({ ...s, deflected: s.deflected + 1 }))
          } else if (p.status === 'bounced' && p.x <= 20) {
            setStats((s) => ({ ...s, bounced: s.bounced + 1 }))
          }
        })

        if (Math.random() > 0.4) {
          const randomY = 60 + Math.random() * 80
          updated.push({
            id: Date.now() + Math.random(),
            x: 10,
            y: randomY,
            vx: 4.5,
            vy: 0,
            status: 'flying',
          })
        }

        return updated
      })
    }, 50)

    return () => clearInterval(interval)
  }, [isRunning, activeTab])

  // Maxwell paradox collapse animation
  useEffect(() => {
    if (!maxwellCollapsing || activeTab !== 'maxwell_paradox') return

    const interval = setInterval(() => {
      setElectronRadius((r) => {
        if (r <= 6) {
          setMaxwellCollapsing(false)
          return 6
        }
        return r - 1.5
      })
    }, 40)

    return () => clearInterval(interval)
  }, [maxwellCollapsing, activeTab])

  const allTabsVisited = visitedTabs.has('gold_foil') && visitedTabs.has('atom_structure') && visitedTabs.has('maxwell_paradox')

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Checklist Aksi Wajib Laboratorium */}
      <div className={`p-3 rounded-2xl border text-xs flex flex-wrap items-center justify-between gap-2 shadow-2xs ${
        isCompleted || allTabsVisited
          ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
          : 'bg-purple-50/90 border-purple-300 text-purple-950'
      }`}>
        <span className="font-bold text-[11px] uppercase tracking-wider">Aksi Wajib Lab:</span>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
              visitedTabs.has('gold_foil') || isCompleted ? 'bg-emerald-600 text-white' : 'bg-purple-200 text-purple-800'
            }`}>
              {visitedTabs.has('gold_foil') || isCompleted ? '✓' : '1'}
            </span>
            <span className={visitedTabs.has('gold_foil') || isCompleted ? 'line-through text-slate-500 font-medium' : 'font-bold'}>
              Hamburan Sinar α
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
              visitedTabs.has('atom_structure') || isCompleted ? 'bg-emerald-600 text-white' : 'bg-purple-200 text-purple-800'
            }`}>
              {visitedTabs.has('atom_structure') || isCompleted ? '✓' : '2'}
            </span>
            <span className={visitedTabs.has('atom_structure') || isCompleted ? 'line-through text-slate-500 font-medium' : 'font-bold'}>
              Skala Inti & Ruang Hampa
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
              visitedTabs.has('maxwell_paradox') || isCompleted ? 'bg-emerald-600 text-white' : 'bg-purple-200 text-purple-800'
            }`}>
              {visitedTabs.has('maxwell_paradox') || isCompleted ? '✓' : '3'}
            </span>
            <span className={visitedTabs.has('maxwell_paradox') || isCompleted ? 'line-through text-slate-500 font-medium' : 'font-bold'}>
              Uji Paradoks Maxwell
            </span>
          </div>
          {(isCompleted || allTabsVisited) && (
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-xs">
              +35 XP Tuntas
            </span>
          )}
        </div>
      </div>

      {/* Simulation Screen */}
      <div className="relative w-full min-h-[310px] rounded-2xl bg-gradient-to-b from-purple-50/90 via-white to-indigo-50/90 border-2 border-purple-200/80 flex flex-col items-center justify-between p-4 overflow-hidden shadow-inner">
        
        {/* Top Header Tag & Tabs */}
        <div className="w-full flex items-center justify-between z-10 gap-2 flex-wrap">
          <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-300">
            Model Inti Rutherford • 1911
          </span>

          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-purple-200 shadow-xs">
            <button
              onClick={() => handleTabChange('gold_foil')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition ${
                activeTab === 'gold_foil' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hamburan Sinar α
            </button>
            <button
              onClick={() => handleTabChange('atom_structure')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition ${
                activeTab === 'atom_structure' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Skala Inti
            </button>
            <button
              onClick={() => {
                handleTabChange('maxwell_paradox')
                setElectronRadius(75)
              }}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition ${
                activeTab === 'maxwell_paradox' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Paradoks Maxwell
            </button>
          </div>
        </div>

        {/* Tab 1: Gold Foil Alpha Particle Scattering Canvas */}
        {activeTab === 'gold_foil' && (
          <div className="relative w-full flex-1 flex items-center justify-center my-1">
            <svg className="w-full h-44 rounded-2xl bg-slate-950 border border-slate-800 shadow-md" viewBox="0 0 320 200">
              {/* Alpha gun emitter on left */}
              <rect x="0" y="85" width="22" height="30" rx="3" fill="#6366f1" />
              <text x="3" y="103" fontSize="8" fill="#fff" fontWeight="bold">α Gun</text>

              {/* Gold foil representation (vertical band) */}
              <line x1="160" y1="10" x2="160" y2="190" stroke="#facc15" strokeWidth="8" strokeOpacity="0.4" strokeDasharray="4 2" />

              {/* Gold Nuclei in the foil (+79) */}
              <circle cx="160" cy="40" r="7" fill="#f59e0b" />
              <circle cx="160" cy="100" r="9" fill="#ef4444" stroke="#fef08a" strokeWidth="2" />
              <text x="154" y="103" fontSize="8" fill="#fff" fontWeight="bold">+79</text>
              <circle cx="160" cy="160" r="7" fill="#f59e0b" />

              {/* Alpha particles flying */}
              {particles.map((p) => (
                <circle
                  key={p.id}
                  cx={p.x}
                  cy={p.y}
                  r="3.5"
                  fill={p.status === 'bounced' ? '#ef4444' : p.status === 'deflected' ? '#f59e0b' : '#38bdf8'}
                  className="filter drop-shadow-[0_0_5px_currentColor]"
                />
              ))}

              {/* Detection screen curve */}
              <path d="M 310 10 Q 280 100, 310 190" fill="transparent" stroke="#22c55e" strokeWidth="2.5" strokeDasharray="3 3" />
            </svg>

            {/* Real-time scattering statistics */}
            <div className="absolute bottom-1 w-full px-2 flex items-center justify-around text-[10px] font-mono font-bold bg-white/95 py-1.5 rounded-xl border border-purple-200 shadow-xs">
              <span className="text-sky-700">Tembus: {stats.straight} (&gt;99%)</span>
              <span className="text-amber-700">Belok: {stats.deflected} (~0.9%)</span>
              <span className="text-rose-700">Pantul: {stats.bounced} (1:20.000)</span>
            </div>
          </div>
        )}

        {/* Tab 2: Rutherford Model Scale & Vast Empty Space (No Concentric Bohr Shells) */}
        {activeTab === 'atom_structure' && (
          <div className="relative w-full flex-1 flex flex-col items-center justify-center my-1">
            <svg className="w-56 h-36" viewBox="-110 -70 220 140">
              {/* Outer boundary representing the atom volume - vast empty space */}
              <circle cx="0" cy="0" r="64" fill="rgba(243, 232, 255, 0.35)" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="4 3" />
              <text x="0" y="-52" textAnchor="middle" fontSize="6" fill="#7e22ce" fontWeight="bold" letterSpacing="0.4">
                BATAS VOLUME ATOM (RUANG KOSONG)
              </text>

              {/* Tilted conceptual Rutherford orbit 1 (angle -30deg) */}
              <g transform="rotate(-30)">
                <ellipse cx="0" cy="0" rx="58" ry="20" fill="none" stroke="#a855f7" strokeWidth="1" strokeDasharray="3 2" opacity="0.65" />
                <circle r="3.5" fill="#0284c7" stroke="#e0f2fe" strokeWidth="1">
                  <animateMotion dur="5s" repeatCount="indefinite" path="M -58 0 A 58 20 0 1 0 58 0 A 58 20 0 1 0 -58 0" />
                </circle>
              </g>

              {/* Tilted conceptual Rutherford orbit 2 (angle +40deg) */}
              <g transform="rotate(40)">
                <ellipse cx="0" cy="0" rx="58" ry="20" fill="none" stroke="#6366f1" strokeWidth="1" strokeDasharray="3 2" opacity="0.65" />
                <circle r="3.5" fill="#0284c7" stroke="#e0f2fe" strokeWidth="1">
                  <animateMotion dur="7s" repeatCount="indefinite" path="M 58 0 A 58 20 0 1 0 -58 0 A 58 20 0 1 0 58 0" />
                </circle>
              </g>

              {/* Central extremely tiny, dense positive nucleus */}
              <circle cx="0" cy="0" r="4.5" fill="#e11d48" stroke="#ffe4e6" strokeWidth="1.5">
                <animate attributeName="r" values="4;5;4" dur="2s" repeatCount="indefinite" />
              </circle>
              <text x="0" y="2.2" textAnchor="middle" fontSize="6.5" fill="#ffffff" fontWeight="900" pointerEvents="none">+</text>

              {/* Nucleus indicator tag */}
              <line x1="0" y1="5.5" x2="0" y2="24" stroke="#e11d48" strokeWidth="0.8" strokeDasharray="1 1" />
              <rect x="-34" y="25" width="68" height="13" rx="3.5" fill="#ffffff" stroke="#f43f5e" strokeWidth="0.8" />
              <text x="0" y="34" textAnchor="middle" fontSize="6.5" fill="#be123c" fontWeight="bold">Inti Atom Padat (+)</text>
            </svg>

            <div className="text-center max-w-md mt-1 px-2">
              <p className="text-[11px] text-slate-800 font-bold leading-tight">
                Sebagian besar volume atom merupakan ruang kosong! Inti atom berukuran sangat kecil dibandingkan ukuran keseluruhan atom.
              </p>
              <p className="text-[10px] text-slate-600 font-medium mt-0.5">
                Analogi: Jika inti atom sebesar kelereng di tengah stadion sepak bola, elektron berada di tribun paling atas!
              </p>
              <p className="text-[9px] text-purple-700/80 italic mt-0.5 font-medium">
                *Lintasan elektron ditampilkan sebagai ilustrasi konseptual model Rutherford, bukan kulit elektron dengan tingkat energi Bohr.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Maxwell Electrodynamics Paradox */}
        {activeTab === 'maxwell_paradox' && (
          <div className="relative w-full flex-1 flex flex-col items-center justify-center my-1">
            <div className="mb-1 px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-bold">
              ⚠️ Prediksi Berdasarkan Teori Klasik (Bukan Keadaan Sebenarnya)
            </div>

            <div className="relative w-36 h-36 rounded-full flex items-center justify-center border-2 border-slate-200 bg-white/70">
              {/* Nucleus */}
              <div className="w-4 h-4 rounded-full bg-rose-500 shadow-md shadow-rose-500 flex items-center justify-center text-[8px] font-bold text-white z-10">
                +
              </div>

              {/* Collapsing spiral trail */}
              <div
                className="absolute rounded-full border border-rose-400 transition-all duration-75 flex items-center justify-center"
                style={{
                  width: `${electronRadius * 2}px`,
                  height: `${electronRadius * 2}px`,
                }}
              >
                {/* Collapsing Electron emitting radiation */}
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-amber-400 shadow-md shadow-amber-400 animate-ping" />
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-amber-500" />
              </div>
            </div>

            <p className="text-[11px] text-rose-800 font-bold text-center max-w-sm mt-1">
              {electronRadius <= 6
                ? '💥 ATOM RUNTUH! Menurut fisika klasik Maxwell, elektron kehilangan energi dan menabrak inti dalam <10⁻⁸ detik!'
                : 'Muatan berakselerasi meradiasikan energi gelombang elektromagnetik dan spiral jatuh ke inti.'}
            </p>
          </div>
        )}

        {/* Footer info text */}
        <div className="w-full text-center mt-1">
          <p className="text-[11px] text-slate-500 font-medium">
            {activeTab === 'gold_foil'
              ? 'Hamburan partikel alfa membuktikan keberadaan inti atom pejal di pusat atom.'
              : activeTab === 'atom_structure'
              ? 'Ukuran inti atom jauh lebih kecil dibandingkan ukuran keseluruhan atom.'
              : 'Kelemahan Rutherford inilah yang mendorong Niels Bohr merumuskan postulat kuantisasi orbit!'}
          </p>
        </div>
      </div>

      {/* Controls */}
      {activeTab === 'gold_foil' && (
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-105 text-white transition flex items-center justify-center gap-2 shadow-md shadow-purple-600/20"
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isRunning ? 'Jeda Tembakan Partikel' : 'Lanjutkan Tembakan'}
          </button>
          <button
            onClick={() => {
              setParticles([])
              setStats({ straight: 0, deflected: 0, bounced: 0 })
            }}
            className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition flex items-center justify-center gap-2 shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            Reset Penghitung
          </button>
        </div>
      )}

      {activeTab === 'maxwell_paradox' && (
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              setElectronRadius(75)
              setMaxwellCollapsing(true)
            }}
            disabled={maxwellCollapsing}
            className="py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-500 to-red-600 hover:brightness-105 text-white transition flex items-center justify-center gap-2 shadow-md shadow-rose-600/20"
          >
            <Radiation className="w-3.5 h-3.5" />
            Simulasikan Keruntuhan Atom
          </button>
          <button
            onClick={() => {
              setMaxwellCollapsing(false)
              setElectronRadius(75)
            }}
            className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition flex items-center justify-center gap-2 shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            Reset Posisi Elektron
          </button>
        </div>
      )}

      {/* Chemical Fact Box */}
      <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 text-xs text-purple-900 flex items-start gap-2.5 shadow-xs">
        <AlertTriangle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <strong>Aturan Rutherford:</strong> Seluruh muatan positif dan hampir seluruh massa atom terkonsentrasi pada inti atom yang sangat kecil dan padat. Elektron berada di sekitar inti, sedangkan sebagian besar volume atom merupakan ruang kosong.
        </p>
      </div>
    </div>
  )
}
