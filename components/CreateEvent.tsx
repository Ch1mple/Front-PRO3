// components/CreateEvent.js
import { postEvent } from '@/services/apiService';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
 // Lista de categorías disponibles
const categoriesList = ['Food', 'Music', 'Art', 'Sports'];
const userUid = 'aB1FNMJV5OOOex6jhLJADZJ6VKF3';
 // Componente para crear un nuevo evento
export default function CreateEvent({ onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [poster, setPoster] = useState('');
  const [price, setPrice] = useState(''); // <-- new state
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);

  const [coords, setCoords] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);
 // Manejo de selección/deselección de categorías
  const toggleCategory = (cat) => {
    setCategory((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // autocompletar ubicación
  const handleLocationChange = (text) => {
    setLocation(text);
    setCoords(null);

    if (typingTimeout) clearTimeout(typingTimeout);

    if (text.length < 3) {
      setSuggestions([]);
      return;
    }
// Llamada a Nominatim API 
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            text
          )}&countrycodes=es&limit=5`
        );
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error('Nominatim error:', err);
        setSuggestions([]);
      }
    }, 500);

    setTypingTimeout(timeout);
  };

  // sugerencia de ubicación seleccionada
  const handleSelectSuggestion = (place) => {
    setLocation(place.display_name);
    setSuggestions([]);
    setCoords({
      latitude: parseFloat(place.lat),
      longitude: parseFloat(place.lon),
    });
  };

  const handleSubmit = async () => {
    if (
      !title ||
      !description ||
      !date ||
      !location ||
      !poster ||
      !price ||
      category.length === 0
    ) {
      Alert.alert('Validation', 'Please fill all fields, add a price, and select categories.');
      return;
    }

    if (!coords) {
      Alert.alert('Validation', 'Please select a location from suggestions.');
      return;
    }
    // Envío de datos del nuevo evento al servidor
    try {
      setLoading(true);

      const newEvent = {
        id: crypto.randomUUID(),
        title,
        description,
        date,
        location,
        poster,
        category,
        user_uid: userUid,
        price: parseFloat(price), 
        latitude: coords.latitude,
        longitude: coords.longitude,
      };

      await postEvent(newEvent);
      Alert.alert('Success', 'Event created successfully!');

      // Reseteo
      setTitle('');
      setDescription('');
      setDate('');
      setLocation('');
      setPoster('');
      setPrice('');
      setCategory([]);
      setCoords(null);

      if (onClose) onClose();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };
 // vista del formulario de creación de evento
  return (
    <View style={{ flex: 1 }}>
      {onClose && (
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
      )}

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Title</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <Text style={styles.label}>Date</Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="2025-10-03"
        />

        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={handleLocationChange}
          placeholder="Search place..."
        />

        {/* sugerencias */}
        {suggestions.length > 0 && (
          <FlatList
            data={suggestions}
            keyExtractor={(item) => `${item.osm_id}-${item.place_id || item.lat}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSelectSuggestion(item)}
              >
                <Text>{item.display_name}</Text>
              </TouchableOpacity>
            )}
            style={styles.suggestionsList}
          />
        )}

        {/* preview de las coordenadas */}
        {coords && (
          <View style={styles.previewBox}>
            <Text>
              📍 {coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)}
            </Text>
          </View>
        )}

        <Text style={styles.label}>Poster URL</Text>
        <TextInput style={styles.input} value={poster} onChangeText={setPoster} />

        <Text style={styles.label}>Price (€)</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          placeholder="e.g. 10"
        />

        <Text style={styles.label}>Categories</Text>
        <View style={styles.categoriesContainer}>
          {categoriesList.map((cat) => (
            <Text
              key={cat}
              style={[
                styles.categoryTag,
                category.includes(cat)
                  ? styles.categorySelected
                  : styles.categoryUnselected,
              ]}
              onPress={() => toggleCategory(cat)}
            >
              {cat}
            </Text>
          ))}
        </View>

        <Button
          title={loading ? 'Creating...' : 'Create Event'}
          onPress={handleSubmit}
          disabled={loading}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { fontWeight: '700', marginTop: 12, marginBottom: 4, color: '#fff' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#8a8a8a',
  },
  suggestionsList: {
    backgroundColor: '#fff',
    borderRadius: 6,
    marginBottom: 8,
    maxHeight: 150,
  },
  suggestionItem: {
    padding: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  previewBox: {
    marginTop: 6,
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  categoryTag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  categorySelected: {
    backgroundColor: '#007AFF',
    color: 'white',
    borderColor: '#007AFF',
  },
  categoryUnselected: {
    backgroundColor: 'white',
    color: '#007AFF',
    borderColor: '#007AFF',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: '#ff3b30',
    borderRadius: 20,
    padding: 6,
  },
});
