export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELED';
export type AppointmentPaymentStatus = 'PENDING' | 'PARTIALLY_PAID' | 'FULLY_PAID';

export interface Appointment {
  id: number;
  psychologist_id: number;
  patient_id: number;
  date_time: string; // ISO 8601 UTC string — frontend handles timezone conversion
  status: AppointmentStatus;
  payment_status: AppointmentPaymentStatus;
}
