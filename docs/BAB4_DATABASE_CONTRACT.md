# KONTRAK SISTEM, BASIS DATA BAB 4, DAN LAMPIRAN B

*Dokumentasi Teknis Perancangan Sistem, Basis Data Relasional, dan Skema Penyimpanan Klien*  
*Web Pembelajaran Model-Model Atom (AtomLab)*  
*Target: Kurikulum Merdeka - Kimia Fase E (Kelas X SMA)*

---

## 1. Pendahuluan

Dokumen ini mendefinisikan kontrak teknis antara:
1. **Lampiran B**: Skema penyimpanan lokal pada sisi peramban klien (`localStorage`) untuk sesi tamu (*guest space*) dan pengerjaan kuis bertahap (*mastery learning*).
2. **Bab 4 (Perancangan Sistem & Basis Data)**: Skema basis data relasional di peladen (*backend*) dan kontrak antarmuka pemrograman aplikasi (API) untuk autentikasi, pengumpulan data penelitian, dan pelaporan diagnostik.

---

## 2. Spesifikasi Lampiran B (Penyimpanan Sisi Klien / LocalStorage)

### 2.1 Ruang Lingkup dan Partisi Kunci
Penyimpanan klien beroperasi di bawah ruang tamu (*guest space*) tanpa keharusan membuat akun terlebih dahulu, dengan kunci terstruktur:

| Kunci Penyimpanan | Tipe Data | Deskripsi |
|---|---|---|
| `atomlab_lampiran_b_guest_id` | String (`GST-xxxx`) | Pengenal unik sesi perangkat tamu |
| `atomlab_lampiran_b_active_session` | JSON Object (`QuizAttemptSession`) | Sesi pengerjaan aktif: memuat `attemptId`, `questionVersion`, `draftAnswers`, `frozenQuestions`, dan `itemResponses` |
| `atomlab_lampiran_b_final_score_history` | JSON Array (`FinalScoreHistory[]`) | Riwayat skor akhir percobaan yang telah tuntas (terpisah dari draf) |

### 2.2 Struktur Objek Sesi Aktif (`QuizAttemptSession`)
```typescript
interface QuizAttemptSession {
  attemptId: string              // ID percobaan unik (contoh: ATT-mh9x2-K89A)
  guestSessionId: string         // ID tamu (contoh: GST-mh9x2-7X1B)
  questionVersion: string        // Versi instrumen (contoh: "v1.0.0-fase-e")
  createdAt: string              // ISO 8601 timestamp awal mulai
  updatedAt: string              // ISO 8601 timestamp interaksi terakhir
  isCompleted: boolean           // Status ketuntasan seluruh 10 butir
  completedAt?: string           // ISO 8601 timestamp saat tuntas
  currentQuestionIndex: number   // Indeks butir soal aktif (0 - 9)
  draftAnswers: Record<number, any> // Draf pilihan per nomor butir
  frozenQuestions: Record<number, boolean> // Status pembekuan jawaban sebelum/saat pembahasan
  itemResponses: Record<number, ItemResponseRecord> // Rekaman jawaban per butir
  firstAttemptScore: number      // Skor percobaan pertama murni (0 - 100)
  masteryScore: number           // Skor ketuntasan setelah bimbingan (0 - 100)
}
```

### 2.3 Aturan Integritas dan Keamanan Penyimpanan Klien
1. **Penanganan Storage Ditolak**: Semua pemanggilan `localStorage.setItem` dibungkus dalam blok `try...catch`. Jika browser berada dalam mode *Private/Incognito* ketat atau storage kuota habis (`QuotaExceededError`), sistem beralih otomatis ke *in-memory session* dan menampilkan peringatan transparan tanpa membohongi pengguna seolah berhasil tersimpan di disk.
2. **Penanganan JSON Rusak**: Jika terjadi kerusakan data pada `localStorage`, parser akan menangkap galat, menginisialisasi ulang sesi bersih, dan mencatat galat pemulihan.
3. **Pemisahan Draf vs Skor Akhir**: Saat pengguna mengulang pengerjaan, sistem mengalokasikan `attemptId` baru, mengosongkan draf, tetapi **skor terakhir tetap dipertahankan** pada riwayat terpisah (`final_score_history`).
4. **Pemisahan Reset Draf vs Hapus Riwayat**:
   - *Reset Draf*: Hanya mengosongkan pilihan pada sesi aktif saat ini.
   - *Hapus Riwayat Perangkat*: Memerlukan dialog konfirmasi terpisah sebelum menghapus seluruh data lokal.

---

## 3. Kontrak API Peladen (Bab 4.1)

