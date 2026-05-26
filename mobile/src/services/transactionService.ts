import { getPsychologistTransactions } from '@/services/apiClient';
import type { Transaction } from '@/types/transaction.types';

export async function fetchPsychologistTransactions(
  id: number,
  month?: string,
): Promise<Transaction[]> {
  return getPsychologistTransactions(id, month);
}
