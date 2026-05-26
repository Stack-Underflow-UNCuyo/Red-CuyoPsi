import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';

import { fetchPatientById } from '@/services/patientService';
import { queryKeys } from '@/services/queryKeys';
import type { ProfileStackParamList } from '@/types/navigation.types';

// TODO: replace with authenticated patient ID once auth is implemented
const CURRENT_PATIENT_ID = 1;

export function usePatientProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();

  const { data: patient, isLoading, error } = useQuery({
    queryKey: queryKeys.patients.detail(CURRENT_PATIENT_ID),
    queryFn: () => fetchPatientById(CURRENT_PATIENT_ID),
  });

  const handleGoToProfessionalSettings = () => navigation.navigate('ProfessionalSettings');
  const handleGoToPatientRecord = () =>
    navigation.navigate('PatientRecord', { patientId: CURRENT_PATIENT_ID });
  const handleGoToFinancialDashboard = () => navigation.navigate('FinancialDashboard');

  return {
    patient,
    isLoading,
    error,
    handleGoToProfessionalSettings,
    handleGoToPatientRecord,
    handleGoToFinancialDashboard,
  };
}
