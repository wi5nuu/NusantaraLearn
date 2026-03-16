import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, Easing,
} from 'react-native-reanimated';
import { Colors } from '../../constants/colors';

// --- BALANCE ---
// 12 arrows per game (level + 6). Hit goal: level * 2 + 3 hits.
// Target is generous enough — even 50% accuracy clears level 1.
// Target: level1 → 5 hits from 9 arrows (55%), level12 → 27 hits from 18 arrows — nah that's too hard.
// Fix: targetHits = level + 3, totalArrows = targetHits * 2 + 2 (always double the target)
// Level 1: need 4 hits, have 10 arrows (40%) — very easy
// Level 12: need 15 hits, have 32 arrows (47%) — achievable
// ---

interface Props {
  level: number;
  onGameOver: (score: number) => void;
  onLevelComplete: (score: number) => void;
}

export function ArcheryGame({ level, onGameOver, onLevelComplete }: Props) {
  const { width: SW, height: SH } = Dimensions.get('window');
  const TARGET_SIZE = Math.min(110, SW * 0.28);

  const targetHits = level + 3;
  const totalArrows = targetHits * 2 + 2;

  const [hits, setHits] = useState(0);
  const [arrowsLeft, setArrowsLeft] = useState(totalArrows);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const hitsRef = useRef(0);

  const targetX = useSharedValue(SW * 0.3);
  const targetY = useSharedValue(SH * 0.25);

  // Target moves continuously
  useEffect(() => {
    const speed = Math.max(700, 1600 - level * 60);
    const move = () => {
      if (gameOver) return;
      targetX.value = withTiming(
        Math.random() * (SW - TARGET_SIZE - 20) + 10,
        { duration: speed, easing: Easing.inOut(Easing.quad) }
      );
      targetY.value = withTiming(
        Math.random() * (SH * 0.35) + SH * 0.1,
        { duration: speed, easing: Easing.inOut(Easing.quad) }
      );
    };
    move();
    const interval = setInterval(move, speed + 50);
    return () => clearInterval(interval);
  }, [level, gameOver, SW, SH, TARGET_SIZE]);

  const fireArrow = () => {
    if (arrowsLeft <= 0 || gameOver) return;
    const remaining = arrowsLeft - 1;
    setArrowsLeft(remaining);

    // Hit calculation: 55% base + level bonus capped at 75%
    const hitChance = Math.min(0.75, 0.55 + level * 0.015);
    const isHit = Math.random() < hitChance;

    // Rings score: bull = 10, mid = 5, outer = 2
    const pts = isHit ? (Math.random() < 0.25 ? 10 : Math.random() < 0.5 ? 5 : 2) : 0;

    if (isHit) {
      hitsRef.current += 1;
      const newHits = hitsRef.current;
      const newScore = score + pts;
      setHits(newHits);
      setScore(newScore);
      setFeedback(pts === 10 ? '🎯 BULLSEYE! +10' : pts === 5 ? '🎯 Hit! +5' : '🎯 Outer! +2');

      if (newHits >= targetHits) {
        setGameOver(true);
        setTimeout(() => onLevelComplete(newScore), 600);
        return;
      }
    } else {
      setFeedback('💨 Meleset!');
    }

    setTimeout(() => setFeedback(null), 600);

    if (remaining <= 0) {
      setGameOver(true);
      setTimeout(() => {
        if (hitsRef.current >= targetHits) onLevelComplete(score + pts);
        else onGameOver(score + pts);
      }, 600);
    }
  };

  const targetStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: targetX.value,
    top: targetY.value,
  }));

  const pct = Math.min(100, (hits / targetHits) * 100);

  return (
    <View style={ar.container}>
      <View style={ar.hud}>
        <Text style={ar.hudLevel}>Lv {level}</Text>
        <Text style={ar.hudScore}>🎯 {hits}/{targetHits}</Text>
        <Text style={ar.hudArrows}>🏹 {arrowsLeft}/{totalArrows}</Text>
      </View>
      <View style={ar.progressBar}>
        <View style={[ar.progressFill, { width: `${pct}%` as any }]} />
      </View>

      <View style={ar.gameArea}>
        <Text style={ar.skyDeco}>🌤️</Text>
        <Text style={[ar.skyDeco, { left: SW * 0.55, top: 20 }]}>☁️</Text>

        <Animated.View style={targetStyle}>
          <TouchableOpacity onPress={fireArrow} activeOpacity={0.85} disabled={gameOver}>
            <View style={[ar.targetOuter, { width: TARGET_SIZE, height: TARGET_SIZE, borderRadius: TARGET_SIZE / 2 }]}>
              <View style={ar.targetMid}>
                <View style={ar.targetInner}>
                  <Text style={ar.targetBull}>🎯</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {feedback && (
          <View style={ar.feedbackBox}>
            <Text style={ar.feedbackText}>{feedback}</Text>
          </View>
        )}
      </View>

      <View style={ar.bottomBar}>
        <Text style={ar.instruction}>Ketuk target! Butuh {targetHits - hits} hit lagi</Text>
        <View style={ar.arrowRow}>
          {Array.from({ length: Math.min(arrowsLeft, 10) }).map((_, i) => (
            <Text key={i} style={ar.arrowIcon}>🏹</Text>
          ))}
          {arrowsLeft > 10 && <Text style={ar.arrowIcon}> +{arrowsLeft - 10}</Text>}
        </View>
      </View>
    </View>
  );
}

const ar = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d2137' },
  hud: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, backgroundColor: 'rgba(0,0,0,0.3)' },
  hudLevel: { color: '#F97316', fontWeight: '800', fontSize: 13 },
  hudScore: { color: '#fff', fontWeight: '800', fontSize: 15 },
  hudArrows: { color: '#FFD700', fontWeight: '800', fontSize: 13 },
  progressBar: { height: 5, backgroundColor: 'rgba(255,255,255,0.1)', overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#F97316' },
  gameArea: { flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: '#87CEEB' },
  skyDeco: { position: 'absolute', top: 15, left: 15, fontSize: 26, opacity: 0.6 },
  targetOuter: { backgroundColor: 'rgba(220,38,38,0.3)', borderWidth: 3, borderColor: 'rgba(220,38,38,0.6)', alignItems: 'center', justifyContent: 'center' },
  targetMid: { width: '72%', aspectRatio: 1, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.3)', borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)', alignItems: 'center', justifyContent: 'center' },
  targetInner: { width: '55%', aspectRatio: 1, borderRadius: 100, backgroundColor: 'rgba(255,200,0,0.6)', alignItems: 'center', justifyContent: 'center' },
  targetBull: { fontSize: 22 },
  feedbackBox: { position: 'absolute', top: '35%', alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 18, paddingVertical: 8, borderRadius: 12 },
  feedbackText: { color: '#FFD700', fontSize: 18, fontWeight: '800' },
  bottomBar: { backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 16, paddingVertical: 10, gap: 6 },
  instruction: { color: 'rgba(255,255,255,0.55)', fontSize: 12, textAlign: 'center' },
  arrowRow: { flexDirection: 'row', justifyContent: 'center', gap: 2, flexWrap: 'wrap' },
  arrowIcon: { fontSize: 16 },
});
