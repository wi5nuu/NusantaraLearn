import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Colors } from '../constants/colors';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface Props {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SearchBar = ({ onSearch, placeholder = 'Cari materi, kuis, dll...' }: Props) => {
  const [val, setVal] = useState('');
  const scale = useSharedValue(1);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleClear = () => {
    setVal('');
    onSearch('');
  };

  return (
    <Animated.View style={[styles.container, style]}>
      <Text style={styles.icon}>🔍</Text>
      <TextInput 
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.textHint}
        value={val}
        onChangeText={(t) => {
          setVal(t);
          onSearch(t);
        }}
        onFocus={() => { scale.value = withTiming(1.02, { duration: 200 }) }}
        onBlur={() => { scale.value = withTiming(1, { duration: 200 }) }}
      />
      {val.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
          <Text style={styles.clearText}>×</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
  },
  icon: {
    fontSize: 18,
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 15,
  },
  clearBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: -2,
  }
});
