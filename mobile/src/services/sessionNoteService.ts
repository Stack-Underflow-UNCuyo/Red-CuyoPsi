import { listPatientSessionNotes } from '@/services/apiClient';
import type { SessionNote } from '@/types/session_note.types';

export async function fetchSessionNotesByPatient(patientId: number): Promise<SessionNote[]> {
  return listPatientSessionNotes(patientId);
}
