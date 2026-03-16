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
      'Matahari adalah pusat tata surya.',
      'Terdapat 8 planet utama di tata surya.',
      'Gravitas matahari menjaga planet tetap di orbitnya.',
    ],
  },
  {
    id: 'v2',
    title: 'Belajar Jenis Sayur',
    youtubeId: 'q_gVFSE3LEk',
    duration: '05:30',
    description: 'Pentingnya makan sayur setiap hari dan mengenal berbagai jenis sayuran hijau.',
    materials: [
      'Sayuran hijau kaya akan serat dan vitamin.',
      'Wortel sangat baik untuk kesehatan mata.',
      'Bayam mengandung zat besi yang tinggi.',
    ],
  },
  {
    id: 'v3',
    title: 'Sabar & Menahan Diri',
    youtubeId: 'eVA4yGNM2KE',
    duration: '04:15',
    description: 'Edukasi karakter tentang pentingnya sikap sabar dan pengendalian diri sejak dini.',
    materials: [
      'Sabar adalah kunci ketenangan hati.',
      'Menahan diri membantu kita berpikir lebih jernih.',
      'Saling menghargai dimulai dari pengendalian diri.',
    ],
  },
  {
    id: 'v4',
    title: 'Kisah Kura-kura Sombong',
    youtubeId: 'dCHxriGMCNM',
    duration: '07:45',
    description: 'Dongeng fabel tentang akibat dari sifat sombong dan pentingnya rendah hati.',
    materials: [
      'Kesombongan hanya akan merugikan diri sendiri.',
      'Rendah hati membuat kita punya banyak teman.',
      'Setiap makhluk punya kelebihan dan kekurangan.',
    ],
  },
  {
    id: 'v5',
    title: 'Alpi Si Bulu Lembut',
    youtubeId: 'T4P1oe7Oe00',
    duration: '06:20',
    description: 'Cerita binatang tentang petualangan Alpi yang mengajarkan kasih sayang.',
    materials: [
      'Menyayangi sesama makhluk hidup.',
      'Pentingnya menjaga kebersihan hewan peliharaan.',
      'Cara berinteraksi dengan hewan secara lembut.',
    ],
  },
  {
    id: 'v6',
    title: 'Mengenal Nama Buah',
    youtubeId: 'r8ErVr1Xm7s',
    duration: '08:10',
    description: 'Belajar mengenal berbagai macam buah-buahan tropis dan manfaatnya bagi tubuh.',
    materials: [
      'Buah-buahan adalah sumber vitamin alami.',
      'Jeruk mengandung banyak Vitamin C.',
      'Pisang memberikan energi yang cepat bagi tubuh.',
    ],
  },
];
