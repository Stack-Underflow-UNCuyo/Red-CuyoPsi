export interface Psychologist {
  id: number;
  name: string;
  specialty: string;
  session_price: string; // Decimal serialized as string by DRF
  payment_policy: 'TOTAL' | '50_DEPOSIT' | 'EXTERNAL';
  address?: string;
  latitude?: number;
  longitude?: number;
}
