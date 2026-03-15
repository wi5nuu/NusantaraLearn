import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';

export default function PrivacyScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kebijakan Privasi</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Privasi Anda di NusantaraLearn</Text>
        <Text style={styles.date}>Terakhir diperbarui: 15 Maret 2026</Text>
        
        <Text style={styles.sectionTitle}>1. Data yang Kami Kumpulkan</Text>
        <Text style={styles.text}>
          Kami hanya mengumpulkan data minimal yang diperlukan untuk fungsionalitas aplikasi, seperti nama profil ( Wisnu ) dan progres belajar Anda. Data ini disimpan secara lokal di perangkat Anda.
        </Text>

        <Text style={styles.sectionTitle}>2. Penggunaan Data Offline</Text>
        <Text style={styles.text}>
          NusantaraLearn dirancang sebagai aplikasi offline-first. Progres belajar Anda tidak dikirim ke server kami kecuali jika Anda secara eksplisit melakukan sinkronisasi cloud di masa mendatang.
        </Text>

        <Text style={styles.sectionTitle}>3. Keamanan Data</Text>
        <Text style={styles.text}>
          Kami tidak membagikan informasi pribadi atau data belajar anak kepada pihak ketiga. Keamanan data Anda adalah prioritas utama kami.
        </Text>

        <Text style={styles.sectionTitle}>4. Hak Anda</Text>
        <Text style={styles.text}>
          Anda memiliki hak penuh untuk mengubah nama profil atau menghapus seluruh data aplikasi kapan saja melalui pengaturan sistem perangkat Anda.
        </Text>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Kontak Privasi: wisnualfian117@gmail.com</Text>
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
