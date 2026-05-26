import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';

import { fetchPsychologists } from '@/services/psychologistService';
import { queryKeys } from '@/services/queryKeys';
import type { SearchStackParamList } from '../search.types';

export function useMapScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<SearchStackParamList>>();

  const { data: psychologists, isLoading, error } = useQuery({
    queryKey: queryKeys.psychologists.list(),
    queryFn: fetchPsychologists,
  });

  const mappable = (psychologists ?? []).filter(
    (p) => p.latitude != null && p.longitude != null,
  );

  const handlePressPsychologist = (id: number) => {
    navigation.navigate('PsychologistProfile', { id });
  };

  return { mappable, isLoading, error, handlePressPsychologist };
}
