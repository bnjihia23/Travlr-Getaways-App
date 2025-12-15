import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { Trip } from '@/lib/types';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

interface Props {
  trip: Trip;
  onPress?: () => void;
  showFavoriteBadge?: boolean;
}

export function TripCard({ trip, onPress, showFavoriteBadge }: Props) {
  const content = (
    <ThemedView style={styles.card}>
      <View style={styles.headerRow}>
        <ThemedText type="title" numberOfLines={1}>
          {trip.name}
        </ThemedText>
        {showFavoriteBadge && (
          <ThemedText type="subtitle">★</ThemedText>
        )}
      </View>

      <ThemedText type="subtitle" numberOfLines={1}>
        {trip.resort}
      </ThemedText>

      <View style={styles.metaRow}>
        <ThemedText>
          {trip.length} • ${trip.perPerson} per person
        </ThemedText>
      </View>
    </ThemedView>
  );

  if (!onPress) return content;

  return (
    <Pressable onPress={onPress} style={styles.pressable}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    marginBottom: 12,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    columnGap: 12,
    marginBottom: 4,
  },
  metaRow: {
    marginTop: 4,
  },
});
