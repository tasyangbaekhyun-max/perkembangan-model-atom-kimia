import { useState } from 'react'
import {
  Atom,
  BookOpen,
  GraduationCap,
  Sparkles,
  Clock,
  HelpCircle,
  ShieldCheck,
  AlertTriangle,
  History,
  FileText,
  ArrowLeft,
  Compass,
  Layers,
  User,
  Globe,
  Calendar,
  Award,
  Lightbulb,
  Eye,
  CheckCircle2
} from 'lucide-react'
import { ATOM_MODELS } from './data/atomModels'
import type { AtomModel } from './types/atom'
import { AtomSimulatorWrapper } from './components/simulations/AtomSimulatorWrapper'
import { HomeView } from './components/home/HomeView'
import { ComparisonView } from './components/comparison/ComparisonView'
import { QuizWorkspace } from './components/quiz/QuizWorkspace'

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'timeline' | 'comparison' | 'quiz'>('home')
  const [selectedModel, setSelectedModel] = useState<AtomModel>(ATOM_MODELS[3]) // Rutherford as initial model
  const [activeTab, setActiveTab] = useState<'scientist' | 'overview' | 'rules' | 'representations' | 'quiz'>('scientist')

  const handleModelSelect = (model: AtomModel) => {
    setSelectedModel(model)
  }

  const navigateToTimelineWithModel = (modelId?: string) => {
    if (modelId) {
      const found = ATOM_MODELS.find((m) => m.id === modelId)
      if (found) setSelectedModel(found)
    }
    setCurrentView('timeline')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/40 text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-slate-200/80 px-4 lg:px-8 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/25 text-white group-hover:scale-105 transition-transform">
              <Atom className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  AtomLab
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                  Fase E • Kimia SMA
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Media Pembelajaran Interaktif Model Atom</p>
            </div>
          </div>

          {/* Center Navigation Pills */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setCurrentView('home')}
              className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
                currentView === 'home'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Beranda
            </button>
            <button
              onClick={() => setCurrentView('timeline')}
              className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                currentView === 'timeline'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Model Atom</span>
            </button>
            <button
              onClick={() => setCurrentView('comparison')}
              className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                currentView === 'comparison'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Perbandingan</span>
            </button>
            <button
              onClick={() => setCurrentView('quiz')}
              className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                currentView === 'quiz'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Uji Konsep (10 Soal)</span>
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span>Kurikulum Merdeka</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Akurasi Ilmiah</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dynamic View Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-8">
        
        {/* VIEW 1: BERANDA (Clean Welcome Portal) */}
        {currentView === 'home' && (
          <HomeView
            onNavigateToTimeline={() => navigateToTimelineWithModel()}
            onNavigateToComparison={() => {
              setCurrentView('comparison')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            onNavigateToSimulation={(modelId) => navigateToTimelineWithModel(modelId)}
            onNavigateToQuiz={() => {
              setCurrentView('quiz')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
        )}

        {/* VIEW 2: TABEL PERBANDINGAN */}
        {currentView === 'comparison' && (
          <ComparisonView
            onBackToHome={() => {
              setCurrentView('home')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            onSelectModel={(modelId) => navigateToTimelineWithModel(modelId)}
          />
        )}

        {/* VIEW 3: UJI PEMAHAMAN KONSEP LENGKAP (10 Soal Variatif) */}
        {currentView === 'quiz' && (
          <QuizWorkspace
            onBackToHome={() => {
              setCurrentView('home')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
        )}

        {/* VIEW 4: TAHAPAN KRONOLOGIS PERKEMBANGAN MODEL ATOM (Detailed Workspace) */}
        {currentView === 'timeline' && (
          <div className="flex flex-col gap-6 w-full animate-fade-in">
            
            {/* Top Navigation Bar: Back to Home + Context Title */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <button
                onClick={() => {
                  setCurrentView('home')
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs transition border border-slate-200 flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-indigo-600" />
                <span>Kembali ke Beranda</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Modul: Tahapan Kronologis Perkembangan Model Atom</span>
                </span>
              </div>
            </div>

            {/* Timeline Horizontal Bar / Model Selector */}
            <section className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" /> Garis Waktu Perkembangan Model Atom
                </h2>
                <span className="text-xs text-slate-500 font-medium">Klik model untuk mengganti laboratorium</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {ATOM_MODELS.map((model, idx) => {
                  const isSelected = selectedModel.id === model.id
                  return (
                    <button
                      key={model.id}
                      onClick={() => handleModelSelect(model)}
                      className={`relative p-3 rounded-2xl text-left transition-all duration-200 border flex flex-col justify-between h-30 shadow-xs cursor-pointer ${
                        isSelected
                          ? `${model.theme.bgLight} ${model.theme.activeRing} shadow-md scale-102`
                          : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold ${
                          isSelected ? model.theme.badgeBg : 'bg-slate-100 text-slate-700'
                        }`}>
                          {idx + 1}. {model.period}
                        </span>
                        {isSelected && (
                          <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-tr ${model.theme.gradient} animate-pulse`} />
                        )}
                      </div>

                      {/* Small Discoverer Preview in Button */}
                      <div className="flex items-center gap-2 my-1">
                        <img
                          src={model.scientistProfile.avatarUrl}
                          alt={model.scientist}
                          className="w-7 h-7 rounded-full object-cover border border-white shadow-xs shrink-0"
                        />
                        <div className="min-w-0">
                          <h3 className={`font-black text-xs truncate ${isSelected ? model.theme.textColor : 'text-slate-800'}`}>
                            {model.scientist}
                          </h3>
                        </div>
                      </div>

                      <p className="text-[10px] text-slate-500 truncate font-medium">{model.name}</p>
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Active Model Interactive Workspace */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Model Theory, Rules & Pedagogical Tabs */}
              <div className="lg:col-span-6 flex flex-col gap-4">
                <div className="bg-white border border-slate-200/90 rounded-3xl p-5 md:p-6 shadow-sm">
                  
                  {/* Header of Active Model with Discoverer Avatar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={selectedModel.scientistProfile.avatarUrl}
                          alt={selectedModel.scientistProfile.fullName}
                          className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-md ring-2 ring-indigo-200"
                        />
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[9px] shadow-xs">
                          ✓
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${selectedModel.theme.badgeBg}`}>
                            {selectedModel.period}
                          </span>
                          <span className="text-xs text-slate-500 font-semibold">{selectedModel.scientist}</span>
                        </div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight leading-snug">{selectedModel.name}</h2>
                      </div>
                    </div>

                    {/* Tabs Selector: "Penemu" placed before "Ringkasan" */}
                    <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
                      <button
                        onClick={() => setActiveTab('scientist')}
                        className={`px-3 py-1.5 rounded-xl transition font-bold flex items-center gap-1 cursor-pointer ${
                          activeTab === 'scientist' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>Penemu</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-3 py-1.5 rounded-xl transition font-bold cursor-pointer ${
                          activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Ringkasan
                      </button>
                      <button
                        onClick={() => setActiveTab('rules')}
                        className={`px-3 py-1.5 rounded-xl transition font-bold cursor-pointer ${
                          activeTab === 'rules' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Aturan Kimia
                      </button>
                      <button
                        onClick={() => setActiveTab('representations')}
                        className={`px-3 py-1.5 rounded-xl transition font-bold cursor-pointer ${
                          activeTab === 'representations' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        3 Representasi
                      </button>
                      <button
                        onClick={() => setActiveTab('quiz')}
                        className={`px-3 py-1.5 rounded-xl transition font-bold cursor-pointer flex items-center gap-1 ${
                          activeTab === 'quiz' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Uji Konsep</span>
                      </button>
                    </div>
                  </div>

                  {/* Tab Content Display */}
                  <div className="pt-4">
                    
                    {/* 0. Tab Penemu (Scientist Profile) */}
                    {activeTab === 'scientist' && (
                      <div className="flex flex-col gap-4 animate-fade-in">
                        <div className="p-4 rounded-3xl bg-gradient-to-br from-indigo-50/90 via-white to-sky-50/70 border-2 border-indigo-100 flex flex-col sm:flex-row items-center sm:items-start gap-4 shadow-xs">
                          <div className="relative shrink-0">
                            <img
                              src={selectedModel.scientistProfile.avatarUrl}
                              alt={selectedModel.scientistProfile.fullName}
                              className="w-24 h-32 object-cover rounded-2xl border-2 border-white shadow-md ring-2 ring-indigo-200"
                            />
                            <span className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs shadow-xs" title="Tokoh Sains">
                              🔬
                            </span>
                          </div>

                          <div className="flex-1 text-center sm:text-left">
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center gap-1">
                                <Globe className="w-3 h-3 text-indigo-600" />
                                {selectedModel.scientistProfile.nationality}
                              </span>
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-slate-500" />
                                {selectedModel.scientistProfile.lifespan}
                              </span>
                            </div>

                            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                              {selectedModel.scientistProfile.fullName}
                            </h3>
                            <p className="text-xs font-bold text-indigo-600 mt-0.5 mb-2">
                              {selectedModel.scientistProfile.title}
                            </p>

                            <p className="text-xs text-slate-700 leading-relaxed font-medium">
                              {selectedModel.scientistProfile.bio}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 shadow-xs flex flex-col gap-1">
                            <h4 className="text-xs font-bold uppercase text-emerald-800 tracking-wider flex items-center gap-1.5">
                              <Award className="w-3.5 h-3.5 text-emerald-600" /> Kontribusi Utama
                            </h4>
                            <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                              {selectedModel.scientistProfile.keyContribution}
                            </p>
                          </div>

                          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 shadow-xs flex flex-col gap-1">
                            <h4 className="text-xs font-bold uppercase text-amber-800 tracking-wider flex items-center gap-1.5">
                              <Lightbulb className="w-3.5 h-3.5 text-amber-600" /> Tahukah Kamu? (Fakta Unik)
                            </h4>
                            <p className="text-xs text-amber-950 font-medium leading-relaxed">
                              {selectedModel.scientistProfile.funFact}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 1. Tab Overview */}
                    {activeTab === 'overview' && (
                      <div className="flex flex-col gap-3.5 animate-fade-in">
                        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 shadow-xs">
                          <h4 className="text-xs font-bold uppercase text-indigo-700 tracking-wider mb-1.5 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" /> Konsep Inti Ilmiah
                          </h4>
                          <p className="text-xs md:text-sm text-slate-800 leading-relaxed font-medium">{selectedModel.summary}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 shadow-xs">
                            <h4 className="text-xs font-bold uppercase text-amber-800 tracking-wider mb-1 flex items-center gap-1">
                              <History className="w-3.5 h-3.5 text-amber-600" /> Landasan Eksperimen
                            </h4>
                            <p className="text-xs text-amber-900 leading-relaxed font-medium">{selectedModel.historicalExperiment}</p>
                          </div>

                          <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 shadow-xs">
                            <h4 className="text-xs font-bold uppercase text-emerald-800 tracking-wider mb-1 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Masalah Terpecahkan
                            </h4>
                            <p className="text-xs text-emerald-900 leading-relaxed font-medium">{selectedModel.resolvedProblem}</p>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200/80 shadow-xs">
                          <h4 className="text-xs font-bold uppercase text-rose-800 tracking-wider mb-1 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Keterbatasan / Anomali (Pemicu Model Selanjutnya)
                          </h4>
                          <p className="text-xs text-rose-950 leading-relaxed font-medium">{selectedModel.limitations}</p>
                        </div>
                      </div>
                    )}

                    {/* 2. Tab Chemical Rules */}
                    {activeTab === 'rules' && (
                      <div className="flex flex-col gap-3 animate-fade-in">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-indigo-600" /> Postulat & Aturan Kimia Otentik:
                          </span>
                        </div>

                        <div className="space-y-2">
                          {selectedModel.chemicalRules.map((rule, idx) => (
                            <div
                              key={idx}
                              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3 shadow-xs"
                            >
                              <span className="w-6 h-6 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <p className="text-xs text-slate-700 leading-relaxed font-medium">{rule}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 3. Tab 3 Representations */}
                    {activeTab === 'representations' && (
                      <div className="flex flex-col gap-3 animate-fade-in">
                        <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 flex items-start gap-3 shadow-xs">
                          <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 mt-0.5 border border-sky-300">
                            <Eye className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-sky-900 uppercase tracking-wide">1. Makroskopik (Teramati Secara Nyata)</h4>
                            <p className="text-xs text-sky-950 mt-1 leading-relaxed font-medium">{selectedModel.representations.macroscopic}</p>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 shadow-xs">
                          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-300">
                            <Atom className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-emerald-900 uppercase tracking-wide">2. Submikroskopik (Partikel Subatom)</h4>
                            <p className="text-xs text-emerald-950 mt-1 leading-relaxed font-medium">{selectedModel.representations.submicroscopic}</p>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 flex items-start gap-3 shadow-xs">
                          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5 border border-purple-300">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-purple-900 uppercase tracking-wide">3. Simbolik (Formula & Notasi Kimia)</h4>
                            <p className="text-xs text-purple-950 mt-1 leading-relaxed font-medium">{selectedModel.representations.symbolic}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 4. Tab Quiz (10 Soal Variatif) */}
                    {activeTab === 'quiz' && (
                      <div className="flex flex-col gap-3 animate-fade-in">
                        <QuizWorkspace embedded />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Authentic Interactive Laboratory Simulator */}
              <div className="lg:col-span-6 flex flex-col gap-4">
                <div className="bg-white border border-slate-200/90 rounded-3xl p-5 md:p-6 shadow-sm">
                  <AtomSimulatorWrapper model={selectedModel} />
                </div>

                {/* Scientific Accuracy Guarantee Notice */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between text-xs text-slate-600 shadow-xs">
                  <span className="flex items-center gap-2 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Simulasi berbasis aturan kimia kurikulum resmi</span>
                  </span>
                  <span className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded-md ${selectedModel.theme.badgeBg}`}>
                    {selectedModel.id.toUpperCase()}
                  </span>
                </div>
              </div>
            </section>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-12 py-6 px-4 text-center text-xs text-slate-500">
        <p className="font-semibold text-slate-600">© 2026 Web Pembelajaran Model-Model Atom • Dirancang untuk Siswa SMA Kelas X (Fase E)</p>
        <p className="mt-1 text-slate-400">Sesuai Prinsip Pedagogis: Multipel Representasi, Sejarah Sains, dan Anti-Miskonsepsi</p>
      </footer>
    </div>
  )
}
