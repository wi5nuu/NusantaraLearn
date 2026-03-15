import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Colors } from '../constants/colors';
import { Subject } from '../constants/subjects';

interface Props {
  subject: Subject;
  onPress?: () => void;
  isActive?: boolean;
}

export const SubjectChip = ({ subject, onPress, isActive }: Props) => {
  return (
    <TouchableOpacity
      style={[
        styles.chip, 
        { backgroundColor: subject.bgColor },
        isActive && styles.chipActive
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconBox}>
        <Text style={styles.icon}>{subject.icon}</Text>
      </View>
      <Text style={styles.label}>{subject.label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    width: 76,
    paddingVertical: 12,
    borderRadius: 16,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  chipActive: {
    borderColor: Colors.primaryLight,
    backgroundColor: 'rgba(29,158,117,0.3)',
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  icon: {
    fontSize: 26,
  },
  label: {
    color: Colors.textPrimary,
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
});
