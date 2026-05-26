import axios, { AxiosError } from 'axios';

import type { Appointment, AppointmentStatus } from '@/types/appointment.types';
import type { Patient } from '@/types/patient.types';
import type { Psychologist } from '@/types/psychologist.types';
import type { SessionNote } from '@/types/session_note.types';
import type { Transaction } from '@/types/transaction.types';

const client = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// ── Psychologists ─────────────────────────────────────────────────────────────

export async function listPsychologists(): Promise<Psychologist[]> {
  const { data } = await client.get<Psychologist[]>('/psychologists/');
  return data;
}

export async function getPsychologist(id: number): Promise<Psychologist> {
  const { data } = await client.get<Psychologist>(`/psychologists/${id}/`);
  return data;
}

export async function createPsychologist(
  payload: Omit<Psychologist, 'id'>,
): Promise<Psychologist> {
  const { data } = await client.post<Psychologist>('/psychologists/', payload);
  return data;
}

export async function updatePsychologist(
  id: number,
  payload: Partial<Omit<Psychologist, 'id'>>,
): Promise<Psychologist> {
  const { data } = await client.patch<Psychologist>(`/psychologists/${id}/`, payload);
  return data;
}

export async function deletePsychologist(id: number): Promise<void> {
  await client.delete(`/psychologists/${id}/`);
}

// ── Patients ──────────────────────────────────────────────────────────────────

export async function listPatients(): Promise<Patient[]> {
  const { data } = await client.get<Patient[]>('/patients/');
  return data;
}

export async function getPatient(id: number): Promise<Patient> {
  const { data } = await client.get<Patient>(`/patients/${id}/`);
  return data;
}

export async function createPatient(payload: Omit<Patient, 'id'>): Promise<Patient> {
  const { data } = await client.post<Patient>('/patients/', payload);
  return data;
}

export async function updatePatient(
  id: number,
  payload: Partial<Omit<Patient, 'id'>>,
): Promise<Patient> {
  const { data } = await client.patch<Patient>(`/patients/${id}/`, payload);
  return data;
}

export async function deletePatient(id: number): Promise<void> {
  await client.delete(`/patients/${id}/`);
}

// ── Appointments ──────────────────────────────────────────────────────────────

interface AppointmentFilters {
  patient_id?: number;
  psychologist_id?: number;
  status?: AppointmentStatus;
}

export async function listAppointments(filters?: AppointmentFilters): Promise<Appointment[]> {
  const { data } = await client.get<Appointment[]>('/appointments/', { params: filters });
  return data;
}

export async function getAppointment(id: number): Promise<Appointment> {
  const { data } = await client.get<Appointment>(`/appointments/${id}/`);
  return data;
}

export async function createAppointment(
  payload: Omit<Appointment, 'id'>,
): Promise<Appointment> {
  const { data } = await client.post<Appointment>('/appointments/', payload);
  return data;
}

export async function updateAppointment(
  id: number,
  payload: Partial<Omit<Appointment, 'id'>>,
): Promise<Appointment> {
  const { data } = await client.patch<Appointment>(`/appointments/${id}/`, payload);
  return data;
}

export async function deleteAppointment(id: number): Promise<void> {
  await client.delete(`/appointments/${id}/`);
}

// ── Session Notes ─────────────────────────────────────────────────────────────

interface SessionNoteFilters {
  patient_id?: number;
  appointment_id?: number;
}

export async function listSessionNotes(filters?: SessionNoteFilters): Promise<SessionNote[]> {
  const { data } = await client.get<SessionNote[]>('/session-notes/', { params: filters });
  return data;
}

export async function getSessionNote(id: number): Promise<SessionNote> {
  const { data } = await client.get<SessionNote>(`/session-notes/${id}/`);
  return data;
}

export async function createSessionNote(
  payload: Omit<SessionNote, 'id'>,
): Promise<SessionNote> {
  const { data } = await client.post<SessionNote>('/session-notes/', payload);
  return data;
}

