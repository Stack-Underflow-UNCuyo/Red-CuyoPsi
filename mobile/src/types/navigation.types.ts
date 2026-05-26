import { NavigatorScreenParams } from '@react-navigation/native';

import type { AppointmentPaymentStatus, AppointmentStatus } from './appointment.types';

export type BookingStackParamList = {
  Calendar: { psychologistId: number };
  Payment: { psychologistId: number; dateTime: string };
  Confirmation: {
    appointmentId: number;
    dateTime: string;
    psychologistId: number;
    status: AppointmentStatus;
    paymentStatus: AppointmentPaymentStatus;
  };
};

export type SearchStackParamList = {
  Search: undefined;
  Map: undefined;
  PsychologistProfile: { id: number };
  Booking: NavigatorScreenParams<BookingStackParamList>;
};

export type ProfileStackParamList = {
  PatientProfile: undefined;
  ProfessionalSettings: undefined;
  PatientRecord: { patientId: number };
  FinancialDashboard: undefined;
};
