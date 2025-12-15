import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { getAllMovies, getUserByUserUid, removeMovie, toggleWatched } from '@/services/apiService';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';

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
  const [user, setUser] = useState<any>(null);
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserMovies = async () => {
    try {
      setLoading(true);
      const userData = await getUserByUserUid(userUid);
      setUser(userData);

      const allMovies = await getAllMovies();
      console.log(allMovies)
      const mappedMovies = userData.movies.map((userMovie: any) => {
        const movieInfo = allMovies.find((m: any) => m.id === userMovie.id);
        return movieInfo
          ? { ...movieInfo, watched: !!userMovie.watched }
          : { id: userMovie.id, title: 'Unknown', watched: !!userMovie.watched };
      });

      setMovies(mappedMovies);
    } catch (e) {
      console.error(e);
      setUser(null);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserMovies();
    }, [])
  );

  const handleRemoveMovie = async (movieId: string) => {
    try {
      await removeMovie(userUid, movieId);
      setMovies(prev => prev.filter(movie => movie.id !== movieId));
    } catch (e) {
      alert('Failed to remove movie.');
    }
  };

  const handleToggleWatched = async (movieId: string) => {
    try {
      await toggleWatched(userUid, movieId);
      setMovies(prev =>
        prev.map(movie =>
          movie.id === movieId ? { ...movie, watched: !movie.watched } : movie
        )
      );
    } catch (e) {
      alert('Failed to toggle watched.');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>User not found.</Text>
      </View>
    );
  }

  return (
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
        <ThemedText type="title">{user.username}'s Movies</ThemedText>
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

      {/* Movies Grid */}
      {movies.length > 0 ? (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.moviesGrid}
          renderItem={({ item }) => (
            <View style={styles.movieCard}>
              <Image
                source={{ uri: item.poster || 'https://via.placeholder.com/150' }}
                style={styles.movieImage}
              />
              <Text style={styles.movieTitle}>{item.title}</Text>
              <View style={styles.movieActions}>
                <TouchableOpacity onPress={() => handleToggleWatched(item.id)}>
                  <Text style={{ color: item.watched ? 'green' : 'gray' }}>
                    {item.watched ? 'Watched' : 'Not Watched'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleRemoveMovie(item.id)}>
                  <Text style={{ color: 'red' }}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      ) : (
        <Text style={{ textAlign: 'center', marginVertical: 20 }}>
          No movies found for this user.
        </Text>
      )}
    </ThemedView>
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
  moviesGrid: { paddingHorizontal: 16, paddingBottom: 40 },
  movieCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#75f8fff3',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  movieImage: { width: 120, height: 180, borderRadius: 6, marginBottom: 8 },
  movieTitle: { fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  movieActions: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  headerContainer: {
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 8,
  },
});
