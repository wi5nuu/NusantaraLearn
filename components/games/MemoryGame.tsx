import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from '../../constants/colors';

// --- BALANCE ---
// MemoryGame: sequence length = 3 + floor(level/2), total rounds = 3 + floor(level/2).
// Each round: watch sequence + input. Total ~10-20 seconds per round.
// 3 rounds, ~30-60 seconds total. Always completable.
// Level 1: seq=3 items, 3 rounds. Level 10: seq=8 items, 8 rounds.
// ---

const COLORS_DEF = [
  { id: 'red', emoji: '🔴', color: '#FF4444', bg: 'rgba(255,68,68,0.8)' },
  { id: 'blue', emoji: '🔵', color: '#4488FF', bg: 'rgba(68,136,255,0.8)' },
  { id: 'green', emoji: '🟢', color: '#44CC44', bg: 'rgba(68,204,68,0.8)' },
  { id: 'yellow', emoji: '🟡', color: '#FFCC00', bg: 'rgba(255,204,0,0.8)' },
  { id: 'purple', emoji: '🟣', color: '#AA44FF', bg: 'rgba(170,68,255,0.8)' },
  { id: 'orange', emoji: '🟠', color: '#FF8844', bg: 'rgba(255,136,68,0.8)' },
];

type Phase = 'watch' | 'input' | 'correct' | 'fail' | 'waiting';

interface Props {
  level: number;
  onGameOver: (score: number) => void;
  onLevelComplete: (score: number) => void;
}

