import { useState } from 'react'
import {
  Atom,
  GraduationCap,
  Clock,
  HelpCircle,
  ShieldCheck,
  Layers,
  Library,
  X,
  ExternalLink
} from 'lucide-react'
import { ATOM_MODELS } from './data/atomModels'
import { HomeView } from './components/home/HomeView'
import { ComparisonView } from './components/comparison/ComparisonView'
import { QuizWorkspace } from './components/quiz/QuizWorkspace'
import { TimelineWorkspace } from './components/timeline/TimelineWorkspace'

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'timeline' | 'comparison' | 'quiz'>('home')
  const [timelineModelId, setTimelineModelId] = useState<string>('democritus')
  const [showGlobalBibliographyModal, setShowGlobalBibliographyModal] = useState<boolean>(false)

  const navigateToTimelineWithModel = (modelId?: string) => {
    if (modelId) {
      setTimelineModelId(modelId)
    } else {
      setTimelineModelId('democritus')
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
            onClick={() => {
              setCurrentView('home')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
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
              onClick={() => {
                setCurrentView('home')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer ${currentView === 'home'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              Beranda
            </button>
            <button
              onClick={() => navigateToTimelineWithModel()}
              className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${currentView === 'timeline'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Model Atom (Alur Runtut)</span>
            </button>
            <button
              onClick={() => {
                setCurrentView('comparison')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${currentView === 'comparison'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Perbandingan</span>
            </button>
            <button
              onClick={() => {
                setCurrentView('quiz')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${currentView === 'quiz'
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
            onNavigateToTimeline={() => navigateToTimelineWithModel('democritus')}
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

        {/* VIEW 4: TAHAPAN KRONOLOGIS PERKEMBANGAN MODEL ATOM (Alur Runtut & Bebas Tumpukan) */}
        {currentView === 'timeline' && (
          <TimelineWorkspace
            key={timelineModelId}
            initialModelId={timelineModelId}
            onBackToHome={() => {
              setCurrentView('home')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            onNavigateToQuiz={() => {
              setCurrentView('quiz')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-12 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-3">
          <button
            onClick={() => setShowGlobalBibliographyModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 font-bold text-xs transition shadow-xs cursor-pointer"
          >
            <Library className="w-4 h-4 text-indigo-600" />
            <span>Lihat Daftar Pustaka Lengkap Seluruh Web ({ATOM_MODELS.reduce((acc, m) => acc + m.references.length, 0)} Sumber Terverifikasi)</span>
          </button>
          <p className="font-semibold text-slate-600">© 2026 Web Pembelajaran Model-Model Atom (AtomLab) • Dirancang untuk Siswa SMA Kelas X (Fase E)</p>
          <p className="text-slate-400">Seluruh materi ilmiah diverifikasi berbasis buku teks standar universitas (Chang, Brown, Petrucci) dan Capaian Pembelajaran Kurikulum Merdeka (Kemendikbudristek RI).</p>
        </div>
      </footer>

      {/* Global Master Bibliography Modal */}
      {showGlobalBibliographyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 flex flex-col gap-4 max-h-[85vh] overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <Library className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Daftar Pustaka &amp; Rujukan Akademik Lengkap</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Buku teks internasional, jurnal ilmiah primer, dan dokumen kurikulum resmi</p>
                </div>
              </div>
              <button
                onClick={() => setShowGlobalBibliographyModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pr-1">
              {ATOM_MODELS.map((model) => (
                <div key={model.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full bg-gradient-to-tr ${model.theme.gradient}`} />
                      <h4 className="font-black text-slate-900 text-xs sm:text-sm">{model.name} ({model.scientist})</h4>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      {model.references.length} Rujukan
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {model.references.map((ref, idx) => (
                      <div key={ref.id} className="p-3 rounded-xl bg-white border border-slate-200 text-xs flex flex-col gap-1.5 shadow-2xs">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-slate-500 text-[10px]">[{idx + 1}] {ref.type.toUpperCase()}</span>
                          <span className="text-[10px] font-mono text-slate-400">{ref.sourceName} ({ref.year})</span>
                        </div>
                        <p className="font-serif text-slate-800 font-medium leading-relaxed">{ref.citation}</p>
                        {ref.url && (
                          <a
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:underline pt-0.5"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Tautan Sumber</span>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowGlobalBibliographyModal(false)}
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
