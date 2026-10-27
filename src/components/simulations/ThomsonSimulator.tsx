import { useState } from 'react'
import { AlertTriangle, ChevronRight, ChevronLeft, Zap, FlaskConical, CheckCircle2, Info } from 'lucide-react'

// ─── Thomson's 4-step authentic experiment procedure (1897) ──────────────────
// Step 0: No field  → ray goes straight  → confirms ray exists
// Step 1: E field only → ray bends UPWARD to + plate → particle is NEGATIVE
// Step 2: B field only → ray bends DOWNWARD (Lorentz, F=evB, right-hand rule for -charge)
// Step 3: E + B balanced → ray straight again → v = E/B, then e/m = v/(r·B)
//         Historical result: e/m ≈ 1.76 × 10¹¹ C/kg
// ────────────────────────────────────────────────────────────────────────────

type Step = 0 | 1 | 2 | 3

interface StepInfo {
  id: Step
  label: string
  title: string
  eField: boolean
  bField: boolean
  description: string
  result: string
  badge: string
}

const STEPS: StepInfo[] = [
  {
    id: 0,
    label: 'Langkah 1',
    title: 'Tanpa Medan — Sinar Bergerak Lurus',
    eField: false,
    bField: false,
    description:
      'Tabung kaca hampa udara dialiri arus listrik besar. Dari katoda (−) muncul berkas tak kasat mata yang bergerak lurus menuju anoda (+) berslit, lalu terus ke layar fosfor dan meninggalkan titik cahaya hijau. Sinar ini tidak bermuatan listrik dari luar — namun keberadaannya nyata.',
    result: 'Fakta awal: Sinar katoda selalu bergerak lurus dari katoda ke anoda tanpa medan eksternal.',
    badge: 'bg-slate-100 text-slate-800 border-slate-300',
  },
  {
    id: 1,
    label: 'Langkah 2',
    title: 'Medan Listrik (E) Saja — Defleksi Elektrik',
    eField: true,
    bField: false,
    description:
      'Dua pelat logam dipasang di dalam tabung: pelat atas diberi muatan POSITIF (+), pelat bawah NEGATIF (−). Sinar katoda langsung membelok ke ATAS menuju pelat positif. Ini berlawanan dengan perilaku partikel bermuatan positif — membuktikan sinar terdiri dari partikel bermuatan NEGATIF.',
    result: 'Kesimpulan: F_E = eE ke atas → sinar belok ke + → partikel bermuatan NEGATIF (elektron).',
    badge: 'bg-amber-50 text-amber-900 border-amber-300',
  },
  {
    id: 2,
    label: 'Langkah 3',
    title: 'Medan Magnet (B) Saja — Defleksi Magnetik',
    eField: false,
    bField: true,
    description:
      'Medan listrik dimatikan. Dua kumparan elektromagnet menghasilkan medan magnet B tegak lurus masuk ke dalam layar (⊗). Gaya Lorentz F = q(v × B) pada muatan negatif yang bergerak ke kanan menghasilkan gaya ke BAWAH. Sinar membelok ke bawah — konsisten dengan muatan negatif.',
    result: 'Gaya Lorentz: F_B = evB ke bawah → sinar belok bawah → konfirmasi muatan negatif (q < 0).',
    badge: 'bg-violet-50 text-violet-900 border-violet-300',
  },
  {
    id: 3,
    label: 'Langkah 4',
    title: 'E + B Seimbang — Mengukur Rasio e/m',
    eField: true,
    bField: true,
    description:
      'Kedua medan dinyalakan bersamaan. Thomson menyetel kekuatan E dan B hingga sinar kembali lurus. Ini terjadi saat F_E = F_B, yaitu eE = evB, sehingga v = E/B. Kemudian E dimatikan, jari-jari lengkungan r akibat B diukur dari posisi titik di layar. Dari sana: e/m = v/(r·B).',
    result: 'Hasil historis Thomson: e/m ≈ 1.76 × 10¹¹ C/kg — sama untuk semua logam katoda dan semua jenis gas dalam tabung → elektron adalah partikel UNIVERSAL!',
    badge: 'bg-emerald-50 text-emerald-900 border-emerald-300',
  },
]

