import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { GAMES, useGames } from '../../stores/useGames';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';

const { width: SW } = Dimensions.get('window');
const CARD_W = (SW - 48) / 2;

const DIFF_COLORS: Record<string, string> = {
  'Mudah': '#22c55e',
  'Sedang': '#f59e0b',
  'Sulit': '#ef4444',
};

export default function GamesHubScreen() {
  const { loadProgress, getGameProgress } = useGames();

  useEffect(() => {
    loadProgress();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Arena Game 🎮</Text>
          <Text style={styles.headerSub}>8 Mini-Games Seru!</Text>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>BETA</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        {Platform.OS !== 'web' ? (
          <Animated.View entering={FadeIn.duration(600).delay(100)}>
            <LinearGradient
              colors={['rgba(29,158,117,0.3)', 'rgba(29,158,117,0.05)']}
              style={styles.banner}
            >
              <Text style={styles.bannerEmoji}>🏆</Text>
              <View>
                <Text style={styles.bannerTitle}>Mainkan & Kumpulkan Bintang!</Text>
                <Text style={styles.bannerSub}>Setiap game punya 10–15 level seru</Text>
              </View>
            </LinearGradient>
          </Animated.View>
        ) : (
          <LinearGradient
            colors={['rgba(29,158,117,0.3)', 'rgba(29,158,117,0.05)']}
            style={styles.banner}
          >
            <Text style={styles.bannerEmoji}>🏆</Text>
            <View>
              <Text style={styles.bannerTitle}>Mainkan & Kumpulkan Bintang!</Text>
              <Text style={styles.bannerSub}>Setiap game punya 10–15 level seru</Text>
            </View>
          </LinearGradient>
        )}

        {/* Games Grid */}
        <View style={styles.grid}>
          {GAMES.map((game, i) => {
            const progress = getGameProgress(game.id);
            const starsTotal = game.totalLevels * 3;
            const pct = Math.round((progress.totalStars / starsTotal) * 100);

            return Platform.OS !== 'web' ? (
              <Animated.View key={game.id} entering={FadeInUp.duration(500).delay(i * 60)} style={styles.cardWrap}>
                <GameCard game={game} progress={progress} pct={pct} />
              </Animated.View>
            ) : (
              <View key={game.id} style={styles.cardWrap}>
                <GameCard game={game} progress={progress} pct={pct} />
              </View>
            );
          })}
        </View>

        {/* Tips section */}
        <View style={styles.tipsBox}>
          <Text style={styles.tipsTitle}>💡 Tips</Text>
          <Text style={styles.tipsText}>• Selesaikan setiap level untuk membuka level berikutnya</Text>
          <Text style={styles.tipsText}>• Kumpulkan ⭐ terbanyak untuk naik ke level lebih sulit</Text>
          <Text style={styles.tipsText}>• Progresmu tersimpan otomatis!</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function GameCard({ game, progress, pct }: { game: typeof GAMES[0]; progress: any; pct: number }) {
  return (
    <TouchableOpacity
      style={[styles.card, { borderColor: game.color + '44' }]}
      onPress={() => router.push({ pathname: '/games/[id]', params: { id: game.id } })}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[game.gradient[0] + '22', game.gradient[1] + '11']}
        style={styles.cardGradient}
      >
        <Text style={styles.cardEmoji}>{game.emoji}</Text>
        <Text style={styles.cardTitle}>{game.title}</Text>
        <Text style={styles.cardDesc} numberOfLines={2}>{game.description}</Text>

        {/* Difficulty badge */}
        <View style={[styles.diffBadge, { backgroundColor: DIFF_COLORS[game.difficulty] + '22', borderColor: DIFF_COLORS[game.difficulty] + '55' }]}>
          <Text style={[styles.diffText, { color: DIFF_COLORS[game.difficulty] }]}>{game.difficulty}</Text>
        </View>

        {/* Progress */}
        <View style={styles.cardProgress}>
          <View style={styles.levelRow}>
            <Text style={styles.levelText}>Lv {progress.currentLevel}/{game.totalLevels}</Text>
            <Text style={styles.starsText}>⭐ {progress.totalStars}</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressBar, { width: `${pct}%` as any, backgroundColor: game.color }]} />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: { color: Colors.textPrimary, fontSize: 18, fontWeight: '700' },
  headerTitle: { color: Colors.textPrimary, fontSize: 18, fontWeight: '800', fontFamily: 'Sora_700Bold' },
  headerSub: { color: Colors.textMuted, fontSize: 12 },
  headerBadge: { marginLeft: 'auto', backgroundColor: 'rgba(29,158,117,0.2)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  headerBadgeText: { color: Colors.primaryLight, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 16, paddingBottom: 32 },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(29,158,117,0.3)',
  },
  bannerEmoji: { fontSize: 40 },
  bannerTitle: { color: Colors.textPrimary, fontWeight: '800', fontSize: 15, fontFamily: 'Sora_700Bold' },
  bannerSub: { color: Colors.textMuted, fontSize: 12, marginTop: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  cardWrap: { width: CARD_W },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
  },
  cardGradient: { padding: 16, gap: 8 },
  cardEmoji: { fontSize: 36, marginBottom: 4 },
  cardTitle: { color: Colors.textPrimary, fontSize: 14, fontWeight: '800', fontFamily: 'Sora_700Bold' },
  cardDesc: { color: Colors.textMuted, fontSize: 11, lineHeight: 16 },
  diffBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginTop: 4, borderWidth: 1 },
  diffText: { fontSize: 10, fontWeight: '700' },
  cardProgress: { gap: 4, marginTop: 8 },
  levelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  levelText: { color: Colors.textMuted, fontSize: 10, fontWeight: '700' },
  starsText: { color: '#FFD700', fontSize: 10, fontWeight: '700' },
  progressTrack: { height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' },
  progressBar: { height: '100%', borderRadius: 2 },
  tipsBox: { backgroundColor: Colors.bgCard, borderRadius: 16, padding: 16, gap: 6, borderWidth: 0.5, borderColor: Colors.border },
  tipsTitle: { color: Colors.textPrimary, fontWeight: '800', fontSize: 14, marginBottom: 4 },
  tipsText: { color: Colors.textMuted, fontSize: 12, lineHeight: 18 },
});
