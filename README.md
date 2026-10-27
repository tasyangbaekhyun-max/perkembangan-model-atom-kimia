# Web Pembelajaran Model-Model Atom (AtomLab)

Proyek media pembelajaran interaktif mengenai model-model atom untuk siswa SMA Kelas X (Fase E), dirancang sesuai spesifikasi pada `.agent/PRD.md` dan `.agent/AGENT.md`.

## 🚀 Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Build Tool**: [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Linter**: [Oxlint](https://oxc.rs/)

---

## 📁 Struktur Direktori

```text
├── .agent/              # Dokumen PRD dan panduan pengembangan AI agent
├── public/              # Aset statis publik
├── src/
│   ├── assets/          # File gambar & vektor aset
│   ├── components/      # Komponen UI modular yang dapat digunakan kembali
│   ├── data/            # Data statis pembelajaran (model atom, analogi, dsb.)
│   │   └── atomModels.ts
│   ├── types/           # Definisi tipe TypeScript
│   │   └── atom.ts
│   ├── App.tsx          # Komponen utama & preview interaktif
│   ├── index.css        # Konfigurasi Tailwind CSS & animasi
│   └── main.tsx         # Entry point aplikasi React
├── index.html           # File HTML utama
├── package.json         # Konfigurasi dependensi dan skrip proyek
├── tsconfig.json        # Konfigurasi TypeScript
└── vite.config.ts       # Konfigurasi Vite & Tailwind plugin
```

---

## 🛠️ Menjalankan Proyek

### 1. Menjalankan Server Pengembangan (Dev Server)
```bash
npm run dev
```
Buka browser di alamat yang ditampilkan di terminal (biasanya `http://localhost:5173`).

> **Catatan Windows PowerShell**: Jika muncul pesan pembatasan skrip PowerShell (*execution policy*), jalankan menggunakan `npm.cmd run dev`.

### 2. Membangun untuk Produksi (Build)
```bash
npm run build
```

### 3. Menjalankan Linting
```bash
npm run lint
```
