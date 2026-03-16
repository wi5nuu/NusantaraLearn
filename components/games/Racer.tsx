import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withRepeat,
} from 'react-native-reanimated';

// =============================================
// BALAPAN KUDA v3 — Scripted Timed Race
// =============================================
// • Level N → race lasts N minutes = N × 60 seconds
// • 5 obstacles per minute → Level 1 = 5 obs, Level 2 = 10 obs, ...
// • Obstacles spawn at equal intervals: (duration / totalObs) seconds
// • Bot1 (Red 🔴): Skrip — Kena rintangan ke-3, tereliminasi (sangat lambat setelahnya)
// • Bot2 (Blue 🔵): Finish 2nd if user wins, or 1st if user loses
// • User: Dodge all obstacles with ◀▶ → win 1st place
// • After race: Podium popup (🥇🥈🥉) with all racer names
// • Kid-friendly: Large buttons, generous hit box, fun stun animation
// =============================================

const { width: SW, height: SH } = Dimensions.get('window');
const NUM_LANES = 3;
const LANE_X = [SW * 0.18, SW * 0.5, SW * 0.82];
const TRACK_H = SH * 0.5;
const PLAYER_Y = TRACK_H - 90;
const OBSTACLE_START_Y = -70;

interface ObstacleData {
  id: number;
  lane: number;
  y: number;
  emoji: string;
  targetedBot: number | null; // which bot this is scripted to hit (0 = bot1, null = random)
}

interface PodiumEntry {
  name: string;
  emoji: string;
  color: string;
  rank: number;
  eliminated: boolean;
}

interface Props {
  level: number;
  onGameOver: (score: number) => void;
  onLevelComplete: (score: number) => void;
}

const OBS_EMOJIS = ['🪨', '🪵', '🌵', '💥', '🐍'];
const LANE_LABELS = ['KIRI', 'TENGAH', 'KANAN'];

