import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet } from 'react-native';

import EventCards from '@/components/EventsCards';
import EventsCardsSlider from '@/components/EventsCardsSlider';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getEvents } from '@/services/apiService';

export default function HomeScreen() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvents().then(data => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

  return (
    <ThemedView style={{ flex: 1 }}>
      
      {/* Hot events slider */}
      <EventsCardsSlider events={events} />

      {/* Our event cards */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Upcoming Events</ThemedText>
        <ScrollView style={{ flex: 1 }}>
          <EventCards events={events} />
        </ScrollView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    flex: 1, // Asegúrate de que el contenedor tenga flex: 1
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  headerContainer: {
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 8,
  },
});
