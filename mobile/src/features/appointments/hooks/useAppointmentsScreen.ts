import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchPatientAppointments, cancelAppointment } from '@/services/appointmentService';
import { fetchPsychologists } from '@/services/psychologistService';
import { queryKeys } from '@/services/queryKeys';
import type { Appointment } from '@/types/appointment.types';
import type { Psychologist } from '@/types/psychologist.types';

// TODO: replace with authenticated patient ID once auth is implemented
const CURRENT_PATIENT_ID = 1;

export type AppointmentTab = 'upcoming' | 'past' | 'cancelled';

function groupByTab(appointments: Appointment[]): Record<AppointmentTab, Appointment[]> {
  const now = new Date();
  return {
    upcoming: appointments.filter(
      (a) => a.status !== 'CANCELED' && new Date(a.date_time) >= now,
    ),
    past: appointments.filter(
      (a) => a.status !== 'CANCELED' && new Date(a.date_time) < now,
    ),
    cancelled: appointments.filter((a) => a.status === 'CANCELED'),
  };
}

export function useAppointmentsScreen() {
  const [activeTab, setActiveTab] = useState<AppointmentTab>('upcoming');
  const queryClient = useQueryClient();

  const {
    data: appointments = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.appointments.byPatient(CURRENT_PATIENT_ID),
    queryFn: () => fetchPatientAppointments(CURRENT_PATIENT_ID),
  });

  const { data: psychologists = [] } = useQuery({
    queryKey: queryKeys.psychologists.list(),
    queryFn: fetchPsychologists,
  });

  const psychologistMap: Record<number, Psychologist> = Object.fromEntries(
    psychologists.map((p) => [p.id, p]),
  );

  const grouped = groupByTab(appointments);

  const { mutate: handleCancel } = useMutation({
    mutationFn: (id: number) => cancelAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments.byPatient(CURRENT_PATIENT_ID),
      });
    },
  });

  return {
    activeTab,
    setActiveTab,
    displayedAppointments: grouped[activeTab],
    counts: {
      upcoming: grouped.upcoming.length,
      past: grouped.past.length,
      cancelled: grouped.cancelled.length,
    },
    psychologistMap,
    isLoading,
    error,
    handleCancel,
  };
}
