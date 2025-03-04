import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

export default function History({ history }) {
  const renderItem = ({ item }) => (
    <View style={styles.historyItem}>
      <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
      <Text style={styles.details}>
        Age: {item.age}, Weight: {item.weight}kg, Height: {item.height}cm
      </Text>
      <Text style={styles.tdee}>TDEE: {item.tdee} calories/day</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calculation History</Text>
      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item) => item.date.toString()}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  historyItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  details: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  tdee: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
});
