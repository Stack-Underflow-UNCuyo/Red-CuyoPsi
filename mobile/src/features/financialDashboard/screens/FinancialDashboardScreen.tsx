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
import { Avatar, avatarColor } from '@/components/ui/Avatar';
import type { Transaction, TransactionStatus, TransactionType } from '@/types/transaction.types';
import { useFinancialDashboardScreen } from '../hooks/useFinancialDashboardScreen';

const TYPE_LABEL: Record<TransactionType, string> = {
  FULL_BOOKING: 'Pago total',
  '50_DEPOSIT': 'Anticipo 50%',
};

const STATUS_COLOR: Record<TransactionStatus, { bg: string; fg: string }> = {
  SUCCESSFUL: { bg: colors.jarillaSoft, fg: '#3A5A1A' },
  FAILED: { bg: colors.cuyoWineSoft, fg: colors.cuyoWine },
  REFUNDED: { bg: colors.cordilleraGray, fg: colors.textMuted },
};

const STATUS_LABEL: Record<TransactionStatus, string> = {
  SUCCESSFUL: 'Acreditado',
  FAILED: 'Fallido',
  REFUNDED: 'Reembolsado',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
  });
}

function TransactionRow({ transaction }: { transaction: Transaction }) {
  const st = STATUS_COLOR[transaction.status];
  const label = `T${transaction.appointment_id}`;
  const bg = transaction.status === 'SUCCESSFUL' ? colors.jarillaGreen : colors.summitMid;

  return (
    <View style={rowStyles.row}>
      <Avatar initials={label} bg={bg} size={40} borderRadius={10} />
      <View style={rowStyles.body}>
        <Text style={rowStyles.type}>{TYPE_LABEL[transaction.type]}</Text>
        <Text style={rowStyles.meta}>{'Turno #'}{transaction.appointment_id}</Text>
      </View>
      <View style={rowStyles.right}>
        <Text style={rowStyles.amount}>${transaction.amount}</Text>
        <View style={[rowStyles.badge, { backgroundColor: st.bg }]}>
          <Text style={[rowStyles.badgeText, { color: st.fg }]}>
            {STATUS_LABEL[transaction.status]}
          </Text>
        </View>
      </View>
    </View>
  );
}

export function FinancialDashboardScreen() {
  const {
    transactions,
    isLoading,
    error,
    isRefreshing,
    onRefresh,
    monthLabel,
    totalIncome,
    sessionCount,
    handlePrevMonth,
    handleNextMonth,
    isCurrentMonth,
  } = useFinancialDashboardScreen();

  const refundCount = transactions.filter((t: Transaction) => t.status === 'REFUNDED').length;

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.summitBlue} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="Panel financiero" subtitle="Ingresos y transacciones">
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Disponible para retirar</Text>
          <Text style={styles.balanceAmount}>${totalIncome}</Text>
          <Text style={styles.balancePeriod}>{monthLabel}</Text>
        </View>
      </ScreenHeader>

      {/* Month switcher */}
      <View style={styles.monthNav}>
        <TouchableOpacity onPress={handlePrevMonth} style={styles.navArrow} activeOpacity={0.7}>
          <Text style={styles.navArrowText}>{'‹'}</Text>
        </TouchableOpacity>
        <Text style={styles.monthLabel}>{monthLabel}</Text>
        <TouchableOpacity
          onPress={handleNextMonth}
          style={[styles.navArrow, isCurrentMonth && styles.navArrowDisabled]}
          activeOpacity={isCurrentMonth ? 1 : 0.7}
          disabled={isCurrentMonth}
        >
          <Text style={[styles.navArrowText, isCurrentMonth && styles.navArrowTextDisabled]}>
            {'›'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>${totalIncome}</Text>
          <Text style={styles.statLabel}>Ingresos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{sessionCount}</Text>
          <Text style={styles.statLabel}>Sesiones</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{refundCount}</Text>
          <Text style={styles.statLabel}>Reembolsos</Text>
        </View>
      </View>

      <FlatList
        data={transactions}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <TransactionRow transaction={item} />}
        contentContainerStyle={transactions.length === 0 ? styles.emptyContainer : styles.list}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[colors.summitBlue]}
            tintColor={colors.summitBlue}
          />
        }
        ListHeaderComponent={
          transactions.length > 0 ? (
            <Text style={styles.listTitle}>Transacciones</Text>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={error ? styles.errorText : styles.emptyText}>
              {error ? 'Error al cargar el panel financiero' : 'Sin transacciones este mes'}
            </Text>
          </View>
        }
      />
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
  },
  balanceCard: {
    marginTop: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderRadius: 14,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  balanceLabel: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.7)',
  },
  balanceAmount: {
    fontFamily: fontFamily.heading,
    fontSize: 28,
    fontWeight: fontWeight.bold,
    color: colors.white,
    marginTop: 4,
  },
  balancePeriod: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.xs,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.cordilleraGray,
  },
  navArrow: {
    padding: spacing.sm,
  },
  navArrowDisabled: {
    opacity: 0.3,
  },
  navArrowText: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.xxl,
    color: colors.summitBlue,
    fontWeight: fontWeight.bold,
  },
  navArrowTextDisabled: {
    color: colors.textMuted,
  },
  monthLabel: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textDark,
    textTransform: 'capitalize',
  },
  statsRow: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(27,58,107,0.07)',
  },
  statValue: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.summitBlue,
  },
  statLabel: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  listTitle: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: spacing.xl,
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

const rowStyles = StyleSheet.create({
  row: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(27,58,107,0.07)',
  },
  body: {
    flex: 1,
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
  },
  type: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.textDark,
  },
  meta: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  amount: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.summitBlue,
  },
  badge: {
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  badgeText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
});
