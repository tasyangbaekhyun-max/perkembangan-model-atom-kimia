export interface MiniQuestion {
  question: string
  options: string[]
  correctAnswer: number
  hint: string
  explanation: string
}

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
  questions: MiniQuestion[]
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
        'Materi akan lenyap dan bertransformasi seutuhnya menjadi ruang hampa.',
        'Akan diperoleh partikel terkecil yang padat pejal dan mustahil dibagi lagi.',
        'Materi akan terurai menjadi medan partikel yang terus memancarkan muatan listrik.'
      ],
      correctAnswer: 1,
      hint: 'Ingat arti kata Yunani "a-" (tidak) dan "tomos" (terbagi/terpotong). Democritus menekankan adanya batas fisik pemotongan materi padat.',
      explanation:
        'Tepat! "Atomos" bermakna tidak dapat dipotong atau dibagi lagi. Democritus menyimpulkan pemotongan materi tidak bisa tak berhingga, melainkan berhenti pada partikel fundamental terkecil.'
    },
    questions: [
      {
        question:
          'Berdasarkan pemikiran Democritus (±400 SM), apa yang terjadi jika sebutir perhiasan emas dipotong terus-menerus hingga batas terkecil?',
        options: [
          'Materi akan lenyap dan bertransformasi seutuhnya menjadi ruang hampa.',
          'Akan diperoleh partikel terkecil yang padat pejal dan mustahil dibagi lagi.',
          'Materi akan terurai menjadi medan partikel yang terus memancarkan muatan listrik.'
        ],
        correctAnswer: 1,
        hint: 'Ingat arti kata Yunani "a-" (tidak) dan "tomos" (terbagi/terpotong). Democritus menekankan adanya batas fisik pemotongan materi padat.',
        explanation:
          'Tepat! "Atomos" bermakna tidak dapat dipotong atau dibagi lagi. Democritus menyimpulkan pemotongan materi tidak bisa tak berhingga, melainkan berhenti pada partikel fundamental terkecil.'
      },
      {
        question:
          'Menurut Democritus, apa hakikat keberadaan yang memisahkan antara satu partikel atomos dengan partikel atomos lainnya?',
        options: [
          'Ruang hampa mutlak tempat partikel diskret dapat bergerak bebas.',
          'Lapisan cairan eter transparan yang merekatkan partikel secara rapat.',
          'Medan gaya tak kasat mata yang terus menarik partikel secara konstan.'
        ],
        correctAnswer: 0,
        hint: 'Tanpa adanya ruangan kosong ini, atom-atom yang pejal tidak akan pernah bisa bergerak atau saling bersatu membentuk materi.',
        explanation:
          'Benar! Democritus meyakini alam semesta hanya terdiri dari dua hal: atomos (partikel padat tak terbagi) dan ruang hampa (void) sebagai wadah gerak atom.'
      },
      {
        question:
          'Mengapa sepotong emas murni tetap berwarna kuning berkilau meski dipotong dari cincin besar hingga menjadi serbuk sangat halus?',
        options: [
          'Karakteristik materi ditentukan oleh sifat partikel atomos penyusunnya.',
          'Interaksi udara luar menambahkan pigmen kuning secara berkelanjutan.',
          'Gesekan alat potong menghasilkan lapisan kilau baru pada serpihan.'
        ],
        correctAnswer: 0,
        hint: 'Perubahan ukuran secara fisik (makroskopik) tidak mengubah identitas partikel submikroskopik penyusun zat tersebut.',
        explanation:
          'Tepat sekali! Democritus berargumen pemotongan mekanik hanya memisahkan kumpulan atom, bukan mengubah sifat intrinsik atomos zat itu sendiri.'
      },
      {
        question:
          'Aristoteles menolak gagasan atomos Democritus. Apa landasan utama filosofi Aristoteles dalam penolakan tersebut?',
        options: [
          'Aristoteles meyakini materi bersifat kontinu dan menolak ruang hampa.',
          'Aristoteles telah membuktikan adanya partikel subatom di akademi.',
          'Aristoteles menganggap materi tersusun atas zat tunggal yang seragam.'
        ],
        correctAnswer: 0,
        hint: 'Filsafat alam Aristoteles meyakini "alam membenci kehampaan" (nature abhors a vacuum) dan materi dapat terus dibagi tanpa henti.',
        explanation:
          'Sangat tepat! Aristoteles menolak keras konsep ruang hampa dan meyakini materi tersusun dari kontinuitas 4 elemen (tanah, air, udara, api), sehingga gagasan Democritus terabaikan selama ribuan tahun.'
      },
      {
        question:
          'Dari sudut pandang metode ilmiah modern, apa kelemahan paling fundamental dari pemikiran atom Democritus?',
        options: [
          'Gagasan dirumuskan murni secara spekulatif tanpa pengujian eksperimen.',
          'Penelitian menggunakan alat ukur laboratorium yang belum terkalibrasi.',
          'Kesimpulan diperoleh dari pengamatan satu jenis unsur logam semata.'
        ],
        correctAnswer: 0,
        hint: 'Sains modern membutuhkan hipotesis yang dapat diuji (testable) melalui eksperimen kuantitatif empiris di laboratorium.',
        explanation:
          'Luar biasa! Gagasan Democritus adalah spekulasi filosofis rasionalis Yunani Kuno, sehingga belum memenuhi kaidah metode ilmiah modern hingga John Dalton mengujinya secara empiris pada tahun 1803.'
      }
    ]
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
        'Kelemahan mendasar dari model bola pejal Dalton yang mendorong lahirnya eksperimen J.J. Thomson adalah...',
      options: [
        'Model gagal menerangkan perubahan massa yang terjadi saat zat bereaksi.',
        'Model tidak dapat menjelaskan keberadaan muatan listrik pada materi.',
        'Model keliru merumuskan rasio perbandingan stoikiometri senyawa kimia.'
      ],
      correctAnswer: 1,
      hint: 'Pikirkan fenomena ketika sisir plastik digosokkan ke rambut kering lalu dapat menarik serpihan kertas kecil. Dari manakah muatan listrik itu muncul jika atom pejal tanpa muatan?',
      explanation:
        'Benar sekali! Model bola pejal Dalton tidak dapat menjelaskan sifat kelistrikan materi (mengapa zat memiliki muatan listrik saat digosok), yang membuktikan bahwa atom bukanlah partikel terkecil tanpa isi.'
    },
    questions: [
      {
        question:
          'Kelemahan mendasar dari model bola pejal Dalton yang mendorong lahirnya eksperimen J.J. Thomson adalah...',
        options: [
          'Model gagal menerangkan perubahan massa yang terjadi saat zat bereaksi.',
          'Model tidak dapat menjelaskan keberadaan muatan listrik pada materi.',
          'Model keliru merumuskan rasio perbandingan stoikiometri senyawa kimia.'
        ],
        correctAnswer: 1,
        hint: 'Pikirkan fenomena ketika sisir plastik digosokkan ke rambut kering lalu dapat menarik serpihan kertas kecil. Dari manakah muatan listrik itu muncul jika atom pejal tanpa muatan?',
        explanation:
          'Benar sekali! Model bola pejal Dalton tidak dapat menjelaskan sifat kelistrikan materi (mengapa zat memiliki muatan listrik saat digosok), yang membuktikan bahwa atom bukanlah partikel terkecil tanpa isi.'
      },
      {
        question:
          'Bagaimanakah hakikat proses yang berlangsung pada reaksi kimia menurut postulat teori atom John Dalton?',
        options: [
          'Penciptaan partikel-partikel atom baru akibat dorongan energi reaksi.',
          'Penataan ulang dan penggabungan atom tanpa ada atom yang dimusnahkan.',
          'Peleburan materi menjadi bentuk energi murni yang kehilangan massa.'
        ],
        correctAnswer: 1,
        hint: 'Konsep ini selaras dengan Hukum Kekekalan Massa Lavoisier: massa sebelum dan sesudah reaksi selalu sama.',
        explanation:
          'Tepat! Menurut Dalton, reaksi kimia hanyalah penataan ulang atom-atom; tidak ada atom yang diciptakan atau dimusnahkan dalam reaksi kimia biasa.'
      },
      {
        question:
          'Postulat Dalton mengenai kesamaan mutlak sifat atom suatu unsur di kemudian hari perlu direvisi karena...',
        options: [
          'Ditemukan adanya unsur yang sama dengan variasi massa berbeda (isotop).',
          'Atom-atom dapat saling bertukar muatan inti secara spontan di alam bebas.',
          'Bentuk geometri atom selalu berubah-ubah bergantung pada fase zatnya.'
        ],
        correctAnswer: 0,
        hint: 'Isotop adalah atom-atom dari unsur yang sama tetapi memiliki massa berbeda (misalnya Karbon-12 dan Karbon-14).',
        explanation:
          'Benar! Penemuan isotop membuktikan bahwa atom dari unsur yang sama bisa memiliki massa yang sedikit berbeda karena perbedaan jumlah neutron.'
      },
      {
        question:
          'Hukum Perbandingan Berganda (Law of Multiple Proportions) dirumuskan oleh Dalton berdasarkan pembuktian bahwa...',
        options: [
          'Rasio massa unsur kedua yang terikat pada massa tetap unsur pertama selalu bulat.',
          'Volume semua jenis gas selalu bernilai identik pada setiap rentang suhu terukur.',
          'Massa jenis zat cair selalu berbanding lurus dengan tekanan udara lingkungan.'
        ],
        correctAnswer: 0,
        hint: 'Contohnya pada senyawa CO dan CO₂: untuk massa C yang sama, rasio massa oksigen adalah 1 : 2.',
        explanation:
          'Sangat tepat! Hukum Kelipatan Perbandingan membuktikan bahwa atom-atom bergabung sebagai unit satuan diskret utuh, bukan pecahan tak beraturan.'
      },
      {
        question:
          'Apa representasi analogi fisik yang paling tepat untuk menggambarkan model atom yang diajukan oleh John Dalton?',
        options: [
          'Bola biliar pejal yang padat, keras, dan homogen tanpa rongga di dalamnya.',
          'Tata surya mini dengan inti bermuatan di tengah dan planet yang beredar.',
          'Roti kismis dengan butiran buah kering yang tersebar rata di adonan.'
        ],
        correctAnswer: 0,
        hint: 'Bayangkan sebuah bola padat keras yang tidak memiliki bagian dalam yang dapat dibuka atau dibagi lagi.',
        explanation:
          'Luar biasa! Dalton membayangkan atom sebagai bola pejal (solid sphere / billiard ball) yang masif dan tidak memiliki struktur internal.'
      }
    ]
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
        'Bukti eksperimental paling krusial dari tabung sinar katoda Thomson yang membuktikan elektron bermuatan negatif adalah...',
      options: [
        'Berkas sinar katoda selalu membelok tertarik menuju pelat medan listrik positif (+).',
        'Berkas sinar katoda berhenti bergerak ketika melintasi kutub selatan medan magnet.',
        'Berkas sinar katoda memancarkan spektrum warna kontinyu saat dipanaskan tinggi.'
      ],
      correctAnswer: 0,
      hint: 'Hukum dasar elektrostatis: muatan sejenis tolak-menolak, muatan berbeda jenis tarik-menarik. Jika berkas ditarik ke kutub (+), maka muatannya adalah...',
      explanation:
        'Tepat! Karena berkas sinar katoda selalu ditarik ke pelat positif (+) dan ditolak oleh pelat negatif (-), Thomson membuktikan tanpa ragu bahwa partikel penyusun sinar katoda bermuatan listrik negatif (elektron).'
    },
    questions: [
      {
        question:
          'Bukti eksperimental paling krusial dari tabung sinar katoda Thomson yang membuktikan elektron bermuatan negatif adalah...',
        options: [
          'Berkas sinar katoda selalu membelok tertarik menuju pelat medan listrik positif (+).',
          'Berkas sinar katoda berhenti bergerak ketika melintasi kutub selatan medan magnet.',
          'Berkas sinar katoda memancarkan spektrum warna kontinyu saat dipanaskan tinggi.'
        ],
        correctAnswer: 0,
        hint: 'Hukum dasar elektrostatis: muatan sejenis tolak-menolak, muatan berbeda jenis tarik-menarik. Jika berkas ditarik ke kutub (+), maka muatannya adalah...',
        explanation:
          'Tepat! Karena berkas sinar katoda selalu ditarik ke pelat positif (+) dan ditolak oleh pelat negatif (-), Thomson membuktikan tanpa ragu bahwa partikel penyusun sinar katoda bermuatan listrik negatif (elektron).'
      },
      {
        question:
          'Bagaimana J.J. Thomson membuktikan bahwa elektron merupakan partikel penyusun universal pada semua materi?',
        options: [
          'Nilai rasio muatan terhadap massa (e/m) selalu konstan meski elektroda diubah.',
          'Gas yang keluar dari tabung katoda selalu menghasilkan bau khas yang serupa.',
          'Semua jenis logam menghasilkan pendaran warna hijau terang pada tabung hampa.'
        ],
        correctAnswer: 0,
        hint: 'Jika sifat suatu partikel tidak berubah walau sumber logam pembuatnya berbeda, berarti partikel itu adalah penyusun dasar semua atom.',
        explanation:
          'Benar sekali! Karena rasio e/m bernilai konstan terlepas dari bahan elektroda maupun jenis gas pengisi tabung, Thomson menyimpulkan elektron adalah konstituen fundamental dari seluruh atom.'
      },
      {
        question:
          'Bagaimanakah persebaran muatan positif di dalam atom digambarkan menurut model "Plum Pudding" Thomson?',
        options: [
          'Terkonsentrasi di satu titik pusat padat pejal yang dikelilingi ruang kosong.',
          'Tersebar merata membentuk bola bermuatan positif dengan elektron di dalamnya.',
          'Mengelilingi bagian luar atom sebagai lapisan tipis pelindung muatan inti.'
        ],
        correctAnswer: 1,
        hint: 'Bayangkan roti manis (muatan positif) dengan butiran kismis (elektron) yang bertaburan di dalamnya.',
        explanation:
          'Tepat! Thomson mengusulkan muatan positif tersebar merata seperti bola jelly/adonan roti, dengan elektron-elektron bermuatan negatif tersebar di dalamnya agar atom netral secara listrik.'
      },
      {
        question:
          'Bagaimanakah perbandingan massa satu elektron terhadap massa atom hidrogen berdasarkan temuan Thomson?',
        options: [
          'Massa elektron bernilai sangat kecil, yakni sekitar 1/1836 dari massa atom hidrogen.',
          'Massa elektron bernilai persis seimbang dengan massa keseluruhan atom hidrogen.',
          'Massa elektron bernilai hampir dua kali lipat lebih masif dibanding inti hidrogen.'
        ],
        correctAnswer: 0,
        hint: 'Massa elektron sangat kecil (~9,1 × 10⁻³¹ kg) dibandingkan proton (~1,67 × 10⁻²⁷ kg).',
        explanation:
          'Hebat! Pengukuran Thomson menghasilkan rasio e/m yang luar biasa besar, menunjukkan bahwa elektron adalah partikel subatomik yang massanya hanya sekitar 1/1836 dari massa atom hidrogen.'
      },
      {
        question:
          'Kelemahan konsep model atom Thomson yang kemudian dibuktikan keliru oleh Ernest Rutherford adalah...',
        options: [
          'Asumsi bahwa muatan positif tersebar tipis secara merata di seluruh volume atom.',
          'Pernyataan bahwa materi dapat menghantarkan arus listrik melalui medan katoda.',
          'Anggapan bahwa muatan negatif elektron tidak memiliki massa yang terukur.'
        ],
        correctAnswer: 0,
        hint: 'Jika muatan positif tersebar tipis merata, tidak mungkin ada partikel alfa berat yang terpantul balik saat menabrak atom.',
        explanation:
          'Luar biasa! Thomson mengasumsikan muatan positif tersebar merata. Rutherford membuktikan asumsi ini salah total melalui eksperimen lempeng emas tipis yang menemukan inti atom terpusat.'
      }
    ]
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
        'Fakta eksperimen lempeng emas Rutherford di mana sebagian kecil partikel alfa terpantul tajam (>90°) membuktikan...',
      options: [
        'Lempeng emas merupakan lapisan materi padat yang sama sekali tanpa ruang hampa.',
        'Muatan positif dan massa atom terkonsentrasi pada inti yang amat kecil dan pejal.',
        'Partikel alfa mengalami induksi magnetik kuat sehingga lintasan berbalik arah.'
      ],
      correctAnswer: 1,
      hint: 'Rutherford menganalogikan peristiwa ini seperti menembakkan peluru meriam 15 inci ke selembar kertas tisu, dan peluru itu memantul kembali mengenai penembaknya. Apa yang sanggup memantulkan partikel alfa berat bermuatan positif?',
      explanation:
        'Hebat! Pemantulan bersudut tajam hanya dimungkinkan jika partikel alfa menabrak suatu konsentrasi massa yang amat masif dan bermuatan positif sejenis (tolak-menolak Coulomb kuat), yaitu inti atom (nucleus).'
    },
    questions: [
      {
        question:
          'Fakta eksperimen lempeng emas Rutherford di mana sebagian kecil partikel alfa terpantul tajam (>90°) membuktikan...',
        options: [
          'Lempeng emas merupakan lapisan materi padat yang sama sekali tanpa ruang hampa.',
          'Muatan positif dan massa atom terkonsentrasi pada inti yang amat kecil dan pejal.',
          'Partikel alfa mengalami induksi magnetik kuat sehingga lintasan berbalik arah.'
        ],
        correctAnswer: 1,
        hint: 'Rutherford menganalogikan peristiwa ini seperti menembakkan peluru meriam 15 inci ke selembar kertas tisu, dan peluru itu memantul kembali mengenai penembaknya. Apa yang sanggup memantulkan partikel alfa berat bermuatan positif?',
        explanation:
          'Hebat! Pemantulan bersudut tajam hanya dimungkinkan jika partikel alfa menabrak suatu konsentrasi massa yang amat masif dan bermuatan positif sejenis (tolak-menolak Coulomb kuat), yaitu inti atom (nucleus).'
      },
      {
        question:
          'Mayoritas besar partikel alfa (>99,9%) yang menembus lempeng emas secara lurus tanpa hambatan membuktikan...',
        options: [
          'Sebagian besar volume keseluruhan atom pada hakikatnya merupakan ruang hampa.',
          'Partikel alfa memiliki sifat gelombang sehingga mampu melewati materi padat.',
          'Lempeng emas mengalami ionisasi termal akibat radiasi berkas partikel alfa.'
        ],
        correctAnswer: 0,
        hint: 'Jika atom padat merata, partikel alfa pasti akan terhambat dan terpantul di banyak tempat.',
        explanation:
          'Tepat sekali! Karena hampir seluruh partikel alfa melenggang lurus tanpa hambatan, Rutherford menyimpulkan sebagian besar volume atom adalah ruang kosong belaka.'
      },
      {
        question:
          'Berapakah perkiraan skala perbandingan antara diameter inti atom terhadap diameter keseluruhan atom?',
        options: [
          'Inti atom sekitar 100.000 kali lebih kecil daripada ukuran keseluruhan atom.',
          'Inti atom memiliki diameter sekitar separuh dari ukuran keseluruhan atomnya.',
          'Inti atom dan lapisan terluar elektron memiliki perbandingan dimensi seimbang.'
        ],
        correctAnswer: 0,
        hint: 'Ibarat sebutir kelereng kecil di tengah lapangan sepak bola yang sangat luas.',
        explanation:
          'Benar! Diameter atom sekitar 10⁻¹⁰ meter (1 Angstrom), sedangkan inti atom hanya sekitar 10⁻¹⁵ meter (1 femtometer), selisih 100.000 kali lipat!'
      },
      {
        question:
          'Model atom Rutherford sering digambarkan menyerupai miniatur sistem tata surya karena...',
        options: [
          'Elektron mengorbit inti atom di ruang hampa mirip gerak edar planet pada matahari.',
          'Inti atom memancarkan energi panas radiasi secara kontinu ke seluruh penjuru.',
          'Setiap elektron memiliki satelit subatomik tersendiri yang berputar teratur.'
        ],
        correctAnswer: 0,
        hint: 'Gaya tarik elektrostatik antara inti dan elektron memainkan peran mirip gaya gravitasi matahari terhadap planet.',
        explanation:
          'Sangat tepat! Rutherford mengusulkan elektron mengorbit inti yang bermuatan positif di pusat ruang hampa, menyerupai orbit planet mengitari matahari.'
      },
      {
        question:
          'Menurut teori elektrodinamika klasik Maxwell, anomali fatal yang menggugurkan model atom Rutherford adalah...',
        options: [
          'Elektron berakselerasi sentripetal harus meradiasikan energi dan runtuh ke inti.',
          'Muatan positif inti atom akan saling tolak-menolak dan meledakkan susunan inti.',
          'Elektron akan kehilangan massa dan bertransformasi menjadi gelombang cahaya.'
        ],
        correctAnswer: 0,
        hint: 'Fisika klasik meramalkan bahwa orbit melingkar bermuatan pasti memancarkan gelombang elektromagnetik dan kehilangan energi orbitnya.',
        explanation:
          'Luar biasa! Menurut teori Maxwell, elektron yang berakselerasi wajib memancarkan energi hingga akhirnya jatuh menabrak inti dalam 10⁻⁸ detik, yang berarti atom tidak mungkin stabil. Paradoks inilah yang dipecahkan oleh Niels Bohr.'
      }
    ]
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
        'Berdasarkan postulat Niels Bohr, kapan seberkas foton cahaya dengan energi spesifik dipancarkan oleh atom hidrogen?',
      options: [
        'Saat elektron beredar dengan kelajuan konstan pada lintasan orbit stasionernya.',
        'Saat elektron mengalami de-eksitasi berpindah ke tingkat energi yang lebih rendah.',
        'Saat elektron bertumbukan langsung dengan proton di dalam inti atom hidrogen.'
      ],
      correctAnswer: 1,
      hint: 'Prinsip konservasi energi: ketika elektron turun ke kulit yang berenergi lebih rendah, selisih energinya (ΔE = E₂ - E₁) harus dilepaskan ke lingkungan dalam bentuk foton cahaya.',
      explanation:
        'Tepat sekali! Pelepasan foton cahaya (emisi) terjadi hanya ketika elektron melompat dari tingkat energi tinggi (kulit luar) ke tingkat energi rendah (kulit dalam), memancarkan foton dengan energi persis sama dengan selisih tingkat energi orbitnya.'
    },
    questions: [
      {
        question:
          'Berdasarkan postulat Niels Bohr, kapan seberkas foton cahaya dengan energi spesifik dipancarkan oleh atom hidrogen?',
        options: [
          'Saat elektron beredar dengan kelajuan konstan pada lintasan orbit stasionernya.',
          'Saat elektron mengalami de-eksitasi berpindah ke tingkat energi yang lebih rendah.',
          'Saat elektron bertumbukan langsung dengan proton di dalam inti atom hidrogen.'
        ],
        correctAnswer: 1,
        hint: 'Prinsip konservasi energi: ketika elektron turun ke kulit yang berenergi lebih rendah, selisih energinya (ΔE = E₂ - E₁) harus dilepaskan ke lingkungan dalam bentuk foton cahaya.',
        explanation:
          'Tepat sekali! Pelepasan foton cahaya (emisi) terjadi hanya ketika elektron melompat dari tingkat energi tinggi (kulit luar) ke tingkat energi rendah (kulit dalam), memancarkan foton dengan energi persis sama dengan selisih tingkat energi orbitnya.'
      },
      {
        question:
          'Apa makna konsep "Keadaan Stasioner" (Stationary State) pada lintasan elektron menurut postulat Niels Bohr?',
        options: [
          'Lintasan kuantum di mana elektron berputar tanpa meradiasikan energi elektrostatik.',
          'Kondisi fisik di mana seluruh partikel di dalam atom berhenti bergerak sementara.',
          'Kedudukan khusus di mana elektron menempel erat pada permukaan inti atom.'
        ],
        correctAnswer: 0,
        hint: 'Kata "stasioner" mengacu pada kestabilan tingkat energi elektron yang bernilai tetap selama berada di kulit tersebut.',
        explanation:
          'Benar! Dalam orbit stasioner terkuantisasi, elektron tidak memancarkan energi gelombang elektromagnetik sehingga atom terhindar dari kehancuran spiral.'
      },
      {
        question:
          'Fenomena eksitasi elektron dalam atom menurut model kuantisasi energi Bohr terjadi apabila...',
        options: [
          'Elektron menyerap energi foton untuk berpindah ke kulit orbit yang lebih luar.',
          'Elektron melepaskan gelombang cahaya untuk melompat mendekati inti atom.',
          'Elektron pecah menjadi paket-paket gelombang energi berfrekuensi tinggi.'
        ],
        correctAnswer: 0,
        hint: 'Untuk naik ke tempat yang lebih tinggi, elektron membutuhkan asupan energi dari luar.',
        explanation:
          'Tepat! Eksitasi adalah proses penyerapan energi foton oleh elektron untuk melompat ke kulit orbit yang tingkat energinya lebih tinggi.'
      },
      {
        question:
          'Faktor utama yang menyebabkan spektrum emisi gas hidrogen menghasilkan garis warna diskret adalah...',
        options: [
          'Tingkat energi orbit elektron bernilai terkuantisasi secara diskret pasti.',
          'Gas hidrogen dalam tabung mengalami kontaminasi zat pewarna atmosferik.',
          'Frekuensi gelombang cahaya terbiaskan oleh ketebalan dinding kaca prisma.'
        ],
        correctAnswer: 0,
        hint: 'Hanya lompatan antar tingkat energi tertentu yang diperbolehkan, sehingga foton yang dilepaskan memiliki panjang gelombang khas yang terputus-putus (diskret).',
        explanation:
          'Sangat tepat! Kuantisasi energi orbit elektron menyebabkan selisih energi transisi elektron selalu bernilai pasti, menghasilkan spektrum garis diskret yang khas seperti sidik jari atom hidrogen.'
      },
      {
        question:
          'Keterbatasan utama dari model atom Bohr yang mendorong perumusan mekanika kuantum gelombang adalah...',
        options: [
          'Ketidakmampuan model menjelaskan spektrum emisi pada atom berelektron banyak.',
          'Penolakan Bohr terhadap keberadaan proton bermuatan positif di dalam inti.',
          'Kesalahan Bohr dalam menentukan besaran jari-jari orbit stasioner hidrogen.'
        ],
        correctAnswer: 0,
        hint: 'Begitu ada lebih dari satu elektron (terjadi interaksi tolak-menolak antar elektron), perhitungan rumus Bohr langsung meleset.',
        explanation:
          'Luar biasa! Model Bohr hanya presisi untuk atom berelektron satu (hidrogen). Bohr tidak dapat menjelaskan spektrum atom berelektron banyak, efek pemisahan garis dalam medan magnet (efek Zeeman), serta mengabaikan sifat gelombang elektron.'
      }
    ]
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
        'Perbedaan konseptual paling mendasar antara istilah "Orbit" pada Bohr dengan "Orbital" pada mekanika kuantum adalah...',
      options: [
        'Orbit merupakan lintasan lingkaran 2D, sedangkan Orbital adalah ruang probabilitas 3D.',
        'Orbit berada di dalam inti atom, sedangkan Orbital menempati seluruh lapisan luar.',
        'Orbit mengatur gerak proton positif, sedangkan Orbital mengatur pergerakan elektron.'
      ],
      correctAnswer: 0,
      hint: 'Dalam mekanika kuantum berlaku Prinsip Ketidakpastian Heisenberg: lintasan pasti tidak ada, yang ada hanyalah awan kebolehjadian ruang (orbital).',
      explanation:
        'Sangat tepat! Orbit dalam model Bohr adalah garis edar lingkaran pasti seperti planet, sedangkan Orbital dalam mekanika gelombang kuantum adalah daerah tiga dimensi dengan peluang atau kerapatan probabilitas terbesar menemukan elektron.'
    },
    questions: [
      {
        question:
          'Perbedaan konseptual paling mendasar antara istilah "Orbit" pada Bohr dengan "Orbital" pada mekanika kuantum adalah...',
        options: [
          'Orbit merupakan lintasan lingkaran 2D, sedangkan Orbital adalah ruang probabilitas 3D.',
          'Orbit berada di dalam inti atom, sedangkan Orbital menempati seluruh lapisan luar.',
          'Orbit mengatur gerak proton positif, sedangkan Orbital mengatur pergerakan elektron.'
        ],
        correctAnswer: 0,
        hint: 'Dalam mekanika kuantum berlaku Prinsip Ketidakpastian Heisenberg: lintasan pasti tidak ada, yang ada hanyalah awan kebolehjadian ruang (orbital).',
        explanation:
          'Sangat tepat! Orbit dalam model Bohr adalah garis edar lingkaran pasti seperti planet, sedangkan Orbital dalam mekanika gelombang kuantum adalah daerah tiga dimensi dengan peluang atau kerapatan probabilitas terbesar menemukan elektron.'
      },
      {
        question:
          'Konsekuensi fisis dari Prinsip Ketidakpastian Heisenberg terhadap visualisasi kedudukan elektron dalam atom adalah...',
        options: [
          'Mustahil menetapkan posisi dan momentum elektron secara serentak dengan presisi mutlak.',
          'Kecepatan edar elektron akan berkurang secara bertahap saat mendekati inti atom.',
          'Muatan negatif elektron akan terdistribusi ulang menjadi gelombang netral statis.'
        ],
        correctAnswer: 0,
        hint: 'Makin pasti kita mengetahui posisi elektron, makin tidak pasti kita mengetahui momentum/kecepatannya (Δx · Δp ≥ ℏ/2).',
        explanation:
          'Benar! Sifat gelombang partikel subatomik membuat posisi dan momentum elektron tidak dapat ditentukan serentak secara eksak, sehingga konsep lintasan orbit lingkaran gugur.'
      },
      {
        question:
          'Dalam mekanika gelombang Schrödinger, kuadrat dari fungsi gelombang (|Ψ|²) pada suatu titik ruang merepresentasikan...',
        options: [
          'Kerapatan probabilitas kebolehjadian menemukan posisi elektron di daerah ruang tersebut.',
          'Energi potensial minimum yang diperlukan untuk melepaskan elektron dari kulit terdalam.',
          'Kecepatan putar sudut elektron ketika melakukan transisi tingkat energi kuantum.'
        ],
        correctAnswer: 0,
        hint: 'Awan elektron yang semakin pekat titik-titiknya menandakan nilai |Ψ|² yang semakin tinggi.',
        explanation:
          'Tepat sekali! Nilai |Ψ|² (densitas probabilitas) menunjukkan peluang kebolehjadian terbesar (biasanya diambil batas 90-95%) untuk menemukan elektron di daerah ruang tersebut.'
      },
      {
        question:
          'Berdasarkan bilangan kuantum azimut (l), bentuk spasial tiga dimensi dari orbital subkulit s dan subkulit p adalah...',
        options: [
          'Orbital s simetri bola bulat 3D, sedangkan orbital p berbentuk cuping balon terpilin.',
          'Orbital s berbentuk cincin datar konsentris, sedangkan orbital p berbentuk tabung memanjang.',
          'Kedua orbital memiliki bentuk elips identik namun berbeda ukuran volume spasial.'
        ],
        correctAnswer: 0,
        hint: 'Orbital s memiliki bilangan kuantum azimuth l = 0 (simetri bola), sedangkan orbital p memiliki l = 1 dengan 3 orientasi ruang (px, py, pz).',
        explanation:
          'Sangat tepat! Orbital s memiliki simetri bola di sekeliling inti, sedangkan orbital p memiliki dua cuping seperti balon terpilin yang terorientasi pada sumbu x, y, atau z.'
      },
      {
        question:
          'Mengapa model atom mekanika kuantum menjadi standar ilmiah yang diaplikasikan dalam sains modern saat ini?',
        options: [
          'Mampu menerangkan struktur atom banyak elektron, ikatan molekul, dan fenomena nanoteknologi.',
          'Mampu membuktikan bahwa partikel subatomik tidak memiliki keterikatan massa materi.',
          'Menjamin bahwa reaksi kimia dapat dipicu tanpa adanya perpindahan muatan listrik.'
        ],
        correctAnswer: 0,
        hint: 'Mekanika kuantum berhasil menyatukan sifat partikel dan gelombang serta memprediksi konfigurasi elektron seluruh unsur dalam tabel periodik.',
        explanation:
          'Luar biasa! Model Mekanika Kuantum mampu menjelaskan secara matematis dan eksperimental seluruh perilaku atom berelektron banyak, pembentukan ikatan kovalen, sifat kemagnetan, hingga teknologi semikonduktor masa kini.'
      }
    ]
  }
}
