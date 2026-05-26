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
import type { Transaction, TransactionStatus, TransactionType } from '@/types/transaction.types';
import { useFinancialDashboardScreen } from '../hooks/useFinancialDashboardScreen';

const TYPE_LABEL: Record<TransactionType, string> = {
  FULL_BOOKING: 'Pago total',
  '50_DEPOSIT': 'Anticipo 50%',
};

const STATUS_COLOR: Record<TransactionStatus, string> = {
  SUCCESSFUL: colors.jarillaGreen,
  FAILED: colors.cuyoWine,
  REFUNDED: colors.textMuted,
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
  return (
    <View style={rowStyles.row}>
      <View style={rowStyles.left}>
        <Text style={rowStyles.type}>{TYPE_LABEL[transaction.type]}</Text>
        <Text style={rowStyles.id}>Turno #{transaction.appointment_id}</Text>
      </View>
      <View style={rowStyles.right}>
        <Text style={rowStyles.amount}>${transaction.amount}</Text>
        <Text style={[rowStyles.status, { color: STATUS_COLOR[transaction.status] }]}>
          {STATUS_LABEL[transaction.status]}
        </Text>
      </View>
    </View>
  );
}

export function FinancialDashboardScreen() {
  const {
    transactions,
    isLoading,
    error,
    monthLabel,
    totalIncome,
    sessionCount,
    handlePrevMonth,
    handleNextMonth,
    isCurrentMonth,
  } = useFinancialDashboardScreen();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.summitBlue} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error al cargar el panel financiero</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.monthNav}>
        <TouchableOpacity onPress={handlePrevMonth} style={styles.navArrow} activeOpacity={0.7}>
          <Text style={styles.navArrowText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.monthLabel}>{monthLabel}</Text>
        <TouchableOpacity
          onPress={handleNextMonth}
          style={[styles.navArrow, isCurrentMonth && styles.navArrowDisabled]}
          activeOpacity={isCurrentMonth ? 1 : 0.7}
          disabled={isCurrentMonth}
        >
          <Text style={[styles.navArrowText, isCurrentMonth && styles.navArrowTextDisabled]}>
            {'>'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, styles.summaryCardLeft]}>
          <Text style={styles.summaryValue}>${totalIncome}</Text>
          <Text style={styles.summaryLabel}>Ingresos</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{sessionCount}</Text>
          <Text style={styles.summaryLabel}>Sesiones</Text>
        </View>
      </View>

      <Text style={styles.listTitle}>Transacciones</Text>

      <FlatList
        data={transactions}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <TransactionRow transaction={item} />}
        contentContainerStyle={transactions.length === 0 ? styles.emptyContainer : styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Sin transacciones este mes</Text>
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
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
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
    fontSize: fontSize.xl,
    color: colors.summitBlue,
    fontWeight: fontWeight.bold,
  },
  navArrowTextDisabled: {
    color: colors.textMuted,
  },
  monthLabel: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.textDark,
    textTransform: 'capitalize',
  },
  summaryRow: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.jarillaGreen,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
  },
  summaryCardLeft: {
    backgroundColor: colors.summitBlue,
  },
  summaryValue: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.white,
  },
  summaryLabel: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.md,
    color: colors.white,
    opacity: 0.85,
    marginTop: spacing.xs,
  },
  listTitle: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: spacing.md,
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
    borderRadius: 10,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flex: 1,
  },
  right: {
    alignItems: 'flex-end',
  },
  type: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.textDark,
  },
  id: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.md,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  amount: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.summitBlue,
  },
  status: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    marginTop: spacing.xs,
  },
});
