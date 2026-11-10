# DOKUMEN ALUR PENGGUNA (USER FLOW) ATOMLAB
*Media Pembelajaran Model-Model Atom & Sistem Evaluasi Terintegrasi Bab 4*  
*Target: Siswa SMA Kelas X (Fase E) & Guru Kimia*

---

## 1. Ikhtisar Alur Pengguna Utama

AtomLab dirancang dengan prinsip **inklusivitas akses** dan **keandalan data riset**:
1. **Belajar Tanpa Login**: Siswa dapat langsung mengeksplorasi seluruh materi, visualisasi 3D, laboratorium simulasi sejarah, perbandingan, hingga mengerjakan kuis evaluasi 10 butir sebagai tamu (*Guest Mode*).
2. **Akun Kelas & Masuk dengan Google**: Siswa dapat masuk menggunakan Google untuk merekam hasil ke akun kelas, di mana identitas kelas memakai alias dari `getAccess()`.
3. **Pemisahan Hasil Tamu & Perangkat Bersama**: Ketika pengguna masuk dengan Google, sistem **tidak secara otomatis mengklaim** hasil perangkat sebelumnya, melainkan menyajikan dialog konfirmasi eksplisit (*Claim vs Start Fresh*).
4. **Offline-First & Penyimpanan Sebelum Jaringan**: Setiap draf jawaban dan skor akhir selalu disimpan ke penyimpanan lokal peramban sebelum permintaan jaringan dikirim.
5. **Integritas ID Percobaan**: Percobaan ulang (*Retry / Coba Kirim Lagi*) mempertahankan `attemptId` yang sama. Percobaan baru menghasilkan `attemptId` baru.
6. **Proteksi Pergantian Akun**: Respons jaringan lama yang tertunda akan diabaikan jika akun aktif telah beralih.
7. **Privasi & Keamanan**: Token otentikasi dan email siswa tidak pernah dicetak ke konsol log atau antarmuka hasil.

---

## 2. Diagram Alur Pengguna (Mermaid)

```mermaid
flowchart TD
    Start([Buka Web AtomLab]) --> CheckAuth{Apakah Sudah Login?}
    
    CheckAuth -- Belum Login --> GuestMode[Mode Tamu: Belajar Tanpa Login]
    CheckAuth -- Sudah Login --> UserMode[Mode Akun Siswa: getAccess Alias]

    GuestMode --> Explore[Eksplorasi Materi, Simulasi & Kuis 10 Soal]
    UserMode --> Explore

    Explore --> QuizSubmit[Selesai Kuis: Simpan Lokal Terlebih Dahulu]
    
    QuizSubmit --> SendDecision{Status Autentikasi Saat Kirim}
    
    SendDecision -- Tamu --> LocalStatus[Status: 'lokal' Tersimpan di Perangkat]
    LocalStatus --> SaveToAccountBtn[Klik 'Simpan ke Akun' / 'Masuk dengan Google']
    
    SaveToAccountBtn --> GoogleAuth[Masuk dengan Google]
    GoogleAuth --> GuestDialog{Tawarkan Pemilihan Hasil Tamu}
    GuestDialog -- Tautkan ke Akun -->> ClaimResults[Klaim Hasil Tamu ke Akun Aktif]
    GuestDialog -- Mulai Bersih -->> FreshSession[Sesi Baru Akun Aktif]
    
    SendDecision -- Akun Terdaftar --> NetSend[Kirim ke Basis Data Riset Bab 4]
    ClaimResults --> NetSend
    
    NetSend --> StatusWait[Status: 'menunggu kirim']
    StatusWait --> NetResult{Hasil Respons Jaringan}
    
    NetResult -- Sukses --> StatusSuccess[Status: 'terkirim']
    NetResult -- Gagal/Offline --> StatusFail[Status: 'gagal']
    
    StatusFail --> RetryBtn[Klik 'Coba Kirim Lagi' - attemptId Tetap Sama]
    RetryBtn --> NetSend

    UserMode --> LogoutClick[Klik 'Keluar']
    LogoutClick --> LogoutModal{Peringatan Data Belum Terkirim & Perangkat Bersama}
    LogoutModal -- Keluar Simpan Lokal --> KeepLocal[Logout - Data Tersimpan Aman]
    LogoutModal -- Keluar & Bersihkan --> WipeDevice[Konfirmasi - Bersihkan Data Perangkat]
```

