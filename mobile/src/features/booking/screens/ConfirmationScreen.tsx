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
import { useConfirmationScreen } from '../hooks/useConfirmationScreen';

function formatDateTime(isoString: string): string {
  return new Date(isoString).toLocaleString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ConfirmationScreen() {
  const insets = useSafeAreaInsets();
  const {
    appointment,
    psychologist,
    isLoading,
    isConfirmed,
    paymentPending,
    handleGoHome,
  } = useConfirmationScreen();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.summitBlue} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Blue header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.xs }]}>
        <Text style={styles.headerTitle}>
          {isConfirmed ? '¡Turno confirmado!' : 'Turno reservado'}
        </Text>
        <Text style={styles.headerSubtitle}>
          {isConfirmed ? 'Tu sesión quedó agendada.' : 'Pago pendiente de confirmación.'}
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status icon */}
        <View style={styles.iconWrap}>
          <View style={[styles.iconCircle, isConfirmed ? styles.iconConfirmed : styles.iconPending]}>
            <Text style={styles.iconText}>{isConfirmed ? '✓' : '!'}</Text>
          </View>
          {paymentPending && (
            <Text style={styles.pendingLabel}>Pago pendiente</Text>
          )}
        </View>

        {/* Appointment card */}
        <View style={styles.card}>
          {psychologist != null && (
            <Text style={styles.psychologistName}>{psychologist.name}</Text>
          )}
          <Text style={styles.dateTime}>{formatDateTime(appointment.dateTime)}</Text>
          {paymentPending && (
            <View style={styles.noticeBanner}>
              <Text style={styles.noticeText}>
                La pasarela de pago estará disponible próximamente. Podrás completar el pago desde la sección de turnos.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sticky footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm }]}>
        <TouchableOpacity style={styles.homeButton} onPress={handleGoHome} activeOpacity={0.85}>
          <Text style={styles.homeButtonText}>Volver al inicio</Text>
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
    alignItems: 'center',
  },
  iconWrap: {
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  iconConfirmed: {
    backgroundColor: colors.jarillaGreen,
  },
  iconPending: {
    backgroundColor: colors.cuyoWine,
  },
  iconText: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.display,
    fontWeight: fontWeight.bold,
    color: colors.white,
  },
  pendingLabel: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.base,
    color: colors.cuyoWine,
    fontWeight: fontWeight.medium,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: spacing.md,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(27,58,107,0.07)',
  },
  psychologistName: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  dateTime: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.base,
    color: colors.textMid,
    textTransform: 'capitalize',
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
  homeButton: {
    backgroundColor: colors.summitBlue,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
  },
  homeButtonText: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.white,
  },
});
