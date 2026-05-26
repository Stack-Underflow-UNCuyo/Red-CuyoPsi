import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';

import { fetchSessionNotesByPatient } from '@/services/sessionNoteService';
import { fetchPatientById } from '@/services/patientService';
import { queryKeys } from '@/services/queryKeys';
import type { ProfileStackParamList } from '@/types/navigation.types';

export function usePatientRecordScreen() {
  const route = useRoute<RouteProp<ProfileStackParamList, 'PatientRecord'>>();
  const { patientId } = route.params;

  const { data: patient } = useQuery({
    queryKey: queryKeys.patients.detail(patientId),
    queryFn: () => fetchPatientById(patientId),
  });

  const {
    data: sessionNotes = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.sessionNotes.byPatient(patientId),
    queryFn: () => fetchSessionNotesByPatient(patientId),
  });

  const sortedNotes = [...sessionNotes].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return { patient, sessionNotes: sortedNotes, isLoading, error };
}
