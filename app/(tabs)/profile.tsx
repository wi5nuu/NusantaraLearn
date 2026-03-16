import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Switch,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';
import { useUser } from '../../stores/useUser';
import { useNotifications } from '../../stores/useNotifications';
import { WeeklyProgress } from '../../components/WeeklyProgress';
import { AchievementBadges } from '../../components/AchievementBadges';
import { CertificateCard } from '../../components/CertificateCard';
import { LESSON_CARDS } from '../../constants/subjects';
import { GlassHeader } from '../../components/GlassHeader';

const BADGE_MAP: Record<string, { name: string; icon: string }> = {
  'newbie': { name: 'Pelajar Baru', icon: '🐣' },
  'streak_3': { name: 'Pejuang Belajar', icon: '🔥' },
  'math_wiz': { name: 'Jago Hitung', icon: '🧮' },
  'polyglot': { name: 'Anak Nusantara', icon: '🇮🇩' },
};

// Define the static list of languages for the modal options
const LANGUAGES = [
  { id: 'id', label: '🇮🇩 Indonesia' },
  { id: 'jv', label: '🗣 Jawa' },
  { id: 'su', label: '🗣 Sunda' },
  { id: 'bg', label: '🗣 Bugis' },
];

const TARGETS = ['15 menit/hari', '30 menit/hari', '1 jam/hari', '2 jam/hari'];
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProfileScreen() {
  const { userId, name, xp, streak, completedLessons, badges, unlockedCertificates, loadProfile, isLoading, unlockCertificate } = useUser();
  const { enabled: isNotifOn, toggleEnabled: setIsNotifOn } = useNotifications();

  React.useEffect(() => {
    loadProfile();
  }, []);

  // Local component states for interactive settings
  const [target, setTarget] = useState('1 jam/hari');
  const [language, setLanguage] = useState('🇮🇩 Indonesia');
  const [isOfflineMode, setIsOfflineMode] = useState(true);

  // Modal visibility states
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'settings' | 'report' | 'certificates'>('settings');
  const [isAdminMode, setIsAdminMode] = useState(false);

  const [isPreparing, setIsPreparing] = useState<string | null>(null);

  const STATS = [
    { label: 'Pelajaran Selesai', value: completedLessons.length.toString() },
    { label: 'Hari Belajar', value: streak.toString() },
    { label: 'Poin XP', value: xp.toString() },
  ];

  return (
    <View style={styles.safeArea}>
      <GlassHeader title="Profil Saya 👤" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>{name ? name[0].toUpperCase() : '?'}</Text>
          </View>
          <Text style={styles.name}>{name || 'Pelajar Nusantara'}</Text>
          <Text style={styles.school}>Siswa Kelas {useUser.getState().kelas}</Text>
          <View style={styles.idBadge}>
            <Text style={styles.idBadgeText}>🆔 ID Belajar: {userId}</Text>
          </View>
          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeText}>⭐ Level {useUser.getState().level}</Text>
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

        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'settings' && styles.activeTab]} 
            onPress={() => setActiveTab('settings')}
          >
            <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>Pengaturan</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'report' && styles.activeTab]} 
            onPress={() => setActiveTab('report')}
          >
            <Text style={[styles.tabText, activeTab === 'report' && styles.activeTabText]}>Laporan</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'certificates' && styles.activeTab]} 
            onPress={() => setActiveTab('certificates')}
          >
            <Text style={[styles.tabText, activeTab === 'certificates' && styles.activeTabText]}>Sertifikat</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'settings' ? (
          /* Settings Content */
          <View style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>Pengaturan Aplikasi</Text>

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
            onPress={() => router.push('/teacher-mode')}
          >
            <Text style={styles.menuEmoji}>👨‍🏫</Text>
            <Text style={styles.menuLabel}>Mode Guru / Orang Tua</Text>
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

          <Text style={[styles.menuSectionTitle, { marginTop: 12 }]}>Status Sistem</Text>
          <View style={[styles.statusCard, { backgroundColor: isOfflineMode ? 'rgba(255,165,0,0.1)' : 'rgba(29,158,117,0.1)' }]}>
            <Text style={styles.statusEmoji}>{isOfflineMode ? '🌍' : '⚡'}</Text>
            <View>
              <Text style={styles.statusMain}>{isOfflineMode ? 'Mode Hemat Aktif' : 'Terhubung Online'}</Text>
              <Text style={styles.statusSub}>
                {isOfflineMode 
                  ? 'Aplikasi berjalan menggunakan data lokal' 
                  : 'Siap mengunduh materi & update terbaru'}
              </Text>
            </View>
          </View>
          </View>
        ) : activeTab === 'report' ? (
          /* Report & Achievement Content */
          <View style={styles.reportSection}>
            <Text style={styles.menuSectionTitle}>Lencana yang Diraih 🎖️</Text>
            <View style={styles.badgesGrid}>
              {badges && badges.length > 0 ? (
                badges.map(badgeId => (
                  <View key={badgeId} style={styles.badgeItem}>
                    <View style={styles.badgeCircle}>
                      <Text style={styles.badgeIcon}>{BADGE_MAP[badgeId]?.icon || '✨'}</Text>
                    </View>
                    <Text style={styles.badgeName}>{BADGE_MAP[badgeId]?.name || 'Rahasia'}</Text>
                  </View>
                ))
              ) : (
                <View style={styles.emptyBadges}>
                  <Text style={styles.emptyBadgesText}>Belum ada lencana. Ayo terus belajar!</Text>
                </View>
              )}
            </View>

            <Text style={[styles.menuSectionTitle, { marginTop: 24 }]}>Statistik Belajar 📊</Text>
            <WeeklyProgress />
            
            <View style={styles.reportSummary}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{completedLessons.length}</Text>
                <Text style={styles.summaryLabel}>Total Materi</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{streak}</Text>
                <Text style={styles.summaryLabel}>Hari Aktif</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{Math.floor(xp / 100)}</Text>
                <Text style={styles.summaryLabel}>Level Capai</Text>
              </View>
            </View>
          </View>
        ) : activeTab === 'certificates' ? (
          /* Certificates Gallery */
          <View style={styles.certGallery}>
            <View style={styles.certHeaderBox}>
              <Text style={styles.menuSectionTitle}>Koleksi Sertifikat 🏆</Text>
              <TouchableOpacity 
                style={styles.adminTrigger} 
                onPress={() => setIsAdminMode(!isAdminMode)}
              >
                <Text style={styles.certCount}>{unlockedCertificates.length} Diraih (Klik untuk Admin)</Text>
              </TouchableOpacity>
            </View>

            {isAdminMode && (
              <View style={styles.adminPanel}>
                <Text style={styles.adminTitle}>Admin Simulator (Unlock Test)</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                  {LESSON_CARDS.map(l => (
                    <TouchableOpacity 
                      key={l.id} 
                      style={[styles.adminBtn, unlockedCertificates.includes(l.id) && styles.adminBtnUsed]}
                      onPress={() => unlockCertificate(l.id)}
                    >
                      <Text style={styles.adminBtnText}>{l.title}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {unlockedCertificates.length > 0 ? (
              <View style={styles.certList}>
                {unlockedCertificates.map(lessonId => {
                  const lesson = LESSON_CARDS.find(l => l.id === lessonId);
                  if (!lesson) return null;
                  
                  const handleDownload = () => {
                    setIsPreparing(lessonId);
                    
                    // Simulate premium preparation
                    setTimeout(() => {
                      if (Platform.OS === 'web') {
                        const style = document.createElement('style');
                        style.innerHTML = `
                          @media print {
                            @page { 
                              size: A4 landscape; 
                              margin: 0; 
                            }
                            html, body {
                              height: 100%;
                              margin: 0 !important;
                              padding: 0 !important;
                              overflow: hidden !important;
                              background-color: white !important;
                            }
                            #root, #__next, [data-expo-container] { 
                              display: none !important; 
                            }
                            .printable-cert-isolated {
                              display: flex !important;
                              position: fixed !important;
                              top: 0 !important;
                              left: 0 !important;
                              width: 297mm !important;
                              height: 210mm !important;
                              z-index: 999999 !important;
                              background-color: white !important;
                              visibility: visible !important;
                            }
                            .printable-cert-isolated * {
                              visibility: visible !important;
                            }
                            /* Hide the download button during print */
                            .printable-cert-isolated > :last-child { 
                              display: none !important; 
                            }
                          }
                        `;
                        document.head.appendChild(style);
                        
                        // Add class to target element
                        const certElement = document.getElementById(`printable-cert-${lessonId}`);
                        if (certElement) certElement.classList.add('printable-cert-isolated');
                        
                        window.print();
                        
                        // Cleanup
                        if (certElement) certElement.classList.remove('printable-cert-isolated');
                        document.head.removeChild(style);
                      } else {
                        alert('Sertifikat dapat diunduh (PDF/Image) melalui versi Web untuk hasil maksimal.');
                      }
                      setIsPreparing(null);
                    }, 1500);
                  };

                  return (
                    <View key={lessonId} style={styles.certWrapper} id={`printable-cert-${lessonId}`}>
                      <CertificateCard 
                        userName={name}
                        lessonTitle={lesson.title}
                        date={new Date().toLocaleDateString('id-ID')}
                        certificateId={`CERT-${lessonId.toUpperCase()}-${userId.substring(0,4)}`}
                      />
                      <TouchableOpacity 
                        style={[styles.downloadBtn, isPreparing === lessonId && { opacity: 0.5 }]}
                        onPress={handleDownload}
                        activeOpacity={0.7}
                        disabled={!!isPreparing}
                      >
                        <Text style={styles.downloadBtnText}>
                          {isPreparing === lessonId ? '⌛ Menyiapkan Dokumen...' : '📥 Simpan Digital (PDF/Image)'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            ) : (
              <View style={styles.emptyCert}>
                <Text style={styles.emptyCertEmoji}>🎟️</Text>
                <Text style={styles.emptyCertText}>Belum ada sertifikat official.</Text>
                <Text style={styles.emptyCertSub}>Selesaikan pelajaran dan tebus sertifikatmu untuk membanggakan orang tua!</Text>
                <TouchableOpacity 
                  style={styles.browseBtn}
                  onPress={() => router.push('/(tabs)/home')}
                >
                  <Text style={styles.browseBtnText}>Cari Materi</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : null}

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

    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  content: {
    paddingTop: 110,
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
  idBadge: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 4,
  },
  idBadgeText: {
    color: Colors.textMuted,
    fontSize: 11,
    fontFamily: 'monospace',
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 16,
    marginBottom: 12,
  },
  statusEmoji: {
    fontSize: 24,
  },
  statusMain: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  statusSub: {
    color: Colors.textMuted,
    fontSize: 12,
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
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  activeTabText: {
    color: '#fff',
  },
  reportSection: {
    paddingHorizontal: 20,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 12,
  },
  badgeItem: {
    width: (SCREEN_WIDTH - 80) / 3, // Approx 3 items per row
    alignItems: 'center',
    gap: 6,
  },
  badgeCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,215,0,0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255,215,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeIcon: {
    fontSize: 28,
  },
  badgeName: {
    color: Colors.textPrimary,
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyBadges: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  emptyBadgesText: {
    color: Colors.textMuted,
    fontSize: 13,
    fontStyle: 'italic',
  },
  reportSummary: {
    flexDirection: 'row',
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
    gap: 4,
  },
  summaryValue: {
    color: Colors.primaryLight,
    fontSize: 20,
    fontWeight: '800',
  },
  summaryLabel: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  certGallery: {
    paddingHorizontal: 20,
    gap: 16,
  },
  certHeaderBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  certCount: {
    color: '#B38728',
    fontSize: 12,
    fontWeight: '700',
  },
  adminTrigger: {
    backgroundColor: 'rgba(180, 135, 40, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(180, 135, 40, 0.3)',
  },
  certList: {
    gap: 30,
  },
  certWrapper: {
    gap: 12,
    alignItems: 'center',
  },
  downloadBtn: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  downloadBtnText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  emptyCert: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyCertEmoji: {
    fontSize: 48,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyCertText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyCertSub: {
    color: Colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
  browseBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  browseBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
  adminPanel: {
    backgroundColor: '#3b1d1d',
    padding: 16,
    borderRadius: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#ff4d4d',
  },
  adminTitle: {
    color: '#ff4d4d',
    fontSize: 12,
    fontWeight: '900',
  },
  adminBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  adminBtnUsed: {
    opacity: 0.3,
  },
  adminBtnText: {
    color: '#fff',
    fontSize: 11,
  },
});