export function MemoryGame({ level, onGameOver, onLevelComplete }: Props) {
  const { width: SW } = Dimensions.get('window');
  const seqLength = Math.min(2 + Math.floor(level / 2), 9); // 2..9
  const totalRounds = Math.min(3 + Math.floor(level / 3), 8); // 3..8
  const numColors = Math.min(3 + Math.floor(level / 3), 6);  // 3..6
  const availableColors = COLORS_DEF.slice(0, numColors);

  const [sequence, setSequence] = useState<string[]>([]);
  const [playerSeq, setPlayerSeq] = useState<string[]>([]);
  const [phase, setPhase] = useState<Phase>('waiting');
  const [activeBtn, setActiveBtn] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const maxMistakes = 3;

  const BTN_SIZE = Math.min(80, (SW - 48) / Math.ceil(numColors / 2) - 10);

  const generateAndPlay = useCallback(async () => {
    const newSeq = Array.from({ length: seqLength }, () =>
      availableColors[Math.floor(Math.random() * availableColors.length)].id
    );
    setSequence(newSeq);
    setPlayerSeq([]);
    setPhase('watch');

    const delay = Math.max(400, 900 - level * 30); // flash duration per item
    for (let i = 0; i < newSeq.length; i++) {
      await new Promise(r => setTimeout(r, i * (delay + 150)));
      setActiveBtn(newSeq[i]);
      await new Promise(r => setTimeout(r, delay));
      setActiveBtn(null);
    }
    await new Promise(r => setTimeout(r, 400));
    setPhase('input');
  }, [seqLength, availableColors, level]);

  useEffect(() => {
    const t = setTimeout(generateAndPlay, 600);
    return () => clearTimeout(t);
  }, []);

  const pressColor = (colorId: string) => {
    if (phase !== 'input') return;
    const idx = playerSeq.length;
    const newPlayerSeq = [...playerSeq, colorId];
    setPlayerSeq(newPlayerSeq);
    setActiveBtn(colorId);
    setTimeout(() => setActiveBtn(null), 180);

    if (newPlayerSeq[idx] !== sequence[idx]) {
      // Wrong
      setPhase('fail');
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      if (newMistakes >= maxMistakes) {
        setTimeout(() => onGameOver(score), 900);
        return;
      }
      setTimeout(() => generateAndPlay(), 900);
      return;
    }

    if (newPlayerSeq.length === sequence.length) {
      // Round complete!
      const pts = seqLength * 5;
      const newScore = score + pts;
      setScore(newScore);
      const newRound = round + 1;
      setRound(newRound);
      setPhase('correct');
      if (newRound >= totalRounds) {
        setTimeout(() => onLevelComplete(newScore), 700);
        return;
      }
      setTimeout(() => generateAndPlay(), 900);
    }
  };

  const statusText = {
    watch: `👀 Ingat ${seqLength} warna!`,
    input: `🎯 Ulangi! ${playerSeq.length}/${seqLength}`,
    correct: '✅ Tepat! Lanjut...',
    fail: `❌ Salah! Sisa ${maxMistakes - mistakes} kesalahan`,
    waiting: '⏳ Bersiap...',
  }[phase];

  return (
    <View style={mg.container}>
      <View style={mg.hud}>
        <Text style={mg.hudLevel}>Lv {level}</Text>
        <Text style={mg.hudRound}>Ronde {round + 1}/{totalRounds}</Text>
        <Text style={mg.hudScore}>⭐ {score}</Text>
        <Text style={mg.hudMistakes}>❌ {mistakes}/{maxMistakes}</Text>
      </View>
      <View style={mg.progressBar}>
        <View style={[mg.progressFill, { width: `${(round / totalRounds) * 100}%` as any }]} />
      </View>

      <View style={mg.displayArea}>
        <View style={[mg.statusBadge, phase === 'fail' && mg.statusFail, phase === 'correct' && mg.statusOk]}>
          <Text style={mg.statusText}>{statusText}</Text>
        </View>

        {/* Watch sequence display */}
        <View style={mg.seqRow}>
          {sequence.map((cid, i) => {
            const c = COLORS_DEF.find(x => x.id === cid)!;
            const lit = phase === 'watch' && activeBtn === cid;
            return (
              <View key={i} style={[mg.seqDot, lit ? { backgroundColor: c.color, transform: [{ scale: 1.3 }] } : {}]} />
            );
          })}
        </View>

        {/* Player input dots */}
        <View style={mg.seqRow}>
          {sequence.map((cid, i) => {
            const pid = playerSeq[i];
            const c = pid ? COLORS_DEF.find(x => x.id === pid) : null;
            return (
              <View key={i} style={[mg.seqDot, c ? { backgroundColor: c.color } : mg.emptyDot]} />
            );
          })}
        </View>
      </View>

      {/* Color buttons */}
      <View style={mg.buttonsGrid}>
        {availableColors.map(c => {
          const lit = activeBtn === c.id;
          return (
            <TouchableOpacity
              key={c.id}
              style={[mg.colorBtn, { backgroundColor: lit ? c.bg : c.color + '55', width: BTN_SIZE, height: BTN_SIZE, transform: lit ? [{ scale: 1.1 }] : [] }]}
              onPress={() => pressColor(c.id)}
              disabled={phase !== 'input'}
              activeOpacity={0.7}
            >
              <Text style={[mg.colorBtnText, { fontSize: BTN_SIZE * 0.38 }]}>{c.emoji}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const mg = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d1f' },
  hud: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 11, backgroundColor: 'rgba(0,0,0,0.3)' },
  hudLevel: { color: '#EC4899', fontWeight: '800', fontSize: 13 },
  hudRound: { color: '#fff', fontWeight: '700', fontSize: 12 },
  hudScore: { color: '#FFD700', fontWeight: '800', fontSize: 13 },
  hudMistakes: { color: '#FF6B6B', fontWeight: '800', fontSize: 12 },
  progressBar: { height: 5, backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#EC4899' },
  displayArea: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20, paddingHorizontal: 16 },
  statusBadge: {
    backgroundColor: 'rgba(255,255,255,0.07)', paddingHorizontal: 20, paddingVertical: 10,
    borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
  },
  statusFail: { backgroundColor: 'rgba(255,0,0,0.15)', borderColor: '#FF4444' },
  statusOk: { backgroundColor: 'rgba(0,200,0,0.15)', borderColor: '#44CC44' },
  statusText: { color: '#fff', fontWeight: '800', fontSize: 15, textAlign: 'center' },
  seqRow: { flexDirection: 'row', gap: 7, flexWrap: 'wrap', justifyContent: 'center' },
  seqDot: { width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  emptyDot: { borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.2)' },
  buttonsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 14, gap: 10, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.28)' },
  colorBtn: { borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  colorBtnText: {},
});
