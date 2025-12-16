import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import * as Location from 'expo-location';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'date', label: 'Order by Date' },
  { key: 'free', label: 'Free' },
  { key: 'distance', label: 'Distance' },
];

// formula para calcular la distancia entre dos puntos geográficos
function getDistance(lat1, lon1, lat2, lon2) {
  if (
    typeof lat1 !== 'number' ||
    typeof lon1 !== 'number' ||
    typeof lat2 !== 'number' ||
    typeof lon2 !== 'number'
  )
    return Infinity;
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
// Tarjeta de evento
const EventCard = ({ event, distance }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.navigate('FullEvent', { eventId: event.id })}>
      <View style={styles.card}>
        <Image
          source={{ uri: event.poster }}
          style={styles.poster}
          contentFit="cover"
        />
        <View style={styles.cardContent}>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.date}>{event.date ? new Date(event.date).toDateString() : ''}</Text>
          <Text style={styles.location}>{event.location}</Text>
          <Text style={styles.description}>{event.description}</Text>
          <Text style={styles.price}>
            {event.price === 0 ? 'FREE' : `$${event.price}`}
          </Text>
          {typeof distance === 'number' && isFinite(distance) && (
            <Text style={styles.distance}>
              {distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
// Componente principal de cards de eventos con filtros
export default function EventCards({ events }) {
  const [filter, setFilter] = useState('all');
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState('');

  // localización del usuario para filtro por distancia
  useEffect(() => {
    if (filter === 'distance' && !userLocation) {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationError('Permission to access location was denied');
          Alert.alert('Location Permission', 'Permission to access location was denied');
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords);
      })();
    }
  }, [filter, userLocation]);

  const filteredEvents = useMemo(() => {
    if (!Array.isArray(events)) return [];
    if (filter === 'all') return events;
    if (filter === 'date') {
      return [...events].sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateA - dateB;
      });
    }
    if (filter === 'free') {
      return events.filter(e => e.price === 0);
    }
    if (filter === 'distance' && userLocation) {
      return [...events]
        .map(e => ({
          ...e,
          _distance: getDistance(
            userLocation.latitude,
            userLocation.longitude,
            e.latitude,
            e.longitude
          ),
        }))
        .sort((a, b) => a._distance - b._distance);
    }
    return events;
  }, [events, filter, userLocation]);

  if (!events) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

  return (
    <View>
      {/* filtro de botones */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar} contentContainerStyle={{paddingHorizontal: 8}}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterBtn, filter === f.key && styles.filterBtnActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterBtnText, filter === f.key && styles.filterBtnTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* Events List */}
      {filter === 'distance' && !userLocation && !locationError && (
        <Text style={{ textAlign: 'center', marginTop: 16, color: '#888' }}>Getting your location...</Text>
      )}
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 32, color: '#888' }}>
            No events found.
          </Text>
        }
      >
        {filteredEvents.map((item) => (
          <EventCard
            key={item.id}
            event={item}
            distance={
              userLocation && item.latitude && item.longitude
                ? getDistance(
                    userLocation.latitude,
                    userLocation.longitude,
                    item.latitude,
                    item.longitude
                  )
                : undefined
            }
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  filterBar: {
    flexDirection: 'row',
    marginBottom: 8,
    marginTop: 4,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#eee',
    borderRadius: 20,
    marginRight: 8,
  },
  filterBtnActive: {
    backgroundColor: '#388e3c',
  },
  filterBtnText: {
    color: '#333',
    fontWeight: '600',
  },
  filterBtnTextActive: {
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  poster: {
    width: '100%',
    height: 180,
  },
  cardContent: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  categoryTag: {
    backgroundColor: '#eee',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    color: '#333',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#388e3c',
    marginTop: 4,
  },
  distance: {
    fontSize: 14,
    color: '#1976d2',
    marginTop: 4,
    fontWeight: 'bold',
  },
});
