import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { colors } from '@/constants/colors';
import { fontFamily, fontSize, fontWeight } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Avatar, avatarColor, initialsFromName } from '@/components/ui/Avatar';
import { useProfessionalSettingsScreen } from '../hooks/useProfessionalSettingsScreen';

function HubItem({ label, value, onPress }: { label: string; value?: string; onPress?: () => void }) {
  return (
    <TouchableOpacity
      style={hubStyles.item}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <Text style={hubStyles.label}>{label}</Text>
      {value != null && <Text style={hubStyles.value}>{value}</Text>}
      <Text style={hubStyles.chevron}>{'›'}</Text>
    </TouchableOpacity>
  );
}

function HubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={hubStyles.section}>
      <Text style={hubStyles.sectionTitle}>{title}</Text>
      <View style={hubStyles.sectionItems}>{children}</View>
    </View>
  );
}

export function ProfessionalSettingsScreen() {
  const { psychologist, isLoading, error } = useProfessionalSettingsScreen();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.summitBlue} />
      </View>
    );
  }

  if (error || !psychologist) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No se pudo cargar la configuración</Text>
      </View>
    );
  }

  const initials = psychologist.initials ?? initialsFromName(psychologist.name);
  const avatarBg = psychologist.color ?? avatarColor(initials);

  return (
    <View style={styles.container}>
      <ScreenHeader title="Mi perfil" subtitle="Configuración profesional y herramientas" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar row */}
        <View style={styles.avatarRow}>
          <View style={styles.avatarWrap}>
            <Avatar initials={initials} bg={avatarBg} size={64} borderRadius={14} />
            <View style={styles.verifiedDot}>
              <Text style={styles.verifiedIcon}>{'✓'}</Text>
            </View>
          </View>
          <View style={styles.avatarInfo}>
            <Text style={styles.userName}>{psychologist.name}</Text>
            <Text style={styles.userMeta}>
              {psychologist.registration != null
                ? `${psychologist.registration} · ${psychologist.specialty}`
                : psychologist.specialty}
            </Text>
          </View>
        </View>

        {/* Role switch tile */}
        <TouchableOpacity style={styles.roleSwitchCard} activeOpacity={0.85}>
          <View style={styles.roleSwitchIcon}>
            <Text style={styles.roleSwitchIconText}>{'⇄'}</Text>
          </View>
          <View style={styles.roleSwitchText}>
            <Text style={styles.roleSwitchTitle}>Ver como paciente</Text>
            <Text style={styles.roleSwitchSubtitle}>Cambiá a la vista de usuario</Text>
          </View>
          <Text style={styles.roleSwitchChevron}>{'›'}</Text>
        </TouchableOpacity>

        <HubSection title="Práctica">
          <HubItem
            label="Modalidad"
            value={psychologist.modality === 'ONLINE' ? 'Online' : psychologist.modality === 'IN_PERSON' ? 'Presencial' : 'Presencial / Online'}
          />
          <HubItem label="Honorario" value={`$${psychologist.session_price}`} />
          <HubItem
            label="Política de pago"
            value={psychologist.payment_policy === 'TOTAL' ? 'Pago total' : psychologist.payment_policy === '50_DEPOSIT' ? 'Anticipo 50%' : 'En consultorio'}
          />
        </HubSection>

        <HubSection title="Información actual">
          {psychologist.tags != null && psychologist.tags.length > 0 && (
            <HubItem label="Especialidades" value={psychologist.tags.slice(0, 2).join(', ')} />
          )}
          {psychologist.address != null && (
            <HubItem label="Consultorio" value={psychologist.address} />
          )}
          <HubItem label="Perfil público" />
        </HubSection>

        <HubSection title="Pacientes y clínica">
          <HubItem label="Registro clínico" />
          <HubItem label="Notas de sesión" />
        </HubSection>

        <HubSection title="Finanzas">
          <HubItem label="Mis ingresos" />
          <HubItem label="Historial de transacciones" />
        </HubSection>

        {/* Notice banner */}
        <View style={styles.noticeBanner}>
          <Text style={styles.noticeIcon}>{'ℹ'}</Text>
          <Text style={styles.noticeText}>
            La edición del perfil estará disponible en la próxima versión.
          </Text>
        </View>

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
  avatarWrap: {
    position: 'relative',
  },
  verifiedDot: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.jarillaGreen,
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedIcon: {
    color: colors.white,
    fontSize: 9,
    fontWeight: fontWeight.bold,
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
  userMeta: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.md,
    color: colors.textMuted,
    marginTop: 2,
  },
  roleSwitchCard: {
    backgroundColor: colors.summitMid,
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
    color: colors.white,
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
  noticeBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.summitSoft,
    borderRadius: 10,
    padding: spacing.sm,
    marginTop: spacing.xs,
  },
  noticeIcon: {
    fontSize: 14,
    color: colors.summitMid,
    marginTop: 1,
  },
  noticeText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    color: colors.summitMid,
    flex: 1,
    lineHeight: 18,
  },
  bottomSpacer: {
    height: spacing.lg,
  },
});

const hubStyles = StyleSheet.create({
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
    flexShrink: 1,
  },
  chevron: {
    color: colors.textMuted,
    fontSize: 18,
    lineHeight: 22,
  },
});
