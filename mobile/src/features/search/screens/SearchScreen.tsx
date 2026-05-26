import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import type { Psychologist } from '@/types/psychologist.types';
import { PsychologistCard } from '../components/PsychologistCard';
import { useSearchScreen } from '../hooks/useSearchScreen';

export function SearchScreen() {
  const { psychologists, isLoading, error, handlePressPsychologist } = useSearchScreen();

  const renderCard = ({ item }: { item: Psychologist }) => (
    <PsychologistCard
      psychologist={item}
      onPress={() => handlePressPsychologist(item.id)}
    />
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.summitBlue} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error al cargar profesionales</Text>
      </View>
    );
  }

  if (psychologists.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No hay profesionales disponibles</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList<Psychologist>
        data={psychologists}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderCard}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cordilleraGray,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cordilleraGray,
  },
  list: {
    paddingVertical: spacing.md,
  },
  errorText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.base,
    color: colors.cuyoWine,
  },
  emptyText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.base,
    color: colors.textMuted,
  },
});
