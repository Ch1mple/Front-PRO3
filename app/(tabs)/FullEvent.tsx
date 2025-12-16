import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getEventById, getEvents } from '@/services/apiService';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text } from 'react-native';

// Vista detallada de un evento con imagen, título, fecha, ubicación y descripción

export default function FullEventScreen() {
  const { eventId } = useLocalSearchParams();
  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
// Llamada a getEventById para obtener los datos del evento
  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      try {
        const data = typeof getEventById === 'function'
          ? await getEventById(String(eventId))
          : (await getEvents()).find((e: any) => String(e.id) === String(eventId));
        setEvent(data ?? null);
      } catch {
        setEvent(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [eventId]);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

  if (!event) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title">Event not found</ThemedText>
        <Text>ID: {String(eventId)}</Text>
      </ThemedView>
    );
  }
// Detalle del evento (placeholder si no hay imagen)
  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={{ uri: event.poster || 'https://via.placeholder.com/600x300' }} style={styles.image} />
        <ThemedText type="title">{event.title}</ThemedText>
        <Text style={styles.meta}>{event.date} — {event.location}</Text>
        <Text style={styles.description}>{event.description}</Text>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  content: { padding: 16 },
  image: { width: '100%', height: 200, borderRadius: 8, marginBottom: 12 },
  meta: { color: '#9b9b9bff', marginBottom: 12 },
  description: { fontSize: 15, color: '#ffffffff' },
});