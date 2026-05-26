import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '@/constants/colors';
import { fontFamily, fontSize, fontWeight } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { Avatar, avatarColor, initialsFromName } from '@/components/ui/Avatar';
import type { Psychologist, PsychologistModality } from '@/types/psychologist.types';

interface PsychologistCardProps {
  psychologist: Psychologist;
  onPress: () => void;
}

const MODALITY_BADGE: Record<PsychologistModality, { text: string; bg: string; fg: string }> = {
  ONLINE: { text: 'Online', bg: colors.jarillaSoft, fg: '#3A5A1A' },
  IN_PERSON: { text: 'Presencial', bg: colors.summitSoft, fg: colors.summitMid },
  BOTH: { text: 'Online · Presencial', bg: colors.cuyoWineSoft, fg: colors.cuyoWine },
};

function StarRow({ rating }: { rating: number }) {
  const full = Math.min(5, Math.floor(rating));
  return (
    <Text style={styles.stars}>
      {'★'.repeat(full)}{'☆'.repeat(5 - full)}
    </Text>
  );
}

export function PsychologistCard({ psychologist, onPress }: PsychologistCardProps) {
  const initials = psychologist.initials ?? initialsFromName(psychologist.name);
  const bg = psychologist.color ?? avatarColor(initials);
  const badge = MODALITY_BADGE[psychologist.modality];
  const ratingNum = psychologist.rating != null ? parseFloat(psychologist.rating) : null;
  const distanceLabel = psychologist.address
    ? `${((psychologist.id * 0.4 + 0.7) % 2.5 + 0.7).toFixed(1)} km`
    : 'Online';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Avatar initials={initials} bg={bg} size={52} borderRadius={12} />

      <View style={styles.body}>
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={1}>{psychologist.name}</Text>
          <View style={[styles.badge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.badgeText, { color: badge.fg }]}>{badge.text}</Text>
          </View>
        </View>

        <Text style={styles.specialty} numberOfLines={1}>
          {psychologist.specialty}
          {psychologist.tags && psychologist.tags[0] ? ` · ${psychologist.tags[0]}` : ''}
        </Text>

        <View style={styles.metaRow}>
          {ratingNum != null && (
            <View style={styles.metaItem}>
              <StarRow rating={ratingNum} />
              <Text style={styles.metaText}>
                {' '}{ratingNum.toFixed(1)}
                {psychologist.reviews != null ? ` (${psychologist.reviews})` : ''}
              </Text>
            </View>
          )}
          <Text style={styles.metaText}>{distanceLabel}</Text>
        </View>
      </View>

      <View style={styles.priceCol}>
        <Text style={styles.price}>${psychologist.session_price}</Text>
        <Text style={styles.perSession}>/sesión</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(27,58,107,0.06)',
    shadowColor: colors.textDark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 3,
  },
  name: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.textDark,
    flex: 1,
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    flexShrink: 0,
  },
  badgeText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
  specialty: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    color: colors.cuyoWine,
    fontWeight: fontWeight.medium,
    marginBottom: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    fontSize: fontSize.xs,
    color: '#E6A817',
  },
  metaText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  priceCol: {
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  price: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.summitBlue,
  },
  perSession: {
    fontFamily: fontFamily.body,
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 2,
  },
});
