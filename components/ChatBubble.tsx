import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Colors } from '../constants/colors';
import { Message } from '../stores/useChat';

interface Props {
  message: Message;
}

export const ChatBubble = ({ message }: Props) => {
  const isAI = message.role === 'ai';

  return (
    <Animated.View
      entering={FadeInUp.duration(300)}
      style={[styles.container, isAI ? styles.aiRow : styles.userRow]}
    >
      {isAI && (
        <View style={styles.aiAvatar}>
          <Text style={styles.avatarText}>AI</Text>
        </View>
      )}
      <View
        style={[
          styles.bubble,
          isAI ? styles.aiBubble : styles.userBubble,
        ]}
      >
        <Text style={[styles.text, isAI ? styles.aiText : styles.userText]}>
          {message.text}
        </Text>
      </View>
      {!isAI && (
        <View style={styles.userAvatar}>
          <Text style={styles.avatarText}>A</Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 20,
  },
  aiRow: {
    justifyContent: 'flex-start',
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  aiAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  userAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(55,138,221,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  aiBubble: {
    backgroundColor: Colors.bgCard2,
    borderRadius: 16,
    borderTopLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    borderTopRightRadius: 4,
  },
  text: {
    fontSize: 13,
    lineHeight: 20.8,
  },
  aiText: {
    color: Colors.textPrimary,
  },
  userText: {
    color: '#fff',
  },
});