### 3.1 Alokasi Sesi Tamu (Guest Session)
- **Endpoint**: `POST /api/v1/auth/guest-session`
- **Request Body**:
```json
{
  "clientGuestId": "GST-mh9x2-7X1B",
  "deviceInfo": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)..."
}
```
- **Response (200 OK)**:
```json
{
  "guestSessionId": "GST-mh9x2-7X1B",
  "role": "guest",
  "allocatedAt": "2026-11-03T07:15:00.000Z",
  "expiresAt": "2026-11-10T07:15:00.000Z"
}
```

### 3.2 Login Siswa / Guru Terdaftar
- **Endpoint**: `POST /api/v1/auth/login`
- **Request Body**:
```json
{
  "email": "siswa@sekolah.sch.id",
  "passwordHash": "$2b$10$e8w...",
  "classCode": "KIM-X-FASE-E"
}
```
- **Response (200 OK)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "usr_99812",
    "name": "Budi Santoso",
    "email": "siswa@sekolah.sch.id",
    "role": "student",
    "classCode": "KIM-X-FASE-E",
    "schoolName": "SMA Negeri 1 Jakarta",
    "createdAt": "2026-10-24T10:00:00.000Z",
    "lastLoginAt": "2026-11-03T07:00:00.000Z"
  },
  "expiresAt": "2026-11-04T07:00:00.000Z"
}
```

---

## 4. Kontrak Pengiriman Data Riset (Bab 4.2 - D-01 s.d D-04)

- **Endpoint**: `POST /api/v1/research/quiz-submissions`
- **Request Body Payload**:
```json
{
  "submissionId": "SUB-20261103-001",
  "attemptId": "ATT-mh9x2-K89A",
  "guestSessionId": "GST-mh9x2-7X1B",
  "userId": "usr_99812",
  "classCode": "KIM-X-FASE-E",
  "questionVersion": "v1.0.0-fase-e",
  "totalQuestions": 10,
  "firstAttemptScore": 80,
  "masteryScore": 100,
  "totalAttemptsMade": 12,
  "startedAt": "2026-11-03T07:05:00.000Z",
  "completedAt": "2026-11-03T07:20:00.000Z",
  "itemResponses": [
    {
      "questionId": 1,
      "questionType": "multiple_choice",
      "firstAnswer": 1,
      "finalAnswer": 1,
      "attemptsCount": 1,
      "isCorrect": true,
      "firstAttemptCorrect": true,
      "durationSeconds": 45,
      "submittedAt": "2026-11-03T07:05:45.000Z"
    }
  ],
  "telemetry": {
    "browserAgent": "Chrome/130.0",
    "screenResolution": "1920x1080",
    "inputMethod": "keyboard",
    "storageMode": "localStorage"
  }
}
```

---

## 5. Skema Relasional Basis Data (DDL PostgreSQL / MySQL - Bab 4)

```sql
-- 1. TABEL PENGGUNA
CREATE TABLE users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    email VARCHAR(128) UNIQUE,
    password_hash VARCHAR(255),
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'teacher', 'admin', 'guest')),
    school_name VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- 2. TABEL KELAS
CREATE TABLE classes (
    code VARCHAR(32) PRIMARY KEY,
    teacher_id VARCHAR(64) REFERENCES users(id),
    name VARCHAR(128) NOT NULL,
    grade_level VARCHAR(32) DEFAULT 'Fase E (Kelas X)',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABEL PERCOBAAN KUIS (QUIZ ATTEMPTS - D-01)
CREATE TABLE quiz_attempts (
    id VARCHAR(64) PRIMARY KEY,
    guest_id VARCHAR(64),
    user_id VARCHAR(64) REFERENCES users(id),
    class_code VARCHAR(32) REFERENCES classes(code),
    question_version VARCHAR(32) NOT NULL,
    first_attempt_score NUMERIC(5,2) NOT NULL,
    mastery_score NUMERIC(5,2) NOT NULL,
    total_attempts_count INT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 4. TABEL RESPON PER BUTIR (ITEM RESPONSES - D-04 untuk Rasch / IRT)
CREATE TABLE item_responses (
    id BIGSERIAL PRIMARY KEY,
    attempt_id VARCHAR(64) REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    question_id INT NOT NULL,
    question_type VARCHAR(32) NOT NULL,
    first_answer JSONB NOT NULL,
    final_answer JSONB NOT NULL,
    attempts_count INT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    first_attempt_correct BOOLEAN NOT NULL,
    duration_seconds INT,
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- 5. TABEL LOG INTERAKSI & TELEMETRI (D-02 & D-03)
CREATE TABLE telemetry_logs (
    id BIGSERIAL PRIMARY KEY,
    attempt_id VARCHAR(64),
    guest_id VARCHAR(64),
    event_type VARCHAR(64) NOT NULL,
    event_payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

