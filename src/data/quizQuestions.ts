import type { QuizQuestion } from '../types/quiz'

export const QUESTION_SET_VERSION = 'v2.1.0-fase-e-25soal-acak'

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // =========================================================================
  // BLOK 1: GAGASAN ATOM DEMOCRITUS (Soal 1 - 5)
  // =========================================================================
  {
    id: 1,
    type: 'multiple_choice',
    title: 'Gagasan Awal Materi (Democritus)',
    conceptTag: 'Democritus - Hakikat Partikel Dasar',
    question: 'Berdasarkan pemikiran filsafat alam Yunani Kuno oleh Democritus (±400 SM), apakah makna hakiki dari terminologi "Atomos"?',
    options: [
      'Partikel materi berukuran mikroskopik yang memiliki muatan listrik netral.',
      'Partikel fundamental pejal dan padat yang mustahil dipotong atau dibagi lagi.',
      'Gelombang energi tak kasat mata yang terus memancarkan spektrum cahaya diskret.',
      'Zat cair dasar yang mengisi seluruh ruang alam semesta secara berkesinambungan.'
    ],
    correctAnswer: 1, // Kunci: B
    hint: 'Perhatikan asal kata Yunani "a-" (artinya tidak) dan "tomos" (artinya terpotong). Democritus memandang adanya batas akhir pembelahan materi.',
    explanation: 'Terminologi "Atomos" berasal dari bahasa Yunani "a" (tidak) dan "tomos" (terbagi/terpotong). Democritus menyimpulkan bahwa pemotongan materi memiliki batas akhir berupa unit terkecil yang tak terbagi.'
  },
  {
    id: 2,
    type: 'multiple_choice',
    title: 'Ruang Hampa dalam Kosmologi Democritus',
    conceptTag: 'Democritus - Konsep Ruang Hampa',
    question: 'Menurut Democritus, keberadaan ruang hampa (void) di antara partikel-partikel atomos mutlak diperlukan karena...',
    options: [
      'Menjadi sumber energi kinetik alami yang menggerakkan partikel di alam semesta.',
      'Menyerap kelebihan massa partikel agar massa jenis zat tetap bernilai konstan.',
      'Memberikan medium hampa yang memungkinkan atomos bergerak dan saling bertumbukan.',
      'Menghantarkan gelombang elektromagnetik dari satu atomos menuju atomos lainnya.'
    ],
    correctAnswer: 2, // Kunci: C
    hint: 'Jika alam semesta terisi penuh materi tanpa ada kekosongan, maka partikel-partikel padat tidak akan memiliki ruang untuk berpindah posisi.',
    explanation: 'Democritus meyakini bahwa realitas terdiri dari atomos dan ruang hampa (void). Ruang hampa mutlak dibutuhkan sebagai ruang gerak bagi atom-atom untuk berpindah dan membentuk kombinasi materi baru.'
  },
  {
    id: 3,
    type: 'multiple_choice',
    title: 'Invariansi Sifat Hakiki Materi (Democritus)',
    conceptTag: 'Democritus - Sifat Intrinsik Materi',
    question: 'Mengapa sepotong emas murni yang dipotong berulang kali hingga menjadi serbuk sangat halus tetap mempertahankan warna dan kilau khas emas?',
    options: [
      'Interaksi gesekan udara luar secara kontinu melapisi serbuk dengan partikel berkilau.',
      'Pemotongan mekanik memicu reaksi fusi spontan yang memperbarui kilau warna emas.',
      'Atomos emas menyerap partikel cahaya tampak dan memancarkannya kembali ke udara.',
      'Sifat fisik dan kimiawi materi melekat secara intrinsik pada partikel atomos penyusunnya.'
    ],
    correctAnswer: 3, // Kunci: D
    hint: 'Perubahan ukuran secara makroskopik tidak mengubah identitas dan karakteristik mendasar dari unit submikroskopik zat.',
    explanation: 'Democritus berpendapat bahwa pemotongan fisik hanya memisahkan kelompok-kelompok partikel, bukan mengubah esensi atau sifat intrinsik dari atomos emas penyusun materi tersebut.'
  },
  {
    id: 4,
    type: 'multiple_choice',
    title: 'Perdebatan Pemikiran Aristoteles vs Democritus',
    conceptTag: 'Democritus - Kontroversi Materi Kontinu',
    question: 'Gagasan atomos Democritus sempat diabaikan selama berabad-abad karena ditolak oleh Aristoteles. Apa argumen penolakan utama Aristoteles?',
    options: [
      'Aristoteles membuktikan bahwa partikel atomos dapat dihancurkan menggunakan reaksi kimia asam.',
      'Aristoteles menolak keberadaan ruang hampa dan meyakini materi tersusun dari kontinuitas 4 elemen.',
      'Aristoteles menganggap ukuran atomos terlalu besar sehingga mengganggu kerapatan udara.',
      'Aristoteles telah mendeteksi lintasan elektron menggunakan prisma optik di laboratoriumnya.'
    ],
    correctAnswer: 1, // Kunci: B
    hint: 'Filsafat Aristoteles berpegang pada doktrin "horror vacui" (alam membenci kehampaan) dan materi dapat terus dibagi tanpa henti.',
    explanation: 'Aristoteles menolak konsep ruang hampa dan meyakini materi bersifat kontinu yang tersusun atas variasi 4 elemen (tanah, air, udara, api), sehingga paham atomos terabaikan hingga era kimia kuantitatif.'
  },
  {
    id: 5,
    type: 'multiple_choice',
    title: 'Evaluasi Epistemologis Teori Democritus',
    conceptTag: 'Democritus - Batasan Metode Filosofis',
    question: 'Ditinjau dari kacamata metodologi sains modern, apakah kelemahan epistemologis paling utama dari teori atomos Democritus?',
    options: [
      'Dirumuskan melalui spekulasi filosofis rasional murni tanpa pembuktian data eksperimen empiris.',
      'Menggunakan instrumen mikroskopik kuno yang tingkat presisi pengukurannya belum terkalibrasi.',
      'Hanya berlaku untuk material padat dan gagal diterapkan pada zat berbentuk gas serta plasma.',
      'Keliru dalam menghitung nilai muatan listrik yang terdapat di dalam inti partikel atomos.'
    ],
    correctAnswer: 0, // Kunci: A
    hint: 'Sains modern menuntut hipotesis yang dapat diuji (testable and falsifiable) melalui observasi kuantitatif di laboratorium.',
    explanation: 'Gagasan Democritus merupakan pemikiran filosofis rasionalis (Gedankenexperiment), belum berbasis eksperimen empiris laboratorium, sehingga baru menjadi teori ilmiah resmi setelah diteliti oleh John Dalton.'
  },

  // =========================================================================
  // BLOK 2: TEORI ATOM JOHN DALTON (Soal 6 - 10)
  // =========================================================================
  {
    id: 6,
    type: 'multiple_choice',
    title: 'Landasan Stoikiometri Reaksi Kimia (Dalton)',
    conceptTag: 'Dalton - Hukum Perbandingan Berganda',
    question: 'Unsur Karbon (C) dan Oksigen (O) dapat membentuk dua senyawa berlainan, yaitu CO dan CO₂. Fakta ini menjadi dasar perumusan hukum kimia oleh Dalton, yakni...',
    options: [
      'Hukum Kekekalan Energi Mekanik pada sistem tertutup.',
      'Hukum Perbandingan Berganda (Law of Multiple Proportions).',
      'Hukum Perbandingan Volume Gas Gay-Lussac pada suhu konstan.',
      'Hukum Dinamika Partikel Gravitasi pada reaksi eksoterm.'
    ],
    correctAnswer: 1, // Kunci: B
    hint: 'Jika massa salah satu unsur dibuat tetap (12 g C), perbandingan massa oksigen pada CO (16 g) dan CO₂ (32 g) berbanding sebagai 1 : 2.',
    explanation: 'Hukum Perbandingan Berganda Dalton menyatakan bahwa bila dua unsur membentuk lebih dari satu senyawa, rasio massa unsur kedua yang terikat pada massa tetap unsur pertama merupakan bilangan bulat sederhana.'
  },
  {
    id: 7,
    type: 'multiple_choice',
    title: 'Hakikat Reaksi Kimia Menurut Postulat Dalton',
    conceptTag: 'Dalton - Konservasi Atom dalam Reaksi',
    question: 'Bagaimanakah John Dalton menjelaskan mekanisme mendasar yang berlangsung ketika dua zat kimia saling bereaksi?',
    options: [
      'Partikel atom berevolusi membentuk struktur materi baru melalui pelepasan muatan radiasi.',
      'Terjadi proses penataan ulang, penggabungan, atau pemisahan atom tanpa ada atom yang musnah.',
      'Terjadi peleburan massa atom menjadi gelombang energi yang mengisi kerapatan wadah reaksi.',
      'Sebagian atom membelah menjadi partikel subatomik yang menyerap energi aktivasi larutan.'
    ],
    correctAnswer: 1, // Kunci: B
    hint: 'Postulat ini sangat selaras dengan Hukum Kekekalan Massa Lavoisier: massa total zat sebelum dan sesudah reaksi selalu sama.',
    explanation: 'Menurut Dalton, reaksi kimia hanyalah proses pemisahan, penggabungan, atau penataan ulang atom-atom; tidak ada atom yang diciptakan atau dimusnahkan dalam reaksi kimia biasa.'
  },
  {
    id: 8,
    type: 'multiple_choice',
    title: 'Keterbatasan Postulat Kesamaan Massa Unsur Dalton',
    conceptTag: 'Dalton - Penemuan Isotop',
    question: 'Pernyataan postulat Dalton yang menyatakan bahwa seluruh atom dari unsur yang sama pasti memiliki massa identik pada akhirnya gugur karena...',
    options: [
      'Atom-atom unsur sejenis dapat bertukar elektron valensi secara spontan di udara.',
      'Massa atom dapat menyusut ketika zat padat mengalami transisi perubahan wujud cair.',
      'Ditemukan fenomena isotop, yakni atom sejenis dengan jumlah neutron berbeda.',
      'Inti atom dapat menyerap partikel foton sehingga kerapatan massanya berfluktuasi.'
    ],
    correctAnswer: 2, // Kunci: C
    hint: 'Isotop adalah atom-atom dari unsur yang sama (nomor atom sama) namun memiliki nomor massa berbeda, seperti Karbon-12 dan Karbon-14.',
    explanation: 'Penemuan isotop membuktikan bahwa atom-atom dari unsur yang sama dapat memiliki massa yang sedikit berbeda karena perbedaan jumlah neutron di dalam inti atom.'
  },
  {
    id: 9,
    type: 'multiple_choice',
    title: 'Kelemahan Model Bola Pejal Terhadap Muatan Listrik',
    conceptTag: 'Dalton - Fenomena Kelistrikan Materi',
    question: 'Anomali paling fundamental dari model atom bola pejal Dalton yang memicu lahirnya penelitian tabung lucutan gas adalah...',
    options: [
      'Model gagal memprediksi rasio stoikiometri pembentukan senyawa hidrokarbon sederhana.',
      'Model tidak dapat membedakan antara massa jenis zat padat dengan kerapatan zat gas.',
      'Model mengabaikan hukum kekekalan momentum partikel saat terjadi tumbukan lenting.',
      'Model tidak mampu menjelaskan gejala kelistrikan statis dan daya hantar listrik zat.'
    ],
    correctAnswer: 3, // Kunci: D
    hint: 'Jika atom benar-benar pejal tanpa isi dan netral tanpa struktur dalam, dari manakah asal muatan listrik ketika sisir plastik digosokkan ke rambut?',
    explanation: 'Model bola pejal Dalton tidak memiliki komponen bermuatan listrik, sehingga tidak sanggup menjelaskan mengapa materi dapat menunjukkan gejala elektrostatis saat digosok.'
  },
  {
    id: 10,
    type: 'multiple_choice',
    title: 'Visualisasi Model Atom John Dalton',
    conceptTag: 'Dalton - Analogi Bola Biliar',
    question: 'Dalam literatur teks kimia standar, bentuk fisis model atom yang dirumuskan oleh John Dalton paling tepat dianalogikan sebagai...',
    options: [
      'Bola biliar pejal yang padat, keras, dan homogen tanpa adanya rongga internal.',
      'Roti kismis dengan butiran muatan negatif yang tersebar merata pada permukaan.',
      'Miniatur tata surya dengan lintasan orbit melingkar yang mengitari pusat massa.',
      'Awan kabut berdensitas dinamis yang posisinya diatur oleh persamaan probabilitas.'
    ],
    correctAnswer: 0, // Kunci: A
    hint: 'Dalton membayangkan atom sebagai entitas padat pejal yang tidak memiliki bagian dalam yang dapat dibuka atau dibagi lagi.',
    explanation: 'Dalton memvisualisasikan atom sebagai bola pejal (solid sphere / billiard ball) yang masif, tak berongga, dan merupakan unit terkecil materi yang tak berstruktur dalam.'
  },

  // =========================================================================
  // BLOK 3: MODEL ATOM J.J. THOMSON (Soal 11 - 15)
  // =========================================================================
  {
    id: 11,
    type: 'multiple_choice',
    title: 'Eksperimen Sinar Katoda J.J. Thomson',
    conceptTag: 'Thomson - Pembuktian Muatan Negatif',
    question: 'Dalam eksperimen tabung lucutan gas (CRT) tahun 1897, bukti eksperimental apa yang memastikan bahwa berkas sinar katoda bermuatan negatif?',
    options: [
      'Berkas sinar katoda berhenti bergerak ketika melintasi kutub magnet berkekuatan tinggi.',
      'Berkas sinar selalu membelok tertarik ke arah pelat medan listrik bermuatan positif (+).',
      'Berkas sinar katoda menghasilkan radiasi kalor tinggi yang melelehkan tabung kaca vakum.',
      'Berkas sinar katoda memantul kembali dengan sudut lebar saat mengenai gas mulia inert.'
    ],
    correctAnswer: 1, // Kunci: B
    hint: 'Berdasarkan hukum Coulomb, muatan yang berlawanan tanda akan saling tarik-menarik, sedangkan muatan sejenis akan saling tolak-menolak.',
    explanation: 'Karena berkas sinar katoda selalu dibelokkan mendekati pelat medan listrik positif (+) dan menjauhi pelat negatif (-), Thomson membuktikan bahwa partikel sinar katoda bermuatan negatif.'
  },
  {
    id: 12,
    type: 'multiple_choice',
    title: 'Universalitas Partikel Elektron (Thomson)',
    conceptTag: 'Thomson - Konstansi Rasio e/m',
    question: 'Bagaimana J.J. Thomson membuktikan secara ilmiah bahwa elektron merupakan partikel dasar penyusun SEMUA jenis atom materi?',
    options: [
      'Frekuensi spektrum cahaya yang dipancarkan tabung lucutan selalu bernilai sama pada setiap percobaan.',
      'Massa gas di dalam tabung lucutan selalu berkurang secara proporsional seiring waktu katoda menyala.',
      'Nilai rasio muatan terhadap massa (e/m) selalu konstan meski elektroda logam dan jenis gas diubah.',
      'Arus listrik yang dihasilkan tabung vakum mampu menyalakan filamen pemanas secara mandiri.'
    ],
    correctAnswer: 2, // Kunci: C
    hint: 'Jika karakteristik spesifik suatu partikel (rasio e/m) bernilai identik terlepas dari bahan asal yang digunakan, maka partikel tersebut bersifat universal.',
    explanation: 'Thomson menguji berbagai logam katoda dan gas pengisi tabung. Nilai rasio e/m yang selalu konstan (1,76 × 10¹¹ C/kg) membuktikan bahwa elektron adalah konstituen universal di semua atom.'
  },
  {
    id: 13,
    type: 'multiple_choice',
    title: 'Struktur Distribusi Muatan Model Roti Kismis',
    conceptTag: 'Thomson - Plum Pudding Model',
    question: 'Pada model "Roti Kismis" (Plum Pudding) yang diajukan oleh J.J. Thomson, bagaimanakah susunan muatan positif di dalam atom digambarkan?',
    options: [
      'Terkonsentrasi penuh pada satu titik inti padat yang bervolume amat kecil di pusat ruang hampa.',
      'Mengelilingi permukaan terluar atom membentuk cangkang pelindung bagi pergerakan elektron.',
      'Berpasang-pasangan membentuk dipol listrik stasioner yang berosilasi pada sumbu koordinat.',
      'Tersebar merata membentuk bola bermuatan positif yang menaungi elektron-elektron di dalamnya.'
    ],
    correctAnswer: 3, // Kunci: D
    hint: 'Thomson belum menemukan konsep inti atom. Muatan positif dipandang sebagai fluida/materi menyebar seperti adonan roti atau daging semangka.',
    explanation: 'Thomson mengusulkan bahwa muatan positif tersebar secara difus dan merata di seluruh volume bola atom, dengan elektron bermuatan negatif tertanam di dalamnya agar total atom netral.'
  },
  {
    id: 14,
    type: 'multiple_choice',
    title: 'Skala Relatif Massa Elektron',
    conceptTag: 'Thomson - Rasio Massa Elektron',
    question: 'Berdasarkan hasil pengukuran rasio e/m oleh Thomson, bagaimanakah perbandingan massa satu elektron terhadap atom teringan (hidrogen)?',
    options: [
      'Massa elektron bernilai amat kecil, yakni hanya berkisar 1/1836 dari massa atom hidrogen.',
      'Massa elektron bernilai hampir seimbang dengan keseluruhan massa dari satu atom hidrogen.',
      'Massa elektron bernilai dua kali lipat lebih masif dibanding massa proton pada inti hidrogen.',
      'Massa elektron setara dengan massa partikel alfa yang dipancarkan oleh bahan radioaktif.'
    ],
    correctAnswer: 0, // Kunci: A
    hint: 'Massa elektron sangat ringan (~9,1 × 10⁻³¹ kg) dibandingkan massa atom hidrogen (~1,67 × 10⁻²⁷ kg).',
    explanation: 'Nilai rasio e/m yang sangat besar membuktikan bahwa elektron adalah partikel subatomik sejati yang massanya amat ringan, hanya sekitar 1/1836 dari massa atom hidrogen.'
  },
  {
    id: 15,
    type: 'multiple_choice',
    title: 'Kelemahan Model Atom J.J. Thomson',
    conceptTag: 'Thomson - Ketiadaan Inti Terpusat',
    question: 'Kelemahan paling krusial dari model atom Thomson yang kemudian diuji dan dibongkar oleh Ernest Rutherford adalah...',
    options: [
      'Pernyataan bahwa elektron memiliki massa yang dapat diukur melalui neraca analitik kimia.',
      'Asumsi bahwa muatan positif tersebar tipis secara merata tanpa adanya inti atom terpusat.',
      'Anggapan bahwa atom dalam keadaan dasar bersifat netral secara kelistrikan elektrostatik.',
      'Kegagalan menerangkan mengapa zat padat dapat bereaksi spontan dengan larutan elektrolit.'
    ],
    correctAnswer: 1, // Kunci: B
    hint: 'Jika muatan positif tersebar tipis merata, partikel alfa yang berat dan berenergi tinggi tidak mungkin mengalami hamburan balik dengan sudut tajam.',
    explanation: 'Asumsi Thomson bahwa muatan positif tersebar tipis di seluruh atom terbukti keliru ketika Rutherford menemukan bahwa seluruh muatan positif terkonsentrasi di inti yang sangat kecil dan padat.'
  },

  // =========================================================================
  // BLOK 4: MODEL ATOM ERNEST RUTHERFORD (Soal 16 - 20)
  // =========================================================================
  {
    id: 16,
    type: 'multiple_choice',
    title: 'Fenomena Pantulan Partikel Alfa (Rutherford)',
    conceptTag: 'Rutherford - Penemuan Inti Atom',
    question: 'Pada eksperimen hamburan lempeng emas tipis, fakta bahwa sebagian kecil partikel alfa terpantul dengan sudut tajam (>90°) membuktikan...',
    options: [
      'Lempeng emas merupakan lapisan materi padat homogen yang sama sekali tidak berongga.',
      'Partikel alfa mengalami induksi medan magnet sehingga arah lintasannya berputar balik.',
      'Seluruh massa dan muatan positif atom terkonsentrasi pada inti yang amat kecil dan pejal.',
      'Elektron-elektron pada kulit atom bertabrakan lenting sempurna dengan partikel penembak.'
    ],
    correctAnswer: 2, // Kunci: C
    hint: 'Rutherford menganalogikan peristiwa ini seperti peluru meriam yang memantul kembali setelah menabrak selembar kertas tisu. Diperlukan pusat massa yang sangat padat dan bermuatan positif sejenis.',
    explanation: 'Pemantulan sudut tajam hanya dapat terjadi jika partikel alfa menabrak konsentrasi massa dan muatan positif yang sangat pejal, padat, dan terkonsentrasi di pusat, yaitu inti atom (nucleus).'
  },
  {
    id: 17,
    type: 'multiple_choice',
    title: 'Dominasi Ruang Hampa di Dalam Atom',
    conceptTag: 'Rutherford - Konsep Ruang Hampa Atom',
    question: 'Fakta bahwa sebagian besar (>99,9%) partikel alfa melintasi lempeng emas secara lurus tanpa mengalami pembelokan membuktikan bahwa...',
    options: [
      'Partikel alfa tidak memiliki muatan listrik sehingga tidak dapat berinteraksi dengan atom.',
      'Lempeng emas memiliki pori-pori makroskopik yang sengaja dibuat dalam proses manufaktur.',
      'Gaya gravitasi inti atom menarik berkas partikel alfa sehingga lintasannya tetap lurus.',
      'Sebagian besar volume keseluruhan dari sebuah atom pada hakikatnya adalah ruang hampa.'
    ],
    correctAnswer: 3, // Kunci: D
    hint: 'Jika atom padat merata seperti roti kismis, berkas partikel alfa berenergi tinggi akan mengalami defleksi seragam di banyak titik.',
    explanation: 'Karena hampir seluruh partikel alfa melintas lurus tanpa hambatan, Rutherford menyimpulkan bahwa mayoritas volume atom (>99,99%) adalah ruang hampa kosong.'
  },
  {
    id: 18,
    type: 'multiple_choice',
    title: 'Skala Dimensi Inti Terhadap Volume Atom',
    conceptTag: 'Rutherford - Dimensi Spasial Inti Atom',
    question: 'Berdasarkan kalkulasi data hamburan Rutherford, bagaimanakah perbandingan diameter inti atom terhadap diameter atom secara keseluruhan?',
    options: [
      'Diameter inti atom memiliki dimensi sekitar separuh dari jari-jari keseluruhan atomnya.',
      'Diameter inti atom bernilai sekitar 100.000 kali lebih kecil daripada diameter atomnya.',
      'Diameter inti atom bernilai persis seimbang dengan jari-jari orbit lintasan elektron.',
      'Diameter inti atom bernilai sepuluh kali lebih besar daripada panjang gelombang cahaya.'
    ],
    correctAnswer: 1, // Kunci: B
    hint: 'Diameter atom berorde ~10⁻¹⁰ meter (1 Angstrom), sedangkan diameter inti berorde ~10⁻¹⁵ meter (1 femtometer).',
    explanation: 'Perbandingan diameter inti (~10⁻¹⁵ m) terhadap diameter atom (~10⁻¹⁰ m) adalah sekitar 1 : 100.000, membuktikan betapa terkonsentrasinya materi di titik pusat atom.'
  },
  {
    id: 19,
    type: 'multiple_choice',
    title: 'Analogi Sistem Tata Surya Model Rutherford',
    conceptTag: 'Rutherford - Analogi Planetary Model',
    question: 'Mengapa model atom yang dirumuskan oleh Ernest Rutherford sering disebut sebagai miniatur sistem tata surya (Planetary Model)?',
    options: [
      'Elektron bermuatan negatif mengelilingi inti bermuatan positif di ruang hampa mirip planet mengitari matahari.',
      'Inti atom memancarkan radiasi panas nuklir yang menyinari elektron layaknya matahari di siang hari.',
      'Setiap elektron memiliki orbit berbentuk elips sempurna dengan kecepatan putar yang sama persis.',
      'Massa inti atom menyusut secara bertahap akibat tarikan medan gravitasi elektron-elektron luar.'
    ],
    correctAnswer: 0, // Kunci: A
    hint: 'Gaya tarik elektrostatik Coulomb antara inti positif dan elektron negatif memainkan peran analog dengan gaya gravitasi matahari terhadap planet.',
    explanation: 'Rutherford menggambarkan elektron beredar mengitari inti atom bermuatan positif di pusat ruang hampa, menyerupai pola edar planet-planet yang mengitari matahari di tata surya.'
  },
  {
    id: 20,
    type: 'multiple_choice',
    title: 'Paradoks Elektrodinamika Klasik Maxwell',
    conceptTag: 'Rutherford - Keruntuhan Spiral Maxwell',
    question: 'Menurut teori elektrodinamika klasik Maxwell, anomali teoritis yang tidak dapat dijawab oleh model atom Rutherford adalah...',
    options: [
      'Muatan positif inti atom akan saling bertolakan hebat sehingga inti meledak seketika.',
      'Elektron yang mengalami percepatan melingkar harus meradiasikan energi dan runtuh ke inti.',
      'Elektron akan kehilangan massa dan bertransformasi seutuhnya menjadi partikel foton netral.',
      'Kecepatan putar elektron akan melebihi kelajuan cahaya sehingga melanggar teori relativitas.'
    ],
    correctAnswer: 1, // Kunci: B
    hint: 'Fisika klasik menyatakan muatan listrik berakselerasi sentripetal wajib memancarkan gelombang elektromagnetik dan kehilangan energi orbitnya.',
    explanation: 'Menurut fisika klasik Maxwell, elektron yang berputar melingkar terus kehilangan energi melalui radiasi dan akan spiral jatuh ke inti dalam tempo 10⁻⁸ detik. Namun kenyataannya atom stabil, memicu lahirnya teori kuantum Bohr.'
  },

  // =========================================================================
  // BLOK 5: MODEL BOHR & MEKANIKA KUANTUM (Soal 21 - 25)
  // =========================================================================
  {
    id: 21,
    type: 'multiple_choice',
    title: 'Kuantisasi Orbit & Keadaan Stasioner (Bohr)',
    conceptTag: 'Bohr - Postulat Keadaan Stasioner',
    question: 'Bagaimana Niels Bohr mengatasi paradoks keruntuhan elektron Rutherford melalui postulat keadaan stasionernya?',
    options: [
      'Menyatakan bahwa elektron memiliki muatan netral selama berada di dalam kulit atom hidrogen.',
      'Menambahkan partikel neutron yang berfungsi mengisolasi pancaran radiasi elektromagnetik.',
      'Menetapkan bahwa elektron stabil pada orbit kuantum tertentu tanpa meradiasikan energi.',
      'Membuktikan bahwa percepatan sentripetal elektron bernilai nol saat mengitari inti atom.'
    ],
    correctAnswer: 2, // Kunci: C
    hint: 'Bohr mempostulatkan tingkat orbit stasioner di mana mekanika elektrodinamika klasik radiatif tidak berlaku.',
    explanation: 'Bohr mempostulatkan bahwa elektron hanya beredar pada orbit stasioner terkuantisasi tertentu (n = 1, 2, 3...) di mana elektron tidak memancarkan radiasi energi elektromagnetik.'
  },
  {
    id: 22,
    type: 'multiple_choice',
    title: 'Mekanisme Emisi Foton Spektrum Garis',
    conceptTag: 'Bohr - Transisi Energi De-eksitasi',
    question: 'Kapan sebuah atom hidrogen memancarkan seberkas foton cahaya dengan panjang gelombang dan warna spesifik menurut model Bohr?',
    options: [
      'Saat elektron bergerak dengan kecepatan sudut konstan di dalam lintasan orbit stasionernya.',
      'Saat elektron menyerap energi foton ultraviolet untuk melompat menuju ke tingkat eksitasi.',
      'Saat proton di dalam inti atom hidrogen bertukar posisi koordinat dengan neutron terdekat.',
      'Saat elektron mengalami de-eksitasi melompat dari kulit luar menuju ke kulit yang lebih dalam.'
    ],
    correctAnswer: 3, // Kunci: D
    hint: 'Konservasi energi: saat elektron turun ke tingkat energi yang lebih rendah, selisih energinya (ΔE = E₂ - E₁) dilepaskan sebagai foton cahaya (emisi).',
    explanation: 'Emisi foton cahaya hanya terjadi ketika elektron melompat turun (de-eksitasi) dari kulit berenergi tinggi ke kulit berenergi lebih rendah, melepaskan foton dengan energi persis ΔE = h · c / λ.'
  },
  {
    id: 23,
    type: 'multiple_choice',
    title: 'Keterbatasan Spektral Model Atom Bohr',
    conceptTag: 'Bohr - Kegagalan Atom Multielektron',
    question: 'Keterbatasan utama model atom Niels Bohr yang memicu pengembangan mekanika gelombang kuantum adalah...',
    options: [
      'Model Bohr menolak konsep adanya inti atom bermuatan positif yang dirumuskan Rutherford.',
      'Model hanya berhasil akurat untuk atom berelektron tunggal dan gagal pada atom banyak elektron.',
      'Model Bohr keliru dalam menentukan nilai tetapan konstanta Planck pada reaksi eksitasi.',
      'Model mengasumsikan elektron memiliki sifat gelombang materi yang terlalu dominan di inti.'
    ],
    correctAnswer: 1, // Kunci: B
    hint: 'Rumus Bohr sangat presisi untuk H, He⁺, Li²⁺ (berelektron satu), namun tidak dapat memprediksi spektrum atom yang memiliki banyak elektron.',
    explanation: 'Model Bohr hanya presisi untuk sistem berelektron tunggal. Model ini gagal menerangkan interaksi tolak-menolak antarelektron pada atom multielektron serta mengabaikan sifat dualisme gelombang materi.'
  },
  {
    id: 24,
    type: 'multiple_choice',
    title: 'Prinsip Ketidakpastian Heisenberg',
    conceptTag: 'Mekanika Kuantum - Ketidakpastian Heisenberg',
    question: 'Konsekuensi langsung dari Prinsip Ketidakpastian Werner Heisenberg (Δx · Δp ≥ ℏ/2) terhadap visualisasi elektron di dalam atom adalah...',
    options: [
      'Kecepatan putar elektron di sekitar inti atom akan menurun drastis hingga bernilai statis nol.',
      'Gugurnya konsep lintasan orbit lingkaran kaku 2D karena posisi dan momentum tak bisa pasti serentak.',
      'Bentuk inti atom akan terdistorsi menjadi elips tak beraturan seiring meningkatnya energi kuantum.',
      'Elektron hanya dapat berputar pada sumbu rotasi yang sejajar dengan arah medan gravitasi bumi.'
    ],
    correctAnswer: 1, // Kunci: B
    hint: 'Karena posisi dan kecepatan elektron tidak dapat diukur serentak secara presisi mutlak, maka lintasan rel pasti (orbit lingkaran Bohr) tidak mungkin ada.',
    explanation: 'Prinsip Ketidakpastian Heisenberg menggugurkan gagasan orbit lingkaran 2D pasti ala Bohr. Lintasan pasti digantikan oleh konsep ruang probabilitas statistik tempat ditemukannya elektron.'
  },
  {
    id: 25,
    type: 'multiple_choice',
    title: 'Distingsi Konsep "Orbit" vs "Orbital"',
    conceptTag: 'Mekanika Kuantum - Makna Ruang Orbital 3D',
    question: 'Apakah perbedaan konseptual paling mendasar antara istilah "Orbit" pada model Bohr dengan "Orbital" pada mekanika kuantum?',
    options: [
      'Orbit berada di dalam ruang inti atom, sedangkan Orbital menaungi seluruh lapisan kulit terluar materi.',
      'Orbit mengatur gerak partikel netral, sedangkan Orbital mengatur interaksi muatan positif dan negatif.',
      'Orbit adalah lintasan lingkaran pasti 2D, sedangkan Orbital adalah ruang 3D kebolehjadian menemukan elektron.',
      'Orbit memiliki bentuk geometri bola simetris, sedangkan Orbital berbentuk garis linear tanpa volume spasial.'
    ],
    correctAnswer: 2, // Kunci: C
    hint: 'Bohr membayangkan rel melingkar 2D seperti garis edar planet, sedangkan Schrödinger merumuskan awan fungsi gelombang ruang 3D (|Ψ|² > 90%).',
    explanation: 'Orbit (Bohr) adalah garis edar lingkaran pasti dua dimensi. Sebaliknya, Orbital (Mekanika Kuantum) adalah fungsi gelombang ruang tiga dimensi yang menyatakan wilayah peluang atau probabilitas terbesar (>90%) menemukan elektron.'
  }
]
