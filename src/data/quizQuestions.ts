import type { QuizQuestion } from '../types/quiz'

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // SOAL 1: Pilihan Ganda (Democritus)
  {
    id: 1,
    type: 'multiple_choice',
    title: 'Gagasan Awal Materi (Democritus)',
    question: 'Kata "Atomos" pertama kali dicetuskan oleh filsuf Yunani Kuno Democritus (±400 SM). Berdasarkan asal katanya, apa makna hakiki dari istilah "Atomos"?',
    options: [
      'Partikel bermuatan netral yang mengelilingi inti ruang hampa.',
      'Partikel materi terkecil yang pejal, padat, dan tidak dapat dipotong atau dibagi lagi.',
      'Gelombang energi tak kasat mata yang dapat memancarkan cahaya diskret.',
      'Zat cair dasar yang mengisi seluruh alam semesta secara kontinu.'
    ],
    correctAnswer: 1,
    hint: 'Perhatikan arti awalan kata Yunani "a-" (artinya tidak) dan "tomos" (artinya terbagi atau terpotong). Democritus belum mengenal adanya inti atom atau gelombang energi, ia fokus pada batas fisik pemotongan materi padat.',
    explanation: 'Istilah "Atomos" berasal dari kata Yunani "a" (tidak) dan "tomos" (terbagi/terpotong). Democritus menyimpulkan bahwa materi tidak dapat dipotong tanpa batas, melainkan memiliki batas partikel fundamental yang tak dapat dibagi lagi.'
  },

  // SOAL 2: Pilihan Ganda (Dalton)
  {
    id: 2,
    type: 'multiple_choice',
    title: 'Hukum Stoikiometri Dalton',
    question: 'Unsur Karbon (C) dan Oksigen (O) dapat membentuk dua senyawa berbeda: Karbon Monoksida (CO) dan Karbon Dioksida (CO₂). Fenomena ini merupakan bukti kuat dari hukum dasar kimia yang dirumuskan oleh Dalton, yaitu...',
    options: [
      'Hukum Kekekalan Energi Mekanik.',
      'Hukum Perbandingan Berganda (Hukum Dalton).',
      'Hukum Gas Ideal Gay-Lussac.',
      'Hukum Ketidakpastian Heisenberg.'
    ],
    correctAnswer: 1,
    hint: 'Perhatikan bahwa jika massa C dibuat tetap (12 g), maka perbandingan massa Oksigen pada CO (16 g) dan CO₂ (32 g) adalah 1 : 2 (bilangan bulat sederhana). Hukum ini mengatur jika dua unsur membentuk lebih dari satu senyawa.',
    explanation: 'Hukum Perbandingan Berganda Dalton menyatakan bahwa jika dua unsur dapat membentuk lebih dari satu senyawa, maka massa salah satu unsur yang bergabung dengan massa tertentu unsur lain akan berbanding sebagai bilangan bulat dan sederhana (pada CO dan CO₂, perbandingan massa O adalah 1 : 2).'
  },

  // SOAL 3: Menjodohkan (Tokoh & Eksperimen Kunci)
  {
    id: 3,
    type: 'matching',
    title: 'Menjodohkan: Tokoh Ilmuwan & Landasan Eksperimennya',
    instruction: 'Pasangkan setiap tokoh ilmuwan di kolom kiri dengan eksperimen atau penemuan kuncinya di kolom kanan dengan benar!',
    pairs: [
      {
        id: 'p1',
        left: 'J.J. Thomson',
        right: 'Tabung Sinar Katoda (CRT) & Penemuan Elektron'
      },
      {
        id: 'p2',
        left: 'Ernest Rutherford',
        right: 'Hamburan Sinar Alfa pada Lempeng Emas Tipis'
      },
      {
        id: 'p3',
        left: 'Niels Bohr',
        right: 'Spektrum Emisi Gas Hidrogen & Kuantisasi Energi'
      },
      {
        id: 'p4',
        left: 'Erwin Schrödinger',
        right: 'Persamaan Gelombang Kuantum & Probabilitas Orbital'
      }
    ],
    hint: 'Ingat kembali instrumen masing-masing ilmuwan: Tabung kaca vakum sinar katoda identik dengan Thomson; penembakan partikel alfa lempeng emas tipis identik dengan Rutherford; spektrum warna garis gas hidrogen identik dengan Bohr; dan persamaan diferensial gelombang kuantum identik dengan Schrödinger.',
    explanation: 'Setiap model atom dibangun di atas eksperimen revolusioner: Thomson menemukan elektron lewat CRT, Rutherford menemukan inti atom lewat hamburan partikel alfa, Bohr menjelaskan spektrum garis hidrogen, dan Schrödinger merumuskan mekanika gelombang kuantum.'
  },

  // SOAL 4: Pilihan Ganda (Thomson)
  {
    id: 4,
    type: 'multiple_choice',
    title: 'Netralitas Model Roti Kismis Thomson',
    question: 'Pada model atom "Roti Kismis" (Plum Pudding) yang diajukan oleh J.J. Thomson pada tahun 1897, bagaimana kondisi kelistrikan atom dijaga agar bersifat netral?',
    options: [
      'Jumlah muatan positif pada inti atom diimbangi oleh proton di kulit atom.',
      'Elektron bermuatan negatif bergerak dengan kecepatan tinggi sehingga menetralkan muatan positif inti.',
      'Muatan positif berupa bola materi menyebar (diffuse) yang jumlahnya persis sama besar dengan total muatan negatif elektron yang tertanam di dalamnya.',
      'Neutron di ruang hampa menetralkan muatan positif dan negatif.'
    ],
    correctAnswer: 2,
    hint: 'Ingat analogi buah semangka atau roti kismis. Thomson belum menemukan inti atom (karena inti baru ditemukan 14 tahun kemudian oleh Rutherford). Muatan positif pada model Thomson bukanlah partikel padat di tengah, melainkan fluida atau bola materi yang mengisi seluruh volume atom.',
    explanation: 'Thomson membayangkan atom sebagai bola bermuatan positif yang homogen dan menyebar, dengan elektron-elektron bermuatan negatif tertanam merata di dalamnya sedemikian rupa sehingga total muatannya netral: Σ(+) = Σ(-). Pada masa Thomson, inti atom belum ditemukan.'
  },

  // SOAL 5: Drag and Drop Klasifikasi (Thomson vs Rutherford)
  {
    id: 5,
    type: 'drag_drop_classify',
    title: 'Drag and Drop: Klasifikasi Karakteristik Model Thomson vs Rutherford',
    instruction: 'Seret (atau klik) kartu karakteristik di bawah ini, lalu tempatkan ke dalam wadah model atom yang tepat!',
    categories: [
      {
        id: 'cat_thomson',
        title: 'Model Thomson (Roti Kismis)',
        badge: '1897 • Tanpa Inti',
        borderColor: 'border-emerald-300',
        bgColor: 'bg-emerald-50/70'
      },
      {
        id: 'cat_rutherford',
        title: 'Model Rutherford (Inti Atom)',
        badge: '1911 • Ruang Hampa',
        borderColor: 'border-purple-300',
        bgColor: 'bg-purple-50/70'
      }
    ],
    items: [
      {
        id: 'i1',
        text: 'Elektron terbenam merata dalam bola materi bermuatan positif',
        targetCategoryId: 'cat_thomson'
      },
      {
        id: 'i2',
        text: 'Seluruh muatan positif terkonsentrasi di sebuah inti yang sangat kecil di pusat',
        targetCategoryId: 'cat_rutherford'
      },
      {
        id: 'i3',
        text: 'Sebagian besar volume atom (>99.99%) merupakan ruang hampa (empty space)',
        targetCategoryId: 'cat_rutherford'
      },
      {
        id: 'i4',
        text: 'Muatan positif mengisi seluruh volume atom seperti daging pada buah semangka',
        targetCategoryId: 'cat_thomson'
      }
    ],
    hint: 'Ciri pembeda utama: Model Thomson tidak memiliki inti padat (muatan positif menyebar di seluruh ruang bola seperti daging buah semangka dengan elektron tertanam). Sedangkan Rutherford menemukan bahwa muatan positif terpusat di sebuah inti atom pejal yang amat kecil di tengah ruang hampa luas.',
    explanation: 'Model Thomson memandang muatan positif menyebar di seluruh volume atom tanpa inti padat. Sebaliknya, Rutherford membuktikan bahwa muatan positif dan hampir seluruh massa atom terkonsentrasi pada inti yang amat kecil, sementara sisanya adalah ruang hampa.'
  },

  // SOAL 6: Pilihan Ganda (Kelemahan Rutherford / Paradoks Maxwell)
  {
    id: 6,
    type: 'multiple_choice',
    title: 'Kelemahan Rutherford & Paradoks Elektrodinamika Maxwell',
    question: 'Menurut teori elektrodinamika klasik Maxwell, muatan listrik yang bergerak dengan percepatan (seperti elektron yang berputar mengelilingi inti) harus terus-menerus memancarkan energi radiasi gelombang elektromagnetik. Konsekuensi dari hukum fisika klasik ini terhadap model atom Rutherford adalah...',
    options: [
      'Elektron akan semakin cepat dan meledakkan inti atom.',
      'Elektron akan kehilangan energi kinetik, lintasannya menyusut spiral, dan jatuh menabrak inti dalam waktu sekejap mata (atom runtuh).',
      'Elektron akan berubah menjadi neutron bermuatan netral.',
      'Inti atom akan membelah menjadi dua inti yang lebih ringan.'
    ],
    correctAnswer: 1,
    hint: 'Jika sebuah benda bermuatan terus memancarkan gelombang radiasi, energi totalnya akan terus berkurang. Jika elektron di orbit melingkar kehilangan energi, jari-jari lintasannya akan semakin kecil membentuk spiral ke dalam menuju inti positif yang menariknya.',
    explanation: 'Jika teori Maxwell berlaku secara klasik pada model Rutherford, elektron yang mengitari inti akan terus kehilangan energi dan spiral jatuh ke inti dalam tempo <10⁻⁸ detik. Namun dalam kenyataannya atom stabil! Paradoks inilah yang dipecahkan oleh Niels Bohr lewat kuantisasi orbit.'
  },

  // SOAL 7: Menjodohkan (Model Atom & Analogi Populer)
  {
    id: 7,
    type: 'matching',
    title: 'Menjodohkan: Model Atom & Analogi Populer Sehari-hari',
    instruction: 'Hubungkan setiap model atom di sebelah kiri dengan analogi visual populernya di sebelah kanan!',
    pairs: [
      {
        id: 'a1',
        left: 'Model John Dalton',
        right: 'Bola Biliar Pejal Keras'
      },
      {
        id: 'a2',
        left: 'Model J.J. Thomson',
        right: 'Roti Kismis / Buah Semangka'
      },
      {
        id: 'a3',
        left: 'Model Niels Bohr',
        right: 'Anak Tangga Stasioner'
      },
      {
        id: 'a4',
        left: 'Model Mekanika Kuantum',
        right: 'Awan Kabut / Kipas Angin Berputar Cepat'
      }
    ],
    hint: 'Ingat bentuk fisik dan analogi buku teks: Dalton = bola biliar pejal tak berongga; Thomson = roti dengan kismis bertaburan di dalamnya; Bohr = anak tangga terkuantisasi (hanya boleh berpijak di anak tangga tertentu); Mekanika Kuantum = awan kabut atau baling-baling kipas berputar kencang.',
    explanation: 'Analogi membantu memahami abstraksi: Dalton diibaratkan bola biliar pejal; Thomson roti kismis; Bohr anak tangga stasioner (elektron tidak bisa berada di antara anak tangga); dan Mekanika Kuantum awan kabut atau baling-baling kipas (hanya dapat ditentukan probabilitas densitasnya).'
  },

  // SOAL 8: Drag and Drop Urutan Kronologis (Sejarah Sains)
  {
    id: 8,
    type: 'drag_drop_order',
    title: 'Drag and Drop: Susun Urutan Kronologis Perkembangan Model Atom',
    instruction: 'Susunlah kartu model atom di bawah ini dari yang paling awal (sejarah paling kuno) hingga model modern mekanika kuantum!',
    correctOrder: [
      {
        id: 'ord_democritus',
        title: 'Gagasan Atomos Democritus',
        period: '± 400 SM',
        scientist: 'Democritus dari Abdera'
      },
      {
        id: 'ord_dalton',
        title: 'Model Bola Pejal Dalton',
        period: '1803',
        scientist: 'John Dalton'
      },
      {
        id: 'ord_thomson',
        title: 'Model Roti Kismis Thomson',
        period: '1897',
        scientist: 'J.J. Thomson'
      },
      {
        id: 'ord_rutherford',
        title: 'Model Inti Atom Rutherford',
        period: '1911',
        scientist: 'Ernest Rutherford'
      },
      {
        id: 'ord_bohr',
        title: 'Model Kuantisasi Orbit Bohr',
        period: '1913',
        scientist: 'Niels Bohr'
      },
      {
        id: 'ord_quantum',
        title: 'Model Awan Orbital Mekanika Kuantum',
        period: '1926 - sekarang',
        scientist: 'Schrödinger & Heisenberg'
      }
    ],
    hint: 'Perhatikan tahun perkembangan sejarah sains: Diawali dari zaman filsafat Yunani Kuno (400 SM) → Teori atom kimia pertama (1803) → Penemuan elektron (1897) → Penemuan inti atom (1911) → Kuantisasi orbit (1913) → Awan elektron kuantum (1926).',
    explanation: 'Garis waktu perkembangan model atom mencerminkan evolusi ilmiah: diawali Democritus (400 SM) → Dalton (1803) → Thomson (1897) → Rutherford (1911) → Bohr (1913) → Mekanika Kuantum (1926 - sekarang).'
  },

  // SOAL 9: Pilihan Ganda (Transisi Spektrum Bohr)
  {
    id: 9,
    type: 'multiple_choice',
    title: 'Transisi Spektrum Deret Balmer (Bohr)',
    question: 'Pada spektrum garis emisi gas hidrogen deret Balmer, terlihat garis merah terang (H-α) dengan panjang gelombang 656 nm. Menurut model Bohr, foton merah ini dipancarkan ketika elektron hidrogen berpindah tingkat energi dari...',
    options: [
      'Kulit n = 1 ke kulit n = 2 (menyerap energi foton ultraviolet).',
      'Kulit n = 3 ke kulit n = 2 (de-eksitasi memancarkan foton merah).',
      'Kulit n = 5 ke kulit n = 1 (emisi radiasi sinar-X).',
      'Kulit n = 2 keluar meninggalkan atom hidrogen selamanya.'
    ],
    correctAnswer: 1,
    hint: 'Deret Balmer pada spektrum cahaya tampak selalu melibatkan perpindahan elektron yang jatuh (de-eksitasi) menuju kulit kedua (n = 2). Warna merah memiliki energi terendah dan panjang gelombang terpanjang di antara deret Balmer, sehingga berasal dari kulit terdekat yaitu n = 3 ke n = 2.',
    explanation: 'Garis merah H-α (656 nm) pada deret Balmer dihasilkan saat elektron jatuh (de-eksitasi) dari kulit n = 3 ke kulit n = 2, melepaskan energi foton sebesar ΔE = E₃ - E₂ = 1.89 eV yang tepat berada pada spektrum cahaya tampak merah.'
  },

  // SOAL 10: Drag and Drop Klasifikasi (Orbital s vs Orbital p)
  {
    id: 10,
    type: 'drag_drop_classify',
    title: 'Drag and Drop: Karakteristik Bentuk Orbital s vs Orbital p',
    instruction: 'Tempatkan karakteristik bentuk dan sifat orbital di bawah ini ke wadah orbital yang sesuai!',
    categories: [
      {
        id: 'cat_orb_s',
        title: 'Orbital s (Bilangan Azimut l = 0)',
        badge: 'Bentuk Bola Simetris',
        borderColor: 'border-blue-300',
        bgColor: 'bg-blue-50/70'
      },
      {
        id: 'cat_orb_p',
        title: 'Orbital p (Bilangan Azimut l = 1)',
        badge: 'Bentuk Balon Terpilin / Dumbbell',
        borderColor: 'border-cyan-300',
        bgColor: 'bg-cyan-50/70'
      }
    ],
    items: [
      {
        id: 'orb_i1',
        text: 'Berbentuk bola simetris konsentris (spherical) di sekeliling inti',
        targetCategoryId: 'cat_orb_s'
      },
      {
        id: 'orb_i2',
        text: 'Berbentuk dua balon terpilin (cuping / dumbbell) yang saling berhadapan',
        targetCategoryId: 'cat_orb_p'
      },
      {
        id: 'orb_i3',
        text: 'Hanya memiliki 1 orientasi ruang (m_l = 0), menampung maksimal 2 elektron',
        targetCategoryId: 'cat_orb_s'
      },
      {
        id: 'orb_i4',
        text: 'Memiliki 3 orientasi ruang sepanjang sumbu Cartesian: p_x, p_y, p_z (m_l = -1, 0, +1)',
        targetCategoryId: 'cat_orb_p'
      }
    ],
    hint: 'Orbital s (l = 0, "sharp/spherical") berbentuk bola simetris tanpa orientasi sumbu khusus (hanya m_l = 0). Sedangkan orbital p (l = 1, "principal") berbentuk dua cuping berhadapan seperti balon terpilin/dumbbell yang dapat menghadap ke sumbu X (px), sumbu Y (py), atau sumbu Z (pz).',
    explanation: 'Orbital s (l=0) berbentuk bola dengan 1 orientasi ruang (m_l=0). Orbital p (l=1) berbentuk balon terpilin/dumbbell dengan 3 orientasi ruang (px, py, pz) yang masing-masing memiliki bidang simpul (nodal plane) di inti.'
  }
]
