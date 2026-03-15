export interface Subject {
  id: string;
  icon: string;
  label: string;
  bgColor: string;
}

export const SUBJECTS: Subject[] = [
  { id: 'math', icon: '➕', label: 'Matematika', bgColor: 'rgba(29,158,117,0.15)' },
  { id: 'science', icon: '🔬', label: 'IPA', bgColor: 'rgba(55,138,221,0.15)' },
  { id: 'language', icon: '📝', label: 'Bahasa', bgColor: 'rgba(186,117,23,0.20)' },
  { id: 'social', icon: '🌍', label: 'IPS', bgColor: 'rgba(162,52,126,0.15)' },
  { id: 'art', icon: '🎨', label: 'Seni', bgColor: 'rgba(226,75,74,0.15)' },
];

export interface LessonCard {
  id: string;
  emoji: string;
  bgColor: string;
  title: string;
  meta: string;
  isFree: boolean;
  isOffline: boolean;
  categoryId: string;
}

export const LESSON_CARDS: LessonCard[] = [
  {
    id: '1',
    emoji: '➕',
    bgColor: 'rgba(29,158,117,0.15)',
    title: 'Perkalian Sawit — Belajar dari Kebun',
    meta: 'Kelas 4 • 20 mnt',
    isFree: true,
    isOffline: true,
    categoryId: 'math',
  },
  {
    id: '2',
    emoji: '🌿',
    bgColor: 'rgba(55,138,221,0.15)',
    title: 'Ekosistem Hutan Kalimantan',
    meta: 'Kelas 5 • 25 mnt',
    isFree: true,
    isOffline: true,
    categoryId: 'science',
  },
  {
    id: '3',
    emoji: '📝',
    bgColor: 'rgba(186,117,23,0.20)',
    title: 'Menulis Cerita Rakyat Nusantara',
    meta: 'Kelas 3 • 30 mnt',
    isFree: true,
    isOffline: true,
    categoryId: 'language',
  },
  {
    id: '4',
    emoji: '🌍',
    bgColor: 'rgba(162,52,126,0.15)',
    title: 'Keragaman Budaya Indonesia',
    meta: 'Kelas 6 • 15 mnt',
    isFree: true,
    isOffline: true,
    categoryId: 'social',
  },
];

export interface Book {
  id: string;
  coverColor: string;
  title: string;
  author: string;
  emoji: string;
}

export const BOOKS: Book[] = [
  {
    id: 'b1',
    coverColor: '#E24B4A',
    title: 'Legenda Danau Toba',
    author: 'Cerita Rakyat',
    emoji: '🌋',
  },
  {
    id: 'b2',
    coverColor: '#1D9E75',
    title: 'Petualangan Kancil',
    author: 'Fabel Nusantara',
    emoji: '🦌',
  },
  {
    id: 'b3',
    coverColor: '#378ADD',
    title: 'Asal Usul Selat Bali',
    author: 'Cerita Rakyat',
    emoji: '🌊',
  },
  {
    id: 'b4',
    coverColor: '#A2347E',
    title: 'Timun Mas & Raksasa',
    author: 'Dongeng',
    emoji: '🥒',
  },
];

export interface Video {
  id: string;
  title: string;
  youtubeId: string;
  duration: string;
  description: string;
  materials: string[];
}

export const VIDEOS: Video[] = [
  {
    id: 'v1',
    title: 'Belajar Tata Surya',
    youtubeId: '2EgP_zSOKN4',
    duration: '10:24',
    description: 'Mengenal planet-planet di tata surya kita dan bagaimana mereka mengorbit Matahari.',
    materials: [
      'Matahari adalah pusat dari sistem tata surya kita.',
      'Ada 8 planet utama: Merkurius, Venus, Bumi, Mars, Jupiter, Saturnus, Uranus, dan Neptunus.',
      'Sabuk Asteroid terletak di antara Orbit Mars dan Jupiter.',
    ],
  },
  {
    id: 'v2',
    title: 'Jarimatika Dasar',
    youtubeId: 'mrJt8Ux4GXA',
    duration: '08:15',
    description: 'Teknik berhitung cepat menggunakan jari tangan untuk penjumlahan dan pengurangan.',
    materials: [
      'Tangan kanan mewakili satuan (1-9).',
      'Tangan kiri mewakili puluhan (10-90).',
      'Teknik "Teman Kecil" dan "Teman Besar" untuk memudahkan simpan-pinjam angka.',
    ],
  },
  {
    id: 'v3',
    title: 'Kenali Jenis Sayur',
    youtubeId: 'q_gVFSE3LEk',
    duration: '05:42',
    description: 'Pentingnya makan sayur setiap hari dan mengenal berbagai jenis sayuran hijau.',
    materials: [
      'Sayuran berwarna hijau kaya akan klorofil dan serat.',
      'Wortel mengandung Vitamin A yang baik untuk kesehatan mata.',
      'Bayam mengandung zat besi untuk mencegah lemas (anemia).',
    ],
  },
  {
    id: 'v4',
    title: 'Stop Bullying!',
    youtubeId: 'BF4hRjaLHNE',
    duration: '06:30',
    description: 'Edukasi tentang bahaya perundungan dan bagaimana menjadi teman yang baik.',
    materials: [
      'Perundungan (Bullying) bisa berupa kata-kata kasar atau fisik.',
      'Jika melihat teman diganggu, segera lapor ke guru atau orang tua.',
      'Jadilah "Upstander", bukan cuma penonton.',
    ],
  },
  {
    id: 'v5',
    title: 'Kenapa Kita Haus?',
    youtubeId: 'ypfPpHi9tEc',
    duration: '04:50',
    description: 'Penjelasan ilmiah tentang kebutuhan cairan tubuh dan sinyal haus dari otak.',
    materials: [
      'Tubuh manusia terdiri dari sekitar 60-70% air.',
      'Otak mengirim sinyal haus ketika kadar garam dalam darah naik.',
      'Minum air cukup membantu konsentrasi belajar tetap tajam.',
    ],
  },
];
