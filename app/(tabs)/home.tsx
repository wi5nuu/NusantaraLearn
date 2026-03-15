import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
  Linking,
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
import { NotificationModal } from '../../components/NotificationModal';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showNotif, setShowNotif] = useState(false);
  
  const { notifications, enabled: notifEnabled } = useNotifications();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredLessons = LESSON_CARDS.filter((lesson) => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          lesson.meta.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory ? lesson.categoryId === activeCategory : true;
    return matchesSearch && matchesCategory;
  });
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header Row */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>A</Text>
            </View>
            <View>
              <Text style={styles.greeting}>Selamat pagi,</Text>
              <Text style={styles.username}>Wisnu 👋</Text>
            </View>
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

        <NotificationModal 
          visible={showNotif} 
          onClose={() => setShowNotif(false)} 
        />

        {Platform.OS === 'web' && (
          <TouchableOpacity 
            style={styles.downloadApkBtn}
            activeOpacity={0.8}
            onPress={() => Linking.openURL('/assets/NusantaraLearn.apk')}
          >
            <Text style={styles.downloadApkText}>📲 Unduh APK Android</Text>
          </TouchableOpacity>
        )}

        <View style={styles.searchWrap}>
          <SearchBar onSearch={setSearchQuery} />
        </View>

        {/* Hero Card */}
        <HeroCard />

        {/* Daily Quest */}
        <DailyQuest />

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
          {VIDEOS.map((video, index) => (
            <VideoCard
              key={video.id}
              video={video}
              index={index}
            />
          ))}
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
              onPress={() => router.push(`/story/${book.id}`)}
            />
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
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
    paddingBottom: 32,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  searchWrap: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
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
  downloadApkBtn: {
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: 'rgba(29,158,117,0.1)',
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  downloadApkText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Sora_700Bold',
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
  }
});
