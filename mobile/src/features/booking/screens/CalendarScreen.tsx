import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { colors } from '@/constants/colors';
import { fontFamily, fontSize, fontWeight } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { useCalendarScreen } from '../hooks/useCalendarScreen';

function formatDateChip(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00`);
  return d.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric' });
}

function formatSlotTime(isoSlot: string): string {
  return new Date(isoSlot).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
}

export function CalendarScreen() {
  const {
    availableDates,
    selectedDate,
    displaySlots,
    selectedSlot,
    isLoading,
    handleSelectDate,
    handleSelectSlot,
    handleConfirm,
  } = useCalendarScreen();

  const renderDateChip = ({ item }: { item: string }) => {
    const isSelected = item === selectedDate;
    return (
      <TouchableOpacity
        style={[styles.dateChip, isSelected && styles.dateChipSelected]}
        onPress={() => handleSelectDate(item)}
        activeOpacity={0.7}
      >
        <Text style={[styles.dateChipText, isSelected && styles.dateChipTextSelected]}>
          {formatDateChip(item)}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSlot = ({ item }: { item: string }) => {
    const isSelected = item === selectedSlot;
    return (
      <TouchableOpacity
        style={[styles.slotButton, isSelected && styles.slotButtonSelected]}
        onPress={() => handleSelectSlot(item)}
        activeOpacity={0.7}
      >
        <Text style={[styles.slotText, isSelected && styles.slotTextSelected]}>
          {formatSlotTime(item)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={availableDates}
        keyExtractor={(item) => item}
        renderItem={renderDateChip}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dateList}
        style={styles.dateRow}
      />
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.summitBlue} />
        </View>
      ) : (
        <FlatList
          data={displaySlots}
          keyExtractor={(item) => item}
          renderItem={renderSlot}
          contentContainerStyle={styles.slotList}
          numColumns={2}
        />
      )}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.confirmButton, !selectedSlot && styles.confirmButtonDisabled]}
          onPress={handleConfirm}
          disabled={!selectedSlot}
          activeOpacity={0.85}
        >
          <Text style={styles.confirmButtonText}>Confirmar horario</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cordilleraGray,
  },
  dateRow: {
    flexGrow: 0,
    backgroundColor: colors.white,
  },
  dateList: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  dateChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.cordilleraGray,
    borderWidth: 1,
    borderColor: colors.cordilleraGray,
  },
  dateChipSelected: {
    backgroundColor: colors.summitBlue,
    borderColor: colors.summitBlue,
  },
  dateChipText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.textMid,
    textTransform: 'capitalize',
  },
  dateChipTextSelected: {
    color: colors.white,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotList: {
    padding: spacing.sm,
  },
  slotButton: {
    flex: 1,
    margin: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.white,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.white,
  },
  slotButtonSelected: {
    backgroundColor: colors.summitSoft,
    borderColor: colors.summitMid,
  },
  slotText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.textDark,
  },
  slotTextSelected: {
    color: colors.summitMid,
    fontWeight: fontWeight.semibold,
  },
  footer: {
    padding: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.cordilleraGray,
  },
  confirmButton: {
    backgroundColor: colors.summitBlue,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: colors.textMuted,
  },
  confirmButtonText: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.white,
  },
});
