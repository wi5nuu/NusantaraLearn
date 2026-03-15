import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import { Colors } from '../constants/colors';
import { useNotifications, AppNotification } from '../stores/useNotifications';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const NotificationModal = ({ visible, onClose }: Props) => {
  const { notifications, markAllAsRead, clearAll } = useNotifications();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.container}>
          <Pressable style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Notifikasi</Text>
              <View style={styles.headerActions}>
                <TouchableOpacity onPress={markAllAsRead}>
                  <Text style={styles.actionText}>Baca Semua</Text>
                </TouchableOpacity>
                <View style={styles.sep} />
                <TouchableOpacity onPress={clearAll}>
                  <Text style={[styles.actionText, { color: '#ff4d4d' }]}>Hapus</Text>
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <View key={n.id} style={[styles.card, !n.isRead && styles.cardUnread]}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardTitle}>{n.title}</Text>
                      {!n.isRead && <View style={styles.unreadDot} />}
                    </View>
                    <Text style={styles.cardBody}>{n.message}</Text>
                    <Text style={styles.cardTime}>{n.time}</Text>
                  </View>
                ))
              ) : (
                <View style={styles.empty}>
                  <Text style={styles.emptyEmoji}>📭</Text>
                  <Text style={styles.emptyText}>Belum ada notifikasi baru</Text>
                </View>
              )}
            </ScrollView>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Tutup</Text>
            </TouchableOpacity>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 400,
  },
  content: {
    backgroundColor: Colors.bgMid,
    borderRadius: 24,
    padding: 24,
    height: 500,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Sora_700Bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionText: {
    color: Colors.primaryLight,
    fontSize: 11,
    fontWeight: '600',
  },
  sep: {
    width: 1,
    height: 12,
    backgroundColor: Colors.border,
  },
  list: {
    gap: 12,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: Colors.bgCard,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardUnread: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(29,158,117,0.05)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  cardBody: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  cardTime: {
    color: Colors.textHint,
    fontSize: 10,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyEmoji: {
    fontSize: 40,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  closeButtonText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
});
