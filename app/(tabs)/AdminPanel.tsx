// components/CreateEvent.js
import { postEvent } from '@/services/apiService';
import React, { useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const categoriesList = ['Game Boards', 'Food', 'Music', 'Art', 'Sports']; // example categories

export default function CreateEvent() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [poster, setPoster] = useState('');
  const [category, setCategory] = useState([]);

  const toggleCategory = (cat) => {
    setCategory((prev) =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = async () => {
    if (!title || !description || !date || !location || !poster || category.length === 0) {
      Alert.alert('Validation', 'Please fill all fields and select at least one category.');
      return;
    }

    const newEvent = { title, description, date, location, poster, category };

    try {
      const response = await postEvent(newEvent);
      Alert.alert('Success', 'Event created successfully!');
      // Reset form
      setTitle('');
      setDescription('');
      setDate('');
      setLocation('');
      setPoster('');
      setCategory([]);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to create event');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Event title" />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={description}
        onChangeText={setDescription}
        placeholder="Event description"
        multiline
      />

      <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
      <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="2025-10-03" />

      <Text style={styles.label}>Location</Text>
      <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="CC Arenas" />

      <Text style={styles.label}>Poster URL</Text>
      <TextInput style={styles.input} value={poster} onChangeText={setPoster} placeholder="https://..." />

      <Text style={styles.label}>Categories</Text>
      <View style={styles.categoriesContainer}>
        {categoriesList.map(cat => (
          <Text
            key={cat}
            style={[
              styles.categoryTag,
              category.includes(cat) ? styles.categorySelected : styles.categoryUnselected,
            ]}
            onPress={() => toggleCategory(cat)}
          >
            {cat}
          </Text>
        ))}
      </View>

      <Button title="Create Event" onPress={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontWeight: '700',
    marginBottom: 4,
    marginTop: 12,
    color: '#ffffffff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#8a8a8aff',
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
    fontSize: 14,
    userSelect: 'none',
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
});
