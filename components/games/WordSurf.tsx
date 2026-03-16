import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from '../../constants/colors';

// --- BALANCE ---
// 60 second game. Target: correct swipes.
// Each round shows 1 card → swipe correct = +1. Wrong = -1 life.
// Target: level * 3 + 5 correct swipes.
// Level 1: need 8 swipes in 60s → 1 swipe every 7.5s → very easy!
// Level 12: need 41 swipes in 60s → 1.5s each → needs to be quick.
// Cards appear instantly → no waiting time.
// ---

const CATEGORIES = [
  {
    name: 'Buah 🍎',
    words: ['APEL', 'MANGA', 'PISANG', 'PEPAYA', 'JERUK', 'RAMBUTAN', 'NANAS', 'SEMANGKA'],
  },
  {
    name: 'Hewan 🐾',
    words: ['GAJAH', 'HARIMAU', 'KUDA', 'SAPI', 'AYAM', 'IKAN', 'ELANG', 'KERA'],
  },
  {
    name: 'Warna 🎨',
    words: ['MERAH', 'BIRU', 'HIJAU', 'KUNING', 'UNGU', 'ORANGE', 'HITAM', 'PUTIH'],
  },
  {
    name: 'Makanan 🍜',
    words: ['NASI', 'BAKSO', 'SOTO', 'RENDANG', 'PEMPEK', 'TEMPE', 'TAPAI', 'DODOL'],
  },
];

interface Props {
  level: number;
  onGameOver: (score: number) => void;
  onLevelComplete: (score: number) => void;
}

