import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { useUser } from '../../stores/useUser';

const PROVINCES = ['Semua', 'Jakarta', 'Jawa Barat', 'Jawa Tengah', 'Bali', 'Sulawesi Selatan'];

const MOCK_LEADERBOARD = [
  { id: '1', name: 'Alif Pratama', xp: 2450, school: 'SDN 01 Jakarta', province: 'Jakarta', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alif' },
  { id: '2', name: 'Bunga Citra', xp: 2120, school: 'SD N 2 Denpasar', province: 'Bali', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bunga' },
  { id: '3', name: 'Candra Wijaya', xp: 1980, school: 'SMPN 1 Bandung', province: 'Jawa Barat', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Candra' },
  { id: 'wisnu', name: 'Wisnu (Anda)', xp: 840, school: 'President University', province: 'Jawa Barat', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wisnu' },
  { id: '4', name: 'Dewi Sartika', xp: 750, school: 'SDN 5 Solo', province: 'Jawa Tengah', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dewi' },
  { id: '5', name: 'Eko Putra', xp: 620, school: 'SDN 3 Medan', province: 'Sumatera Utara', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eko' },
  { id: '6', name: 'Fany Fitria', xp: 540, school: 'SDN 1 Makassar', province: 'Sulawesi Selatan', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fany' },
];

export default function LeaderboardScreen() {
  const { xp } = useUser();

  const [activeProvince, setActiveProvince] = useState('Semua');

  // Update Wisnu's XP in mock data safely and filter by province
  const leaderboardData = MOCK_LEADERBOARD
    .map(item => item.id === 'wisnu' ? { ...item, xp: xp } : item)
    .filter(item => activeProvince === 'Semua' || item.province === activeProvince)
    .sort((a, b) => b.xp - a.xp);

  const renderItem = ({ item, index }: any) => {
    const isMe = item.id === 'wisnu';
    const rank = index + 1;

    return (
      <View style={[styles.card, isMe && styles.cardMe]}>
        <View style={styles.rankWrap}>
          <Text style={[styles.rankText, rank <= 3 && styles.rankTop]}>
            {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
          </Text>
        </View>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.school}>{item.school}</Text>
        </View>
        <View style={styles.xpWrap}>
          <Text style={styles.xpValue}>{item.xp}</Text>
          <Text style={styles.xpLabel}>XP</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Peringkat Nusantara 🏆</Text>
        <Text style={styles.subtitle}>Ayo jadi yang terbaik di Indonesia!</Text>
      </View>

      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterList}>
          {PROVINCES.map(prov => (
            <TouchableOpacity 
              key={prov} 
              style={[styles.provinceChip, activeProvince === prov && styles.activeChip]}
              onPress={() => setActiveProvince(prov)}
            >
              <Text style={[styles.provinceText, activeProvince === prov && styles.activeText]}>
                {prov}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={leaderboardData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    padding: 24,
    backgroundColor: Colors.bgMid,
    borderBottomWidth:1,
    borderBottomColor: Colors.border,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    fontFamily: 'Sora_700Bold',
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 14,
    marginTop: 4,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  filterSection: {
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  filterList: {
    paddingHorizontal: 20,
    gap: 8,
  },
  provinceChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  activeChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  provinceText: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  activeText: {
    color: '#fff',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardMe: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(29,158,117,0.05)',
  },
  rankWrap: {
    width: 32,
    alignItems: 'center',
  },
  rankText: {
    color: Colors.textMuted,
    fontSize: 16,
    fontWeight: '700',
  },
  rankTop: {
    fontSize: 20,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginHorizontal: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  school: {
    color: Colors.textHint,
    fontSize: 11,
    marginTop: 2,
  },
  xpWrap: {
    alignItems: 'flex-end',
  },
  xpValue: {
    color: Colors.primaryLight,
    fontSize: 16,
    fontWeight: '800',
  },
  xpLabel: {
    color: Colors.textHint,
    fontSize: 9,
    fontWeight: '600',
  },
});
