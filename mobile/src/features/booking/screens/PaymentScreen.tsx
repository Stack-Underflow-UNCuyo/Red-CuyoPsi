import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function PaymentScreen() {
  return (
    <View style={styles.container}>
      <Text>PaymentScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