export function RacerGame({ level, onGameOver, onLevelComplete }: Props) {
  // Race config
  const RACE_DURATION = level * 60; // in seconds — Level 1 = 60s, Level 10 = 600s
  const TOTAL_OBS = level * 5;      // 5 per minute
  const OBS_INTERVAL = (RACE_DURATION / TOTAL_OBS) * 1000; // ms between each obstacle

  // State
  const [playerLane, setPlayerLane] = useState(1);
  const [timeLeft, setTimeLeft] = useState(RACE_DURATION);
  const [obstacles, setObstacles] = useState<ObstacleData[]>([]);
  const [obsCount, setObsCount] = useState(0);
  const [playerHits, setPlayerHits] = useState(0);
  const [bot1Eliminated, setBot1Eliminated] = useState(false);
  const [stunned, setStunned] = useState(false);
  const [gameActive, setGameActive] = useState(true);
  const [showPodium, setShowPodium] = useState(false);
  const [podium, setPodium] = useState<PodiumEntry[]>([]);
  const [scrollY, setScrollY] = useState(0);
  const [playerProgress, setPlayerProgress] = useState(0); // 0-100
  const [bot1Progress, setBot1Progress] = useState(0);
  const [bot2Progress, setBot2Progress] = useState(0);

  // Refs
  const playerLaneRef = useRef(1);
  const stunnedRef = useRef(false);
  const gameActiveRef = useRef(true);
  const obsCountRef = useRef(0);
  const bot1EliminatedRef = useRef(false);
  const playerHitsRef = useRef(0);
  const idRef = useRef(0);

  // Animations
  const playerX = useSharedValue(LANE_X[1]);
  const stunnedShake = useSharedValue(0);
  const bobY = useSharedValue(0);

  useEffect(() => {
    // Horse bob animation
    bobY.value = withRepeat(
      withSequence(withTiming(-6, { duration: 250 }), withTiming(0, { duration: 250 })),
      -1,
      true
    );
  }, []);

  const changeLane = useCallback((dir: 'left' | 'right') => {
    if (!gameActiveRef.current || stunnedRef.current) return;
    const cur = playerLaneRef.current;
    const next = dir === 'left' ? Math.max(0, cur - 1) : Math.min(2, cur + 1);
    if (next === cur) return;
    playerLaneRef.current = next;
    setPlayerLane(next);
    playerX.value = withSpring(LANE_X[next], { damping: 20, stiffness: 260 });
  }, []);

  const stunPlayer = useCallback(() => {
    if (stunnedRef.current) return;
    stunnedRef.current = true;
    setStunned(true);
    stunnedShake.value = withSequence(
      withTiming(12, { duration: 55 }),
      withTiming(-12, { duration: 55 }),
      withTiming(10, { duration: 55 }),
      withTiming(-10, { duration: 55 }),
      withTiming(0, { duration: 55 })
    );
    setTimeout(() => { stunnedRef.current = false; setStunned(false); }, level <= 3 ? 1500 : 1000);
  }, [level]);

  // ── Countdown timer ──
  useEffect(() => {
    if (!gameActive) return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          if (gameActiveRef.current) finishRace();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameActive]);

  // ── Player + bots progress ──
  useEffect(() => {
    if (!gameActive) return;
    const interval = setInterval(() => {
      if (!gameActiveRef.current) return;
      setScrollY(y => y + 3);
      setPlayerProgress(p => Math.min(100, p + (stunnedRef.current ? 0.06 : 0.12)));
      setBot1Progress(p => Math.min(100, p + (bot1EliminatedRef.current ? 0.04 : 0.10)));
      setBot2Progress(p => Math.min(100, p + 0.11));
    }, 16);
    return () => clearInterval(interval);
  }, [gameActive]);

  // ── Obstacle spawner (exact intervals) ──
  useEffect(() => {
    if (!gameActive) return;
    let count = 0;

    const spawn = () => {
      if (!gameActiveRef.current || count >= TOTAL_OBS) return;
      count++;
      obsCountRef.current = count;
      setObsCount(count);

      // SCRIPTED: Obstacle 3 → Bot1 lane, triggers Bot1 elimination
      let lane: number;
      let targetedBot: number | null = null;
      if (count === 3) {
        // Bot1 is in lane 0, so spawn there
        lane = 0;
        targetedBot = 0;
      } else {
        // Random lane excluding player's current lane sometimes (kid-friendly)
        const avoidPlayer = Math.random() < 0.4;
        if (avoidPlayer) {
          const choices = [0, 1, 2].filter(l => l !== playerLaneRef.current);
          lane = choices[Math.floor(Math.random() * choices.length)];
        } else {
          lane = Math.floor(Math.random() * 3);
        }
      }

      setObstacles(prev => [
        ...prev.slice(-10),
        {
          id: idRef.current++,
          lane,
          y: OBSTACLE_START_Y,
          emoji: OBS_EMOJIS[Math.floor(Math.random() * OBS_EMOJIS.length)],
          targetedBot,
        },
      ]);
    };

    // First obstacle after a short delay, then every OBS_INTERVAL
    const timeout = setTimeout(spawn, 2000);
    const interval = setInterval(spawn, OBS_INTERVAL);
    return () => { clearTimeout(timeout); clearInterval(interval); };
  }, [gameActive, TOTAL_OBS, OBS_INTERVAL]);

  // ── Obstacle movement + collision ──
  useEffect(() => {
    if (!gameActive) return;
    const speed = 3 + level * 0.3;
    const interval = setInterval(() => {
      setObstacles(prev => {
        const moved = prev.map(o => ({ ...o, y: o.y + speed }));
        const alive: ObstacleData[] = [];

        for (const obs of moved) {
          let hit = false;
          // Check player collision (generous hitbox for kids)
          if (obs.lane === playerLaneRef.current && obs.y > PLAYER_Y - 55 && obs.y < PLAYER_Y + 15) {
            playerHitsRef.current++;
            setPlayerHits(playerHitsRef.current);
            stunPlayer();
            hit = true;
          }
          // Scripted bot1 elimination
          if (obs.targetedBot === 0 && obs.y > PLAYER_Y - 55 && !bot1EliminatedRef.current) {
            bot1EliminatedRef.current = true;
            setBot1Eliminated(true);
            hit = true;
          }
          if (!hit && obs.y < TRACK_H + 20) {
            alive.push(obs);
          }
        }
        return alive;
      });
    }, 16);
    return () => clearInterval(interval);
  }, [gameActive, level, stunPlayer]);

  const finishRace = useCallback(() => {
    if (!gameActiveRef.current) return;
    gameActiveRef.current = false;
    setGameActive(false);

    // --- Determine podium ---
    // Bot1 was eliminated → always 3rd
    // If user hit 0 obstacles → 1st. Otherwise compare with bot2.
    const userWins = playerHitsRef.current <= Math.floor(TOTAL_OBS * 0.4);

    const entries: PodiumEntry[] = [
      {
        name: 'Kamu', emoji: '🏇', color: '#22c55e',
        rank: userWins ? 1 : 3,
        eliminated: false,
      },
      {
        name: 'Bot Biru', emoji: '🦄', color: '#4488FF',
        rank: userWins ? 2 : 1,
        eliminated: false,
      },
      {
        name: 'Bot Merah', emoji: '🐴', color: '#FF4444',
        rank: 3,
        eliminated: true,
      },
    ];
    entries.sort((a, b) => a.rank - b.rank);
    setPodium(entries);

    setTimeout(() => setShowPodium(true), 500);
  }, [TOTAL_OBS]);

  // Format time
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;

  const playerHorseStyle = useAnimatedStyle(() => ({
    left: playerX.value - 28,
    top: PLAYER_Y - 44 + bobY.value,
    transform: [{ translateX: stunnedShake.value }],
  }));

  return (
    <View style={s.container}>
      {/* ── HUD ── */}
      <View style={s.hud}>
        <View style={s.hudChip}>
          <Text style={s.hudLv}>Lv {level}</Text>
        </View>

        {/* Mini race bar */}
        <View style={s.raceProgress}>
          <Text style={s.raceTitle}>Balapan</Text>
          <View style={s.raceBar}>
            {/* Bot1 */}
            <View style={[s.botMarker, { left: `${Math.min(96, bot1Progress)}%` as any, backgroundColor: '#FF4444' }]} />
            {/* Bot2 */}
            <View style={[s.botMarker, { left: `${Math.min(96, bot2Progress)}%` as any, backgroundColor: '#4488FF' }]} />
            {/* Player */}
            <View style={[s.playerMarker, { left: `${Math.min(94, playerProgress)}%` as any }]}>
              <Text style={{ fontSize: 11 }}>🏇</Text>
            </View>
            <View style={[s.raceBarFill, { width: `${playerProgress}%` as any }]} />
          </View>
        </View>

        <View style={s.hudRight}>
          <Text style={s.hudTime}>⏱ {timeStr}</Text>
          <Text style={s.hudObs}>Rintangan: {obsCount}/{TOTAL_OBS}</Text>
        </View>
      </View>

      {/* ── TRACK ── */}
      <View style={[s.track, { height: TRACK_H }]}>
        {/* Scrolling ground */}
        {[0, 1, 2, 3, 4, 5].map(i => (
          <View key={i} style={[s.groundStripe, { top: ((scrollY * 2 + i * 60) % (TRACK_H + 60)) - 30 }]} />
        ))}

        {/* Lane dividers */}
        {[1, 2].map(i => (
          <View key={i} style={[s.laneLine, { left: (SW / 3) * i }]} />
        ))}

        {/* Finish banner */}
        {playerProgress >= 90 && (
          <View style={s.finishBanner}>
            <Text style={s.finishText}>🏁 HAMPIR FINISH! 🏁</Text>
          </View>
        )}

        {/* Obstacles */}
        {obstacles.map(obs => (
          <View key={obs.id} style={[s.obstacle, { left: LANE_X[obs.lane] - 24, top: obs.y }]}>
            <Text style={s.obsEmoji}>{obs.emoji}</Text>
          </View>
        ))}

        {/* Bot 2 (Blue) — Lajur kanan */}
        <View style={[s.botHorse, { left: LANE_X[2] - 22, top: PLAYER_Y - 40 }]}>
          <Text style={s.botEmoji}>🦄</Text>
          <View style={[s.botBadge, { backgroundColor: '#4488FF' }]}>
            <Text style={s.botBadgeText}>BOT 🔵</Text>
          </View>
        </View>

        {/* Bot 1 (Red) — Lajur kiri */}
        <View style={[s.botHorse, { left: LANE_X[0] - 22, top: PLAYER_Y - 40, opacity: bot1Eliminated ? 0.35 : 1 }]}>
          <Text style={[s.botEmoji, bot1Eliminated && s.eliminatedEmoji]}>🐴</Text>
          {bot1Eliminated ? (
            <View style={[s.botBadge, { backgroundColor: '#888' }]}>
              <Text style={s.botBadgeText}>GUGUR</Text>
            </View>
          ) : (
            <View style={[s.botBadge, { backgroundColor: '#FF4444' }]}>
              <Text style={s.botBadgeText}>BOT 🔴</Text>
            </View>
          )}
        </View>

        {/* Player */}
        <Animated.View style={[s.playerHorse, playerHorseStyle]}>
          <Text style={[s.playerEmoji, stunned && s.stunnedEmoji]}>🏇</Text>
          <View style={s.youBadge}>
            <Text style={s.youText}>{stunned ? '😵' : 'YOU'}</Text>
          </View>
        </Animated.View>
      </View>

      {/* ── CONTROLS ── */}
      <View style={s.controls}>
        <TouchableOpacity style={s.ctrlBtn} onPress={() => changeLane('left')} activeOpacity={0.7}>
          <Text style={s.ctrlArrow}>◀</Text>
          <Text style={s.ctrlLbl}>KIRI</Text>
        </TouchableOpacity>

        <View style={s.ctrlInfo}>
          {stunned
            ? <Text style={s.stunnedInfo}>😵 Terkena! Tunggu...</Text>
            : <Text style={s.ctrlHint}>
                {bot1Eliminated
                  ? '🔴 Bot Merah GUGUR!'
                  : 'Tekan ◀▶ Menghindar'}
              </Text>
          }
          <Text style={s.laneName}>[{LANE_LABELS[playerLane]}]</Text>
        </View>

        <TouchableOpacity style={s.ctrlBtn} onPress={() => changeLane('right')} activeOpacity={0.7}>
          <Text style={s.ctrlArrow}>▶</Text>
          <Text style={s.ctrlLbl}>KANAN</Text>
        </TouchableOpacity>
      </View>

      {/* ── STANDINGS ── */}
      <View style={s.standings}>
        {[
          { name: 'Bot Biru', pct: bot2Progress, color: '#4488FF' },
          { name: 'Kamu', pct: playerProgress, color: '#22c55e' },
          { name: 'Bot Merah', pct: bot1Progress, color: bot1Eliminated ? '#888' : '#FF4444' },
        ]
          .sort((a, b) => b.pct - a.pct)
          .map((p, i) => (
            <View key={p.name} style={s.standRow}>
              <Text style={s.standRankEmoji}>{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</Text>
              <Text style={[s.standName, p.name === 'Kamu' && { color: '#22c55e', fontWeight: '800' }]}>{p.name}</Text>
              <View style={s.standBarWrap}>
                <View style={[s.standBar, { width: `${Math.min(100, p.pct)}%` as any, backgroundColor: p.color }]} />
              </View>
              <Text style={s.standPct}>{Math.round(p.pct)}%</Text>
            </View>
          ))}
      </View>

      {/* ── PODIUM MODAL ── */}
      <Modal visible={showPodium} transparent animationType="fade">
        <View style={s.modalOverlay}>
          <View style={s.podiumCard}>
            <Text style={s.podiumTitle}>🏁 BALAPAN SELESAI! 🏁</Text>
            <Text style={s.podiumSub}>Level {level} Selesai</Text>

            {/* Podium visual */}
            <View style={s.podiumStage}>
              {/* 2nd place */}
              <View style={s.podiumCol}>
                <Text style={s.podiumHorse}>{podium[1]?.emoji || '🐴'}</Text>
                <View style={[s.podiumBox, s.podium2nd]}>
                  <Text style={s.podiumBoxRank}>🥈</Text>
                  <Text style={s.podiumBoxName}>{podium[1]?.name}</Text>
                </View>
              </View>
              {/* 1st place */}
              <View style={[s.podiumCol, { marginTop: -30 }]}>
                <Text style={{ fontSize: 28 }}>👑</Text>
                <Text style={s.podiumHorse}>{podium[0]?.emoji || '🏇'}</Text>
                <View style={[s.podiumBox, s.podium1st]}>
                  <Text style={s.podiumBoxRank}>🥇</Text>
                  <Text style={s.podiumBoxName}>{podium[0]?.name}</Text>
                </View>
              </View>
              {/* 3rd place */}
              <View style={s.podiumCol}>
                <Text style={s.podiumHorse}>{podium[2]?.emoji || '🦄'}</Text>
                <View style={[s.podiumBox, s.podium3rd]}>
                  <Text style={s.podiumBoxRank}>🥉</Text>
                  <Text style={[s.podiumBoxName, { opacity: 0.7 }]}>{podium[2]?.name}</Text>
                  {podium[2]?.eliminated && (
                    <Text style={s.eliminatedTag}>GUGUR di obs ke-3</Text>
                  )}
                </View>
              </View>
            </View>

            {/* Result message */}
            <View style={s.resultMsgBox}>
              {podium[0]?.name === 'Kamu' ? (
                <>
                  <Text style={s.resultMsgWin}>🎉 Kamu JUARA 1!</Text>
                  <Text style={s.resultMsgSub}>Luar biasa! Kuda terhebat!</Text>
                </>
              ) : (
                <>
                  <Text style={s.resultMsgLose}>😢 Kamu Posisi 3</Text>
                  <Text style={s.resultMsgSub}>Bot Biru lebih cepat kali ini! Coba lagi!</Text>
                </>
              )}
            </View>

            {/* Buttons */}
            <View style={s.podiumBtns}>
              <TouchableOpacity
                style={s.podiumBtnRetry}
                onPress={() => {
                  setShowPodium(false);
                  onGameOver(Math.round(playerProgress * 10));
                }}
              >
                <Text style={s.podiumBtnText}>🔁 Ulang</Text>
              </TouchableOpacity>
              {podium[0]?.name === 'Kamu' && (
                <TouchableOpacity
                  style={s.podiumBtnNext}
                  onPress={() => {
                    setShowPodium(false);
                    onLevelComplete(Math.round(playerProgress * 10));
                  }}
                >
                  <Text style={s.podiumBtnText}>Level {level + 1} →</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0c1600' },

  // HUD
  hud: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    gap: 8,
  },
  hudChip: {
    backgroundColor: 'rgba(255,230,100,0.15)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,230,100,0.3)',
  },
  hudLv: { color: '#FFE66D', fontWeight: '800', fontSize: 13 },
  raceProgress: { flex: 1, gap: 3 },
  raceTitle: { color: 'rgba(255,255,255,0.4)', fontSize: 9, textAlign: 'center' },
  raceBar: {
    height: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 8,
    overflow: 'visible',
    position: 'relative',
  },
  raceBarFill: { height: '100%', backgroundColor: 'rgba(34,197,94,0.35)', borderRadius: 8 },
  botMarker: { position: 'absolute', top: 3, width: 10, height: 10, borderRadius: 5 },
  playerMarker: { position: 'absolute', top: -2 },
  hudRight: { alignItems: 'flex-end', gap: 2 },
  hudTime: { color: '#FFE66D', fontWeight: '800', fontSize: 14 },
  hudObs: { color: 'rgba(255,255,255,0.45)', fontSize: 9 },

  // Track
  track: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#1a2e00',
  },
  groundStripe: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.025)',
  },
  laneLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  finishBanner: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
  },
  finishText: { color: '#FFD700', fontSize: 18, fontWeight: '900', textShadowColor: '#000', textShadowRadius: 4, textShadowOffset: { width: 1, height: 1 } },
  obstacle: { position: 'absolute', zIndex: 5 },
  obsEmoji: { fontSize: 36 },
  botHorse: { position: 'absolute', alignItems: 'center', zIndex: 3 },
  botEmoji: { fontSize: 38 },
  eliminatedEmoji: { transform: [{ rotate: '45deg' }] },
  botBadge: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, marginTop: 2 },
  botBadgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  playerHorse: { position: 'absolute', alignItems: 'center', zIndex: 10 },
  playerEmoji: { fontSize: 42 },
  stunnedEmoji: { opacity: 0.5 },
  youBadge: { backgroundColor: '#22c55e', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  youText: { color: '#fff', fontSize: 10, fontWeight: '900' },

  // Controls
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.4)',
    gap: 8,
  },
  ctrlBtn: {
    width: 80,
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: 'rgba(100,200,255,0.1)',
    borderWidth: 2,
    borderColor: 'rgba(100,200,255,0.35)',
    alignItems: 'center',
    gap: 3,
  },
  ctrlArrow: { color: '#fff', fontSize: 26, fontWeight: '900' },
  ctrlLbl: { color: 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: '700' },
  ctrlInfo: { flex: 1, alignItems: 'center', gap: 4 },
  ctrlHint: { color: 'rgba(255,255,255,0.4)', fontSize: 11, textAlign: 'center' },
  stunnedInfo: { color: '#FF6B6B', fontWeight: '800', fontSize: 12, textAlign: 'center' },
  laneName: { color: '#FFE66D', fontWeight: '800', fontSize: 13 },

  // Standings mini
  standings: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
    justifyContent: 'center',
  },
  standRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  standRankEmoji: { fontSize: 15, width: 22 },
  standName: { color: 'rgba(255,255,255,0.55)', fontSize: 11, width: 70 },
  standBarWrap: { flex: 1, height: 7, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' },
  standBar: { height: '100%', borderRadius: 4 },
  standPct: { color: 'rgba(255,255,255,0.4)', fontSize: 10, width: 34, textAlign: 'right' },

  // Podium Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  podiumCard: {
    backgroundColor: '#0d1f00',
    borderRadius: 28,
    padding: 24,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.25)',
  },
  podiumTitle: { color: '#FFD700', fontSize: 22, fontWeight: '900', textAlign: 'center' },
  podiumSub: { color: 'rgba(255,255,255,0.45)', fontSize: 12 },
  podiumStage: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingBottom: 8,
  },
  podiumCol: { alignItems: 'center', gap: 4 },
  podiumHorse: { fontSize: 36 },
  podiumBox: {
    width: 90,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    gap: 3,
  },
  podium1st: { backgroundColor: 'rgba(255,215,0,0.2)', borderWidth: 1.5, borderColor: '#FFD700', height: 80, justifyContent: 'center' },
  podium2nd: { backgroundColor: 'rgba(192,192,192,0.15)', borderWidth: 1, borderColor: '#C0C0C0', height: 60, justifyContent: 'center' },
  podium3rd: { backgroundColor: 'rgba(205,127,50,0.12)', borderWidth: 1, borderColor: '#CD7F32', height: 48, justifyContent: 'center' },
  podiumBoxRank: { fontSize: 20 },
  podiumBoxName: { color: '#fff', fontSize: 10, fontWeight: '800', textAlign: 'center' },
  eliminatedTag: { color: '#FF4444', fontSize: 8, fontWeight: '700' },
  resultMsgBox: { alignItems: 'center', gap: 4, paddingVertical: 8, paddingHorizontal: 16, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 14, width: '100%' },
  resultMsgWin: { color: '#FFD700', fontSize: 20, fontWeight: '900' },
  resultMsgLose: { color: '#FF6B6B', fontSize: 18, fontWeight: '800' },
  resultMsgSub: { color: 'rgba(255,255,255,0.5)', fontSize: 12, textAlign: 'center' },
  podiumBtns: { flexDirection: 'row', gap: 10, width: '100%' },
  podiumBtnRetry: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  podiumBtnNext: {
    flex: 1,
    backgroundColor: '#22c55e',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  podiumBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});
