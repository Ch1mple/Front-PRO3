import { getUserByUserUid, getUserLinksByUserUid } from '@/services/apiService';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as Linking from 'expo-linking';
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

const userUid = 'aB1FNMJV5OOOex6jhLJADZJ6VKF5'; // Replace with actual UID or get from auth

function getYouTubeThumbnail(url: string) {
  // Match standard and short YouTube URLs
  const match = url.match(
    /(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (match && match[1]) {
    return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
  }
  return null;
}

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchUserEvents = async () => {
    try {
      setLoading(true);
      const userData = await getUserByUserUid(userUid);
      setUser(userData);
      const userEvents = await getUserLinksByUserUid(userUid);
      setEvents(userEvents);
    } catch (e) {
      setUser(null);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserEvents();
    }, [])
  );

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;
  if (!user) return <Text style={{ margin: 20 }}>User not found.</Text>;

  const renderEvent = ({ item }) => {
    const poster = item.poster || 'https://via.placeholder.com/150';

    // Gallery card style
    if (item.category === 'gallery') {
      return (
        <View style={styles.galleryCard}>
          <Image source={{ uri: poster }} style={styles.galleryImage} />
          <View style={styles.galleryInfo}>
            <Text style={styles.galleryTitle}>{item.title}</Text>
            <Text style={styles.galleryDescription}>{item.description}</Text>
          </View>
        </View>
      );
    }

    // Preview card style
    if (item.category === 'preview') {
      return (
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(item.link);
          }}
          activeOpacity={0.9}
        >
          <View style={styles.eventCard}>
            <View style={{ position: 'relative' }}>
              <Image source={{ uri: poster }} style={styles.eventPoster} />
              <View style={styles.playButtonOverlay}>
                <Text style={styles.playButtonIcon}>▶</Text>
              </View>
            </View>
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <Text style={styles.eventDescription}>{item.description}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    // List card style (row)
    return (
      <TouchableOpacity
        onPress={() => {
          Linking.openURL(item.link);
        }}
        disabled={!item.link}
      >
        <View style={styles.eventCardRow}>
          <Image source={{ uri: poster }} style={styles.eventPosterRow} />
          <View style={styles.eventInfoRow}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text style={styles.eventDescription}>{item.description}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const socialLinks = user?.socialLinks || {};

  const renderSocialIcon = (type, url) => {
    let icon, color;
    switch (type) {
      case 'instagram':
        icon = <FontAwesome name="instagram" size={28} color="#E1306C" />;
        break;
      case 'twitter':
        icon = <FontAwesome name="twitter" size={28} color="#1DA1F2" />;
        break;
      case 'email':
        icon = <MaterialCommunityIcons name="email" size={28} color="#EA4335" />;
        break;
      default:
        return null;
    }
    return (
      <TouchableOpacity
        key={type}
        style={styles.socialIcon}
        onPress={() => Linking.openURL(url.startsWith('mailto:') ? url : (type === 'email' ? `mailto:${url}` : url))}
        activeOpacity={0.7}
      >
        {icon}
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      ListHeaderComponent={
        <View style={styles.userContainer}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: user.img_url }} style={styles.avatar} />
          </View>
          <Text style={styles.username}>{user.username}</Text>
          {/* Social icons below avatar */}
          <View style={styles.socialIconsRowBelow}>
            {Object.entries(socialLinks).map(([type, url]) =>
              renderSocialIcon(type, url)
            )}
          </View>
          
          <Text style={styles.description}>{user.description}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
      }
      data={events}
      keyExtractor={(item) => item.id}
      renderItem={renderEvent}
      contentContainerStyle={{ paddingBottom: 40 }}
      ListEmptyComponent={
        <Text style={{ textAlign: 'center', marginVertical: 20 }}>
          No events found for this user.
        </Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  userContainer: { alignItems: 'center', padding: 20 },
  avatarContainer: {
    width: 120,
    height: 120,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIconsRowBelow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    gap: 8,
  },
  socialIcon: {
    margin: 4,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 4,
    elevation: 2,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    zIndex: 2,
  },
  username: { fontSize: 24, fontWeight: 'bold', color: '#888', marginBottom: 8 },
  description: { fontSize: 16, color: '#555', marginBottom: 8 },
  email: { fontSize: 14, color: '#888', marginBottom: 8 },
  eventsHeader: { fontSize: 20, fontWeight: 'bold', color: '#888', marginTop: 20, marginBottom: 12 },

  eventCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    // Remove row direction to stack children vertically
  },
  eventPoster: { width: '100%', height: 180, borderTopLeftRadius: 10, borderTopRightRadius: 10 },
  eventInfo: { padding: 12 },
  
  eventTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  eventDescription: { fontSize: 14, color: '#555', marginBottom: 6 },
  eventMeta: { fontSize: 12, color: '#888' },

  youtubePreviewRow: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    paddingVertical: 8,
  },
  youtubePreview: {
    width: 200,
    height: 112,
    borderRadius: 8,
    marginBottom: 4,
  },
  youtubeLabel: {
    fontSize: 13,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 2,
  },

  // Add styles for the new row-based card layout
  eventCardRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  eventPosterRow: {
    width: 120,
    height: 100,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: '#eee',
  },
  eventInfoRow: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  youtubeWebview: {
    width: '100%',
    height: 200,
    backgroundColor: '#000',
  },

  playButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  playButtonIcon: {
    fontSize: 64,
    color: '#fff',
    opacity: 0.85,
  },

  // New styles for gallery cards
  galleryCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    alignItems: 'center',
  },
  galleryImage: {
    width: '100%',
    height: 240,
    backgroundColor: '#eee',
  },
  galleryInfo: {
    padding: 14,
    alignItems: 'center',
  },
  galleryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  galleryDescription: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
  },
});
