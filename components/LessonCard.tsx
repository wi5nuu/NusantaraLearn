import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Colors } from '../constants/colors';
import { LessonCard as LessonCardType } from '../constants/subjects';

interface Props {
  lesson: LessonCardType;
  onPress?: () => void;
}

export const LessonCard = ({ lesson, onPress }: Props) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.thumb, { backgroundColor: lesson.bgColor }]}>
        <Text style={styles.emoji}>{lesson.emoji}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {lesson.title}
        </Text>
        <Text style={styles.meta}>{lesson.meta}</Text>
        <View style={styles.badges}>
          {lesson.isFree && (
            <View style={styles.badgeGreen}>
              <Text style={styles.badgeGreenText}>Gratis</Text>
            </View>
          )}
          {lesson.isOffline && (
            <View style={styles.badgeBlue}>
              <Text style={styles.badgeBlueText}>Offline</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  emoji: {
    fontSize: 26,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  meta: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  badgeGreen: {
    backgroundColor: 'rgba(29,158,117,0.15)',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderWidth: 0.5,
    borderColor: 'rgba(29,158,117,0.4)',
  },
  badgeGreenText: {
    color: Colors.primaryLight,
    fontSize: 10,
    fontWeight: '600',
  },
  badgeBlue: {
    backgroundColor: 'rgba(55,138,221,0.15)',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderWidth: 0.5,
    borderColor: 'rgba(55,138,221,0.4)',
  },
  badgeBlueText: {
    color: Colors.blueLight,
    fontSize: 10,
    fontWeight: '600',
  },
});
