import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  withSpring,
  withTiming,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import { Colors } from '../../constants/colors';

// --- BALANCE ---
// 60 second game. Target = level * 10m of running distance.
// Score ticker: every 100ms = +1 point (10pts/sec)
// Target: level 1 → 50pts (5 seconds), level 12 → 120pts (12 seconds)
// Much more achievable! Difficulty comes from obstacles, not score.
// ---

const OBSTACLE_EMOJIS = ['🌵', '🪨', '🐊', '🪵', '🦎'];

interface Obstacle {
  id: number;
  x: number;
  emoji: string;
}

interface Props {
  level: number;
  onGameOver: (score: number) => void;
  onLevelComplete: (score: number) => void;
}

export function RunnerGame({ level, onGameOver, onLevelComplete }: Props) {
  const { width: SW } = Dimensions.get('window');
  const HERO_X = SW * 0.12;
  const GROUND_OFFSET = 55; // from bottom
  const JUMP_HEIGHT = 110 + level * 4;

  const [isJumping, setIsJumping] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(true);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const idRef = useRef(0);
  const scoreRef = useRef(0);
  const gameActiveRef = useRef(true);
  const isJumpingRef = useRef(false);
  const heroY = useSharedValue(0); // offset from ground

  // target: level 1 → 50pts | level 12 → 120pts (10pts per second from ticker)
  const targetScore = level * 10 + 40;
  // obstacle spawn rate: level 1 → 3200ms, level 12 → 2000ms (Decreased density)
  const spawnRate = Math.max(1800, 3500 - level * 120);
  // obstacle speed: level 1 → 4px, level 12 → 8px per frame
  const obstacleSpeed = 4 + level * 0.35;

  const jump = useCallback(() => {
    if (!gameActiveRef.current || isJumpingRef.current) return;
    isJumpingRef.current = true;
    setIsJumping(true);
    
    heroY.value = withSequence(
      withTiming(-JUMP_HEIGHT, { duration: 250 }),
      withTiming(0, { duration: 250 }, (finished) => {
        runOnJS(setIsJumping)(false);
        isJumpingRef.current = false;
      })
    );

    // Safety fallback: Force reset after 1 second
    setTimeout(() => {
      if (isJumpingRef.current) {
        setIsJumping(false);
        isJumpingRef.current = false;
        heroY.value = 0;
      }
    }, 1000);
  }, [JUMP_HEIGHT]);

  // Keyboard support (Space / ArrowUp / Enter / Tab = Jump)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'Enter' || e.code === 'Tab') {
        e.preventDefault();
        jump();
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKey);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('keydown', handleKey);
      }
    };
  }, [jump]);

  // Score ticker (10 pts/sec)
  useEffect(() => {
    if (!gameActive) return;
    const interval = setInterval(() => {
      if (!gameActiveRef.current) return;
      scoreRef.current += 1;
      setScore(scoreRef.current);
      if (scoreRef.current >= targetScore && gameActiveRef.current) {
        gameActiveRef.current = false;
        setGameActive(false);
        onLevelComplete(scoreRef.current);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [gameActive, targetScore]);

  // Countdown
  useEffect(() => {
    if (!gameActive) return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          if (gameActiveRef.current) {
            gameActiveRef.current = false;
            setGameActive(false);
            onGameOver(scoreRef.current);
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameActive]);

  // Obstacle spawner
  useEffect(() => {
    if (!gameActive) return;
    const interval = setInterval(() => {
      if (!gameActiveRef.current) return;
      setObstacles(prev => [
        ...prev.slice(-6),
        {
          id: idRef.current++,
          x: SW + 50,
          emoji: OBSTACLE_EMOJIS[Math.floor(Math.random() * OBSTACLE_EMOJIS.length)],
        },
      ]);
    }, spawnRate);
    return () => clearInterval(interval);
  }, [gameActive, spawnRate, SW]);

  // Movement + collision (16ms = ~60fps)
  useEffect(() => {
    if (!gameActive) return;
    const interval = setInterval(() => {
      setObstacles(prev => {
        const updated = prev
          .map(o => ({ ...o, x: o.x - obstacleSpeed }))
          .filter(o => o.x > -60);

        for (const obs of updated) {
          // collision zone
          if (
            obs.x < HERO_X + 38 &&
            obs.x + 44 > HERO_X + 8 &&
            heroY.value > -30
          ) {
            if (gameActiveRef.current) {
              gameActiveRef.current = false;
              setGameActive(false);
              onGameOver(scoreRef.current);
            }
          }
        }
        return updated;
      });
    }, 16);
    return () => clearInterval(interval);
  }, [gameActive, obstacleSpeed, HERO_X]);

  const heroStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: heroY.value },
      { scaleX: -1 }, // Flip character to face forward (right)
    ],
  }));

  return (
    <TouchableOpacity style={rg.container} onPress={jump} activeOpacity={1}>
      {/* HUD */}
      <View style={rg.hud}>
        <Text style={rg.hudLevel}>Lv {level}</Text>
        <Text style={rg.hudScore}>🏃 {score}/{targetScore}</Text>
        <Text style={[rg.hudTimer, timeLeft <= 10 && rg.timerDanger]}>⏱ {timeLeft}s</Text>
        <Text style={rg.hudHint}>Ketuk / Space / Tab → Lompat!</Text>
      </View>

      {/* Progress */}
      <View style={rg.progressBar}>
        <View style={[rg.progressFill, { width: `${Math.min(100, (score / targetScore) * 100)}%` as any }]} />
      </View>

      {/* World */}
      <View style={rg.world}>
        <Text style={[rg.cloud, { top: '10%', left: '15%' }]}>☁️</Text>
        <Text style={[rg.cloud, { top: '20%', left: '55%' }]}>☁️</Text>
        <Text style={[rg.cloud, { top: '8%', left: '75%' }]}>🌤️</Text>

        {/* Ground */}
        <View style={rg.ground} />

        {/* Hero */}
        <Animated.View style={[rg.hero, { left: HERO_X, bottom: GROUND_OFFSET }, heroStyle]}>
          <Text style={rg.heroEmoji}>{isJumping ? '🦅' : '🏃'}</Text>
        </Animated.View>

        {/* Obstacles */}
        {obstacles.map(obs => (
          <View key={obs.id} style={[rg.obstacle, { left: obs.x, bottom: GROUND_OFFSET }]}>
            <Text style={rg.obsEmoji}>{obs.emoji}</Text>
          </View>
        ))}

        {/* Ground deco */}
        {[0.05, 0.25, 0.45, 0.65, 0.85].map((f, i) => (
          <Text key={i} style={[rg.groundDeco, { left: `${f * 100}%` as any, bottom: GROUND_OFFSET + 2 }]}>🌾</Text>
        ))}
      </View>
    </TouchableOpacity>
  );
}

const rg = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#87CEEB' },
  hud: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  hudLevel: { color: '#fff', fontWeight: '800', fontSize: 13 },
  hudScore: { color: '#FFD700', fontWeight: '800', fontSize: 14 },
  hudTimer: { color: '#fff', fontWeight: '800', fontSize: 13 },
  timerDanger: { color: '#FF4444' },
  hudHint: { color: 'rgba(255,255,255,0.6)', fontSize: 10 },
  progressBar: {
    height: 5,
    backgroundColor: 'rgba(0,0,0,0.15)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22c55e',
  },
  world: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#87CEEB',
  },
  cloud: { position: 'absolute', fontSize: 26, opacity: 0.8 },
  ground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 55,
    backgroundColor: '#4ade80',
    borderTopWidth: 3,
    borderTopColor: '#16a34a',
  },
  hero: {
    position: 'absolute',
  },
  heroEmoji: { fontSize: 38 },
  obstacle: {
    position: 'absolute',
  },
  obsEmoji: { fontSize: 40 },
  groundDeco: { position: 'absolute', fontSize: 14, opacity: 0.5 },
});