---

## 3. Rincian Alur Langkah demi Langkah

### 3.1 Alur Belajar Tanpa Login (Guest Mode)
- Siswa membuka web dan dapat langsung mengakses menu beranda, garis waktu perkembangan 6 model atom, perbandingan, hingga kuis diagnostik.
- Seluruh interaksi tersimpan di partisi lokal tamu (`atomlab_acc_guest_*`).
- Di navbar dan ringkasan skor, siswa melihat lencana status: `Tamu (Tanpa Login)`.

### 3.2 Alur Masuk dengan Google & Resolusi Perangkat Bersama
1. Siswa menekan tombol **"Masuk dengan Google"** di navbar atau kartu kuis.
2. SDK memproses autentikasi dan listener sesi SDK (`onAuthStateChanged`) memperbarui ID akun aktif.
3. **Pendeteksian Hasil Tamu**:
   - Jika di perangkat ditemukan hasil kuis tamu yang belum terhubung, dialog modal resolusi akan muncul:
     > *"Ditemukan Hasil Kuis Sesi Tamu di Perangkat Ini. Apakah hasil ini milik Anda dan ingin disimpan ke akun Anda, atau abaikan dan mulai sesi baru untuk akun Anda?"*
   - **Pilihan 1: "Tautkan Hasil Tamu ke Akun Saya"** ➔ Data sesi dan skor tamu dipindahkan ke ruang akun aktif siswa, siap dikirim.
   - **Pilihan 2: "Biarkan Terpisah / Mulai Sesi Baru"** ➔ Akun siswa memulai sesi kosong yang bersih; data tamu tetap aman di slotnya.

### 3.3 Alur Pengiriman, Retry, dan Status Evaluasi
Status hasil kuis disajikan dengan 4 teks baku yang akurat:
* **`lokal`**: Draf dan hasil tersimpan aman di penyimpanan perangkat peramban, belum terhubung ke peladen riset.
* **`menunggu kirim`**: Sistem sedang mengirimkan berkas muatan riset Bab 4 ke endpoint `/api/v1/research/quiz-submissions`.
* **`terkirim`**: Berkas riset berhasil divalidasi dan dicatat di basis data peladen.
* **`gagal`**: Jaringan terputus atau peladen belum merespons. Tombol **"Coba Kirim Lagi"** aktif.

**Aturan ID Percobaan**:
- Saat menekan **"Coba Kirim Lagi"**, sistem **mempertahankan `attemptId` yang sama** untuk mencegah duplikasi data responden pada analisis butir IRT/Rasch.
- Saat menekan **"Mulai Percobaan Ulang"** (mengerjakan kuis dari nomor 1 lagi), sistem mengalokasikan **`attemptId` baru**.

### 3.4 Proteksi Pergantian Akun (Race Condition Guard)
- Setiap permintaan jaringan mencatat ID akun pengirim.
- Ketika respons tiba, sistem memeriksa apakah ID akun aktif saat ini masih cocok dengan ID akun pengirim.
- Jika pengguna telah berganti akun atau keluar sebelum respons selesai, respons lama **diabaikan secara aman** sehingga tidak mencemari ruang akun yang baru.

### 3.5 Alur Keluar (Logout) & Perangkat Bersama
Saat siswa menekan tombol **"Keluar"**:
1. Sistem menghitung apakah ada berkas yang berstatus `menunggu kirim` atau `gagal`.
2. Jika ada data belum terkirim, modal menampilkan peringatan tegas agar siswa mengetahui status datanya.
3. Menjelaskan skenario komputer/tablet bersama di sekolah/laboratorium:
   - *"Keluar Saja (Pertahankan Data di Perangkat Ini)"*: Untuk perangkat pribadi siswa.
   - *"Keluar & Bersihkan Data Perangkat"* (dengan konfirmasi): Untuk perangkat umum laboratorium sekolah guna melindungi privasi siswa.

