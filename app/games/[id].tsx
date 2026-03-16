import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import { GAMES, useGames } from '../../stores/useGames';
import { StarShooterGame } from '../../components/games/StarShooter';
import { RunnerGame } from '../../components/games/Runner';
import { RacerGame } from '../../components/games/Racer';
import { WordPuzzleGame } from '../../components/games/WordPuzzle';
import { ArcheryGame } from '../../components/games/Archery';
import { FrogJumpGame } from '../../components/games/FrogJump';
import { MemoryGame } from '../../components/games/MemoryGame';
import { WordSurfGame } from '../../components/games/WordSurf';

const { width: SW, height: SH } = Dimensions.get('window');

type GamePhase = 'lobby' | 'playing' | 'victory' | 'gameOver';

const GAME_COMPONENTS: Record<string, React.ComponentType<any>> = {
  'star-shooter': StarShooterGame,
  'runner': RunnerGame,
  'racer': RacerGame,
  'word-puzzle': WordPuzzleGame,
  'archery': ArcheryGame,
  'frog-jump': FrogJumpGame,
  'memory': MemoryGame,
  'word-surf': WordSurfGame,
};

const DIFF_LABELS: Record<string, string> = {
  'Mudah': '🟢 Mudah',
  'Sedang': '🟡 Sedang',
  'Sulit': '🔴 Sulit',
};

