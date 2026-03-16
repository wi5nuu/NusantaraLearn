import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Colors } from '../../constants/colors';
import { LESSON_CARDS } from '../../constants/subjects';
import { useUser } from '../../stores/useUser';
import * as Linking from 'expo-linking';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function LessonScreen() {
  const { id } = useLocalSearchParams();
  const { name, completedLessons, unlockedCertificates } = useUser();
  const lesson = LESSON_CARDS.find((l) => l.id === id) || LESSON_CARDS[0];

  const isCompleted = completedLessons.includes(lesson.id);
  const isUnlocked = unlockedCertificates.includes(lesson.id);

  const handleClaimCertificate = () => {
    const phone = '6281394882490';
    const message = `Halo Admin NusantaraLearn! 👋\n\nSaya *${name}* telah menyelesaikan materi *"${lesson.title}"*.\n\nSaya ingin menebus Sertifikat Resmi seharga *Rp30.000*. Mohon instruksi pembayarannya ya! 🎟️✨`;
    Linking.openURL(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {lesson.title}
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {Platform.OS === 'web' ? (
          <View style={[styles.heroImage, { backgroundColor: lesson.bgColor }]}>
            <Text style={styles.heroEmoji}>{lesson.emoji}</Text>
          </View>
        ) : (
          <Animated.View entering={FadeInUp.duration(600).delay(100)}>
            <View style={[styles.heroImage, { backgroundColor: lesson.bgColor }]}>
              <Text style={styles.heroEmoji}>{lesson.emoji}</Text>
            </View>
          </Animated.View>
        )}

        {Platform.OS === 'web' ? (
          <View style={styles.article}>
            <Text style={styles.articleTitle}>{lesson.title}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>{lesson.meta}</Text>
              <TouchableOpacity style={styles.voiceButton} activeOpacity={0.7}>
                <Text style={styles.voiceIcon}>🔊</Text>
                <Text style={styles.voiceText}>Dengarkan Materi</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.paragraph}>
              Selamat datang di kelas! Hari ini kita akan belajar hal yang sangat seru. 
              Tahukah kamu bahwa banyak hal di sekitar kita yang menggunakan prinsip ini setiap hari?
            </Text>

            <View style={styles.infoBox}>
              <Text style={styles.infoBoxEmoji}>💡</Text>
              <Text style={styles.infoBoxText}>
                <Text style={{ fontWeight: 'bold' }}>Fakta Menarik:{'\n'}</Text>
                Konsep ini pertama kali ditemukan ribuan tahun lalu dan masih 
                dipakai hingga detik ini di seluruh dunia!
              </Text>
            </View>

            <Text style={styles.paragraph}>
              Mari kita mulai dengan contoh sederhana. Bayangkan Anda sedang berada di pasar tradisional atau sedang melihat kebun sawit. 
              Jika satu keranjang berisi 5 buah, dan Anda memiliki 3 keranjang, maka total buah yang Anda miliki adalah 15. Ini adalah contoh penerapan langsung!
            </Text>
          </View>
        ) : (
          <Animated.View style={styles.article} entering={FadeInUp.duration(600).delay(200)}>
            <Text style={styles.articleTitle}>{lesson.title}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>{lesson.meta}</Text>
              <TouchableOpacity style={styles.voiceButton} activeOpacity={0.7}>
                <Text style={styles.voiceIcon}>🔊</Text>
                <Text style={styles.voiceText}>Dengarkan Materi</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.paragraph}>
              Selamat datang di kelas! Hari ini kita akan belajar hal yang sangat seru. 
              Tahukah kamu bahwa banyak hal di sekitar kita yang menggunakan prinsip ini setiap hari?
            </Text>

            <View style={styles.infoBox}>
              <Text style={styles.infoBoxEmoji}>💡</Text>
              <Text style={styles.infoBoxText}>
                <Text style={{ fontWeight: 'bold' }}>Fakta Menarik:{'\n'}</Text>
                Konsep ini pertama kali ditemukan ribuan tahun lalu dan masih 
                dipakai hingga detik ini di seluruh dunia!
              </Text>
            </View>

            <Text style={styles.paragraph}>
              Mari kita mulai dengan contoh sederhana. Bayangkan Anda sedang berada di pasar tradisional atau sedang melihat kebun sawit. 
              Jika satu keranjang berisi 5 buah, dan Anda memiliki 3 keranjang, maka total buah yang Anda miliki adalah 15. Ini adalah contoh penerapan langsung!
            </Text>

            {isCompleted && (
              <View style={styles.certificateSection}>
                <LinearGradient
                  colors={['rgba(191,149,63,0.15)', 'rgba(252,246,186,0.1)']}
                  style={styles.certCard}
                >
                  <Text style={styles.certEmoji}>{isUnlocked ? '🎓' : '🎟️'}</Text>
                  <View style={styles.certInfo}>
                    <Text style={styles.certTitle}>
                      {isUnlocked ? 'Sertifikat Terbuka!' : 'Dapatkan Sertifikat Resmi'}
                    </Text>
                    <Text style={styles.certDesc}>
                      {isUnlocked 
                        ? 'Wah! Kamu sudah punya sertifikat untuk materi ini. Cek di profil ya!'
                        : 'Buktikan keahlianmu dengan sertifikat resmi NusantaraLearn seharga Rp30.000'}
                    </Text>
                  </View>
                  {!isUnlocked && (
                    <TouchableOpacity 
                      style={styles.claimBtn}
                      onPress={handleClaimCertificate}
                    >
                      <Text style={styles.claimBtnText}>Tebus Sertifikat</Text>
                    </TouchableOpacity>
                  )}
                </LinearGradient>
              </View>
            )}
          </Animated.View>
        )}
      </ScrollView>

      {/* Floating Action Strip */}
      {Platform.OS === 'web' ? (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.aiButton}
            onPress={() => router.push('/(tabs)/tutor')}
            activeOpacity={0.8}
          >
            <Text style={styles.aiButtonIcon}>🤖</Text>
            <Text style={styles.aiButtonText}>Tanya AI</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quizButton}
            onPress={() => router.push(`/quiz/${lesson.id}`)}
            activeOpacity={0.8}
          >
            <Text style={styles.quizButtonText}>Mulai Kuis →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Animated.View style={styles.bottomBar} entering={FadeIn.duration(800).delay(800)}>
          <TouchableOpacity
            style={styles.aiButton}
            onPress={() => router.push('/(tabs)/tutor')}
            activeOpacity={0.8}
          >
            <Text style={styles.aiButtonIcon}>🤖</Text>
            <Text style={styles.aiButtonText}>Tanya AI</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quizButton}
            onPress={() => router.push(`/quiz/${lesson.id}`)}
            activeOpacity={0.8}
          >
            <Text style={styles.quizButtonText}>Mulai Kuis →</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    color: Colors.textPrimary,
    fontSize: 16,
  },
  headerTitle: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Sora_700Bold',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 100,
  },
  heroImage: {
    width: width,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEmoji: {
    fontSize: 80,
  },
  article: {
    padding: 20,
  },
  articleTitle: {
    color: Colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Sora_700Bold',
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  metaText: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  voiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(55,138,221,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(55,138,221,0.3)',
  },
  voiceIcon: {
    fontSize: 14,
  },
  voiceText: {
    color: Colors.blueLight,
    fontSize: 12,
    fontWeight: '600',
  },
  paragraph: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 20,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(29,158,117,0.1)',
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    gap: 12,
  },
  infoBoxEmoji: {
    fontSize: 24,
  },
  infoBoxText: {
    flex: 1,
    color: Colors.primaryLight,
    fontSize: 14,
    lineHeight: 22,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 32,
    backgroundColor: 'rgba(11, 17, 32, 0.9)',
    borderTopWidth: 0.5,
    borderTopColor: Colors.border,
    gap: 12,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    gap: 8,
  },
  aiButtonIcon: {
    fontSize: 16,
  },
  aiButtonText: {
    color: Colors.textPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
  quizButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: `0px 4px 8px ${Colors.primary}4D`,
      }
    }),
  },
  quizButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  certificateSection: {
    marginTop: 30,
    marginBottom: 10,
  },
  certCard: {
    flexDirection: 'column',
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#B38728',
    alignItems: 'center',
    gap: 16,
  },
  certEmoji: {
    fontSize: 48,
  },
  certInfo: {
    alignItems: 'center',
  },
  certTitle: {
    color: '#FCF6BA',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
    textAlign: 'center',
  },
  certDesc: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  claimBtn: {
    backgroundColor: '#B38728',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  claimBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
