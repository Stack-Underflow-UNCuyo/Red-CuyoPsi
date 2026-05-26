import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function RegisterScreen() {
  return (
    <View style={styles.container}>
      <Text>RegisterScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
