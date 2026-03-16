import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
  Linking,
  Image,
  Modal,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';
import { HeroCard } from '../../components/HeroCard';
import { LessonCard } from '../../components/LessonCard';
import { SubjectChip } from '../../components/SubjectChip';
import { SearchBar } from '../../components/SearchBar';
import { DailyQuest } from '../../components/DailyQuest';
import { BookCard } from '../../components/BookCard';
import { VideoCard } from '../../components/VideoCard';
import { SUBJECTS, LESSON_CARDS, BOOKS, VIDEOS, LessonCard as LessonCardType } from '../../constants/subjects';
import { useNotifications } from '../../stores/useNotifications';
import { useNotifications as useNotifStore } from '../../stores/useNotifications';
import { useUser } from '../../stores/useUser';
import { useStreak } from '../../stores/useStreak';
import { XPProgress } from '../../components/XPProgress';
import { NotificationModal } from '../../components/NotificationModal';
import { GlassHeader } from '../../components/GlassHeader';
import storiesData from '../../data/stories.json';
import { GAMES, useGames } from '../../stores/useGames';
import Animated, { useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CLUB_TIPS = [
  { id: '1', name: 'Siti', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti', tip: 'Coba tanya AI Tutor kalau bingung Matematika!', emoji: '💡' },
  { id: '2', name: 'Budi', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi', tip: 'Dengarkan materi sebelum kuis ya biar nilai 100.', emoji: '🎧' },
  { id: '3', name: 'Rani', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rani', tip: 'Jangan lupa cek peringkatmu setiap hari!', emoji: '🏆' },
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showNotif, setShowNotif] = useState(false);
  const [selectedStory, setSelectedStory] = useState<any>(null);
  const [greeting, setGreeting] = useState('');
  
  const { notifications, enabled: notifEnabled } = useNotifications();
  const { name, xp, streak, loadProfile } = useUser();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    loadProfile();
    updateGreeting();
  }, []);

  const updateGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) setGreeting('Selamat Pagi');
    else if (hour < 15) setGreeting('Selamat Siang');
    else if (hour < 18) setGreeting('Selamat Sore');
    else setGreeting('Selamat Malam');
  };

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withRepeat(withSequence(withTiming(1.2, { duration: 1000 }), withTiming(1, { duration: 1000 })), -1, true) }
    ],
    opacity: withRepeat(withSequence(withTiming(1, { duration: 1000 }), withTiming(0.7, { duration: 1000 })), -1, true)
  }));

  const filteredLessons = LESSON_CARDS.filter((lesson) => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          lesson.meta.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory ? lesson.categoryId === activeCategory : true;
    return matchesSearch && matchesCategory;
  });
  return (
    <View style={styles.safeArea}>
      <GlassHeader 
        title={`${greeting}, ${name || 'Teman'} 👋`}
        rightElement={
          <View style={styles.headerRight}>
            <View style={styles.streakBadge}>
              <Animated.Text style={[styles.streakEmoji, pulseStyle]}>🔥</Animated.Text>
              <Text style={styles.streakText}>{streak}</Text>
            </View>
            <TouchableOpacity 
              style={styles.bellButton}
              onPress={() => setShowNotif(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.bellEmoji}>🔔</Text>
              {notifEnabled && unreadCount > 0 && (
                <View style={styles.badge} />
              )}
            </TouchableOpacity>
          </View>
        }
      />
      
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <XPProgress xp={xp} levelThreshold={1000} />

        <NotificationModal 
          visible={showNotif} 
          onClose={() => setShowNotif(false)} 
        />

        <View style={styles.searchWrap}>
          <SearchBar onSearch={setSearchQuery} />
        </View>

        {/* Stories Section */}
        <View style={styles.storiesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storiesScroll}
          >
            {storiesData.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.storyWrap}
                onPress={() => setSelectedStory(item)}
              >
                <View style={[styles.storyCircle, { borderColor: item.color }]}>
                  <View style={[styles.storyContent, { backgroundColor: item.color + '20' }]}>
                    <Text style={styles.storyEmoji}>{item.emoji}</Text>
                  </View>
                </View>
                <Text style={styles.storyTitle} numberOfLines={1}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Hero Card */}
        <HeroCard />

        {/* Daily Quest */}
        <DailyQuest />

        {/* Student Club Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Klub Pelajar 💬</Text>
          <TouchableOpacity activeOpacity={0.6}>
            <Text style={styles.seeAll}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.clubScroll}
        >
          {CLUB_TIPS.map((item) => (
            <TouchableOpacity key={item.id} style={styles.clubCard} activeOpacity={0.8}>
              <View style={styles.clubHeader}>
                <Image source={{ uri: item.avatar }} style={styles.clubAvatar} />
                <Text style={styles.clubName}>{item.name}</Text>
              </View>
              <Text style={styles.clubTip} numberOfLines={2}>
                <Text style={{ fontSize: 16 }}>{item.emoji}</Text> {item.tip}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Subject Chips */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mata Pelajaran</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipScrollContent}
        >
          {SUBJECTS.map((subject) => (
            <SubjectChip
              key={subject.id}
              subject={subject}
              isActive={activeCategory === subject.id}
              onPress={() => setActiveCategory(activeCategory === subject.id ? null : subject.id)}
            />
          ))}
        </ScrollView>

        {/* Video Section */}
        <View style={[styles.sectionHeader, styles.libraryHeader]}>
          <Text style={styles.sectionTitle}>Video Pembelajaran</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.bookScrollContent}
        >
          {VIDEOS && VIDEOS.length > 0 ? (
            VIDEOS.map((video, index) => (
              <VideoCard
                key={video.id}
                video={video}
                index={index}
              />
            ))
          ) : (
             <Text style={{ color: Colors.textMuted, marginLeft: 20 }}>Video belum tersedia</Text>
          )}
        </ScrollView>

        {/* Lesson Cards */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pelajaran Untukmu</Text>
        </View>
        <View style={styles.lessonList}>
          {filteredLessons.length > 0 ? (
            filteredLessons.map((lesson: LessonCardType) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                href={`/lesson/${lesson.id}`}
                onPress={() => router.push(`/lesson/${lesson.id}`)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyText}>Materi tidak ditemukan</Text>
              <TouchableOpacity onPress={() => { setSearchQuery(''); setActiveCategory(null); }}>
                <Text style={styles.emptyAction}>Reset Filter</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Library Section */}
        <View style={[styles.sectionHeader, styles.libraryHeader]}>
          <Text style={styles.sectionTitle}>Buku Cerita & Dongeng</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.bookScrollContent}
        >
          {BOOKS.map((book, index) => (
            <BookCard
              key={book.id}
              book={book}
              index={index}
              href={`/story/${book.id}`}
              onPress={() => router.push(`/story/${book.id}`)}
            />
          ))}
        </ScrollView>

        {/* Story Modal */}
        <Modal
          visible={!!selectedStory}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedStory(null)}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity 
              style={styles.modalCloseArea} 
              onPress={() => setSelectedStory(null)} 
            />
            <View style={[styles.storyCardModal, { borderTopColor: selectedStory?.color || Colors.primary }]}>
              <View style={styles.storyModalHeader}>
                <Text style={styles.storyModalLabel}>{selectedStory?.title}</Text>
                <TouchableOpacity onPress={() => setSelectedStory(null)}>
                  <Text style={styles.closeBtn}>✕</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.storyModalBody}>
                <Text style={styles.storyModalEmoji}>{selectedStory?.emoji}</Text>
                <Text style={styles.storyModalText}>{selectedStory?.content}</Text>
              </View>
              <TouchableOpacity 
                style={[styles.storyGotIt, { backgroundColor: selectedStory?.color || Colors.primary }]}
                onPress={() => setSelectedStory(null)}
              >
                <Text style={styles.storyGotItText}>Keren! 🙌</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* ============ GAMES HUB SECTION ============ */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Arena Game 🎮</Text>
            <Text style={styles.sectionSubtitle}>8 mini-game seru menunggumu!</Text>
          </View>
          <TouchableOpacity
            style={styles.seeAllBtn}
            onPress={() => router.push('/games')}
            activeOpacity={0.7}
          >
            <Text style={styles.seeAll}>Buka Arena →</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.gamesScroll}
        >
          {GAMES.map((game, i) => (
            <TouchableOpacity
              key={game.id}
              style={[styles.gameCard, { borderColor: game.color + '55' }]}
              onPress={() => router.push({ pathname: '/games/[id]', params: { id: game.id } })}
              activeOpacity={0.8}
            >
              <View style={[styles.gameIconWrap, { backgroundColor: game.color + '22' }]}>
                <Text style={styles.gameIcon}>{game.emoji}</Text>
              </View>
              <Text style={styles.gameTitle}>{game.title}</Text>
              <View style={[styles.gameDiff, { backgroundColor: game.color + '22' }]}>
                <Text style={[styles.gameDiffText, { color: game.color }]}>{game.totalLevels} Lv</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingTop: 120, // Space for GlassHeader
    paddingBottom: 100, // Account for absolute tab bar
    gap: 16,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,165,0,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,165,0,0.3)',
    gap: 4,
  },
  streakEmoji: {
    fontSize: 14,
  },
  streakText: {
    color: '#FFA500',
    fontSize: 13,
    fontWeight: '800',
  },
  avatarWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  greeting: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  username: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  bellButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 0.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellEmoji: {
    fontSize: 16,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff4d4d',
    borderWidth: 1.5,
    borderColor: Colors.bg,
  },
  storiesContainer: {
    marginBottom: 8,
  },
  storiesScroll: {
    paddingHorizontal: 20,
    gap: 16,
  },
  storyWrap: {
    alignItems: 'center',
    gap: 6,
    width: 70,
  },
  storyCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    padding: 3,
    borderStyle: 'dashed',
  },
  storyContent: {
    flex: 1,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyEmoji: {
    fontSize: 24,
  },
  storyTitle: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCloseArea: {
    ...StyleSheet.absoluteFillObject,
  },
  storyCardModal: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: Colors.bgCard,
    borderRadius: 24,
    padding: 24,
    borderTopWidth: 6,
    gap: 20,
  },
  storyModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storyModalLabel: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  closeBtn: {
    color: Colors.textMuted,
    fontSize: 20,
  },
  storyModalBody: {
    alignItems: 'center',
    gap: 16,
  },
  storyModalEmoji: {
    fontSize: 64,
  },
  storyModalText: {
    color: Colors.textPrimary,
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '600',
    fontFamily: 'Sora_600SemiBold',
  },
  storyGotIt: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  storyGotItText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
  clubScroll: {
    paddingLeft: 20,
    paddingRight: 8,
    paddingBottom: 24,
    marginTop: 12,
  },
  clubCard: {
    width: 180,
    backgroundColor: Colors.bgMid,
    padding: 14,
    borderRadius: 18,
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
      }
    }),
  },
  clubHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  clubAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  clubName: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Sora_700Bold',
  },
  clubTip: {
    color: Colors.textPrimary,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  chipScrollContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  searchWrap: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  lessonList: {
    paddingHorizontal: 20,
    gap: 10,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 14,
    marginBottom: 12,
  },
  emptyAction: {
    color: Colors.primaryLight,
    fontWeight: '700',
  },
  libraryHeader: {
    marginTop: 10,
  },
  seeAll: {
    color: Colors.primaryLight,
    fontSize: 12,
    fontWeight: '600',
  },
  bookScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    minHeight: 180,
  },
  sectionSubtitle: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  seeAllBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  gamesScroll: {
    paddingHorizontal: 20,
    gap: 12,
    paddingVertical: 4,
    paddingBottom: 16,
  },
  gameCard: {
    width: 120,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 18,
    padding: 14,
    gap: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  gameIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameIcon: {
    fontSize: 30,
  },
  gameTitle: {
    color: Colors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  gameDiff: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  gameDiffText: {
    fontSize: 10,
    fontWeight: '800',
  },
});
