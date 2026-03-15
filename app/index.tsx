import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';

const { width, height } = Dimensions.get('window');

const FadeUp = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(24);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 800 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 800 }));
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={style}>{children}</Animated.View>;
};

export default function SplashScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Glow */}
        <View style={styles.glow} />

        {/* Logo + Title */}
        <FadeUp delay={0}>
          <View style={styles.logoSection}>
            <View style={styles.logo}>
              <Text style={styles.logoEmoji}>📚</Text>
            </View>
            <Text style={styles.appName}>
              Nusantara<Text style={styles.appNameHighlight}>Learn</Text>
            </Text>
            <Text style={styles.subtitle}>
              Guru AI untuk semua, tanpa internet sekalipun
            </Text>
          </View>
        </FadeUp>

        {/* CTA Button */}
        <FadeUp delay={200}>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => router.replace('/(tabs)/home')}
            activeOpacity={0.95}
          >
            <Text style={styles.ctaText}>Mulai Belajar →</Text>
          </TouchableOpacity>
        </FadeUp>

        {/* Footer */}
        <FadeUp delay={400}>
          <Text style={styles.footer}>
            Tersedia dalam 10+ bahasa daerah
          </Text>
        </FadeUp>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
    paddingHorizontal: 32,
  },
  glow: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(29,158,117,0.18)',
    top: height * 0.5 - 200,
    alignSelf: 'center',
  },
  logoSection: {
    alignItems: 'center',
    gap: 14,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  logoEmoji: {
    fontSize: 38,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    fontFamily: 'Sora_700Bold',
    letterSpacing: -0.5,
  },
  appNameHighlight: {
    color: Colors.primary,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    maxWidth: 220,
    lineHeight: 19,
  },
  ctaButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 48,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  footer: {
    fontSize: 11,
    color: Colors.textHint,
    textAlign: 'center',
  },
});
