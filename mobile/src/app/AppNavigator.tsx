import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import { LoginScreen } from '@/features/auth/screens/LoginScreen';
import { RegisterScreen } from '@/features/auth/screens/RegisterScreen';
import { AppointmentsScreen } from '@/features/appointments/screens/AppointmentsScreen';
import { CalendarScreen } from '@/features/booking/screens/CalendarScreen';
import { ConfirmationScreen } from '@/features/booking/screens/ConfirmationScreen';
import { PaymentScreen } from '@/features/booking/screens/PaymentScreen';
import { FinancialDashboardScreen } from '@/features/financialDashboard/screens/FinancialDashboardScreen';
import { PatientProfileScreen } from '@/features/patientProfile/screens/PatientProfileScreen';
import { PsychologistProfileScreen } from '@/features/profile/screens/PsychologistProfileScreen';
import { ProfessionalSettingsScreen } from '@/features/professionalSettings/screens/ProfessionalSettingsScreen';
import { PatientRecordScreen } from '@/features/clinicalRecord/screens/PatientRecordScreen';
import { MapScreen } from '@/features/search/screens/MapScreen';
import { SearchScreen } from '@/features/search/screens/SearchScreen';
import type { SearchStackParamList } from '@/features/search/search.types';

const queryClient = new QueryClient();

const Auth = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();
const SearchStack = createNativeStackNavigator<SearchStackParamList>();
const BookingStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

function BookingStackNavigator() {
  return (
    <BookingStack.Navigator screenOptions={{ headerShown: false }}>
      <BookingStack.Screen name="Calendar" component={CalendarScreen} />
      <BookingStack.Screen name="Payment" component={PaymentScreen} />
      <BookingStack.Screen name="Confirmation" component={ConfirmationScreen} />
    </BookingStack.Navigator>
  );
}

function SearchStackNavigator() {
  return (
    <SearchStack.Navigator>
      <SearchStack.Screen name="Search" component={SearchScreen} />
      <SearchStack.Screen name="Map" component={MapScreen} />
      <SearchStack.Screen name="PsychologistProfile" component={PsychologistProfileScreen} />
      <SearchStack.Screen
        name="Booking"
        component={BookingStackNavigator}
        options={{ headerShown: false }}
      />
    </SearchStack.Navigator>
  );
}

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="PatientProfile" component={PatientProfileScreen} />
      <ProfileStack.Screen name="ProfessionalSettings" component={ProfessionalSettingsScreen} />
      <ProfileStack.Screen name="PatientRecord" component={PatientRecordScreen} />
      <ProfileStack.Screen name="FinancialDashboard" component={FinancialDashboardScreen} />
    </ProfileStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tabs.Navigator>
      <Tabs.Screen
        name="SearchTab"
        component={SearchStackNavigator}
        options={{ title: 'Search', headerShown: false }}
      />
      <Tabs.Screen
        name="AppointmentsTab"
        component={AppointmentsScreen}
        options={{ title: 'Appointments' }}
      />
      <Tabs.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{ title: 'Profile', headerShown: false }}
      />
    </Tabs.Navigator>
  );
}

export function AppNavigator() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Auth.Navigator screenOptions={{ headerShown: false }}>
          <Auth.Screen name="Login" component={LoginScreen} />
          <Auth.Screen name="Register" component={RegisterScreen} />
          {/* TODO: Replace with conditional auth-state check once auth is implemented */}
          <Auth.Screen name="Main" component={MainTabs} />
        </Auth.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
