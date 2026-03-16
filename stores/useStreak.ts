import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface StreakState {
  count: number;
  lastLoginDate: string | null;
  updateStreak: () => void;
}

export const useStreak = create<StreakState>()(
  persist(
    (set, get) => ({
      count: 0,
      lastLoginDate: null,
      updateStreak: () => {
        const today = new Date().toISOString().split('T')[0];
        const lastDate = get().lastLoginDate;

        if (!lastDate) {
          // First time
          set({ count: 1, lastLoginDate: today });
          return;
        }

        if (lastDate === today) {
          // Already updated today
          return;
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (lastDate === yesterdayStr) {
          // Consecutive day
          set((state) => ({ count: state.count + 1, lastLoginDate: today }));
        } else {
          // Streak broken
          set({ count: 1, lastLoginDate: today });
        }
      },
    }),
    {
      name: 'streak-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
