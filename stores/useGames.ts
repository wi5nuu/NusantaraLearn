import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface GameProgress {
  gameId: string;
  highScore: number;
  currentLevel: number;
  totalStars: number; // 0-3 stars per level
  unlockedLevels: number;
}

interface GamesState {
  progress: Record<string, GameProgress>;
  isLoaded: boolean;
  loadProgress: () => Promise<void>;
  saveGameProgress: (gameId: string, level: number, score: number, stars: number) => Promise<void>;
  getGameProgress: (gameId: string) => GameProgress;
}

const DEFAULT_GAME_PROGRESS = (gameId: string): GameProgress => ({
  gameId,
  highScore: 0,
  currentLevel: 1,
  totalStars: 0,
  unlockedLevels: 1,
});

export const GAMES = [
  {
    id: 'star-shooter',
    title: 'Tembak Bintang',
    emoji: '🔫',
    description: 'Ketuk bintang jatuh sebelum kena tanah!',
    color: '#FF6B6B',
    gradient: ['#FF6B6B', '#FF4444'],
    totalLevels: 15,
    difficulty: 'Mudah',
  },
  {
    id: 'runner',
    title: 'Lari Nusantara',
    emoji: '🏃',
    description: 'Loncat hindari rintangan di jalan nusantara!',
    color: '#4ECDC4',
    gradient: ['#4ECDC4', '#2BAE66'],
    totalLevels: 12,
    difficulty: 'Mudah',
  },
  {
    id: 'racer',
    title: 'Balapan Kuda',
    emoji: '🏎️',
    description: 'Pacu kudamu menuju garis finis!',
    color: '#FFE66D',
    gradient: ['#FFE66D', '#F7C948'],
    totalLevels: 10,
    difficulty: 'Sedang',
  },
  {
    id: 'word-puzzle',
    title: 'Puzzle Kata',
    emoji: '🧩',
    description: 'Susun huruf menjadi kata Bahasa Indonesia!',
    color: '#A78BFA',
    gradient: ['#A78BFA', '#7C3AED'],
    totalLevels: 15,
    difficulty: 'Sedang',
  },
  {
    id: 'archery',
    title: 'Lempar Panah',
    emoji: '🎯',
    description: 'Bidik dan tembak target bergerak!',
    color: '#F97316',
    gradient: ['#F97316', '#DC2626'],
    totalLevels: 12,
    difficulty: 'Sulit',
  },
  {
    id: 'frog-jump',
    title: 'Katak Loncat',
    emoji: '🐸',
    description: 'Lompat dari lily pad ke lily pad!',
    color: '#22C55E',
    gradient: ['#22C55E', '#15803D'],
    totalLevels: 12,
    difficulty: 'Mudah',
  },
  {
    id: 'memory',
    title: 'Hafal Angka',
    emoji: '🧠',
    description: 'Ingat dan ulangi urutan cahaya!',
    color: '#EC4899',
    gradient: ['#EC4899', '#9D174D'],
    totalLevels: 10,
    difficulty: 'Sulit',
  },
  {
    id: 'word-surf',
    title: 'Selancar Kata',
    emoji: '🌊',
    description: 'Geser kartu kata ke kategori yang benar!',
    color: '#38BDF8',
    gradient: ['#38BDF8', '#0369A1'],
    totalLevels: 12,
    difficulty: 'Sedang',
  },
];

export const useGames = create<GamesState>((set, get) => ({
  progress: {},
  isLoaded: false,

  loadProgress: async () => {
    try {
      const raw = await AsyncStorage.getItem('games_progress');
      const data = raw ? JSON.parse(raw) : {};
      set({ progress: data, isLoaded: true });
    } catch {
      set({ isLoaded: true });
    }
  },

  saveGameProgress: async (gameId: string, level: number, score: number, stars: number) => {
    const current = get().progress[gameId] || DEFAULT_GAME_PROGRESS(gameId);
    const updated: GameProgress = {
      gameId,
      highScore: Math.max(current.highScore, score),
      currentLevel: Math.max(current.currentLevel, level),
      totalStars: current.totalStars + stars,
      unlockedLevels: Math.min(
        GAMES.find(g => g.id === gameId)?.totalLevels || 15,
        Math.max(current.unlockedLevels, level + 1)
      ),
    };
    const newProgress = { ...get().progress, [gameId]: updated };
    set({ progress: newProgress });
    await AsyncStorage.setItem('games_progress', JSON.stringify(newProgress));
  },

  getGameProgress: (gameId: string) => {
    return get().progress[gameId] || DEFAULT_GAME_PROGRESS(gameId);
  },
}));
