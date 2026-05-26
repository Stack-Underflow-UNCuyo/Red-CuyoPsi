import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/constants/colors';
import { fontFamily, fontSize, fontWeight } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { useCalendarScreen } from '../hooks/useCalendarScreen';

const DAY_HEADERS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

function buildMonthGrid(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function toISODate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function formatSlotTime(isoSlot: string): string {
  return new Date(isoSlot).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
}

export function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const {
    availableDates,
    selectedDate,
    displaySlots,
    selectedSlot,
    handleSelectDate,
    handleSelectSlot,
    handleConfirm,
  } = useCalendarScreen();

  const availableSet = new Set(availableDates);

  const today = new Date();
  const [selYear, selMonth] = selectedDate.split('-').map(Number);
  const displayYear = selYear;
  const displayMonth = selMonth - 1;

  const cells = buildMonthGrid(displayYear, displayMonth);

  const monthLabel = new Date(displayYear, displayMonth, 1).toLocaleDateString('es-AR', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Blue header — paddingTop clears the device status bar */}
        <View style={[styles.header, { paddingTop: insets.top + spacing.xs }]}>
          <Text style={styles.headerTitle}>Elegí un horario</Text>
          <Text style={styles.headerSubtitle}>Seleccioná el día y hora que prefieras</Text>
        </View>

        {/* Calendar card */}
        <View style={styles.calendarCard}>
          <Text style={styles.monthLabel}>{monthLabel}</Text>

          {/* Day-of-week headers */}
          <View style={styles.dayHeaderRow}>
            {DAY_HEADERS.map((d) => (
              <Text key={d} style={styles.dayHeader}>{d}</Text>
            ))}
          </View>

          {/* Date grid */}
          <View style={styles.grid}>
            {cells.map((day, idx) => {
              if (day == null) {
                return <View key={`empty-${idx}`} style={styles.cell} />;
              }
              const isoDate = toISODate(displayYear, displayMonth, day);
              const isToday =
                today.getFullYear() === displayYear &&
                today.getMonth() === displayMonth &&
                today.getDate() === day;
              const isAvailable = availableSet.has(isoDate);
              const isSelected = isoDate === selectedDate;

              return (
                <TouchableOpacity
                  key={isoDate}
                  style={styles.cell}
                  onPress={isAvailable ? () => handleSelectDate(isoDate) : undefined}
                  activeOpacity={isAvailable ? 0.7 : 1}
                  disabled={!isAvailable}
                >
                  <View
                    style={[
                      styles.dayCircle,
                      isSelected && styles.dayCircleSelected,
                      isToday && !isSelected && styles.dayCircleToday,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayNum,
                        isSelected && styles.dayNumSelected,
                        !isAvailable && styles.dayNumUnavailable,
                        isToday && !isSelected && styles.dayNumToday,
                      ]}
                    >
                      {day}
                    </Text>
                  </View>
                  {isAvailable && !isSelected && (
                    <View style={styles.availabilityDot} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Time slots */}
        <View style={styles.slotsSection}>
          <Text style={styles.slotsSectionTitle}>Horarios disponibles</Text>
          <View style={styles.slotsGrid}>
            {displaySlots.map((slot) => {
              const isSelected = slot === selectedSlot;
              return (
                <TouchableOpacity
                  key={slot}
                  style={[styles.slotButton, isSelected && styles.slotButtonSelected]}
                  onPress={() => handleSelectSlot(slot)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.slotText, isSelected && styles.slotTextSelected]}>
                    {formatSlotTime(slot)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Summary card */}
        {selectedSlot != null && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Turno seleccionado</Text>
            <Text style={styles.summaryValue}>
              {new Date(selectedSlot).toLocaleDateString('es-AR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
              {' · '}
              {formatSlotTime(selectedSlot)}
            </Text>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Sticky footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.confirmButton, !selectedSlot && styles.confirmButtonDisabled]}
          onPress={handleConfirm}
          disabled={!selectedSlot}
          activeOpacity={0.85}
        >
          <Text style={styles.confirmButtonText}>
            {selectedSlot ? 'Confirmar horario' : 'Elegí un horario'}
          </Text>
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.sm,
  },
  header: {
    backgroundColor: colors.summitBlue,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  headerTitle: {
    fontFamily: fontFamily.heading,
    fontSize: 19,
    fontWeight: fontWeight.bold,
    color: colors.white,
  },
  headerSubtitle: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 2,
  },
  calendarCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    marginHorizontal: spacing.md,
    marginTop: -18,
    padding: spacing.md,
    shadowColor: colors.textDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  monthLabel: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textDark,
    textTransform: 'capitalize',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  dayHeaderRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fontFamily.body,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / 7}%`,
    alignItems: 'center',
    paddingVertical: 3,
  },
  dayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleSelected: {
    backgroundColor: colors.summitBlue,
  },
  dayCircleToday: {
    borderWidth: 1.5,
    borderColor: colors.summitMid,
  },
  dayNum: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.md,
    color: colors.textDark,
    fontWeight: fontWeight.medium,
  },
  dayNumSelected: {
    color: colors.white,
    fontWeight: fontWeight.bold,
  },
  dayNumUnavailable: {
    color: colors.textMuted,
    opacity: 0.4,
  },
  dayNumToday: {
    color: colors.summitMid,
    fontWeight: fontWeight.bold,
  },
  availabilityDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.jarillaGreen,
    marginTop: 2,
  },
  slotsSection: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  slotsSectionTitle: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  slotButton: {
    width: '30%',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.white,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(27,58,107,0.1)',
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
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(27,58,107,0.09)',
  },
  summaryLabel: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.summitBlue,
    textTransform: 'capitalize',
  },
  bottomSpacer: {
    height: spacing.md,
  },
  footer: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
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
    opacity: 0.5,
  },
  confirmButtonText: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.white,
  },
});
