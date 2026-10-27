import { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw, AlertTriangle, Radiation } from 'lucide-react'

interface AlphaParticle {
  id: number
  x: number
  y: number
  vy: number
  vx: number
  status: 'flying' | 'straight' | 'deflected' | 'bounced'
}

export function RutherfordSimulator() {
  const [activeTab, setActiveTab] = useState<'gold_foil' | 'atom_structure' | 'maxwell_paradox'>('gold_foil')
  
  // Gold foil simulation
  const [isRunning, setIsRunning] = useState<boolean>(true)
  const [particles, setParticles] = useState<AlphaParticle[]>([])
  const [stats, setStats] = useState({ straight: 0, deflected: 0, bounced: 0 })

  // Maxwell paradox state
  const [maxwellCollapsing, setMaxwellCollapsing] = useState<boolean>(false)
  const [electronRadius, setElectronRadius] = useState<number>(75)

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

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Simulation Screen */}
      <div className="relative w-full h-72 rounded-2xl bg-gradient-to-b from-purple-50/90 via-white to-indigo-50/90 border-2 border-purple-200/80 flex flex-col items-center justify-between p-4 overflow-hidden shadow-inner">
        
        {/* Top Header Tag & Tabs */}
        <div className="w-full flex items-center justify-between z-10">
          <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-300">
            Model Inti Rutherford • 1911
          </span>

          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-purple-200 shadow-xs">
            <button
              onClick={() => setActiveTab('gold_foil')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition ${
                activeTab === 'gold_foil' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hamburan Sinar α
            </button>
            <button
              onClick={() => setActiveTab('atom_structure')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition ${
                activeTab === 'atom_structure' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Skala Inti
            </button>
            <button
              onClick={() => {
                setActiveTab('maxwell_paradox')
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
          <div className="relative w-full flex-1 flex items-center justify-center">
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

        {/* Tab 2: Planetary Empty Space Scale */}
        {activeTab === 'atom_structure' && (
          <div className="relative w-full flex-1 flex flex-col items-center justify-center">
            <div className="relative w-44 h-44 rounded-full border-2 border-dashed border-purple-300 flex items-center justify-center bg-white/70">
              {/* Very tiny positive nucleus in center */}
              <div className="w-3.5 h-3.5 rounded-full bg-rose-500 shadow-md shadow-rose-500/80 flex items-center justify-center ring-2 ring-rose-200 animate-pulse">
                <span className="text-[6px] font-bold text-white">+</span>
              </div>

              {/* Orbiting electrons in wide vacuum space */}
              <div className="absolute w-36 h-36 rounded-full border border-purple-200 animate-spin-slow">
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-400" />
              </div>
              <div className="absolute w-28 h-28 rounded-full border border-purple-200 animate-spin-reverse">
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-400" />
              </div>
            </div>

            <p className="text-[11px] text-slate-700 font-semibold mt-2 text-center max-w-sm">
              <strong>99.999% Ruang Hampa!</strong> Jika inti atom sebesar kelereng di tengah stadion sepak bola, elektron berada di tribun paling atas!
            </p>
          </div>
        )}

        {/* Tab 3: Maxwell Electrodynamics Paradox */}
        {activeTab === 'maxwell_paradox' && (
          <div className="relative w-full flex-1 flex flex-col items-center justify-center">
            <div className="relative w-44 h-44 rounded-full flex items-center justify-center border-2 border-slate-200 bg-white/70">
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
        <div className="w-full text-center">
          <p className="text-[11px] text-slate-500 font-medium">
            {activeTab === 'gold_foil'
              ? 'Hamburan partikel alfa membuktikan keberadaan inti atom pejal di pusat atom.'
              : activeTab === 'atom_structure'
              ? 'Rasio ukuran inti terhadap keseluruhan atom adalah sekitar 1 : 100.000.'
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
          <strong>Aturan Rutherford:</strong> Seluruh muatan positif terkonsentrasi di inti atom yang amat sangat kecil, sedangkan elektron bergerak bebas di ruang hampa sekitarnya.
        </p>
      </div>
    </div>
  )
}
