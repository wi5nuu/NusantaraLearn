import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Platform } from 'react-native';
import { Colors } from '../constants/colors';

interface Props {
  width: number | string;
  height: number;
  borderRadius?: number;
}

export const SkeletonLoader = ({ width, height, borderRadius = 8 }: Props) => {
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width: width as any, height, borderRadius, opacity },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
});
