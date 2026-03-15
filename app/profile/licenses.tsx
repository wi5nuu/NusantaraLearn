import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';

export default function LicensesScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lisensi Open Source</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Daftar Lisensi</Text>
        <Text style={styles.text}>
          NusantaraLearn dibangun menggunakan teknologi open-source yang luar biasa. Berikut adalah daftar lisensi utama yang kami gunakan:
        </Text>
        
        <View style={styles.licenseCard}>
          <Text style={styles.libName}>React Native</Text>
          <Text style={styles.libLicense}>MIT License</Text>
        </View>

        <View style={styles.licenseCard}>
          <Text style={styles.libName}>Expo & Expo Router</Text>
          <Text style={styles.libLicense}>MIT License</Text>
        </View>

        <View style={styles.licenseCard}>
          <Text style={styles.libName}>React Native Reanimated</Text>
          <Text style={styles.libLicense}>MIT License</Text>
        </View>

        <View style={styles.licenseCard}>
          <Text style={styles.libName}>Zustand</Text>
          <Text style={styles.libLicense}>MIT License</Text>
        </View>

        <View style={styles.licenseCard}>
          <Text style={styles.libName}>Google Fonts</Text>
          <Text style={styles.libLicense}>Apache License 2.0</Text>
        </View>

        <Text style={styles.thankYou}>
          Terima kasih kepada seluruh pengembang komunitas global yang telah memungkinkan proyek ini terwujud.
        </Text>
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
  title: { color: Colors.textPrimary, fontSize: 22, fontWeight: '700', fontFamily: 'Sora_700Bold', marginBottom: 10 },
  text: { color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 22, marginBottom: 10 },
  licenseCard: { backgroundColor: Colors.bgCard, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, marginBottom: 8 },
  libName: { color: Colors.textPrimary, fontSize: 15, fontWeight: '700' },
  libLicense: { color: Colors.primaryLight, fontSize: 12, marginTop: 4 },
  thankYou: { color: Colors.textMuted, fontSize: 12, textAlign: 'center', marginTop: 32, paddingBottom: 20 },
});
