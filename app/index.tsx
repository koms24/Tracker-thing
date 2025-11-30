import React from 'react';
import { StyleSheet, View } from 'react-native';
import ExpenseForm from '../components/ExpenseForm';

export default function Index() {
  return (
    <View style={styles.container}>
      <ExpenseForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