// ─── SVG CRT Diagram ─────────────────────────────────────────────────────────
function CRTDiagram({ step, eStrength, bStrength }: { step: Step; eStrength: number; bStrength: number }) {
  // SVG viewBox 520×180. Beam travels left→right. Center Y = 90.
  // E field: deflects beam UP in SVG (lower Y value) toward + plate
  // B field: deflects beam DOWN in SVG (higher Y) — Lorentz on negative charge
  const CY = 90
  const eDeflect = (step === 1 || step === 3) ? eStrength * 0.5 : 0  // upward (subtract from Y)
  const bDeflect = (step === 2 || step === 3) ? bStrength * 0.5 : 0  // downward (add to Y)
  const netDy = -eDeflect + bDeflect   // positive = down in SVG
  const endY = CY + netDy
  const ctrlY = CY + netDy * 0.55

  const beamColor = step === 0 ? '#22c55e' : step === 1 ? '#f59e0b' : step === 2 ? '#a855f7' : '#10b981'

  return (
    <svg viewBox="0 0 520 180" className="w-full h-full" style={{ overflow: 'visible' }}>

      {/* ── Labels ── */}
      <text x="42" y="13" fontSize="9" fill="#94a3b8" textAnchor="middle" fontWeight="bold">KATODA(−)</text>
      <text x="118" y="13" fontSize="9" fill="#94a3b8" textAnchor="middle" fontWeight="bold">ANODA(+)</text>
      <text x="250" y="13" fontSize="9" fill="#94a3b8" textAnchor="middle" fontWeight="bold">ZONA DEFLEKSI</text>
      <text x="485" y="13" fontSize="9" fill="#94a3b8" textAnchor="middle" fontWeight="bold">LAYAR FOSFOR</text>

      {/* ── Vacuum tube outline ── */}
      <rect x="20" y="30" width="460" height="120" rx="18"
        fill="#0f172a" stroke="#334155" strokeWidth="2" fillOpacity="0.4"/>

      {/* ── Cathode ── */}
      <rect x="28" y="60" width="12" height="60" rx="3" fill="#64748b" stroke="#94a3b8" strokeWidth="1.5"/>
      <text x="34" y="94" fontSize="14" fill="#f1f5f9" textAnchor="middle" fontWeight="black">−</text>

      {/* ── Anode with slit ── */}
      <rect x="100" y="55" width="10" height="27" rx="2" fill="#fbbf24" stroke="#d97706" strokeWidth="1"/>
      <rect x="100" y="98" width="10" height="27" rx="2" fill="#fbbf24" stroke="#d97706" strokeWidth="1"/>
      {/* slit center: y 82–98 */}
      <text x="105" y="125" fontSize="9" fill="#92400e" textAnchor="middle" fontWeight="bold">+</text>

      {/* ── Second collimating slit ── */}
      <rect x="148" y="55" width="7" height="27" rx="1" fill="#94a3b8" stroke="#64748b" strokeWidth="1"/>
      <rect x="148" y="98" width="7" height="27" rx="1" fill="#94a3b8" stroke="#64748b" strokeWidth="1"/>

      {/* ── Electric plates ── */}
      {(step === 1 || step === 3) && <>
        {/* Top plate = POSITIVE */}
        <rect x="170" y="38" width="185" height="11" rx="3"
          fill="#fef3c7" stroke="#f59e0b" strokeWidth="2"/>
        <text x="262" y="33" fontSize="8.5" fill="#b45309" textAnchor="middle" fontWeight="bold">PELAT (+) atas</text>
        {/* Bottom plate = NEGATIVE */}
        <rect x="170" y="131" width="185" height="11" rx="3"
          fill="#dbeafe" stroke="#3b82f6" strokeWidth="2"/>
        <text x="262" y="155" fontSize="8.5" fill="#1d4ed8" textAnchor="middle" fontWeight="bold">PELAT (−) bawah</text>
        {/* E field arrows (top plate + to bottom −) */}
        {[190, 220, 252, 285, 318, 345].map((x) => (
          <g key={x}>
            <line x1={x} y1="52" x2={x} y2="128" stroke="#f59e0b" strokeWidth="1"
              strokeDasharray="3,3" opacity="0.5"/>
            <polygon points={`${x},128 ${x-3},120 ${x+3},120`} fill="#f59e0b" opacity="0.6"/>
          </g>
        ))}
        <text x="370" y="88" fontSize="9" fill="#d97706" fontWeight="bold">E⬇</text>
      </>}

      {/* ── Magnetic field region ── */}
      {(step === 2 || step === 3) && <>
        <rect x="170" y="42" width="185" height="96" rx="6"
          fill="#f3e8ff" stroke="#a855f7" strokeWidth="2" strokeDasharray="6,4" fillOpacity="0.25"/>
        {[192, 222, 254, 286, 318, 344].map((x) =>
          [60, 80, 100, 118].map((y) => (
            <text key={`${x}-${y}`} x={x} y={y} fontSize="10" fill="#7c3aed"
              textAnchor="middle" opacity="0.6">×</text>
          ))
        )}
        <text x="370" y="98" fontSize="9" fill="#7c3aed" fontWeight="bold">B⊗</text>
        <text x="370" y="109" fontSize="7.5" fill="#7c3aed">(masuk layar)</text>
      </>}

      {/* ── Force arrows mid-beam ── */}
      {step === 1 && (
        <g>
          <line x1="250" y1="88" x2="250" y2="62" stroke="#ef4444" strokeWidth="2.5"/>
          <polygon points="250,58 246,68 254,68" fill="#ef4444"/>
          <text x="264" y="72" fontSize="9" fill="#ef4444" fontWeight="bold">F_E↑</text>
        </g>
      )}
      {step === 2 && (
        <g>
          <line x1="250" y1="90" x2="250" y2="116" stroke="#7c3aed" strokeWidth="2.5"/>
          <polygon points="250,120 246,110 254,110" fill="#7c3aed"/>
          <text x="264" y="114" fontSize="9" fill="#7c3aed" fontWeight="bold">F_B↓</text>
        </g>
      )}
      {step === 3 && (
        <g>
          <text x="250" y="79" fontSize="9" fill="#10b981" textAnchor="middle" fontWeight="bold">F_E = F_B</text>
          <text x="250" y="93" fontSize="9" fill="#10b981" textAnchor="middle" fontWeight="bold">v = E/B</text>
        </g>
      )}

      {/* ── Center reference line ── */}
      <line x1="28" y1="90" x2="478" y2="90"
        stroke="#475569" strokeWidth="1" strokeDasharray="4,4" opacity="0.4"/>

      {/* ── Electron beam path ── */}
      <path
        d={`M 40 90 Q 290 ${ctrlY} 470 ${endY}`}
        fill="none" stroke={beamColor} strokeWidth="3.5" strokeLinecap="round"
        opacity="0.9" style={{ filter: `drop-shadow(0 0 5px ${beamColor})` }}
      />

      {/* ── Animated electron ── */}
      <circle r="5.5" fill={beamColor} opacity="0.9"
        style={{ filter: `drop-shadow(0 0 6px ${beamColor})` }}>
        <animateMotion dur="1.5s" repeatCount="indefinite"
          path={`M 40 90 Q 290 ${ctrlY} 470 ${endY}`}/>
      </circle>

      {/* ── Phosphor screen ── */}
      <rect x="476" y="42" width="10" height="96" rx="3"
        fill="#bbf7d0" stroke="#16a34a" strokeWidth="2"/>
      {/* Impact spot */}
      <circle cx="479" cy={endY} r="6" fill={beamColor} opacity="0.95"
        style={{ filter: `drop-shadow(0 0 8px ${beamColor})` }}/>
      <circle cx="479" cy={endY} r="10" fill={beamColor} opacity="0.25"/>

      {/* Deflection measurement arrow */}
      {Math.abs(netDy) > 6 && (
        <g>
          <line x1="494" y1="90" x2="494" y2={endY} stroke="#94a3b8" strokeWidth="1.5"/>
          <polygon
            points={`494,${endY > 90 ? endY : endY} 491,${endY > 90 ? endY - 8 : endY + 8} 497,${endY > 90 ? endY - 8 : endY + 8}`}
            fill="#94a3b8"/>
          <text x="503" y={(90 + endY) / 2 + 4} fontSize="8.5" fill="#94a3b8" fontWeight="bold">Δy</text>
        </g>
      )}
    </svg>
  )
}

