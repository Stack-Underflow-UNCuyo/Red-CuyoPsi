import { createAppointment, confirmAppointment, initiatePayment } from '@/services/apiClient';
import type { Appointment } from '@/types/appointment.types';

export type CreateAppointmentPayload = Omit<Appointment, 'id'>;

export async function createAppointmentBooking(
  payload: CreateAppointmentPayload,
): Promise<Appointment> {
  return createAppointment(payload);
}

export async function confirmAppointmentBooking(id: number): Promise<Appointment> {
  return confirmAppointment(id);
}

// initiatePayment swallows HTTP 501 internally — safe to call while payment gateway is deferred
export async function initiatePaymentBooking(appointmentId: number): Promise<void> {
  return initiatePayment({ appointment_id: appointmentId });
}
