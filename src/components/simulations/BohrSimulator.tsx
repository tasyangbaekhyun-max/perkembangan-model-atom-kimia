import { useState } from 'react'
import { Zap, Sparkles } from 'lucide-react'

interface TransitionInfo {
  from: number
  to: number
  colorName: string
  wavelength: number
  energy: number
  hexColor: string
  type: 'emission' | 'absorption'
}

export function BohrSimulator() {
  const [currentOrbit, setCurrentOrbit] = useState<number>(2)
  const [transitionMessage, setTransitionMessage] = useState<TransitionInfo | null>(null)
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false)

  const energyLevels: Record<number, number> = {
    1: -13.6,
    2: -3.4,
    3: -1.51,
    4: -0.85,
    5: -0.54,
  }

  const balmerTransitions: Record<number, { color: string; hex: string; nm: number }> = {
    3: { color: 'Merah (H-α)', hex: '#dc2626', nm: 656 },
    4: { color: 'Sian (H-β)', hex: '#0891b2', nm: 486 },
    5: { color: 'Biru (H-γ)', hex: '#2563eb', nm: 434 },
  }

  const handleJump = (targetOrbit: number) => {
    if (targetOrbit === currentOrbit || isTransitioning) return

    setIsTransitioning(true)
    const isEmission = targetOrbit < currentOrbit
    const deltaE = Math.abs(energyLevels[targetOrbit] - energyLevels[currentOrbit])

    let hex = '#0284c7'
    let colorName = 'Foton UV/IR'
    let nm = Math.round(1240 / deltaE)

    if (isEmission && targetOrbit === 2 && balmerTransitions[currentOrbit]) {
      hex = balmerTransitions[currentOrbit].hex
      colorName = balmerTransitions[currentOrbit].color
      nm = balmerTransitions[currentOrbit].nm
    }

    setTransitionMessage({
      from: currentOrbit,
      to: targetOrbit,
      colorName,
      wavelength: nm,
      energy: Number(deltaE.toFixed(2)),
      hexColor: hex,
      type: isEmission ? 'emission' : 'absorption',
    })

    setTimeout(() => {
      setCurrentOrbit(targetOrbit)
      setIsTransitioning(false)
    }, 600)
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Simulation Screen */}
      <div className="relative w-full h-80 rounded-2xl bg-gradient-to-b from-pink-50/90 via-white to-rose-50/90 border-2 border-pink-200/80 flex flex-col items-center justify-between p-4 overflow-hidden shadow-inner">
        
        {/* Top Header Tag */}
        <div className="w-full flex items-center justify-between z-10">
          <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-pink-100 text-pink-800 border border-pink-300">
            Model Bohr • Kuantisasi Orbit (1913)
          </span>
          <span className="text-xs font-mono font-bold text-pink-800 bg-white/90 px-2.5 py-0.5 rounded-full border border-pink-200">
            Kulit: n = {currentOrbit} ({energyLevels[currentOrbit]} eV)
          </span>
        </div>

        {/* Visual Arena: Concentric Bohr Shells */}
        <div className="relative flex items-center justify-center w-full flex-1">
          {/* Nucleus (+1 for Hydrogen) */}
          <div className="relative z-20 w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 shadow-md shadow-rose-500/30 flex items-center justify-center text-[10px] font-black text-white border-2 border-white ring-2 ring-rose-200">
            +1
          </div>

          {/* Shells n=1 to 5 */}
          {[1, 2, 3, 4, 5].map((n) => {
            const size = 38 + n * 34
            const isCurrent = currentOrbit === n

            return (
              <div
                key={n}
                onClick={() => handleJump(n)}
                className={`absolute rounded-full border-2 transition-all duration-300 cursor-pointer flex items-center justify-center group ${
                  isCurrent
                    ? 'border-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.3)] ring-2 ring-pink-300 bg-pink-500/5'
                    : 'border-slate-300/80 hover:border-pink-400'
                }`}
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                }}
                title={`Kulit n = ${n} (${energyLevels[n]} eV)`}
              >
                {/* Orbit Label */}
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold text-slate-500 group-hover:text-pink-600 transition-colors bg-white/90 px-1 rounded">
                  n={n}
                </span>

                {/* The Electron on the current orbit */}
                {isCurrent && (
                  <div
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 shadow-md shadow-blue-500/50 ring-2 ring-white flex items-center justify-center animate-spin-slow origin-center"
                    style={{
                      transformOrigin: `0px ${size / 2}px`,
                    }}
                  />
                )}
              </div>
            )
          })}

          {/* Photon wave banner when transitioning */}
          {transitionMessage && (
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 flex items-center gap-1.5 animate-pulse text-xs font-mono font-bold px-3 py-1.5 rounded-full bg-white shadow-xl border-2"
              style={{
                borderColor: transitionMessage.hexColor,
                color: transitionMessage.hexColor,
              }}
            >
              <Zap className="w-3.5 h-3.5" />
              {transitionMessage.type === 'emission'
                ? `Emisi Foton: ${transitionMessage.colorName} (λ = ${transitionMessage.wavelength} nm)`
                : `Absorpsi Foton: ΔE = +${transitionMessage.energy} eV`}
            </div>
          )}
        </div>

        {/* Macroscopic Hydrogen Line Spectrum Bar at bottom */}
        <div className="w-full bg-white/95 border-2 border-pink-200 rounded-2xl p-2.5 z-10 shadow-xs">
          <div className="flex items-center justify-between text-[10px] text-slate-600 font-bold mb-1 px-1">
            <span>Spektrum Emisi Deret Balmer Hidrogen (n → 2)</span>
            <span className="font-mono text-pink-700">Spektrum Tampak (Visible Light)</span>
          </div>

          <div className="relative w-full h-5 rounded-lg bg-slate-950 border border-slate-800 flex items-center overflow-hidden shadow-inner">
            {/* 656 nm Red */}
            <div
              onClick={() => handleJump(3)}
              className="absolute left-[80%] h-full w-2 bg-red-500 shadow-[0_0_8px_#ef4444] cursor-pointer hover:w-3 transition-all"
              title="Garis H-α (656 nm): n=3 → n=2"
            />
            {/* 486 nm Cyan */}
            <div
              onClick={() => handleJump(4)}
              className="absolute left-[50%] h-full w-2 bg-cyan-400 shadow-[0_0_8px_#22d3ee] cursor-pointer hover:w-3 transition-all"
              title="Garis H-β (486 nm): n=4 → n=2"
            />
            {/* 434 nm Blue */}
            <div
              onClick={() => handleJump(5)}
              className="absolute left-[30%] h-full w-2 bg-blue-500 shadow-[0_0_8px_#3b82f6] cursor-pointer hover:w-3 transition-all"
              title="Garis H-γ (434 nm): n=5 → n=2"
            />
            {/* 410 nm Violet */}
            <div
              className="absolute left-[15%] h-full w-2 bg-purple-500 shadow-[0_0_8px_#a855f7]"
              title="Garis H-δ (410 nm): n=6 → n=2"
            />
          </div>
        </div>
      </div>

      {/* Pre-set Quick Transition Buttons (Deret Balmer) */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold text-slate-700">Pilih Transisi Kuantum Deret Balmer:</span>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => {
              setCurrentOrbit(3)
              setTimeout(() => handleJump(2), 200)
            }}
            className="py-2.5 px-3 rounded-xl text-xs font-bold bg-red-50 text-red-700 border-2 border-red-200 hover:bg-red-100 transition flex items-center justify-between shadow-xs"
          >
            <span>n = 3 → 2</span>
            <span className="w-3 h-3 rounded-full bg-red-500 shadow-xs" />
          </button>

          <button
            onClick={() => {
              setCurrentOrbit(4)
              setTimeout(() => handleJump(2), 200)
            }}
            className="py-2.5 px-3 rounded-xl text-xs font-bold bg-cyan-50 text-cyan-800 border-2 border-cyan-200 hover:bg-cyan-100 transition flex items-center justify-between shadow-xs"
          >
            <span>n = 4 → 2</span>
            <span className="w-3 h-3 rounded-full bg-cyan-500 shadow-xs" />
          </button>

          <button
            onClick={() => {
              setCurrentOrbit(5)
              setTimeout(() => handleJump(2), 200)
            }}
            className="py-2.5 px-3 rounded-xl text-xs font-bold bg-blue-50 text-blue-800 border-2 border-blue-200 hover:bg-blue-100 transition flex items-center justify-between shadow-xs"
          >
            <span>n = 5 → 2</span>
            <span className="w-3 h-3 rounded-full bg-blue-500 shadow-xs" />
          </button>
        </div>
      </div>

      {/* Chemical Context Box */}
      <div className="p-3.5 rounded-2xl bg-pink-50 border border-pink-200 text-xs text-pink-900 flex items-start gap-2.5 shadow-xs">
        <Sparkles className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <strong>Aturan Bohr:</strong> Elektron hanya dapat berpindah tingkat energi dengan memancarkan atau menyerap foton sebesar perbedaan energi kedua kulit: <strong>ΔE = hν = hc/λ</strong>. Elektron tidak pernah berada di sela-sela antar kulit!
        </p>
      </div>
    </div>
  )
}
