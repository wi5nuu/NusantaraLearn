import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../../constants/colors';

// --- BALANCE FORMULA ---
// Time = 60 seconds | TargetScore = level * 3 + 2
// SpawnRate = max(500, 1200 - level * 40) ms
// At level 1: 60s / 1.2s = 50 stars spawn → need 5 → very achievable
// At level 15: 60s / 0.6s = 100 stars spawn → need 47 → achievable
// ---

const STAR_EMOJIS = ['⭐', '🌟', '💫', '✨', '🌙'];
const BOMB_EMOJI = '💣';

interface Star {
  id: number;
  x: number;
  emoji: string;
  isBomb: boolean;
  hit: boolean;
}

interface Props {
  level: number;
  onGameOver: (score: number) => void;
  onLevelComplete: (score: number) => void;
}

export function StarShooterGame({ level, onGameOver, onLevelComplete }: Props) {
  const { width: SW, height: SH } = Dimensions.get('window');
  const GAME_H = SH * 0.65;

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [stars, setStars] = useState<Star[]>([]);
  const [gameActive, setGameActive] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60);
  const idRef = useRef(0);
  const scoreRef = useRef(0);
  const gameActiveRef = useRef(true);

  // targetScore: level 1 → 5 stars, level 15 → 47 stars
  const targetScore = level * 3 + 2;
  // spawnRate: level 1 → 1160ms, level 15 → 620ms
  const spawnRate = Math.max(500, 1200 - level * 40);
  // fallDuration: level 1 → 2700ms, level 15 → 1200ms
  const fallDuration = Math.max(1200, 2800 - level * 100);
  // bombChance: level 1 → 8%, level 15 → 22%
  const bombChance = 0.08 + level * 0.01;

  const spawnStar = useCallback(() => {
    if (!gameActiveRef.current) return;
    const isBomb = Math.random() < bombChance;
    const newStar: Star = {
      id: idRef.current++,
      x: Math.random() * (SW - 70) + 20,
      emoji: isBomb ? BOMB_EMOJI : STAR_EMOJIS[Math.floor(Math.random() * STAR_EMOJIS.length)],
      isBomb,
      hit: false,
    };
    setStars(prev => [...prev.slice(-12), newStar]);
  }, [bombChance, SW]);

  // Countdown timer
  useEffect(() => {
    if (!gameActiveRef.current) return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          if (gameActiveRef.current) {
            gameActiveRef.current = false;
            setGameActive(false);
            if (scoreRef.current >= targetScore) {
              onLevelComplete(scoreRef.current);
            } else {
              onGameOver(scoreRef.current);
            }
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Spawner
  useEffect(() => {
    if (!gameActiveRef.current) return;
    const interval = setInterval(spawnStar, spawnRate);
    return () => clearInterval(interval);
  }, [spawnStar, spawnRate]);

  const hitStar = (star: Star) => {
    if (!gameActiveRef.current || star.hit) return;
    setStars(prev => prev.map(s => s.id === star.id ? { ...s, hit: true } : s));
    if (star.isBomb) {
      setLives(l => {
        const nl = l - 1;
        if (nl <= 0 && gameActiveRef.current) {
          gameActiveRef.current = false;
          setGameActive(false);
          onGameOver(scoreRef.current);
        }
        return nl;
      });
    } else {
      scoreRef.current += 1;
      setScore(scoreRef.current);
      if (scoreRef.current >= targetScore && gameActiveRef.current) {
        gameActiveRef.current = false;
        setGameActive(false);
        onLevelComplete(scoreRef.current);
      }
    }
  };

  return (
    <View style={[sg.container, { height: '100%' }]}>
      {/* HUD */}
      <View style={sg.hud}>
        <Text style={sg.hudLabel}>Lv {level}</Text>
        <Text style={sg.hudScore}>⭐ {score}/{targetScore}</Text>
        <Text style={[sg.hudTimer, timeLeft <= 10 && sg.timerDanger]}>⏱ {timeLeft}s</Text>
        <Text style={sg.hudLives}>{'❤️'.repeat(lives)}</Text>
      </View>

      {/* Progress bar */}
      <View style={sg.progressBar}>
        <View style={[sg.progressFill, {
          width: `${Math.min(100, (score / targetScore) * 100)}%` as any,
          backgroundColor: score >= targetScore ? '#22c55e' : '#FFD700',
        }]} />
      </View>

      {/* Game area */}
      <View style={[sg.gameArea, { height: GAME_H }]}>
        {stars.filter(s => !s.hit).map(star => (
          <FallingItem
            key={star.id}
            star={star}
            fallDuration={fallDuration}
            gameH={GAME_H}
            onHit={() => hitStar(star)}
          />
        ))}
        {/* Ground line */}
        <View style={[sg.groundLine, { top: GAME_H - 10 }]} />
      </View>

      <Text style={sg.hint}>Ketuk bintang, hindari 💣! Butuh {targetScore - score} lagi</Text>
    </View>
  );
}

function FallingItem({
  star, fallDuration, gameH, onHit,
}: {
  star: Star;
  fallDuration: number;
  gameH: number;
  onHit: () => void;
}) {
  const y = useSharedValue(-64);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const didFall = useRef(false);

  useEffect(() => {
    y.value = withTiming(gameH + 10, { duration: fallDuration, easing: Easing.linear }, (done) => {
      if (done && !didFall.current) {
        didFall.current = true;
        opacity.value = withTiming(0, { duration: 150 });
      }
    });
  }, []);

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    left: star.x,
    top: y.value,
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(1.6, { damping: 10 }, () => {
      opacity.value = withTiming(0, { duration: 150 });
    });
    onHit();
  };

  return (
    <Animated.View style={style}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7} style={sg.starBtn}>
        <Text style={sg.starEmoji}>{star.emoji}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const sg = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#08081a' },
  hud: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  hudLabel: { color: Colors.primaryLight, fontSize: 13, fontWeight: '800' },
  hudScore: { color: '#FFD700', fontSize: 16, fontWeight: '900' },
  hudTimer: { color: '#aaa', fontSize: 15, fontWeight: '800' },
  timerDanger: { color: '#FF4444' },
  hudLives: { fontSize: 15 },
  progressBar: {
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  gameArea: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: 'rgba(8,8,26,0.98)',
    position: 'relative',
  },
  groundLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255,100,100,0.3)',
  },
  starBtn: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starEmoji: { fontSize: 42 },
  hint: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 11,
    textAlign: 'center',
    paddingVertical: 6,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
});
