import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';
import { DownloadCard } from '../../components/DownloadCard';
import { useDownload } from '../../stores/useDownload';

export default function OfflineScreen() {
  const { packages } = useDownload();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>📥 Unduh Paket Ilmu</Text>
        </View>

        {/* Offline Hero Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerIcon}>✈️</Text>
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>Mode Tanpa Internet</Text>
            <Text style={styles.bannerSubtitle}>
              Unduh paket sekali saat ada WiFi. Belajar selamanya tanpa koneksi.
            </Text>
          </View>
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Paket Tersedia</Text>
          <Text style={styles.sectionHint}>~500MB per paket</Text>
        </View>

        {/* Download Cards */}
        <View style={styles.cardList}>
          {packages.map((pkg) => (
            <DownloadCard key={pkg.id} pkg={pkg} />
          ))}
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
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  banner: {
    marginHorizontal: 16,
    backgroundColor: 'rgba(55,138,221,0.1)',
    borderWidth: 1,
    borderColor: Colors.blueBorder,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  bannerIcon: {
    fontSize: 36,
  },
  bannerText: {
    flex: 1,
    gap: 4,
  },
  bannerTitle: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  bannerSubtitle: {
    color: Colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  sectionHint: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  cardList: {
    paddingHorizontal: 16,
    gap: 12,
  },
});
