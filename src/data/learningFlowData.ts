export interface ModelLearningGuide {
  modelId: string
  historicalProblem: string
  investigationQuestion: string
  labGuide: {
    objective: string
    steps: string[]
    keyObservations: string[]
    coreDiscovery: string
  }
  evolutionBridge: {
    previousGap: string
    currentBreakthrough: string
    nextTrigger: string
  }
  miniCheckpoint: {
    question: string
    options: string[]
    correctAnswer: number
    hint: string
    explanation: string
  }
}

export const LEARNING_FLOW_DATA: Record<string, ModelLearningGuide> = {
  democritus: {
    modelId: 'democritus',
    historicalProblem:
      'Filsuf Yunani Kuno berdebat: Jika sepotong batu, kayu, atau logam dipotong terus-menerus, apakah pemotongan itu bisa berlangsung abadi tanpa batas (materi kontinu), ataukah ada titik akhir berupa partikel fundamental yang tak dapat dibelah lagi?',
    investigationQuestion:
      'Apa yang terjadi jika suatu materi padat dipotong terus-menerus hingga skala terkecil yang memungkinkan?',
    labGuide: {
      objective:
        'Melakukan eksperimen pemikiran (Gedankenexperiment) pemotongan kepingan emas murni dari skala perhiasan makroskopik (20 mm) hingga skala batas atomos (<0.3 nm).',
      steps: [
        'Klik tombol "Gunting / Potong Materi" berulang kali untuk membelah emas menjadi bagian-bagian yang kian kecil.',
        'Perhatikan transisi level dari Makroskopik (perhiasan & serbuk), Mikroskopik (sel & mikron), hingga Submikroskopik (nanometer).',
        'Amati apa yang terjadi pada level terakhir saat gunting mencoba memotong partikel tunggal emas.'
      ],
      keyObservations: [
        'Warna kuning dan sifat materi emas tetap bertahan meski dipotong menjadi serpihan halus.',
        'Pada level atomos, materi mencapai batas pembelahan fisik: partikel tidak lagi dapat dipotong tanpa kehilangan hakikat materinya.',
        'Di antara partikel-partikel terdapat ruang kosong hampa tempat partikel dapat bergerak.'
      ],
      coreDiscovery:
        'Materi tidak bersifat kontinu, melainkan tersusun atas unit partikel terkecil yang tak terbagi (Atomos) yang terpisah oleh ruang hampa.'
    },
    evolutionBridge: {
      previousGap:
        'Masyarakat kuno meyakini teori 4 elemen Empedokles/Aristoteles (tanah, air, udara, api) yang menganggap zat dapat diubah dan dibagi tanpa batas.',
      currentBreakthrough:
        'Democritus merumuskan hipotesis filosofis pertama bahwa materi terdiri dari partikel-partikel diskret yang kekal dan tak dapat dimusnahkan.',
      nextTrigger:
        'Gagasan Democritus murni spekulasi filosofis rasionalis tanpa laboratorium empiris selama lebih dari 2.000 tahun, hingga John Dalton mengujinya dengan hukum reaksi kimia kuantitatif pada tahun 1803.'
    },
    miniCheckpoint: {
      question:
        'Berdasarkan pemikiran Democritus (±400 SM), apa yang terjadi jika sebutir perhiasan emas dipotong terus-menerus hingga batas terkecil?',
      options: [
        'Materi akan lenyap musnah menjadi ruang hampa tanpa sisa partikel.',
        'Akan diperoleh partikel terkecil yang pejal, padat, dan tidak dapat dipotong lagi yang disebut "Atomos".',
        'Materi akan terurai menjadi partikel yang memancarkan sinar listrik dan magnet.'
      ],
      correctAnswer: 1,
      hint: 'Ingat arti kata Yunani "a-" (tidak) dan "tomos" (terbagi/terpotong). Democritus menekankan adanya batas fisik pemotongan materi padat.',
      explanation:
        'Tepat! "Atomos" bermakna tidak dapat dipotong atau dibagi lagi. Democritus menyimpulkan pemotongan materi tidak bisa tak berhingga, melainkan berhenti pada partikel fundamental terkecil.'
    }
  },

  dalton: {
    modelId: 'dalton',
    historicalProblem:
      'Hukum Kekekalan Massa (Lavoisier) dan Hukum Perbandingan Tetap (Proust) membuktikan bahwa massa reaksi kimia selalu teratur dan rasio unsur selalu bilangan bulat. Mengapa reaksi kimia memiliki keteraturan matematis yang begitu presisi?',
    investigationQuestion:
      'Bagaimana partikel-partikel penyusun unsur bergabung satu sama lain dalam membentuk senyawa kimia yang stabil?',
    labGuide: {
      objective:
        'Menguji penggabungan partikel atom bola pejal Dalton dalam reaksi stoikiometri molekul Air (H₂O), CO, dan CO₂, serta membuktikan keterbatasan model terhadap fenomena listrik.',
      steps: [
        'Pilih jenis reaksi kimia yang ingin diuji: Air (H₂O) atau Karbon Dioksida (CO₂).',
        'Tekan tombol "Reaksikan Atom" dan amati bagaimana atom-atom bola biliar bergabung dengan rasio bulat sederhana.',
        'Klik tombol "Uji Fenomena Listrik Statis" untuk melihat bagaimana model bola pejal menghadapi aliran muatan listrik.'
      ],
      keyObservations: [
        'Atom tidak berubah wujud atau hancur saat bereaksi; atom hanya berganti pasangan ikatan (Hukum Kekekalan Massa).',
        'Perbandingan atom yang menyusun senyawa selalu membentuk rasio bilangan bulat dan sederhana (Hukum Proust & Dalton).',
        'Namun, bola pejal tanpa struktur dalam tidak dapat menjelaskan mengapa materi dapat menarik muatan listrik statis!'
      ],
      coreDiscovery:
        'Reaksi kimia adalah penataan ulang atom-atom bola pejal yang identik massanya untuk tiap unsur sejenis, dan bergabung dengan rasio bulat sederhana.'
    },
    evolutionBridge: {
      previousGap:
        'Democritus hanya mengajukan gagasan filosofis tanpa bukti eksperimen atau pengukuran massa.',
      currentBreakthrough:
        'Dalton membuktikan keberadaan atom secara ilmiah melalui pengukuran stoikiometri massa dan hukum-hukum kimia kuantitatif.',
      nextTrigger:
        'Dalton menganggap atom seperti bola biliar padat tanpa isi. Namun, penemuan fenomena listrik statis dan sinar katoda membuktikan bahwa di dalam atom ada partikel yang lebih kecil bermuatan listrik (elektron)!'
    },
    miniCheckpoint: {
      question:
        'Kelemahan paling mendasar dari Model Atom Bola Pejal Dalton yang kemudian memicu eksperimen J.J. Thomson adalah...',
      options: [
        'Dalton tidak dapat menjelaskan mengapa reaksi kimia menghasilkan perubahan massa total.',
        'Dalton menganggap atom tidak memiliki struktur internal dan tak bermuatan, sehingga gagal menjelaskan fenomena kelistrikan materi.',
        'Dalton salah dalam merumuskan simbol-simbol unsur kimia modern.'
      ],
      correctAnswer: 1,
      hint: 'Pikirkan fenomena ketika sisir plastik digosokkan ke rambut kering lalu dapat menarik serpihan kertas kecil. Dari manakah muatan listrik itu muncul jika atom pejal tanpa muatan?',
      explanation:
        'Benar sekali! Model bola pejal Dalton tidak dapat menjelaskan sifat kelistrikan materi (mengapa zat memiliki muatan listrik saat digosok), yang membuktikan bahwa atom bukanlah partikel terkecil tanpa isi.'
    }
  },

  thomson: {
    modelId: 'thomson',
    historicalProblem:
      'Jika atom adalah bola pejal yang tak dapat dibagi lagi sebagaimana postulat Dalton, dari manakah asal berkas sinar bermuatan listrik negatif yang terpancar dalam tabung lucutan gas bertekanan rendah?',
    investigationQuestion:
      'Apakah sinar katoda merupakan gelombang cahaya biasa, ataukah partikel subatomik universal yang berada di dalam semua atom?',
    labGuide: {
      objective:
        'Meniru 4 tahapan eksperimen otentik J.J. Thomson (1897) pada Tabung Sinar Katoda (CRT) dengan medan listrik dan medan magnet untuk mengukur rasio muatan terhadap massa elektron (e/m).',
      steps: [
        'Langkah 1 (Tanpa Medan): Perhatikan berkas sinar katoda melesat lurus dari katoda (-) menuju layar fosfor menghasilkan pendaran hijau.',
        'Langkah 2 (Medan Listrik E): Pasang pelat listrik bertegangan tinggi. Amati ke arah mana berkas sinar membelok.',
        'Langkah 3 & 4 (Medan Magnet B & Keseimbangan): Terapkan medan magnetik Lorentz dan seimbangkan gaya listrik hingga berkas lurus kembali untuk menghitung kecepatan v dan rasio e/m.'
      ],
      keyObservations: [
        'Sinar katoda selalu membelok tertarik ke pelat POSITIF (+), membuktikan sinar terdiri dari partikel bermuatan NEGATIF.',
        'Sifat sinar katoda identik terlepas dari jenis gas di dalam tabung atau jenis logam katoda yang digunakan.',
        'Rasio muatan terhadap massa e/m bernilai fantastis (1,76 × 10¹¹ C/kg), membuktikan massa partikel ini jauh lebih ringan dari atom hidrogen (~1/1836 kali).'
      ],
      coreDiscovery:
        'Atom bukanlah unit materi terkecil! Atom memiliki partikel subatomik universal bermuatan negatif (ELEKTRON) yang tertanam dalam bola bermuatan positif seragam.'
    },
    evolutionBridge: {
      previousGap:
        'Model Dalton tidak mengenal adanya partikel subatom dan tidak bisa menjelaskan sifat kelistrikan materi.',
      currentBreakthrough:
        'Thomson menemukan partikel subatomik pertama di dunia (elektron) dan merumuskan model atom roti kismis (plum pudding) yang netral secara listrik.',
      nextTrigger:
        'Thomson menduga muatan positif menyebar tipis merata di seluruh volume atom. Namun, muridnya Ernest Rutherford menguji ketebalan muatan positif ini dengan menembakkan partikel alfa berenergi tinggi!'
    },
    miniCheckpoint: {
      question:
        'Apa bukti eksperimental paling krusial dari eksperimen tabung sinar katoda Thomson yang membuktikan bahwa elektron bermuatan negatif?',
      options: [
        'Berkas sinar katoda selalu membelok tertarik menuju pelat medan listrik bermuatan positif (+).',
        'Berkas sinar katoda berhenti bergerak ketika mendekati pelat medan magnet.',
        'Berkas sinar katoda berubah warna dari hijau menjadi merah saat dialiri tegangan tinggi.'
      ],
      correctAnswer: 0,
      hint: 'Hukum dasar elektrostatis: muatan sejenis tolak-menolak, muatan berbeda jenis tarik-menarik. Jika berkas ditarik ke kutub (+), maka muatannya adalah...',
      explanation:
        'Tepat! Karena berkas sinar katoda selalu ditarik ke pelat positif (+) dan ditolak oleh pelat negatif (-), Thomson membuktikan tanpa ragu bahwa partikel penyusun sinar katoda bermuatan listrik negatif (elektron).'
    }
  },

  rutherford: {
    modelId: 'rutherford',
    historicalProblem:
      'Jika muatan positif tersebar tipis dan merata di seluruh volume atom seperti adonan roti kismis Thomson, maka partikel alfa (inti Helium yang berat dan cepat) seharusnya dapat menembus lempeng emas tipis dengan hamburan sudut sangat kecil (<1°). Benarkah demikian?',
    investigationQuestion:
      'Bagaimanakah distribusi muatan positif dan massa yang sesungguhnya di dalam atom emas?',
    labGuide: {
      objective:
        'Menembakkan partikel alfa pada lempeng emas tipis (Gold Foil Experiment) dan menganalisis mengapa sebagian kecil partikel memantul tajam (>90°), serta mengamati paradoks kestabilan orbit elektron klasik.',
      steps: [
        'Nyalakan sumber partikel alfa (Alpha Gun) dan amati lintasan partikel melintasi atom lempeng emas.',
        'Perhatikan penghitung statistik: mayoritas partikel lurus (>99%), sebagian kecil membelok, dan sangat langka yang memantul kembali.',
        'Buka tab "Paradoks Maxwell" untuk melihat bagaimana fisika klasik meramalkan runtuhnya orbit elektron melingkar.'
      ],
      keyObservations: [
        'Lebih dari 99,9% partikel alfa tembus lurus tanpa hambatan, membuktikan >99,99% volume atom adalah RUANG HAMPA KOSONG!',
        'Sekitar 1 dari 8.000 partikel alfa terpantul balik dengan sudut tajam, membuktikan adanya pusat massa yang amat padat, pekat, dan bermuatan positif sejenis.',
        'Diameter inti atom (~10⁻¹⁵ m) seratus ribu kali lebih kecil dari ukuran keseluruhan atom (~10⁻¹⁰ m).'
      ],
      coreDiscovery:
        'Atom terdiri dari INTI ATOM (Nucleus) bermuatan positif yang amat kecil dan padat di pusat, dikelilingi oleh elektron-elektron yang bergerak di ruang hampa yang sangat luas.'
    },
    evolutionBridge: {
      previousGap:
        'Model Thomson meramalkan muatan positif tersebar merata seperti roti kismis, sehingga tidak mungkin memantulkan partikel alfa yang berkecepatan tinggi.',
      currentBreakthrough:
        'Rutherford membuktikan penemuan inti atom (nucleus) dan konsep bahwa atom sebagian besar adalah ruang kosong hampa.',
      nextTrigger:
        'Paradoks Elektrodinamika Maxwell: Elektron yang berputar melingkar mengalami percepatan sentripetal, sehingga wajib memancarkan radiasi energi, kehilangan kecepatan, dan spiral jatuh ke inti dalam 10⁻⁸ detik (atom harusnya hancur seketika!). Masalah ini dijawab oleh Niels Bohr.'
    },
    miniCheckpoint: {
      question:
        'Berdasarkan eksperimen lempeng emas tipis Rutherford, fakta bahwa terdapat partikel alfa yang memantul balik dengan sudut tajam (>90°) membuktikan bahwa...',
      options: [
        'Lempeng emas tidak memiliki ruang hampa sama sekali.',
        'Seluruh massa dan muatan positif atom terkonsentrasi pada inti atom (nucleus) yang sangat kecil dan padat di pusat.',
        'Elektron memiliki massa yang jauh lebih besar daripada partikel alfa.'
      ],
      correctAnswer: 1,
      hint: 'Rutherford menganalogikan peristiwa ini seperti menembakkan peluru meriam 15 inci ke selembar kertas tisu, dan peluru itu memantul kembali mengenai penembaknya. Apa yang sanggup memantulkan partikel alfa berat bermuatan positif?',
      explanation:
        'Hebat! Pemantulan bersudut tajam hanya dimungkinkan jika partikel alfa menabrak suatu konsentrasi massa yang amat masif dan bermuatan positif sejenis (tolak-menolak Coulomb kuat), yaitu inti atom (nucleus).'
    }
  },

  bohr: {
    modelId: 'bohr',
    historicalProblem:
      'Mengapa elektron Rutherford tidak kehilangan energi dan tidak jatuh spiral menabrak inti atom? Dan mengapa gas hidrogen yang dipanaskan memancarkan spektrum garis cahaya warna-warni yang diskret, bukan spektrum kontinu seperti pelangi?',
    investigationQuestion:
      'Bagaimana susunan lintasan orbit elektron yang membuat atom tetap stabil dan memancarkan spektrum garis khas?',
    labGuide: {
      objective:
        'Menyelidiki kuantisasi energi orbit elektron (n = 1, 2, 3, 4, 5), fenomena eksitasi elektron akibat penyerapan foton, serta pelepasan foton warna-warni deret Balmer saat elektron melompat turun.',
      steps: [
        'Klik tombol "Eksitasi Elektron" atau pilih tingkat orbit tujuan (n = 2, 3, 4, atau 5).',
        'Amati penyerapan foton energi saat elektron melompat ke kulit yang lebih luar.',
        'Klik tombol "Emisi Foton / De-eksitasi" untuk mengembalikan elektron ke n = 2 dan amati warna garis spektrum yang dipancarkan (merah 656 nm, sian 486 nm, biru 434 nm, ungu 410 nm).'
      ],
      keyObservations: [
        'Elektron hanya stabil pada jari-jari orbit stasioner tertentu (n = 1, 2, 3...), tidak pernah melayang di antara dua kulit.',
        'Selama elektron berputar di orbit stasionernya, elektron TIDAK memancarkan radiasi energi (menyelamatkan atom dari kehancuran).',
        'Foton hanya dipancarkan atau diserap saat elektron berpindah lintasan: ΔE = h · c / λ.'
      ],
      coreDiscovery:
        'Energi elektron dalam atom terkuantisasi pada tingkat orbit diskret (keadaan stasioner). Elektron memancarkan atau menyerap energi hanya saat melompat antar tingkat energi.'
    },
    evolutionBridge: {
      previousGap:
        'Model Rutherford tidak dapat menjelaskan mengapa elektron tidak jatuh ke inti dan mengapa timbul spektrum garis diskret.',
      currentBreakthrough:
        'Bohr menggabungkan teori kuantum Planck dengan fisika atom, merumuskan kulit-kulit elektron stasioner terkuantisasi yang presisi untuk hidrogen.',
      nextTrigger:
        'Bohr hanya berhasil pada atom berelektron tunggal (hidrogen). Model ini gagal menjelaskan atom multielektron, efek Zeeman (pemisahan garis dalam medan magnet), serta menganggap orbit sebagai lingkaran datar 2D kaku tanpa memperhitungkan sifat gelombang elektron.'
    },
    miniCheckpoint: {
      question:
        'Menurut Niels Bohr, kapan suatu atom memancarkan seberkas foton cahaya dengan panjang gelombang dan warna spesifik?',
      options: [
        'Saat elektron bergerak dengan kecepatan konstan di dalam orbit stasionernya.',
        'Saat elektron mengalami de-eksitasi (melompat turun) dari tingkat energi lebih tinggi ke tingkat energi lebih rendah.',
        'Saat elektron bertabrakan dengan proton di dalam inti atom.'
      ],
      correctAnswer: 1,
      hint: 'Prinsip konservasi energi: ketika elektron turun ke kulit yang berenergi lebih rendah, selisih energinya (ΔE = E₂ - E₁) harus dilepaskan ke lingkungan dalam bentuk foton cahaya.',
      explanation:
        'Tepat sekali! Pelepasan foton cahaya (emisi) terjadi hanya ketika elektron melompat dari tingkat energi tinggi (kulit luar) ke tingkat energi rendah (kulit dalam), memancarkan foton dengan energi persis sama dengan selisih tingkat energi orbitnya.'
    }
  },

  quantum: {
    modelId: 'quantum',
    historicalProblem:
      'Louis de Broglie membuktikan elektron memiliki sifat gelombang materi (λ = h / p). Jika elektron adalah gelombang, mungkinkah elektron bergerak di rel orbit lingkaran 2D kaku seperti yang dibayangkan Bohr?',
    investigationQuestion:
      'Bagaimana kita menggambarkan keberadaan dan energi elektron jika posisinya diatur oleh prinsip ketidakpastian gelombang?',
    labGuide: {
      objective:
        'Menjelajahi bentuk awan probabilitas elektron (orbital 1s, 2s, 2px, 2py, 2pz), mengamati densitas kerapatan titik |Ψ|², dan memahami batas kepastian posisi elektron menurut Heisenberg.',
      steps: [
        'Pilih orbital kuantum yang ingin diamati: Orbital s (bola simetris) atau orbital p (cuping balon terpilin).',
        'Ubah parameter densitas probabilitas atau geser slider sudut pandang 3D.',
        'Perhatikan bahwa elektron tidak berada pada garis rel kaku, melainkan berupa awan kabut dengan kepekatan titik berbeda.'
      ],
      keyObservations: [
        'Prinsip Ketidakpastian Heisenberg: Tidak mungkin menentukan posisi dan momentum elektron secara bersamaan dengan ketelitian mutlak (Δx · Δp ≥ ℏ/2).',
        'Daerah dengan titik kabut paling rapat menunjukkan probabilitas tertinggi (>90%) untuk menemukan elektron.',
        'Bentuk orbital ditentukan oleh 4 bilangan kuantum: n (ukuran), l (bentuk), m_l (orientasi ruang), dan m_s (arah spin).'
      ],
      coreDiscovery:
        'Elektron tidak memiliki orbit lingkaran pasti, melainkan menempati "ORBITAL", yaitu fungsi gelombang ruang 3D yang menggambarkan wilayah peluang terbesar menemukan elektron.'
    },
    evolutionBridge: {
      previousGap:
        'Model Bohr membatasi elektron pada rel orbit lingkaran 2D dan gagal menjelaskan atom banyak elektron serta sifat gelombang materi.',
      currentBreakthrough:
        'Mekanika Kuantum (Schrödinger, Heisenberg, de Broglie) merumuskan orbital 3D dan persamaan gelombang kuantum ĤΨ = EΨ sebagai model atom paling komprehensif.',
      nextTrigger:
        'Model Mekanika Kuantum adalah puncak teori atom modern yang saat ini digunakan di seluruh dunia sains, menjadi landasan ilmu ikatan kimia, nanoteknologi, spektroskopi modern, dan komputer kuantum!'
    },
    miniCheckpoint: {
      question:
        'Apa perbedaan mendasar antara konsep "Orbit" pada model Bohr dengan konsep "Orbital" pada model mekanika kuantum?',
      options: [
        'Orbit adalah lintasan lingkaran pasti 2D, sedangkan Orbital adalah ruang 3D peluang/probabilitas terbesar (>90%) menemukan elektron.',
        'Orbit berada di dalam inti atom, sedangkan Orbital berada di luar seluruh lapisan atom.',
        'Orbit hanya berlaku untuk elektron negatif, sedangkan Orbital berlaku untuk partikel netral.'
      ],
      correctAnswer: 0,
      hint: 'Dalam mekanika kuantum berlaku Prinsip Ketidakpastian Heisenberg: lintasan pasti tidak ada, yang ada hanyalah awan kebolehjadian ruang (orbital).',
      explanation:
        'Sangat tepat! Orbit dalam model Bohr adalah garis edar lingkaran pasti seperti planet, sedangkan Orbital dalam mekanika gelombang kuantum adalah daerah tiga dimensi dengan peluang atau kerapatan probabilitas terbesar menemukan elektron.'
    }
  }
}

