import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { colors } from '@/constants/colors';
import { fontFamily, fontSize, fontWeight } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import type { PsychologistModality } from '@/types/psychologist.types';
import { InfoRow } from '../components/InfoRow';
import { usePsychologistProfileScreen } from '../hooks/usePsychologistProfileScreen';

const MODALITY_LABEL: Record<PsychologistModality, string> = {
  ONLINE: 'Online',
  IN_PERSON: 'Presencial',
  BOTH: 'Presencial / Online',
};

const PAYMENT_POLICY_LABEL: Record<string, string> = {
  TOTAL: 'Pago total (100%)',
  '50_DEPOSIT': 'Anticipo 50%',
  EXTERNAL: 'Pago en consultorio',
};

export function PsychologistProfileScreen() {
  const { psychologist, isLoading, error, handleReservar } = usePsychologistProfileScreen();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.summitBlue} />
      </View>
    );
  }

  if (error || !psychologist) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No se pudo cargar el perfil</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <Text style={styles.name}>{psychologist.name}</Text>
        <Text style={styles.specialty}>{psychologist.specialty}</Text>
        <View style={styles.badges}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{MODALITY_LABEL[psychologist.modality]}</Text>
          </View>
          {psychologist.rating != null && (
            <View style={[styles.badge, styles.ratingBadge]}>
              <Text style={styles.badgeText}>★ {psychologist.rating}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.infoCard}>
        <InfoRow label="Honorario" value={`$${psychologist.session_price}`} />
        <InfoRow
          label="Modalidad de pago"
          value={PAYMENT_POLICY_LABEL[psychologist.payment_policy] ?? psychologist.payment_policy}
        />
        {psychologist.address != null && (
          <InfoRow label="Consultorio" value={psychologist.address} />
        )}
      </View>

      <TouchableOpacity style={styles.cta} onPress={handleReservar} activeOpacity={0.85}>
        <Text style={styles.ctaText}>Reservar turno</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cordilleraGray,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cordilleraGray,
  },
  headerCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  name: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  specialty: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.base,
    color: colors.textMid,
    marginBottom: spacing.sm,
  },
  badges: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  badge: {
    backgroundColor: colors.summitSoft,
    borderRadius: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  ratingBadge: {
    backgroundColor: colors.jarillaSoft,
  },
  badgeText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.summitMid,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  errorText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.base,
    color: colors.cuyoWine,
  },
  cta: {
    backgroundColor: colors.summitBlue,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
  },
  ctaText: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.white,
  },
});
