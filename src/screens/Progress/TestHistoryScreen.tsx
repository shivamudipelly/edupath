// src/screens/Progress/TestHistoryScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const TestHistoryScreen = () => {
  const navigation = useNavigation();

  // Mock test data
  const testData = [
    { id: '1', date: '2023-10-15', score: 85, topic: 'JavaScript Fundamentals' },
    { id: '2', date: '2023-10-22', score: 78, topic: 'React Concepts' },
    { id: '3', date: '2023-10-29', score: 92, topic: 'Node.js Basics' },
    { id: '4', date: '2023-11-05', score: 88, topic: 'Database Design' },
    { id: '5', date: '2023-11-12', score: 81, topic: 'System Architecture' },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 85) return '#00b894'; // Green
    if (score >= 70) return '#fdcb6e'; // Yellow
    return '#d63031'; // Red
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#6200ee', '#3700b3']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Test History</Text>
        </View>
      </LinearGradient>

      <FlatList
        data={testData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.testCard}>
            <View style={styles.testInfo}>
              <Text style={styles.testDate}>{item.date}</Text>
              <Text style={styles.testTopic}>{item.topic}</Text>
            </View>
            <Text style={[styles.testScore, { color: getScoreColor(item.score) }]}>
              {item.score}%
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  header: {
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
  },
  listContent: {
    padding: 15,
  },
  testCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  testInfo: {
    flex: 1,
  },
  testDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  testTopic: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  testScore: {
    fontSize: 18,
    fontWeight: '700',
  },
});

export default TestHistoryScreen;