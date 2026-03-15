import { create } from 'zustand';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'alert';
  isRead: boolean;
}

interface NotificationState {
  enabled: boolean;
  notifications: AppNotification[];
  toggleEnabled: (value: boolean) => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: '1',
    title: 'Materi Baru! 📚',
    message: 'Ayo belajar Jarimatika yang seru bersama Pak Guru di video terbaru.',
    time: '2 jam yang lalu',
    type: 'info',
    isRead: false,
  },
  {
    id: '2',
    title: 'XP Bonus Menanti 🌟',
    message: 'Selesaikan kuis Tata Surya hari ini untuk mendapatkan bonus 50 XP!',
    time: '5 jam yang lalu',
    type: 'success',
    isRead: false,
  },
  {
    id: '3',
    title: 'Update Profil Berhasil 👤',
    message: 'Halo Wisnu, profilmu sekarang tertulis President University.',
    time: 'Sekarang',
    type: 'success',
    isRead: false,
  },
];

export const useNotifications = create<NotificationState>((set) => ({
  enabled: true,
  notifications: INITIAL_NOTIFICATIONS,
  toggleEnabled: (value) => set({ enabled: value }),
  addNotification: (notif) => set((state) => ({
    notifications: [
      { ...notif, id: Date.now().toString(), isRead: false },
      ...state.notifications
    ]
  })),
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n)
  })),
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, isRead: true }))
  })),
  clearAll: () => set({ notifications: [] }),
}));
