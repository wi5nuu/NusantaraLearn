import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';

export default function TermsScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Syarat & Ketentuan</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Syarat Penggunaan NusantaraLearn</Text>
        <Text style={styles.date}>Terakhir diperbarui: 15 Maret 2026</Text>
        
        <Text style={styles.sectionTitle}>1. Penerimaan Ketentuan</Text>
        <Text style={styles.text}>
          Dengan mengunduh atau menggunakan aplikasi NusantaraLearn, Anda secara otomatis menyetujui ketentuan ini. Harap baca dengan seksama sebelum menggunakan aplikasi.
        </Text>

        <Text style={styles.sectionTitle}>2. Penggunaan Layanan</Text>
        <Text style={styles.text}>
          Aplikasi ini disediakan untuk tujuan pendidikan bagi anak-anak Indonesia. Anda dilarang mencoba menyalin, memodifikasi, atau mengekstrak kode sumber aplikasi tanpa izin tertulis dari pengembang.
        </Text>

        <Text style={styles.sectionTitle}>3. Konten & Hak Kekayaan Intelektual</Text>
        <Text style={styles.text}>
          Semua materi pembelajaran, video, dan buku cerita adalah hak cipta dari NusantaraLearn atau mitra penyedia konten kami. Penggunaan komersial tanpa izin sangat dilarang.
        </Text>

        <Text style={styles.sectionTitle}>4. Batasan Tanggung Jawab</Text>
        <Text style={styles.text}>
          Meskipun kami berusaha memberikan informasi yang akurat, NusantaraLearn tidak bertanggung jawab atas kerugian tidak langsung yang timbul dari penggunaan aplikasi.
        </Text>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2026 NusantaraLearn. Produk oleh Wisnu Alfian.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 0.5, borderBottomColor: Colors.border, gap: 12 },
  backButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center' },
  backArrow: { color: Colors.textPrimary, fontSize: 16 },
  headerTitle: { color: Colors.textPrimary, fontSize: 16, fontWeight: '700', fontFamily: 'Sora_700Bold' },
  content: { padding: 24, gap: 16 },
  title: { color: Colors.textPrimary, fontSize: 22, fontWeight: '700', fontFamily: 'Sora_700Bold' },
  date: { color: Colors.textMuted, fontSize: 12, marginBottom: 10 },
  sectionTitle: { color: Colors.primaryLight, fontSize: 16, fontWeight: '700', marginTop: 10 },
  text: { color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 22 },
  footer: { marginTop: 40, paddingBottom: 20, alignItems: 'center' },
  footerText: { color: Colors.textHint, fontSize: 11 },
});
