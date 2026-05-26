import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { useMapScreen } from '../hooks/useMapScreen';

export function MapScreen() {
  const { mappable, isLoading, error } = useMapScreen();

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
        <Text style={styles.errorText}>Error al cargar mapa</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* TODO: Replace with react-native-maps MapView + Marker pins per psychologist location */}
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>
          {mappable.length} profesionales con ubicación disponible
        </Text>
      </View>
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
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  placeholderText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.base,
    color: colors.textMid,
    textAlign: 'center',
  },
  errorText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.base,
    color: colors.cuyoWine,
  },
});
