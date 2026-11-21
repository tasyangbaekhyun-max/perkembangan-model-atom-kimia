import React from 'react'
import { AlertTriangle, Trash2, X } from 'lucide-react'

interface DeleteConfirmationModalProps {
  isOpen: boolean
  title: string
  itemName: string
  itemType: 'materi' | 'soal'
  onConfirm: () => void
  onCancel: () => void
  isDeleting?: boolean
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  title,
  itemName,
  itemType,
  onConfirm,
  onCancel,
  isDeleting = false
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-100 flex flex-col gap-4 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">{title}</h3>
              <p className="text-[11px] text-slate-500">Konfirmasi tindakan penghapusan</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="w-8 h-8 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Warning Content */}
        <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-2xl text-xs text-rose-950 flex flex-col gap-1.5 leading-relaxed">
          <p className="font-bold">
            Peringatan: Anda akan menghapus {itemType === 'materi' ? 'materi' : 'soal'} berikut:
          </p>
          <div className="p-2.5 bg-white rounded-xl border border-rose-200 font-semibold text-rose-900 line-clamp-2">
            &ldquo;{itemName}&rdquo;
          </div>
          <p className="text-[11px] text-rose-700">
            Tindakan ini akan menghapus data dari sistem dan tidak dapat dibatalkan. Siswa tidak akan lagi dapat melihat {itemType === 'materi' ? 'materi' : 'soal'} ini.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs cursor-pointer transition"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition active:scale-98"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isDeleting ? 'Menghapus...' : 'Ya, Hapus Sekarang'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
