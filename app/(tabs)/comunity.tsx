import debounce from 'lodash.debounce';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { getAllUsers, getSeachUserByUsername, getSearchEventByTitle } from '@/services/apiService';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

export default function TabTwoScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'users' | 'events' | 'all'>('all');

  const navigation = useNavigation();

  // Fetch all users by default
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setItems(data);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search (users + events)
  const debouncedSearch = useMemo(
    () =>
      debounce(async (query: string) => {
        if (!query.trim()) {
          fetchAll();
          return;
        }
        setLoading(true);
        try {
          let userResults: any[] = [];
          let eventResults: any[] = [];

          if (filter === 'all' || filter === 'users') {
            userResults = await getSeachUserByUsername(query);
          }
          if (filter === 'all' || filter === 'events') {
            const events = await getSearchEventByTitle(query);
            eventResults = events.map((ev: any) => ({
              user_uid: ev.user_uid,
              username: ev.title,
              description: ev.description,
              img_url: ev.poster,
            }));
          }

          setItems([...userResults, ...eventResults]);
        } catch {
          setItems([]);
        } finally {
          setLoading(false);
        }
      }, 600),
    [fetchAll, filter]
  );

  // Update search whenever filter changes
  useEffect(() => {
    debouncedSearch(search);
  }, [filter]);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearchChange = (text: string) => {
    setSearch(text);
    debouncedSearch(text);
  };

  // Reload on screen focus
  useFocusEffect(
    useCallback(() => {
      fetchAll();
    }, [fetchAll])
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userCard}
      onPress={() => navigation.navigate('UserDetailScreen', { userUid: item.user_uid })}
    >
      <Image source={{ uri: item.img_url }} style={styles.avatar} />
      <View style={styles.userInfo}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        <IconSymbol size={310} color="#808080" name="person.3" style={styles.headerImage} />
      </View>

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore Users & Events</ThemedText>
      </ThemedView>

      {/* Filter buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'users' && styles.filterSelected]}
          onPress={() => setFilter(filter === 'users' ? 'all' : 'users')}
        >
          <Text style={[styles.filterText, filter === 'users' && styles.filterTextSelected]}>Users</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'events' && styles.filterSelected]}
          onPress={() => setFilter(filter === 'events' ? 'all' : 'events')}
        >
          <Text style={[styles.filterText, filter === 'events' && styles.filterTextSelected]}>Events</Text>
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search users or events..."
        value={search}
        onChangeText={handleSearchChange}
      />

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item, index) => `${item.user_uid}-${index}`}
          renderItem={renderItem}
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
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 8,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  filterSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  filterText: {
    color: '#000',
    fontWeight: '500',
  },
  filterTextSelected: {
    color: '#fff',
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
  userCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
});
