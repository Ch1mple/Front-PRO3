import debounce from 'lodash.debounce';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, TextInput, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { MovieCard } from '@/components/MovieCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { getAllMovies, getSearchMovies } from '@/services/apiService';
import { useFocusEffect } from '@react-navigation/native';

export default function TabTwoScreen() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Fetch all movies
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllMovies();
      setMovies(data);
    } catch {
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search function (inline to avoid dependency warning)
  const debouncedSearch = useMemo(
    () =>
      debounce(async (query: string) => {
        if (!query.trim()) {
          fetchAll();
          return;
        }
        setLoading(true);
        try {
          const data = await getSearchMovies(query);
          setMovies(data);
        } catch {
          setMovies([]);
        } finally {
          setLoading(false);
        }
      }, 600), // delay in ms
    [fetchAll]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Handle search input change
  const handleSearchChange = (text: string) => {
    setSearch(text);
    debouncedSearch(text);
  };

  // Load all movies when screen gains focus
  useFocusEffect(
    useCallback(() => {
      fetchAll();
    }, [fetchAll])
  );

  return (
    // Replaced ParallaxScrollView with a simple ThemedView container
    <ThemedView style={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      </View>

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore</ThemedText>
      </ThemedView>

      {/* Search bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search movies..."
        value={search}
        onChangeText={handleSearchChange}
      />

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MovieCard movie={item} />}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  // Added headerContainer to hold header image
  headerContainer: {
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});
