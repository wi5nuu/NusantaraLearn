import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { router, Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  if (Platform.OS === 'web') return <>{children}</>;

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
  const MainContainer = Platform.OS === 'web' ? View : SafeAreaView;

  useEffect(() => {
    const checkOnboarding = async () => {
      const done = await AsyncStorage.getItem('onboarding_done');
      if (done === 'true') {
        // We still allow them to click the CTA, but we could auto-redirect
      }
    };
    checkOnboarding();
  }, []);

  const handleStart = async () => {
    const done = await AsyncStorage.getItem('onboarding_done');
    if (done === 'true') {
      // Even if onboarding was done, check if name still exists in current storage
      const raw = await AsyncStorage.getItem('user_profile');
      const profile = raw ? JSON.parse(raw) : null;
      if (profile && profile.name && profile.name.trim().length > 0) {
        router.replace('/(tabs)/home');
      } else {
        // Name missing (new browser/cleared storage) — re-prompt username
        router.replace('/onboarding');
      }
    } else {
      router.replace('/onboarding');
    }
  };

  return (
    <MainContainer style={styles.safeArea}>
      <View style={styles.container}>
        {/* Glow */}
        {Platform.OS !== 'web' && <View style={styles.glow} pointerEvents="none" />}

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
          <Pressable
            style={({ pressed }) => [
              styles.ctaButton,
              pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }
            ]}
            onPress={handleStart}
          >
            <Text style={styles.ctaText}>Mulai Belajar →</Text>
          </Pressable>
        </FadeUp>

        {/* Footer */}
        <FadeUp delay={400}>
          <Text style={styles.footer}>
            Tersedia dalam 10+ bahasa daerah
          </Text>
        </FadeUp>
      </View>
    </MainContainer>
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
    zIndex: -1,
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
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
      web: {
        boxShadow: `0px 8px 16px ${Colors.primary}80`,
      }
    }),
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
    zIndex: 999,
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: `0px 6px 12px ${Colors.primary}66`,
        cursor: 'pointer',
      }
    }),
  },
  fadeUpWeb: {
    width: '100%',
    alignItems: 'center',
    zIndex: 5,
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
