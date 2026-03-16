import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Colors } from '../constants/colors';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withTiming, withSpring } from 'react-native-reanimated';

export const DailyQuest = () => {
  const [claimed, setClaimed] = useState(false);
  const scale = useSharedValue(1);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const handleClaim = () => {
    if (claimed) return;
    scale.value = withSpring(0.9, {}, () => {
      scale.value = withSpring(1);
    });
    setClaimed(true);
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Misi Harian Tersedia! 🔥</Text>
          <Text style={styles.subtitle}>Selesaikan 1 pelajaran hari ini untuk bonus +50 XP</Text>
        </View>

        <View style={styles.actionRow}>
          <View style={styles.progressBox}>
            <Text style={styles.progressText}>0 / 1 Selesai</Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: claimed ? '100%' : '50%' }]} />
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.claimButton, claimed && styles.claimButtonDisabled]}
            activeOpacity={0.8}
            onPress={handleClaim}
          >
            <Text style={styles.claimButtonText}>{claimed ? 'Terklaim ✓' : 'Klaim Hadiah'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <Animated.View entering={FadeIn.duration(600)} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Misi Harian Tersedia! 🔥</Text>
        <Text style={styles.subtitle}>Selesaikan 1 pelajaran hari ini untuk bonus +50 XP</Text>
      </View>

      <View style={styles.actionRow}>
        <View style={styles.progressBox}>
          <Text style={styles.progressText}>0 / 1 Selesai</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: claimed ? '100%' : '50%' }]} />
          </View>
        </View>

        <Animated.View style={buttonStyle}>
          <TouchableOpacity 
            style={[styles.claimButton, claimed && styles.claimButtonDisabled]}
            activeOpacity={0.8}
            onPress={handleClaim}
          >
            <Text style={styles.claimButtonText}>{claimed ? 'Terklaim ✓' : 'Klaim Hadiah'}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(29,158,117,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(29,158,117,0.3)',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Sora_700Bold',
    marginBottom: 4,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  progressBox: {
    flex: 1,
  },
  progressText: {
    color: Colors.primaryLight,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  claimButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
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
  claimButtonDisabled: {
    backgroundColor: Colors.border,
    shadowOpacity: 0,
  },
  claimButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  }
});
