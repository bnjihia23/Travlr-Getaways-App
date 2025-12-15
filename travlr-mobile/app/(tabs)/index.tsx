// app/(tabs)/index.tsx

import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TripCard } from '@/components/TripCard';
import { useFavorites } from '@/context/FavoritesContext';
import { fetchTrips } from '@/lib/api';
import type { Trip } from '@/lib/types';

export default function TripsScreen() {
  const router = useRouter();
  const { isFavorite } = useFavorites();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadTrips = async () => {
    try {
      setError(null);
      const data = await fetchTrips();
      setTrips(data);
    } catch (err) {
      console.warn(err);
      setError('Unable to load trips. Please check your connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadTrips();
  };

  // Filter trips based on the search query
  const filteredTrips = useMemo(() => {
    if (!searchQuery.trim()) return trips;

    const q = searchQuery.toLowerCase();
    return trips.filter((trip) => {
      const combined =
        `${trip.name} ${trip.resort} ${trip.code}`.toLowerCase();
      return combined.includes(q);
    });
  }, [trips, searchQuery]);

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator />
          <ThemedText>Loading trips...</ThemedText>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.center}>
          <ThemedText type="subtitle">{error}</ThemedText>
          <ThemedText onPress={loadTrips} style={styles.linkText}>
            Tap here to try again
          </ThemedText>
        </View>
      );
    }

    if (!trips.length) {
      // No data from backend at all
      return (
        <View style={styles.center}>
          <ThemedText type="subtitle">
            No trips available.
          </ThemedText>
        </View>
      );
    }

    if (!filteredTrips.length) {
      // We have trips, but none match the current search
      return (
        <View style={styles.center}>
          <ThemedText type="subtitle">
            No trips match your search.
          </ThemedText>
          <ThemedText style={styles.hint}>
            Try adjusting your search terms.
          </ThemedText>
        </View>
      );
    }

    return (
      <FlatList
        data={filteredTrips}
        keyExtractor={(item) => item.code}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <TripCard
            trip={item}
            showFavoriteBadge={isFavorite(item.code)}
            onPress={() =>
              router.push({
                pathname: '/trip/[code]',
                params: { code: item.code },
              } as any)
            }
          />
        )}
      />
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Available Trips
      </ThemedText>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search by name, resort, or code..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCorrect={false}
          style={styles.searchInput}
        />
      </View>

      {renderContent()}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 8,
  },
  searchContainer: {
    marginBottom: 12,
  },
  searchInput: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#666',
    fontSize: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  listContent: {
    paddingBottom: 16,
  },
  linkText: {
    marginTop: 8,
    textDecorationLine: 'underline',
  },
  hint: {
    marginTop: 4,
    textAlign: 'center',
  },
});
