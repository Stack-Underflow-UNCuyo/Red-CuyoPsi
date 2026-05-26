export type TransactionType = 'FULL_BOOKING' | '50_DEPOSIT';
export type TransactionStatus = 'SUCCESSFUL' | 'FAILED' | 'REFUNDED';

export interface Transaction {
  id: number;
  appointment_id: number;
  amount: string; // Decimal serialized as string by DRF
  type: TransactionType;
  status: TransactionStatus;
}
