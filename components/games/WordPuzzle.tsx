import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from '../../constants/colors';

const { width: SW } = Dimensions.get('window');

// --- BALANCE ---
// Word puzzle: 3 + floor(level/2) words to solve per game.
// Each word appears pre-shuffled → player just arranges letters.
// No time pressure on individual word — 60 second total timer.
// Even a slow player can solve 3 words in 60 seconds.
// ---

const WORD_LEVELS = [
  ['BUKU', 'MEJA', 'KUDA', 'BUAH', 'AWAN', 'PENA', 'ROTI', 'GULA', 'NASI'],
  ['SEKOLAH', 'BELAJAR', 'TEMAN', 'BAGUS', 'PINTAR', 'KERTAS', 'PAPAN'],
  ['NUSANTARA', 'INDONESIA', 'PANCASILA', 'GARUDA', 'MERAH', 'PUTIH'],
  ['PERSATUAN', 'KESATUAN', 'KEADILAN', 'MERDEKA', 'BANGSA'],
  ['CENDEKIA', 'PENDIDIKAN', 'ILMUWAN', 'TEKNOLOGI', 'KREATIVITAS'],
];

interface Props {
  level: number;
  onGameOver: (score: number) => void;
  onLevelComplete: (score: number) => void;
}

export function WordPuzzleGame({ level, onGameOver, onLevelComplete }: Props) {
  const wordPool = WORD_LEVELS[Math.min(Math.floor(level / 3), 4)];
  const totalWords = 3 + Math.floor(level / 3); // level1→3 words, max 8

  const [timeLeft, setTimeLeft] = useState(60);
  const [wordIdx, setWordIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [shuffled, setShuffled] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [gameActive, setGameActive] = useState(true);

  const currentWord = wordPool[wordIdx % wordPool.length];

  useEffect(() => { shuffleWord(currentWord); }, [wordIdx]);

  const shuffleWord = (word: string) => {
    const letters = word.split('').map((l, i) => `${l}${i}`);
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    setShuffled(letters);
    setSelected([]);
    setFeedback(null);
  };

  // Countdown
  useEffect(() => {
    if (!gameActive) return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setGameActive(false);
          if (wordIdx >= Math.floor(totalWords / 2)) onLevelComplete(score);
          else onGameOver(score);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameActive, wordIdx, totalWords, score]);

  const selectLetter = (key: string) => {
    if (feedback || !gameActive) return;
    const nextSelected = [...selected, key];
    setSelected(nextSelected);
    const formed = nextSelected.map(k => k[0]).join('');

    if (formed.length === currentWord.length) {
      if (formed === currentWord) {
        setFeedback('correct');
        const pts = 10 + Math.max(0, (10 - attempts) * 2);
        const newScore = score + pts;
        setScore(newScore);
        setTimeout(() => {
          const nextIdx = wordIdx + 1;
          setWordIdx(nextIdx);
          setAttempts(0);
          setFeedback(null);
          if (nextIdx >= totalWords) {
            setGameActive(false);
            onLevelComplete(newScore);
          }
        }, 700);
      } else {
        setFeedback('wrong');
        setAttempts(a => a + 1);
        setTimeout(() => {
          setFeedback(null);
          setSelected([]);
          if (attempts + 1 >= 7) { // 7 attempts max
            setGameActive(false);
            onGameOver(score);
          }
        }, 600);
      }
    }
  };

  const formedWord = selected.map(k => k[0]).join('');
  const BOX_SIZE = Math.min(42, (SW - 80) / (currentWord.length + 1));
  const LETTER_SIZE = Math.min(52, (SW - 40) / Math.max(shuffled.length, 4) - 8);

  return (
    <View style={wp.container}>
      <View style={wp.hud}>
        <Text style={wp.hudLevel}>Lv {level}</Text>
        <Text style={wp.hudScore}>📝 Kata {wordIdx + 1}/{totalWords}</Text>
        <Text style={[wp.hudTimer, timeLeft <= 15 && wp.timerDanger]}>⏱ {timeLeft}s</Text>
        <Text style={wp.hudAttempts}>❌ {attempts}/7</Text>
      </View>
      <View style={wp.progressBar}>
        <View style={[wp.progressFill, { width: `${(wordIdx / totalWords) * 100}%` as any }]} />
      </View>

      <View style={wp.gameArea}>
        <View style={wp.dotsRow}>
          {Array.from({ length: totalWords }).map((_, i) => (
            <View key={i} style={[wp.dot, i < wordIdx && wp.dotDone, i === wordIdx && wp.dotActive]} />
          ))}
        </View>

        {/* Word boxes */}
        <View style={[wp.wordDisplay, feedback === 'correct' && wp.wordCorrect, feedback === 'wrong' && wp.wordWrong]}>
          {currentWord.split('').map((_, i) => (
            <View key={i} style={[wp.letterBox, { width: BOX_SIZE, height: BOX_SIZE + 8 }, selected[i] && wp.filledBox]}>
              <Text style={[wp.letterBoxText, { fontSize: BOX_SIZE * 0.5 }]}>{selected[i] ? selected[i][0] : '?'}</Text>
            </View>
          ))}
        </View>

        <Text style={wp.feedbackText}>
          {feedback === 'correct' ? '✅ Benar!' : feedback === 'wrong' ? '❌ Coba lagi!' : `Sisa ${totalWords - wordIdx} kata`}
        </Text>

        {/* Letter tiles */}
        <View style={wp.lettersGrid}>
          {shuffled.map(key => {
            const used = selected.includes(key);
            return (
              <TouchableOpacity
                key={key}
                style={[wp.letterBtn, { width: LETTER_SIZE, height: LETTER_SIZE }, used && wp.letterUsed]}
                onPress={() => !used && selectLetter(key)}
                disabled={used || !!feedback}
              >
                <Text style={[wp.letterText, { fontSize: LETTER_SIZE * 0.4 }, used && wp.letterTextUsed]}>{key[0]}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={wp.ctrlRow}>
          <TouchableOpacity style={wp.clearBtn} onPress={() => setSelected([])}>
            <Text style={wp.clearText}>🗑 Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={wp.clearBtn} onPress={() => setSelected(prev => prev.slice(0, -1))}>
            <Text style={wp.clearText}>⌫ Hapus</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const wp = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a0533' },
  hud: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 11, backgroundColor: 'rgba(0,0,0,0.3)' },
  hudLevel: { color: '#A78BFA', fontWeight: '800', fontSize: 13 },
  hudScore: { color: '#fff', fontWeight: '700', fontSize: 12 },
  hudTimer: { color: '#aaa', fontWeight: '800', fontSize: 13 },
  timerDanger: { color: '#FF4444' },
  hudAttempts: { color: '#FF6B6B', fontWeight: '800', fontSize: 12 },
  progressBar: { height: 5, backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#A78BFA' },
  gameArea: { flex: 1, alignItems: 'center', paddingTop: 16, paddingHorizontal: 16 },
  dotsRow: { flexDirection: 'row', gap: 6, marginBottom: 20, flexWrap: 'wrap', justifyContent: 'center' },
  dot: { width: 18, height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.1)' },
  dotDone: { backgroundColor: '#22c55e' },
  dotActive: { backgroundColor: '#A78BFA' },
  wordDisplay: {
    flexDirection: 'row', gap: 6, marginBottom: 8, padding: 14, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    flexWrap: 'wrap', justifyContent: 'center',
  },
  wordCorrect: { borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.1)' },
  wordWrong: { borderColor: '#FF6B6B', backgroundColor: 'rgba(255,107,107,0.1)' },
  letterBox: {
    backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 8,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  filledBox: { backgroundColor: 'rgba(167,139,250,0.25)', borderColor: '#A78BFA' },
  letterBoxText: { color: '#fff', fontWeight: '800' },
  feedbackText: { color: 'rgba(255,255,255,0.45)', fontSize: 13, marginBottom: 16 },
  lettersGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  letterBtn: {
    backgroundColor: 'rgba(167,139,250,0.15)', borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: 'rgba(167,139,250,0.4)',
  },
  letterUsed: { backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' },
  letterText: { color: '#fff', fontWeight: '800' },
  letterTextUsed: { color: 'rgba(255,255,255,0.15)' },
  ctrlRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  clearBtn: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 12, paddingVertical: 12,
    alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
  },
  clearText: { color: 'rgba(255,255,255,0.65)', fontWeight: '700', fontSize: 13 },
});
