import type { AtomModel } from '../types/atom'

export const ATOM_MODELS: AtomModel[] = [
  {
    id: 'democritus',
    name: 'Gagasan Atom Democritus',
    scientist: 'Democritus dari Abdera',
    period: '± 400 SM',
    summary: 'Materi tidak bersifat kontinu tanpa batas, melainkan tersusun atas partikel terkecil yang tidak dapat dipotong atau dibagi lagi yang dinamakan atomos.',
    analogy: 'Membelah sebutir pasir atau buah terus-menerus hingga mencapai unit terkecil yang tak dapat dibelah lagi.',
    representations: {
      macroscopic: 'Materi padat (batu, kayu, air) yang jika dipotong terus-menerus memiliki batas pemotongan fisik terkecil.',
      submicroscopic: 'Partikel-partikel pejal, homogen, dan tak berongga dengan bentuk geometris tertentu yang saling berkait secara mekanik.',
      symbolic: 'Istilah Yunani: "a" (tidak) + "tomos" (terbagi/terpotong) = "Atomos".'
    },
    chemicalRules: [
      'Materi terdiri dari partikel-partikel diskret yang tak dapat dibagi lagi (Atomos).',
      'Di antara atom-atom terdapat ruang hampa (void) tempat atom bergerak.',
      'Atom bersifat padat homogen, kekal, dan tidak dapat dimusnahkan.',
      'Sifat materi ditentukan oleh bentuk dan susunan geometris partikel atomos penyusunnya.'
    ],
    historicalExperiment: 'Eksperimen pemikiran murni (Gedankenexperiment) pemotongan materi kontinu tanpa laboratorium empiris.',
    resolvedProblem: 'Menolak gagasan materi tak terhingga/kontinu yang menganggap zat dapat dibelah tanpa batas selamanya.',
    limitations: 'Murni spekulasi filosofis rasionalis Yunani Kuno tanpa pembuktian eksperimen empiris laboratorium ilmiah.',
    color: 'from-amber-400 to-orange-500',
    theme: {
      bgLight: 'bg-amber-50/70',
      borderLight: 'border-amber-200',
      activeRing: 'ring-amber-500 border-amber-400 bg-amber-100/80',
      textColor: 'text-amber-900',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
      gradient: 'from-amber-500 to-orange-500'
    },
    scientistProfile: {
      fullName: 'Democritus dari Abdera',
      lifespan: '± 460 SM – 370 SM',
      nationality: 'Yunani Kuno (Thrace)',
      title: 'Filsuf Pra-Sokrates & Pencetus Gagasan Atomos',
      avatarUrl: '/scientists/democritus.jpg',
      bio: 'Democritus adalah seorang filsuf Yunani Kuno yang dikenal dengan kepribadiannya yang selalu riang sehingga dijuluki "The Laughing Philosopher". Bersama gurunya Leukippos, ia merumuskan gagasan awal bahwa seluruh alam semesta tersusun atas ruang hampa (void) dan partikel-partikel tak terbagi yang kekal.',
      keyContribution: 'Mencetuskan istilah "Atomos" (tidak terbagi) sebagai hipotesis filosofis pertama tentang batas materi.',
      funFact: 'Democritus berkelana hingga ke Mesir, Persia, dan India untuk mempelajari geometri dan astronomi sebelum kembali ke Yunani.'
    }
  },
  {
    id: 'dalton',
    name: 'Model Atom Dalton',
    scientist: 'John Dalton',
    period: '1803',
    summary: 'Atom adalah bola pejal masif tanpa struktur internal yang tidak dapat diciptakan atau dimusnahkan. Atom unsur sejenis identik, dan unsur berbeda bergabung dengan rasio bilangan bulat sederhana.',
    analogy: 'Bola biliar pejal keras yang tidak dapat ditembus atau dipecahkan.',
    representations: {
      macroscopic: 'Hukum Kekekalan Massa (Lavoisier) dan Hukum Perbandingan Tetap (Proust) pada reaksi kimia terukur.',
      submicroscopic: 'Bola pejal padat dengan massa dan ukuran spesifik untuk tiap unsur, bersatu membentuk molekul senyawa tanpa bertukar partikel dalam.',
      symbolic: 'Simbol lingkaran awal Dalton dan rumus perbandingan stoikiometri sederhana (misal H₂O, CO, CO₂).'
    },
    chemicalRules: [
      'Unsur tersusun atas partikel amat kecil tak terbagi yang disebut atom.',
      'Semua atom dari unsur yang sama adalah identik dalam massa dan sifat fisika/kimianya.',
      'Atom suatu unsur tidak dapat diubah menjadi atom unsur lain melalui reaksi kimia biasa.',
      'Hukum Perbandingan Berganda: Jika dua unsur membentuk lebih dari satu senyawa, perbandingan massa unsur kedua terhadap unsur pertama berbanding sebagai bilangan bulat sederhana.'
    ],
    historicalExperiment: 'Analisis stoikiometri massa gas dan hukum perbandingan tetap (Hukum Proust & Lavoisier).',
    resolvedProblem: 'Memberikan landasan ilmiah kuantitatif pertama bagi kimia modern berbasis hukum kekekalan massa.',
    limitations: 'Tidak dapat menjelaskan fenomena kelistrikan materi (mengapa zat bermuatan listrik saat digosok) dan sifat isotop unsur.',
    color: 'from-blue-500 to-cyan-500',
    theme: {
      bgLight: 'bg-sky-50/70',
      borderLight: 'border-sky-200',
      activeRing: 'ring-sky-500 border-sky-400 bg-sky-100/80',
      textColor: 'text-sky-900',
      badgeBg: 'bg-sky-100 text-sky-800 border-sky-200',
      gradient: 'from-blue-500 to-sky-500'
    },
    scientistProfile: {
      fullName: 'John Dalton FRS',
      lifespan: '1766 – 1844',
      nationality: 'Inggris (Cumberland & Manchester)',
      title: 'Bapak Teori Atom Modern & Ahli Meteorologi',
      avatarUrl: '/scientists/dalton.jpg',
      bio: 'John Dalton adalah seorang kimiawan, fisikawan, dan meteorologis asal Inggris. Ia adalah ilmuwan pertama yang memformalkan konsep atom ke dalam teori ilmiah berbasis hukum kekekalan massa dan perbandingan tetap, mengukur massa atom relatif unsur-unsur kimia.',
      keyContribution: 'Merumuskan Teori Atom Ilmiah Pertama (1803) dan Hukum Perbandingan Berganda (Dalton).',
      funFact: 'Dalton juga merupakan orang pertama yang meneliti cacat penglihatan buta warna secara ilmiah (yang dialaminya sendiri), sehingga kondisi ini sering disebut Daltonisme.'
    }
  },
  {
    id: 'thomson',
    name: 'Model Atom Thomson',
    scientist: 'Sir Joseph John Thomson',
    period: '1897',
    summary: 'Atom berbentuk bola bermuatan positif yang homogen dan menyebar, dengan partikel-partikel bermuatan negatif (elektron) tersebar merata di dalamnya seperti kismis dalam roti.',
    analogy: 'Roti kismis (plum pudding) atau buah semangka: daging merah adalah bola positif, bijinya adalah elektron.',
    representations: {
      macroscopic: 'Sinar katoda yang berbelok ke arah kutub positif medan listrik dalam tabung vakum.',
      submicroscopic: 'Bola kabut bermuatan positif bervolume besar dengan elektron-elektron kecil terbenam netral secara keseluruhan: Σ(+) = Σ(-).',
      symbolic: 'Rasio muatan terhadap massa elektron: e/m = 1.7588 × 10¹¹ C/kg.'
    },
    chemicalRules: [
      'Atom bukan partikel terkecil yang tak terbagi, melainkan memiliki partikel subatomik bermuatan negatif (elektron).',
      'Massa elektron jauh lebih kecil daripada massa keseluruhan atom (sekitar 1/1836 massa hidrogen).',
      'Atom secara kelistrikan bersifat netral: muatan positif bola sama besar dengan total muatan negatif elektron yang tersebar.',
      'Elektron dapat bergetar/berosilasi di sekitar posisi setimbangnya di dalam bola materi positif.'
    ],
    historicalExperiment: 'Eksperimen Tabung Sinar Katoda (Cathode Ray Tube / CRT) dengan medan listrik dan medan magnet silang.',
    resolvedProblem: 'Menjelaskan fenomena kelistrikan materi dan membuktikan adanya partikel subatomik universal pertama (elektron).',
    limitations: 'Tidak dapat menjelaskan fenomena dinamika hamburan partikel alfa bersudut besar pada eksperimen Rutherford.',
    color: 'from-emerald-500 to-teal-500',
    theme: {
      bgLight: 'bg-emerald-50/70',
      borderLight: 'border-emerald-200',
      activeRing: 'ring-emerald-500 border-emerald-400 bg-emerald-100/80',
      textColor: 'text-emerald-900',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      gradient: 'from-emerald-500 to-teal-500'
    },
    scientistProfile: {
      fullName: 'Sir Joseph John Thomson OM PRS',
      lifespan: '1856 – 1940',
      nationality: 'Britania Raya (Manchester & Cambridge)',
      title: 'Peraih Hadiah Nobel Fisika 1906 & Penemu Elektron',
      avatarUrl: '/scientists/thomson.jpg',
      bio: 'J.J. Thomson adalah fisikawan terkemuka yang menjabat sebagai direktur Cavendish Laboratory di Universitas Cambridge. Pada tahun 1897, lewat eksperimen tabung sinar katoda, ia membuktikan bahwa atom memiliki partikel subatomik universal bermuatan negatif yang dinamakan elektron.',
      keyContribution: 'Menemukan elektron (partikel subatomik pertama) dan mengusulkan Model Atom Roti Kismis (1897).',
      funFact: 'Tujuh orang asisten risetnya di laboratorium Cavendish kelak memenangkan Hadiah Nobel, dan putranya sendiri (George Paget Thomson) juga meraih Hadiah Nobel Fisika tahun 1937!'
    }
  },
  {
    id: 'rutherford',
    name: 'Model Atom Rutherford',
    scientist: 'Ernest Rutherford, Geiger & Marsden',
    period: '1911',
    summary: 'Atom terdiri dari inti (nucleus) bermuatan positif yang sangat kecil dan bermassa sangat pekat di pusat, dikelilingi oleh elektron-elektron di ruang hampa yang sangat luas.',
    analogy: 'Tata surya mini dengan matahari sebagai inti positif padat dan planet sebagai elektron di ruang angkasa kosong.',
    representations: {
      macroscopic: 'Hamburan berkas partikel alfa (α) berkecepatan tinggi saat menembus lempeng emas tipis setebal beberapa ratus atom.',
      submicroscopic: 'Sebagian besar volume atom adalah ruang hampa (>99.99%). Inti atom di pusat berdiameter ~10⁻¹⁵ m, berjarak jauh dari elektron (~10⁻¹⁰ m).',
      symbolic: 'Rasio dimensi: r_inti / r_atom ≈ 1 : 100.000. Hamburan Coulomb: F = k (q₁ q₂) / r².'
    },
    chemicalRules: [
      'Sebagian besar massa atom dan seluruh muatan positifnya terpusat dalam daerah inti yang amat kecil (nucleus).',
      'Sebagian besar volume atom merupakan ruang kosong/hampa (empty space).',
      'Elektron bermuatan negatif bergerak mengitari inti di ruang hampa tersebut seperti planet mengitari matahari.',
      'Jumlah muatan positif pada inti sama persis dengan total muatan elektron di sekitarnya sehingga atom netral.'
    ],
    historicalExperiment: 'Eksperimen Hamburan Partikel Alfa pada Lempeng Emas Tipis (Gold Foil Experiment).',
    resolvedProblem: 'Menjelaskan mengapa partikel alfa dapat terpantul balik dengan sudut tajam (>90°), yang mustahil terjadi pada model bola diffuse Thomson.',
    limitations: 'Paradoks Elektrodinamika Klasik Maxwell: Elektron yang bergerak melingkar mengalami percepatan sentripetal, sehingga harus memancarkan radiasi elektromagnetik, kehilangan energi, dan spiral jatuh ke inti dalam tempo <10⁻⁸ detik (atom harusnya runtuh). Juga tidak bisa menjelaskan spektrum garis diskret.',
    color: 'from-purple-500 to-indigo-500',
    theme: {
      bgLight: 'bg-purple-50/70',
      borderLight: 'border-purple-200',
      activeRing: 'ring-purple-500 border-purple-400 bg-purple-100/80',
      textColor: 'text-purple-900',
      badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
      gradient: 'from-purple-500 to-indigo-500'
    },
    scientistProfile: {
      fullName: 'Ernest Rutherford, 1st Baron Rutherford of Nelson OM FRS',
      lifespan: '1871 – 1937',
      nationality: 'Selandia Baru & Britania Raya',
      title: 'Peraih Hadiah Nobel Kimia 1908 & Bapak Fisika Nuklir',
      avatarUrl: '/scientists/rutherford.jpg',
      bio: 'Ernest Rutherford lahir di Selandia Baru dan menjadi salah satu eksperimentalis fisika terbesar sepanjang masa. Bersama Hans Geiger dan Ernest Marsden, ia menembakkan partikel alfa ke lempeng emas tipis dan membuktikan bahwa hampir seluruh massa atom terkonsentrasi di sebuah inti atom kecil di pusat.',
      keyContribution: 'Menemukan Inti Atom (Nucleus) bermuatan positif dan menamai partikel alfa, beta, serta proton.',
      funFact: 'Unsur kimia bernomor atom 104 dinamakan Rutherfordium (Rf) sebagai penghormatan abadi atas kontribusi besarnya dalam fisika nuklir.'
    }
  },
  {
    id: 'bohr',
    name: 'Model Atom Bohr',
    scientist: 'Niels Bohr',
    period: '1913',
    summary: 'Elektron mengelilingi inti pada lintasan melingkar stasioner tertentu dengan tingkat energi terkuantisasi tanpa memancarkan radiasi. Elektron memancarkan atau menyerap energi foton hanya saat melompat antar tingkat energi.',
    analogy: 'Anak tangga stasioner: seseorang hanya bisa berdiri di anak tangga ke-1, ke-2, atau ke-3, tidak bisa melayang di antara anak tangga.',
    representations: {
      macroscopic: 'Spektrum garis emisi warna-warni yang khas pada lampu gas tabung lucutan hidrogen (garis Balmer merah 656 nm, sian 486 nm, dsb.).',
      submicroscopic: 'Kulit-kulit elektron lingkaran diskret (n = 1, 2, 3, 4, 5 atau kulit K, L, M, N, O) dengan jari-jari r_n = n² · r₁.',
      symbolic: 'Persamaan kuantisasi: L = n(h / 2π). Energi foton: ΔE = hν = hc/λ = E_akhir - E_awal.'
    },
    chemicalRules: [
      'Elektron hanya mengitari inti pada lintasan tertentu yang disebut keadaan stasioner (tingkat energi tertentu) tanpa melepaskan energi.',
      'Momentum sudut elektron terkuantisasi sebagai kelipatan bilangan bulat: L = m v r = n (h / 2π).',
      'Eksitasi: Elektron menyerap foton spesifik untuk melompat dari tingkat energi lebih rendah ke lebih tinggi (n₁ → n₂).',
      'Emisi: Elektron jatuh dari tingkat energi tinggi ke rendah (n₂ → n₁) sambil memancarkan satu foton cahaya dengan energi persis ΔE.'
    ],
    historicalExperiment: 'Analisis spektroskopi emisi gas hidrogen diskret dan penggabungan konstanta Planck dengan fisika klasik.',
    resolvedProblem: 'Menyelamatkan kestabilan atom dari runtuhnya model Rutherford dan menjelaskan spektrum garis emisi atom hidrogen secara matematis presisi.',
    limitations: 'Hanya akurat untuk atom berelektron tunggal (H, He⁺, Li²⁺). Tidak dapat menjelaskan efek Zeeman (pemisahan garis dalam medan magnet), efek Stark, maupun spektrum atom berelektron banyak.',
    color: 'from-pink-500 to-rose-500',
    theme: {
      bgLight: 'bg-pink-50/70',
      borderLight: 'border-pink-200',
      activeRing: 'ring-pink-500 border-pink-400 bg-pink-100/80',
      textColor: 'text-pink-900',
      badgeBg: 'bg-pink-100 text-pink-800 border-pink-200',
      gradient: 'from-pink-500 to-rose-500'
    },
    scientistProfile: {
      fullName: 'Niels Henrik David Bohr',
      lifespan: '1885 – 1962',
      nationality: 'Denmark (Kopenhagen)',
      title: 'Peraih Hadiah Nobel Fisika 1922 & Perintis Kuantisasi Atom',
      avatarUrl: '/scientists/bohr.jpg',
      bio: 'Niels Bohr adalah fisikawan asal Denmark yang mendirikan Institut Fisika Teoretis di Kopenhagen. Bohr berhasil memecahkan kelemahan model Rutherford dengan mempostulatkan bahwa elektron hanya boleh berada di lintasan stasioner melingkar dengan momentum sudut terkuantisasi.',
      keyContribution: 'Mengembangkan Model Atom Kuantum Pertama (1913) yang berhasil menjelaskan spektrum garis emisi gas hidrogen.',
      funFact: 'Semasa muda di Kopenhagen, Niels Bohr adalah seorang atlet sepak bola berbakat yang bermain sebagai penjaga gawang (kiper) di klub ternama Akademisk Boldklub!'
    }
  },
  {
    id: 'quantum',
    name: 'Model Mekanika Kuantum',
    scientist: 'Schrödinger, Heisenberg & de Broglie',
    period: '1926 - sekarang',
    summary: 'Elektron memiliki sifat dualisme gelombang-partikel dan posisinya tidak dapat dipastikan secara simultan dengan momentumnya. Elektron digambarkan oleh fungsi gelombang orbital sebagai awan probabilitas keberadaan elektron.',
    analogy: 'Awan kabut atau baling-baling kipas angin yang berputar kencang: posisi elektron adalah probabilitas densitas kabut di sekitar inti.',
    representations: {
      macroscopic: 'Pola difraksi dan interferensi berkas elektron melalui kristal, membuktikan sifat gelombang materi.',
      submicroscopic: 'Awan elektron 3D (orbital s bola simetris, orbital p dumbbell balon berhadapan) yang menunjukkan wilayah probabilitas terbesar (≥90%) menemukan elektron.',
      symbolic: 'Persamaan Gelombang Schrödinger: ĤΨ = EΨ. 4 Bilangan Kuantum: n (utama), l (azimut), m_l (magnetik), m_s (spin ±½).'
    },
    chemicalRules: [
      'Dualisme Gelombang-Partikel (de Broglie): Materi memiliki panjang gelombang λ = h / p.',
      'Prinsip Ketidakpastian Heisenberg: Tidak mungkin mengukur posisi (x) dan momentum (p) elektron secara simultan dengan ketelitian absolut: Δx · Δp ≥ ℏ / 2.',
      'Elektron tidak memiliki orbit planar kaku, melainkan menempati "Orbital" (daerah ruang dengan peluang >90% menemukan elektron).',
      'Keberadaan elektron dalam atom diatur oleh 4 bilangan kuantum dan aturan konfigurasi (Prinsip Aufbau, Larangan Pauli, dan Aturan Hund).'
    ],
    historicalExperiment: 'Eksperimen difraksi elektron Davisson-Germer dan interferensi elektron celah ganda.',
    resolvedProblem: 'Mengatasi kegagalan model Bohr pada atom banyak elektron, menjelaskan efek Zeeman, dan memberikan pemahaman sejati mengenai ikatan kimia molekuler.',
    limitations: 'Penyelesaian analitik eksak hanya dapat dilakukan untuk sistem satu elektron; sistem multielektron memerlukan metode komputasi numerik aproksimasi.',
    color: 'from-cyan-500 to-blue-600',
    theme: {
      bgLight: 'bg-cyan-50/70',
      borderLight: 'border-cyan-200',
      activeRing: 'ring-cyan-500 border-cyan-400 bg-cyan-100/80',
      textColor: 'text-cyan-900',
      badgeBg: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      gradient: 'from-cyan-500 to-blue-600'
    },
    scientistProfile: {
      fullName: 'Erwin Schrödinger & Werner Heisenberg',
      lifespan: 'Schrödinger (1887–1961) & Heisenberg (1901–1976)',
      nationality: 'Austria & Jerman',
      title: 'Peraih Hadiah Nobel Fisika (1933 & 1932) • Pionir Mekanika Gelombang & Matriks',
      avatarUrl: '/scientists/schrodinger.jpg',
      bio: 'Model atom modern lahir dari kolaborasi pemikiran para fisikawan kuantum dunia: Louis de Broglie (dualisme gelombang-partikel), Werner Heisenberg (Prinsip Ketidakpastian), dan Erwin Schrödinger yang merumuskan persamaan gelombang kuantum fundamental. Model ini menggantikan lintasan orbit kaku dengan konsep awan probabilitas elektron (orbital).',
      keyContribution: 'Merumuskan Persamaan Gelombang Kuantum (ĤΨ = EΨ) dan Prinsip Ketidakpastian yang mendefinisikan orbital atom modern.',
      funFact: 'Erwin Schrödinger juga terkenal dengan paradoks pemikiran "Kucing Schrödinger" (Schrödinger’s Cat) untuk menggambarkan keanehan superposisi dalam mekanika kuantum.'
    }
  }
]
