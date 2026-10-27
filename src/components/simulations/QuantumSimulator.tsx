import { useState, useEffect } from 'react'
import { ShieldAlert } from 'lucide-react'

type OrbitalType = '1s' | '2s' | '2px' | '2py' | '2pz' | '2p_all'

interface QuantumPoint {
  x: number
  y: number
  opacity: number
}

export function QuantumSimulator() {
  const [selectedOrbital, setSelectedOrbital] = useState<OrbitalType>('1s')
  const [probabilityDensity, setProbabilityDensity] = useState<number>(85)
  const [points, setPoints] = useState<QuantumPoint[]>([])

  useEffect(() => {
    const totalPoints = Math.round((probabilityDensity / 100) * 160)
    const newPoints: QuantumPoint[] = []

    for (let i = 0; i < totalPoints; i++) {
      let x = 0
      let y = 0

      if (selectedOrbital === '1s') {
        const r = Math.pow(Math.random(), 1.8) * 45
        const theta = Math.random() * 2 * Math.PI
        x = r * Math.cos(theta)
        y = r * Math.sin(theta)
      } else if (selectedOrbital === '2s') {
        const isOuter = Math.random() > 0.3
        const r = isOuter ? 45 + Math.random() * 32 : Math.random() * 20
        const theta = Math.random() * 2 * Math.PI
        x = r * Math.cos(theta)
        y = r * Math.sin(theta)
      } else if (selectedOrbital === '2px') {
        const side = Math.random() > 0.5 ? 1 : -1
        const r = 18 + Math.pow(Math.random(), 1.4) * 55
        const angleSpread = (Math.random() - 0.5) * 0.9
        x = side * (r * Math.cos(angleSpread))
        y = r * Math.sin(angleSpread) * 0.45
      } else if (selectedOrbital === '2py') {
        const side = Math.random() > 0.5 ? 1 : -1
        const r = 18 + Math.pow(Math.random(), 1.4) * 55
        const angleSpread = (Math.random() - 0.5) * 0.9
        y = side * (r * Math.cos(angleSpread))
        x = r * Math.sin(angleSpread) * 0.45
      } else if (selectedOrbital === '2pz') {
        const side = Math.random() > 0.5 ? 1 : -1
        const r = 18 + Math.pow(Math.random(), 1.4) * 55
        const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.8
        x = side * (r * Math.cos(angle))
        y = side * (r * Math.sin(angle))
      } else if (selectedOrbital === '2p_all') {
        const axis = Math.floor(Math.random() * 3)
        const side = Math.random() > 0.5 ? 1 : -1
        const r = 18 + Math.pow(Math.random(), 1.4) * 55
        const spread = (Math.random() - 0.5) * 0.9
        if (axis === 0) {
          x = side * (r * Math.cos(spread))
          y = r * Math.sin(spread) * 0.45
        } else if (axis === 1) {
          y = side * (r * Math.cos(spread))
          x = r * Math.sin(spread) * 0.45
        } else {
          const angle = Math.PI / 4 + spread * 0.6
          x = side * (r * Math.cos(angle))
          y = side * (r * Math.sin(angle))
        }
      }

      newPoints.push({
        x,
        y,
        opacity: 0.4 + Math.random() * 0.6,
      })
    }

    setPoints(newPoints)
  }, [selectedOrbital, probabilityDensity])

  const quantumNumbers = {
    '1s': { n: 1, l: '0 (s)', ml: '0', shape: 'Bola simetris tunggal (Spherical)', node: '0 simpul radial' },
    '2s': { n: 2, l: '0 (s)', ml: '0', shape: 'Bola simetris dengan rongga', node: '1 simpul radial (P = 0)' },
    '2px': { n: 2, l: '1 (p)', ml: '-1', shape: 'Dumbbell sepanjang sumbu X', node: 'Bidang simpul di YZ' },
    '2py': { n: 2, l: '1 (p)', ml: '0', shape: 'Dumbbell sepanjang sumbu Y', node: 'Bidang simpul di XZ' },
    '2pz': { n: 2, l: '1 (p)', ml: '+1', shape: 'Dumbbell sepanjang sumbu Z', node: 'Bidang simpul di XY' },
    '2p_all': { n: 2, l: '1 (p)', ml: '-1, 0, +1', shape: 'Subkulit 2p lengkap (px + py + pz)', node: '3 orbital degenerate' },
  }

  const qInfo = quantumNumbers[selectedOrbital]

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Simulation Screen */}
      <div className="relative w-full h-80 rounded-2xl bg-gradient-to-b from-cyan-50/90 via-white to-blue-50/90 border-2 border-cyan-200/80 flex flex-col items-center justify-between p-4 overflow-hidden shadow-inner">
        
        {/* Top Header Tag */}
        <div className="w-full flex items-center justify-between z-10">
          <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-300">
            Awan Probabilitas Mekanika Kuantum (|Ψ|²)
          </span>
          <span className="text-xs font-mono font-bold text-cyan-900 bg-white/90 px-2.5 py-0.5 rounded-full border border-cyan-200">
            Orbital: <strong className="text-blue-600">{selectedOrbital}</strong>
          </span>
        </div>

        {/* Visual Arena: High Contrast Quantum Chamber */}
        <div className="relative flex items-center justify-center w-full flex-1 my-1">
          <div className="relative w-64 h-48 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden shadow-md">
            {/* Subtle Cartesian Axes */}
            <div className="absolute w-52 h-px bg-slate-800 pointer-events-none" />
            <div className="absolute h-52 w-px bg-slate-800 pointer-events-none" />

            {/* Nucleus dot */}
            <div className="relative z-20 w-3 h-3 rounded-full bg-rose-500 shadow-md shadow-rose-500 flex items-center justify-center text-[6px] font-bold text-white ring-2 ring-white/50">
              +
            </div>

            {/* Cloud Points representing |Ψ|² probability */}
            {points.map((pt, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-cyan-300 pointer-events-none filter blur-[0.6px] transition-all duration-300"
                style={{
                  transform: `translate(${pt.x}px, ${pt.y}px)`,
                  opacity: pt.opacity,
                }}
              />
            ))}

            {/* Radial Node indicator for 2s orbital */}
            {selectedOrbital === '2s' && (
              <div className="absolute w-24 h-24 rounded-full border-2 border-dashed border-amber-400/60 pointer-events-none animate-pulse">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px] font-mono font-bold text-amber-300 bg-slate-900 px-1 rounded">
                  Simpul Radial (P=0)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 4 Quantum Numbers Dashboard */}
        <div className="w-full bg-white/95 border-2 border-cyan-200 rounded-2xl p-2.5 z-10 shadow-xs">
          <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
            <div className="p-1 rounded-xl bg-cyan-50 border border-cyan-100">
              <span className="text-slate-500 block text-[9px] font-bold">Utama (n)</span>
              <span className="font-black text-cyan-800">{qInfo.n}</span>
            </div>
            <div className="p-1 rounded-xl bg-cyan-50 border border-cyan-100">
              <span className="text-slate-500 block text-[9px] font-bold">Azimut (l)</span>
              <span className="font-black text-cyan-800">{qInfo.l}</span>
            </div>
            <div className="p-1 rounded-xl bg-cyan-50 border border-cyan-100">
              <span className="text-slate-500 block text-[9px] font-bold">Magnetik (m_l)</span>
              <span className="font-black text-cyan-800">{qInfo.ml}</span>
            </div>
            <div className="p-1 rounded-xl bg-cyan-50 border border-cyan-100">
              <span className="text-slate-500 block text-[9px] font-bold">Spin (m_s)</span>
              <span className="font-black text-cyan-800">± ½</span>
            </div>
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-600 font-semibold px-1">
            <span>Bentuk: {qInfo.shape}</span>
            <span className="text-amber-700">{qInfo.node}</span>
          </div>
        </div>
      </div>

      {/* Orbital Selector Buttons */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold text-slate-700">Pilih Bentuk Orbital Atom:</span>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
          {(['1s', '2s', '2px', '2py', '2pz', '2p_all'] as OrbitalType[]).map((orb) => (
            <button
              key={orb}
              onClick={() => setSelectedOrbital(orb)}
              className={`py-2 px-2 rounded-xl text-xs font-mono font-bold transition border ${
                selectedOrbital === orb
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-blue-600 shadow-md shadow-cyan-500/20'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              {orb}
            </button>
          ))}
        </div>
      </div>

      {/* Probability Slider */}
      <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between text-xs text-slate-700 font-medium">
          <span>Tingkat Kerapatan Peluang Menemukan Elektron (|Ψ|²)</span>
          <span className="font-mono font-bold text-blue-600">{probabilityDensity}%</span>
        </div>
        <input
          type="range"
          min="40"
          max="100"
          value={probabilityDensity}
          onChange={(e) => setProbabilityDensity(Number(e.target.value))}
          className="w-full accent-blue-600 cursor-pointer"
        />
      </div>

      {/* Strict Anti-Misconception Note */}
      <div className="p-3.5 rounded-2xl bg-cyan-50 border border-cyan-200 text-xs text-cyan-900 flex items-start gap-2.5 shadow-xs">
        <ShieldAlert className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-cyan-900">Akurasi Hakiki Mekanika Kuantum:</p>
          <p className="text-[11px] leading-relaxed text-cyan-800">
            Elektron <strong>TIDAK bergerak dalam lintasan orbit lingkaran planet</strong>! Menurut Prinsip Ketidakpastian Heisenberg, kita hanya dapat memetakan daerah ruang 3D (orbital) dengan peluang tertinggi menemukan elektron. Titik-titik di atas adalah representasi densitas awan probabilitas.
          </p>
        </div>
      </div>
    </div>
  )
}
