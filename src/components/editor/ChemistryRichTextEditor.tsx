import React, { useState, useRef } from 'react'
import {
  Bold,
  Italic,
  Underline,
  Subscript,
  Superscript,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Image as ImageIcon,
  Link as LinkIcon,
  Atom,
  Eye,
  Code,
  Upload,
  Check,
  X,
  Type
} from 'lucide-react'
import { RichContentRenderer } from './RichContentRenderer'

interface ChemistryRichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
  label?: string
  description?: string
}

type ActiveToolbarTab = 'format' | 'chemistry' | 'templates' | 'image' | 'link'

export const ChemistryRichTextEditor: React.FC<ChemistryRichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Tuliskan materi atau soal kimia di sini...',
  minHeight = '140px',
  label,
  description
}) => {
  const [activeTab, setActiveTab] = useState<ActiveToolbarTab>('format')
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // State untuk Dialog Sisipkan Gambar
  const [showImageModal, setShowImageModal] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageSize, setImageSize] = useState<'25%' | '50%' | '75%' | '100%'>('50%')
  const [imageAlign, setImageAlign] = useState<'center' | 'left' | 'right'>('center')
  const [imageCaption, setImageCaption] = useState('')

  // State untuk Dialog Sisipkan Link
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [linkText, setLinkText] = useState('')
  const [linkUrl, setLinkUrl] = useState('https://')

  /**
   * Membungkus teks yang sedang diseleksi dengan tag HTML tertentu
   */
  const wrapSelection = (before: string, after: string, defaultPlaceholder = 'teks') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end) || defaultPlaceholder
    const replacement = `${before}${selectedText}${after}`

    const newValue = value.substring(0, start) + replacement + value.substring(end)
    onChange(newValue)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
    }, 10)
  }

  /**
   * Menyisipkan teks / simbol langsung pada posisi kursor
   */
  const insertAtCursor = (textToInsert: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd

    const newValue = value.substring(0, start) + textToInsert + value.substring(end)
    onChange(newValue)

    setTimeout(() => {
      textarea.focus()
      const newPos = start + textToInsert.length
      textarea.setSelectionRange(newPos, newPos)
    }, 10)
  }

  // Handle Upload Gambar dari Perangkat
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validasi tipe file
    if (!file.type.startsWith('image/')) {
      alert('Harap pilih berkas gambar yang valid (PNG, JPG, SVG, WebP).')
      return
    }

    // Baca file menjadi base64 Data URL
    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      setImagePreview(dataUrl)
      if (!imageCaption) {
        setImageCaption(file.name.replace(/\.[^/.]+$/, ''))
      }
    }
    reader.readAsDataURL(file)
  }

  // Masukkan gambar terformat ke teks
  const handleInsertImage = () => {
    if (!imagePreview) return

    const alignClass =
      imageAlign === 'center'
        ? 'text-center'
        : imageAlign === 'right'
        ? 'text-right'
        : 'text-left'

    const imageHtml = `\n<figure class="my-3 ${alignClass}">\n  <img src="${imagePreview}" alt="${imageCaption || 'Gambar Materi'}" style="max-width: ${imageSize}; display: inline-block; border-radius: 0.75rem;" />\n  ${
      imageCaption ? `<figcaption class="text-xs text-slate-500 mt-1">${imageCaption}</figcaption>` : ''
    }\n</figure>\n`

    insertAtCursor(imageHtml)
    setShowImageModal(false)
    setImagePreview(null)
    setImageCaption('')
  }

  // Masukkan hyperlink ke teks
  const handleInsertLink = () => {
    if (!linkUrl.trim()) return
    const text = linkText.trim() || linkUrl.trim()
    const linkHtml = `<a href="${linkUrl.trim()}" target="_blank" rel="noopener noreferrer">${text}</a>`
    insertAtCursor(linkHtml)
    setShowLinkModal(false)
    setLinkText('')
    setLinkUrl('https://')
  }

  // Koleksi Simbol Kimia & Sains
  const chemistrySymbols = [
    { label: 'H₂O', insert: 'H₂O' },
    { label: 'CO₂', insert: 'CO₂' },
    { label: 'SO₄²⁻', insert: 'SO₄²⁻' },
    { label: 'Fe³⁺', insert: 'Fe³⁺' },
    { label: 'Fe²⁺', insert: 'Fe²⁺' },
    { label: 'Cl⁻', insert: 'Cl⁻' },
    { label: 'Na⁺', insert: 'Na⁺' },
    { label: 'Ca²⁺', insert: 'Ca²⁺' },
    { label: 'OH⁻', insert: 'OH⁻' },
    { label: 'NO₃⁻', insert: 'NO₃⁻' },
    { label: 'CO₃²⁻', insert: 'CO₃²⁻' },
    { label: 'NH₄⁺', insert: 'NH₄⁺' },
    { label: 'H₃O⁺', insert: 'H₃O⁺' },
    { label: 'e⁻ (elektron)', insert: 'e⁻' },
  ]

  const chargeSymbols = [
    { label: '⁺', insert: '⁺' },
    { label: '⁻', insert: '⁻' },
    { label: '²⁺', insert: '²⁺' },
    { label: '³⁺', insert: '³⁺' },
    { label: '²⁻', insert: '²⁻' },
    { label: '³⁻', insert: '³⁻' },
    { label: '⁴⁺', insert: '⁴⁺' },
    { label: 'δ⁺', insert: 'δ⁺' },
    { label: 'δ⁻', insert: 'δ⁻' },
  ]

  const arrowSymbols = [
    { label: '→ (reaksi maju)', insert: ' → ' },
    { label: '⇌ (kesetimbangan)', insert: ' ⇌ ' },
    { label: '↔ (resonansi)', insert: ' ↔ ' },
    { label: '⇄ (bolak-balik)', insert: ' ⇄ ' },
    { label: '↑ (pelepasan gas)', insert: '↑' },
    { label: '↓ (endapan)', insert: '↓' },
    { label: '(s) padat', insert: '(s)' },
    { label: '(l) cair', insert: '(l)' },
    { label: '(g) gas', insert: '(g)' },
    { label: '(aq) larutan', insert: '(aq)' },
    { label: 'Δ (pemanasan)', insert: 'Δ' },
    { label: 'hv (radiasi)', insert: 'h·ν' },
    { label: 'kat. (katalis)', insert: 'kat.' },
    { label: 't° (suhu)', insert: 't°' },
  ]

  const mathSymbols = [
    { label: '±', insert: '±' },
    { label: '×', insert: '×' },
    { label: '÷', insert: '÷' },
    { label: '√', insert: '√' },
    { label: '∑', insert: '∑' },
    { label: '≈', insert: '≈' },
    { label: '≤', insert: '≤' },
    { label: '≥', insert: '≥' },
    { label: '≠', insert: '≠' },
    { label: '≡', insert: '≡' },
    { label: '∞', insert: '∞' },
    { label: '°', insert: '°' },
    { label: 'Å (Angstrom)', insert: 'Å' },
  ]

  const greekLetters = [
    { label: 'α (alfa)', insert: 'α' },
    { label: 'β (beta)', insert: 'β' },
    { label: 'γ (gamma)', insert: 'γ' },
    { label: 'Δ (delta)', insert: 'Δ' },
    { label: 'λ (lambda)', insert: 'λ' },
    { label: 'ν (nu)', insert: 'ν' },
    { label: 'π (pi)', insert: 'π' },
    { label: 'θ (theta)', insert: 'θ' },
    { label: 'σ (sigma)', insert: 'σ' },
    { label: 'ω (omega)', insert: 'ω' },
    { label: 'ψ (psi)', insert: 'ψ' },
    { label: 'μ (mu)', insert: 'μ' },
    { label: 'ε (epsilon)', insert: 'ε' },
    { label: 'ρ (rho)', insert: 'ρ' },
  ]

  const equationTemplates = [
    {
      title: 'Reaksi Pembentukan Air',
      desc: '2H₂(g) + O₂(g) → 2H₂O(l)',
      content: '2H₂(g) + O₂(g) → 2H₂O(l)'
    },
    {
      title: 'Kesetimbangan Sintesis Amonia',
      desc: 'N₂(g) + 3H₂(g) ⇌ 2NH₃(g)',
      content: 'N₂(g) + 3H₂(g) ⇌ 2NH₃(g)'
    },
    {
      title: 'Netralisasi Asam Basa',
      desc: 'HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l)',
      content: 'HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l)'
    },
    {
      title: 'Notasi Nuklida / Isotop Atom',
      desc: '₂⁴He²⁺ atau ₆¹²C',
      content: '<sub>6</sub><sup>12</sup>C'
    },
    {
      title: 'Postulat Kuantum Bohr',
      desc: 'ΔE = h·ν = (h·c)/λ',
      content: 'ΔE = h·ν = <sup>h·c</sup>/<sub>λ</sub>'
    },
    {
      title: 'Panjang Gelombang de Broglie',
      desc: 'λ = h / (m·v)',
      content: 'λ = <sup>h</sup>/<sub>(m·v)</sub>'
    }
  ]

  return (
    <div className="flex flex-col rounded-2xl border border-slate-300 bg-white overflow-hidden shadow-xs focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200/50 transition">
      {/* Header / Label jika ada */}
      {(label || description) && (
        <div className="px-3.5 pt-2.5 pb-1 border-b border-slate-100 bg-slate-50/50 flex flex-col">
          {label && <label className="text-xs font-bold text-slate-800">{label}</label>}
          {description && <span className="text-[11px] text-slate-500">{description}</span>}
        </div>
      )}

      {/* Main Toolbar Navigation */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-slate-50/90 p-1.5 gap-1 select-none">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('format')}
            className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer ${
              activeTab === 'format'
                ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Format Teks</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('chemistry')}
            className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer ${
              activeTab === 'chemistry'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-indigo-700 hover:bg-indigo-50 border border-indigo-200'
            }`}
          >
            <Atom className="w-3.5 h-3.5" />
            <span>Simbol & Notasi Kimia</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('templates')}
            className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer ${
              activeTab === 'templates'
                ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Rumus & Persamaan</span>
          </button>

          <button
            type="button"
            onClick={() => setShowImageModal(true)}
            className="px-2.5 py-1 rounded-lg text-emerald-700 hover:bg-emerald-50 border border-emerald-200 transition flex items-center gap-1 cursor-pointer font-bold"
            title="Unggah dan sisipkan gambar dari perangkat"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>+ Gambar</span>
          </button>

          <button
            type="button"
            onClick={() => setShowLinkModal(true)}
            className="px-2.5 py-1 rounded-lg text-sky-700 hover:bg-sky-50 border border-sky-200 transition flex items-center gap-1 cursor-pointer font-bold"
            title="Sisipkan tautan URL / link"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>+ Link</span>
          </button>
        </div>

        {/* View Mode Toggle: Edit vs Preview */}
        <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-lg text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setViewMode('edit')}
            className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
              viewMode === 'edit'
                ? 'bg-white text-slate-800 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Editor
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`px-2 py-0.5 rounded-md transition flex items-center gap-1 cursor-pointer ${
              viewMode === 'preview'
                ? 'bg-white text-indigo-700 shadow-2xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Pratinjau Siswa</span>
          </button>
        </div>
      </div>

      {/* Sub-toolbar Panels */}
      {viewMode === 'edit' && (
        <div className="p-2 border-b border-slate-100 bg-slate-50/40 text-xs">
          {/* TAB 1: FORMAT TEKS */}
          {activeTab === 'format' && (
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Bold, Italic, Underline */}
              <div className="flex items-center bg-white rounded-lg border border-slate-200 shadow-2xs p-0.5">
                <button
                  type="button"
                  onClick={() => wrapSelection('<b>', '</b>', 'teks tebal')}
                  className="p-1.5 hover:bg-slate-100 rounded text-slate-700 hover:text-slate-900 cursor-pointer font-bold"
                  title="Tebal (Bold)"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => wrapSelection('<i>', '</i>', 'teks miring')}
                  className="p-1.5 hover:bg-slate-100 rounded text-slate-700 hover:text-slate-900 cursor-pointer italic"
                  title="Miring (Italic)"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => wrapSelection('<u>', '</u>', 'teks garis bawah')}
                  className="p-1.5 hover:bg-slate-100 rounded text-slate-700 hover:text-slate-900 cursor-pointer underline"
                  title="Garis Bawah (Underline)"
                >
                  <Underline className="w-4 h-4" />
                </button>
              </div>

              {/* Subscript & Superscript (Sangat penting untuk rumus kimia!) */}
              <div className="flex items-center bg-white rounded-lg border border-indigo-200 shadow-2xs p-0.5">
                <button
                  type="button"
                  onClick={() => wrapSelection('<sub>', '</sub>', '2')}
                  className="px-2 py-1 hover:bg-indigo-50 rounded text-indigo-700 font-bold flex items-center gap-1 cursor-pointer"
                  title="Subscript / Indeks Bawah (Contoh: H₂O, SO₄²⁻)"
                >
                  <Subscript className="w-4 h-4" />
                  <span className="text-[11px]">X₂ (Bawah)</span>
                </button>
                <button
                  type="button"
                  onClick={() => wrapSelection('<sup>', '</sup>', '2+')}
                  className="px-2 py-1 hover:bg-indigo-50 rounded text-indigo-700 font-bold flex items-center gap-1 cursor-pointer"
                  title="Superscript / Indeks Atas (Contoh: Fe³⁺, x²)"
                >
                  <Superscript className="w-4 h-4" />
                  <span className="text-[11px]">X² (Atas)</span>
                </button>
              </div>

              {/* Alignments */}
              <div className="flex items-center bg-white rounded-lg border border-slate-200 shadow-2xs p-0.5">
                <button
                  type="button"
                  onClick={() => wrapSelection('<p style="text-align: left;">', '</p>')}
                  className="p-1.5 hover:bg-slate-100 rounded text-slate-700 cursor-pointer"
                  title="Rata Kiri"
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => wrapSelection('<p style="text-align: center;">', '</p>')}
                  className="p-1.5 hover:bg-slate-100 rounded text-slate-700 cursor-pointer"
                  title="Rata Tengah"
                >
                  <AlignCenter className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => wrapSelection('<p style="text-align: right;">', '</p>')}
                  className="p-1.5 hover:bg-slate-100 rounded text-slate-700 cursor-pointer"
                  title="Rata Kanan"
                >
                  <AlignRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => wrapSelection('<p style="text-align: justify;">', '</p>')}
                  className="p-1.5 hover:bg-slate-100 rounded text-slate-700 cursor-pointer"
                  title="Rata Kiri-Kanan (Justify)"
                >
                  <AlignJustify className="w-4 h-4" />
                </button>
              </div>

              {/* Lists */}
              <div className="flex items-center bg-white rounded-lg border border-slate-200 shadow-2xs p-0.5">
                <button
                  type="button"
                  onClick={() => insertAtCursor('\n<ul>\n  <li>Poin materi 1</li>\n  <li>Poin materi 2</li>\n</ul>\n')}
                  className="p-1.5 hover:bg-slate-100 rounded text-slate-700 cursor-pointer"
                  title="Daftar Poin (Bullet List)"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertAtCursor('\n<ol>\n  <li>Langkah pertama</li>\n  <li>Langkah kedua</li>\n</ol>\n')}
                  className="p-1.5 hover:bg-slate-100 rounded text-slate-700 cursor-pointer"
                  title="Daftar Bernomor (Numbered List)"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
              </div>

              {/* Heading */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => wrapSelection('<h3 class="font-bold text-base text-slate-900 mt-2 mb-1">', '</h3>', 'Judul Submateri')}
                  className="px-2 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[11px] cursor-pointer"
                >
                  Heading (H3)
                </button>
                <button
                  type="button"
                  onClick={() => wrapSelection('<span class="bg-amber-100 text-amber-900 px-1 py-0.5 rounded font-medium">', '</span>', 'teks sorotan')}
                  className="px-2 py-1 rounded bg-white hover:bg-amber-50 border border-amber-200 text-amber-800 font-bold text-[11px] cursor-pointer"
                  title="Sorot teks penting"
                >
                  Highlight
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: SIMBOL & NOTASI KIMIA */}
          {activeTab === 'chemistry' && (
            <div className="flex flex-col gap-2">
              {/* Baris 1: Simbol Unsur & Ion Cepat */}
              <div className="flex flex-wrap items-center gap-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1">Ion & Senyawa:</span>
                {chemistrySymbols.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => insertAtCursor(item.insert)}
                    className="px-2 py-0.5 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded text-slate-800 hover:text-indigo-900 font-mono text-xs cursor-pointer font-bold shadow-2xs active:scale-95 transition"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Baris 2: Muatan & Panah Reaksi */}
              <div className="flex flex-wrap items-center gap-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1">Muatan & Panah:</span>
                {chargeSymbols.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => insertAtCursor(item.insert)}
                    className="px-1.5 py-0.5 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded text-indigo-700 font-bold font-mono text-xs cursor-pointer shadow-2xs active:scale-95 transition"
                    title={`Muatan ${item.label}`}
                  >
                    {item.label}
                  </button>
                ))}

                <span className="h-4 w-px bg-slate-300 mx-1" />

                {arrowSymbols.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => insertAtCursor(item.insert)}
                    className="px-2 py-0.5 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded text-emerald-800 font-mono text-xs cursor-pointer font-bold shadow-2xs active:scale-95 transition"
                    title={item.label}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Baris 3: Simbol Matematika & Huruf Yunani */}
              <div className="flex flex-wrap items-center gap-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1">Matematika & Yunani:</span>
                {mathSymbols.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => insertAtCursor(item.insert)}
                    className="px-1.5 py-0.5 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-700 font-mono text-xs cursor-pointer shadow-2xs active:scale-95 transition"
                    title={item.label}
                  >
                    {item.label}
                  </button>
                ))}

                <span className="h-4 w-px bg-slate-300 mx-1" />

                {greekLetters.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => insertAtCursor(item.insert)}
                    className="px-1.5 py-0.5 bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 rounded text-purple-900 font-mono text-xs cursor-pointer font-bold shadow-2xs active:scale-95 transition"
                    title={item.label}
                  >
                    {item.insert}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TEMPLATE PERSAMAAN REAKSI */}
          {activeTab === 'templates' && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider w-full">Template Persamaan Reaksi Siap Pakai:</span>
              {equationTemplates.map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => insertAtCursor(` ${tmpl.content} `)}
                  className="px-3 py-1.5 bg-white hover:bg-indigo-50 border border-indigo-200 rounded-xl text-left shadow-2xs cursor-pointer active:scale-98 transition group"
                >
                  <div className="text-[11px] font-bold text-indigo-900 group-hover:text-indigo-600">{tmpl.title}</div>
                  <div className="text-[10px] font-mono text-slate-500">{tmpl.desc}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Content Area */}
      {viewMode === 'edit' ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ minHeight }}
          className="w-full p-3.5 text-sm text-slate-800 font-sans focus:outline-none resize-y leading-relaxed"
        />
      ) : (
        <div style={{ minHeight }} className="p-4 bg-slate-50/50 overflow-y-auto">
          <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-indigo-600" />
            <span>Tampilan yang Dilihat oleh Siswa:</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <RichContentRenderer content={value} fallbackText="Belum ada konten untuk ditampilkan..." />
          </div>
        </div>
      )}

      {/* DIALOG 1: UNGGAH & SISIPKAN GAMBAR */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Unggah & Sisipkan Gambar</h4>
                  <p className="text-[11px] text-slate-500">Mendukung gambar struktur atom, grafik, dan ilustrasi kimia</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowImageModal(false)
                  setImagePreview(null)
                }}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Input Berkas */}
            <div className="flex flex-col gap-3 text-xs">
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:border-emerald-400 transition bg-slate-50/50">
                <input
                  type="file"
                  id="editor-image-upload"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="editor-image-upload"
                  className="flex flex-col items-center justify-center gap-2 cursor-pointer"
                >
                  <Upload className="w-6 h-6 text-emerald-600" />
                  <span className="font-bold text-slate-700">Pilih berkas gambar dari perangkat Anda</span>
                  <span className="text-[10px] text-slate-400">PNG, JPG, SVG, WebP, atau GIF</span>
                </label>
              </div>

              {/* Preview Gambar jika dipilih */}
              {imagePreview && (
                <div className="flex flex-col gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-700">Pratinjau Gambar:</div>
                  <div className="max-h-48 overflow-hidden rounded-xl border border-slate-200 bg-white flex items-center justify-center p-2">
                    <img src={imagePreview} alt="Preview" className="max-h-44 object-contain" />
                  </div>

                  {/* Pengaturan Ukuran & Posisi */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Ukuran Gambar:</label>
                      <select
                        value={imageSize}
                        onChange={(e) => setImageSize(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white font-medium"
                      >
                        <option value="25%">Kecil (25%)</option>
                        <option value="50%">Sedang (50%)</option>
                        <option value="75%">Besar (75%)</option>
                        <option value="100%">Penuh (100%)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Posisi / Rata:</label>
                      <select
                        value={imageAlign}
                        onChange={(e) => setImageAlign(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white font-medium"
                      >
                        <option value="center">Rata Tengah</option>
                        <option value="left">Rata Kiri</option>
                        <option value="right">Rata Kanan</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Keterangan Gambar (Caption):</label>
                    <input
                      type="text"
                      value={imageCaption}
                      onChange={(e) => setImageCaption(e.target.value)}
                      placeholder="Contoh: Ilustrasi Model Atom Rutherford"
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-medium"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Aksi Modal */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setShowImageModal(false)
                  setImagePreview(null)
                }}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleInsertImage}
                disabled={!imagePreview}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Sisipkan ke Konten</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DIALOG 2: SISIPKAN HYPERLINK */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
                  <LinkIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Sisipkan Tautan (Link)</h4>
                  <p className="text-[11px] text-slate-500">Siswa dapat mengklik link untuk rujukan belajar tambahan</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Teks yang Ditampilkan:</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Contoh: Baca Jurnal Asli Rutherford (1911)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium focus:outline-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Alamat URL Tujuan:</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-slate-700 focus:outline-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleInsertLink}
                disabled={!linkUrl.trim()}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Sisipkan Tautan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
