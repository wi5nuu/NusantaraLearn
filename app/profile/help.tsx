import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';

const FAQS = [
  {
    q: 'Bagaimana cara menggunakan aplikasi tanpa internet?',
    a: 'Anda bisa masuk ke menu "Unduhan" (ikon panah ke bawah) saat sedang terhubung ke WiFi atau punya kuota internet. Unduh paket pelajaran yang Anda inginkan. Setelah diunduh (tercentang hijau), Anda bisa mematikan internet dan semua materi akan tetap bisa diakses!',
  },
  {
    q: 'Apakah bisa ganti bahasa Pak AI Tutor?',
    a: 'Tentu. Saat Anda sedang mengobrol dengan Pak AI, Anda dapat menekan tombol bahasa di bagian atas layar obrolan (🇮🇩 Indonesia, 🗣 Jawa, 🗣 Sunda, 🗣 Bugis).',
  },
  {
    q: 'Apakah poin XP saya bisa berkurang?',
    a: 'Tidak. Poin XP adalah akumulasi dari seberapa sering Anda berlatih kuis di NusantaraLearn. Semakin rajin Anda bersemangat menjawab kuis, semakin cepat level ⭐ Pelajar Aktif Anda akan naik!',
  },
];

export default function HelpScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bantuan & Panduan</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.heroBox}>
          <Text style={styles.heroEmoji}>🆘</Text>
          <Text style={styles.heroTitle}>Pusat Bantuan</Text>
          <Text style={styles.heroDesc}>
            Temukan jawaban untuk pertanyaan yang paling sering ditanyakan di bawah ini.
          </Text>
        </View>

        <View style={styles.faqList}>
          {FAQS.map((faq, i) => (
            <View key={i} style={styles.faqCard}>
              <Text style={styles.questionText}>Q: {faq.q}</Text>
              <Text style={styles.answerText}>{faq.a}</Text>
            </View>
          ))}
        </View>

        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Masih butuh bantuan?</Text>
          <TouchableOpacity 
            style={styles.contactButton} 
            activeOpacity={0.8}
            onPress={() => Linking.openURL('mailto:wisnualfian117@gmail.com')}
          >
            <Text style={styles.contactButtonEmoji}>📧</Text>
            <Text style={styles.contactButtonText}>Email: wisnualfian117@gmail.com</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Sora_700Bold',
  },
  content: {
    paddingBottom: 40,
  },
  heroBox: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: 'rgba(55,138,221,0.05)',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    marginBottom: 20,
  },
  heroEmoji: {
    fontSize: 60,
    marginBottom: 12,
  },
  heroTitle: {
    color: Colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Sora_700Bold',
    marginBottom: 8,
  },
  heroDesc: {
    color: Colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  faqList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  faqCard: {
    backgroundColor: Colors.bgCard,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  questionText: {
    color: Colors.primaryLight,
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Sora_700Bold',
    marginBottom: 10,
    lineHeight: 22,
  },
  answerText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    lineHeight: 22,
  },
  contactSection: {
    marginTop: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingBottom: 20,
  },
  contactTitle: {
    color: Colors.textMuted,
    fontSize: 13,
    marginBottom: 12,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 8,
  },
  contactButtonEmoji: {
    fontSize: 18,
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
