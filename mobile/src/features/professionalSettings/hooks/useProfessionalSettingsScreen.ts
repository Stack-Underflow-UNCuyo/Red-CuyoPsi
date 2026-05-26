import { useQuery } from '@tanstack/react-query';

import { fetchPsychologistById } from '@/services/psychologistService';
import { queryKeys } from '@/services/queryKeys';

// TODO: replace with authenticated psychologist ID once auth is implemented
const CURRENT_PSYCHOLOGIST_ID = 1;

export function useProfessionalSettingsScreen() {
  const { data: psychologist, isLoading, error } = useQuery({
    queryKey: queryKeys.psychologists.detail(CURRENT_PSYCHOLOGIST_ID),
    queryFn: () => fetchPsychologistById(CURRENT_PSYCHOLOGIST_ID),
  });

  return { psychologist, isLoading, error };
}
