import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetchPsychologistTransactions } from '@/services/transactionService';
import { queryKeys } from '@/services/queryKeys';
import type { Transaction } from '@/types/transaction.types';

// TODO: replace with authenticated psychologist ID once auth is implemented
const CURRENT_PSYCHOLOGIST_ID = 1;

function getCurrentMonth(): string {
  return new Date().toISOString().substring(0, 7);
}

function getPrevMonth(month: string): string {
  const [year, m] = month.split('-').map(Number);
  const d = new Date(year, m - 2, 1);
  return d.toISOString().substring(0, 7);
}

function getNextMonth(month: string): string {
  const [year, m] = month.split('-').map(Number);
  const d = new Date(year, m, 1);
  return d.toISOString().substring(0, 7);
}

function formatMonthLabel(month: string): string {
  const [year, m] = month.split('-');
  const d = new Date(Number(year), Number(m) - 1, 1);
  return d.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
}

export function useFinancialDashboardScreen() {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  const {
    data: transactions = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.psychologists.transactions(CURRENT_PSYCHOLOGIST_ID, selectedMonth),
    queryFn: () => fetchPsychologistTransactions(CURRENT_PSYCHOLOGIST_ID, selectedMonth),
  });

  const successful = transactions.filter((t: Transaction) => t.status === 'SUCCESSFUL');
  const totalIncome = successful
    .reduce((sum: number, t: Transaction) => sum + parseFloat(t.amount), 0)
    .toFixed(2);

  return {
    transactions,
    isLoading,
    error,
    selectedMonth,
    monthLabel: formatMonthLabel(selectedMonth),
    totalIncome,
    sessionCount: successful.length,
    handlePrevMonth: () => setSelectedMonth(getPrevMonth(selectedMonth)),
    handleNextMonth: () => setSelectedMonth(getNextMonth(selectedMonth)),
    isCurrentMonth: selectedMonth === getCurrentMonth(),
  };
}
