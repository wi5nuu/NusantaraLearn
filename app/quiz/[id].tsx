import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, router } from 'expo-router';
import Animated, {
  FadeInDown,
  FadeInLeft,
  ZoomIn,
} from 'react-native-reanimated';
import { Colors } from '../../constants/colors';
import { useUser } from '../../stores/useUser';
import quizzesData from '../../data/quizzes.json';

const { width } = Dimensions.get('window');

// Comprehensive Quiz Data Map (Fallback for missing IDs)
const FALLBACK_QUIZ: any[] = [
  { id: 1, question: 'Siapakah nama maskot NusantaraLearn?', options: ['Alpi', 'Budi', 'Caca', 'Dedi'], correctIndex: 0 },
];

const DEFAULT_QUESTIONS = [
  { id: 1, question: 'Siapakah nama maskot NusantaraLearn?', options: ['Andi', 'Budi', 'Caca', 'Dedi'], correctIndex: 0 },
];

export default function QuizScreen() {
  const { id } = useLocalSearchParams();
  const { addXP, incrementLessons } = useUser();
  
  const quizObj = (quizzesData.quizzes as any[]).find(q => q.lesson_id === id) || { 
    questions: FALLBACK_QUIZ, 
    isTimeTrial: false,
    timeLimit: 0 
  };
  const questions = quizObj.questions;
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [bonusXP, setBonusXP] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(quizObj.timeLimit || 0);

  React.useEffect(() => {
    if (!quizObj.isTimeTrial || isFinished || isAnswered) return;
    
    if (timeLeft <= 0) {
      handleNext();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev: number) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isFinished, isAnswered]);

  const question = questions[currentIdx];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
    setIsAnswered(true);

    if (idx === question.correctIndex) {
      setScore((s) => s + 100);
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedIdx(null);
      setIsAnswered(false);
    } else {
      // Finish Quiz
      let finalScore = score;
      if (quizObj.isTimeTrial && timeLeft > 0) {
        const timeBonus = Math.floor(timeLeft * 5); // 5 XP per remaining second
        setBonusXP(timeBonus);
        finalScore += timeBonus;
      }
      addXP(finalScore);
      incrementLessons(id as string, finalScore);
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centerAll]} edges={['top', 'bottom']}>
        <LottieView
          autoPlay
          loop={false}
          style={styles.lottieOverlay}
          source={{ uri: 'https://lottie.host/79188f6c-6744-486a-814d-65b11910d54a/WvjL5e1X9Z.json' }}
        />
        {Platform.OS === 'web' ? (
          <View style={styles.resultBox}>
            <Text style={styles.trophyEmoji}>🏆</Text>
            <Text style={styles.resultTitle}>Luar Biasa!</Text>
            <Text style={styles.resultDesc}>Kamu berhasil menyelesaikan kuis ini.</Text>
            
            <View style={styles.xpBadge}>
              <Text style={styles.xpText}>+{score + bonusXP} XP Diperoleh</Text>
            </View>

            {bonusXP > 0 && (
              <Text style={styles.bonusLabel}>Termasuk Bonus Waktu: +{bonusXP} XP ⚡</Text>
            )}

            <Pressable
              style={({ pressed }) => [
                styles.doneButton,
                pressed && { opacity: 0.8 }
              ]}
              onPress={() => router.replace('/(tabs)/profile')}
            >
              <Text style={styles.doneButtonText}>Lihat Profil Saya →</Text>
            </Pressable>
          </View>
        ) : (
          <Animated.View entering={ZoomIn.duration(800)} style={styles.resultBox}>
            <Text style={styles.trophyEmoji}>🏆</Text>
            <Text style={styles.resultTitle}>Luar Biasa!</Text>
            <Text style={styles.resultDesc}>Kamu berhasil menyelesaikan kuis ini.</Text>
            
            <View style={styles.xpBadge}>
              <Text style={styles.xpText}>+{score} XP Diperoleh</Text>
            </View>

            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => router.replace('/(tabs)/profile')}
              activeOpacity={0.8}
            >
              <Text style={styles.doneButtonText}>Lihat Profil Saya →</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Quiz Header Progress */}
      <View style={styles.header}>
        <View style={{ width: 30 }} />
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${((currentIdx + 1) / questions.length) * 100}%` },
            ]}
          />
        </View>
        <View style={styles.metaWrap}>
          <Text style={styles.progressText}>
            {currentIdx + 1}/{questions.length}
          </Text>
          {quizObj.isTimeTrial && (
            <View style={[styles.timerCircle, timeLeft < 10 && styles.timerDanger]}>
              <Text style={styles.timerText}>{timeLeft}s</Text>
            </View>
          )}
        </View>
      </View>

      {/* Question Area */}
      <View style={styles.content}>
        {Platform.OS === 'web' ? (
          <Text style={styles.questionText}>
            {question.question}
          </Text>
        ) : (
          <Animated.Text
            key={`q-${currentIdx}`}
            entering={FadeInDown.duration(400)}
            style={styles.questionText}
          >
            {question.question}
          </Animated.Text>
        )}

        {/* Options */}
        <View style={styles.optionsList}>
          {question.options.map((opt: string, idx: number) => {
            const isSelected = selectedIdx === idx;
            const isCorrect = idx === question.correctIndex;
            const showStatus = isAnswered;

            let optStyle: any = styles.optionBtn;
            let textStyle: any = styles.optionText;

            if (showStatus) {
              if (isCorrect) {
                optStyle = styles.optionCorrect;
                textStyle = styles.optionTextCorrect;
              } else if (isSelected) {
                optStyle = styles.optionWrong;
                textStyle = styles.optionTextWrong;
              } else {
                optStyle = styles.optionDisabled;
              }
            } else if (isSelected) {
              optStyle = styles.optionSelected;
            }

            if (Platform.OS === 'web') {
              return (
                <View key={`${currentIdx}-${idx}`}>
                  <Pressable
                    style={({ pressed }) => [
                      optStyle,
                      pressed && !isAnswered && { opacity: 0.8, transform: [{ scale: 0.99 }] }
                    ]}
                    onPress={() => handleSelect(idx)}
                    disabled={isAnswered}
                  >
                    <Text style={textStyle}>{opt}</Text>
                    {showStatus && isCorrect && <Text style={styles.iconCheck}>✓</Text>}
                    {showStatus && isSelected && !isCorrect && <Text style={styles.iconCross}>✗</Text>}
                  </Pressable>
                </View>
              );
            }

            return (
              <Animated.View
                key={`${currentIdx}-${idx}`}
                entering={FadeInLeft.duration(400).delay(idx * 100)}
              >
                <TouchableOpacity
                  style={optStyle}
                  onPress={() => handleSelect(idx)}
                  activeOpacity={0.7}
                  disabled={isAnswered}
                >
                  <Text style={textStyle}>{opt}</Text>
                  {showStatus && isCorrect && <Text style={styles.iconCheck}>✓</Text>}
                  {showStatus && isSelected && !isCorrect && <Text style={styles.iconCross}>✗</Text>}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </View>

      <View style={styles.bottomBar}>
        {isAnswered && (
          <View style={{ marginBottom: 12 }}>
            <Pressable
              style={({ pressed }) => [
                styles.nextBtn,
                selectedIdx === question.correctIndex ? styles.nextBtnCorrect : styles.nextBtnWrong,
                pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }
              ]}
              onPress={handleNext}
            >
              <Text style={styles.nextBtnText}>LANJUTKAN</Text>
            </Pressable>
          </View>
        )}
        
        <Pressable
          style={({ pressed }) => [
            styles.exitBtn,
            pressed && { opacity: 0.7 }
          ]}
          onPress={() => router.back()}
        >
          <Text style={styles.exitBtnText}>Keluar Kuis</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  centerAll: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  closeBtn: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 28,
    color: Colors.textMuted,
    lineHeight: 30,
  },
  progressContainer: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.bgCard2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  progressText: {
    color: Colors.primaryLight,
    fontWeight: '700',
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  questionText: {
    color: Colors.textPrimary,
    fontSize: 22,
    lineHeight: 32,
    fontWeight: '700',
    fontFamily: 'Sora_700Bold',
    marginBottom: 32,
  },
  optionsList: {
    gap: 16,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    zIndex: 10,
    ...Platform.select({
      web: { cursor: 'pointer' }
    }),
  },
  optionSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    backgroundColor: 'rgba(55,138,221,0.1)',
    borderWidth: 2,
    borderColor: Colors.blue,
    borderRadius: 16,
  },
  optionCorrect: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    backgroundColor: 'rgba(29,158,117,0.15)',
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 16,
  },
  optionWrong: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    backgroundColor: 'rgba(226,75,74,0.15)',
    borderWidth: 2,
    borderColor: '#e24b4a',
    borderRadius: 16,
  },
  optionDisabled: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 16,
    opacity: 0.5,
  },
  optionText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  optionTextCorrect: {
    color: Colors.primaryLight,
    fontSize: 16,
    fontWeight: '700',
  },
  optionTextWrong: {
    color: '#fc8181',
    fontSize: 16,
    fontWeight: '700',
  },
  iconCheck: {
    color: Colors.primaryLight,
    fontSize: 20,
    fontWeight: 'bold',
  },
  iconCross: {
    color: '#fc8181',
    fontSize: 20,
    fontWeight: 'bold',
  },
  bottomBar: {
    padding: 24,
    borderTopWidth: 0.5,
    borderTopColor: Colors.border,
    paddingBottom: 40,
  },
  nextBtn: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    zIndex: 20,
    ...Platform.select({
      web: { cursor: 'pointer' }
    }),
  },
  nextBtnCorrect: {
    backgroundColor: Colors.primary,
  },
  nextBtnWrong: {
    backgroundColor: '#e24b4a',
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
  resultBox: {
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    padding: 32,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    width: width - 40,
  },
  trophyEmoji: {
    fontSize: 72,
    marginBottom: 16,
  },
  resultTitle: {
    color: Colors.textPrimary,
    fontSize: 26,
    fontWeight: '700',
    fontFamily: 'Sora_700Bold',
    marginBottom: 8,
  },
  resultDesc: {
    color: Colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  xpBadge: {
    backgroundColor: 'rgba(29,158,117,0.2)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
    marginBottom: 32,
  },
  xpText: {
    color: '#5DCAA5',
    fontSize: 18,
    fontWeight: '800',
  },
  doneButton: {
    backgroundColor: Colors.primary,
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    ...Platform.select({
      web: { cursor: 'pointer' }
    }),
  },
  doneButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  exitBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Platform.select({
      web: { cursor: 'pointer' }
    }),
  },
  exitBtnText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  metaWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timerCircle: {
    backgroundColor: 'rgba(55,138,221,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.blue,
  },
  timerDanger: {
    backgroundColor: 'rgba(226,75,74,0.1)',
    borderColor: '#e24b4a',
  },
  timerText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  bonusLabel: {
    color: Colors.primaryLight,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 20,
  },
  lottieOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    pointerEvents: 'none',
  },
});
