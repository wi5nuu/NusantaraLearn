import { create } from 'zustand';
import { Storage, UserProfile } from '../services/StorageService';

interface UserState extends UserProfile {
  school: string;
  isLoading: boolean;
  loadProfile: () => Promise<void>;
  addXP: (amount: number) => Promise<void>;
  incrementLessons: (lessonId: string, xpReward: number) => Promise<void>;
  updateName: (name: string) => Promise<void>;
  checkAchievements: () => Promise<void>;
  unlockCertificate: (lessonId: string) => Promise<void>;
}

// Define an initial state for new users or when data is not found
const INITIAL_STATE: Omit<UserState, 'loadProfile' | 'addXP' | 'incrementLessons' | 'updateName' | 'isLoading' | 'checkAchievements' | 'unlockCertificate'> = {
  userId: '', // Will be generated if not found
  name: 'Pelajar',
  school: 'SD Nusantara', // Changed from 'kelas'
  kelas: '4',
  defaultLang: 'ind',
  xp: 0,
  level: 1,
  streak: 0,
  lastStudyDate: new Date().toISOString(),
  completedLessons: [],
  badges: [],
  downloadedPackages: [],
  unlockedCertificates: [],
};

const BADGE_RULES = [
  { id: 'newbie', name: 'Pelajar Baru', icon: '🐣', condition: (state: any) => state.xp >= 100 },
  { id: 'streak_3', name: 'Pejuang Belajar', icon: '🔥', condition: (state: any) => state.streak >= 3 },
  { id: 'math_wiz', name: 'Jago Hitung', icon: '🧮', condition: (state: any) => state.completedLessons.length >= 5 },
  { id: 'polyglot', name: 'Anak Nusantara', icon: '🇮🇩', condition: (state: any) => state.completedLessons.length >= 10 },
];

export const useUser = create<UserState>((set, get) => ({
  ...INITIAL_STATE, // Use the defined initial state
  isLoading: true,

  loadProfile: async () => {
    const data = await Storage.getProfile(); // Changed to Storage.getProfile()
    if (data && data.userId) { // Check if data and userId exist
      set({ ...data, isLoading: false });
    } else {
      // Create new unique ID for new device or if userId is missing
      const newId = 'NL-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      const profileToSave = { ...INITIAL_STATE, userId: newId };
      set({ ...profileToSave, isLoading: false });
      await Storage.saveProfile(profileToSave); // Changed to Storage.saveProfile()
    }
    get().checkAchievements();
  },

  checkAchievements: async () => {
    const currentState = get();
    const currentBadges = currentState.badges || [];
    const newBadges = [...currentBadges];
    let changed = false;

    BADGE_RULES.forEach(rule => {
      if (!currentBadges.includes(rule.id) && rule.condition(currentState)) {
        newBadges.push(rule.id);
        changed = true;
      }
    });

    if (changed) {
      set({ badges: newBadges });
      await Storage.saveProfile({ badges: newBadges });
    }
  },

  addXP: async (amount: number) => {
    const result = await Storage.addXP(amount);
    const profile = await Storage.getProfile();
    set({ ...profile });
    get().checkAchievements();
  },

  incrementLessons: async (lessonId: string, xpReward: number) => {
    await Storage.completeLesson(lessonId, xpReward);
    const profile = await Storage.getProfile();
    set({ ...profile });
    get().checkAchievements();
  },

  updateName: async (name: string) => {
    await Storage.saveProfile({ name });
    set({ name });
  },
  
  unlockCertificate: async (lessonId: string) => {
    const current = get().unlockedCertificates || [];
    if (current.includes(lessonId)) return;
    const updated = [...current, lessonId];
    await Storage.saveProfile({ unlockedCertificates: updated });
    set({ unlockedCertificates: updated });
  },
}));
