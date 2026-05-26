import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const insets = useSafeAreaInsets();
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
      {/* Blue header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.xs }]}>
        <Text style={styles.headerTitle}>Confirmá tu turno</Text>
        <Text style={styles.headerSubtitle}>Revisá los detalles antes de reservar</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Appointment summary card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Resumen del turno</Text>
          <Text style={styles.psychologistName}>{psychologist.name}</Text>
          <Text style={styles.dateTime}>{formatDateTime(dateTime)}</Text>
          <Text style={styles.price}>${psychologist.session_price}</Text>
        </View>

        {/* Payment card */}
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
      </ScrollView>

      {/* Sticky footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm }]}>
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
  header: {
    backgroundColor: colors.summitBlue,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  headerTitle: {
    fontFamily: fontFamily.heading,
    fontSize: 19,
    fontWeight: fontWeight.bold,
    color: colors.white,
  },
  headerSubtitle: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingTop: spacing.md,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(27,58,107,0.07)',
  },
  sectionTitle: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
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
    marginBottom: spacing.sm,
    textTransform: 'capitalize',
  },
  price: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.xl,
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
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.cordilleraGray,
  },
  confirmButton: {
    backgroundColor: colors.summitBlue,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: colors.textMuted,
    opacity: 0.5,
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
