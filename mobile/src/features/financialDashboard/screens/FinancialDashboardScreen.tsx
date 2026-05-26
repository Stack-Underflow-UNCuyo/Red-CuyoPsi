import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function FinancialDashboardScreen() {
  return (
    <View style={styles.container}>
      <Text>FinancialDashboardScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
