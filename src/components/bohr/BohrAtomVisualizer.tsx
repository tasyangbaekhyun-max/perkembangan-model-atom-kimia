import { useState } from 'react'
import type { BohrElement, ShellDefinition } from '../../data/bohrElementsData'
import { BOHR_SHELL_DEFINITIONS } from '../../data/bohrElementsData'

interface Props {
  element: BohrElement
  showShellLabels: boolean
  showNucleusParticles: boolean
  showElectrons: boolean
  isRotating: boolean
  selectedShellName: string | null
  onSelectShell: (shellName: string | null) => void
}

export function BohrAtomVisualizer({
  element,
  showShellLabels,
  showNucleusParticles,
  showElectrons,
  isRotating,
  selectedShellName,
  onSelectShell,
}: Props) {
  const [hoveredShell, setHoveredShell] = useState<string | null>(null)

  // Shell radius configuration
  const SHELL_RADII: Record<string, number> = {
    K: 54,
    L: 90,
    M: 126,
    N: 162,
  }

  // Dynamic responsive bound to prevent clipping on outer shells
  const maxOccupiedShells = element.occupiedShells
  const bound = maxOccupiedShells <= 1 ? 95 : maxOccupiedShells === 2 ? 130 : maxOccupiedShells === 3 ? 168 : 205
  const viewBox = `${-bound} ${-bound} ${bound * 2} ${bound * 2}`

  // Rotation speeds for shells (inner faster, outer slower)
  const SHELL_DURATIONS: Record<string, number> = {
    K: 10,
    L: 16,
    M: 22,
    N: 28,
  }

  // Active shell names present in this element
  const occupiedShellNames = (['K', 'L', 'M', 'N'] as const).filter(
    (s) => element.shells[s] !== undefined && (element.shells[s] as number) > 0
  )

  // Generate representative clustered coordinates for protons and neutrons in nucleus
  const totalNucleons = Math.min(element.protons + element.neutrons, 24)
  const nucleusSpheres = Array.from({ length: totalNucleons }).map((_, i) => {
    const isProton = i % 2 === 0
    const phi = Math.acos(1 - 2 * ((i + 0.5) / totalNucleons))
    const theta = Math.PI * (1 + Math.sqrt(5)) * i
    const r = Math.min(13, 3.5 + Math.sqrt(i) * 2.2)
    const x = r * Math.sin(phi) * Math.cos(theta)
    const y = r * Math.sin(phi) * Math.sin(theta)
    return { id: i, x, y, isProton }
  })

  return (
    <div className="relative w-full h-[360px] sm:h-[400px] flex items-center justify-center bg-radial from-slate-50 via-white to-pink-50/40 rounded-3xl border border-slate-200/80 overflow-hidden shadow-inner select-none">
      
      {/* SVG Canvas with dynamic viewBox */}
      <svg
        className="w-full h-full max-w-[420px] max-h-[420px] filter drop-shadow-sm transition-all duration-300"
        viewBox={viewBox}
      >
        <defs>
          {/* 3D Proton Gradient (Red) */}
          <radialGradient id="protonGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fca5a5" />
            <stop offset="40%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#991b1b" />
          </radialGradient>

          {/* 3D Neutron Gradient (Cyan-Blue) */}
          <radialGradient id="neutronGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#e0f2fe" />
            <stop offset="45%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0369a1" />
          </radialGradient>

          {/* 3D Electron Gradient (Deep Blue with Glowing Specular Highlight) */}
          <radialGradient id="electronGrad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#e0f2fe" />
            <stop offset="30%" stopColor="#38bdf8" />
            <stop offset="75%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#075985" />
          </radialGradient>

          {/* Shell Glow filter for active/hovered shell */}
          <filter id="shellGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ── CONCENTRIC ELECTRON SHELLS ─────────────────────── */}
        {BOHR_SHELL_DEFINITIONS.slice(0, Math.max(element.occupiedShells, 2)).map((def: ShellDefinition) => {
          const radius = SHELL_RADII[def.name]
          if (!radius) return null

          const isOccupied = element.shells[def.name as keyof typeof element.shells] !== undefined
          const electronCount = element.shells[def.name as keyof typeof element.shells] || 0
          const isSelected = selectedShellName === def.name
          const isHovered = hoveredShell === def.name
          const isFull = electronCount >= def.maxCapacity

          return (
            <g
              key={def.name}
              className="cursor-pointer transition-all duration-200"
              onClick={() => onSelectShell(isSelected ? null : def.name)}
              onMouseEnter={() => setHoveredShell(def.name)}
              onMouseLeave={() => setHoveredShell(null)}
            >
              {/* Invisible wide track hit-area for easy clicks */}
              <circle cx="0" cy="0" r={radius} fill="none" stroke="transparent" strokeWidth="18" />

              {/* The Concentric Shell Line */}
              <circle
                cx="0"
                cy="0"
                r={radius}
                fill={isSelected || isHovered ? 'rgba(236, 72, 153, 0.04)' : 'none'}
                stroke={
                  isSelected
                    ? '#ec4899'
                    : isHovered
                    ? '#f472b6'
                    : isOccupied
                    ? '#cbd5e1'
                    : '#e2e8f0'
                }
                strokeWidth={isSelected ? '2.5' : isHovered ? '2' : '1.2'}
                strokeDasharray={isOccupied ? 'none' : '4 3'}
                filter={isSelected ? 'url(#shellGlow)' : undefined}
                className="transition-colors duration-200"
              />

              {/* Shell Label Tag: e.g. K (n=1) */}
              {showShellLabels && (
                <g transform={`translate(${radius * Math.cos(-Math.PI / 4)}, ${radius * Math.sin(-Math.PI / 4)})`}>
                  <rect
                    x="-18"
                    y="-9"
                    width="36"
                    height="18"
                    rx="5"
                    fill="#ffffff"
                    stroke={isSelected ? '#ec4899' : isHovered ? '#f472b6' : '#cbd5e1'}
                    strokeWidth="1"
                    className="shadow-xs"
                  />
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    fontSize="8.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                    fill={isSelected ? '#be185d' : isHovered ? '#db2777' : '#475569'}
                  >
                    {def.name}₁
                  </text>
                  {/* Indicator dot if full */}
                  {isFull && (
                    <circle cx="14" cy="-5" r="2.5" fill="#10b981" />
                  )}
                </g>
              )}
            </g>
          )
        })}

        {/* ── NUCLEUS (ATOMIC CENTER) ───────────────────────── */}
        <g className="cursor-pointer" onClick={() => onSelectShell(null)}>
          {/* Subtle Outer Nucleus Halo */}
          <circle cx="0" cy="0" r="22" fill="rgba(244, 63, 94, 0.08)" />

          {showNucleusParticles ? (
            /* Clustered Protons & Neutrons with 3D Shading */
            <g>
              {nucleusSpheres.map((s) => (
                <g key={s.id} transform={`translate(${s.x}, ${s.y})`}>
                  <circle
                    r="4.2"
                    fill={s.isProton ? 'url(#protonGrad)' : 'url(#neutronGrad)'}
                    stroke="#ffffff"
                    strokeWidth="0.6"
                    className="filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)]"
                  />
                  {s.isProton && (
                    <text
                      x="0"
                      y="1.8"
                      textAnchor="middle"
                      fontSize="5"
                      fill="#ffffff"
                      fontWeight="900"
                      pointerEvents="none"
                    >
                      +
                    </text>
                  )}
                </g>
              ))}

              {/* Central Nucleus Summary Badge */}
              <circle cx="0" cy="0" r="11" fill="rgba(255,255,255,0.85)" stroke="#fda4af" strokeWidth="1" />
              <text x="0" y="2" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#be123c">
                {element.symbol}
              </text>
            </g>
          ) : (
            /* Compact Nucleus View */
            <g>
              <circle cx="0" cy="0" r="16" fill="url(#protonGrad)" stroke="#ffffff" strokeWidth="1.5" />
              <text x="0" y="3" textAnchor="middle" fontSize="9" fontWeight="900" fill="#ffffff">
                +{element.protons}
              </text>
            </g>
          )}
        </g>

        {/* ── ORBITING ELECTRONS ON SHELLS ──────────────────── */}
        {showElectrons &&
          occupiedShellNames.map((shellName) => {
            const radius = SHELL_RADII[shellName]
            const count = element.shells[shellName] || 0
            if (!radius || count <= 0) return null

            const duration = SHELL_DURATIONS[shellName] || 16

            return (
              <g
                key={`orbit-${shellName}`}
                style={
                  isRotating
                    ? {
                        animation: `spinSlow ${duration}s linear infinite`,
                        transformOrigin: '0px 0px',
                      }
                    : undefined
                }
              >
                {Array.from({ length: count }).map((_, i) => {
                  // Equidistant angular spacing: starting from top (-PI/2)
                  const angle = -Math.PI / 2 + (2 * Math.PI * i) / count
                  const cx = radius * Math.cos(angle)
                  const cy = radius * Math.sin(angle)

                  return (
                    <g
                      key={`e-${shellName}-${i}`}
                      transform={`translate(${cx}, ${cy})`}
                      className="cursor-pointer transition-transform duration-200 hover:scale-125"
                    >
                      {/* Electron Sphere with 3D gradient */}
                      <circle
                        r="6"
                        fill="url(#electronGrad)"
                        stroke="#ffffff"
                        strokeWidth="1.2"
                        className="filter drop-shadow-[0_1px_3px_rgba(2,132,199,0.5)]"
                      />
                      {/* Negative sign (-) on electron */}
                      <text
                        x="0"
                        y="1.8"
                        textAnchor="middle"
                        fontSize="7"
                        fill="#ffffff"
                        fontWeight="900"
                        pointerEvents="none"
                      >
                        −
                      </text>
                    </g>
                  )
                })}
              </g>
            )
          })}
      </svg>

      {/* Floating Center-Top Real-time Atom Badge */}
      <div className="absolute top-3 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-2xl border border-slate-200/80 shadow-xs z-10 text-[11px] font-mono">
        <span className="font-bold text-slate-800">{element.name} ({element.symbol})</span>
        <span className="text-slate-300">|</span>
        <span className="text-rose-600 font-bold">p⁺: {element.protons}</span>
        <span className="text-sky-600 font-bold">n⁰: {element.neutrons}</span>
        <span className="text-blue-700 font-bold">e⁻: {element.electrons}</span>
      </div>

      {/* Floating Active Shell Details Tooltip / Card */}
      {(selectedShellName || hoveredShell) && (
        <div className="absolute bottom-3 right-4 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border-2 border-pink-300 shadow-md z-10 text-xs flex flex-col gap-1 max-w-[200px] animate-fade-in">
          {(() => {
            const shellKey = selectedShellName || hoveredShell || 'K'
            const shellDef = BOHR_SHELL_DEFINITIONS.find((d) => d.name === shellKey)
            const count = element.shells[shellKey as keyof typeof element.shells] || 0
            const max = shellDef?.maxCapacity || 2
            const isFull = count >= max

            return (
              <>
                <div className="flex items-center justify-between">
                  <span className="font-black text-pink-700">Kulit {shellKey} (n = {shellDef?.n})</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${isFull ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                    {isFull ? 'Penuh' : `${count}/${max} e⁻`}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium">
                  Kapasitas maksimum rumus 2n²: <strong>{max} elektron</strong>
                </p>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-pink-500 transition-all duration-300"
                    style={{ width: `${Math.min(100, (count / max) * 100)}%` }}
                  />
                </div>
              </>
            )
          })()}
        </div>
      )}
    </div>
  )
}
