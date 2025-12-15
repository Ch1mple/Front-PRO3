import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { getEventsByUserUid, getUserByUserUid } from '@/services/apiService';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';

import CreateEvent from '@/components/CreateEvent';
import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const userUid = 'aB1FNMJV5OOOex6jhLJADZJ6VKF3'; // Replace with actual UID or get from auth

export default function ProfileScreen() {
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchUserEvents = async () => {
    try {
      setLoading(true);

      // Fetch user info
      const userData = await getUserByUserUid(userUid);
      setUser(userData);

      // Fetch events for this user directly
      const userEvents = await getEventsByUserUid(userUid);
      setEvents(userEvents);
    } catch (e) {
      console.error(e);
      setUser(null);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserEvents();
    }, [])
  );

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

  if (showCreateEvent) {
    return <CreateEvent onClose={() => setShowCreateEvent(false)} />;
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>User not found.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ThemedView style={{ flex: 1 }}>
        <View style={styles.headerContainer}>
          <IconSymbol
            size={310}
            color="#808080"
            name="chevron.left.forwardslash.chevron.right"
            style={styles.headerImage}
          />
        </View>

        {/* Profile Info */}
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">{user.username}'s Events</ThemedText>
        </ThemedView>

        <View style={styles.container}>
          <Image source={{ uri: user.img_url }} style={styles.avatar} />
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.description}>{user.description}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <View style={styles.locationRow}>
            <Image source={{ uri: user.location?.country_img }} style={styles.flag} />
            <Text style={styles.locationText}>
              {user.location?.city}, {user.location?.region}, {user.location?.country}
            </Text>
          </View>
          <Text style={styles.createdAt}>
            Joined: {new Date(user.created_at).toLocaleDateString()}
          </Text>
        </View>

        {/* Events Grid */}
        {events.length > 0 ? (
          <FlatList
            data={events}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.eventsGrid}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigation.navigate('FullEvent', { eventId: item.id })} style={{ flex: 1 }}>
                <View style={styles.eventCard}>
                  <Image
                    source={{ uri: item.poster || 'https://via.placeholder.com/150' }}
                    style={styles.eventImage}
                  />
                  <Text style={styles.eventTitle}>{item.title}</Text>
                  <Text style={styles.eventDate}>{item.date}</Text>
                  <Text style={styles.eventLocation}>{item.location}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text style={{ textAlign: 'center', marginVertical: 20 }}>
            No events found for this user.
          </Text>
        )}
      </ThemedView>

      {/* Floating + Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowCreateEvent(true)}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: 24 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 96, height: 96, borderRadius: 48, marginBottom: 12 },
  username: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  description: { fontSize: 15, color: '#555', marginBottom: 4 },
  email: { fontSize: 14, color: '#888', marginBottom: 8 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  flag: { width: 32, height: 32, marginRight: 8, borderRadius: 16 },
  locationText: { fontSize: 14, color: '#444' },
  createdAt: { fontSize: 13, color: '#aaa', marginTop: 8 },
  headerImage: { color: '#808080', bottom: -90, left: -35, position: 'absolute' },
  titleContainer: { flexDirection: 'row', gap: 8 },
  eventsGrid: { paddingHorizontal: 16, paddingBottom: 40 },
  eventCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#75f8fff3',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  eventImage: { width: 120, height: 180, borderRadius: 6, marginBottom: 8 },
  eventTitle: { fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 },
  eventDate: { fontSize: 12, color: '#666', marginBottom: 2 },
  eventLocation: { fontSize: 12, color: '#444' },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
});
