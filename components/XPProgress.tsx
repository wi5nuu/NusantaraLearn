import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { Colors } from '../constants/colors';

interface Props {
  xp: number;
  levelThreshold: number;
}

export const XPProgress = ({ xp, levelThreshold }: Props) => {
  const progress = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    const targetProgress = Math.min(xp / levelThreshold, 1);
    progress.value = withDelay(500, withSpring(targetProgress));
    
    // Pulse animation when XP updates
    scale.value = withSequence(
      withSpring(1.1),
      withSpring(1)
    );
  }, [xp]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%` as any,
  }));

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.label}>Progres Level</Text>
          <Text style={styles.value}>{xp} / {levelThreshold} XP</Text>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${Math.min(xp / levelThreshold, 1) * 100}%` }]} />
        </View>
        <Text style={styles.footerText}>Kumpulkan {levelThreshold - xp} XP lagi untuk naik level!</Text>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <View style={styles.header}>
        <Text style={styles.label}>Progres Level</Text>
        <Text style={styles.value}>{xp} / {levelThreshold} XP</Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, progressStyle]} />
      </View>
      <Text style={styles.footerText}>Kumpulkan {levelThreshold - xp} XP lagi untuk naik level!</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  value: {
    color: Colors.primaryLight,
    fontSize: 12,
    fontWeight: '700',
  },
  track: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  footerText: {
    marginTop: 8,
    color: Colors.textHint,
    fontSize: 10,
    textAlign: 'center',
  },
});
