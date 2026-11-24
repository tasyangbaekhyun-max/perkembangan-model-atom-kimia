import { useState } from 'react'
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Eye,
  EyeOff,
  Layers,
  Play,
  Pause,
  Atom,
  HelpCircle,
} from 'lucide-react'
import {
  BOHR_ELEMENTS,
  BOHR_SHELL_DEFINITIONS,
  type BohrElement,
} from '../../data/bohrElementsData'
import { BohrAtomVisualizer } from './BohrAtomVisualizer'

export function BohrStructureSimulator() {
  const [selectedZ, setSelectedZ] = useState<number>(6) // Default: Carbon (C), Z=6 as in reference
  const [selectedShellName, setSelectedShellName] = useState<string | null>(null)

  // Interactive visibility toggles
  const [showShellLabels, setShowShellLabels] = useState<boolean>(true)
  const [showNucleusParticles, setShowNucleusParticles] = useState<boolean>(true)
  const [showElectrons, setShowElectrons] = useState<boolean>(true)
  const [isRotating, setIsRotating] = useState<boolean>(true)

  // Current element object
  const currentElement: BohrElement =
    BOHR_ELEMENTS.find((el) => el.z === selectedZ) || BOHR_ELEMENTS[0]

  // Handlers for next / prev element
  const handlePrevElement = () => {
    const currentIndex = BOHR_ELEMENTS.findIndex((el) => el.z === selectedZ)
    if (currentIndex > 0) {
      setSelectedZ(BOHR_ELEMENTS[currentIndex - 1].z)
      setSelectedShellName(null)
    }
  }

  const handleNextElement = () => {
    const currentIndex = BOHR_ELEMENTS.findIndex((el) => el.z === selectedZ)
    if (currentIndex < BOHR_ELEMENTS.length - 1) {
      setSelectedZ(BOHR_ELEMENTS[currentIndex + 1].z)
      setSelectedShellName(null)
    }
  }

  const handleReset = () => {
    setSelectedZ(6) // Reset to Carbon
    setSelectedShellName(null)
    setShowShellLabels(true)
    setShowNucleusParticles(true)
    setShowElectrons(true)
    setIsRotating(true)
  }

  return (
    <div className="bg-white border-2 border-pink-100 rounded-3xl p-5 sm:p-7 shadow-sm flex flex-col gap-6 animate-fade-in">
      
      {/* ── HEADER MODUL STRUKTUR MODEL ATOM BOHR ────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-bold mb-1 border border-pink-200">
            <Atom className="w-3.5 h-3.5 text-pink-600" />
            <span>Simulasi Struktur Atom &amp; Konfigurasi Kulit Bohr</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Eksplorasi Struktur Atom Bohr (Z = 1 s.d. 20)
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Pelajari bagaimana elektron terdistribusi ke dalam kulit bertingkat energi (K, L, M, N) berdasarkan nomor atom.
          </p>
        </div>

        {/* Global Reset Button */}
        <button
          onClick={handleReset}
          className="self-start md:self-auto px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer border border-slate-200"
          title="Reset pilihan atom ke default (Karbon)"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset Simulasi</span>
        </button>
      </div>

      {/* ── MINI PERIODIC QUICK SELECTOR PILLS ───────────────── */}
      <div className="flex flex-col gap-2 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-pink-600" />
            Pilih Unsur Kimia (Z = 1 – 20):
          </span>
          <span className="text-[11px] font-mono font-medium text-slate-500">
            Terpilih: <strong>{currentElement.name} ({currentElement.symbol})</strong>
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-1 scrollbar-thin">
          {BOHR_ELEMENTS.map((el) => {
            const isSelected = el.z === selectedZ
            return (
              <button
                key={el.z}
                onClick={() => {
                  setSelectedZ(el.z)
                  setSelectedShellName(null)
                }}
                className={`px-2.5 py-1.5 rounded-xl font-mono text-xs font-bold transition shrink-0 flex flex-col items-center justify-center border cursor-pointer min-w-[42px] ${
                  isSelected
                    ? 'bg-gradient-to-b from-pink-500 to-rose-600 text-white border-pink-600 shadow-sm shadow-pink-500/30 scale-105'
                    : 'bg-white hover:bg-pink-50 text-slate-700 border-slate-200 hover:border-pink-300'
                }`}
                title={`${el.name} (Z = ${el.z})`}
              >
                <span className="text-[9px] opacity-75 font-normal leading-none">{el.z}</span>
                <span className="text-xs font-black leading-tight">{el.symbol}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── MAIN WORKSPACE: VISUALIZER (LEFT) + CONFIGURATION (RIGHT) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: ATOM VISUALIZER & INTERACTION CONTROLS (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          
          {/* Top Bar: Prev / Next Navigator & Dropdown Selector */}
          <div className="flex items-center justify-between gap-2 p-2 bg-slate-50 border border-slate-200 rounded-2xl">
            <button
              onClick={handlePrevElement}
              disabled={selectedZ === 1}
              className="p-2 rounded-xl bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 transition border border-slate-200 shadow-2xs cursor-pointer"
              title="Atom Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Direct Element Dropdown */}
            <div className="flex-1 max-w-xs">
              <select
                value={selectedZ}
                onChange={(e) => {
                  setSelectedZ(Number(e.target.value))
                  setSelectedShellName(null)
                }}
                className="w-full py-1.5 px-3 rounded-xl border border-slate-200 bg-white font-bold text-xs text-slate-800 shadow-2xs focus:ring-2 focus:ring-pink-400 focus:outline-hidden"
              >
                {BOHR_ELEMENTS.map((el) => (
                  <option key={el.z} value={el.z}>
                    Z = {el.z} • {el.name} ({el.symbol}) — Konfigurasi: {el.configString}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleNextElement}
              disabled={selectedZ === 20}
              className="p-2 rounded-xl bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 transition border border-slate-200 shadow-2xs cursor-pointer"
              title="Atom Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* SVG Visualizer Canvas Component */}
          <BohrAtomVisualizer
            element={currentElement}
            showShellLabels={showShellLabels}
            showNucleusParticles={showNucleusParticles}
            showElectrons={showElectrons}
            isRotating={isRotating}
            selectedShellName={selectedShellName}
            onSelectShell={setSelectedShellName}
          />

          {/* Bottom Interactive Toggles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <button
              onClick={() => setShowShellLabels(!showShellLabels)}
              className={`py-2 px-2.5 rounded-xl text-[11px] font-bold border transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer ${
                showShellLabels
                  ? 'bg-pink-50 text-pink-700 border-pink-200'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {showShellLabels ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>Label Kulit</span>
            </button>

            <button
              onClick={() => setShowNucleusParticles(!showNucleusParticles)}
              className={`py-2 px-2.5 rounded-xl text-[11px] font-bold border transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer ${
                showNucleusParticles
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Atom className="w-3.5 h-3.5" />
              <span>Partikel Inti</span>
            </button>

            <button
              onClick={() => setShowElectrons(!showElectrons)}
              className={`py-2 px-2.5 rounded-xl text-[11px] font-bold border transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer ${
                showElectrons
                  ? 'bg-sky-50 text-sky-700 border-sky-200'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px] font-black leading-none">
                −
              </span>
              <span>Elektron</span>
            </button>

            <button
              onClick={() => setIsRotating(!isRotating)}
              className={`py-2 px-2.5 rounded-xl text-[11px] font-bold border transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer ${
                isRotating
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isRotating ? 'Jeda Orbit' : 'Putar Orbit'}</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: DISTRIBUTION PANEL & BOHR RULES (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Card 1: Element Identity & Real-time Subatomic Count */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-pink-50/50 border border-slate-200 flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-pink-700">
                  {currentElement.group} • Periode {currentElement.period}
                </span>
                <h4 className="text-xl font-black text-slate-900 mt-0.5">
                  {currentElement.name} ({currentElement.symbol})
                </h4>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-slate-400 block">Nomor Atom (Z)</span>
                <span className="text-2xl font-black text-pink-600 leading-none">
                  {currentElement.z}
                </span>
              </div>
            </div>

            {/* Subatomic Particle Badges */}
            <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-200/80">
              <div className="p-2 rounded-xl bg-white border border-rose-200 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-500 block">Proton (p⁺)</span>
                <span className="text-base font-black text-rose-600">{currentElement.protons}</span>
              </div>
              <div className="p-2 rounded-xl bg-white border border-sky-200 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-500 block">Neutron (n⁰)</span>
                <span className="text-base font-black text-sky-600">{currentElement.neutrons}</span>
              </div>
              <div className="p-2 rounded-xl bg-white border border-blue-200 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-500 block">Elektron (e⁻)</span>
                <span className="text-base font-black text-blue-600">{currentElement.electrons}</span>
              </div>
            </div>

            {/* Description note */}
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              {currentElement.description}
            </p>
          </div>

          {/* Card 2: Bohr Electron Configuration & Shell Distribution */}
          <div className="p-4 rounded-2xl bg-white border-2 border-pink-100 flex flex-col gap-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-pink-600" />
                Konfigurasi Elektron Model Bohr
              </span>
              <span className="text-xs font-mono font-black text-pink-600 bg-pink-50 px-2 py-0.5 rounded-lg border border-pink-200">
                {currentElement.configString}
              </span>
            </div>

            {/* Distribution on each shell (K, L, M, N) */}
            <div className="space-y-2.5">
              {BOHR_SHELL_DEFINITIONS.slice(0, 4).map((def) => {
                const count = currentElement.shells[def.name as keyof typeof currentElement.shells] || 0
                const isOccupied = count > 0
                const max = def.maxCapacity
                const isFull = count >= max
                const isSelected = selectedShellName === def.name

                return (
                  <div
                    key={def.name}
                    onClick={() => setSelectedShellName(isSelected ? null : def.name)}
                    className={`p-2.5 rounded-xl border transition cursor-pointer flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-pink-50/90 border-pink-400 ring-1 ring-pink-300'
                        : isOccupied
                        ? 'bg-slate-50/80 border-slate-200 hover:border-pink-200'
                        : 'bg-slate-50/40 border-slate-100 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-lg flex items-center justify-center font-mono font-bold text-[10px] ${
                          isOccupied ? 'bg-pink-600 text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {def.name}
                        </span>
                        <span className="font-bold text-slate-800">
                          Kulit {def.name} (n = {def.n})
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-slate-700">
                          {count} <span className="text-slate-400 font-normal">/ {max} e⁻</span>
                        </span>
                        {isFull && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                            Penuh
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress bar of shell capacity */}
                    <div className="w-full bg-slate-200/70 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 transition-all duration-300"
                        style={{ width: `${Math.min(100, (count / max) * 100)}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Capacity Mathematical Rule Note */}
            <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-slate-700 text-[11px] leading-relaxed flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <p>
                <strong>Rumus Kapasitas Kulit:</strong> Jumlah elektron maksimum yang dapat ditampung kulit ke-n dihitung dengan <strong>2n²</strong> (K=2, L=8, M=18, N=32). Elektron valensi (kulit terluar) stabil maksimal berjumlah <strong>8 elektron</strong> (aturan oktet).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
