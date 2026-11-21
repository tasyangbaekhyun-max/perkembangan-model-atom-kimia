import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  type Auth,
} from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

// Konfigurasi Firebase dari environment variables Vite (.env.local)
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY?.trim() || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN?.trim() || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID?.trim() || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET?.trim() || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID?.trim() || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID?.trim() || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID?.trim() || '',
}

/**
 * Memeriksa apakah kredensial Firebase telah diisi dengan benar di .env.local
 */
export function isFirebaseConfigured(): boolean {
  const { apiKey, projectId, appId } = firebaseConfig
  if (!apiKey || !projectId) return false
  if (apiKey.includes('...Contoh') || apiKey.includes('your_api_key')) return false
  if (projectId.includes('nama-project') || projectId.includes('your_project')) return false
  return Boolean(apiKey && projectId && (appId || true))
}

let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null
let googleProvider: GoogleAuthProvider | null = null

if (isFirebaseConfigured()) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    auth = getAuth(app)
    db = getFirestore(app)
    
    googleProvider = new GoogleAuthProvider()
    googleProvider.setCustomParameters({
      prompt: 'select_account',
    })
  } catch (error) {
    console.warn('[Firebase] Inisialisasi Firebase gagal, sistem beralih ke mode offline/lokal:', error)
  }
}

/**
 * Menerjemahkan kode galat Firebase Auth ke pesan bahasa Indonesia yang ramah pengguna
 */
export function mapFirebaseAuthError(error: any): string {
  const code = error?.code || ''
  const message = error?.message || ''

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'Email atau kata sandi salah. Silakan periksa kembali akun Anda.'
    case 'auth/user-not-found':
      return 'Akun dengan email ini tidak ditemukan. Silakan lakukan pendaftaran terlebih dahulu.'
    case 'auth/email-already-in-use':
      return 'Email ini sudah terdaftar! Silakan langsung masuk menggunakan email dan kata sandi Anda.'
    case 'auth/weak-password':
      return 'Kata sandi terlalu lemah. Gunakan minimal 6 karakter.'
    case 'auth/invalid-email':
      return 'Format alamat email tidak valid. Masukkan email yang benar.'
    case 'auth/popup-closed-by-user':
      return 'Jendela masuk Google ditutup sebelum proses selesai. Silakan coba kembali.'
    case 'auth/cancelled-popup-request':
      return 'Permintaan masuk dibatalkan karena ada proses masuk lain yang sedang berjalan.'
    case 'auth/popup-blocked':
      return 'Jendela popup Google diblokir oleh browser. Harap izinkan popup di peramban Anda.'
    case 'auth/too-many-requests':
      return 'Terlalu banyak percobaan gagal. Akses dibatasi sementara demi keamanan. Coba lagi dalam beberapa menit.'
    case 'auth/network-request-failed':
      return 'Gagal terhubung ke server Firebase. Periksa koneksi internet Anda.'
    case 'auth/user-disabled':
      return 'Akun pengguna ini telah dinonaktifkan oleh administrator.'
    case 'auth/operation-not-allowed':
      return 'Metode masuk ini belum diaktifkan di Firebase Console. Harap aktifkan Authentication provider (Email/Google) di Firebase Console.'
    default:
      if (message.includes('API key not valid')) {
        return 'API Key Firebase tidak valid. Harap periksa kembali VITE_FIREBASE_API_KEY di file .env.local Anda.'
      }
      return message || 'Terjadi kendala pada layanan autentikasi. Silakan coba lagi.'
  }
}

export { app, auth, db, googleProvider }
