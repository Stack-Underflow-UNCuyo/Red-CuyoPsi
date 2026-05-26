import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
      <View style={styles.statusSection}>
        <View style={[styles.iconCircle, isConfirmed ? styles.iconConfirmed : styles.iconPending]}>
          <Text style={styles.iconText}>{isConfirmed ? '✓' : '!'}</Text>
        </View>
        <Text style={styles.statusTitle}>
          {isConfirmed ? '¡Turno confirmado!' : 'Turno reservado'}
        </Text>
        {paymentPending && <Text style={styles.statusSubtitle}>Pago pendiente</Text>}
      </View>

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

      <View style={styles.spacer} />

      <TouchableOpacity style={styles.homeButton} onPress={handleGoHome} activeOpacity={0.85}>
        <Text style={styles.homeButtonText}>Volver al inicio</Text>
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
  statusSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
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
  statusTitle: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  statusSubtitle: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.base,
    color: colors.cuyoWine,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
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
  },
  noticeBanner: {
    backgroundColor: colors.cuyoWineSoft,
    borderRadius: 8,
    padding: spacing.sm,
    marginTop: spacing.md,
  },
  noticeText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.md,
    color: colors.cuyoWine,
  },
  spacer: {
    flex: 1,
  },
  homeButton: {
    backgroundColor: colors.summitBlue,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  homeButtonText: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.white,
  },
});
