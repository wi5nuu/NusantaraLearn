import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Platform,
  ScrollView,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../constants/colors';
import { ContentService } from '../../services/ContentService';
import { LessonCard } from '../../components/LessonCard';
import { GlassHeader } from '../../components/GlassHeader';
import dictionaryData from '../../data/dictionary.json';

const CATEGORIES = ['Semua', 'Matematika', 'IPA', 'Bahasa', 'IPS', 'Kamus 📖'];
const KELAS_LIST = ['Semua', '1', '2', '3', '4', '5', '6'];

const TRENDING = [
  { id: '1', term: 'Perkalian Dasar', icon: '🔢' },
  { id: '2', term: 'Tata Surya', icon: '🪐' },
  { id: '3', term: 'Pahlawan Nasional', icon: '🇮🇩' },
  { id: '4', term: 'Membaca Puisi', icon: '📖' },
];

const RECENT_KEY = '@recent_searches';

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState('Semua');
  const [activeKelas, setActiveKelas] = useState('Semua');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches on mount
  React.useEffect(() => {
    loadRecent();
  }, []);

  const loadRecent = async () => {
    try {
      const saved = await AsyncStorage.getItem(RECENT_KEY);
      if (saved) setRecentSearches(JSON.parse(saved));
    } catch (e) {
      console.warn('Failed to load recent searches');
    }
  };

  const saveSearch = async (term: string) => {
    if (!term.trim()) return;
    const filtered = recentSearches.filter(s => s !== term);
    const updated = [term, ...filtered].slice(0, 5);
    setRecentSearches(updated);
    try {
      await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save search');
    }
  };

  const clearRecent = async () => {
    setRecentSearches([]);
    await AsyncStorage.removeItem(RECENT_KEY);
  };

  const isDictionary = activeCat === 'Kamus 📖';

  const results = useMemo(() => {
    if (isDictionary) {
      if (!query.trim()) return dictionaryData;
      return dictionaryData.filter(item => 
        item.word.toLowerCase().includes(query.toLowerCase()) ||
        item.definition.toLowerCase().includes(query.toLowerCase())
      );
    }

    let filtered = ContentService.searchContent(query);
    
    if (activeCat !== 'Semua') {
      filtered = filtered.filter(l => l.subject.toLowerCase() === activeCat.toLowerCase());
    }
    
    if (activeKelas !== 'Semua') {
      filtered = filtered.filter(l => l.kelas.toString() === activeKelas);
    }
    
    return filtered;
  }, [query, activeCat, activeKelas]);

  return (
    <View style={styles.container}>
      <GlassHeader title="Cari Inspirasi 🔍" />
      
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.input}
            placeholder="Cari materi perpustakaan..."
            placeholderTextColor="rgba(255,255,255,0.3)"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => saveSearch(query)}
          />
        </View>
      </View>

      <View style={styles.filterSection}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.chip, activeCat === item && styles.activeChip]}
              onPress={() => setActiveCat(item)}
            >
              <Text style={[styles.chipText, activeCat === item && styles.activeChipText]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
        
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={KELAS_LIST}
          style={isDictionary ? { height: 0, opacity: 0 } : {}}
          contentContainerStyle={[styles.filterList, { marginTop: 8 }]}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.kelasChip, activeKelas === item && styles.activeKelasChip]}
              onPress={() => setActiveKelas(item)}
            >
              <Text style={[styles.kelasText, activeKelas === item && styles.activeKelasText]}>
                Kelas {item === 'Semua' ? 'Semua' : item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {!query.trim() && (
        <ScrollView style={styles.discoverySection} showsVerticalScrollIndicator={false}>
          {recentSearches.length > 0 && (
            <View style={styles.sectionBlock}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Pencarian Terakhir</Text>
                <TouchableOpacity onPress={clearRecent}>
                  <Text style={styles.clearText}>Hapus</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.tagCloud}>
                {recentSearches.map((term, i) => (
                  <TouchableOpacity 
                    key={i} 
                    style={styles.tag}
                    onPress={() => {
                      setQuery(term);
                      saveSearch(term);
                      setActiveCat('Semua');
                      setActiveKelas('Semua');
                      Keyboard.dismiss();
                      if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <Text style={styles.tagText}>{term}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Lagi Rame 🔥</Text>
            {TRENDING.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.trendingItem}
                onPress={() => {
                  setQuery(item.term);
                  saveSearch(item.term);
                  setActiveCat('Semua');
                  setActiveKelas('Semua');
                  Keyboard.dismiss();
                  if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Text style={styles.trendingIcon}>{item.icon}</Text>
                <Text style={styles.trendingText}>{item.term}</Text>
                <Text style={styles.trendingArrow}>↗</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {query.trim() !== '' && (
        <FlatList
          data={results as any[]}
          keyExtractor={(item, index) => item.id || index.toString()}
          contentContainerStyle={styles.resultsList}
          renderItem={({ item }) => {
            if (isDictionary) {
              return (
                <View style={styles.dictCard}>
                  <View style={styles.dictHeader}>
                    <Text style={styles.dictWord}>{item.word}</Text>
                    <View style={styles.regionalBadge}>
                      <Text style={styles.regionalText}>ID</Text>
                    </View>
                  </View>
                  <Text style={styles.dictDef}>{item.definition}</Text>
                  <View style={styles.dictRegionalRow}>
                    <Text style={styles.regionalLabel}>Daerah:</Text>
                    <Text style={styles.regionalVal}>
                      JV: {item.regional.jv} • SU: {item.regional.su} • BG: {item.regional.bg}
                    </Text>
                  </View>
                  <Text style={styles.dictExample}>"{item.example}"</Text>
                </View>
              );
            }
            return (
              <LessonCard
                lesson={{
                  id: item.id,
                  title: item.title,
                  categoryId: item.subject,
                  meta: `Kelas ${item.kelas} • ${item.duration_minutes}m`,
                  emoji: '📚',
                  bgColor: Colors.primary + '20',
                  isFree: true,
                  isOffline: true,
                }}
                onPress={() => {
                  saveSearch(query);
                  router.push(`/lesson/${item.id}`);
                }}
              />
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📭</Text>
              <Text style={styles.emptyText}>Belum ada {isDictionary ? 'kata' : 'materi'} untuk pencarian ini</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1120',
  },
  header: {
    paddingTop: 110, // Added space for absolute GlassHeader
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  filterSection: {
    marginBottom: 10,
  },
  filterList: {
    paddingHorizontal: 20,
    gap: 8,
  },
  chip: {
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
  chipText: {
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '600',
  },
  activeChipText: {
    color: '#fff',
  },
  kelasChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  activeKelasChip: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(29,158,117,0.1)',
  },
  kelasText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    fontWeight: '600',
  },
  activeKelasText: {
    color: Colors.primary,
  },
  resultsList: {
    padding: 20,
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 16,
    textAlign: 'center',
  },
  dictCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    gap: 12,
  },
  dictHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dictWord: {
    color: Colors.primaryLight,
    fontSize: 24,
    fontWeight: '800',
    fontFamily: 'Sora_700Bold',
  },
  regionalBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  regionalText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  dictDef: {
    color: Colors.textPrimary,
    fontSize: 15,
    lineHeight: 22,
  },
  dictRegionalRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    backgroundColor: 'rgba(255,165,0,0.05)',
    padding: 10,
    borderRadius: 12,
  },
  regionalLabel: {
    color: '#FFA500',
    fontSize: 12,
    fontWeight: '700',
  },
  regionalVal: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    fontWeight: '600',
  },
  dictExample: {
    color: Colors.textMuted,
    fontSize: 14,
    fontStyle: 'italic',
  },
  discoverySection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionBlock: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Sora_700Bold',
  },
  clearText: {
    color: Colors.textHint,
    fontSize: 12,
  },
  tagCloud: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  tagText: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    padding: 16,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  trendingIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  trendingText: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  trendingArrow: {
    color: Colors.textHint,
    fontSize: 16,
  },
});
