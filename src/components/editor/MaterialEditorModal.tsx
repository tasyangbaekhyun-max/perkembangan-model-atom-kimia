import React, { useState } from 'react'
import {
  X,
  Save,
  Atom,
  FlaskConical,
  BookOpen,
  User,
  Plus,
  Trash2,
  Palette
} from 'lucide-react'
import type { AtomModel, AtomTheme } from '../../types/atom'
import { ChemistryRichTextEditor } from './ChemistryRichTextEditor'

interface MaterialEditorModalProps {
  isOpen: boolean
  modelToEdit?: AtomModel | null
  onSave: (model: AtomModel) => void
  onClose: () => void
}

const THEME_PRESETS: { name: string; theme: AtomTheme; color: string }[] = [
  {
    name: 'Biru - Indigo (Bohr / Standar)',
    color: 'from-blue-500 to-indigo-600',
    theme: {
      bgLight: 'bg-indigo-50/70',
      borderLight: 'border-indigo-200',
      activeRing: 'ring-indigo-500 border-indigo-400 bg-indigo-100/80',
      textColor: 'text-indigo-900',
      badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      gradient: 'from-blue-600 to-indigo-600'
    }
  },
  {
    name: 'Emas - Amber (Democritus)',
    color: 'from-amber-400 to-orange-500',
    theme: {
      bgLight: 'bg-amber-50/70',
      borderLight: 'border-amber-200',
      activeRing: 'ring-amber-500 border-amber-400 bg-amber-100/80',
      textColor: 'text-amber-900',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
      gradient: 'from-amber-500 to-orange-500'
    }
  },
  {
    name: 'Zamrud - Emerald (Dalton / Dasar)',
    color: 'from-emerald-400 to-teal-500',
    theme: {
      bgLight: 'bg-emerald-50/70',
      borderLight: 'border-emerald-200',
      activeRing: 'ring-emerald-500 border-emerald-400 bg-emerald-100/80',
      textColor: 'text-emerald-900',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      gradient: 'from-emerald-500 to-teal-600'
    }
  },
  {
    name: 'Langit - Sky (Thomson)',
    color: 'from-sky-400 to-blue-500',
    theme: {
      bgLight: 'bg-sky-50/70',
      borderLight: 'border-sky-200',
      activeRing: 'ring-sky-500 border-sky-400 bg-sky-100/80',
      textColor: 'text-sky-900',
      badgeBg: 'bg-sky-100 text-sky-800 border-sky-200',
      gradient: 'from-sky-500 to-blue-600'
    }
  },
  {
    name: 'Ungu - Violet (Kuantum Modern)',
    color: 'from-purple-500 to-indigo-600',
    theme: {
      bgLight: 'bg-purple-50/70',
      borderLight: 'border-purple-200',
      activeRing: 'ring-purple-500 border-purple-400 bg-purple-100/80',
      textColor: 'text-purple-900',
      badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
      gradient: 'from-purple-600 to-indigo-600'
    }
  },
  {
    name: 'Mawar - Rose (Rutherford)',
    color: 'from-rose-400 to-red-500',
    theme: {
      bgLight: 'bg-rose-50/70',
      borderLight: 'border-rose-200',
      activeRing: 'ring-rose-500 border-rose-400 bg-rose-100/80',
      textColor: 'text-rose-900',
      badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
      gradient: 'from-rose-500 to-red-600'
    }
  }
]

