// TODO: promote to src/components/ui/InfoRow.tsx when used outside profile feature
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { fontFamily, fontSize, fontWeight } from '@/constants/typography';
import { spacing } from '@/constants/spacing';

interface InfoRowProps {
  label: string;
  value: string;
}

export function InfoRow({ label, value }: InfoRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.cordilleraGray,
  },
  label: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.base,
    color: colors.textMuted,
    fontWeight: fontWeight.regular,
  },
  value: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.base,
    color: colors.textDark,
    fontWeight: fontWeight.medium,
    flex: 1,
    textAlign: 'right',
    marginLeft: spacing.md,
  },
});
