import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { colors } from '@/constants/colors';
import { fontFamily, fontSize, fontWeight } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import type { Appointment, AppointmentPaymentStatus, AppointmentStatus } from '@/types/appointment.types';
import type { Psychologist } from '@/types/psychologist.types';
import { useAppointmentsScreen, AppointmentTab } from '../hooks/useAppointmentsScreen';

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  CANCELED: 'Cancelado',
};

const STATUS_COLOR: Record<AppointmentStatus, string> = {
  PENDING: colors.cuyoWine,
  CONFIRMED: colors.jarillaGreen,
  CANCELED: colors.textMuted,
};

const PAYMENT_LABEL: Record<AppointmentPaymentStatus, string> = {
  PENDING: 'Pago pendiente',
  PARTIALLY_PAID: 'Anticipo pagado',
  FULLY_PAID: 'Pagado',
};

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface AppointmentCardProps {
  appointment: Appointment;
  psychologist: Psychologist | undefined;
  showCancel: boolean;
  onCancel: (id: number) => void;
}

function AppointmentCard({ appointment, psychologist, showCancel, onCancel }: AppointmentCardProps) {
  return (
    <View style={cardStyles.card}>
      <View style={cardStyles.header}>
        <Text style={cardStyles.name} numberOfLines={1}>
          {psychologist?.name ?? 'Profesional'}
        </Text>
        <View style={[cardStyles.statusBadge, { backgroundColor: STATUS_COLOR[appointment.status] + '22' }]}>
          <Text style={[cardStyles.statusText, { color: STATUS_COLOR[appointment.status] }]}>
            {STATUS_LABEL[appointment.status]}
          </Text>
        </View>
      </View>
      <Text style={cardStyles.specialty}>{psychologist?.specialty ?? ''}</Text>
      <Text style={cardStyles.dateTime}>{formatDateTime(appointment.date_time)}</Text>
      <View style={cardStyles.footer}>
        <Text style={cardStyles.payment}>{PAYMENT_LABEL[appointment.payment_status]}</Text>
        {showCancel && (
          <TouchableOpacity
            style={cardStyles.cancelButton}
            onPress={() => onCancel(appointment.id)}
            activeOpacity={0.8}
          >
            <Text style={cardStyles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const TABS: { key: AppointmentTab; label: string }[] = [
  { key: 'upcoming', label: 'Próximos' },
  { key: 'past', label: 'Pasados' },
  { key: 'cancelled', label: 'Cancelados' },
];

export function AppointmentsScreen() {
  const {
    activeTab,
    setActiveTab,
    displayedAppointments,
    counts,
    psychologistMap,
    isLoading,
    error,
    handleCancel,
  } = useAppointmentsScreen();

  const renderItem = ({ item }: { item: Appointment }) => (
    <AppointmentCard
      appointment={item}
      psychologist={psychologistMap[item.psychologist_id]}
      showCancel={activeTab === 'upcoming'}
      onCancel={handleCancel}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {TABS.map(({ key, label }) => (
          <TouchableOpacity
            key={key}
            style={[styles.tab, activeTab === key && styles.tabActive]}
            onPress={() => setActiveTab(key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === key && styles.tabTextActive]}>
              {label}
              {counts[key] > 0 ? ` (${counts[key]})` : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.summitBlue} />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>Error al cargar turnos</Text>
        </View>
      ) : displayedAppointments.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No hay turnos en esta sección</Text>
        </View>
      ) : (
        <FlatList
          data={displayedAppointments}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cordilleraGray,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.cordilleraGray,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.summitBlue,
  },
  tabText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.summitBlue,
    fontWeight: fontWeight.semibold,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    padding: spacing.md,
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
  statusBadge: {
    borderRadius: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginLeft: spacing.sm,
  },
  statusText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  specialty: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.md,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  dateTime: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.base,
    color: colors.textMid,
    textTransform: 'capitalize',
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  payment: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.md,
    color: colors.textMuted,
  },
  cancelButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cuyoWine,
  },
  cancelText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.cuyoWine,
  },
});