export default function GameScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const game = GAMES.find(g => g.id === id);
  const { getGameProgress, saveGameProgress, isLoaded, loadProgress } = useGames();

  const [phase, setPhase] = useState<GamePhase>('lobby');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [finalScore, setFinalScore] = useState(0);

  useEffect(() => {
    if (!isLoaded) loadProgress();
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded && game) {
      const prog = getGameProgress(game.id);
      setCurrentLevel(prog.currentLevel);
    }
  }, [isLoaded, game]);

  if (!game) {
    return (
      <View style={s.errorScreen}>
        <Text style={s.errorText}>Game tidak ditemukan!</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={s.errorBack}>← Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const GameComponent = GAME_COMPONENTS[game.id];
  const prog = getGameProgress(game.id);

  const handleGameOver = (score: number) => {
    setFinalScore(score);
    setPhase('gameOver');
  };

  const handleLevelComplete = async (score: number) => {
    const stars = score > currentLevel * 20 ? 3 : score > currentLevel * 10 ? 2 : 1;
    await saveGameProgress(game.id, currentLevel, score, stars);
    setFinalScore(score);
    setPhase('victory');
  };

  // ============ LOBBY ============
  if (phase === 'lobby') {
    return (
      <View style={s.screen}>
        {/* Gradient bg */}
        <LinearGradient
          colors={[game.gradient[0] + 'AA', game.gradient[1] + '33', Colors.bg] as any}
          style={StyleSheet.absoluteFillObject}
          locations={[0, 0.45, 1]}
        />

        <SafeAreaView style={s.safeArea} edges={['top', 'bottom']}>
          {/* Header */}
          <View style={s.header}>
            <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
              <Text style={s.backArrow}>←</Text>
            </TouchableOpacity>
            <Text style={s.headerLabel}>Arena Game</Text>
            <View style={s.headerSpacer} />
          </View>

          {/* Scrollable lobby content */}
          <ScrollView
            style={s.lobbyScroll}
            contentContainerStyle={s.lobbyContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Hero */}
            <Text style={s.lobbyEmoji}>{game.emoji}</Text>
            <Text style={s.lobbyTitle}>{game.title}</Text>
            <Text style={s.lobbyDesc}>{game.description}</Text>

            {/* Difficulty badge */}
            <View style={[s.diffBadge, { borderColor: game.color + '88' }]}>
              <Text style={[s.diffText, { color: game.color }]}>{DIFF_LABELS[game.difficulty]}</Text>
            </View>

            {/* Stats row */}
            <View style={s.statsRow}>
              <View style={s.statBox}>
                <Text style={[s.statVal, { color: game.color }]}>{prog.currentLevel}</Text>
                <Text style={s.statLbl}>Level Saat Ini</Text>
              </View>
              <View style={s.statBox}>
                <Text style={[s.statVal, { color: '#FFD700' }]}>{prog.highScore}</Text>
                <Text style={s.statLbl}>Skor Terbaik</Text>
              </View>
              <View style={s.statBox}>
                <Text style={[s.statVal, { color: Colors.primaryLight }]}>{game.totalLevels}</Text>
                <Text style={s.statLbl}>Total Level</Text>
              </View>
            </View>

            {/* Level picker label */}
            <Text style={s.levelPickerLabel}>Pilih Level:</Text>

            {/* Level grid */}
            <View style={s.levelGrid}>
              {Array.from({ length: game.totalLevels }, (_, i) => {
                const lvl = i + 1;
                const unlocked = lvl <= prog.unlockedLevels;
                const active = lvl === currentLevel;
                return (
                  <TouchableOpacity
                    key={lvl}
                    style={[
                      s.lvlBtn,
                      active && { backgroundColor: game.color, borderColor: game.color },
                      !unlocked && s.lvlLocked,
                    ]}
                    onPress={() => unlocked && setCurrentLevel(lvl)}
                    disabled={!unlocked}
                    activeOpacity={0.7}
                  >
                    <Text style={[s.lvlText, active && s.lvlTextActive]}>
                      {unlocked ? lvl : '🔒'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Tip box */}
            <View style={s.tipBox}>
              <Text style={s.tipText}>💡 Selesaikan level untuk membuka level berikutnya!</Text>
            </View>
          </ScrollView>

          {/* Fixed play button at bottom */}
          <View style={s.playBtnWrap}>
            <TouchableOpacity
              style={[s.playBtn, { backgroundColor: game.color }]}
              onPress={() => setPhase('playing')}
              activeOpacity={0.85}
            >
              <Text style={s.playBtnText}>▶ Mulai Level {currentLevel}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // ============ PLAYING ============
  if (phase === 'playing') {
    return (
      <View style={s.screen}>
        <View style={s.playingHeader}>
          <TouchableOpacity style={s.exitBtn} onPress={() => setPhase('lobby')}>
            <Text style={s.exitText}>✕</Text>
          </TouchableOpacity>
          <Text style={s.playingTitle}>{game.emoji} {game.title} — Level {currentLevel}</Text>
        </View>
        {GameComponent && (
          <GameComponent
            key={`${game.id}-${currentLevel}-${phase}`}
            level={currentLevel}
            onGameOver={handleGameOver}
            onLevelComplete={handleLevelComplete}
          />
        )}
      </View>
    );
  }

  // ============ VICTORY ============
  if (phase === 'victory') {
    const stars = finalScore > currentLevel * 20 ? '⭐⭐⭐' : finalScore > currentLevel * 10 ? '⭐⭐' : '⭐';
    const isLastLevel = currentLevel >= game.totalLevels;
    const nextProg = getGameProgress(game.id);

    return (
      <View style={s.screen}>
        <LinearGradient colors={['#052a20', '#0B1120']} style={StyleSheet.absoluteFillObject} />
        <SafeAreaView style={[s.safeArea, s.resultCenter]}>
          <Text style={s.resultEmoji}>🏆</Text>
          <Text style={[s.resultTitle, { color: '#FFD700' }]}>Level {currentLevel} Selesai!</Text>
          <Text style={s.resultScore}>Skor: {finalScore}</Text>
          <Text style={s.resultStars}>{stars}</Text>
          <View style={s.resultBtns}>
            <TouchableOpacity style={s.resultBtn} onPress={() => setPhase('playing')}>
              <Text style={s.resultBtnText}>🔁 Ulang</Text>
            </TouchableOpacity>
            {!isLastLevel ? (
              <TouchableOpacity
                style={[s.resultBtn, { backgroundColor: game.color + 'CC' }]}
                onPress={() => {
                  setCurrentLevel(l => l + 1);
                  setPhase('playing');
                }}
              >
                <Text style={s.resultBtnText}>Level {currentLevel + 1} →</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[s.resultBtn, { backgroundColor: '#FFD70099' }]}
                onPress={() => router.back()}
              >
                <Text style={s.resultBtnText}>🎉 Selesai!</Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={s.lobbyLink} onPress={() => setPhase('lobby')}>
            <Text style={s.lobbyLinkText}>← Pilih Level Lain</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
  }

  // ============ GAME OVER ============
  return (
    <View style={s.screen}>
      <LinearGradient colors={['#1a0000', '#0B1120']} style={StyleSheet.absoluteFillObject} />
      <SafeAreaView style={[s.safeArea, s.resultCenter]}>
        <Text style={s.resultEmoji}>💔</Text>
        <Text style={[s.resultTitle, { color: '#FF6B6B' }]}>Permainan Berakhir</Text>
        <Text style={s.resultScore}>Skor: {finalScore}</Text>
        <View style={s.resultBtns}>
          <TouchableOpacity style={s.resultBtn} onPress={() => setPhase('lobby')}>
            <Text style={s.resultBtnText}>← Pilih Level</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.resultBtn, { backgroundColor: game.color + 'BB' }]}
            onPress={() => setPhase('playing')}
          >
            <Text style={s.resultBtnText}>🔁 Coba Lagi</Text>
          </TouchableOpacity>
        </View>
        <Text style={s.tipText2}>💡 Tip: Coba latihan di level lebih rendah!</Text>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  safeArea: {
    flex: 1,
  },
  errorScreen: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  errorText: { color: Colors.textPrimary, fontSize: 18 },
  errorBack: { color: Colors.primary, fontSize: 15 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: { color: '#fff', fontSize: 18, fontWeight: '700' },
  headerLabel: { color: 'rgba(255,255,255,0.55)', fontSize: 14 },
  headerSpacer: { flex: 1 },

  // Lobby scroll
  lobbyScroll: { flex: 1 },
  lobbyContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
    alignItems: 'center',
    gap: 14,
  },
  lobbyEmoji: { fontSize: 72 },
  lobbyTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '900',
    fontFamily: 'Sora_700Bold',
    textAlign: 'center',
  },
  lobbyDesc: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: SW - 60,
  },
  diffBadge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  diffText: { fontSize: 13, fontWeight: '700' },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.12)',
    gap: 4,
  },
  statVal: {
    fontSize: 22,
    fontWeight: '900',
  },
  statLbl: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 10,
    textAlign: 'center',
  },

  // Level picker
  levelPickerLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    fontWeight: '700',
    alignSelf: 'flex-start',
    width: '100%',
  },
  levelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    width: '100%',
    justifyContent: 'flex-start',
  },
  lvlBtn: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  lvlLocked: { opacity: 0.35 },
  lvlText: {
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '800',
    fontSize: 15,
  },
  lvlTextActive: { color: '#fff' },

  // Tip
  tipBox: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 12,
    width: '100%',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  tipText: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 12,
    textAlign: 'center',
  },

  // Fixed play button
  playBtnWrap: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 10,
    backgroundColor: 'transparent',
  },
  playBtn: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: { boxShadow: '0 6px 20px rgba(0,0,0,0.35)' },
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
      android: { elevation: 8 },
    }),
  },
  playBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  // Playing header
  playingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 10,
  },
  exitBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,100,100,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitText: { color: '#FF6B6B', fontSize: 16, fontWeight: '800' },
  playingTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    flex: 1,
    textAlign: 'center',
  },

  // Result screens
  resultCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 28,
  },
  resultEmoji: { fontSize: 80 },
  resultTitle: { fontSize: 26, fontWeight: '900', textAlign: 'center' },
  resultScore: { color: 'rgba(255,255,255,0.7)', fontSize: 18, fontWeight: '700' },
  resultStars: { fontSize: 36, letterSpacing: 4 },
  resultBtns: { flexDirection: 'row', gap: 12, width: '100%' },
  resultBtn: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  resultBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  lobbyLink: { marginTop: 4 },
  lobbyLinkText: { color: 'rgba(255,255,255,0.4)', fontSize: 13 },
  tipText2: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
});
