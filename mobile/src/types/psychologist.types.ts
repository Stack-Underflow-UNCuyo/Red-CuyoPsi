export type PsychologistModality = 'ONLINE' | 'IN_PERSON' | 'BOTH';

export interface Psychologist {
  id: number;
  name: string;
  specialty: string;
  session_price: string; // Decimal serialized as string by DRF
  payment_policy: 'TOTAL' | '50_DEPOSIT' | 'EXTERNAL';
  modality: PsychologistModality;
  rating: string | null; // Decimal serialized as string by DRF, null until reviews exist
  address?: string;
  latitude?: number;
  longitude?: number;
  // Extended display fields (optional until API adds them)
  initials?: string;
  color?: string;
  tags?: string[];
  bio?: string;
  registration?: string;
  reviews?: number;
  years?: number;
  patients?: number;
  punctuality?: number;
}
