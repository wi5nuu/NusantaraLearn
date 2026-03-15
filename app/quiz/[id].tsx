import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import Animated, {
  FadeInDown,
  FadeInLeft,
  ZoomIn,
} from 'react-native-reanimated';
import { Colors } from '../../constants/colors';
import { useUser } from '../../stores/useUser';

const { width } = Dimensions.get('window');

// Comprehensive Quiz Data Map
const QUIZ_DATA: Record<string, any[]> = {
  // Lesson IDs
  '1': [
    { id: 1, question: 'Jika kamu memiliki 3 keranjang dan setiap keranjang berisi 5 buah sawit, berapa total buah sawitmu?', options: ['8 buah', '15 buah', '10 buah', '25 buah'], correctIndex: 1 },
    { id: 2, question: 'Perkalian adalah penjumlahan berulang dari angka yang sama. Benar atau salah?', options: ['Benar', 'Salah'], correctIndex: 0 },
  ],
  // Video IDs
  'v1': [ // Tata Surya
    { id: 1, question: 'Planet apa yang paling dekat dengan Matahari?', options: ['Venus', 'Bumi', 'Merkurius', 'Mars'], correctIndex: 2 },
    { id: 2, question: 'Berapa jumlah planet utama dalam Tata Surya kita?', options: ['7', '8', '9', '10'], correctIndex: 1 },
  ],
  'v2': [ // Jarimatika
    { id: 1, question: 'Dalam Jarimatika, tangan kanan biasanya mewakili apa?', options: ['Satuan', 'Puluhan', 'Ratusan', 'Ribuan'], correctIndex: 0 },
    { id: 2, question: 'Berapakah hasil dari 2 + 2 menggunakan teknik jari?', options: ['3', '4', '5', '6'], correctIndex: 1 },
  ],
  'v3': [ // Sayur
    { id: 1, question: 'Vitamin apa yang dominan terdapat pada Wortel?', options: ['Vitamin C', 'Vitamin D', 'Vitamin A', 'Vitamin K'], correctIndex: 2 },
    { id: 2, question: 'Sayuran hijau baik untuk tubuh karena mengandung banyak apa?', options: ['Gula', 'Serat & Klorofil', 'Lemak', 'Garam'], correctIndex: 1 },
  ],
  'v4': [ // Stop Bullying
    { id: 1, question: 'Apa yang harus kita lakukan jika melihat perundungan?', options: ['Diam saja', 'Ikut menertawakan', 'Melapor ke Guru/Ortu', 'Lari menjauh'], correctIndex: 2 },
    { id: 2, question: 'Mengejek nama orang tua termasuk kategori Bullying?', options: ['Ya, Bullying Verbal', 'Tidak, itu cuma candaan', 'Bukan kategori apa-apa'], correctIndex: 0 },
  ],
  'v5': [ // Haus
    { id: 1, question: 'Berapa persen air yang menyusun tubuh manusia?', options: ['10-20%', '30-40%', '60-70%', '90-100%'], correctIndex: 2 },
    { id: 2, question: 'Haus adalah sinyal dari organ apa?', options: ['Jantung', 'Hati', 'Otak', 'Paru-paru'], correctIndex: 2 },
  ],
};

const DEFAULT_QUESTIONS = [
  { id: 1, question: 'Siapakah nama maskot NusantaraLearn?', options: ['Andi', 'Budi', 'Caca', 'Dedi'], correctIndex: 0 },
];

export default function QuizScreen() {
  const { id } = useLocalSearchParams();
  const { addXP, incrementLessons } = useUser();
  
  const questions = QUIZ_DATA[id as string] || DEFAULT_QUESTIONS;
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const question = questions[currentIdx];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
    setIsAnswered(true);

    if (idx === question.correctIndex) {
      setScore((s) => s + 100);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedIdx(null);
      setIsAnswered(false);
    } else {
      // Finish Quiz
      addXP(score);
      incrementLessons();
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centerAll]} edges={['top', 'bottom']}>
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
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Quiz Header Progress */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Text style={styles.closeIcon}>×</Text>
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${((currentIdx + 1) / questions.length) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {currentIdx + 1}/{questions.length}
        </Text>
      </View>

      {/* Question Area */}
      <View style={styles.content}>
        <Animated.Text
          key={`q-${currentIdx}`}
          entering={FadeInDown.duration(400)}
          style={styles.questionText}
        >
          {question.question}
        </Animated.Text>

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

      {/* Bottom Bar */}
      {isAnswered && (
        <Animated.View
          entering={FadeInDown.duration(300)}
          style={styles.bottomBar}
        >
          <TouchableOpacity
            style={[
              styles.nextBtn,
              selectedIdx === question.correctIndex ? styles.nextBtnCorrect : styles.nextBtnWrong,
            ]}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.nextBtnText}>LANJUTKAN</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
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
  },
  doneButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
