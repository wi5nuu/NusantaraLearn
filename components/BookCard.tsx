import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from '../constants/colors';
import { Book } from '../constants/subjects';
import Animated, { FadeInRight } from 'react-native-reanimated';

interface Props {
  book: Book;
  index: number;
  onPress?: () => void;
}

export const BookCard = ({ book, index, onPress }: Props) => {
  return (
    <Animated.View entering={FadeInRight.duration(500).delay(index * 100)}>
      <TouchableOpacity 
        style={styles.card} 
        activeOpacity={0.8}
        onPress={onPress}
      >
        <View style={[styles.cover, { backgroundColor: book.coverColor }]}>
          <Text style={styles.coverEmoji}>{book.emoji}</Text>
          <View style={styles.spineEffect} />
        </View>
        <Text style={styles.title} numberOfLines={2}>{book.title}</Text>
        <Text style={styles.author} numberOfLines={1}>{book.author}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 120,
    marginRight: 16,
  },
  cover: {
    width: 120,
    height: 160,
    borderRadius: 8,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  spineEffect: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 12,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  coverEmoji: {
    fontSize: 50,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Sora_700Bold',
    marginBottom: 4,
    lineHeight: 18,
  },
  author: {
    color: Colors.textMuted,
    fontSize: 11,
  }
});
