# AGENT.md: Web Pembelajaran Model-Model Atom

Panduan untuk AI coding agent yang membangun proyek ini. Baca seluruh file ini sebelum menulis kode. Rujukan lengkap kebutuhan produk ada di `PRD.md`; jika keduanya bertentangan, `PRD.md` yang berlaku dan konflik harus dilaporkan.

## 1. Gambaran Proyek

Web pembelajaran interaktif tentang model-model atom (Democritus hingga mekanika kuantum plus konfigurasi elektron) untuk siswa SMA kelas X (Fase E), dengan dasbor untuk guru. Web juga merekam data belajar untuk penelitian pendidikan kimia.

- **Pengguna**: siswa (mayoritas lewat smartphone), guru (kelola kelas), peneliti/admin (ekspor data).
- **Bahasa antarmuka dan konten**: Indonesia saja.
- **Pendekatan pedagogis**: multipel representasi (makroskopik, submikroskopik, simbolik) pada setiap model atom; alur berbasis sejarah sains.

## 2. Prinsip Utama

1. **Mobile-first dan hemat kuota.** Halaman inti harus cepat dimuat di jaringan lambat. Simulasi 3D dimuat bertahap (lazy loading) dan didahului peringatan ukuran data.
2. **Akurasi konsep kimia lebih penting daripada tampilan.** Jangan membuat visual yang memperkuat miskonsepsi (misalnya elektron sebagai bola yang mengorbit seperti planet pada model kuantum). Setiap model harus menampilkan keterbatasannya.
3. **Satu konsep per layar**, bahasa sederhana, istilah teknis dijelaskan lewat glosarium atau tooltip.
4. **Data penelitian harus bersih dan lengkap.** Setiap interaksi yang tercantum di bagian 6 direkam secara konsisten.
5. **Kerjakan bertahap.** Ikuti tahapan rilis di bagian 8; jangan membangun fitur Tahap 3 sebelum Tahap 1 stabil.

## 3. Tumpukan Teknologi (Usulan, belum final)

Konfirmasi dulu dengan pemilik proyek sebelum mengunci pilihan.

| Lapisan | Usulan |
|---|---|
| Frontend | Web app responsif; WebGL (misalnya three.js) untuk simulasi 3D |
| Backend | Server aplikasi dengan autentikasi dan API |
| Basis data | Relasional (akun, kelas, jawaban, log interaksi) |
| AI | LLM dengan RAG, korpus hanya materi model atom di web ini |
| Hosting | Cloud skala menengah untuk uji coba beberapa kelas |

## 4. Struktur Fitur

### 4.1 Konten
- Beranda berisi peta alur belajar kronologis.
- Satu halaman per model: Democritus, Dalton, Thomson, Rutherford, Bohr, (Sommerfeld opsional), mekanika kuantum, ditambah konfigurasi elektron (Aufbau, Pauli, Hund).
- Halaman perbandingan antarmodel, timeline, profil tokoh, glosarium dan referensi, galeri video/animasi.

### 4.2 Simulasi
- Simulasi 3D atom interaktif (putar, zoom) untuk tiap model, termasuk orbital.
- Simulasi eksperimen: tabung sinar katoda (Thomson) dan hamburan sinar alfa (Rutherford).
- Drag-and-drop proton, neutron, elektron.
- Slider parameter: nomor atom, tingkat energi, transisi elektron Bohr.

### 4.3 Evaluasi
- Kuis pilihan ganda per model dengan umpan balik otomatis.
- Tes diagnostik miskonsepsi bertingkat (two-tier atau three-tier), umpan balik otomatis.
- Rekap hasil per siswa dan ringkasan miskonsepsi.

### 4.4 AI
- Chatbot **dibatasi pada materi model atom di web ini** (RAG). Pertanyaan di luar cakupan ditolak dan diarahkan kembali.
- Rekomendasi materi otomatis berdasarkan hasil kuis dan tes diagnostik.

### 4.5 Akun dan Kelas
- Akun lengkap untuk guru dan siswa.
- Guru membuat kelas dan kode kelas; siswa bergabung dengan kode.
- Dasbor guru: rekap per siswa, per butir, per kelas. Dasbor siswa: progres, riwayat skor, rekomendasi.
- Admin/peneliti dapat mengekspor data (CSV/Excel).

## 5. Aturan Teknis dan Keamanan

