// app/(tabs)/explore.tsx
// Favorites tab

import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TripCard } from '@/components/TripCard';
import { useFavorites } from '@/context/FavoritesContext';

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites, initializing, clearFavorites } = useFavorites();

  if (initializing) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Loading favorites...</ThemedText>
      </ThemedView>
    );
  }

  const hasFavorites = favorites.length > 0;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Favorites</ThemedText>
        {hasFavorites && (
          <ThemedText
            type="defaultSemiBold"
            style={styles.clearText}
            onPress={clearFavorites}
          >
            Clear all
          </ThemedText>
        )}
      </View>

      {!hasFavorites ? (
        <View style={styles.center}>
          <ThemedText type="subtitle">
            You have no favorites yet.
          </ThemedText>
          <ThemedText style={styles.hint}>
            Browse trips on the Trips tab and add some to your favorites.
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.code}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TripCard
              trip={item}
              showFavoriteBadge
              onPress={() =>
                router.push({
                  pathname: '/trip/[code]',
                  params: { code: item.code },
                })
              }
            />
          )}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  clearText: {
    textDecorationLine: 'underline',
  },
  hint: {
    marginTop: 8,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 16,
  },
});
