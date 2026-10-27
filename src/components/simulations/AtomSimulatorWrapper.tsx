import type { AtomModel } from '../../types/atom'
import { DemocritusSimulator } from './DemocritusSimulator'
import { DaltonSimulator } from './DaltonSimulator'
import { ThomsonSimulator } from './ThomsonSimulator'
import { RutherfordSimulator } from './RutherfordSimulator'
import { BohrSimulator } from './BohrSimulator'
import { QuantumSimulator } from './QuantumSimulator'
import { Maximize2, Minimize2, FlaskConical } from 'lucide-react'
import { useState } from 'react'

interface Props {
  model: AtomModel
}

export function AtomSimulatorWrapper({ model }: Props) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const renderSimulator = () => {
    switch (model.id) {
      case 'democritus':
        return <DemocritusSimulator />
      case 'dalton':
        return <DaltonSimulator />
      case 'thomson':
        return <ThomsonSimulator />
      case 'rutherford':
        return <RutherfordSimulator />
      case 'bohr':
        return <BohrSimulator />
      case 'quantum':
        return <QuantumSimulator />
      default:
        return (
          <div className="p-8 text-center text-slate-400">
            Simulator belum tersedia untuk model ini.
          </div>
        )
    }
  }

  return (
    <div
      className={`transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md p-4 md:p-8 flex flex-col items-center justify-center overflow-y-auto'
          : 'flex flex-col gap-4 w-full'
      }`}
    >
      <div
        className={`w-full ${
          isFullscreen ? 'max-w-3xl bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl' : ''
        }`}
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${model.theme.gradient} flex items-center justify-center text-white shadow-xs`}>
              <FlaskConical className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Laboratorium Interaktif: {model.scientist}
            </h3>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition text-xs flex items-center gap-1.5 border border-slate-200"
            title={isFullscreen ? 'Keluar Layar Penuh' : 'Mode Layar Penuh'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span className="text-[11px]">Tutup Layar Penuh</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="text-[11px]">Layar Penuh</span>
              </>
            )}
          </button>
        </div>

        {/* Dynamic Simulator based on accurate chemical rules */}
        {renderSimulator()}
      </div>
    </div>
  )
}
