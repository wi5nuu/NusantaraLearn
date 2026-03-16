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
  Dimensions,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
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
import { GlassHeader } from '../../components/GlassHeader';
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
import { initAI, askAI } from '../../services/AIEngine';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const { width } = Dimensions.get('window'); // Added for Dimensions

export default function TutorScreen() {
  const { language, messages, isTyping, setLanguage, addMessage, setTyping } = useChat();
  const [inputText, setInputText] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [aiReady, setAiReady] = useState(false);
  const [initProgress, setInitProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  // Initialize AI
  useEffect(() => {
    const startAI = async () => {
      if (Platform.OS !== 'web') {
        setError("AI hanya didukung di versi Web untuk saat ini. Gunakan HP dengan RAM besar (8GB+) untuk performa terbaik.");
        return;
      }
      try {
        await initAI((p) => setInitProgress(p));
        setAiReady(true);
      } catch (e: any) {
        console.error("AI Init Failed", e);
        setError(e.message || "Gagal menginisialisasi AI. Pastikan browser Anda mendukung WebGPU.");
      }
    };
    startAI();
  }, []);

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
        text: 'Halo! 👋 Saya Pak AI, guru virtual kamu. Kamu bisa tanya apa saja, misal tentang Matematika, Sejarah, atau Tata Surya. Ada yang ingin kamu pelajari hari ini?',
      });
    }
  }, []);

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping || !aiReady) return;

    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text.trim(),
    };
    addMessage(userMsg);
    setInputText('');
    setTyping(true);

    try {
      // Use real AI
      let reply = "";
      try {
        reply = await askAI(text.trim(), language, "Umum");
      } catch (aiError) {
        console.error("AI Inference Failed", aiError);
        // Fallback internally if inference fails
        const langData = AI_RESPONSES[language as keyof typeof AI_RESPONSES] || AI_RESPONSES['id'];
        reply = (langData as any)[text.trim().toLowerCase()] || "Maaf, Pak AI sedang istirahat. Coba tanya lagi nanti ya!";
      }
      
      setTyping(false);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: reply || AI_RESPONSES[language],
      };
      addMessage(aiMsg);
    } catch (e) {
      setTyping(false);
      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: "Maaf, Pak AI sedang berpikir keras. Coba lagi ya!",
      });
    }

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const LANGS = Object.keys(LANGUAGE_LABELS) as Language[];

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate listening...
      setTimeout(() => {
        setIsListening(false);
        setInputText('Halo Pak AI, saya ingin belajar tentang kebudayaan Jawa.');
      }, 2000);
    }
  };

  return (
    <View style={styles.safeArea}>
      <GlassHeader 
        title="Pak AI — Guru Virtual 🤖" 
        onBack={() => router.back()}
        rightElement={
          <View style={styles.headerRight}>
            <OnlineIndicator />
            <Text style={styles.statusText}>Online</Text>
          </View>
        }
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >

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
              <Pressable
                key={i}
                style={({ pressed }) => [
                  styles.quickButton,
                  pressed && { opacity: 0.7 }
                ]}
                onPress={() => handleSend(q)}
              >
                <Text style={styles.quickButtonText}>{q}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Input Area */}
        <View style={styles.inputArea}>
          <TouchableOpacity 
            style={[styles.micButton, isListening && styles.micButtonActive]} 
            onPress={toggleListening}
            activeOpacity={0.7}
          >
            <Text style={styles.micEmoji}>{isListening ? '🛑' : '🎤'}</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder={!aiReady ? "Pak AI sedang bersiap..." : (isListening ? "Mendengarkan..." : "Tanya sesuatu...")}
            placeholderTextColor={Colors.textHint}
            value={inputText}
            onChangeText={setInputText}
            multiline
            editable={aiReady}
          />
          <Pressable 
            style={({ pressed }) => [
              styles.sendButton, 
              (!inputText.trim() || isTyping || !aiReady) && styles.sendButtonDisabled,
              pressed && { opacity: 0.8 }
            ]} 
            onPress={() => {
              handleSend(inputText);
            }}
            disabled={!inputText.trim() || isTyping || !aiReady}
          >
            <Text style={styles.sendIcon}>→</Text>
          </Pressable>
        </View>

        {/* AI Loading Overlay */}
        {!aiReady && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingBox}>
              <Text style={styles.loadingEmoji}>{error ? '⚠️' : '🤖'}</Text>
              <Text style={styles.loadingTitle}>
                {error ? 'Waduh, Ada Kendala!' : 'Pak AI sedang bersiap...'}
              </Text>
              
              {!error ? (
                <>
                  <View style={styles.loadingBarContainer}>
                    <View style={[styles.loadingBar, { width: `${initProgress}%` }]} />
                  </View>
                  <Text style={styles.loadingProgress}>{initProgress}%</Text>
                  <Text style={styles.loadingSub}>Sedang mengunduh otak Pak AI (Phi-2)</Text>
                </>
              ) : (
                <Text style={styles.errorText}>{error}</Text>
              )}

              <TouchableOpacity 
                style={[styles.skipButton, error && styles.skipButtonError]} 
                onPress={() => setAiReady(true)}
              >
                <Text style={styles.skipButtonText}>
                  {error ? 'Gunakan Mode Hemat (Offline)' : 'Lewati & Gunakan Mode Hemat'}
                </Text>
              </TouchableOpacity>
              
              {!error && (
                <Text style={styles.loadingHint}>
                  Ini hanya dilakukan sekali. Butuh koneksi internet & WebGPU.
                </Text>
              )}
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  langRow: {
    paddingTop: 110, // Space for GlassHeader
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
    alignItems: 'center',
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    backgroundColor: Colors.bg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 8,
    zIndex: 100,
  },
  micButton: { // Added micButton style
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Platform.select({
      web: { cursor: 'pointer' }
    }),
  },
  micButtonActive: { // Added micButtonActive style
    backgroundColor: 'rgba(255,77,77,0.15)',
    borderColor: '#ff4d4d',
  },
  micEmoji: { // Added micEmoji style
    fontSize: 20,
  },
  input: { // Updated input style
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    backgroundColor: Colors.bgCard, // Changed from Colors.bgCard2
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    color: Colors.textPrimary,
    fontSize: 14,
    borderWidth: 1,
    borderColor: Colors.border, // Changed from Colors.borderLight
  },
  sendButton: { // Updated sendButton style
    width: 44, // Changed from 40
    height: 44, // Changed from 40
    borderRadius: 22, // Changed from 12
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: { cursor: 'pointer' }
    }),
  },
  sendButtonDisabled: { // Added sendButtonDisabled style
    opacity: 0.5,
  },
  sendIcon: {
    color: '#fff',
    fontSize: 16,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(11, 17, 32, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    zIndex: 1000,
  },
  loadingBox: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  loadingEmoji: {
    fontSize: 64,
  },
  loadingTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  loadingBarContainer: {
    width: '100%',
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  loadingBar: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  loadingProgress: {
    color: Colors.primary,
    fontWeight: '800',
    fontSize: 24,
  },
  loadingSub: {
    color: Colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
    backgroundColor: 'rgba(255,77,77,0.1)',
    padding: 12,
    borderRadius: 12,
  },
  skipButton: {
    marginTop: 10,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  skipButtonError: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  skipButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  loadingHint: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 11,
    marginTop: 8,
    textAlign: 'center',
  }
});
