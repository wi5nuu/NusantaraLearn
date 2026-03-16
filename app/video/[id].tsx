import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useLocalSearchParams, router } from 'expo-router';
import { Colors } from '../../constants/colors';
import { VIDEOS } from '../../constants/subjects';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function VideoScreen() {
  const { id } = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const VIDEO_HEIGHT = width > 600 ? 400 : (width * 9) / 16;
  
  const video = VIDEOS.find((v) => v.id === id) || VIDEOS[0];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <View style={{ width: 40 }} />
        <Text style={styles.headerTitle} numberOfLines={1}>Menonton Video</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Mock Video Player */}
        <View style={[styles.playerContainer, { height: VIDEO_HEIGHT || 250 }]}>
          {Platform.OS === 'web' ? (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0&autoplay=0&enablejsapi=1&origin=${Platform.OS === 'web' && typeof window !== 'undefined' ? window.location.origin : ''}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{ borderRadius: 0, border: 'none' }}
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
          {Platform.OS === 'web' ? (
            <View>
              <Text style={styles.title}>{video.title}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Materi Terkait</Text>
              </View>
              <Text style={styles.description}>{video.description}</Text>
            </View>
          ) : (
            <Animated.View entering={FadeInUp.delay(200).duration(600)}>
              <Text style={styles.title}>{video.title}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Materi Terkait</Text>
              </View>
              <Text style={styles.description}>{video.description}</Text>
            </Animated.View>
          )}

          {Platform.OS === 'web' ? (
            <View style={styles.materialsContainer}>
              {video.materials.map((item, idx) => (
                <View key={idx} style={styles.materialItem}>
                  <View style={styles.dot} />
                  <Text style={styles.materialText}>{item}</Text>
                </View>
              ))}
            </View>
          ) : (
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
          )}

          <View style={styles.spacer} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerButtons}>
          <Link href="/home" asChild>
            <Pressable 
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && { opacity: 0.7 }
              ]}
            >
              <Text style={styles.secondaryButtonText}>Kembali</Text>
            </Pressable>
          </Link>
          <Link href={`/quiz/${video.id}`} asChild>
            <Pressable 
              style={({ pressed }) => [
                styles.quizButton,
                pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }
              ]}
            >
              <Text style={styles.quizButtonText}>Mulai Kuis</Text>
            </Pressable>
          </Link>
        </View>
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
    zIndex: 10,
    ...Platform.select({
      web: { cursor: 'pointer' }
    }),
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
  footerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    zIndex: 20,
    ...Platform.select({
      web: { cursor: 'pointer' }
    }),
  },
  secondaryButtonText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  quizButton: {
    flex: 2,
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    ...Platform.select({
      web: { cursor: 'pointer' }
    }),
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: `0px 4px 8px ${Colors.primary}4D`,
      }
    }),
  },
  quizButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
});
