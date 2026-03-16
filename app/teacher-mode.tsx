import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Share,
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../constants/colors';
import { useUser } from '../stores/useUser';

export default function TeacherModeScreen() {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { name, xp, streak, completedLessons, level } = useUser();

  const handleLogin = () => {
    if (pin === '1234') { // Default PIN
      setIsAuthenticated(true);
    } else {
      alert('PIN Salah! Cobalah 1234');
    }
  };

  const shareProgress = () => {
    const message = `Laporan Belajar ${name}:\n- Level: ${level}\n- Total XP: ${xp}\n- Streak: ${streak} hari\n- Pelajaran Selesai: ${completedLessons.length}\n\nDikirim dari NusantaraLearn.`;
    Share.share({ message });
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.authContainer}>
        <View style={styles.authBox}>
          <Text style={styles.authEmoji}>🔐</Text>
          <Text style={styles.authTitle}>Mode Guru / Orang Tua</Text>
          <Text style={styles.authSub}>Masukkan PIN untuk melihat progres anak</Text>
          <TextInput
            style={styles.pinInput}
            secureTextEntry
            keyboardType="number-pad"
            maxLength={4}
            placeholder="****"
            placeholderTextColor="rgba(255,255,255,0.2)"
            value={pin}
            onChangeText={setPin}
          />
          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
            <Text style={styles.loginBtnText}>Masuk</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backLink}>Kembali ke Profil</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dashboard Guru</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total XP</Text>
            <Text style={styles.statValue}>{xp}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Level</Text>
            <Text style={styles.statValue}>{level}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Streak</Text>
            <Text style={styles.statValue}>{streak} Hari</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Pelajaran</Text>
            <Text style={styles.statValue}>{completedLessons.length}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Pelajaran yang Diselesaikan</Text>
        {completedLessons.length > 0 ? (
          completedLessons.map((l, i) => (
            <View key={i} style={styles.lessonItem}>
              <Text style={styles.lessonText}>✅ {l}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noneText}>Belum ada pelajaran yang diselesaikan minggu ini.</Text>
        )}

        <TouchableOpacity style={styles.shareBtn} onPress={shareProgress}>
          <Text style={styles.shareText}>Bagikan Laporan Ke WhatsApp ↗️</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  authContainer: {
    flex: 1,
    backgroundColor: '#0B1120',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authBox: {
    width: '80%',
    alignItems: 'center',
    gap: 16,
  },
  authEmoji: { fontSize: 64 },
  authTitle: { color: '#fff', fontSize: 24, fontWeight: '800' },
  authSub: { color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: 20 },
  pinInput: {
    width: '100%',
    height: 64,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    textAlign: 'center',
    fontSize: 32,
    color: Colors.primary,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  loginBtn: {
    width: '100%',
    height: 56,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  loginBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  backLink: { color: 'rgba(255,255,255,0.4)', marginTop: 20 },
  container: { flex: 1, backgroundColor: '#0B1120' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  backIcon: { color: '#fff', fontSize: 24 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  content: { padding: 20, gap: 24 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 4 },
  statValue: { color: Colors.primary, fontSize: 24, fontWeight: '800' },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  lessonItem: {
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    marginBottom: 8,
  },
  lessonText: { color: 'rgba(255,255,255,0.8)' },
  shareBtn: {
    height: 56,
    backgroundColor: '#25D366',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  shareText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  noneText: { color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' },
});
