import { useState } from 'react'
import {
  Atom,
  Clock,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  User,
  Globe,
  Calendar,
  Award,
  Lightbulb,
  Eye,
  CheckCircle2,
  BookMarked,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  FileText,
  FlaskConical,
  HelpCircle,
  RotateCcw,
  Compass,
  Layers,
  LayoutList,
  Check
} from 'lucide-react'
import type { AtomModel, ReferenceItem } from '../../types/atom'
import { ATOM_MODELS } from '../../data/atomModels'
import { LEARNING_FLOW_DATA, type ModelLearningGuide } from '../../data/learningFlowData'
import { AtomSimulatorWrapper } from '../simulations/AtomSimulatorWrapper'

interface TimelineWorkspaceProps {
  initialModelId?: string
  onBackToHome: () => void
  onNavigateToQuiz: () => void
}

export type LearningStep = 'context' | 'lab' | 'concept' | 'evaluation'

export function TimelineWorkspace({
  initialModelId,
  onBackToHome,
  onNavigateToQuiz
}: TimelineWorkspaceProps) {
  // Active model state
  const [selectedModel, setSelectedModel] = useState<AtomModel>(() => {
    if (initialModelId) {
      const found = ATOM_MODELS.find((m) => m.id === initialModelId)
      if (found) return found
    }
    return ATOM_MODELS[0] // Start from Democritus / beginning for structured sequence
  })

  // Mode: Guided sequential flow (default & best for students) vs Split view
  const [viewMode, setViewMode] = useState<'guided' | 'split'>('guided')

  // In guided mode: active step (1 to 4)
  const [currentStep, setCurrentStep] = useState<LearningStep>('context')

  // In split mode: active tab on theory side
  const [splitTab, setSplitTab] = useState<'scientist' | 'overview' | 'rules' | 'representations' | 'references'>('scientist')

  // Mini checkpoint state for current model
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false)
  const [showHint, setShowHint] = useState<boolean>(false)

  // Reference modal for current model
  const [showReferenceModal, setShowReferenceModal] = useState<boolean>(false)

  const handleSelectModel = (model: AtomModel) => {
    setSelectedModel(model)
    setSelectedOption(null)
    setIsAnswerSubmitted(false)
    setShowHint(false)
    setCurrentStep('context')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Get pedagogical guide data for active model
  const guideData: ModelLearningGuide =
    LEARNING_FLOW_DATA[selectedModel.id] || LEARNING_FLOW_DATA.dalton

  const currentModelIndex = ATOM_MODELS.findIndex((m) => m.id === selectedModel.id)
  const isFirstModel = currentModelIndex === 0
  const isLastModel = currentModelIndex === ATOM_MODELS.length - 1
  const prevModel = !isFirstModel ? ATOM_MODELS[currentModelIndex - 1] : null
  const nextModel = !isLastModel ? ATOM_MODELS[currentModelIndex + 1] : null

  const handleStepChange = (step: LearningStep) => {
    setCurrentStep(step)
    const element = document.getElementById('step-content-anchor')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleNextStep = () => {
    if (currentStep === 'context') handleStepChange('lab')
    else if (currentStep === 'lab') handleStepChange('concept')
    else if (currentStep === 'concept') handleStepChange('evaluation')
  }

  const handlePrevStep = () => {
    if (currentStep === 'evaluation') handleStepChange('concept')
    else if (currentStep === 'concept') handleStepChange('lab')
    else if (currentStep === 'lab') handleStepChange('context')
  }

  const handleGoToNextModel = () => {
    if (nextModel) {
      handleSelectModel(nextModel)
    }
  }

  const handleGoToPrevModel = () => {
    if (prevModel) {
      handleSelectModel(prevModel)
    }
  }

  const stepsList = [
    {
      id: 'context' as LearningStep,
      number: 1,
      title: 'Latar Belakang & Tokoh',
      subtitle: 'Siapa & Masalah Sejarah',
      icon: User
    },
    {
      id: 'lab' as LearningStep,
      number: 2,
      title: 'Laboratorium Interaktif',
      subtitle: 'Eksperimen Pembuktian',
      icon: FlaskConical
    },
    {
      id: 'concept' as LearningStep,
      number: 3,
      title: 'Konsep & 3 Representasi',
      subtitle: 'Makro, Submikro & Simbolik',
      icon: Atom
    },
    {
      id: 'evaluation' as LearningStep,
      number: 4,
      title: 'Keterbatasan & Refleksi',
      subtitle: 'Evaluasi & Jembatan Lanjut',
      icon: HelpCircle
    }
  ]

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in pb-12">
      
      {/* ── Top Bar: Back to Home + Breadcrumb & Reference button ──────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <button
          onClick={onBackToHome}
          className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs transition border border-slate-200 flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-600" />
          <span>Kembali ke Beranda</span>
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowReferenceModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition border border-slate-200 flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="Lihat Rujukan & Daftar Pustaka Model Ini"
          >
            <BookMarked className="w-3.5 h-3.5 text-indigo-600" />
            <span>Rujukan Akademik ({selectedModel.references.length})</span>
          </button>

          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setViewMode('guided')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'guided'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Alur Pembahasan Runtut Bertahap (Direkomendasikan)"
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>Alur Runtut (Terbimbing)</span>
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'split'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Tampilkan Materi dan Lab Berdampingan"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Berdampingan</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Garis Waktu Perkembangan Model Atom (Urutan Kronologis) ────────────── */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" /> Garis Waktu Perkembangan Model Atom
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Urutan perkembangan teori sains dari masa ke masa • Model ke-{currentModelIndex + 1} dari {ATOM_MODELS.length}
            </p>
          </div>
          <span className="hidden sm:inline-block text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
            Fase E • Kimia SMA
          </span>
        </div>

        {/* 6 Models Horizontal Sequence Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {ATOM_MODELS.map((model, idx) => {
            const isSelected = selectedModel.id === model.id
            const isPassed = idx < currentModelIndex

            return (
              <button
                key={model.id}
                onClick={() => handleSelectModel(model)}
                className={`relative p-3 rounded-2xl text-left transition-all duration-200 border flex flex-col justify-between h-28 shadow-xs cursor-pointer ${
                  isSelected
                    ? `${model.theme.bgLight} ${model.theme.activeRing} shadow-md scale-102`
                    : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold flex items-center gap-1 ${
                      isSelected
                        ? model.theme.badgeBg
                        : isPassed
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {isPassed && <Check className="w-2.5 h-2.5" />}
                    {idx + 1}. {model.period}
                  </span>
                  {isSelected && (
                    <span
                      className={`w-2.5 h-2.5 rounded-full bg-gradient-to-tr ${model.theme.gradient} animate-pulse`}
                    />
                  )}
                </div>

                <div className="flex items-center gap-2 my-1">
                  <img
                    src={model.scientistProfile.avatarUrl}
                    alt={model.scientist}
                    className="w-7 h-7 rounded-full object-cover border border-white shadow-xs shrink-0"
                  />
                  <div className="min-w-0">
                    <h3
                      className={`font-black text-xs truncate ${
                        isSelected ? model.theme.textColor : 'text-slate-800'
                      }`}
                    >
                      {model.scientist}
                    </h3>
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 truncate font-medium">{model.name}</p>
              </button>
            )
          })}
        </div>

        {/* Benang Merah Evolusi (Connecting Thread) */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-indigo-50/80 via-white to-sky-50/80 border border-indigo-100 flex items-center gap-3 text-xs shadow-2xs">
          <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black shrink-0 text-xs">
            {currentModelIndex + 1}
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-bold text-indigo-950">
              {selectedModel.name} ({selectedModel.period})
            </span>
            <span className="text-slate-600 ml-1.5 hidden md:inline">
              — {selectedModel.summary}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleGoToPrevModel}
              disabled={isFirstModel}
              className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer"
              title="Model Sebelumnya"
            >
              ← Prev
            </button>
            <button
              onClick={handleGoToNextModel}
              disabled={isLastModel}
              className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-700 cursor-pointer shadow-xs"
              title="Model Berikutnya"
            >
              Next →
            </button>
          </div>
        </div>
      </section>

      <div id="step-content-anchor" />

      {/* ═════════════════════════════════════════════════════════════════════════ */}
      {/* MODE 1: ALUR TERBIMBING RUNTUT (TIDAK BERTUMPUK 1 LAYAR)                  */}
      {/* ═════════════════════════════════════════════════════════════════════════ */}
      {viewMode === 'guided' && (
        <div className="flex flex-col gap-6 w-full animate-fade-in">
          
          {/* 4-Step Stepper Header */}
          <div className="bg-white border border-slate-200 rounded-3xl p-3 md:p-4 shadow-xs">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {stepsList.map((step) => {
                const isActive = currentStep === step.id
                const StepIcon = step.icon

                return (
                  <button
                    key={step.id}
                    onClick={() => handleStepChange(step.id)}
                    className={`p-3 rounded-2xl text-left transition-all cursor-pointer border flex items-center gap-3 ${
                      isActive
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                        isActive
                          ? 'bg-white text-indigo-700 shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700'
                      }`}
                    >
                      <StepIcon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md ${
                            isActive
                              ? 'bg-indigo-500 text-white'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          Tahap {step.number}
                        </span>
                      </div>
                      <h4 className="font-black text-xs md:text-sm truncate mt-0.5">
                        {step.title}
                      </h4>
                      <p
                        className={`text-[11px] truncate font-medium ${
                          isActive ? 'text-indigo-100' : 'text-slate-500'
                        }`}
                      >
                        {step.subtitle}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── STEP 1: LATAR BELAKANG & TOKOH PENEMU ─────────────────────────── */}
          {currentStep === 'context' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              {/* Context / Problem Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50/90 via-white to-orange-50/70 border-2 border-amber-200 shadow-sm flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    ?
                  </span>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                      Teka-teki Ilmiah &amp; Masalah Sejarah
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      {guideData.investigationQuestion}
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium pl-10">
                  {guideData.historicalProblem}
                </p>
              </div>

              {/* Scientist Profile Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-5">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-5 border-b border-slate-100">
                  <div className="relative shrink-0">
                    <img
                      src={selectedModel.scientistProfile.avatarUrl}
                      alt={selectedModel.scientistProfile.fullName}
                      className="w-28 h-36 object-cover rounded-2xl border-2 border-white shadow-md ring-2 ring-indigo-200"
                    />
                    <span className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm shadow-xs">
                      🔬
                    </span>
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-indigo-600" />
                        {selectedModel.scientistProfile.nationality}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {selectedModel.scientistProfile.lifespan}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${selectedModel.theme.badgeBg}`}>
                        Periode: {selectedModel.period}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {selectedModel.scientistProfile.fullName}
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-indigo-600 mt-1 mb-3">
                      {selectedModel.scientistProfile.title}
                    </p>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                      {selectedModel.scientistProfile.bio}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex flex-col gap-1.5 shadow-2xs">
                    <h4 className="text-xs font-bold uppercase text-emerald-800 tracking-wider flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-600" /> Kontribusi Utama Terhadap Sains
                    </h4>
                    <p className="text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
                      {selectedModel.scientistProfile.keyContribution}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col gap-1.5 shadow-2xs">
                    <h4 className="text-xs font-bold uppercase text-amber-800 tracking-wider flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-600" /> Fakta Unik Tokoh
                    </h4>
                    <p className="text-xs sm:text-sm text-amber-950 font-medium leading-relaxed">
                      {selectedModel.scientistProfile.funFact}
                    </p>
                  </div>
                </div>
              </div>

              {/* Step Navigation Bottom Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
                <span className="text-xs text-slate-500 font-medium">
                  Langkah 1 Selesai • Lanjutkan ke laboratorium untuk membuktikan eksperimennya
                </span>

                <button
                  onClick={handleNextStep}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md shadow-indigo-600/25 cursor-pointer"
                >
                  <span>Lanjut ke Tahap 2: Laboratorium Interaktif</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: LABORATORIUM INTERAKTIF (LAYAR PENUH & TERARAH) ───────── */}
          {currentStep === 'lab' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              {/* Lab Mission & Inquiry Guide */}
              <div className="p-5 rounded-3xl bg-indigo-50/80 border border-indigo-200 shadow-xs flex flex-col gap-4">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-indigo-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                      <FlaskConical className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                        Panduan Misi Praktikum Virtual
                      </span>
                      <h3 className="text-sm sm:text-base font-black text-slate-900">
                        {guideData.labGuide.objective}
                      </h3>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-indigo-700 bg-white px-3 py-1 rounded-full border border-indigo-200">
                    Eksperimen Mandiri Siswa
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Instructions for student */}
                  <div className="p-3.5 rounded-2xl bg-white border border-indigo-100 flex flex-col gap-2">
                    <h4 className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                      🧪 <span>Langkah yang Harus Kamu Coba:</span>
                    </h4>
                    <ol className="space-y-1.5 text-xs text-slate-700 font-medium list-decimal list-inside pl-1">
                      {guideData.labGuide.steps.map((step, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Observations to look for */}
                  <div className="p-3.5 rounded-2xl bg-white border border-indigo-100 flex flex-col gap-2">
                    <h4 className="text-xs font-bold text-emerald-800 uppercase flex items-center gap-1.5">
                      🔍 <span>Fenomena Kunci yang Harus Diamati:</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-700 font-medium list-disc list-inside pl-1">
                      {guideData.labGuide.keyObservations.map((obs, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {obs}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Spacious Interactive Laboratory Container (Full Width, No Cramming!) */}
              <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 md:p-8 shadow-sm">
                <AtomSimulatorWrapper model={selectedModel} />
              </div>

              {/* Lab Conclusion Card */}
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3.5 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900">
                    Temuan Kunci dari Laboratorium:
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-950 font-medium mt-1 leading-relaxed">
                    {guideData.labGuide.coreDiscovery}
                  </p>
                </div>
              </div>

              {/* Step Navigation Bottom Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
                <button
                  onClick={handlePrevStep}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali ke Tahap 1 (Tokoh)</span>
                </button>

                <button
                  onClick={handleNextStep}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md shadow-indigo-600/25 cursor-pointer"
                >
                  <span>Lanjut ke Tahap 3: Konsep Model &amp; 3 Representasi</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: KONSEP MODEL ATOM & 3 REPRESENTASI KIMIA ──────────────── */}
          {currentStep === 'concept' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              {/* Core Concept & Analogy */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                <div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${selectedModel.theme.badgeBg}`}>
                    {selectedModel.period} • {selectedModel.scientist}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                    {selectedModel.name}
                  </h3>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 shadow-2xs">
                  <h4 className="text-xs font-bold uppercase text-indigo-700 tracking-wider mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Konsep Inti Model Atom
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                    {selectedModel.summary}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 shadow-2xs">
                  <h4 className="text-xs font-bold uppercase text-sky-800 tracking-wider mb-1 flex items-center gap-1.5">
                    💡 Analogi Konseptual Sederhana
                  </h4>
                  <p className="text-xs sm:text-sm text-sky-950 leading-relaxed font-medium">
                    {selectedModel.analogy}
                  </p>
                </div>
              </div>

              {/* Kerangka Tiga Tingkat Representasi Kimia Johnstone */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-black text-slate-900">
                        Tiga Tingkat Representasi Kimia (Segitiga Johnstone)
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Pendekatan pedagogis untuk mencegah miskonsepsi kimia siswa
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                    Pedagogi Kimia
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Makroskopik */}
                  <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200 flex flex-col gap-2 shadow-2xs">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center border border-sky-300">
                        <Eye className="w-4 h-4" />
                      </div>
                      <h5 className="text-xs font-black text-sky-900 uppercase">1. Makroskopik</h5>
                    </div>
                    <p className="text-[11px] text-slate-500 font-bold">Gejala Nyata Teramati di Lab</p>
                    <p className="text-xs text-sky-950 font-medium leading-relaxed">
                      {selectedModel.representations.macroscopic}
                    </p>
                  </div>

                  {/* Submikroskopik */}
                  <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex flex-col gap-2 shadow-2xs">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-300">
                        <Atom className="w-4 h-4" />
                      </div>
                      <h5 className="text-xs font-black text-emerald-900 uppercase">2. Submikroskopik</h5>
                    </div>
                    <p className="text-[11px] text-slate-500 font-bold">Struktur Partikel Subatomik</p>
                    <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                      {selectedModel.representations.submicroscopic}
                    </p>
                  </div>

                  {/* Simbolik */}
                  <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 flex flex-col gap-2 shadow-2xs">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center border border-purple-300">
                        <FileText className="w-4 h-4" />
                      </div>
                      <h5 className="text-xs font-black text-purple-900 uppercase">3. Simbolik</h5>
                    </div>
                    <p className="text-[11px] text-slate-500 font-bold">Notasi, Rumus &amp; Formula</p>
                    <p className="text-xs text-purple-950 font-medium leading-relaxed">
                      {selectedModel.representations.symbolic}
                    </p>
                  </div>
                </div>
              </div>

              {/* Chemical Rules / Postulates */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-sm font-black text-slate-900">
                    Postulat &amp; Aturan Kimia Otentik ({selectedModel.chemicalRules.length} Poin)
                  </h4>
                </div>

                <div className="space-y-2.5">
                  {selectedModel.chemicalRules.map((rule, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3 shadow-2xs"
                    >
                      <span className="w-6 h-6 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                        {rule}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step Navigation Bottom Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
                <button
                  onClick={handlePrevStep}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali ke Laboratorium</span>
                </button>

                <button
                  onClick={handleNextStep}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md shadow-indigo-600/25 cursor-pointer"
                >
                  <span>Lanjut ke Tahap 4: Keterbatasan &amp; Cek Pemahaman</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 4: KETERBATASAN, REFLEKSI & JEMBATAN MODEL BERIKUTNYA ─────── */}
          {currentStep === 'evaluation' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              {/* Limitations & Evolution Bridge */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Limitations Card */}
                <div className="p-5 rounded-3xl bg-rose-50/90 border-2 border-rose-200 shadow-xs flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold text-xs">
                      <AlertTriangle className="w-4 h-4" />
                    </span>
                    <h4 className="text-xs font-black uppercase text-rose-800 tracking-wider">
                      Keterbatasan / Anomali Fisik Model
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-rose-950 font-medium leading-relaxed mt-1">
                    {selectedModel.limitations}
                  </p>
                </div>

                {/* Evolution Trigger to Next Model */}
                <div className="p-5 rounded-3xl bg-indigo-50/90 border-2 border-indigo-200 shadow-xs flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                      <Compass className="w-4 h-4" />
                    </span>
                    <h4 className="text-xs font-black uppercase text-indigo-900 tracking-wider">
                      Jembatan Menuju Model Berikutnya
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-indigo-950 font-medium leading-relaxed mt-1">
                    {guideData.evolutionBridge.nextTrigger}
                  </p>
                </div>
              </div>

              {/* Interactive Mini-Checkpoint Question (Instant Feedback) */}
              <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                        Cek Pemahaman Konsep Cepat
                      </span>
                      <h4 className="text-sm sm:text-base font-black text-slate-900">
                        Refleksi Model Atom {selectedModel.scientist}
                      </h4>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                    1 Soal Interaktif
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">
                    {guideData.miniCheckpoint.question}
                  </p>

                  <div className="space-y-2 mt-1">
                    {guideData.miniCheckpoint.options.map((opt, idx) => {
                      const isChosen = selectedOption === idx
                      const isCorrect = idx === guideData.miniCheckpoint.correctAnswer

                      let btnStyle =
                        'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                      if (isAnswerSubmitted) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold ring-2 ring-emerald-400'
                        } else if (isChosen) {
                          btnStyle = 'bg-rose-50 border-rose-400 text-rose-950 font-bold ring-2 ring-rose-400'
                        } else {
                          btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                        }
                      } else if (isChosen) {
                        btnStyle = 'bg-indigo-50 border-indigo-500 text-indigo-950 font-bold ring-2 ring-indigo-400'
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            if (!isAnswerSubmitted) setSelectedOption(idx)
                          }}
                          disabled={isAnswerSubmitted}
                          className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm transition flex items-start gap-3 cursor-pointer ${btnStyle}`}
                        >
                          <span className="w-6 h-6 rounded-full bg-white border border-slate-300 text-slate-700 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="flex-1 leading-relaxed">{opt}</span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Actions for mini-checkpoint */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    {!isAnswerSubmitted ? (
                      <>
                        <button
                          onClick={() => setShowHint(!showHint)}
                          className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
                        >
                          <Lightbulb className="w-3.5 h-3.5" />
                          <span>{showHint ? 'Sembunyikan Petunjuk' : 'Butuh Petunjuk?'}</span>
                        </button>

                        <button
                          onClick={() => {
                            if (selectedOption !== null) setIsAnswerSubmitted(true)
                          }}
                          disabled={selectedOption === null}
                          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition cursor-pointer"
                        >
                          Kirim Jawaban
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedOption(null)
                          setIsAnswerSubmitted(false)
                          setShowHint(false)
                        }}
                        className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Coba Jawab Lagi</span>
                      </button>
                    )}
                  </div>

                  {/* Hint box */}
                  {showHint && !isAnswerSubmitted && (
                    <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 leading-relaxed font-medium">
                      💡 <strong>Petunjuk:</strong> {guideData.miniCheckpoint.hint}
                    </div>
                  )}

                  {/* Instant Feedback Explanation */}
                  {isAnswerSubmitted && (
                    <div
                      className={`p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed ${
                        selectedOption === guideData.miniCheckpoint.correctAnswer
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-950 font-medium'
                          : 'bg-rose-50 border-rose-200 text-rose-950 font-medium'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1.5 mb-1">
                        {selectedOption === guideData.miniCheckpoint.correctAnswer ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Luar Biasa, Jawabanmu Benar!</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-4 h-4 text-rose-600" />
                            <span>Jawaban Kurang Tepat, Mari Pahami Konsepnya:</span>
                          </>
                        )}
                      </div>
                      <p>{guideData.miniCheckpoint.explanation}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Transition: Next Model or Quiz */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 text-white shadow-xl shadow-indigo-600/20 flex flex-col md:flex-row items-center justify-between gap-5">
                <div className="text-center md:text-left">
                  <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 inline-block mb-2">
                    Tahapan Model {currentModelIndex + 1} dari {ATOM_MODELS.length} Tuntas!
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    {nextModel
                      ? `Siap Mempelajari Model Selanjutnya: ${nextModel.name}?`
                      : 'Selamat! Kamu Telah Menuntaskan Seluruh 6 Model Atom!'}
                  </h3>
                  <p className="text-xs sm:text-sm text-indigo-100 font-medium mt-1 max-w-xl">
                    {nextModel
                      ? `Lihat bagaimana ${nextModel.scientist} memecahkan kelemahan model ${selectedModel.scientist} pada tahun ${nextModel.period}.`
                      : 'Sekarang saatnya menguji seluruh pemahamanmu dalam Uji Pemahaman Konsep Komprehensif (10 Soal Variatif).'}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={handlePrevStep}
                    className="px-4 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm backdrop-blur-xs transition border border-white/30 cursor-pointer"
                  >
                    ← Review Konsep
                  </button>

                  {nextModel ? (
                    <button
                      onClick={handleGoToNextModel}
                      className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm transition flex items-center gap-2 shadow-lg shadow-amber-400/30 cursor-pointer"
                    >
                      <span>Lanjut ke Model {nextModel.scientist}</span>
                      <ArrowRight className="w-4 h-4 text-slate-950" />
                    </button>
                  ) : (
                    <button
                      onClick={onNavigateToQuiz}
                      className="px-6 py-3.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs sm:text-sm transition flex items-center gap-2 shadow-lg shadow-emerald-400/30 cursor-pointer"
                    >
                      <span>Uji Pemahaman (10 Soal)</span>
                      <ArrowRight className="w-4 h-4 text-slate-950" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════════ */}
      {/* MODE 2: SPLIT VIEW (BERDAMPINGAN UNTUK EKSPLORASI CEPAT / KOMPARASI)     */}
      {/* ═════════════════════════════════════════════════════════════════════════ */}
      {viewMode === 'split' && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in">
          {/* Left Column: Theory & Tabs */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedModel.scientistProfile.avatarUrl}
                    alt={selectedModel.scientist}
                    className="w-11 h-11 rounded-2xl object-cover border-2 border-white shadow-md ring-2 ring-indigo-200"
                  />
                  <div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${selectedModel.theme.badgeBg}`}>
                      {selectedModel.period}
                    </span>
                    <h3 className="font-black text-base text-slate-900 mt-0.5">{selectedModel.name}</h3>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
                  <button
                    onClick={() => setSplitTab('scientist')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                      splitTab === 'scientist' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Tokoh
                  </button>
                  <button
                    onClick={() => setSplitTab('overview')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                      splitTab === 'overview' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Ringkasan
                  </button>
                  <button
                    onClick={() => setSplitTab('rules')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                      splitTab === 'rules' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Aturan
                  </button>
                  <button
                    onClick={() => setSplitTab('representations')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                      splitTab === 'representations' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    3 Representasi
                  </button>
                </div>
              </div>

              {/* Tab Details */}
              <div className="pt-4">
                {splitTab === 'scientist' && (
                  <div className="flex flex-col gap-3 text-xs leading-relaxed">
                    <p className="font-bold text-indigo-700">{selectedModel.scientistProfile.fullName} ({selectedModel.scientistProfile.lifespan})</p>
                    <p className="text-slate-700">{selectedModel.scientistProfile.bio}</p>
                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-medium">
                      <strong>Kontribusi:</strong> {selectedModel.scientistProfile.keyContribution}
                    </div>
                  </div>
                )}

                {splitTab === 'overview' && (
                  <div className="flex flex-col gap-3 text-xs leading-relaxed">
                    <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-slate-800 font-medium">
                      {selectedModel.summary}
                    </div>
                    <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 font-medium">
                      <strong>Eksperimen Sejarah:</strong> {selectedModel.historicalExperiment}
                    </div>
                    <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 font-medium">
                      <strong>Keterbatasan:</strong> {selectedModel.limitations}
                    </div>
                  </div>
                )}

                {splitTab === 'rules' && (
                  <div className="space-y-2">
                    {selectedModel.chemicalRules.map((rule, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium flex gap-2">
                        <span className="font-bold text-indigo-700">{idx + 1}.</span>
                        <span>{rule}</span>
                      </div>
                    ))}
                  </div>
                )}

                {splitTab === 'representations' && (
                  <div className="space-y-2.5 text-xs">
                    <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-950">
                      <strong>1. Makroskopik:</strong> {selectedModel.representations.macroscopic}
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                      <strong>2. Submikroskopik:</strong> {selectedModel.representations.submicroscopic}
                    </div>
                    <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-950">
                      <strong>3. Simbolik:</strong> {selectedModel.representations.symbolic}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Simulator */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-sm">
              <AtomSimulatorWrapper model={selectedModel} />
            </div>
          </div>
        </section>
      )}

      {/* ── Modal Referensi & Daftar Pustaka Model Ini ──────────────────────── */}
      {showReferenceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 flex flex-col gap-4 max-h-[85vh] overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <BookMarked className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    Daftar Pustaka: {selectedModel.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {selectedModel.references.length} Sumber Ilmiah Terverifikasi (Kurikulum Merdeka &amp; Teks Universitas)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowReferenceModal(false)}
                className="w-8 h-8 rounded-xl hover:bg-slate-100 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {selectedModel.references.map((ref: ReferenceItem, idx: number) => (
                <div
                  key={ref.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-1.5 text-xs shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-[10px] text-slate-500">[{idx + 1}] {ref.type.toUpperCase()}</span>
                    <span className="text-[10px] font-mono text-slate-400">{ref.year}</span>
                  </div>
                  <p className="font-serif text-slate-800 font-medium leading-relaxed">
                    {ref.citation}
                  </p>
                  {ref.annotation && (
                    <p className="text-[11px] text-slate-600 bg-white p-2 rounded-xl border border-slate-200 font-medium">
                      💡 {ref.annotation}
                    </p>
                  )}
                  {ref.url && (
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:underline pt-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Buka Tautan Sumber / Arsip Resmi</span>
                    </a>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowReferenceModal(false)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md cursor-pointer hover:bg-indigo-700"
            >
              Tutup Daftar Pustaka
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
