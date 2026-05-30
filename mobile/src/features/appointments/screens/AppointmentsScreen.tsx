import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { colors } from '@/constants/colors';
import { fontFamily, fontSize, fontWeight } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Avatar, avatarColor, initialsFromName } from '@/components/ui/Avatar';
import type { Appointment, AppointmentPaymentStatus, AppointmentStatus } from '@/types/appointment.types';
import type { Psychologist } from '@/types/psychologist.types';
import { useAppointmentsScreen, AppointmentTab } from '../hooks/useAppointmentsScreen';

const STATUS_COLOR: Record<AppointmentStatus, { bg: string; fg: string }> = {
  PENDING: { bg: '#FFF3DC', fg: '#A06000' },
  CONFIRMED: { bg: colors.jarillaSoft, fg: '#3A5A1A' },
  CANCELED: { bg: colors.cordilleraGray, fg: colors.textMuted },
};

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  PENDING: 'Pendiente pago',
  CONFIRMED: 'Confirmado',
  CANCELED: 'Cancelado',
};

const PAYMENT_LABEL: Record<AppointmentPaymentStatus, string> = {
  PENDING: 'Pago pendiente',
  PARTIALLY_PAID: 'Anticipo pagado',
  FULLY_PAID: 'Pagado',
};

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('es-AR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
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
  const st = STATUS_COLOR[appointment.status];
  const initials = psychologist
    ? (psychologist.initials ?? initialsFromName(psychologist.name))
    : '?';
  const bg = psychologist?.color ?? avatarColor(initials);

  return (
    <View style={cardStyles.card}>
      <TouchableOpacity style={cardStyles.top} activeOpacity={0.85}>
        <Avatar initials={initials} bg={bg} size={42} borderRadius={8} />
        <View style={cardStyles.info}>
          <View style={cardStyles.headerRow}>
            <Text style={cardStyles.name} numberOfLines={1}>
              {psychologist?.name ?? 'Profesional'}
            </Text>
            <View style={[cardStyles.statusBadge, { backgroundColor: st.bg }]}>
              <Text style={[cardStyles.statusText, { color: st.fg }]}>
                {STATUS_LABEL[appointment.status]}
              </Text>
            </View>
          </View>
          <Text style={cardStyles.specialty}>
            {psychologist?.specialty ?? ''}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={cardStyles.meta}>
        <Text style={cardStyles.dateTime}>📅 {formatDateTime(appointment.date_time)}</Text>
        <Text style={[cardStyles.paymentText, {
          color: appointment.payment_status !== 'PENDING'
            ? colors.jarillaGreen
            : appointment.status === 'PENDING' ? '#A06000' : colors.textMuted,
        }]}>
          {PAYMENT_LABEL[appointment.payment_status]}
        </Text>
      </View>

      {showCancel && (
        <View style={cardStyles.actions}>
          <TouchableOpacity
            style={cardStyles.cancelButton}
            onPress={() => onCancel(appointment.id)}
            activeOpacity={0.8}
          >
            <Text style={cardStyles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}
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
    isRefreshing,
    onRefresh,
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
      <ScreenHeader
        title="Mis turnos"
        subtitle={`${counts.upcoming + counts.past + counts.cancelled} turnos en total`}
      >
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
      </ScreenHeader>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.summitBlue} />
        </View>
      ) : (
        <FlatList
          data={displayedAppointments}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={displayedAppointments.length === 0 ? styles.listEmpty : styles.list}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={[colors.summitBlue]}
              tintColor={colors.summitBlue}
            />
          }
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={error ? styles.errorText : styles.emptyText}>
                {error ? 'Error al cargar turnos' : 'No hay turnos en esta sección'}
              </Text>
            </View>
          }
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
    marginTop: spacing.sm,
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 9999,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 7,
    paddingHorizontal: spacing.xs,
    borderRadius: 9999,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.white,
  },
  tabText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: 'rgba(255,255,255,0.65)',
  },
  tabTextActive: {
    color: colors.summitBlue,
    fontWeight: fontWeight.bold,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    padding: spacing.md,
  },
  listEmpty: {
    flexGrow: 1,
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
    borderRadius: 14,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(27,58,107,0.07)',
    shadowColor: colors.textDark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  top: {
    flexDirection: 'row',
    gap: 12,
    padding: 13,
    alignItems: 'flex-start',
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 6,
  },
  name: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textDark,
    flex: 1,
  },
  statusBadge: {
    borderRadius: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    flexShrink: 0,
  },
  statusText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
  specialty: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 3,
  },
  meta: {
    backgroundColor: colors.cordilleraGray,
    paddingHorizontal: 14,
    paddingVertical: 9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  dateTime: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    color: colors.textMid,
    textTransform: 'capitalize',
  },
  paymentText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: 10,
    paddingHorizontal: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(27,58,107,0.05)',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 9999,
    borderWidth: 1.5,
    borderColor: 'rgba(27,58,107,0.2)',
    alignItems: 'center',
  },
  cancelText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textMid,
  },
});
