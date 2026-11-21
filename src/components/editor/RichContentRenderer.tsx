import React from 'react'

interface RichContentRendererProps {
  content?: string | null
  className?: string
  fallbackText?: string
}

/**
 * Pembersih dan perender konten kaya ilmiah (Kimia).
 * Menampilkan teks terformat, rumus, sub/sup, simbol, gambar, dan hyperlink secara aman.
 */
export const RichContentRenderer: React.FC<RichContentRendererProps> = ({
  content,
  className = '',
  fallbackText = ''
}) => {
  if (!content) {
    return fallbackText ? <span className={className}>{fallbackText}</span> : null
  }

  // Jika konten adalah teks biasa tanpa HTML, periksa apakah ada teks dengan format sederhana
  const hasHtml = /<[a-z][\s\S]*>/i.test(content)

  if (!hasHtml) {
    // Teks murni: render langsung
    return <span className={`whitespace-pre-line ${className}`}>{content}</span>
  }

  // Sanitasi sederhana untuk mencegah script injection
  const sanitizedHtml = content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/javascript:/gi, '')

  return (
    <div
      className={`rich-chemistry-content leading-relaxed text-inherit [&_sub]:text-[0.75em] [&_sub]:bottom-[-0.2em] [&_sub]:relative [&_sup]:text-[0.75em] [&_sup]:top-[-0.4em] [&_sup]:relative [&_a]:text-indigo-600 [&_a]:font-semibold [&_a]:underline [&_a:hover]:text-indigo-800 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_p]:my-1.5 [&_img]:rounded-xl [&_img]:shadow-sm [&_img]:border [&_img]:border-slate-200 [&_figure]:my-3 ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  )
}
