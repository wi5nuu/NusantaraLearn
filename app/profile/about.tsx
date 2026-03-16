import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';

export default function AboutScreen() {
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
        <Text style={styles.headerTitle}>Tentang Aplikasi</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* App Info Hero */}
        <View style={styles.appHero}>
          <View style={styles.logoBox}>
            <Text style={styles.logoEmoji}>📚</Text>
          </View>
          <Text style={styles.appName}>
            Nusantara<Text style={styles.appNameHighlight}>Learn</Text>
          </Text>
          <Text style={styles.version}>Versi 1.0.0 (Build 51)</Text>
          
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Offline-First</Text>
            </View>
            <View style={styles.badgeAI}>
              <Text style={styles.badgeTextAI}>Powered by AI</Text>
            </View>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Misi Kami</Text>
          <Text style={styles.paragraph}>
            NusantaraLearn dibangun dengan satu mimpi: memberikan akses pendidikan kelas dunia 
            bagi seluruh anak-anak Indonesia, bahkan di pedalaman yang tidak tersentuh sinyal internet sekalipun.
          </Text>
          <Text style={styles.paragraph}>
            Dengan integrasi model AI yang berjalan langsung di perangkat (*on-device AI*) dan sistem unduhan pintar, 
            setiap anak kini memiliki **Guru Virtual Pribadi** yang senantiasa mengerti bahasa daerah mereka.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tim Pengembang</Text>
          <View style={styles.teamCard}>
            <Text style={styles.teamRole}>Dikembangkan oleh</Text>
            <Text style={styles.teamName}>Wisnu Alfian</Text>
            <Text style={styles.teamEmail}>wisnualfian117@gmail.com</Text>
            <Text style={styles.teamInst}>Untuk Generasi Emas Indonesia 🇮🇩</Text>
          </View>
        </View>

        <View style={styles.legalSection}>
          <TouchableOpacity 
            style={styles.linkRow} 
            activeOpacity={0.7}
            onPress={() => router.push('/profile/terms')}
          >
            <Text style={styles.linkText}>Syarat & Ketentuan</Text>
            <Text style={styles.linkArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.linkRow} 
            activeOpacity={0.7}
            onPress={() => router.push('/profile/privacy')}
          >
            <Text style={styles.linkText}>Kebijakan Privasi</Text>
            <Text style={styles.linkArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.linkRow, styles.lastLinkRow]} 
            activeOpacity={0.7}
            onPress={() => router.push('/profile/licenses')}
          >
            <Text style={styles.linkText}>Lisensi Open Source</Text>
            <Text style={styles.linkArrow}>›</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.copyright}>© 2026 NusantaraLearn. Hak Cipta Dilindungi.</Text>

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
  appHero: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: 'rgba(29,158,117,0.03)',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
      web: {
        boxShadow: `0px 8px 16px ${Colors.primary}80`,
      }
    }),
    marginBottom: 16,
  },
  logoEmoji: {
    fontSize: 40,
  },
  appName: {
    color: Colors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Sora_700Bold',
    marginBottom: 4,
  },
  appNameHighlight: {
    color: Colors.primary,
  },
  version: {
    color: Colors.textMuted,
    fontSize: 13,
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    backgroundColor: 'rgba(55,138,221,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(55,138,221,0.3)',
  },
  badgeAI: {
    backgroundColor: 'rgba(162,52,126,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(162,52,126,0.3)',
  },
  badgeText: {
    color: Colors.blueLight,
    fontSize: 11,
    fontWeight: '700',
  },
  badgeTextAI: {
    color: '#E072B3',
    fontSize: 11,
    fontWeight: '700',
  },
  section: {
    padding: 24,
    paddingBottom: 8,
  },
  sectionTitle: {
    color: Colors.primaryLight,
    fontSize: 18,
    fontFamily: 'Sora_700Bold',
    marginBottom: 12,
  },
  paragraph: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  teamCard: {
    backgroundColor: Colors.bgCard,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  teamRole: {
    color: Colors.textMuted,
    fontSize: 12,
    marginBottom: 4,
  },
  teamName: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Sora_700Bold',
    marginBottom: 2,
  },
  teamEmail: {
    color: Colors.textMuted,
    fontSize: 12,
    marginBottom: 8,
  },
  teamInst: {
    color: Colors.primaryLight,
    fontSize: 12,
  },
  legalSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.bgCard2,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  lastLinkRow: {
    borderBottomWidth: 0,
  },
  linkText: {
    color: Colors.textPrimary,
    fontSize: 14,
  },
  linkArrow: {
    color: Colors.textMuted,
    fontSize: 18,
  },
  copyright: {
    color: Colors.textHint,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 24,
  },
});
