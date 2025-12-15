import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TripCard } from '@/components/TripCard';
import { useFavorites } from '@/context/FavoritesContext';
import { fetchTripByCode } from '@/lib/api';
import type { Trip } from '@/lib/types';

export const unstable_settings = {
  href: null,
};

export default function TripDetailScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!code) return;

      try {
        setError(null);
        const data = await fetchTripByCode(String(code));
        setTrip(data);
      } catch (err) {
        console.warn(err);
        setError('Unable to load trip details.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [code]);

  useEffect(() => {
    if (trip) {
      navigation.setOptions({
      title: trip.name,
      headerBackTitle: 'Trips',
      })
    }
  }, [trip, navigation]);

  if (loading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator />
        <ThemedText>Loading trip...</ThemedText>
      </ThemedView>
    );
  }

  if (error || !trip) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText type="subtitle">{error ?? 'Trip not found.'}</ThemedText>
        <ThemedText onPress={() => router.back()} style={styles.linkText}>
          Go back
        </ThemedText>
      </ThemedView>
    );
  }

  const favorite = isFavorite(trip.code);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TripCard trip={trip} showFavoriteBadge={favorite} />

        <View style={styles.section}>
          <ThemedText type="subtitle">Details</ThemedText>
          <ThemedText>
            Start date:{' '}
            {new Date(trip.start).toLocaleDateString()}
          </ThemedText>
          <ThemedText>
            Resort: {trip.resort}
          </ThemedText>
          <ThemedText>
            Price per person: ${trip.perPerson}
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">Description</ThemedText>
          {trip.description.map((line, index) => (
            <ThemedText key={index}>• {line}</ThemedText>
          ))}
        </View>

        <ThemedText
          type="defaultSemiBold"
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(trip)}
        >
          {favorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 16,
    paddingBottom: 24,
    gap: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  section: {
    gap: 4,
  },
  favoriteButton: {
    marginTop: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  linkText: {
    marginTop: 8,
    textDecorationLine: 'underline',
  },
});
