import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '@/constants/colors';
import { fontFamily, fontSize, fontWeight } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/useTheme';
import type { Psychologist, PsychologistModality } from '@/types/psychologist.types';

interface PsychologistCardProps {
  psychologist: Psychologist;
  onPress: () => void;
}

const MODALITY_LABEL: Record<PsychologistModality, string> = {
  ONLINE: 'Online',
  IN_PERSON: 'Presencial',
  BOTH: 'Presencial / Online',
};

export function PsychologistCard({ psychologist, onPress }: PsychologistCardProps) {
  const { colors: themeColors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: themeColors.white }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>
          {psychologist.name}
        </Text>
        {psychologist.rating != null && (
          <Text style={styles.rating}>★ {psychologist.rating}</Text>
        )}
      </View>
      <Text style={styles.specialty} numberOfLines={1}>
        {psychologist.specialty}
      </Text>
      <View style={styles.footer}>
        <Text style={styles.price}>${psychologist.session_price}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{MODALITY_LABEL[psychologist.modality]}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: colors.textDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  name: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.textDark,
    flex: 1,
  },
  rating: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.jarillaGreen,
    marginLeft: spacing.sm,
  },
  specialty: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.md,
    color: colors.textMid,
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.summitBlue,
  },
  badge: {
    backgroundColor: colors.summitSoft,
    borderRadius: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  badgeText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.summitMid,
  },
});
