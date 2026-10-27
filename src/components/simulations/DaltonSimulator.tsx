import { useState } from 'react'
import { Zap, AlertCircle, RefreshCw } from 'lucide-react'

type ReactionType = 'h2o' | 'co' | 'co2'

export function DaltonSimulator() {
  const [selectedReaction, setSelectedReaction] = useState<ReactionType>('h2o')
  const [isReacted, setIsReacted] = useState<boolean>(false)
  const [showElectricityTest, setShowElectricityTest] = useState<boolean>(false)

  const reactions = {
    h2o: {
      name: 'Air (H₂O)',
      ratio: '2 Atom Hidrogen : 1 Atom Oksigen',
      law: 'Hukum Perbandingan Tetap (Proust)',
      reactants: [
        { name: 'H', color: 'from-slate-100 to-slate-300 text-slate-800 border-2 border-slate-300', size: 38, label: 'H (Massa 1)' },
        { name: 'H', color: 'from-slate-100 to-slate-300 text-slate-800 border-2 border-slate-300', size: 38, label: 'H (Massa 1)' },
        { name: 'O', color: 'from-rose-500 to-red-600 text-white border-2 border-rose-300', size: 56, label: 'O (Massa 16)' },
      ]
    },
    co: {
      name: 'Karbon Monoksida (CO)',
      ratio: '1 Atom Karbon : 1 Atom Oksigen (Rasio 1:1)',
      law: 'Hukum Perbandingan Berganda (Dalton)',
      reactants: [
        { name: 'C', color: 'from-slate-700 to-slate-900 text-white border-2 border-slate-500', size: 50, label: 'C (Massa 12)' },
        { name: 'O', color: 'from-rose-500 to-red-600 text-white border-2 border-rose-300', size: 56, label: 'O (Massa 16)' },
      ]
    },
    co2: {
      name: 'Karbon Dioksida (CO₂)',
      ratio: '1 Atom Karbon : 2 Atom Oksigen (Rasio 1:2)',
      law: 'Hukum Perbandingan Berganda (Dalton)',
      reactants: [
        { name: 'O', color: 'from-rose-500 to-red-600 text-white border-2 border-rose-300', size: 56, label: 'O (Massa 16)' },
        { name: 'C', color: 'from-slate-700 to-slate-900 text-white border-2 border-slate-500', size: 50, label: 'C (Massa 12)' },
        { name: 'O', color: 'from-rose-500 to-red-600 text-white border-2 border-rose-300', size: 56, label: 'O (Massa 16)' },
      ]
    }
  }

  const current = reactions[selectedReaction]

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Simulation Screen */}
      <div className="relative w-full h-72 rounded-2xl bg-gradient-to-b from-sky-50/90 via-white to-blue-50/90 border-2 border-sky-200/80 flex flex-col items-center justify-between p-4 overflow-hidden shadow-inner">
        
        {/* Header Tag */}
        <div className="w-full flex items-center justify-between z-10">
          <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 border border-sky-300">
            Model Bola Pejal (Billiard Ball) • 1803
          </span>
          <span className="text-xs font-semibold text-slate-600">
            {isReacted ? 'Molekul Senyawa Terbentuk' : 'Atom Unsur Bebas'}
          </span>
        </div>

        {/* Visual Arena */}
        <div className="relative flex items-center justify-center w-full flex-1">
          {/* Reaction Display */}
          <div
            className={`flex items-center transition-all duration-500 ${
              isReacted ? 'gap-0 shadow-xl' : 'gap-6'
            }`}
          >
            {current.reactants.map((atom, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center group transition-all duration-500"
              >
                {/* 3D-shaded Solid Sphere representing Dalton's billiard ball */}
                <div
                  className={`rounded-full bg-gradient-to-br ${atom.color} shadow-lg flex items-center justify-center font-black font-mono transition-transform duration-500 relative select-none ${
                    isReacted ? 'scale-105' : 'hover:scale-110'
                  }`}
                  style={{
                    width: `${atom.size}px`,
                    height: `${atom.size}px`,
                    boxShadow: 'inset -3px -3px 6px rgba(0,0,0,0.3), 0 8px 16px rgba(0,0,0,0.15)',
                  }}
                >
                  <span className="text-xs drop-shadow-sm">{atom.name}</span>
                </div>
                {!isReacted && (
                  <span className="mt-2 text-[10px] text-slate-600 font-bold font-mono">
                    {atom.label}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Electricity test overlay if triggered */}
          {showElectricityTest && (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-xs rounded-xl flex flex-col items-center justify-center p-4 text-center z-20 shadow-lg border border-amber-200 animate-fade-in">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mb-2">
                <Zap className="w-5 h-5 text-amber-600 animate-bounce" />
              </div>
              <h5 className="text-xs font-bold text-amber-900">Keterbatasan Utama Dalton</h5>
              <p className="text-[11px] text-slate-600 max-w-sm mt-1 leading-relaxed">
                Dalton menganggap atom adalah bola pejal tanpa muatan. Model ini <strong>gagal menjelaskan kelistrikan materi</strong> (mengapa benda bermuatan saat digosok), yang kelak mendorong penemuan elektron oleh Thomson!
              </p>
              <button
                onClick={() => setShowElectricityTest(false)}
                className="mt-3 px-3 py-1 rounded-lg text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold border border-slate-300"
              >
                Tutup Catatan
              </button>
            </div>
          )}
        </div>

        {/* Reaction Law Info */}
        <div className="w-full text-center z-10 bg-white/80 py-1.5 px-3 rounded-xl border border-sky-100">
          <p className="text-xs text-sky-800 font-bold">{current.name}: {current.ratio}</p>
          <p className="text-[11px] text-slate-500 font-medium">{current.law}</p>
        </div>
      </div>

      {/* Selector and Actions */}
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-3 gap-2">
          {(['h2o', 'co', 'co2'] as ReactionType[]).map((type) => (
            <button
              key={type}
              onClick={() => {
                setSelectedReaction(type)
                setIsReacted(false)
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition border ${
                selectedReaction === type
                  ? 'bg-gradient-to-r from-blue-600 to-sky-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              {type === 'h2o' ? 'H₂O (Air)' : type === 'co' ? 'CO (Monoksida)' : 'CO₂ (Dioksida)'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 mt-1">
          <button
            onClick={() => setIsReacted(!isReacted)}
            className="py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-500 to-blue-600 hover:brightness-105 text-white transition flex items-center justify-center gap-2 shadow-md shadow-sky-500/20"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isReacted ? 'rotate-180' : ''} transition-transform`} />
            {isReacted ? 'Pisahkan Unsur' : 'Reaksikan Jadi Senyawa'}
          </button>

          <button
            onClick={() => setShowElectricityTest(true)}
            className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-white hover:bg-amber-50 text-amber-700 border border-amber-300 transition flex items-center justify-center gap-2 shadow-xs"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            Uji Sifat Listrik (Anomali)
          </button>
        </div>
      </div>

      {/* Chemical Rule Note */}
      <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-900 flex items-start gap-2.5 shadow-xs">
        <AlertCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <strong>Aturan Dalton:</strong> Atom tidak dapat dipecah, diciptakan, atau dimusnahkan. Dalam reaksi kimia, atom-atom hanya mengalami penataan ulang (berikatan dalam perbandingan bilangan bulat sederhana).
        </p>
      </div>
    </div>
  )
}
