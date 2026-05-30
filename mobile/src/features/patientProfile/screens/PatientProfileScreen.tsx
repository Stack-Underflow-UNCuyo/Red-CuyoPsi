import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { colors } from '@/constants/colors';
import { fontFamily, fontSize, fontWeight } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Avatar, initialsFromName } from '@/components/ui/Avatar';
import { usePatientProfileScreen } from '../hooks/usePatientProfileScreen';

function SettingsItem({ label, value, onPress }: { label: string; value?: string; onPress?: () => void }) {
  return (
    <TouchableOpacity
      style={settingStyles.item}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <Text style={settingStyles.label}>{label}</Text>
      {value != null && <Text style={settingStyles.value}>{value}</Text>}
      <Text style={settingStyles.chevron}>{'›'}</Text>
    </TouchableOpacity>
  );
}

function SettingsToggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={settingStyles.toggle}>
      <Text style={settingStyles.label}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.cordilleraGray, true: colors.summitMid }}
        thumbColor={colors.white}
      />
    </View>
  );
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={settingStyles.section}>
      <Text style={settingStyles.sectionTitle}>{title}</Text>
      <View style={settingStyles.sectionItems}>{children}</View>
    </View>
  );
}

export function PatientProfileScreen() {
  const {
    patient,
    isLoading,
    error,
    handleGoToProfessionalSettings,
    handleGoToPatientRecord,
    handleGoToFinancialDashboard,
  } = usePatientProfileScreen();

  const [toggles, setToggles] = useState({ reminders: true, location: true, promotions: false });

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.summitBlue} />
      </View>
    );
  }

  if (error || !patient) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No se pudo cargar el perfil</Text>
      </View>
    );
  }

  const initials = initialsFromName(patient.name);

  return (
    <View style={styles.container}>
      <ScreenHeader title="Mi perfil" subtitle="Gestioná tu cuenta y preferencias" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarRow}>
          <Avatar initials={initials} bg={colors.summitBlue} size={64} borderRadius={14} />
          <View style={styles.avatarInfo}>
            <Text style={styles.userName}>{patient.name}</Text>
            <Text style={styles.userRole}>{'Paciente · Mendoza, AR'}</Text>
          </View>
        </View>

        {/* Role switch tile */}
        <TouchableOpacity style={styles.roleSwitchCard} onPress={handleGoToProfessionalSettings} activeOpacity={0.85}>
          <View style={styles.roleSwitchIcon}>
            <Text style={styles.roleSwitchIconText}>{'👤'}</Text>
          </View>
          <View style={styles.roleSwitchText}>
            <Text style={styles.roleSwitchTitle}>Soy profesional</Text>
            <Text style={styles.roleSwitchSubtitle}>Acceder al panel de psicólogo</Text>
          </View>
          <Text style={styles.roleSwitchChevron}>{'›'}</Text>
        </TouchableOpacity>

        <SettingsSection title="Datos personales">
          <SettingsItem label="Nombre completo" value={patient.name} />
          <SettingsItem label="Email" value={patient.email} />
          <SettingsItem label="Teléfono" value={patient.phone} />
        </SettingsSection>

        <SettingsSection title="Acceso profesional">
          <SettingsItem label="Historial clínico" onPress={handleGoToPatientRecord} />
          <SettingsItem label="Panel financiero" onPress={handleGoToFinancialDashboard} />
        </SettingsSection>

        <SettingsSection title="Pagos">
          <SettingsItem label="Métodos de pago" value="Agregar tarjeta" />
          <SettingsItem label="Historial de pagos" />
        </SettingsSection>

        <SettingsSection title="Privacidad y notificaciones">
          <SettingsToggle
            label="Recordatorios de turno"
            value={toggles.reminders}
            onChange={(v) => setToggles({ ...toggles, reminders: v })}
          />
          <SettingsToggle
            label="Ubicación para mapa"
            value={toggles.location}
            onChange={(v) => setToggles({ ...toggles, location: v })}
          />
          <SettingsToggle
            label="Novedades y promociones"
            value={toggles.promotions}
            onChange={(v) => setToggles({ ...toggles, promotions: v })}
          />
        </SettingsSection>

        <SettingsSection title="Cuenta">
          <SettingsItem label="Cambiar contraseña" />
          <SettingsItem label="Política de privacidad" />
          <SettingsItem label="Acerca de Red CuyoPsi" value="v0.4" />
        </SettingsSection>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cordilleraGray,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cordilleraGray,
  },
  errorText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.base,
    color: colors.cuyoWine,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 22,
    marginTop: -22,
  },
  scrollContent: {
    padding: spacing.md,
    paddingTop: spacing.lg,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 22,
  },
  avatarInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textDark,
  },
  userRole: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.md,
    color: colors.textMuted,
    marginTop: 2,
  },
  roleSwitchCard: {
    backgroundColor: colors.cuyoWine,
    borderRadius: 12,
    padding: 14,
    marginBottom: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  roleSwitchIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleSwitchIconText: {
    fontSize: 18,
  },
  roleSwitchText: {
    flex: 1,
  },
  roleSwitchTitle: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.white,
  },
  roleSwitchSubtitle: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 1,
  },
  roleSwitchChevron: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 20,
    fontWeight: fontWeight.bold,
  },
  bottomSpacer: {
    height: spacing.lg,
  },
});

const settingStyles = StyleSheet.create({
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
  },
  sectionItems: {
    gap: 2,
  },
  item: {
    backgroundColor: colors.white,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(27,58,107,0.07)',
  },
  toggle: {
    backgroundColor: colors.white,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(27,58,107,0.07)',
  },
  label: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.md,
    color: colors.textDark,
    flex: 1,
  },
  value: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: 'right',
    marginRight: spacing.sm,
  },
  chevron: {
    color: colors.textMuted,
    fontSize: 18,
    lineHeight: 22,
  },
});
