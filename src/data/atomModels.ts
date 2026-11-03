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
      macroscopic: 'Materi padat (batu, kayu, perhiasan emas) yang jika dipotong terus-menerus memiliki batas pemotongan fisik terkecil tanpa kehilangan sifat kimianya.',
      submicroscopic: 'Partikel-partikel pejal, homogen, dan tak berongga dengan bentuk geometris tertentu yang saling berkait secara mekanik di dalam ruang hampa.',
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
    },
    references: [
      {
        id: 'ref-dem-1',
        citation: 'Berryman, S. (2016). Ancient Atomism. The Stanford Encyclopedia of Philosophy (Winter 2016 Edition), Edward N. Zalta (ed.).',
        title: 'Ancient Atomism',
        authors: 'Sylvia Berryman',
        year: 2016,
        sourceName: 'The Stanford Encyclopedia of Philosophy',
        type: 'website',
        url: 'https://plato.stanford.edu/entries/atomism-ancient/',
        annotation: 'Kajian komprehensif mengenai ontologi partikel atomos dan konsep ruang hampa (void) menurut Leukippos dan Democritus.'
      },
      {
        id: 'ref-dem-2',
        citation: 'Chang, R., & Goldsby, K. A. (2016). Chemistry (12th ed.). New York: McGraw-Hill Education, Chapter 2: Atoms, Molecules, and Ions.',
        title: 'Chemistry (12th Edition)',
        authors: 'Raymond Chang & Kenneth A. Goldsby',
        year: 2016,
        sourceName: 'McGraw-Hill Education',
        type: 'book',
        annotation: 'Buku teks standar kimia dasar universitas yang merangkum sejarah peralihan dari spekulasi Democritus ke teori ilmiah Dalton.'
      },
      {
        id: 'ref-dem-3',
        citation: 'Kirk, G. S., Raven, J. E., & Schofield, M. (1983). The Presocratic Philosophers: A Critical History with a Selection of Texts (2nd ed.). Cambridge University Press.',
        title: 'The Presocratic Philosophers: A Critical History',
        authors: 'G. S. Kirk, J. E. Raven, & M. Schofield',
        year: 1983,
        sourceName: 'Cambridge University Press',
        type: 'book',
        annotation: 'Sumber primer kutipan fragmen filosofis Democritus mengenai materi diskret versus kontinu.'
      },
      {
        id: 'ref-dem-4',
        citation: 'Puspaningsih, A. R., Tjahjadarmawan, E., & Krisdianti, N. R. (2021). Buku Panduan Guru dan Siswa Ilmu Pengetahuan Alam untuk SMA Kelas X. Jakarta: Pusat Perbukuan Balitbangbud Kemendikbudristek.',
        title: 'Buku Ilmu Pengetahuan Alam SMA Kelas X (Fase E)',
        authors: 'Ayuk Ratna Puspaningsih, dkk.',
        year: 2021,
        sourceName: 'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi Republik Indonesia',
        type: 'curriculum',
        url: 'https://buku.kemdikbud.go.id/',
        annotation: 'Buku teks kurikulum nasional resmi Indonesia untuk Capaian Pembelajaran Kimia Fase E.'
      }
    ]
  },
  {
    id: 'dalton',
    name: 'Model Atom Dalton',
    scientist: 'John Dalton',
    period: '1803',
    summary: 'Atom adalah bola pejal masif tanpa struktur internal yang tidak dapat diciptakan atau dimusnahkan. Atom unsur sejenis identik, dan unsur berbeda bergabung dengan rasio bilangan bulat sederhana.',
    analogy: 'Bola biliar pejal keras yang tidak dapat ditembus atau dipecahkan.',
    representations: {
      macroscopic: 'Hukum Kekekalan Massa (Lavoisier) dan Hukum Perbandingan Tetap (Proust) pada reaksi kimia terukur di timbangan analitik.',
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
    },
    references: [
      {
        id: 'ref-dal-1',
        citation: 'Dalton, J. (1808). A New System of Chemical Philosophy (Vol. 1). London: Printed by S. Russell for R. Bickerstaff.',
        title: 'A New System of Chemical Philosophy',
        authors: 'John Dalton',
        year: 1808,
        sourceName: 'R. Bickerstaff, London',
        type: 'book',
        url: 'https://archive.org/details/newsystemofchemi01daltuoft',
        annotation: 'Karya monograf orisinal John Dalton yang memuat formulasi postulat teori atom ilmiah dan tabel bobot atom relatif pertama.'
      },
      {
        id: 'ref-dal-2',
        citation: 'Petrucci, R. H., Herring, F. G., Madura, J. D., & Bissonnette, C. (2017). General Chemistry: Principles and Modern Applications (11th ed.). Toronto: Pearson Canada.',
        title: 'General Chemistry: Principles and Modern Applications',
        authors: 'Ralph H. Petrucci, F. Geoffrey Herring, Jeffry D. Madura, & Carey Bissonnette',
        year: 2017,
        sourceName: 'Pearson Canada',
        type: 'book',
        annotation: 'Menjelaskan hukum perbandingan berganda, hukum kekekalan massa Lavoisier, dan hukum Proust sebagai pondasi mekanika kimia.'
      },
      {
        id: 'ref-dal-3',
        citation: 'Science History Institute. (2023). John Dalton: British Chemist and Meteorologist. Historical Biographies.',
        title: 'John Dalton: Historical Profile',
        authors: 'Science History Institute Staff',
        year: 2023,
        sourceName: 'Science History Institute, Philadelphia',
        type: 'website',
        url: 'https://www.sciencehistory.org/historical-profile/john-dalton',
        annotation: 'Biografi dan kurasi instrumen bersejarah eksperimen gas dan stoikiometri John Dalton.'
      }
    ]
  },
  {
    id: 'thomson',
    name: 'Model Atom Thomson',
    scientist: 'Sir Joseph John Thomson',
    period: '1897',
    summary: 'Atom berbentuk bola bermuatan positif yang homogen dan menyebar, dengan partikel-partikel bermuatan negatif (elektron) tersebar merata di dalamnya seperti kismis dalam roti.',
    analogy: 'Roti kismis (plum pudding) atau buah semangka: daging merah adalah bola positif, bijinya adalah elektron.',
    representations: {
      macroscopic: 'Berkas sinar katoda yang berbelok ke arah kutub positif medan listrik dalam tabung lucutan gas bertekanan rendah.',
      submicroscopic: 'Bola kabut bermuatan positif bervolume besar dengan elektron-elektron kecil terbenam netral secara keseluruhan: Σ(+) = Σ(-).',
      symbolic: 'Rasio muatan terhadap massa elektron: e/m = 1.7588 × 10¹¹ C/kg. Gaya Lorentz: F = e(E + v × B).'
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
    },
    references: [
      {
        id: 'ref-tho-1',
        citation: 'Thomson, J. J. (1897). Cathode Rays. Philosophical Magazine, 44(269), 293–316. doi:10.1080/14786449708621070.',
        title: 'Cathode Rays',
        authors: 'Sir Joseph John Thomson',
        year: 1897,
        sourceName: 'Philosophical Magazine, Fifth Series',
        type: 'journal',
        url: 'https://doi.org/10.1080/14786449708621070',
        annotation: 'Makalah ilmiah fundamental tempat Thomson mengumumkan penemuan partikel subatomik "korpuskel" dan pengukuran rasio e/m.'
      },
      {
        id: 'ref-tho-2',
        citation: 'Thomson, J. J. (1904). On the Structure of the Atom: an Investigation of the Stability and Periods of Oscillation of a number of Corpuscles arranged at equal intervals in a Sphere of uniform positive Electrification. Philosophical Magazine, 7(39), 237–265.',
        title: 'On the Structure of the Atom (Plum Pudding Model)',
        authors: 'Sir Joseph John Thomson',
        year: 1904,
        sourceName: 'Philosophical Magazine, Sixth Series',
        type: 'journal',
        annotation: 'Formulasi matematis dan fisik model atom roti kismis dengan elektron bermuatan negatif di dalam bola fluida bermuatan positif.'
      },
      {
        id: 'ref-tho-3',
        citation: 'The Nobel Foundation. (1906). J.J. Thomson – Nobel Lecture: Carriers of Negative Electricity. NobelPrize.org.',
        title: 'Nobel Lecture: Carriers of Negative Electricity',
        authors: 'J.J. Thomson / Nobel Media AB',
        year: 1906,
        sourceName: 'NobelPrize.org',
        type: 'website',
        url: 'https://www.nobelprize.org/prizes/physics/1906/thomson/lecture/',
        annotation: 'Pidato penganugerahan Hadiah Nobel Fisika tahun 1906 atas penyelidikan teoritis dan eksperimental konduksi listrik oleh gas.'
      },
      {
        id: 'ref-tho-4',
        citation: 'Brown, T. L., LeMay, H. E., Bursten, B. E., Murphy, C. J., Woodward, P. M., & Stoltzfus, M. W. (2018). Chemistry: The Central Science (14th ed.). New York: Pearson.',
        title: 'Chemistry: The Central Science',
        authors: 'Theodore L. Brown, dkk.',
        year: 2018,
        sourceName: 'Pearson Education',
        type: 'book',
        annotation: 'Buku teks rujukan kimia internasional mengenai eksperimen tabung sinar katoda dan rasio muatan-massa Millikan & Thomson.'
      }
    ]
  },
  {
    id: 'rutherford',
    name: 'Model Atom Rutherford',
    scientist: 'Ernest Rutherford, Geiger & Marsden',
    period: '1911',
    summary: 'Atom terdiri dari inti (nucleus) bermuatan positif yang sangat kecil dan bermassa sangat pekat di pusat, dikelilingi oleh elektron-elektron di ruang hampa yang sangat luas.',
    analogy: 'Tata surya mini dengan matahari sebagai inti positif padat dan planet sebagai elektron di ruang angkasa kosong.',
    representations: {
      macroscopic: 'Hamburan berkas partikel alfa (α) berkecepatan tinggi saat menembus lempeng emas tipis setebal beberapa ratus atom pada layar pendar seng sulfida (ZnS).',
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
    },
    references: [
      {
        id: 'ref-rut-1',
        citation: 'Rutherford, E. (1911). The Scattering of α and β Particles by Matter and the Structure of the Atom. Philosophical Magazine, Series 6, 21(125), 669–688.',
        title: 'The Scattering of α and β Particles by Matter and the Structure of the Atom',
        authors: 'Ernest Rutherford',
        year: 1911,
        sourceName: 'Philosophical Magazine',
        type: 'journal',
        url: 'https://doi.org/10.1080/14786440508637080',
        annotation: 'Makalah legendaris penemuan inti atom (nucleus) dan rumus penampang lintang diferensial hamburan Coulomb Rutherford.'
      },
      {
        id: 'ref-rut-2',
        citation: 'Geiger, H., & Marsden, E. (1909). On a Diffuse Reflection of the α-Particles. Proceedings of the Royal Society of London. Series A, 82(557), 495–500.',
        title: 'On a Diffuse Reflection of the α-Particles',
        authors: 'Hans Geiger & Ernest Marsden',
        year: 1909,
        sourceName: 'Proceedings of the Royal Society',
        type: 'journal',
        annotation: 'Data eksperimen empiris pemantulan partikel alfa 1 dari 8.000 partikel oleh lempeng emas yang memicu lahirnya model inti atom.'
      },
      {
        id: 'ref-rut-3',
        citation: 'Oxtoby, D. W., Gillis, H. P., & Butler, L. J. (2015). Principles of Modern Chemistry (8th ed.). Boston: Cengage Learning.',
        title: 'Principles of Modern Chemistry',
        authors: 'David W. Oxtoby, H. P. Gillis, & Laurie J. Butler',
        year: 2015,
        sourceName: 'Cengage Learning',
        type: 'book',
        annotation: 'Ulasan mendalam paradoks elektrodinamika klasik Maxwell pada kestabilan orbit elektron Rutherford.'
      }
    ]
  },
  {
    id: 'bohr',
    name: 'Model Atom Bohr',
    scientist: 'Niels Bohr',
    period: '1913',
    summary: 'Elektron mengelilingi inti pada lintasan melingkar stasioner tertentu dengan tingkat energi terkuantisasi tanpa memancarkan radiasi. Elektron memancarkan atau menyerap energi foton hanya saat melompat antar tingkat energi.',
    analogy: 'Anak tangga stasioner: seseorang hanya bisa berdiri di anak tangga ke-1, ke-2, atau ke-3, tidak bisa melayang di antara anak tangga.',
    representations: {
      macroscopic: 'Spektrum garis emisi warna-warni yang khas pada lampu gas tabung lucutan hidrogen (garis Balmer merah 656 nm, sian 486 nm, biru 434 nm, ungu 410 nm).',
      submicroscopic: 'Kulit-kulit elektron lingkaran diskret (n = 1, 2, 3, 4, 5 atau kulit K, L, M, N, O) dengan jari-jari r_n = n² · a₀.',
      symbolic: 'Persamaan kuantisasi: L = n(h / 2π). Energi foton: ΔE = hν = hc/λ = -R_H (1/n₂² - 1/n₁²).'
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
    },
    references: [
      {
        id: 'ref-boh-1',
        citation: 'Bohr, N. (1913). On the Constitution of Atoms and Molecules, Part I. Philosophical Magazine, Series 6, 26(151), 1–25.',
        title: 'On the Constitution of Atoms and Molecules',
        authors: 'Niels Bohr',
        year: 1913,
        sourceName: 'Philosophical Magazine',
        type: 'journal',
        url: 'https://doi.org/10.1080/14786441308634955',
        annotation: 'Trilogi makalah revolusioner Bohr yang memperkenalkan kuantisasi momentum sudut dan rumus konstanta Rydberg.'
      },
      {
        id: 'ref-boh-2',
        citation: 'The Nobel Foundation. (1922). Niels Bohr – Nobel Lecture: The Structure of the Atom. NobelPrize.org.',
        title: 'The Structure of the Atom (Nobel Lecture)',
        authors: 'Niels Bohr / Nobel Media AB',
        year: 1922,
        sourceName: 'NobelPrize.org',
        type: 'website',
        url: 'https://www.nobelprize.org/prizes/physics/1922/bohr/lecture/',
        annotation: 'Kuliah Nobel Bohr mengenai perkembangan teori kuantum atom dan penjelasan tabel periodik unsur.'
      },
      {
        id: 'ref-boh-3',
        citation: 'Silberberg, M. S., & Amateis, P. (2021). Chemistry: The Molecular Nature of Matter and Change (9th ed.). New York: McGraw-Hill Education.',
        title: 'Chemistry: The Molecular Nature of Matter and Change',
        authors: 'Martin S. Silberberg & Patricia Amateis',
        year: 2021,
        sourceName: 'McGraw-Hill Education',
        type: 'book',
        annotation: 'Pemaparan diagram tingkat energi transisi elektronik hidrogen (Deret Lyman, Balmer, Paschen, Brackett, Pfund).'
      }
    ]
  },
  {
    id: 'quantum',
    name: 'Model Mekanika Kuantum',
    scientist: 'Schrödinger, Heisenberg & de Broglie',
    period: '1926 - sekarang',
    summary: 'Elektron memiliki sifat dualisme gelombang-partikel dan posisinya tidak dapat dipastikan secara simultan dengan momentumnya. Elektron digambarkan oleh fungsi gelombang orbital sebagai awan probabilitas keberadaan elektron.',
    analogy: 'Awan kabut atau baling-baling kipas angin yang berputar kencang: posisi elektron adalah probabilitas densitas kabut di sekitar inti.',
    representations: {
      macroscopic: 'Pola difraksi dan interferensi berkas elektron melalui kristal, membuktikan sifat gelombang materi (Eksperimen Davisson-Germer).',
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
    },
    references: [
      {
        id: 'ref-qua-1',
        citation: 'Schrödinger, E. (1926). Quantisierung als Eigenwertproblem. Annalen der Physik, 384(4), 361–376. doi:10.1002/andp.19263840404.',
        title: 'Quantisierung als Eigenwertproblem (Quantization as an Eigenvalue Problem)',
        authors: 'Erwin Schrödinger',
        year: 1926,
        sourceName: 'Annalen der Physik',
        type: 'journal',
        url: 'https://doi.org/10.1002/andp.19263840404',
        annotation: 'Makalah pendiri mekanika gelombang kuantum yang merumuskan persamaan diferensial fungsi gelombang orbital atom hidrogen.'
      },
      {
        id: 'ref-qua-2',
        citation: 'Heisenberg, W. (1927). Über den anschaulichen Inhalt der quantentheoretischen Kinematik und Mechanik. Zeitschrift für Physik, 43(3–4), 172–198.',
        title: 'The Physical Content of Quantum Kinematics and Mechanics (Uncertainty Principle)',
        authors: 'Werner Heisenberg',
        year: 1927,
        sourceName: 'Zeitschrift für Physik',
        type: 'journal',
        annotation: 'Perumusan prinsip ketidakpastian fundamental Δx · Δp ≥ ℏ/2 yang menggugurkan konsep orbit deterministik.'
      },
      {
        id: 'ref-qua-3',
        citation: 'IUPAC. (2019). Compendium of Chemical Terminology (Gold Book): Definition of Atomic Orbital. International Union of Pure and Applied Chemistry.',
        title: 'IUPAC Compendium of Chemical Terminology (Gold Book)',
        authors: 'IUPAC Physical and Biophysical Chemistry Division',
        year: 2019,
        sourceName: 'IUPAC Publications',
        type: 'website',
        url: 'https://goldbook.iupac.org/terms/view/A00500',
        annotation: 'Definisi standar kimia internasional untuk orbital atom sebagai fungsi gelombang satu elektron dalam atom.'
      },
      {
        id: 'ref-qua-4',
        citation: 'Levine, I. N. (2014). Quantum Chemistry (7th ed.). Boston: Pearson Education.',
        title: 'Quantum Chemistry',
        authors: 'Ira N. Levine',
        year: 2014,
        sourceName: 'Pearson Education',
        type: 'book',
        annotation: 'Rujukan standar universitas untuk penyelesaian fungsi gelombang hidrogenik, bilangan kuantum, dan aturan Hund/Aufbau/Pauli.'
      },
      {
        id: 'ref-qua-5',
        citation: 'Badan Standar, Kurikulum, dan Asesmen Pendidikan (BSKAP). (2022). Keputusan Kepala BSKAP Kemendikbudristek No. 033/H/KR/2022 tentang Capaian Pembelajaran pada Kurikulum Merdeka untuk SMA/MA Fase E. Jakarta: Kemendikbudristek.',
        title: 'Capaian Pembelajaran Kimia Fase E Kurikulum Merdeka',
        authors: 'BSKAP Kemendikbudristek RI',
        year: 2022,
        sourceName: 'Kemendikbudristek RI',
        type: 'curriculum',
        url: 'https://kurikulum.kemdikbud.go.id/',
        annotation: 'Pedoman kurikulum nasional yang mewajibkan pengenalan model atom hingga mekanika kuantum dan konfigurasi elektron di kelas X SMA.'
      }
    ]
  }
]
