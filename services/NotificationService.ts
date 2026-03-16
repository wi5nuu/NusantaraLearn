import * as Notifications from 'expo-notifications';

export const NotificationService = {
  async requestPermission() {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  },

  async scheduleDailyReminder(name: string, hour = 18, minute = 0) {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Hei ${name}! 📚`,
        body: 'Sudah belajar hari ini? Pak AI menunggumu!',
        sound: true,
      },
      trigger: {
        hour,
        minute,
        repeats: true,
      } as any, // Bypass strict type check if necessary, or use correct interface
    });
  },

  async cancelAll() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },
};
