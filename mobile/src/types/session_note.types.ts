export interface SessionNote {
  id: number;
  appointment_id: number;
  patient_id: number;
  date: string; // ISO 8601 UTC string
  encrypted_content: string;
}
