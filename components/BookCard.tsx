import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Link } from 'expo-router';
import { Colors } from '../constants/colors';
import { Book } from '../constants/subjects';
import { MotiView } from 'moti';

interface Props {
  book: Book;
  index: number;
  onPress?: () => void;
  href?: string;
}

export const BookCard = ({ book, index, onPress, href }: Props) => {
  const CardContent = (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.cover, { backgroundColor: book.coverColor }]}>
        <Text style={styles.coverEmoji}>{book.emoji}</Text>
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {book.title}
      </Text>
      <Text style={styles.author}>{book.author}</Text>
    </TouchableOpacity>
  );

  const WrappedContent = (
    <MotiView
      from={{ opacity: 0, translateX: 50 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: 'spring', damping: 20, delay: index * 100 }}
      style={styles.card}
    >
      {href ? (
        <Link href={href as any} asChild>
          {CardContent}
        </Link>
      ) : CardContent}
    </MotiView>
  );

  return WrappedContent;
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
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '4px 4px 8px rgba(0,0,0,0.3)',
      }
    }),
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
