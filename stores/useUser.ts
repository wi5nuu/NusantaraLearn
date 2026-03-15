import { create } from 'zustand';

interface UserState {
  name: string;
  avatar: string;
  xp: number;
  completedLessons: number;
  studyDays: number;
  school: string;
  addXP: (amount: number) => void;
  incrementLessons: () => void;
}

export const useUser = create<UserState>((set) => ({
  name: 'Wisnu',
  avatar: 'W',
  xp: 840,
  completedLessons: 24,
  studyDays: 12,
  school: 'President University',
  addXP: (amount) => set((s) => ({ xp: s.xp + amount })),
  incrementLessons: () => set((s) => ({ completedLessons: s.completedLessons + 1 })),
}));
