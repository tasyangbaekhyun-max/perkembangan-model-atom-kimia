# PRD Web Pembelajaran Model-Model Atom

*Product Requirements Document, versi 1.0 (draf)*
*Disusun: 22 Oktober 2026*

## 1. Ringkasan Produk

Produk ini adalah web pembelajaran interaktif tentang model-model atom, dari gagasan Democritus hingga model mekanika kuantum beserta konfigurasi elektron. Web dirancang untuk siswa SMA kelas X (Fase E) dengan dukungan dasbor untuk guru. Selain sebagai media belajar, web berfungsi sebagai alat pengumpul data penelitian pendidikan kimia (skor, waktu belajar, jejak klik, dan jawaban per butir).

## 2. Latar Belakang dan Masalah

Model atom adalah materi fondasi kimia, tetapi bersifat sangat abstrak. Tiga masalah utama yang ingin diatasi:

1. **Miskonsepsi**: misalnya elektron dianggap mengorbit inti seperti planet, atau model lama dianggap "salah total" dan bukan tahap perkembangan ilmiah.
2. **Keabstrakan**: atom tidak bisa diamati langsung sehingga sulit divisualisasikan.
3. **Kurangnya media mandiri interaktif**: siswa kekurangan sumber belajar yang bisa dieksplorasi sendiri di luar kelas.

## 3. Tujuan Produk

**Tujuan utama**
- Menyediakan media pembelajaran model atom yang interaktif, visual, dan dapat diakses mandiri.
- Mengurangi miskonsepsi melalui visualisasi, simulasi, dan tes diagnostik.
- Merekam data belajar yang dapat dianalisis untuk keperluan penelitian.

**Pendekatan pedagogis**
- **Multipel representasi** (makroskopik, submikroskopik, simbolik) pada *setiap* model atom.
- **Pembelajaran berbasis sejarah sains**: setiap model disajikan sebagai jawaban atas keterbatasan model sebelumnya.

## 4. Pengguna Sasaran (Persona)

| Persona | Deskripsi | Kebutuhan utama |
|---|---|---|
| Siswa SMA kelas X | Pengguna utama, mayoritas mengakses lewat smartphone | Materi mudah dipahami, interaktif, tidak boros kuota, umpan balik cepat |
| Guru kimia | Pengelola kelas dan pemantau belajar | Membuat kelas, membagikan kode kelas, melihat rekap per siswa dan per butir soal |
| Peneliti (admin) | Pemilik produk dan pengguna data | Mengunduh data belajar untuk analisis |

## 5. Ruang Lingkup

### 5.1 Dalam cakupan (In Scope)
- Materi: Democritus (gagasan awal), Dalton, Thomson, Rutherford, Bohr, Sommerfeld/model transisi (opsional), mekanika kuantum (orbital, bilangan kuantum), dan konfigurasi elektron.
- Kedalaman: konseptual kualitatif ditambah sedikit perhitungan (misalnya energi tingkat Bohr).
- Bahasa antarmuka: Indonesia saja.
- Platform: web responsif (smartphone dan desktop).

### 5.2 Di luar cakupan (Out of Scope) pada versi 1.0
- Aplikasi native Android/iOS.
- Versi bahasa Inggris.
- Materi di luar struktur atom (ikatan kimia, tabel periodik lanjutan).
- Halaman persetujuan penelitian (informed consent) di dalam web (lihat bagian Risiko).
- Desain uji coba penelitian (pre-test/post-test, n-gain) ditunda dan dibahas terpisah.

## 6. Kebutuhan Fungsional

### 6.1 Konten dan Navigasi
| ID | Kebutuhan | Prioritas |
|---|---|---|
| F-01 | Halaman beranda dengan peta alur belajar (kronologis dari Democritus hingga mekanika kuantum) | Tinggi |
| F-02 | Satu halaman materi per model atom, memuat tiga level representasi (makroskopik, submikroskopik, simbolik) | Tinggi |
| F-03 | Halaman perbandingan antarmodel (tampilan berdampingan dan tabel) | Tinggi |
| F-04 | Timeline sejarah perkembangan model atom | Sedang |
| F-05 | Profil tokoh ilmuwan (kontribusi dan eksperimen) | Sedang |
| F-06 | Glosarium istilah dan daftar referensi | Sedang |
| F-07 | Galeri video/animasi pendukung | Sedang |
| F-08 | Materi konfigurasi elektron (aturan Aufbau, Pauli, Hund) dengan latihan interaktif | Tinggi |