export async function updateSessionNote(
  id: number,
  payload: Partial<Omit<SessionNote, 'id'>>,
): Promise<SessionNote> {
  const { data } = await client.patch<SessionNote>(`/session-notes/${id}/`, payload);
  return data;
}

export async function deleteSessionNote(id: number): Promise<void> {
  await client.delete(`/session-notes/${id}/`);
}

// ── Transactions ──────────────────────────────────────────────────────────────

export async function listTransactions(appointmentId?: number): Promise<Transaction[]> {
  const { data } = await client.get<Transaction[]>('/transactions/', {
    params: appointmentId !== undefined ? { appointment_id: appointmentId } : undefined,
  });
  return data;
}

export async function getTransaction(id: number): Promise<Transaction> {
  const { data } = await client.get<Transaction>(`/transactions/${id}/`);
  return data;
}

export async function createTransaction(
  payload: Omit<Transaction, 'id'>,
): Promise<Transaction> {
  const { data } = await client.post<Transaction>('/transactions/', payload);
  return data;
}

export async function updateTransaction(
  id: number,
  payload: Partial<Omit<Transaction, 'id'>>,
): Promise<Transaction> {
  const { data } = await client.patch<Transaction>(`/transactions/${id}/`, payload);
  return data;
}

export async function deleteTransaction(id: number): Promise<void> {
  await client.delete(`/transactions/${id}/`);
}

// ── Frontend-specific endpoints ───────────────────────────────────────────────

export async function getPsychologistAvailability(
  id: number,
  dateFrom: string,
  dateTo: string,
): Promise<unknown[]> {
  const { data } = await client.get<unknown[]>(`/psychologists/${id}/availability/`, {
    params: { date_from: dateFrom, date_to: dateTo },
  });
  return data;
}

export async function getPsychologistTransactions(
  id: number,
  month?: string,
): Promise<Transaction[]> {
  const { data } = await client.get<Transaction[]>(`/psychologists/${id}/transactions/`, {
    params: month !== undefined ? { month } : undefined,
  });
  return data;
}

export async function listPatientAppointments(
  patientId: number,
  status?: AppointmentStatus,
): Promise<Appointment[]> {
  return listAppointments({ patient_id: patientId, status });
}

export async function listPatientSessionNotes(patientId: number): Promise<SessionNote[]> {
  return listSessionNotes({ patient_id: patientId });
}

export async function cancelAppointment(id: number): Promise<Appointment> {
  const { data } = await client.patch<Appointment>(`/appointments/${id}/cancel/`);
  return data;
}

export async function confirmAppointment(id: number): Promise<Appointment> {
  const { data } = await client.patch<Appointment>(`/appointments/${id}/confirm/`);
  return data;
}

// ── Deferred endpoints — HTTP 501 stubs ──────────────────────────────────────

function is501(error: unknown): boolean {
  return error instanceof AxiosError && error.response?.status === 501;
}

export async function initiatePayment(payload: unknown): Promise<void> {
  try {
    await client.post('/payments/initiate/', payload);
  } catch (error) {
    if (is501(error)) {
      console.warn('[DEBUG][apiClient] /payments/initiate/ — not implemented yet (HTTP 501)');
      return;
    }
    throw error;
  }
}

export async function paymentWebhook(payload: unknown): Promise<void> {
  try {
    await client.post('/payments/webhook/', payload);
  } catch (error) {
    if (is501(error)) {
      console.warn('[DEBUG][apiClient] /payments/webhook/ — not implemented yet (HTTP 501)');
      return;
    }
    throw error;
  }
}

export async function listNearbyPsychologists(): Promise<Psychologist[]> {
  try {
    const { data } = await client.get<Psychologist[]>('/psychologists/nearby/');
    return data;
  } catch (error) {
    if (is501(error)) {
      console.warn('[DEBUG][apiClient] /psychologists/nearby/ — not implemented yet (HTTP 501)');
      return [];
    }
    throw error;
  }
}
