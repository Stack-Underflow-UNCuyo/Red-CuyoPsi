import { listPsychologists, getPsychologist } from '@/services/apiClient';
import type { Psychologist } from '@/types/psychologist.types';

export async function fetchPsychologists(): Promise<Psychologist[]> {
  return listPsychologists();
}

export async function fetchPsychologistById(id: number): Promise<Psychologist> {
  return getPsychologist(id);
}
