import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Colors } from '../../constants/colors';
import { VIDEOS } from '../../constants/subjects';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const VIDEO_HEIGHT = (width * 9) / 16;

export default function VideoScreen() {
  const { id } = useLocalSearchParams();
  const video = VIDEOS.find((v) => v.id === id) || VIDEOS[0];

  // Simulation of an embedded player using a colored View for the prototype
  // In a real app, you'd use react-native-youtube-iframe or a WebView
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Menonton Video</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Mock Video Player */}
        <View style={styles.playerContainer}>
          {Platform.OS === 'web' ? (
             <iframe
                width="100%"
                height={VIDEO_HEIGHT}
                src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=0&rel=0`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ borderRadius: 0 }}
             />
          ) : (
            <View style={[styles.nativePlayerPlaceholder, { height: VIDEO_HEIGHT }]}>
               <Text style={styles.playIcon}>🎬</Text>
               <Text style={styles.placeholderText}>Memutar: {video.title}</Text>
               <Text style={styles.subtext}>(Gunakan WebView untuk video asli di Native)</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <Animated.View entering={FadeInUp.delay(200).duration(600)}>
            <Text style={styles.title}>{video.title}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Materi Terkait</Text>
            </View>
            <Text style={styles.description}>{video.description}</Text>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(400).duration(600)} 
            style={styles.materialsContainer}
          >
            {video.materials.map((item, idx) => (
              <View key={idx} style={styles.materialItem}>
                <View style={styles.dot} />
                <Text style={styles.materialText}>{item}</Text>
              </View>
            ))}
          </Animated.View>

          <View style={styles.spacer} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.quizButton}
          onPress={() => router.push(`/quiz/${video.id}`)}
        >
          <Text style={styles.quizButtonText}>Selesaikan Kuis & Dapatkan XP</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: Colors.bg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: Colors.textPrimary,
    fontSize: 20,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Sora_700Bold',
  },
  scroll: {
    flex: 1,
  },
  playerContainer: {
    backgroundColor: '#000',
    width: '100%',
  },
  nativePlayerPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
  },
  playIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  placeholderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  subtext: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    marginTop: 4,
  },
  content: {
    padding: 24,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Sora_700Bold',
    marginBottom: 12,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(29,158,117,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(29,158,117,0.2)',
  },
  badgeText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  description: {
    color: Colors.textMuted,
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 24,
  },
  materialsContainer: {
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  materialItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginTop: 8,
    marginRight: 12,
  },
  materialText: {
    flex: 1,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    lineHeight: 20,
  },
  spacer: {
    height: 100,
  },
  footer: {
    padding: 16,
    backgroundColor: Colors.bg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  quizButton: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  quizButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
});
