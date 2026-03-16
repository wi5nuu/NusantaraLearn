import React from 'react';
import { Tabs } from 'expo-router';
import { Text, View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '../../constants/colors';

const TabIcon = ({
  emoji,
  focused,
}: {
  emoji: string;
  focused: boolean;
}) => (
  <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
    <Text style={styles.emoji}>{emoji}</Text>
  </View>
);

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarBackground: () => (
          <BlurView intensity={Platform.OS === 'ios' ? 80 : 100} tint="dark" style={StyleSheet.absoluteFill} />
        ),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="tutor"
        options={{
          title: 'Tutor AI',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🤖</Text>,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Cari',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🔍</Text>,
        }}
      />
      <Tabs.Screen
        name="offline"
        options={{
          title: 'Unduhan',
          tabBarIcon: ({ focused }) => <TabIcon emoji="⬇️" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'rgba(13, 25, 41, 0.8)',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.07)',
    height: 68,
    paddingBottom: 8,
    paddingTop: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 0,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  iconWrap: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  iconWrapActive: {
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOpacity: 0.7,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: `0px 0px 10px ${Colors.primary}`,
      }
    }),
  },
  emoji: {
    fontSize: 20,
  },
});
