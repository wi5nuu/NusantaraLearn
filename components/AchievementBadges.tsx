import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { Colors } from '../constants/colors';
import Animated, { FadeInRight } from 'react-native-reanimated';

const BADGES = [
  { id: '1', emoji: '🌟', label: 'Bintang Terbit', desc: 'Selesaikan kuis pertama' },
  { id: '2', emoji: '📚', label: 'Kutu Buku', desc: 'Baca 5 buku cerita' },
  { id: '3', emoji: '🔥', label: 'Semangat Membara', desc: 'Belajar 3 hari berturut-turut' },
  { id: '4', emoji: '🏆', label: 'Juara Kelas', desc: 'Dapatkan skor 100 di kuis' },
  { id: '5', emoji: '🧠', label: 'Pemikir Kritis', desc: 'Gunakan AI Tutor 10 kali' },
];

export const AchievementBadges = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pencapaian & Medali</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {BADGES.map((badge, i) => (
          Platform.OS === 'web' ? (
            <View key={badge.id} style={styles.badgeCard}>
              <View style={styles.emojiBox}>
                <Text style={styles.emoji}>{badge.emoji}</Text>
              </View>
              <Text style={styles.label}>{badge.label}</Text>
              <Text style={styles.desc} numberOfLines={2}>{badge.desc}</Text>
            </View>
          ) : (
            <Animated.View 
              key={badge.id} 
              entering={FadeInRight.duration(500).delay(i * 100)}
              style={styles.badgeCard}
            >
              <View style={styles.emojiBox}>
                <Text style={styles.emoji}>{badge.emoji}</Text>
              </View>
              <Text style={styles.label}>{badge.label}</Text>
              <Text style={styles.desc} numberOfLines={2}>{badge.desc}</Text>
            </Animated.View>
          )
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Sora_700Bold',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  badgeCard: {
    width: 110,
    backgroundColor: Colors.bgCard2,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emojiBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emoji: {
    fontSize: 24,
  },
  label: {
    color: Colors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  desc: {
    color: Colors.textMuted,
    fontSize: 9,
    textAlign: 'center',
    lineHeight: 12,
  },
});
