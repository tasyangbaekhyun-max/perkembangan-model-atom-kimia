export interface BohrShellDistribution {
  K: number
  L?: number
  M?: number
  N?: number
  O?: number
}

export interface BohrElement {
  z: number
  symbol: string
  name: string
  massNumber: number
  protons: number
  neutrons: number
  electrons: number
  shells: BohrShellDistribution
  configString: string
  valenceElectrons: number
  occupiedShells: number
  group: string
  period: number
  category: 'alkali' | 'alkaline-earth' | 'nonmetal' | 'metalloid' | 'halogen' | 'noble-gas' | 'post-transition'
  color: string
  description: string
}

export interface ShellDefinition {
  name: string
  n: number
  maxCapacity: number
  energyLevelLabel: string
}

export const BOHR_SHELL_DEFINITIONS: ShellDefinition[] = [
  { name: 'K', n: 1, maxCapacity: 2, energyLevelLabel: 'Tingkat dasar n = 1' },
  { name: 'L', n: 2, maxCapacity: 8, energyLevelLabel: 'Tingkat eksitasi n = 2' },
  { name: 'M', n: 3, maxCapacity: 18, energyLevelLabel: 'Tingkat eksitasi n = 3' },
  { name: 'N', n: 4, maxCapacity: 32, energyLevelLabel: 'Tingkat eksitasi n = 4' },
  { name: 'O', n: 5, maxCapacity: 50, energyLevelLabel: 'Tingkat eksitasi n = 5' },
  { name: 'P', n: 6, maxCapacity: 72, energyLevelLabel: 'Tingkat eksitasi n = 6' },
  { name: 'Q', n: 7, maxCapacity: 98, energyLevelLabel: 'Tingkat eksitasi n = 7' },
]

