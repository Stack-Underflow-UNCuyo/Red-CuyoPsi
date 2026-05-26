import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { colors } from '@/constants/colors';
import { fontFamily, fontSize, fontWeight } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import type { SessionNote } from '@/types/session_note.types';
import { usePatientRecordScreen } from '../hooks/usePatientRecordScreen';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function NoteCard({ note }: { note: SessionNote }) {
  return (
    <View style={cardStyles.card}>
      <Text style={cardStyles.date}>{formatDate(note.date)}</Text>
      <View style={cardStyles.separator} />
      <Text style={cardStyles.content}>{note.encrypted_content}</Text>
    </View>
  );
}

export function PatientRecordScreen() {
  const { patient, sessionNotes, isLoading, error } = usePatientRecordScreen();

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
        <Text style={styles.errorText}>Error al cargar el historial</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {patient != null && (
        <View style={styles.header}>
          <Text style={styles.patientName}>{patient.name}</Text>
          <Text style={styles.patientMeta}>{patient.email} · {patient.phone}</Text>
        </View>
      )}

      <FlatList
        data={sessionNotes}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <NoteCard note={item} />}
        contentContainerStyle={sessionNotes.length === 0 ? styles.emptyContainer : styles.list}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>Sin notas clínicas registradas</Text>
          </View>
        }
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
  },
  header: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.cordilleraGray,
  },
  patientName: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textDark,
  },
  patientMeta: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.md,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  list: {
    padding: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xl,
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

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: colors.textDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  date: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.summitMid,
    textTransform: 'capitalize',
  },
  separator: {
    height: 1,
    backgroundColor: colors.cordilleraGray,
    marginVertical: spacing.sm,
  },
  content: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.base,
    color: colors.textDark,
    lineHeight: 22,
  },
});
