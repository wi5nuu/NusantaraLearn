import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';
import { ChatBubble } from '../../components/ChatBubble';
import { TypingIndicator } from '../../components/TypingIndicator';
import { useChat, Message } from '../../stores/useChat';
import {
  Language,
  LANGUAGE_LABELS,
  AI_RESPONSES,
  USER_QUESTION,
  QUICK_QUESTIONS,
  QUICK_ANSWERS,
} from '../../constants/responses';

const OnlineIndicator = () => {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1
    );
  }, []);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return <Animated.View style={[styles.onlineDot, style]} />;
};

export default function TutorScreen() {
  const { language, messages, isTyping, setLanguage, addMessage, setTyping } = useChat();
  const [inputText, setInputText] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const scrollRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  // Randomize questions on mount
  useEffect(() => {
    const shuffled = [...QUICK_QUESTIONS].sort(() => 0.5 - Math.random());
    setSuggestions(shuffled.slice(0, 5));
  }, []);

  // Initialize with a greeting
  useEffect(() => {
    if (messages.length === 0) {
      addMessage({
        id: 'init',
        role: 'ai',
        text: 'Halo! 👋 Saya Pak AI, guru virtual kamu. Ada yang ingin kamu pelajari hari ini?',
      });
    }
  }, []);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text.trim(),
    };
    addMessage(userMsg);
    setInputText('');
    setTyping(true);

    // AI Logic: Check if it's a quick question or use default response
    const quickAnswer = QUICK_ANSWERS[text.trim()];
    const responseText = quickAnswer || AI_RESPONSES[language];

    // Simulate AI response
    setTimeout(() => {
      setTyping(false);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: responseText,
      };
      addMessage(aiMsg);
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1200);
  };

  const LANGS = Object.keys(LANGUAGE_LABELS) as Language[];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerTitle}>
            <Text style={styles.headerTitleText}>🤖 Pak AI — Guru Virtual</Text>
            <View style={styles.statusRow}>
              <OnlineIndicator />
              <Text style={styles.statusText}>Online • Mode Offline Aktif</Text>
            </View>
          </View>
        </View>

        {/* Language Switch */}
        <View style={styles.langRow}>
          {LANGS.map((lang) => (
            <TouchableOpacity
              key={lang}
              style={[
                styles.langButton,
                language === lang && styles.langButtonActive,
              ]}
              onPress={() => setLanguage(lang)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.langButtonText,
                  language === lang && styles.langButtonTextActive,
                ]}
              >
                {LANGUAGE_LABELS[lang]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chat Messages */}
        <ScrollView
          ref={scrollRef}
          style={styles.chatArea}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
          {isTyping && <TypingIndicator />}
        </ScrollView>

        {/* Quick Questions Suggestions */}
        <View style={styles.quickSection}>
          <Text style={styles.quickLabel}>Coba tanya Pak AI:</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickScroll}
          >
            {suggestions.map((q, i) => (
              <TouchableOpacity
                key={i}
                style={styles.quickButton}
                onPress={() => sendMessage(q)}
                activeOpacity={0.8}
              >
                <Text style={styles.quickButtonText}>{q}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Input Area */}
        <View style={styles.inputArea}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ketik pertanyaanmu..."
            placeholderTextColor="rgba(255,255,255,0.3)"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={() => sendMessage(inputText || USER_QUESTION)}
            activeOpacity={0.85}
          >
            <Text style={styles.sendIcon}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.07)',
    gap: 12,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    color: Colors.textPrimary,
    fontSize: 16,
  },
  headerTitle: {
    flex: 1,
    gap: 3,
  },
  headerTitleText: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  statusText: {
    color: Colors.primary,
    fontSize: 11,
  },
  langRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  langButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
  },
  langButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  langButtonText: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
  langButtonTextActive: {
    color: '#fff',
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    paddingVertical: 16,
    gap: 12,
    flexGrow: 1,
  },
  quickSection: {
    paddingBottom: 12,
    gap: 8,
  },
  quickLabel: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 11,
    paddingHorizontal: 16,
    marginBottom: 2,
  },
  quickScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  quickButton: {
    backgroundColor: 'rgba(29,158,117,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(29,158,117,0.3)',
    borderRadius: 12,
    paddingVertical: 9,
    paddingHorizontal: 14,
  },
  quickButtonText: {
    color: Colors.primaryLight,
    fontSize: 12,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.07)',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.bgCard2,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: Colors.textPrimary,
    fontSize: 13,
    maxHeight: 80,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendIcon: {
    color: '#fff',
    fontSize: 16,
  },
});
