import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';

import type { Trip } from '@/lib/types';

const FAVORITES_KEY = '@travlr/favorites';

interface FavoritesContextValue {
  favorites: Trip[];
  initializing: boolean;
  isFavorite: (code: string) => boolean;
  toggleFavorite: (trip: Trip) => void;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined
);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Trip[]>([]);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(FAVORITES_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as Trip[];
          setFavorites(parsed);
        }
      } catch (error) {
        console.warn('Error loading favorites', error);
      } finally {
        setInitializing(false);
      }
    };

    load();
  }, []);

  const persist = async (next: Trip[]) => {
    setFavorites(next);
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    } catch (error) {
      console.warn('Error saving favorites', error);
    }
  };

  const isFavorite = (code: string) =>
    favorites.some((t) => t.code === code);

  const toggleFavorite = (trip: Trip) => {
    if (isFavorite(trip.code)) {
      const next = favorites.filter((t) => t.code !== trip.code);
      persist(next);
    } else {
      const next = [...favorites, trip];
      persist(next);
    }
  };

  const clearFavorites = () => {
    persist([]);
  };

  const value: FavoritesContextValue = {
    favorites,
    initializing,
    isFavorite,
    toggleFavorite,
    clearFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error(
      'useFavorites must be used within a FavoritesProvider'
    );
  }
  return ctx;
}
