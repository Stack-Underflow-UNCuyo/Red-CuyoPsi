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
import { Avatar, avatarColor, initialsFromName } from '@/components/ui/Avatar';
import type { PsychologistModality } from '@/types/psychologist.types';
import { usePsychologistProfileScreen } from '../hooks/usePsychologistProfileScreen';

const MODALITY_LABEL: Record<PsychologistModality, string> = {
  ONLINE: 'Online',
  IN_PERSON: 'Presencial',
  BOTH: 'Presencial / Online',
};

const PAYMENT_POLICY_DESCRIPTION: Record<string, string> = {
  TOTAL: 'Requiere pago total para confirmar el turno.',
  '50_DEPOSIT': 'Requiere 50% de seña para confirmar. El resto se abona al inicio de la sesión.',
  EXTERNAL: 'Sin pago anticipado: abonás en consultorio al iniciar la sesión.',
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

  const initials = psychologist.initials ?? initialsFromName(psychologist.name);
  const avatarBg = psychologist.color ?? avatarColor(initials);
  const ratingNum = psychologist.rating != null ? parseFloat(psychologist.rating) : null;
  const initialPay = psychologist.payment_policy === '50_DEPOSIT'
    ? (parseFloat(psychologist.session_price) / 2).toFixed(0)
    : psychologist.session_price;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Blue header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.avatarWrap}>
            <Avatar initials={initials} bg={avatarBg} size={72} borderRadius={14} />
            <View style={styles.verifiedDot}>
              <Text style={styles.verifiedIcon}>✓</Text>
            </View>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{psychologist.name}</Text>
            {psychologist.registration != null && (
              <Text style={styles.headerMeta}>{psychologist.registration} · Mendoza, AR</Text>
            )}
            <View style={styles.headerBadges}>
              <View style={styles.headerChip}>
                <Text style={styles.headerChipText}>✓ Verificada</Text>
              </View>
              {ratingNum != null && (
                <View style={styles.headerChip}>
                  <Text style={styles.headerChipText}>
                    {'★ '}
                    {ratingNum.toFixed(1)}
                    {psychologist.reviews != null ? ` · ${psychologist.reviews} reseñas` : ''}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* White content card */}
      <View style={styles.body}>
        {/* Stats row */}
        {(psychologist.years != null || psychologist.patients != null || psychologist.punctuality != null) && (
          <View style={styles.statsRow}>
            {psychologist.years != null && (
              <View style={styles.statCell}>
                <Text style={styles.statNum}>{psychologist.years}+</Text>
                <Text style={styles.statLabel}>Años exp.</Text>
              </View>
            )}
            {psychologist.patients != null && (
              <View style={styles.statCell}>
                <Text style={styles.statNum}>{psychologist.patients}</Text>
                <Text style={styles.statLabel}>Pacientes</Text>
              </View>
            )}
            {psychologist.punctuality != null && (
              <View style={styles.statCell}>
                <Text style={styles.statNum}>{psychologist.punctuality}%</Text>
                <Text style={styles.statLabel}>Puntualidad</Text>
              </View>
            )}
          </View>
        )}

        {/* Modality tiles */}
        <View style={styles.modalityRow}>
          {(psychologist.modality === 'ONLINE' || psychologist.modality === 'BOTH') && (
            <View style={[styles.modalityTile, { backgroundColor: colors.jarillaSoft }]}>
              <Text style={[styles.modalityText, { color: '#3A5A1A' }]}>{'📹 Online'}</Text>
            </View>
          )}
          {(psychologist.modality === 'IN_PERSON' || psychologist.modality === 'BOTH') && (
            <View style={[styles.modalityTile, { backgroundColor: colors.cuyoWineSoft }]}>
              <Text style={[styles.modalityText, { color: colors.cuyoWine }]}>{'🏢 Presencial'}</Text>
            </View>
          )}
        </View>

        {/* Specialty tags */}
        {psychologist.tags != null && psychologist.tags.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Especialidades</Text>
            <View style={styles.tagsWrap}>
              {psychologist.tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Bio */}
        {psychologist.bio != null && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sobre mí</Text>
            <Text style={styles.bio}>{psychologist.bio}</Text>
          </View>
        )}

        {/* Address */}
        {psychologist.address != null && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Consultorio</Text>
            <View style={styles.addressRow}>
              <Text style={styles.addressPin}>📍</Text>
              <Text style={styles.addressText}>{psychologist.address}</Text>
            </View>
          </View>
        )}

        <View style={styles.divider} />

        {/* Pricing */}
        <View style={styles.priceRow}>
          <View>
            <Text style={styles.priceLabel}>Sesión individual</Text>
            <Text style={styles.priceSub}>50 minutos</Text>
          </View>
          <Text style={styles.priceValue}>${psychologist.session_price}</Text>
        </View>

        {/* Payment policy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Política de pago</Text>
          <View style={styles.policyCard}>
            <Text style={styles.policyIcon}>ℹ</Text>
            <Text style={styles.policyText}>
              {PAYMENT_POLICY_DESCRIPTION[psychologist.payment_policy] ?? psychologist.payment_policy}
            </Text>
          </View>
        </View>

        {/* CTA */}
        <TouchableOpacity style={styles.cta} onPress={handleReservar} activeOpacity={0.85}>
          <Text style={styles.ctaText}>{`Reservar turno · $${initialPay}`}</Text>
        </TouchableOpacity>
        <View style={styles.bottomSpacer} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cordilleraGray,
  },
  contentContainer: {
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cordilleraGray,
  },
  errorText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.base,
    color: colors.cuyoWine,
  },
  header: {
    backgroundColor: colors.summitBlue,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: 52,
  },
  headerTop: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  avatarWrap: {
    position: 'relative',
  },
  verifiedDot: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.jarillaGreen,
    borderWidth: 2.5,
    borderColor: colors.summitBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedIcon: {
    color: colors.white,
    fontSize: 10,
    fontWeight: fontWeight.bold,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.white,
  },
  headerMeta: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 3,
  },
  headerBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: spacing.sm,
  },
  headerChip: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  headerChipText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.xs,
    color: colors.white,
  },
  body: {
    backgroundColor: colors.white,
    borderRadius: 22,
    marginTop: -32,
    padding: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  statCell: {
    flex: 1,
    backgroundColor: colors.cordilleraGray,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  statNum: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.summitBlue,
  },
  statLabel: {
    fontFamily: fontFamily.body,
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 2,
  },
  modalityRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  modalityTile: {
    flex: 1,
    borderRadius: 8,
    padding: 10,
  },
  modalityText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textDark,
    marginBottom: spacing.sm,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: colors.summitSoft,
    borderRadius: 9999,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  tagText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.summitMid,
  },
  bio: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.md,
    color: colors.textMid,
    lineHeight: 20,
  },
  addressRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    backgroundColor: colors.cordilleraGray,
    borderRadius: 8,
    padding: 10,
  },
  addressPin: {
    fontSize: 14,
  },
  addressText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.md,
    color: colors.textDark,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(27,58,107,0.07)',
    marginVertical: spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.cordilleraGray,
    borderRadius: 8,
    padding: 12,
    marginBottom: spacing.md,
  },
  priceLabel: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  priceSub: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 1,
  },
  priceValue: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.summitBlue,
  },
  policyCard: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
    backgroundColor: colors.cordilleraGray,
    borderRadius: 8,
    padding: 10,
  },
  policyIcon: {
    fontSize: 14,
    color: colors.summitMid,
    marginTop: 1,
  },
  policyText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    color: colors.textMid,
    lineHeight: 18,
    flex: 1,
  },
  cta: {
    backgroundColor: colors.jarillaGreen,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  ctaText: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.white,
  },
  bottomSpacer: {
    height: spacing.lg,
  },
});
