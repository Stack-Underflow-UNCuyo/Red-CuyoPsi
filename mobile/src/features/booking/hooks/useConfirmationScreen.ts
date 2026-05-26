import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';

import { fetchPsychologistById } from '@/services/psychologistService';
import { queryKeys } from '@/services/queryKeys';
import type { BookingStackParamList, SearchStackParamList } from '@/types/navigation.types';

export function useConfirmationScreen() {
  const route = useRoute<RouteProp<BookingStackParamList, 'Confirmation'>>();
  const navigation = useNavigation<NativeStackNavigationProp<BookingStackParamList>>();
  const { appointmentId, dateTime, psychologistId, status, paymentStatus } = route.params;

  const { data: psychologist, isLoading } = useQuery({
    queryKey: queryKeys.psychologists.detail(psychologistId),
    queryFn: () => fetchPsychologistById(psychologistId),
  });

  const handleGoHome = () => {
    // Navigate to Search in the parent SearchStack, clearing the booking flow
    navigation
      .getParent<NativeStackNavigationProp<SearchStackParamList>>()
      ?.navigate('Search');
  };

  return {
    appointment: { id: appointmentId, dateTime, status, paymentStatus },
    psychologist,
    isLoading,
    isConfirmed: status === 'CONFIRMED',
    paymentPending: paymentStatus === 'PENDING',
    handleGoHome,
  };
}
