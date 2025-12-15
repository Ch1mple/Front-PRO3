import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import AntDesign from '@expo/vector-icons/AntDesign';
export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              position: 'absolute',
            },
            default: {},
          }),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="comunity"
          options={{
            title: 'Comunity',
            tabBarIcon: ({ color }) => <AntDesign name="search" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile copy"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <AntDesign name="user" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile copy 2"
          options={{
            title: 'Profile Link',
            tabBarIcon: ({ color }) => <AntDesign name="user" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
            href: null,
          }}
        />
        <Tabs.Screen
          name="AdminPanel"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="UserDetailScreen"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="FullEvent"
          options={{
            href: null,
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
}