export function WordSurfGame({ level, onGameOver, onLevelComplete }: Props) {
  const { width: SW } = Dimensions.get('window');
  const numCats = Math.min(2 + Math.floor(level / 4), 4);
  const cats = CATEGORIES.slice(0, numCats);

  const targetCorrect = level * 3 + 5; // level1→8, level12→41

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [correct, setCorrect] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(true);
  const [targetCat, setTargetCat] = useState(cats[0]);
  const [currentWord, setCurrentWord] = useState('');
  const [currentWordCat, setCurrentWordCat] = useState('');
  const [feedback, setFeedback] = useState<{ text: string; good: boolean } | null>(null);

  const correctRef = useRef(0);
  const livesRef = useRef(3);
  const gameActiveRef = useRef(true);

  const nextRound = useCallback(() => {
    const newCat = cats[Math.floor(Math.random() * cats.length)];
    setTargetCat(newCat);
    // 60% chance the card matches, 40% it doesn't
    const isMatch = Math.random() < 0.6;
    const wordCat = isMatch ? newCat : cats.find(c => c.name !== newCat.name) || cats[0];
    const word = wordCat.words[Math.floor(Math.random() * wordCat.words.length)];
    setCurrentWord(word);
    setCurrentWordCat(wordCat.name);
  }, [cats]);

  useEffect(() => { nextRound(); }, []);

  // Countdown
  useEffect(() => {
    if (!gameActive) return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          if (gameActiveRef.current) {
            gameActiveRef.current = false;
            setGameActive(false);
            if (correctRef.current >= targetCorrect) onLevelComplete(score);
            else onGameOver(score);
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameActive, targetCorrect, score]);

  const swipe = (isYes: boolean) => {
    if (!gameActiveRef.current || feedback) return;
    const isMatch = currentWordCat === targetCat.name;
    const correct_answer = isYes === isMatch;

    if (correct_answer) {
      correctRef.current += 1;
      const newCorrect = correctRef.current;
      const newScore = score + 10;
      setCorrect(newCorrect);
      setScore(newScore);
      setFeedback({ text: '✅ Benar! +10', good: true });
      if (newCorrect >= targetCorrect) {
        gameActiveRef.current = false;
        setGameActive(false);
        setTimeout(() => onLevelComplete(newScore), 500);
        return;
      }
    } else {
      livesRef.current -= 1;
      const newLives = livesRef.current;
      setLives(newLives);
      setFeedback({ text: '❌ Salah!', good: false });
      if (newLives <= 0) {
        gameActiveRef.current = false;
        setGameActive(false);
        setTimeout(() => onGameOver(score), 500);
        return;
      }
    }

    setTimeout(() => {
      setFeedback(null);
      nextRound();
    }, 500);
  };

  const pct = Math.min(100, (correct / targetCorrect) * 100);

  return (
    <View style={ws.container}>
      <View style={ws.hud}>
        <Text style={ws.hudLevel}>Lv {level}</Text>
        <Text style={ws.hudScore}>✅ {correct}/{targetCorrect}</Text>
        <Text style={[ws.hudTimer, timeLeft <= 10 && ws.timerDanger]}>⏱ {timeLeft}s</Text>
        <Text style={ws.hudLives}>{'❤️'.repeat(lives)}</Text>
      </View>
      <View style={ws.progressBar}>
        <View style={[ws.progressFill, { width: `${pct}%` as any }]} />
      </View>

      <View style={ws.gameArea}>
        {/* Target */}
        <View style={ws.targetBox}>
          <Text style={ws.targetLabel}>Geser YA jika termasuk kategori:</Text>
          <Text style={ws.targetCat}>{targetCat.name}</Text>
        </View>

        <View style={ws.guideRow}>
          <Text style={ws.guideNo}>❌ BUKAN</Text>
          <Text style={ws.guideYes}>✅ IYA</Text>
        </View>

        {feedback ? (
          <View style={[ws.feedbackBadge, feedback.good ? ws.fGood : ws.fBad]}>
            <Text style={ws.feedbackText}>{feedback.text}</Text>
          </View>
        ) : (
          <View style={ws.cardBox}>
            <Text style={ws.cardWord}>{currentWord}</Text>
          </View>
        )}

        <View style={ws.btnRow}>
          <TouchableOpacity style={ws.noBtn} onPress={() => swipe(false)} disabled={!!feedback}>
            <Text style={ws.btnText}>← BUKAN</Text>
          </TouchableOpacity>
          <TouchableOpacity style={ws.yesBtn} onPress={() => swipe(true)} disabled={!!feedback}>
            <Text style={ws.btnText}>IYA →</Text>
          </TouchableOpacity>
        </View>

        <Text style={ws.bottomHint}>Butuh {targetCorrect - correct} benar lagi</Text>
      </View>
    </View>
  );
}

const ws = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0c1a2e' },
  hud: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 11, backgroundColor: 'rgba(0,0,0,0.3)' },
  hudLevel: { color: '#38BDF8', fontWeight: '800', fontSize: 13 },
  hudScore: { color: '#fff', fontWeight: '700', fontSize: 12 },
  hudTimer: { color: '#aaa', fontWeight: '800', fontSize: 13 },
  timerDanger: { color: '#FF4444' },
  hudLives: { fontSize: 14 },
  progressBar: { height: 5, backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#38BDF8' },
  gameArea: { flex: 1, alignItems: 'center', paddingHorizontal: 16, paddingTop: 20, gap: 16 },
  targetBox: {
    backgroundColor: 'rgba(56,189,248,0.1)', borderRadius: 16, padding: 14,
    width: '100%', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: 'rgba(56,189,248,0.3)',
  },
  targetLabel: { color: 'rgba(255,255,255,0.45)', fontSize: 12 },
  targetCat: { color: '#38BDF8', fontSize: 20, fontWeight: '900' },
  guideRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 6 },
  guideNo: { color: '#FF6B6B', fontWeight: '700', fontSize: 13 },
  guideYes: { color: '#44CC44', fontWeight: '700', fontSize: 13 },
  cardBox: {
    backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 20, paddingVertical: 30,
    paddingHorizontal: 40, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', alignItems: 'center', width: '100%',
  },
  cardWord: { color: '#fff', fontSize: 26, fontWeight: '900', letterSpacing: 2 },
  feedbackBadge: { borderRadius: 16, paddingHorizontal: 28, paddingVertical: 14, alignItems: 'center', width: '80%' },
  fGood: { backgroundColor: 'rgba(34,200,94,0.9)' },
  fBad: { backgroundColor: 'rgba(255,50,50,0.9)' },
  feedbackText: { color: '#fff', fontSize: 20, fontWeight: '900' },
  btnRow: { flexDirection: 'row', gap: 12, width: '100%' },
  noBtn: { flex: 1, backgroundColor: 'rgba(255,100,100,0.2)', borderRadius: 16, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,100,100,0.4)' },
  yesBtn: { flex: 1, backgroundColor: 'rgba(68,204,68,0.2)', borderRadius: 16, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(68,204,68,0.4)' },
  btnText: { color: '#fff', fontWeight: '900', fontSize: 15 },
  bottomHint: { color: 'rgba(255,255,255,0.3)', fontSize: 11 },
});
