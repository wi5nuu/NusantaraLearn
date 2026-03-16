import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, Pressable } from 'react-native';
import { Colors } from '../constants/colors';
import { Video } from '../constants/subjects';
import { MotiView } from 'moti';
import { router, Link } from 'expo-router';

interface Props {
  video: Video;
  index: number;
}

export const VideoCard = ({ video, index }: Props) => {
  // Using i.ytimg.com as it's often more reliable for web
  const thumbnailUrl = `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`;
  const href = `/video/${video.id}`;

  const renderContent = () => (
    <View style={styles.cardContainer}>
      <View style={styles.thumbnailContainer}>
        {Platform.OS === 'web' ? (
          <img 
            src={thumbnailUrl} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            alt={video.title}
          />
        ) : (
          <Image
            source={{ uri: thumbnailUrl }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        )}
        <View style={styles.playOverlay}>
          <View style={styles.playButton}>
            <Text style={styles.playIcon}>▶</Text>
          </View>
        </View>
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{video.duration}</Text>
        </View>
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {video.title}
      </Text>
    </View>
  );

  if (Platform.OS === 'web') {
    return (
      <Link href={href as any} asChild>
        <Pressable style={styles.webWrapper}>
          {renderContent()}
        </Pressable>
      </Link>
    );
  }

  return (
    <MotiView
      from={{ opacity: 0, translateX: 50 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: 'spring', damping: 20, delay: index * 100 }}
      style={styles.card}
    >
      <Link href={href as any} asChild>
        <TouchableOpacity activeOpacity={0.8}>
          {renderContent()}
        </TouchableOpacity>
      </Link>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  webWrapper: {
    width: 200,
    marginRight: 16,
    zIndex: 10,
    cursor: 'pointer',
  },
  card: {
    width: 200,
    marginRight: 16,
  },
  cardContainer: {
    width: '100%',
    ...Platform.select({
      web: { cursor: 'pointer' }
    }),
  },
  thumbnailContainer: {
    width: 200,
    height: 112,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.bgCard,
    marginBottom: 10,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0px 4px 8px rgba(0,0,0,0.3)',
      }
    }),
  },
  playIcon: {
    color: '#E24B4A',
    fontSize: 16,
    marginLeft: 2, // nudge for optical center
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Sora_700Bold',
    lineHeight: 20,
  },
});
