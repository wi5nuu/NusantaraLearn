import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';

interface GlassHeaderProps {
  title: string;
  onBack?: () => void;
  rightElement?: React.ReactNode;
}

/**
 * GlassHeader [LUXURY EDITION]
 * A reusable premium header with Glassmorphism (expo-blur).
 */
export const GlassHeader: React.FC<GlassHeaderProps> = ({ title, onBack, rightElement }) => {
  return (
    <View style={styles.container}>
      <BlurView 
        intensity={Platform.OS === 'ios' ? 80 : 100} 
        tint="dark" 
        style={StyleSheet.absoluteFill} 
      />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.left}>
            {onBack && (
              <TouchableOpacity onPress={onBack} style={styles.backBtn}>
                <Text style={styles.emoji}>⬅️</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.title}>{title}</Text>
          </View>
          <View style={styles.right}>
            {rightElement}
          </View>
        </View>
      </SafeAreaView>
      <View style={styles.bottomBorder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    zIndex: 100,
  },
  safeArea: {
    backgroundColor: 'transparent',
  },
  content: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  emoji: {
    fontSize: 16,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Sora' : 'sans-serif',
  },
  bottomBorder: {
    height: 0.5,
    backgroundColor: 'rgba(255,255,255,0.07)',
    width: '100%',
  }
});
