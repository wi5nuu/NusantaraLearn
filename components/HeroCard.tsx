import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { Colors } from '../constants/colors';

const HERO_SLIDES = [
  {
    id: '1',
    subject: 'Matematika Dasar',
    title: 'Perkalian & Pembagian',
    chapter: 'Bab 4 dari 8',
    timeLeft: '15 mnt',
    progress: 0.65,
    color: '#1D9E75', // Primary Teal
  },
  {
    id: '2',
    subject: 'Sains Antariksa',
    title: 'Mengenal Tata Surya',
    chapter: 'Bab 2 dari 6',
    timeLeft: '20 mnt',
    progress: 0.30,
    color: '#EAB308', // Yellow
  },
  {
    id: '3',
    subject: 'Bahasa Indonesia',
    title: 'Cerita Rakyat Indonesia',
    chapter: 'Bab 7 dari 10',
    timeLeft: '10 mnt',
    progress: 0.85,
    color: '#EF4444', // Red
  },
  {
    id: '4',
    subject: 'Matematika - Jarimatika',
    title: 'Pengurangan Cepat Dasar',
    chapter: 'Bab 1 dari 5',
    timeLeft: '12 mnt',
    progress: 0.15,
    color: '#10B981', // Green
  },
  {
    id: '5',
    subject: 'Pengetahuan Umum',
    title: 'Pahlawan Kemerdekaan',
    chapter: 'Bab 5 dari 10',
    timeLeft: '25 mnt',
    progress: 0.50,
    color: '#8B5CF6', // Purple
  },
];

export const HeroCard = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const progressWidth = useSharedValue(0);
  const colorAnim = useSharedValue(0);

  const prevIndexRef = useRef(0);

  useEffect(() => {
    // Initial animation
    progressWidth.value = withTiming(HERO_SLIDES[0].progress, { duration: 800 });
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % HERO_SLIDES.length;
        return next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Animate content change
    progressWidth.value = withTiming(HERO_SLIDES[activeIndex].progress, { duration: 800 });
    colorAnim.value = withTiming(activeIndex, { duration: 800 });
  }, [activeIndex]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      colorAnim.value,
      HERO_SLIDES.map((_, i) => i),
      HERO_SLIDES.map(s => s.color)
    );
    return { backgroundColor };
  });

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%` as any,
  }));

  const activeSlide = HERO_SLIDES[activeIndex];

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      {/* Decorative circles */}
      <View style={styles.circleTopRight} />
      <View style={styles.circleBottomRight} />

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.tagPill}>
            <Text style={styles.tagText}>LANJUTKAN BELAJAR</Text>
          </View>
          
          {/* Pagination Dots */}
          <View style={styles.pagination}>
            {HERO_SLIDES.map((_, i) => (
              <View 
                key={i} 
                style={[
                  styles.dot, 
                  activeIndex === i && styles.dotActive
                ]} 
              />
            ))}
          </View>
        </View>

        <Text style={styles.title}>{`${activeSlide.subject}\n${activeSlide.title}`}</Text>

        {/* Progress */}
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, progressStyle]} />
        </View>

        {/* Meta */}
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>📖 {activeSlide.chapter}</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaText}>⏱ {activeSlide.timeLeft} lagi</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaText}>{Math.round(activeSlide.progress * 100)}% selesai</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 160,
  },
  circleTopRight: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  circleBottomRight: {
    position: 'absolute',
    bottom: -20,
    right: 20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    gap: 12,
    zIndex: 1,
  },
  tagPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  pagination: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dotActive: {
    width: 12,
    backgroundColor: '#fff',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 23.4,
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  metaText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 11,
  },
  metaDot: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
  },
});