### 6.2 Simulasi dan Interaktivitas
| ID | Kebutuhan | Prioritas |
|---|---|---|
| F-10 | Simulasi 3D atom interaktif (putar, zoom) untuk tiap model, termasuk visualisasi orbital | Tinggi |
| F-11 | Simulasi eksperimen klasik: tabung sinar katoda (Thomson) dan hamburan sinar alfa (Rutherford) | Tinggi |
| F-12 | Drag-and-drop untuk menyusun proton, neutron, dan elektron | Sedang |
| F-13 | Slider/parameter interaktif (nomor atom, tingkat energi, transisi elektron Bohr) | Tinggi |
| F-14 | Peringatan ukuran data sebelum memuat simulasi 3D, dan pemuatan bertahap (lazy loading) | Tinggi |

### 6.3 Evaluasi dan Diagnosis
| ID | Kebutuhan | Prioritas |
|---|---|---|
| F-20 | Kuis pilihan ganda per model atom dengan umpan balik otomatis | Tinggi |
| F-21 | Tes diagnostik miskonsepsi (format bertingkat, misalnya two-tier/three-tier) dengan umpan balik otomatis | Tinggi |
| F-22 | Rekap hasil per siswa dan ringkasan miskonsepsi yang muncul | Tinggi |

### 6.4 Fitur AI
| ID | Kebutuhan | Prioritas |
|---|---|---|
| F-30 | Chatbot tanya jawab yang **dibatasi pada materi model atom di web ini** (berbasis RAG dari materi yang disiapkan peneliti) | Sedang |
| F-31 | Rekomendasi materi otomatis berdasarkan hasil kuis dan tes diagnostik | Sedang |
| F-32 | Chatbot menolak/mengarahkan kembali pertanyaan di luar cakupan materi | Sedang |

### 6.5 Akun dan Manajemen Kelas
| ID | Kebutuhan | Prioritas |
|---|---|---|
| F-40 | Akun lengkap untuk guru dan siswa (registrasi dan login) | Tinggi |
| F-41 | Guru membuat kelas dan menghasilkan kode kelas; siswa bergabung dengan kode | Tinggi |
| F-42 | Dasbor guru: rekap per siswa, per butir soal, dan per kelas | Tinggi |
| F-43 | Dasbor siswa: progres belajar, riwayat skor, rekomendasi materi | Sedang |
| F-44 | Peneliti/admin dapat mengekspor data (CSV/Excel) | Tinggi |

### 6.6 Perekaman Data Penelitian
| ID | Data yang direkam |
|---|---|
| D-01 | Skor kuis dan tes diagnostik |
| D-02 | Waktu belajar per halaman dan per simulasi |
| D-03 | Jejak klik (interaksi dengan simulasi dan navigasi) |
| D-04 | Jawaban per butir soal (untuk analisis butir, misalnya IRT/Rasch) |

## 7. Kebutuhan Non-Fungsional

| Aspek | Kebutuhan |
|---|---|
| Perangkat | Responsif, mobile-first, tetap nyaman di desktop |
| Kinerja | Ringan dan hemat kuota: kompresi aset, lazy loading, model 3D teroptimasi, halaman inti termuat cepat di jaringan 3G/4G lambat |
| Kompatibilitas | Peramban modern (Chrome, Firefox, Edge, Safari) tanpa instalasi tambahan |
| Keamanan | Autentikasi aman, kata sandi ter-hash, pembatasan akses data (guru hanya melihat kelasnya) |
| Aksesibilitas | Kontras warna memadai, ukuran huruf terbaca, teks alternatif untuk gambar |
| Bahasa | Seluruh antarmuka dan konten dalam bahasa Indonesia |
| Ketersediaan | Stabil selama periode uji coba kelas |

## 8. Desain dan Pengalaman Pengguna