export const MaterialEditorModal: React.FC<MaterialEditorModalProps> = ({
  isOpen,
  modelToEdit,
  onSave,
  onClose
}) => {
  const isEditing = !!modelToEdit

  // Form States
  const [name, setName] = useState(modelToEdit?.name || '')
  const [scientist, setScientist] = useState(modelToEdit?.scientist || '')
  const [period, setPeriod] = useState(modelToEdit?.period || '')
  const [summary, setSummary] = useState(modelToEdit?.summary || '')
  const [analogy, setAnalogy] = useState(modelToEdit?.analogy || '')

  // Tiga Level Representasi Kimia
  const [macroscopic, setMacroscopic] = useState(modelToEdit?.representations.macroscopic || '')
  const [submicroscopic, setSubmicroscopic] = useState(modelToEdit?.representations.submicroscopic || '')
  const [symbolic, setSymbolic] = useState(modelToEdit?.representations.symbolic || '')

  // Kaidah & Postulat Kimia
  const [chemicalRules, setChemicalRules] = useState<string[]>(
    modelToEdit?.chemicalRules && modelToEdit.chemicalRules.length > 0
      ? modelToEdit.chemicalRules
      : ['Atom tersusun atas partikel dasar.']
  )

  // Eksperimen, Solusi, Keterbatasan
  const [historicalExperiment, setHistoricalExperiment] = useState(modelToEdit?.historicalExperiment || '')
  const [resolvedProblem, setResolvedProblem] = useState(modelToEdit?.resolvedProblem || '')
  const [limitations, setLimitations] = useState(modelToEdit?.limitations || '')

  // Profil Ilmuwan
  const [scientistBio, setScientistBio] = useState(modelToEdit?.scientistProfile.bio || '')
  const [keyContribution, setKeyContribution] = useState(modelToEdit?.scientistProfile.keyContribution || '')
  const [lifespan, setLifespan] = useState(modelToEdit?.scientistProfile.lifespan || '')
  const [nationality, setNationality] = useState(modelToEdit?.scientistProfile.nationality || '')

  // Tema Warna
  const [selectedThemeIndex, setSelectedThemeIndex] = useState(0)

  // Navigasi Tab di dalam Modal Editor
  const [activeEditorSection, setActiveEditorSection] = useState<'general' | 'representations' | 'experiment' | 'scientist'>('general')

  if (!isOpen) return null

  // Handler Kaidah Kimia
  const handleAddRule = () => {
    setChemicalRules([...chemicalRules, ''])
  }

  const handleUpdateRule = (index: number, val: string) => {
    const updated = [...chemicalRules]
    updated[index] = val
    setChemicalRules(updated)
  }

  const handleRemoveRule = (index: number) => {
    if (chemicalRules.length <= 1) return
    setChemicalRules(chemicalRules.filter((_, i) => i !== index))
  }

  // Handle Simpan Data
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      alert('Nama model atom wajib diisi.')
      return
    }

    const themePreset = THEME_PRESETS[selectedThemeIndex] || THEME_PRESETS[0]
    const modelId =
      modelToEdit?.id ||
      `custom_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`

    const finalModel: AtomModel = {
      id: modelId,
      name: name.trim(),
      scientist: scientist.trim() || 'Ilmuwan Kimia',
      period: period.trim() || 'Era Modern',
      summary: summary.trim(),
      analogy: analogy.trim(),
      representations: {
        macroscopic: macroscopic.trim(),
        submicroscopic: submicroscopic.trim(),
        symbolic: symbolic.trim()
      },
      chemicalRules: chemicalRules.filter((r) => r.trim().length > 0),
      historicalExperiment: historicalExperiment.trim(),
      resolvedProblem: resolvedProblem.trim(),
      limitations: limitations.trim(),
      color: modelToEdit?.color || themePreset.color,
      theme: modelToEdit?.theme || themePreset.theme,
      scientistProfile: {
        fullName: scientist.trim() || 'Ilmuwan Kimia',
        lifespan: lifespan.trim() || '1800 - 1900',
        nationality: nationality.trim() || 'Internasional',
        title: `${scientist.trim()} • Peneliti Model Atom`,
        avatarUrl: modelToEdit?.scientistProfile.avatarUrl || '/scientists/democritus.jpg',
        bio: scientistBio.trim() || `Peneliti utama yang merumuskan konsep ${name}.`,
        keyContribution: keyContribution.trim() || `Pengembangan teori ilmiah ${name}.`,
        funFact: modelToEdit?.scientistProfile.funFact || 'Mendedikasikan penelitian ilmiah untuk memahami struktur materi alam semesta.'
      },
      references: modelToEdit?.references || [
        {
          id: `ref_${Date.now()}`,
          citation: 'Buku Ajar Kimia SMA Kurikulum Merdeka (Kemendikbudristek RI).',
          title: 'Kimia Dasar Struktur Atom',
          authors: 'Pusat Kurikulum dan Perbukuan',
          year: 2026,
          sourceName: 'Kemendikbudristek',
          type: 'curriculum'
        }
      ]
    }

    onSave(finalModel)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shadow-xs">
              <Atom className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                {isEditing ? `Edit Materi: ${modelToEdit.name}` : 'Tambah Materi Pembelajaran Baru (Mode Guru)'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Konten otomatis disinkronkan dan dapat diakses langsung oleh siswa
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 pt-3 pb-2 border-b border-slate-100 bg-white text-xs font-bold overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveEditorSection('general')}
            className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeEditorSection === 'general'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>1. Identitas & Ringkasan</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveEditorSection('representations')}
            className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeEditorSection === 'representations'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>2. Tiga Level Representasi Kimia</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveEditorSection('experiment')}
            className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeEditorSection === 'experiment'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Atom className="w-3.5 h-3.5" />
            <span>3. Eksperimen & Postulat</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveEditorSection('scientist')}
            className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeEditorSection === 'scientist'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>4. Tokoh & Penampilan</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 text-xs">
          
          {/* SECTION 1: IDENTITAS & RINGKASAN */}
          {activeEditorSection === 'general' && (
            <div className="flex flex-col gap-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-slate-800">Nama Model / Materi Pembelajaran: *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Model Atom Bohr"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm focus:outline-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Periode / Tahun Penemuan: *</label>
                  <input
                    type="text"
                    required
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    placeholder="Contoh: 1913 atau ±400 SM"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm focus:outline-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Tokoh Penggagas / Ilmuwan: *</label>
                <input
                  type="text"
                  required
                  value={scientist}
                  onChange={(e) => setScientist(e.target.value)}
                  placeholder="Contoh: Niels Bohr"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800 focus:outline-indigo-500"
                />
              </div>

              {/* Rich Text Editor untuk Ringkasan Inti Teori */}
              <div className="space-y-1">
                <ChemistryRichTextEditor
                  label="Ringkasan Inti Teori / Hakikat Materi: *"
                  description="Jelaskan konsep inti teori atom. Gunakan toolbar di bawah untuk rumus, indeks sub/sup, dan simbol kimia."
                  value={summary}
                  onChange={setSummary}
                  minHeight="120px"
                  placeholder="Tuliskan ringkasan ilmiah model atom..."
                />
              </div>

              {/* Rich Text Editor untuk Analogi */}
              <div className="space-y-1">
                <ChemistryRichTextEditor
                  label="Analogi Konseptual (Membantu Pemahaman Siswa):"
                  description="Gunakan perumpamaan dunia nyata (misal: Roti Kismis, Tata Surya, Bola Pejal, dll.)."
                  value={analogy}
                  onChange={setAnalogy}
                  minHeight="90px"
                  placeholder="Contoh: Elektron mengelilingi inti seperti planet mengitari matahari..."
                />
              </div>
            </div>
          )}

          {/* SECTION 2: TIGA LEVEL REPRESENTASI KIMIA (Johnstone's Triangle) */}
          {activeEditorSection === 'representations' && (
            <div className="flex flex-col gap-4 animate-fade-in">
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-2xl text-blue-950 font-medium leading-relaxed">
                🔬 <strong>Segitiga Representasi Kimia (Johnstone)</strong>: Sangat penting untuk kurikulum kimia modern agar siswa dapat menghubungkan fenomena kasat mata dengan partikel tak kasat mata dan rumus lambangnya.
              </div>

              {/* 1. Level Makroskopik */}
              <div className="space-y-1">
                <ChemistryRichTextEditor
                  label="Level 1: Fenomena Makroskopik (Terlihat / Terukur Nyata):"
                  description="Jelaskan fenomena teramati di laboratorium atau timbangan (misal: Hukum Kekekalan Massa Lavoisier, spektrum warna cahaya gas)."
                  value={macroscopic}
                  onChange={setMacroscopic}
                  minHeight="100px"
                  placeholder="Fenomena yang dapat diamati siswa secara kasat mata..."
                />
              </div>

              {/* 2. Level Submikroskopik */}
              <div className="space-y-1">
                <ChemistryRichTextEditor
                  label="Level 2: Partikel Submikroskopik (Skala Atom / Partikel Fundamental):"
                  description="Jelaskan susunan partikel atom, proton, elektron, neutron, atau orbital gelombang probabilitas."
                  value={submicroscopic}
                  onChange={setSubmicroscopic}
                  minHeight="100px"
                  placeholder="Partikel tak kasat mata di dalam struktur atom..."
                />
              </div>

              {/* 3. Level Simbolik */}
              <div className="space-y-1">
                <ChemistryRichTextEditor
                  label="Level 3: Representasi Simbolik & Matematis:"
                  description="Tuliskan lambang kimia, rumus notasi kuantum, persamaan energi, atau reaksi kimia terkait."
                  value={symbolic}
                  onChange={setSymbolic}
                  minHeight="90px"
                  placeholder="Contoh: ₁¹H, ΔE = h·ν, rumus orbital..."
                />
              </div>
            </div>
          )}

          {/* SECTION 3: EKSPERIMEN & KAIDAH/POSTULAT KIMIA */}
          {activeEditorSection === 'experiment' && (
            <div className="flex flex-col gap-4 animate-fade-in">
              {/* Eksperimen Sejarah */}
              <div className="space-y-1">
                <ChemistryRichTextEditor
                  label="Landasan Eksperimen Sejarah:"
                  description="Jelaskan eksperimen kunci yang mendasari lahirnya model atom ini (misal: Hamburan sinar alfa lempeng emas, tabung sinar katoda)."
                  value={historicalExperiment}
                  onChange={setHistoricalExperiment}
                  minHeight="100px"
                  placeholder="Deskripsi percobaan dan pengamatan eksperimental..."
                />
              </div>

              {/* Kaidah & Postulat Kimia */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800">Kaidah Pokok / Postulat Model Atom:</label>
                  <button
                    type="button"
                    onClick={handleAddRule}
                    className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Tambah Postulat</span>
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  {chemicalRules.map((rule, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="w-6 h-8 rounded-lg bg-slate-100 text-slate-600 font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={rule}
                        onChange={(e) => handleUpdateRule(idx, e.target.value)}
                        placeholder={`Kaidah / Postulat ke-${idx + 1}`}
                        className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 font-medium text-slate-800 focus:outline-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveRule(idx)}
                        disabled={chemicalRules.length <= 1}
                        className="w-8 h-8 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 disabled:opacity-30 flex items-center justify-center cursor-pointer transition shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Solusi Terpecahkan & Keterbatasan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <ChemistryRichTextEditor
                    label="Kelebihan / Masalah Terpecahkan:"
                    value={resolvedProblem}
                    onChange={setResolvedProblem}
                    minHeight="90px"
                    placeholder="Masalah yang berhasil dipecahkan model ini..."
                  />
                </div>
                <div className="space-y-1">
                  <ChemistryRichTextEditor
                    label="Kelemahan / Keterbatasan Teori:"
                    value={limitations}
                    onChange={setLimitations}
                    minHeight="90px"
                    placeholder="Mengapa teori ini digantikan oleh model selanjutnya..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: TOKOH & TEMA PENAMPILAN */}
          {activeEditorSection === 'scientist' && (
            <div className="flex flex-col gap-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Rentang Hidup Tokoh:</label>
                  <input
                    type="text"
                    value={lifespan}
                    onChange={(e) => setLifespan(e.target.value)}
                    placeholder="Contoh: 1885 – 1962"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Kebangsaan / Asal Negara:</label>
                  <input
                    type="text"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    placeholder="Contoh: Denmark"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <ChemistryRichTextEditor
                  label="Biografi Singkat Tokoh:"
                  value={scientistBio}
                  onChange={setScientistBio}
                  minHeight="80px"
                  placeholder="Latar belakang ilmiah ilmuwan..."
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Kontribusi Kunci:</label>
                <input
                  type="text"
                  value={keyContribution}
                  onChange={(e) => setKeyContribution(e.target.value)}
                  placeholder="Contoh: Membuktikan elektron mengorbit pada tingkat energi stasioner..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              {/* Pemilihan Tema Visual */}
              <div className="space-y-2">
                <label className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-indigo-600" />
                  <span>Pilihan Tema Warna Visual Model:</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {THEME_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedThemeIndex(idx)}
                      className={`p-2.5 rounded-2xl border text-left flex items-center gap-2 cursor-pointer transition ${
                        selectedThemeIndex === idx
                          ? 'border-indigo-600 ring-2 ring-indigo-200 bg-indigo-50/50'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${preset.color} shrink-0`} />
                      <span className="text-[11px] font-bold text-slate-800 truncate">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 mt-2 shrink-0">
            <div className="text-slate-500 text-[11px]">
              {isEditing ? 'Memperbarui materi yang sudah ada' : 'Materi baru akan ditambahkan ke garis waktu'}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs cursor-pointer transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 flex items-center gap-2 cursor-pointer transition active:scale-98"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Materi Pembelajaran</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  )
}
