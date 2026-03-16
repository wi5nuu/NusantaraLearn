import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { Colors } from '../constants/colors';
import Animated, { FadeInUp } from 'react-native-reanimated';

const DAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
const DATA = [40, 70, 50, 90, 60, 30, 80]; // Mock percentages

export const WeeklyProgress = () => {
  const maxVal = Math.max(...DATA);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Aktivitas Belajar (Minggu Ini)</Text>
        
        <View style={styles.chart}>
          {DATA.map((val, i) => (
            <View key={i} style={styles.barColumn}>
              <View style={styles.barBg}>
                <View 
                  style={[
                    styles.barFill, 
                    { height: `${val}%` },
                    val === maxVal && styles.barFillActive
                  ]} 
                />
              </View>
              <Text style={styles.dayLabel}>{DAYS[i]}</Text>
            </View>
          ))}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Rata-rata</Text>
            <Text style={styles.statValue}>45 mnt</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Waktu</Text>
            <Text style={styles.statValue}>5.2 jam</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <Animated.View entering={FadeInUp.duration(600)} style={styles.container}>
      <Text style={styles.title}>Aktivitas Belajar (Minggu Ini)</Text>
      
      <View style={styles.chart}>
        {DATA.map((val, i) => (
          <View key={i} style={styles.barColumn}>
            <View style={styles.barBg}>
              <View 
                style={[
                  styles.barFill, 
                  { height: `${val}%` },
                  val === maxVal && styles.barFillActive
                ]} 
              />
            </View>
            <Text style={styles.dayLabel}>{DAYS[i]}</Text>
          </View>
        ))}
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Rata-rata</Text>
          <Text style={styles.statValue}>45 mnt</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total Waktu</Text>
          <Text style={styles.statValue}>5.2 jam</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Sora_700Bold',
    marginBottom: 20,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 20,
  },
  barColumn: {
    alignItems: 'center',
    gap: 8,
  },
  barBg: {
    width: 12,
    height: 100,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: 'rgba(29,158,117,0.4)',
    borderRadius: 6,
  },
  barFillActive: {
    backgroundColor: Colors.primary,
  },
  dayLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    marginBottom: 4,
  },
  statValue: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
  },
});
