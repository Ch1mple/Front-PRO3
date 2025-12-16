import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// slider de eventos destacados (hot en el servidor)
const HotEventCard = ({ event }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.navigate('FullEvent', { eventId: event.id })}>
      <View style={styles.card}>
        <Image source={{ uri: event.poster }} style={styles.poster} contentFit="cover" />
        <View style={styles.cardContent}>
          <Text style={styles.title} numberOfLines={1}>{event.title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
// Componente principal del slider de eventos
export default function EventsCardsSlider({ events }) {
  const hotEvents = Array.isArray(events) ? events.filter(e => e.label === 'hot') : [];
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // auto scroll lateral
  useEffect(() => {
    if (!hotEvents.length) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        const nextIndex = prev + 1 >= hotEvents.length ? 0 : prev + 1;
        flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        return nextIndex;
      });
    }, 3500); // Change slide every 3.5 seconds
    return () => clearInterval(interval);
  }, [hotEvents.length]);

  if (!hotEvents.length) return null;
// vista del slider (componente)
  return (
    <View style={styles.container}>
      <Text style={styles.sliderTitle}>🔥 Top Events</Text>
      <FlatList
        ref={flatListRef}
        data={hotEvents}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <HotEventCard event={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 8 }}
        pagingEnabled
        onMomentumScrollEnd={e => {
          const index = Math.round(e.nativeEvent.contentOffset.x / 192); // 180 card + 12 margin
          setCurrentIndex(index);
        }}
        getItemLayout={(_, index) => ({
          length: 192,
          offset: 192 * index,
          index,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    marginTop: 16,
    paddingHorizontal: 16, 
  },
  sliderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#fdb7b7ff',
  },
  card: {
    width: 180,
    marginRight: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  poster: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: {
    padding: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
});