- Kata sandi di-hash dengan algoritma standar (bcrypt atau argon2); jangan menyimpan kata sandi mentah.
- Kontrol akses berbasis peran: siswa hanya melihat datanya sendiri, guru hanya melihat kelasnya, admin melihat semua.
- Validasi dan sanitasi semua input; lindungi dari injeksi SQL, XSS, dan CSRF.
- Kunci API dan rahasia disimpan di variabel lingkungan, tidak boleh masuk repositori.
- Batasi penggunaan chatbot per akun untuk mengendalikan biaya API; cache jawaban umum.
- Aksesibilitas: kontras warna memadai, ukuran huruf terbaca, teks alternatif pada gambar.
- Kompatibel dengan Chrome, Firefox, Edge, dan Safari versi modern tanpa instalasi tambahan.
- Optimasi aset: kompres gambar, model 3D berukuran kecil, tunda pemuatan yang tidak perlu.

## 6. Data Penelitian yang Wajib Direkam

| Kode | Data |
|---|---|
| D-01 | Skor kuis dan tes diagnostik |
| D-02 | Waktu belajar per halaman dan per simulasi |
| D-03 | Jejak klik (navigasi dan interaksi simulasi) |
| D-04 | Jawaban per butir soal (untuk analisis butir, misalnya IRT/Rasch) |

Pedoman: gunakan ID pengguna (bukan nama) pada tabel log; simpan stempel waktu pada setiap peristiwa; pastikan ekspor mudah dimuat ke jamovi atau Excel (satu baris per respons, kolom jelas).

## 7. Gaya Desain

- Perpaduan *playful* (warna cerah, gamifikasi ringan seperti lencana dan progres) dan tema sains/futuristik (nuansa laboratorium digital).
- Pastikan tetap terbaca dan tidak mengganggu pemahaman konsep.
- Alur siswa: masuk, gabung kelas, belajar per model, coba simulasi, kuis dan tes diagnostik, lihat umpan balik dan rekomendasi.
- Alur guru: masuk, buat kelas, bagikan kode, pantau dasbor, ekspor rekap.

## 8. Tahapan Pengerjaan

1. **Tahap 1 (inti)**: akun dan kelas, materi per model, simulasi dasar, kuis, tes diagnostik, perekaman data, ekspor.
2. **Tahap 2**: simulasi 3D penuh dan eksperimen klasik, halaman perbandingan, timeline, galeri.
3. **Tahap 3**: chatbot RAG, rekomendasi materi otomatis, penyempurnaan dasbor.

Selesaikan dan uji setiap tahap sebelum lanjut. Setelah tiap tahap, ringkas apa yang sudah jadi, apa yang belum, dan keputusan yang perlu dikonfirmasi.

## 9. Di Luar Cakupan (Versi 1.0)

- Aplikasi native Android/iOS.
- Versi bahasa Inggris.
- Materi di luar struktur atom (ikatan kimia, tabel periodik lanjutan).
- Halaman persetujuan penelitian (informed consent) di dalam web.
- Desain uji coba penelitian (pre-test/post-test, n-gain).

Jangan menambahkan hal-hal ini tanpa permintaan eksplisit.

## 10. Hal yang Harus Ditanyakan, Bukan Diasumsikan

- Pemilihan teknologi final dan anggaran.
- Apakah model Sommerfeld dimasukkan.
- Format dan jumlah butir tes diagnostik (two-tier atau three-tier).
- Sumber konten (teks, gambar, animasi) dan hak ciptanya. Jangan memakai gambar atau teks berhak cipta tanpa izin.
- Isi konten kimia: minta peneliti atau ahli materi memverifikasi penjelasan tiap model sebelum dirilis.

## 11. Aturan Bekerja untuk Agent

- Jelaskan rencana singkat sebelum perubahan besar.
- Tulis kode yang mudah dibaca, dengan komentar seperlunya dan penamaan konsisten.
- Tambahkan pengujian untuk logika penting (autentikasi, hak akses, penilaian kuis, perekaman data).
- Jika kebutuhan ambigu atau bertentangan dengan `PRD.md`, berhenti dan tanyakan.
- Jangan menyimpan data siswa nyata atau rahasia di kode, contoh data, atau log.
- Catatan etika: persetujuan penelitian tidak ditangani di web ini, tetapi pemilik proyek perlu memastikannya lewat jalur lain (izin sekolah, persetujuan orang tua/wali) sesuai ketentuan institusi.
