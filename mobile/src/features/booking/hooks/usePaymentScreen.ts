import { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';

import {
  createAppointmentBooking,
  confirmAppointmentBooking,
  initiatePaymentBooking,
} from '@/services/bookingService';
import { fetchPsychologistById } from '@/services/psychologistService';
import { queryKeys } from '@/services/queryKeys';
import type { BookingStackParamList } from '@/types/navigation.types';

export function usePaymentScreen() {
  const route = useRoute<RouteProp<BookingStackParamList, 'Payment'>>();
  const navigation = useNavigation<NativeStackNavigationProp<BookingStackParamList>>();
  const { psychologistId, dateTime } = route.params;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: psychologist, isLoading: isPsychologistLoading } = useQuery({
    queryKey: queryKeys.psychologists.detail(psychologistId),
    queryFn: () => fetchPsychologistById(psychologistId),
  });

  const handleConfirm = async () => {
    if (!psychologist) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // TODO: replace patient_id with authenticated patient ID once auth is implemented
      const appointment = await createAppointmentBooking({
        psychologist_id: psychologistId,
        patient_id: 1,
        date_time: dateTime,
        status: 'PENDING',
        payment_status: 'PENDING',
      });

      if (psychologist.payment_policy === 'EXTERNAL') {
        // No payment required — confirm directly
        const confirmed = await confirmAppointmentBooking(appointment.id);
        navigation.navigate('Confirmation', {
          appointmentId: confirmed.id,
          dateTime: confirmed.date_time,
          psychologistId,
          status: confirmed.status,
          paymentStatus: confirmed.payment_status,
        });
      } else {
        // TOTAL or 50_DEPOSIT — initiate payment (swallows HTTP 501, appointment stays PENDING)
        await initiatePaymentBooking(appointment.id);
        navigation.navigate('Confirmation', {
          appointmentId: appointment.id,
          dateTime: appointment.date_time,
          psychologistId,
          status: appointment.status,
          paymentStatus: appointment.payment_status,
        });
      }
    } catch {
      setSubmitError('Error al procesar la reserva. Intentá de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    psychologist,
    dateTime,
    isPsychologistLoading,
    isSubmitting,
    submitError,
    handleConfirm,
  };
}