- **Gaya visual**: perpaduan *playful* (warna cerah, elemen gamifikasi ringan seperti lencana atau progres) dan tema sains/futuristik (nuansa laboratorium digital).
- **Alur siswa**: masuk dengan akun, bergabung kelas dengan kode, belajar per model (alur kronologis), mencoba simulasi, mengerjakan kuis dan tes diagnostik, melihat umpan balik dan rekomendasi.
- **Alur guru**: masuk, membuat kelas, membagikan kode, memantau dasbor, mengekspor rekap.
- **Prinsip**: satu konsep per layar, bahasa sederhana, istilah teknis dijelaskan di glosarium dan tooltip.

## 9. Arsitektur Teknis (Usulan Awal)

| Lapisan | Usulan |
|---|---|
| Frontend | Web app responsif; pustaka 3D berbasis WebGL (misalnya three.js) untuk simulasi |
| Backend | Server aplikasi dengan autentikasi dan API |
| Basis data | Basis data relasional untuk akun, kelas, jawaban, dan log interaksi |
| AI | Layanan LLM dengan RAG, menggunakan korpus materi model atom dari web ini |
| Hosting | Layanan cloud skala menengah untuk uji coba kelas |

*Catatan: ini usulan agar bisa dibahas dengan pengembang; pilihan teknologi final ditentukan bersama tim teknis.*

## 10. Skala

Web app skala menengah dengan basis data, ditujukan untuk uji coba beberapa kelas. Arsitektur dirancang agar dapat ditingkatkan jika cakupan sekolah bertambah.

## 11. Indikator Keberhasilan

| Indikator | Cara ukur |
|---|---|
| Validitas | Penilaian ahli materi dan ahli media memenuhi kategori valid/sangat valid |
| Efektivitas | Peningkatan hasil belajar dan/atau pemahaman konsep (misalnya n-gain); rancangan uji coba ditentukan kemudian |
| Kepraktisan | Respons guru dan siswa terhadap kemudahan dan kegunaan |
| Teknis | Waktu muat halaman inti, tingkat keberhasilan pemuatan simulasi 3D di smartphone |

## 12. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Simulasi 3D penuh berat di HP siswa dan boros kuota | Siswa gagal mengakses atau berhenti belajar | Peringatan ukuran data (F-14), lazy loading, optimasi model 3D, opsi mode ringan bila diperlukan |
| Chatbot memberi jawaban keliru atau keluar materi | Menambah miskonsepsi | RAG dibatasi korpus materi, instruksi penolakan di luar cakupan, uji coba jawaban oleh ahli materi |
| Biaya API AI membengkak | Anggaran terlampaui | Batas penggunaan per akun, cache jawaban umum |
| Perekaman data siswa tanpa persetujuan dalam web | Berpotensi tidak sesuai ketentuan etika penelitian/perlindungan data institusi | Persetujuan sudah diputuskan tidak ditampilkan di web; sebaiknya tetap dipastikan lewat jalur lain (misalnya surat izin sekolah dan persetujuan orang tua/wali di luar web) sesuai ketentuan kampus dan komite etik |
| Beban pengembangan besar (3D, AI, dasbor, akun) | Jadwal molor | Pengembangan bertahap pada rilis (lihat bagian 13) |

## 13. Usulan Tahapan Rilis

1. **Tahap 1 (inti)**: akun dan kelas, materi per model, simulasi dasar, kuis, tes diagnostik, perekaman data, ekspor.
2. **Tahap 2**: simulasi 3D penuh dan simulasi eksperimen klasik, halaman perbandingan, timeline dan galeri.
3. **Tahap 3**: chatbot RAG dan rekomendasi materi otomatis, penyempurnaan dasbor.

## 14. Hal yang Masih Terbuka

- Rancangan uji coba penelitian (pre-test/post-test, kelompok, n-gain): ditunda sesuai keputusan.
- Penentuan tepat apakah model Sommerfeld dimasukkan atau tidak.
- Sumber konten (teks, gambar, animasi) dan hak ciptanya.
- Pemilihan teknologi final dan anggaran pengembangan.
- Format butir tes diagnostik (two-tier atau three-tier) dan jumlah butir.
