import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function MapScreen() {
  return (
    <View style={styles.container}>
      <Text>MapScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
