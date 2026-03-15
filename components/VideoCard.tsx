import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Colors } from '../constants/colors';
import { Video } from '../constants/subjects';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { router } from 'expo-router';

interface Props {
  video: Video;
  index: number;
}

export const VideoCard = ({ video, index }: Props) => {
  const thumbnailUrl = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;

  const handlePress = () => {
    router.push(`/video/${video.id}`);
  };

  return (
    <Animated.View entering={FadeInRight.duration(500).delay(index * 100)}>
      <TouchableOpacity 
        style={styles.card} 
        activeOpacity={0.8}
        onPress={handlePress}
      >
        <View style={styles.thumbnailContainer}>
          <Image 
            source={{ uri: thumbnailUrl }} 
            style={styles.thumbnail}
            resizeMode="cover"
          />
          <View style={styles.playOverlay}>
            <View style={styles.playButton}>
              <Text style={styles.playIcon}>▶</Text>
            </View>
          </View>
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{video.duration}</Text>
          </View>
        </View>
        <Text style={styles.title} numberOfLines={2}>{video.title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 200,
    marginRight: 16,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
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
