import { ArrowLeft, Layers, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react'
import { ATOM_MODELS } from '../../data/atomModels'

interface ComparisonViewProps {
  onBackToHome: () => void
  onSelectModel: (modelId: string) => void
}

export function ComparisonView({ onBackToHome, onSelectModel }: ComparisonViewProps) {
  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <button
          onClick={onBackToHome}
          className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition border border-slate-200 flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-slate-600" />
          <span>Kembali ke Beranda</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
          <Layers className="w-3.5 h-3.5" />
          <span>Komparasi Antarmodel Lengkap</span>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Tabel Perbandingan Model-Model Atom
        </h2>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Menampilkan evolusi sains: bagaimana setiap model menjawab keterbatasan model sebelumnya dan apa anomali yang memicu lahirnya model berikutnya.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-black">
              <th className="p-4">Model & Tokoh</th>
              <th className="p-4">Periode</th>
              <th className="p-4">Bentuk Konseptual Atom</th>
              <th className="p-4">Kelebihan / Terobosan</th>
              <th className="p-4">Keterbatasan (Anomali)</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {ATOM_MODELS.map((model) => (
              <tr key={model.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-4 font-bold text-slate-900 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full bg-gradient-to-tr ${model.theme.gradient}`} />
                    <span>{model.name}</span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 block ml-5">
                    {model.scientist}
                  </span>
                </td>
                <td className="p-4 font-mono font-bold text-slate-600 whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded-md text-[11px] ${model.theme.badgeBg}`}>
                    {model.period}
                  </span>
                </td>
                <td className="p-4 text-slate-700 font-medium max-w-xs">
                  {model.summary}
                </td>
                <td className="p-4 text-emerald-900 font-medium max-w-xs">
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{model.resolvedProblem}</span>
                  </div>
                </td>
                <td className="p-4 text-rose-900 font-medium max-w-xs">
                  <div className="flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                    <span>{model.limitations}</span>
                  </div>
                </td>
                <td className="p-4 text-center whitespace-nowrap">
                  <button
                    onClick={() => onSelectModel(model.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 font-bold text-xs transition flex items-center gap-1 mx-auto shadow-xs cursor-pointer"
                  >
                    <span>Eksplorasi</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

