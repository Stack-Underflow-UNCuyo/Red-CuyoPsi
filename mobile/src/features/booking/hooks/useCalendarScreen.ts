import { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';

import { fetchPsychologistAvailability } from '@/services/psychologistService';
import { queryKeys } from '@/services/queryKeys';
import type { BookingStackParamList } from '@/types/navigation.types';

// TODO: remove once availability endpoint is implemented
const DEFAULT_TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

function toISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function generateNextDays(count: number): string[] {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return toISODate(d);
  });
}

export function useCalendarScreen() {
  const route = useRoute<RouteProp<BookingStackParamList, 'Calendar'>>();
  const navigation = useNavigation<NativeStackNavigationProp<BookingStackParamList>>();
  const { psychologistId } = route.params;

  const availableDates = generateNextDays(7);
  const [selectedDate, setSelectedDate] = useState(availableDates[0]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const { data: apiSlots, isLoading } = useQuery({
    queryKey: queryKeys.psychologists.availability(psychologistId, selectedDate, selectedDate),
    queryFn: () => fetchPsychologistAvailability(psychologistId, selectedDate, selectedDate),
  });

  // API returns [] while availability endpoint is stubbed — fall back to default time slots
  const displaySlots =
    apiSlots && apiSlots.length > 0
      ? (apiSlots as string[])
      : DEFAULT_TIME_SLOTS.map((t) => `${selectedDate}T${t}:00`);

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSelectSlot = (slot: string) => setSelectedSlot(slot);

  const handleConfirm = () => {
    if (!selectedSlot) return;
    navigation.navigate('Payment', { psychologistId, dateTime: selectedSlot });
  };

  return {
    availableDates,
    selectedDate,
    displaySlots,
    selectedSlot,
    isLoading,
    handleSelectDate,
    handleSelectSlot,
    handleConfirm,
  };
}
