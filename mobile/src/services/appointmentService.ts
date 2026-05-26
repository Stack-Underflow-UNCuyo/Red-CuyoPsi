import {
  listAppointments,
  cancelAppointment,
  confirmAppointment,
} from '@/services/apiClient';
import type { Appointment, AppointmentStatus } from '@/types/appointment.types';

export async function fetchPatientAppointments(
  patientId: number,
  status?: AppointmentStatus,
): Promise<Appointment[]> {
  return listAppointments({ patient_id: patientId, status });
}

export { cancelAppointment, confirmAppointment };
