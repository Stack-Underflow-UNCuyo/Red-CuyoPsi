import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function ConfirmationScreen() {
  return (
    <View style={styles.container}>
      <Text>ConfirmationScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
