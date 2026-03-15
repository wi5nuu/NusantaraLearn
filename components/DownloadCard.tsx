import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '../constants/colors';
import { DownloadPackage, useDownload } from '../stores/useDownload';

interface Props {
  pkg: DownloadPackage;
}

export const DownloadCard = ({ pkg }: Props) => {
  const { startDownload, setProgress, finishDownload } = useDownload();
  const progressWidth = useSharedValue(pkg.status === 'installed' ? 1 : 0);

  useEffect(() => {
    progressWidth.value = pkg.progress;
  }, [pkg.progress]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%` as any,
  }));

  const handleDownload = () => {
    if (pkg.status === 'available') {
      startDownload(pkg.id);
      // Animate progress from 0 to 1 over 1.5s
      progressWidth.value = withTiming(1, { duration: 1500 }, (finished) => {
        if (finished) {
          finishDownload(pkg.id);
        }
      });
    } else if (pkg.status === 'installed' && pkg.fileName) {
      // In a real app, you would resolve the local URI. 
      // For this prototype, we'll alert the user and simulate opening.
      Alert.alert(
        'Buka Materi',
        `Membuka file: ${pkg.fileName}`,
        [
          { text: 'Batal', style: 'cancel' },
          { 
            text: 'Buka PDF', 
            onPress: () => {
              // Note: In Expo web dev, assets are served. 
              // This is a placeholder for the real open logic.
              console.log(`Opening: /assets/docs/${pkg.fileName}`);
            } 
          },
        ]
      );
    }
  };

  const isInstalled = pkg.status === 'installed';
  const isDownloading = pkg.status === 'downloading';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{pkg.title}</Text>
        <Text style={styles.size}>{pkg.size}</Text>
      </View>
      <Text style={styles.description}>{pkg.description}</Text>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <Animated.View
          style={[
            styles.progressFill,
            isInstalled ? styles.progressInstalled : styles.progressDownloading,
            progressStyle,
          ]}
        />
      </View>

      {/* Button */}
      <TouchableOpacity
        style={[
          styles.button,
          isInstalled ? styles.buttonInstalled : styles.buttonDownload,
        ]}
        onPress={handleDownload}
        disabled={isDownloading}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.buttonText,
            isInstalled ? styles.buttonTextInstalled : styles.buttonTextDownload,
          ]}
        >
          {isInstalled
            ? '👁 Lihat / Buka Materi'
            : isDownloading
            ? 'Mengunduh...'
            : '⬇ Unduh (PDF)'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  size: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  description: {
    color: Colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressInstalled: {
    backgroundColor: Colors.blue,
  },
  progressDownloading: {
    backgroundColor: Colors.primary,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  buttonInstalled: {
    backgroundColor: 'rgba(55,138,221,0.12)',
    borderColor: 'rgba(55,138,221,0.3)',
  },
  buttonDownload: {
    backgroundColor: 'rgba(29,158,117,0.15)',
    borderColor: 'rgba(29,158,117,0.3)',
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  buttonTextInstalled: {
    color: Colors.blueLight,
  },
  buttonTextDownload: {
    color: Colors.primaryLight,
  },
});
