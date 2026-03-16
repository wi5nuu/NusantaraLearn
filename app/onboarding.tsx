import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/colors';
import Animated, { 
  FadeIn, 
  FadeInRight, 
  SlideInRight,
  useAnimatedStyle,
  withSpring
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [kelas, setKelas] = useState('4');
  const [lang, setLang] = useState('ind');
  const [interests, setInterests] = useState<string[]>([]);

  const finishOnboarding = async () => {
    const profile = {
      name,
      kelas,
      defaultLang: lang,
      xp: 0,
      level: 1,
      streak: 0,
      lastStudyDate: new Date().toDateString(),
      completedLessons: [],
      badges: [],
      downloadedPackages: [],
      interests: interests,
    };
    await AsyncStorage.setItem('user_profile', JSON.stringify(profile));
    await AsyncStorage.setItem('onboarding_done', 'true');
    router.replace('/(tabs)/home');
  };

  const renderStep1 = () => (
    <Animated.View entering={FadeInRight} style={styles.stepContainer}>
      <Text style={styles.emoji}>👋</Text>
      <Text style={styles.title}>Halo! Siapa namamu?</Text>
      <TextInput
        style={styles.input}
        placeholder="Tulis namamu di sini..."
        placeholderTextColor="rgba(255,255,255,0.3)"
        value={name}
        onChangeText={setName}
        autoFocus
      />
      <TouchableOpacity 
        style={[styles.nextBtn, !name && styles.disabledBtn]} 
        onPress={() => name && setStep(2)}
        disabled={!name}
      >
        <Text style={styles.nextBtnText}>Lanjut →</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderStep2 = () => (
    <Animated.View entering={FadeInRight} style={styles.stepContainer}>
      <Text style={styles.title}>Kamu kelas berapa?</Text>
      <View style={styles.grid}>
        {['1', '2', '3', '4', '5', '6'].map((k) => (
          <TouchableOpacity
            key={k}
            style={[styles.gridBtn, kelas === k && styles.activeGridBtn]}
            onPress={() => setKelas(k)}
          >
            <Text style={[styles.gridText, kelas === k && styles.activeGridText]}>
              Kelas {k}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.nextBtn} onPress={() => setStep(3)}>
        <Text style={styles.nextBtnText}>Lanjut →</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderStep3 = () => (
    <Animated.View entering={FadeInRight} style={styles.stepContainer}>
      <Text style={styles.title}>Bahasa apa yang nyaman buat kamu?</Text>
      <View style={styles.langList}>
        {[
          { id: 'ind', label: '🇮🇩 Bahasa Indonesia' },
          { id: 'jav', label: '🗣 Basa Jawa' },
          { id: 'sun', label: '🗣 Basa Sunda' },
          { id: 'bug', label: '🗣 Basa Bugis' },
        ].map((l) => (
          <TouchableOpacity
            key={l.id}
            style={[styles.langBtn, lang === l.id && styles.activeLangBtn]}
            onPress={() => setLang(l.id)}
          >
            <Text style={[styles.langText, lang === l.id && styles.activeLangText]}>
              {l.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.nextBtn} onPress={() => setStep(4)}>
        <Text style={styles.nextBtnText}>Lanjut →</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const toggleInterest = (id: string) => {
    if (interests.includes(id)) {
      setInterests(interests.filter(i => i !== id));
    } else {
      setInterests([...interests, id]);
    }
  };

  const renderStep4 = () => (
    <Animated.View entering={FadeInRight} style={styles.stepContainer}>
      <Text style={styles.title}>Apa yang paling ingin kamu pelajari?</Text>
      <Text style={styles.subtitleStep}>Pilih 2 atau lebih ya!</Text>
      <View style={styles.grid}>
        {[
          { id: 'mtk', label: 'Matematika', icon: '📐' },
          { id: 'ipa', label: 'Sains & IPA', icon: '🔬' },
          { id: 'bhz', label: 'Bahasaku', icon: '📝' },
          { id: 'his', label: 'Sejarah', icon: '📜' },
          { id: 'art', label: 'Seni & Budaya', icon: '🎨' },
          { id: 'tec', label: 'Teknologi', icon: '💻' },
        ].map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.gridBtn, interests.includes(item.id) && styles.activeGridBtn]}
            onPress={() => toggleInterest(item.id)}
          >
            <Text style={styles.interestIcon}>{item.icon}</Text>
            <Text style={[styles.gridText, interests.includes(item.id) && styles.activeGridText]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity 
        style={[styles.nextBtn, styles.finishBtn, interests.length < 2 && styles.disabledBtn]} 
        onPress={finishOnboarding}
        disabled={interests.length < 2}
      >
        <Text style={styles.nextBtnText}>Mulai Belajar! 🚀</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressHeader}>
        <View style={[styles.progressDot, step >= 1 && styles.activeDot]} />
        <View style={[styles.progressDot, step >= 2 && styles.activeDot]} />
        <View style={[styles.progressDot, step >= 3 && styles.activeDot]} />
        <View style={[styles.progressDot, step >= 4 && styles.activeDot]} />
      </View>
      
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1120',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  progressDot: {
    width: 30,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  activeDot: {
    backgroundColor: Colors.primary,
  },
  stepContainer: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
  },
  subtitleStep: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    marginTop: -30,
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 64,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    paddingHorizontal: 20,
    fontSize: 18,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 40,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    marginBottom: 40,
  },
  gridBtn: {
    width: (width - 84) / 2,
    height: 80,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  activeGridBtn: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  gridText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
    fontWeight: '700',
  },
  activeGridText: {
    color: '#fff',
  },
  interestIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  langList: {
    width: '100%',
    gap: 12,
    marginBottom: 40,
  },
  langBtn: {
    width: '100%',
    height: 64,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  activeLangBtn: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(29,158,117,0.1)',
  },
  langText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
    fontWeight: '600',
  },
  activeLangText: {
    color: Colors.primary,
    fontWeight: '700',
  },
  nextBtn: {
    width: '100%',
    height: 64,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 40,
  },
  disabledBtn: {
    opacity: 0.5,
  },
  finishBtn: {
    backgroundColor: '#1d9e75',
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
});
