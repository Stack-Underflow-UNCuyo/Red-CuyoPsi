import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/constants/colors';
import { fontFamily, fontSize, fontWeight } from '@/constants/typography';
import { spacing } from '@/constants/spacing';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  /** Pass true for screens rendered without a native navigation header (e.g. headerShown: false stacks). */
  withSafeArea?: boolean;
}

export function ScreenHeader({ title, subtitle, children, withSafeArea = false }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const topPadding = spacing.lg + (withSafeArea ? insets.top : 0);

  return (
    <View style={[styles.header, { paddingTop: topPadding }]}>
      <Text style={styles.title}>{title}</Text>
      {subtitle != null && <Text style={styles.subtitle}>{subtitle}</Text>}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.summitBlue,
    paddingHorizontal: spacing.lg,
    paddingBottom: 36,
  },
  title: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.display,
    fontWeight: fontWeight.bold,
    color: colors.white,
  },
  subtitle: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.md,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
});