export const BOHR_ELEMENTS: BohrElement[] = [
  {
    z: 1,
    symbol: 'H',
    name: 'Hidrogen',
    massNumber: 1,
    protons: 1,
    neutrons: 0,
    electrons: 1,
    shells: { K: 1 },
    configString: '1',
    valenceElectrons: 1,
    occupiedShells: 1,
    group: 'Golongan IA (Nonlogam)',
    period: 1,
    category: 'nonmetal',
    color: '#0284c7',
    description: 'Atom paling sederhana di alam semesta. Memiliki 1 elektron tunggal yang menempati kulit terdalam K (n=1).'
  },
  {
    z: 2,
    symbol: 'He',
    name: 'Helium',
    massNumber: 4,
    protons: 2,
    neutrons: 2,
    electrons: 2,
    shells: { K: 2 },
    configString: '2',
    valenceElectrons: 2,
    occupiedShells: 1,
    group: 'Golongan VIIIA (Gas Mulia)',
    period: 1,
    category: 'noble-gas',
    color: '#8b5cf6',
    description: 'Kulit pertama (K) terisi penuh maksimal 2 elektron (aturan duplet stabil). Gas mulia inert tak berwarna.'
  },
  {
    z: 3,
    symbol: 'Li',
    name: 'Litium',
    massNumber: 7,
    protons: 3,
    neutrons: 4,
    electrons: 3,
    shells: { K: 2, L: 1 },
    configString: '2, 1',
    valenceElectrons: 1,
    occupiedShells: 2,
    group: 'Golongan IA (Logam Alkali)',
    period: 2,
    category: 'alkali',
    color: '#ef4444',
    description: 'Kulit K telah penuh (2 e⁻), sehingga elektron ke-3 mulai mengisi kulit kedua L (n=2). Sangat reaktif.'
  },
  {
    z: 4,
    symbol: 'Be',
    name: 'Berilium',
    massNumber: 9,
    protons: 4,
    neutrons: 5,
    electrons: 4,
    shells: { K: 2, L: 2 },
    configString: '2, 2',
    valenceElectrons: 2,
    occupiedShells: 2,
    group: 'Golongan IIA (Alkali Tanah)',
    period: 2,
    category: 'alkaline-earth',
    color: '#f97316',
    description: 'Logam alkali tanah ringan dengan 2 elektron valensi pada kulit L.'
  },
  {
    z: 5,
    symbol: 'B',
    name: 'Boron',
    massNumber: 11,
    protons: 5,
    neutrons: 6,
    electrons: 5,
    shells: { K: 2, L: 3 },
    configString: '2, 3',
    valenceElectrons: 3,
    occupiedShells: 2,
    group: 'Golongan IIIA',
    period: 2,
    category: 'metalloid',
    color: '#eab308',
    description: 'Metaloid semikonduktor dengan 3 elektron pada kulit L.'
  },
  {
    z: 6,
    symbol: 'C',
    name: 'Karbon',
    massNumber: 12,
    protons: 6,
    neutrons: 6,
    electrons: 6,
    shells: { K: 2, L: 4 },
    configString: '2, 4',
    valenceElectrons: 4,
    occupiedShells: 2,
    group: 'Golongan IVA',
    period: 2,
    category: 'nonmetal',
    color: '#10b981',
    description: 'Dasar seluruh kehidupan organik. Memiliki 4 elektron valensi pada kulit L yang siap membentuk 4 ikatan kovalen.'
  },
  {
    z: 7,
    symbol: 'N',
    name: 'Nitrogen',
    massNumber: 14,
    protons: 7,
    neutrons: 7,
    electrons: 7,
    shells: { K: 2, L: 5 },
    configString: '2, 5',
    valenceElectrons: 5,
    occupiedShells: 2,
    group: 'Golongan VA',
    period: 2,
    category: 'nonmetal',
    color: '#06b6d4',
    description: 'Gas penyusun 78% atmosfer Bumi dengan 5 elektron valensi pada kulit L.'
  },
  {
    z: 8,
    symbol: 'O',
    name: 'Oksigen',
    massNumber: 16,
    protons: 8,
    neutrons: 8,
    electrons: 8,
    shells: { K: 2, L: 6 },
    configString: '2, 6',
    valenceElectrons: 6,
    occupiedShells: 2,
    group: 'Golongan VIA (Kalkogen)',
    period: 2,
    category: 'nonmetal',
    color: '#3b82f6',
    description: 'Unsur vital respirasi. Memerlukan 2 elektron tambahan pada kulit L untuk mencapai konfigurasi oktet stabil (8 e⁻).'
  },
  {
    z: 9,
    symbol: 'F',
    name: 'Fluorin',
    massNumber: 19,
    protons: 9,
    neutrons: 10,
    electrons: 9,
    shells: { K: 2, L: 7 },
    configString: '2, 7',
    valenceElectrons: 7,
    occupiedShells: 2,
    group: 'Golongan VIIA (Halogen)',
    period: 2,
    category: 'halogen',
    color: '#ec4899',
    description: 'Unsur paling elektronegatif di tabel periodik dengan 7 elektron valensi pada kulit L.'
  },
  {
    z: 10,
    symbol: 'Ne',
    name: 'Neon',
    massNumber: 20,
    protons: 10,
    neutrons: 10,
    electrons: 10,
    shells: { K: 2, L: 8 },
    configString: '2, 8',
    valenceElectrons: 8,
    occupiedShells: 2,
    group: 'Golongan VIIIA (Gas Mulia)',
    period: 2,
    category: 'noble-gas',
    color: '#a855f7',
    description: 'Kulit K (2 e⁻) dan kulit L (8 e⁻) terisi penuh sempurna. Mencapai kestabilan oktet sejati.'
  },
  {
    z: 11,
    symbol: 'Na',
    name: 'Natrium',
    massNumber: 23,
    protons: 11,
    neutrons: 12,
    electrons: 11,
    shells: { K: 2, L: 8, M: 1 },
    configString: '2, 8, 1',
    valenceElectrons: 1,
    occupiedShells: 3,
    group: 'Golongan IA (Logam Alkali)',
    period: 3,
    category: 'alkali',
    color: '#f43f5e',
    description: 'Kulit K dan L telah penuh. Elektron ke-11 membuka kulit ketiga M (n=3). Sangat mudah melepas 1 elektron menjadi Na⁺.'
  },
  {
    z: 12,
    symbol: 'Mg',
    name: 'Magnesium',
    massNumber: 24,
    protons: 12,
    neutrons: 12,
    electrons: 12,
    shells: { K: 2, L: 8, M: 2 },
    configString: '2, 8, 2',
    valenceElectrons: 2,
    occupiedShells: 3,
    group: 'Golongan IIA (Alkali Tanah)',
    period: 3,
    category: 'alkaline-earth',
    color: '#ea580c',
    description: 'Logam alkali tanah dengan 2 elektron valensi pada kulit M yang mudah dilepas membentuk kation Mg²⁺.'
  },
  {
    z: 13,
    symbol: 'Al',
    name: 'Aluminium',
    massNumber: 27,
    protons: 13,
    neutrons: 14,
    electrons: 13,
    shells: { K: 2, L: 8, M: 3 },
    configString: '2, 8, 3',
    valenceElectrons: 3,
    occupiedShells: 3,
    group: 'Golongan IIIA',
    period: 3,
    category: 'post-transition',
    color: '#ca8a04',
    description: 'Logam konduktor ringan dengan 3 elektron valensi pada kulit M.'
  },
  {
    z: 14,
    symbol: 'Si',
    name: 'Silikon',
    massNumber: 28,
    protons: 14,
    neutrons: 14,
    electrons: 14,
    shells: { K: 2, L: 8, M: 4 },
    configString: '2, 8, 4',
    valenceElectrons: 4,
    occupiedShells: 3,
    group: 'Golongan IVA',
    period: 3,
    category: 'metalloid',
    color: '#059669',
    description: 'Metaloid semikonduktor inti industri mikroprosesor dengan 4 elektron valensi pada kulit M.'
  },
  {
    z: 15,
    symbol: 'P',
    name: 'Fosfor',
    massNumber: 31,
    protons: 15,
    neutrons: 16,
    electrons: 15,
    shells: { K: 2, L: 8, M: 5 },
    configString: '2, 8, 5',
    valenceElectrons: 5,
    occupiedShells: 3,
    group: 'Golongan VA',
    period: 3,
    category: 'nonmetal',
    color: '#0891b2',
    description: 'Komponen penting DNA dan tulang dengan 5 elektron valensi pada kulit M.'
  },
  {
    z: 16,
    symbol: 'S',
    name: 'Sulfur',
    massNumber: 32,
    protons: 16,
    neutrons: 16,
    electrons: 16,
    shells: { K: 2, L: 8, M: 6 },
    configString: '2, 8, 6',
    valenceElectrons: 6,
    occupiedShells: 3,
    group: 'Golongan VIA',
    period: 3,
    category: 'nonmetal',
    color: '#2563eb',
    description: 'Unsur nonlogam kuning penyusun asam amino dengan 6 elektron valensi pada kulit M.'
  },
  {
    z: 17,
    symbol: 'Cl',
    name: 'Klorin',
    massNumber: 35,
    protons: 17,
    neutrons: 18,
    electrons: 17,
    shells: { K: 2, L: 8, M: 7 },
    configString: '2, 8, 7',
    valenceElectrons: 7,
    occupiedShells: 3,
    group: 'Golongan VIIA (Halogen)',
    period: 3,
    category: 'halogen',
    color: '#db2777',
    description: 'Gas halogen reaktif yang memerlukan 1 elektron lagi pada kulit M untuk menjadi ion klorida Cl⁻ stabil.'
  },
  {
    z: 18,
    symbol: 'Ar',
    name: 'Argon',
    massNumber: 40,
    protons: 18,
    neutrons: 22,
    electrons: 18,
    shells: { K: 2, L: 8, M: 8 },
    configString: '2, 8, 8',
    valenceElectrons: 8,
    occupiedShells: 3,
    group: 'Golongan VIIIA (Gas Mulia)',
    period: 3,
    category: 'noble-gas',
    color: '#7c3aed',
    description: 'Kulit valensi M terisi 8 elektron (oktet stabil). Meskipun kapasitas teoritis kulit M adalah 18 e⁻, konfigurasi 8 e⁻ sudah inert.'
  },
  {
    z: 19,
    symbol: 'K',
    name: 'Kalium',
    massNumber: 39,
    protons: 19,
    neutrons: 20,
    electrons: 19,
    shells: { K: 2, L: 8, M: 8, N: 1 },
    configString: '2, 8, 8, 1',
    valenceElectrons: 1,
    occupiedShells: 4,
    group: 'Golongan IA (Logam Alkali)',
    period: 4,
    category: 'alkali',
    color: '#e11d48',
    description: 'Menurut aturan Bohr, kulit terluar tidak boleh melebihi 8 e⁻, sehingga elektron ke-19 mulai mengisi kulit keempat N (n=4).'
  },
  {
    z: 20,
    symbol: 'Ca',
    name: 'Kalsium',
    massNumber: 40,
    protons: 20,
    neutrons: 20,
    electrons: 20,
    shells: { K: 2, L: 8, M: 8, N: 2 },
    configString: '2, 8, 8, 2',
    valenceElectrons: 2,
    occupiedShells: 4,
    group: 'Golongan IIA (Alkali Tanah)',
    period: 4,
    category: 'alkaline-earth',
    color: '#d97706',
    description: 'Logam alkali tanah penyusun utama tulang dan gigi dengan 2 elektron valensi pada kulit N (n=4).'
  }
]

export function getShellCapacity(n: number): number {
  return 2 * n * n
}
