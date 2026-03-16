import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence, withSpring, runOnJS } from 'react-native-reanimated';
import { Colors } from '../../constants/colors';

// --- BALANCE ---
// 60 seconds. Target: jump on pads level * 5 + 10 times.
// Pads are regenerated frequently → always enough to jump.
// Level 1: need 15 jumps in 60s → 1 jump every 4 seconds. Very easy!
// Level 12: need 70 jumps in 60s → 1.2 jumps/sec. Needs quick tapping.
// ---

interface Pad {
  id: number;
  x: number;
  y: number;
  w: number;
  sinkSpeed: number;
}

interface Props {
  level: number;
  onGameOver: (score: number) => void;
  onLevelComplete: (score: number) => void;
}

export function FrogJumpGame({ level, onGameOver, onLevelComplete }: Props) {
  const { width: SW, height: SH } = Dimensions.get('window');
  const GAME_H = SH * 0.6;
  const PAD_H = 28;

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(true);
  const [pads, setPads] = useState<Pad[]>([]);
  const [frogPadId, setFrogPadId] = useState<number | null>(null);
  const idRef = useRef(100);
  const scoreRef = useRef(0);
  const gameActiveRef = useRef(true);
  const frogPadRef = useRef<number | null>(null);

  const targetScore = level * 5 + 10;
  const jumpY = useSharedValue(0);
  const [isJumping, setIsJumping] = useState(false);

  // Generate starting pads
  useEffect(() => {
    const initialPads: Pad[] = Array.from({ length: 8 }, (_, i) => ({
      id: idRef.current++,
      x: Math.random() * (SW - 100) + 10,
      y: (GAME_H / 8) * i + 30,
      w: 80 + Math.random() * 50,
      sinkSpeed: 0.3 + level * 0.05,
    }));
    // Bottom starting pad
    const startPad: Pad = { id: idRef.current++, x: SW / 2 - 50, y: GAME_H - 60, w: 100, sinkSpeed: 0 };
    const allPads = [...initialPads, startPad];
    setPads(allPads);
    setFrogPadId(startPad.id);
    frogPadRef.current = startPad.id;
  }, [level, SW, GAME_H]);

  // Spawn new pads
  useEffect(() => {
    if (!gameActive) return;
    const interval = setInterval(() => {
      setPads(prev => {
        if (prev.length < 12) {
          return [...prev, {
            id: idRef.current++,
            x: Math.random() * (SW - 100) + 10,
            y: 10,
            w: 80 + Math.random() * 60,
            sinkSpeed: 0.3 + level * 0.05,
          }];
        }
        return prev;
      });
    }, Math.max(1200, 2000 - level * 60));
    return () => clearInterval(interval);
  }, [gameActive, level, SW]);

  // Sink pads + frog check
  useEffect(() => {
    if (!gameActive) return;
    const interval = setInterval(() => {
      setPads(prev => {
        const updated = prev.map(p => ({ ...p, y: p.y + p.sinkSpeed }));
        const frogPad = updated.find(p => p.id === frogPadRef.current);
        if (frogPad && frogPad.y > GAME_H - 20) {
          if (gameActiveRef.current) {
            gameActiveRef.current = false;
            setGameActive(false);
            onGameOver(scoreRef.current);
          }
        }
        return updated.filter(p => p.y < GAME_H + 10);
      });
    }, 50);
    return () => clearInterval(interval);
  }, [gameActive, level, GAME_H]);

  // Countdown
  useEffect(() => {
    if (!gameActive) return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          if (gameActiveRef.current) {
            gameActiveRef.current = false;
            setGameActive(false);
            if (scoreRef.current >= targetScore) onLevelComplete(scoreRef.current);
            else onGameOver(scoreRef.current);
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameActive, targetScore]);

  // Keyboard support: Find best pad to jump to
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!gameActiveRef.current || isJumping) return;
      
      const currentFrog = pads.find(p => p.id === frogPadRef.current);
      if (!currentFrog) return;

      let targetPad: Pad | null = null;

      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        // Find closest pad above
        const abovePads = pads
          .filter(p => p.id !== currentFrog.id && p.y < currentFrog.y)
          .sort((a, b) => b.y - a.y); // sort by highest Y (closest to frog vertically)
        targetPad = abovePads[0] || null;
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        const leftPads = pads
          .filter(p => p.id !== currentFrog.id && p.x < currentFrog.x && Math.abs(p.y - currentFrog.y) < 150)
          .sort((a, b) => b.x - a.x); // closest on left
        targetPad = leftPads[0] || null;
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        const rightPads = pads
          .filter(p => p.id !== currentFrog.id && p.x > currentFrog.x && Math.abs(p.y - currentFrog.y) < 150)
          .sort((a, b) => a.x - b.x); // closest on right
        targetPad = rightPads[0] || null;
      }

      if (targetPad) jumpTo(targetPad);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKey);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('keydown', handleKey);
      }
    };
  }, [pads, isJumping]);

  const jumpTo = (pad: Pad) => {
    if (!gameActiveRef.current || pad.id === frogPadRef.current || isJumping) return;
    
    setIsJumping(true);
    jumpY.value = withSequence(
      withSpring(-40, { damping: 10, stiffness: 200 }),
      withSpring(0, { damping: 12, stiffness: 180 }, (finished) => {
        if (finished) runOnJS(setIsJumping)(false);
      })
    );

    frogPadRef.current = pad.id;
    setFrogPadId(pad.id);
    scoreRef.current += 1;
    setScore(scoreRef.current);
    if (scoreRef.current >= targetScore) {
      gameActiveRef.current = false;
      setGameActive(false);
      onLevelComplete(scoreRef.current);
    }
  };

  const frogPad = pads.find(p => p.id === frogPadId);

  const frogStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: jumpY.value }],
  }));

  return (
    <View style={fj.container}>
      <View style={fj.hud}>
        <Text style={fj.hudLevel}>Lv {level}</Text>
        <Text style={fj.hudScore}>🐸 {score}/{targetScore}</Text>
        <Text style={[fj.hudTimer, timeLeft <= 10 && fj.timerDanger]}>⏱ {timeLeft}s</Text>
        <Text style={fj.hudHint}>Ketuk daun atau Space!</Text>
      </View>
      <View style={fj.progressBar}>
        <View style={[fj.progressFill, { width: `${Math.min(100, (score / targetScore) * 100)}%` as any }]} />
      </View>

      <View style={[fj.world, { height: GAME_H }]}>
        {/* Water waves */}
        {[0.15, 0.45, 0.75].map((f, i) => (
          <Text key={i} style={[fj.wave, { left: `${f * 100}%` as any, top: GAME_H * 0.3 * (i + 0.5) }]}>🌊</Text>
        ))}

        {/* Lily pads */}
        {pads.map(pad => {
          const isAbove = frogPad && pad.y < frogPad.y - 10;
          const isDanger = pad.y > GAME_H - 120 && pad.sinkSpeed > 0;
          
          return (
            <TouchableOpacity
              key={pad.id}
              style={[
                fj.pad, 
                { left: pad.x, top: pad.y, width: pad.w, height: PAD_H, borderRadius: PAD_H / 2 },
                isAbove && fj.padHighlight,
                isDanger && fj.padDanger
              ]}
              onPress={() => jumpTo(pad)}
              activeOpacity={0.7}
            >
              <Text style={fj.padLeaf}>🍃</Text>
              {isAbove && <View style={fj.jumpIndicator} />}
            </TouchableOpacity>
          );
        })}

        {/* Frog on current pad */}
        {frogPad && (
          <Animated.View style={[fj.frog, { left: frogPad.x + frogPad.w / 2 - 18, top: frogPad.y - 38 }, frogStyle]}>
            <Text style={fj.frogEmoji}>🐸</Text>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const fj = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0c4a6e' },
  hud: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, backgroundColor: 'rgba(0,0,0,0.3)' },
  hudLevel: { color: '#22c55e', fontWeight: '800', fontSize: 13 },
  hudScore: { color: '#fff', fontWeight: '800', fontSize: 14 },
  hudTimer: { color: '#aaa', fontWeight: '800', fontSize: 13 },
  timerDanger: { color: '#FF4444' },
  hudHint: { color: 'rgba(255,255,255,0.45)', fontSize: 10 },
  progressBar: { height: 5, backgroundColor: 'rgba(255,255,255,0.1)', overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#22c55e' },
  world: { position: 'relative', overflow: 'hidden', backgroundColor: '#0ea5e9', flex: 1 },
  wave: { position: 'absolute', fontSize: 30, opacity: 0.15 },
  pad: {
    position: 'absolute', backgroundColor: '#22c55e',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#16a34a',
  },
  padHighlight: {
    borderColor: '#fff',
    borderWidth: 3,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  padDanger: {
    backgroundColor: '#ef4444',
    borderColor: '#b91c1c',
  },
  jumpIndicator: {
    position: 'absolute',
    top: -10,
    fontSize: 10,
    color: '#fff',
    fontWeight: '900',
  },
  padLeaf: { fontSize: 14 },
  frog: { position: 'absolute', zIndex: 10 },
  frogEmoji: { fontSize: 34 },
});
