import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { colors } from '@/constants/colors';
import { fontFamily, fontSize, fontWeight } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { usePaymentScreen } from '../hooks/usePaymentScreen';

function formatDateTime(isoString: string): string {
  return new Date(isoString).toLocaleString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const PAYMENT_POLICY_DESCRIPTION: Record<string, (price: string) => string> = {
  TOTAL: (price) => `Pago total requerido: $${price}`,
  '50_DEPOSIT': (price) => `Anticipo 50%: $${(parseFloat(price) / 2).toFixed(2)}`,
  EXTERNAL: () => 'El pago se realiza en consultorio',
};

export function PaymentScreen() {
  const {
    psychologist,
    dateTime,
    isPsychologistLoading,
    isSubmitting,
    submitError,
    handleConfirm,
  } = usePaymentScreen();

  if (isPsychologistLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.summitBlue} />
      </View>
    );
  }

  if (!psychologist) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No se pudo cargar la información</Text>
      </View>
    );
  }

  const paymentDescription =
    PAYMENT_POLICY_DESCRIPTION[psychologist.payment_policy]?.(psychologist.session_price) ??
    psychologist.payment_policy;

  const isExternalPayment = psychologist.payment_policy === 'EXTERNAL';

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Resumen del turno</Text>
        <Text style={styles.psychologistName}>{psychologist.name}</Text>
        <Text style={styles.dateTime}>{formatDateTime(dateTime)}</Text>
        <Text style={styles.price}>${psychologist.session_price}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Forma de pago</Text>
        <Text style={styles.paymentDescription}>{paymentDescription}</Text>
        {!isExternalPayment && (
          <View style={styles.noticeBanner}>
            <Text style={styles.noticeText}>
              La pasarela de pago estará disponible próximamente. El turno quedará pendiente de pago.
            </Text>
          </View>
        )}
      </View>

      {submitError != null && <Text style={styles.errorText}>{submitError}</Text>}

      <View style={styles.spacer} />

      <TouchableOpacity
        style={[styles.confirmButton, isSubmitting && styles.confirmButtonDisabled]}
        onPress={handleConfirm}
        disabled={isSubmitting}
        activeOpacity={0.85}
      >
        {isSubmitting ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.confirmButtonText}>Reservar turno</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cordilleraGray,
    padding: spacing.md,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cordilleraGray,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textMuted,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  psychologistName: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  dateTime: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.base,
    color: colors.textMid,
    marginBottom: spacing.xs,
    textTransform: 'capitalize',
  },
  price: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.summitBlue,
  },
  paymentDescription: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.base,
    color: colors.textDark,
    marginBottom: spacing.sm,
  },
  noticeBanner: {
    backgroundColor: colors.cuyoWineSoft,
    borderRadius: 8,
    padding: spacing.sm,
  },
  noticeText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.md,
    color: colors.cuyoWine,
  },
  spacer: {
    flex: 1,
  },
  confirmButton: {
    backgroundColor: colors.summitBlue,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  confirmButtonDisabled: {
    backgroundColor: colors.textMuted,
  },
  confirmButtonText: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.white,
  },
  errorText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.base,
    color: colors.cuyoWine,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
});
