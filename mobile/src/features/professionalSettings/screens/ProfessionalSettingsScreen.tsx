import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { colors } from '@/constants/colors';
import { fontFamily, fontSize, fontWeight } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { useProfessionalSettingsScreen } from '../hooks/useProfessionalSettingsScreen';

const MODALITY_LABEL: Record<string, string> = {
  ONLINE: 'Online',
  IN_PERSON: 'Presencial',
  BOTH: 'Presencial / Online',
};

const PAYMENT_POLICY_LABEL: Record<string, string> = {
  TOTAL: 'Pago total (100%)',
  '50_DEPOSIT': 'Anticipo 50%',
  EXTERNAL: 'Pago en consultorio',
};

export function ProfessionalSettingsScreen() {
  const { psychologist, isLoading, error } = useProfessionalSettingsScreen();

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
        <Text style={styles.errorText}>No se pudo cargar la configuración</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Perfil público</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Nombre</Text>
          <Text style={styles.rowValue}>{psychologist.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Especialidad</Text>
          <Text style={styles.rowValue}>{psychologist.specialty}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Modalidad</Text>
          <Text style={styles.rowValue}>{MODALITY_LABEL[psychologist.modality] ?? psychologist.modality}</Text>
        </View>
        {psychologist.address != null && (
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Consultorio</Text>
            <Text style={styles.rowValue}>{psychologist.address}</Text>
          </View>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Tarifas y pagos</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Honorario</Text>
          <Text style={[styles.rowValue, styles.price]}>${psychologist.session_price}</Text>
        </View>
        <View style={styles.rowLast}>
          <Text style={styles.rowLabel}>Política de pago</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {PAYMENT_POLICY_LABEL[psychologist.payment_policy] ?? psychologist.payment_policy}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Ubicación</Text>
        {psychologist.latitude != null && psychologist.longitude != null ? (
          <View style={styles.rowLast}>
            <Text style={styles.rowLabel}>Coordenadas</Text>
            <Text style={styles.rowValue}>
              {psychologist.latitude.toFixed(4)}, {psychologist.longitude.toFixed(4)}
            </Text>
          </View>
        ) : (
          <Text style={styles.mutedNote}>Sin ubicación configurada</Text>
        )}
      </View>

      <View style={styles.noticeBanner}>
        <Text style={styles.noticeText}>
          La edición del perfil estará disponible en la próxima versión.
        </Text>
      </View>
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
  errorText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.base,
    color: colors.cuyoWine,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.cordilleraGray,
  },
  rowLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    marginBottom: spacing.xs,
  },
  rowLabel: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.base,
    color: colors.textMuted,
  },
  rowValue: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.base,
    color: colors.textDark,
    fontWeight: fontWeight.medium,
    flex: 1,
    textAlign: 'right',
    marginLeft: spacing.md,
  },
  price: {
    color: colors.summitBlue,
    fontFamily: fontFamily.heading,
    fontWeight: fontWeight.bold,
  },
  badge: {
    backgroundColor: colors.summitSoft,
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  badgeText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.summitMid,
  },
  mutedNote: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.base,
    color: colors.textMuted,
    paddingVertical: spacing.sm,
  },
  noticeBanner: {
    backgroundColor: colors.summitSoft,
    borderRadius: 8,
    padding: spacing.sm,
  },
  noticeText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.md,
    color: colors.summitMid,
    textAlign: 'center',
  },
});