// ─── Plum Pudding Model ───────────────────────────────────────────────────────
function PlumPuddingView({ electronCount }: { electronCount: number }) {
  const positions = [
    { x: 0, y: -50 }, { x: 46, y: -18 }, { x: 30, y: 40 },
    { x: -30, y: 44 }, { x: -48, y: -10 }, { x: 15, y: 12 },
    { x: -15, y: -24 }, { x: 40, y: 22 },
  ]
  return (
    <div className="flex flex-col items-center gap-3 flex-1">
      <div className="relative w-52 h-52">
        {/* Positive diffuse sphere */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-300/60 via-red-200/65 to-orange-200/50 border-2 border-rose-300 shadow-2xl shadow-rose-200/30">
          {/* + symbols */}
          <div className="absolute inset-0 rounded-full grid grid-cols-3 gap-3 p-8 pointer-events-none select-none opacity-20">
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={i} className="text-rose-600 font-black text-lg text-center">+</span>
            ))}
          </div>
        </div>
        {/* Electrons */}
        {positions.slice(0, electronCount).map((pos, idx) => (
          <div
            key={idx}
            className="absolute w-8 h-8 rounded-full bg-gradient-to-tr from-sky-400 to-blue-600 border-2 border-white shadow-lg shadow-blue-400/50 flex items-center justify-center text-white font-black text-[10px] cursor-pointer hover:scale-125 transition-transform z-10"
            style={{
              left: `calc(50% + ${pos.x}px - 16px)`,
              top: `calc(50% + ${pos.y}px - 16px)`,
            }}
            title={`Elektron #${idx + 1}`}
          >
            e⁻
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 bg-white border border-rose-200 px-4 py-1.5 rounded-full text-xs font-mono shadow-xs">
        <span className="text-rose-600 font-bold">Bola: +{electronCount}</span>
        <span className="text-slate-300">|</span>
        <span className="text-blue-600 font-bold">e⁻: −{electronCount}</span>
        <span className="text-slate-300">|</span>
        <span className="text-emerald-700 font-bold">ΣQ = 0 ✓</span>
      </div>
      <p className="text-[11px] text-slate-500 font-medium text-center max-w-xs leading-relaxed">
        Tidak ada <strong>inti atom</strong> maupun <strong>orbit</strong>. Muatan positif menyebar merata mengisi seluruh bola — elektron tertanam seperti kismis dalam roti.
      </p>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────
export function ThomsonSimulator() {
  const [tab, setTab] = useState<'crt' | 'pudding'>('crt')
  const [step, setStep] = useState<Step>(0)
  const [eStrength, setEStrength] = useState(40)
  const [bStrength, setBStrength] = useState(40)
  const [electronCount, setElectronCount] = useState(6)

  const info = STEPS[step]

  return (
    <div className="flex flex-col gap-4 w-full">

      {/* ── Tab Bar ── */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start shadow-xs">
        <button
          onClick={() => setTab('crt')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            tab === 'crt' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5" />
          Eksperimen CRT Asli (1897)
        </button>
        <button
          onClick={() => setTab('pudding')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            tab === 'pudding' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Model Roti Kismis
        </button>
      </div>

      {/* ══════════════════════════ CRT EXPERIMENT TAB ═══════════════════════ */}
      {tab === 'crt' && (
        <div className="flex flex-col gap-4">

          {/* Step Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {STEPS.map((s) => (
              <button
                key={s.id}
                onClick={() => setStep(s.id)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold border transition cursor-pointer ${
                  step === s.id
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
                }`}
              >
                {s.label}
              </button>
            ))}
            {/* Active indicator */}
            <div className="flex items-center gap-1 ml-1">
              {(info.eField || info.bField) && (
                <>
                  {info.eField && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 border border-amber-500 flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5" />E ON
                    </span>
                  )}
                  {info.bField && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-400 text-violet-950 border border-violet-500">
                      B ON
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          {/* CRT Canvas */}
          <div className="w-full rounded-3xl bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-2 border-slate-700 shadow-2xl overflow-hidden p-4">
            <div className="w-full rounded-2xl border border-slate-600/40 bg-slate-950/30 px-3 py-5">
              <CRTDiagram step={step} eStrength={eStrength} bStrength={bStrength} />
            </div>
          </div>

          {/* Step Info */}
          <div className={`p-4 rounded-2xl border-2 ${info.badge} flex flex-col gap-2.5 shadow-xs`}>
            <h3 className="text-sm font-black flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0" />
              {info.title}
            </h3>
            <p className="text-[11.5px] leading-relaxed font-medium">{info.description}</p>
            <div className="flex items-start gap-2 bg-white/60 rounded-xl px-3 py-2 border border-black/10">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-600" />
              <p className="text-[11px] font-bold">{info.result}</p>
            </div>
          </div>

          {/* Physics formula row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            {[
              { label: 'Gaya Listrik', formula: 'F_E = eE ↑', active: info.eField, cls: 'bg-amber-50 border-amber-300 text-amber-800' },
              { label: 'Gaya Lorentz', formula: 'F_B = evB ↓', active: info.bField, cls: 'bg-violet-50 border-violet-300 text-violet-800' },
              { label: 'Kecepatan', formula: 'v = E / B', active: step === 3, cls: 'bg-sky-50 border-sky-300 text-sky-800' },
              { label: 'Rasio e/m', formula: 'e/m = v/(rB)', active: step === 3, cls: 'bg-emerald-50 border-emerald-300 text-emerald-800' },
            ].map((item) => (
              <div
                key={item.label}
                className={`p-2.5 rounded-xl border text-[10px] font-bold transition ${
                  item.active ? item.cls : 'bg-slate-50 border-slate-200 text-slate-300'
                }`}
              >
                <p className="font-mono text-xs mb-0.5">{item.formula}</p>
                <p className="font-medium">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className={`flex flex-col gap-1.5 p-3.5 rounded-2xl bg-white border shadow-xs ${
              info.eField ? 'border-amber-300' : 'border-slate-200 opacity-40 pointer-events-none'
            }`}>
              <div className="flex items-center justify-between text-xs font-bold text-amber-800">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> Kuat Medan Listrik (E)
                </span>
                <span className="font-mono">{eStrength} kV/m</span>
              </div>
              <input type="range" min="10" max="80" value={eStrength}
                onChange={(e) => setEStrength(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"/>
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>Lemah (10)</span><span>Kuat (80)</span>
              </div>
            </div>

            <div className={`flex flex-col gap-1.5 p-3.5 rounded-2xl bg-white border shadow-xs ${
              info.bField ? 'border-violet-300' : 'border-slate-200 opacity-40 pointer-events-none'
            }`}>
              <div className="flex items-center justify-between text-xs font-bold text-violet-800">
                <span>⊗ Kuat Medan Magnet (B)</span>
                <span className="font-mono">{bStrength} mT</span>
              </div>
              <input type="range" min="10" max="80" value={bStrength}
                onChange={(e) => setBStrength(Number(e.target.value))}
                className="w-full accent-violet-500 cursor-pointer"/>
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>Lemah (10)</span><span>Kuat (80)</span>
              </div>
            </div>
          </div>

          {/* Step 3: e/m result box */}
          {step === 3 && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-center shadow-xs">
              <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-widest mb-1">Hasil Pengukuran Thomson (1897)</p>
              <p className="text-xl font-black text-emerald-900 font-mono mb-0.5">
                e/m ≈ <span className="text-emerald-600">1.76 × 10¹¹</span> C/kg
              </p>
              <p className="text-[11px] text-emerald-700 font-medium">
                v = E/B = {eStrength}k/{bStrength}m ≈ {(eStrength / bStrength * 1e6).toExponential(2)} m/s
                &nbsp;|&nbsp; Berlaku untuk semua logam &amp; gas → elektron bersifat UNIVERSAL
              </p>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1) as Step)}
              disabled={step === 0}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition ${
                step === 0
                  ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 cursor-pointer shadow-xs'
              }`}
            >
              <ChevronLeft className="w-4 h-4" /> Langkah Sebelumnya
            </button>

            <button
              onClick={() => setStep((s) => Math.min(3, s + 1) as Step)}
              disabled={step === 3}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition ${
                step === 3
                  ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                  : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 cursor-pointer shadow-xs'
              }`}
            >
              Langkah Berikutnya <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════ PUDDING TAB ════════════════════════════════ */}
      {tab === 'pudding' && (
        <div className="flex flex-col gap-4">
          <div className="relative w-full rounded-3xl bg-gradient-to-b from-rose-50/80 via-white to-orange-50/80 border-2 border-rose-200/80 flex flex-col items-center p-6 shadow-inner min-h-72">
            <PlumPuddingView electronCount={electronCount} />
          </div>
          <div className="flex flex-col gap-1.5 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700">Jumlah Elektron dalam Bola Positif</span>
              <span className="font-mono text-emerald-600">{electronCount} e⁻</span>
            </div>
            <input type="range" min="1" max="8" value={electronCount}
              onChange={(e) => setElectronCount(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"/>
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>1 e⁻ (misal: H)</span><span>8 e⁻ (misal: O)</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Pedagogical Note ── */}
      <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 shadow-xs">
        <AlertTriangle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1.5 text-xs">
          <p className="font-black text-emerald-900">Keunikan Metodologi Eksperimen Thomson:</p>
          <p className="text-[11px] leading-relaxed text-emerald-800">
            Thomson tidak hanya membuktikan elektron bermuatan negatif — ia juga berhasil <strong>mengukur e/m secara kuantitatif</strong> dengan memadukan tiga kondisi: (1) sinar lurus tanpa medan, (2) defleksi E saja, (3) defleksi B saja, (4) keduanya seimbang. Nilai <strong>e/m ≈ 1.76 × 10¹¹ C/kg</strong> identik untuk semua bahan katoda dan gas → membuktikan elektron bukan partikel spesifik satu unsur, melainkan <strong>komponen dasar seluruh materi di alam semesta</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}
