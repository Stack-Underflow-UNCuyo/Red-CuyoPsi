import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { colors } from '@/constants/colors';
import { fontFamily, fontSize, fontWeight } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Avatar, avatarColor, initialsFromName } from '@/components/ui/Avatar';
import type { SessionNote } from '@/types/session_note.types';
import { usePatientRecordScreen } from '../hooks/usePatientRecordScreen';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function NoteCard({ note }: { note: SessionNote }) {
  return (
    <View style={cardStyles.card}>
      <View style={cardStyles.header}>
        <Text style={cardStyles.date}>{formatDate(note.date)}</Text>
        <View style={cardStyles.lockBadge}>
          <Text style={cardStyles.lockText}>{'🔒 Cifrada'}</Text>
        </View>
      </View>
      <View style={cardStyles.separator} />
      <Text style={cardStyles.content}>{note.encrypted_content}</Text>
    </View>
  );
}

export function PatientRecordScreen() {
  const { patient, sessionNotes, isLoading, error, isRefreshing, onRefresh } = usePatientRecordScreen();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.summitBlue} />
      </View>
    );
  }

  const initials = patient != null ? initialsFromName(patient.name) : '?';
  const avatarBg = patient != null ? avatarColor(initials) : colors.summitBlue;

  return (
    <View style={styles.container}>
      <ScreenHeader title="Historial clínico" subtitle={patient?.name ?? 'Paciente'}>
        <View style={styles.headerRow}>
          <Avatar initials={initials} bg={avatarBg} size={40} borderRadius={10} />
          <Text style={styles.patientMeta}>
            {patient != null ? `${patient.email} · ${patient.phone}` : ''}
          </Text>
        </View>
      </ScreenHeader>

      {/* Privacy banner */}
      <View style={styles.privacyBanner}>
        <Text style={styles.privacyIcon}>{'🔒'}</Text>
        <Text style={styles.privacyText}>
          Notas cifradas extremo a extremo. Solo vos podés leer este contenido.
        </Text>
      </View>

      <FlatList
        data={sessionNotes}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }: { item: SessionNote }) => <NoteCard note={item} />}
        contentContainerStyle={sessionNotes.length === 0 ? styles.emptyContainer : styles.list}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[colors.summitBlue]}
            tintColor={colors.summitBlue}
          />
        }
        ListHeaderComponent={
          sessionNotes.length > 0 ? (
            <Text style={styles.sectionLabel}>
              {`${sessionNotes.length} notas clínicas`}
            </Text>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={error ? styles.errorText : styles.emptyText}>
              {error ? 'Error al cargar el historial' : 'Sin notas clínicas registradas'}
            </Text>
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
    paddingTop: spacing.xl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: spacing.sm,
  },
  patientMeta: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.65)',
    flex: 1,
  },
  privacyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.jarillaSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(94,122,46,0.15)',
  },
  privacyIcon: {
    fontSize: 14,
  },
  privacyText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    color: '#3A5A1A',
    flex: 1,
    lineHeight: 17,
  },
  sectionLabel: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
  },
  list: {
    padding: spacing.md,
  },
  emptyContainer: {
    flexGrow: 1,
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
    borderWidth: 1,
    borderColor: 'rgba(27,58,107,0.07)',
    shadowColor: colors.textDark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.summitMid,
    textTransform: 'capitalize',
    flex: 1,
  },
  lockBadge: {
    backgroundColor: colors.jarillaSoft,
    borderRadius: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  lockText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.xs,
    color: '#3A5A1A',
    fontWeight: fontWeight.medium,
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
