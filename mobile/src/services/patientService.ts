import { getPatient, updatePatient } from '@/services/apiClient';
import type { Patient } from '@/types/patient.types';

export async function fetchPatientById(id: number): Promise<Patient> {
  return getPatient(id);
}

export async function patchPatient(
  id: number,
  payload: Partial<Omit<Patient, 'id'>>,
): Promise<Patient> {
  return updatePatient(id, payload);
}
