import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  userId: string;
  name: string;
  kelas: string;
  defaultLang: string;
  xp: number;
  level: number;
  streak: number;
  lastStudyDate: string;
  completedLessons: string[];
  badges: string[];
  downloadedPackages: string[];
  unlockedCertificates: string[];
}

const DEFAULT_PROFILE: UserProfile = {
  userId: '',
  name: '',
  kelas: '4',
  defaultLang: 'ind',
  xp: 0,
  level: 1,
  streak: 0,
  lastStudyDate: '',
  completedLessons: [],
  badges: [],
  downloadedPackages: [],
  unlockedCertificates: [],
};

export const Storage = {
  async getProfile(): Promise<UserProfile> {
    try {
      const raw = await AsyncStorage.getItem('user_profile');
      return raw ? { ...DEFAULT_PROFILE, ...JSON.parse(raw) } : DEFAULT_PROFILE;
    } catch { return DEFAULT_PROFILE; }
  },

  async saveProfile(profile: Partial<UserProfile>): Promise<void> {
    const current = await this.getProfile();
    await AsyncStorage.setItem('user_profile', 
      JSON.stringify({ ...current, ...profile }));
  },

  async addXP(amount: number): Promise<{ newXP: number; levelUp: boolean }> {
    const profile = await this.getProfile();
    const newXP = profile.xp + amount;
    const newLevel = Math.floor(newXP / 500) + 1;
    const levelUp = newLevel > profile.level;
    await this.saveProfile({ xp: newXP, level: newLevel });
    return { newXP, levelUp };
  },

  async updateStreak(): Promise<number> {
    const profile = await this.getProfile();
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    let newStreak = profile.streak;
    if (profile.lastStudyDate === yesterday) newStreak += 1;
    else if (profile.lastStudyDate !== today) newStreak = 1;
    await this.saveProfile({ streak: newStreak, lastStudyDate: today });
    return newStreak;
  },

  async completeLesson(lessonId: string, xpReward: number) {
    const profile = await this.getProfile();
    if (profile.completedLessons.includes(lessonId)) return;
    const updated = [...profile.completedLessons, lessonId];
    await this.saveProfile({ completedLessons: updated });
    return await this.addXP(xpReward);
  },
};
