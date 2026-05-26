import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { colors } from '@/constants/colors';
import { fontFamily, fontSize, fontWeight } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import type { Psychologist } from '@/types/psychologist.types';
import { PsychologistCard } from '../components/PsychologistCard';
import { useSearchScreen } from '../hooks/useSearchScreen';

const FILTER_OPTIONS = ['Todos', 'Cognitivo-Conductual', 'Psicoanálisis', 'Sistémica', 'Gestalt', 'Online', 'Presencial'];

export function SearchScreen() {
  const {
    psychologists,
    isLoading,
    error,
    isRefreshing,
    onRefresh,
    handlePressPsychologist,
    query,
    setQuery,
    activeFilter,
    setActiveFilter,
  } = useSearchScreen();

  const filtered = psychologists.filter((p) => {
    const q = query.toLowerCase();
    const matchQuery = !q ||
      p.name.toLowerCase().includes(q) ||
      p.specialty.toLowerCase().includes(q) ||
      (p.tags ?? []).some((t) => t.toLowerCase().includes(q));
    const matchFilter =
      activeFilter === 'Todos' ||
      activeFilter === p.specialty ||
      (activeFilter === 'Online' && (p.modality === 'ONLINE' || p.modality === 'BOTH')) ||
      (activeFilter === 'Presencial' && (p.modality === 'IN_PERSON' || p.modality === 'BOTH'));
    return matchQuery && matchFilter;
  });

  const renderCard = ({ item }: { item: Psychologist }) => (
    <PsychologistCard
      psychologist={item}
      onPress={() => handlePressPsychologist(item.id)}
    />
  );

  return (
    <View style={styles.container}>
      {/* Brand header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CuyoPsi</Text>
        <Text style={styles.headerSubtitle}>¿Con quién te gustaría hablar hoy?</Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Especialidad, nombre, enfoque…"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            returnKeyType="search"
          />
        </View>
      </View>

      {/* Filter pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
        contentContainerStyle={styles.filterList}
      >
        {FILTER_OPTIONS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.pill, activeFilter === f && styles.pillActive]}
            onPress={() => setActiveFilter(f)}
            activeOpacity={0.7}
          >
            <Text style={[styles.pillText, activeFilter === f && styles.pillTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.summitBlue} />
        </View>
      ) : (
        <FlatList<Psychologist>
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderCard}
          contentContainerStyle={filtered.length === 0 ? styles.listEmpty : styles.list}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={[colors.summitBlue]}
              tintColor={colors.summitBlue}
            />
          }
          ListHeaderComponent={
            <Text style={styles.resultCount}>
              {`Profesionales disponibles · ${filtered.length}`}
            </Text>
          }
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={error ? styles.errorText : styles.emptyText}>
                {error
                  ? 'Error al cargar profesionales'
                  : 'Sin resultados. Probá ajustar los filtros.'}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cordilleraGray,
  },
  header: {
    backgroundColor: colors.summitBlue,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: 36,
  },
  headerTitle: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.display,
    fontWeight: fontWeight.bold,
    color: colors.white,
  },
  headerSubtitle: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.md,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  searchWrap: {
    paddingHorizontal: spacing.md,
    marginTop: -20,
    marginBottom: spacing.sm,
  },
  searchBar: {
    backgroundColor: colors.white,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 11,
    gap: spacing.sm,
    shadowColor: colors.summitBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 4,
  },
  searchIcon: {
    fontSize: 14,
  },
  searchInput: {
    flex: 1,
    fontFamily: fontFamily.body,
    fontSize: fontSize.md,
    color: colors.textDark,
  },
  filterRow: {
    flexGrow: 0,
    marginBottom: spacing.sm,
  },
  filterList: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 9999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(27,58,107,0.15)',
  },
  pillActive: {
    backgroundColor: colors.summitBlue,
    borderColor: colors.summitBlue,
  },
  pillText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.textMid,
  },
  pillTextActive: {
    color: colors.white,
    fontWeight: fontWeight.semibold,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xl,
  },
  list: {
    paddingBottom: spacing.md,
  },
  listEmpty: {
    flexGrow: 1,
  },
  resultCount: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
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
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
});
