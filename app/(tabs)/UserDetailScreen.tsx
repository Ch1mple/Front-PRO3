import { getEventsByUserUid, getUserByUserUid } from '@/services/apiService';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function UserDetailScreen() {
  const [user, setUser] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();
  const { userUid } = route.params;

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function fetchData() {
        setLoading(true);
        try {
          const userData = await getUserByUserUid(userUid);
          const userEvents = await getEventsByUserUid(userUid);

          if (isActive) {
            setUser(userData);
            setEvents(userEvents);
          }
        } catch {
          if (isActive) {
            setUser(null);
            setEvents([]);
          }
        } finally {
          if (isActive) setLoading(false);
        }
      }

      fetchData();

      return () => {
        isActive = false;
      };
    }, [userUid])
  );

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;
  if (!user) return <Text>User not found</Text>;

  const renderEvent = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('FullEvent', { eventId: item.id, from: 'UserDetailScreen' })}><View style={styles.eventCard}>
       
      <Image source={{ uri: item.poster }} style={styles.eventPoster} />
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventDescription}>{item.description}</Text>
        <Text style={styles.eventMeta}>📅 {item.date} | 📍 {item.location}</Text>
      </View>
      
    </View></TouchableOpacity>
  );

  return (
    <FlatList
      ListHeaderComponent={
        <View style={styles.userContainer}>
          <Image source={{ uri: user.img_url }} style={styles.avatar} />
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.description}>{user.description}</Text>
          <Text style={styles.eventsHeader}>Events</Text>
        </View>
      }
      data={events}
      keyExtractor={(item) => item.id}
      renderItem={renderEvent}
      contentContainerStyle={{ paddingBottom: 40 }}
    />
  );
}

const styles = StyleSheet.create({
  userContainer: { alignItems: 'center', padding: 20 },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 16 },
  username: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  description: { fontSize: 16, color: '#555', marginBottom: 16 },
  eventsHeader: { fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 12 },

  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  eventPoster: { width: 100, height: 100 },
  eventInfo: { flex: 1, padding: 10 },
  eventTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  eventDescription: { fontSize: 14, color: '#555', marginBottom: 6 },
  eventMeta: { fontSize: 12, color: '#888' },
});
