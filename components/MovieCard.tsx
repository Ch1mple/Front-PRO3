import { addMovie, getUserByUserUid } from '@/services/apiService';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Movie = {
  id: string;
  title: string;
  year: number;
  director: string;
  duration: number;
  poster: string;
  genre: string[];
  rate: number;
};

const userUid = 'aB1FNMJV5OOOex6jhLJADZJ6VKF3';

export function MovieCard({ movie }: { movie: Movie }) {
  const [isInList, setIsInList] = useState(false);

  useEffect(() => {
    // Fetch user movies and check if this movie exists
    const fetchUserMovies = async () => {
      try {
        const userData = await getUserByUserUid(userUid);
        const movieIds = userData.movies.map((m: { id: string }) => m.id);
        setIsInList(movieIds.includes(movie.id));
      } catch (e) {
        console.error('Failed to load user movies:', e);
      }
    };
    fetchUserMovies();
  }, [movie.id]);

  const handleAddMovie = async () => {
    try {
      await addMovie(userUid, movie.id);
      setIsInList(true); // update UI immediately
    } catch (e) {
      console.error('Error adding movie:', e);
    }
  };

  return (
    <View style={styles.card}>
      <Image source={{ uri: movie.poster }} style={styles.poster} />

      <View style={styles.info}>
        <Text style={styles.title}>
          {movie.title} ({movie.year})
        </Text>
        <Text style={styles.director}>Director: {movie.director}</Text>
        <Text style={styles.genre}>{movie.genre.join(', ')}</Text>
        <Text style={styles.rate}>
          ⭐ {movie.rate} | {movie.duration} min
        </Text>
      </View>

      {/* Add / Check button */}
      <TouchableOpacity
        style={[
          styles.addButton,
          { backgroundColor: isInList ? '#4CAF50' : '#888' },
        ]}
        onPress={isInList ? undefined : handleAddMovie}
        disabled={isInList}
      >
        <Text style={styles.addText}>{isInList ? '✓' : '+'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginVertical: 8,
    backgroundColor: '#d3d3d3ff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    alignItems: 'center',
  },
  poster: {
    width: 90,
    height: 130,
    resizeMode: 'cover',
  },
  info: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  director: {
    fontSize: 13,
    color: '#555',
    marginBottom: 2,
  },
  genre: {
    fontSize: 13,
    color: '#888',
    marginBottom: 2,
  },
  rate: {
    fontSize: 13,
    color: '#333',
  },
  addButton: {
    width: 40,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});
