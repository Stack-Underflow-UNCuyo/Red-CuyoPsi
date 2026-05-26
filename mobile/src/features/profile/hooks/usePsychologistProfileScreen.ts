import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';

import { fetchPsychologistById } from '@/services/psychologistService';
import { queryKeys } from '@/services/queryKeys';
import type { SearchStackParamList } from '@/types/navigation.types';

export function usePsychologistProfileScreen() {
  const route = useRoute<RouteProp<SearchStackParamList, 'PsychologistProfile'>>();
  const navigation = useNavigation<NativeStackNavigationProp<SearchStackParamList>>();
  const { id } = route.params;

  const { data: psychologist, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: queryKeys.psychologists.detail(id),
    queryFn: () => fetchPsychologistById(id),
  });

  const handleReservar = () => {
    navigation.navigate('Booking', {
      screen: 'Calendar',
      params: { psychologistId: id },
    });
  };

  return { psychologist, isLoading, error, isRefreshing: isRefetching, onRefresh: refetch, handleReservar };
}
