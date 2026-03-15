import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';
import { useUser } from '../../stores/useUser';
import { useNotifications } from '../../stores/useNotifications';
import { WeeklyProgress } from '../../components/WeeklyProgress';
import { AchievementBadges } from '../../components/AchievementBadges';

// Define the static list of languages for the modal options
const LANGUAGES = [
  { id: 'id', label: '🇮🇩 Indonesia' },
  { id: 'jv', label: '🗣 Jawa' },
  { id: 'su', label: '🗣 Sunda' },
  { id: 'bg', label: '🗣 Bugis' },
];

const TARGETS = ['15 menit/hari', '30 menit/hari', '1 jam/hari', '2 jam/hari'];

export default function ProfileScreen() {
  const { name, xp, studyDays, completedLessons, school } = useUser();
  const { enabled: isNotifOn, toggleEnabled: setIsNotifOn } = useNotifications();

  // Local component states for interactive settings
  const [target, setTarget] = useState('1 jam/hari');
  const [language, setLanguage] = useState('🇮🇩 Indonesia');
  const [isOfflineMode, setIsOfflineMode] = useState(true);

  // Modal visibility states
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);

  const STATS = [
    { label: 'Pelajaran Selesai', value: completedLessons.toString() },
    { label: 'Hari Belajar', value: studyDays.toString() },
    { label: 'Poin XP', value: xp.toString() },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>A</Text>
          </View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.school}>{school}</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeText}>⭐ Pelajar Aktif</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {STATS.map((stat, i) => (
            <View key={i} style={styles.statCard}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Pengaturan</Text>

          {/* Target Belajar */}
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.75}
            onPress={() => setShowTargetModal(true)}
          >
            <Text style={styles.menuEmoji}>🎯</Text>
            <Text style={styles.menuLabel}>Target Belajar</Text>
            <View style={styles.menuRight}>
              <Text style={styles.menuValue}>{target}</Text>
              <Text style={styles.menuArrow}>›</Text>
            </View>
          </TouchableOpacity>

          {/* Bahasa Utama */}
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.75}
            onPress={() => setShowLangModal(true)}
          >
            <Text style={styles.menuEmoji}>🌐</Text>
            <Text style={styles.menuLabel}>Bahasa Utama</Text>
            <View style={styles.menuRight}>
              <Text style={styles.menuValue}>{language}</Text>
              <Text style={styles.menuArrow}>›</Text>
            </View>
          </TouchableOpacity>

          {/* Mode Offline Toggle */}
          <View style={styles.menuItem}>
            <Text style={styles.menuEmoji}>📶</Text>
            <Text style={styles.menuLabel}>Mode Offline</Text>
            <View style={styles.menuRight}>
              <Switch
                value={isOfflineMode}
                onValueChange={setIsOfflineMode}
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor={isOfflineMode ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>

          {/* Notifikasi Toggle */}
          <View style={styles.menuItem}>
            <Text style={styles.menuEmoji}>🔔</Text>
            <Text style={styles.menuLabel}>Notifikasi</Text>
            <View style={styles.menuRight}>
              <Switch
                value={isNotifOn}
                onValueChange={setIsNotifOn}
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor={isNotifOn ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>

          {/* Static info items */}
          <TouchableOpacity 
            style={styles.menuItem} 
            activeOpacity={0.75}
            onPress={() => router.push('/profile/help')}
          >
            <Text style={styles.menuEmoji}>🆘</Text>
            <Text style={styles.menuLabel}>Bantuan & Panduan</Text>
            <View style={styles.menuRight}>
              <Text style={styles.menuArrow}>›</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            activeOpacity={0.75}
            onPress={() => router.push('/profile/about')}
          >
            <Text style={styles.menuEmoji}>ℹ️</Text>
            <Text style={styles.menuLabel}>Tentang NusantaraLearn</Text>
            <View style={styles.menuRight}>
              <Text style={styles.menuValue}>v1.0.0</Text>
              <Text style={styles.menuArrow}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>NusantaraLearn v1.0.0</Text>
          <Text style={styles.footerSub}>
            Dibuat untuk Generasi Emas Indonesia 🇮🇩
          </Text>
        </View>
      </ScrollView>

      {/* Target Modal */}
      <Modal
        visible={showTargetModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTargetModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pilih Target Belajar</Text>
            {TARGETS.map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.modalOption, target === t && styles.modalOptionActive]}
                onPress={() => {
                  setTarget(t);
                  setShowTargetModal(false);
                }}
              >
                <Text style={[styles.modalOptionText, target === t && styles.modalOptionTextActive]}>
                  {t}
                </Text>
                {target === t && <Text style={styles.modalCheck}>✓</Text>}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowTargetModal(false)}>
              <Text style={styles.modalCloseText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Language Modal */}
      <Modal
        visible={showLangModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLangModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pilih Bahasa Utama</Text>
            {LANGUAGES.map((l) => (
              <TouchableOpacity
                key={l.id}
                style={[styles.modalOption, language === l.label && styles.modalOptionActive]}
                onPress={() => {
                  setLanguage(l.label);
                  setShowLangModal(false);
                }}
              >
                <Text style={[styles.modalOptionText, language === l.label && styles.modalOptionTextActive]}>
                  {l.label}
                </Text>
                {language === l.label && <Text style={styles.modalCheck}>✓</Text>}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowLangModal(false)}>
              <Text style={styles.modalCloseText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  content: {
    paddingBottom: 32,
    gap: 20,
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 20,
    gap: 8,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  avatarLargeText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
  },
  name: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Sora_700Bold',
  },
  school: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  levelBadge: {
    backgroundColor: 'rgba(29,158,117,0.15)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(29,158,117,0.4)',
    marginTop: 4,
  },
  levelBadgeText: {
    color: Colors.primaryLight,
    fontSize: 12,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    color: Colors.primary,
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Sora_700Bold',
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    textAlign: 'center',
  },
  menuSection: {
    paddingHorizontal: 16,
    gap: 2,
  },
  menuSectionTitle: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 4,
    paddingBottom: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 6,
    gap: 12,
  },
  menuEmoji: {
    fontSize: 18,
    width: 24,
    textAlign: 'center',
  },
  menuLabel: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 14,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  menuValue: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  menuArrow: {
    color: Colors.textMuted,
    fontSize: 18,
  },
  footer: {
    alignItems: 'center',
    gap: 4,
    paddingTop: 8,
  },
  footerText: {
    color: Colors.textHint,
    fontSize: 12,
  },
  footerSub: {
    color: Colors.textHint,
    fontSize: 11,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.bgMid,
    width: '100%',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  modalTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Sora_700Bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: Colors.bgCard,
  },
  modalOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(29,158,117,0.15)',
  },
  modalOptionText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  modalOptionTextActive: {
    color: Colors.primaryLight,
  },
  modalCheck: {
    color: Colors.primaryLight,
    fontSize: 18,
    fontWeight: '700',
  },
  modalCloseBtn: {
    marginTop: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalCloseText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
});
