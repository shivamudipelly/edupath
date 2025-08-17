// src/screens/Planner/CalendarViewScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const CalendarViewScreen = () => {
  const navigation = useNavigation();

  // Mock schedule data
  const scheduleData = [
    {
      id: '1',
      date: '2023-11-20',
      events: [
        { time: '09:00 - 11:00', title: 'React Hooks Practice', type: 'study' },
        { time: '14:00 - 15:30', title: 'Mock Interview Prep', type: 'interview' }
      ]
    },
    {
      id: '2',
      date: '2023-11-21',
      events: [
        { time: '10:00 - 12:00', title: 'Node.js Modules', type: 'study' }
      ]
    },
    {
      id: '3',
      date: '2023-11-22',
      events: [
        { time: '09:30 - 11:00', title: 'Database Design', type: 'study' },
        { time: '16:00 - 17:00', title: 'Weekly Assessment', type: 'test' }
      ]
    },
  ];

  const getEventColor = (type: string) => {
    switch (type) {
      case 'study': return '#6200ee';
      case 'interview': return '#ff6b6b';
      case 'test': return '#00b894';
      default: return '#6200ee';
    }
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
          <Text style={styles.headerTitle}>Study Calendar</Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {scheduleData.map((day) => (
          <View key={day.id} style={styles.dayCard}>
            <Text style={styles.dayDate}>{day.date}</Text>
            {day.events.map((event, index) => (
              <View key={index} style={styles.eventItem}>
                <View style={[styles.eventDot, { backgroundColor: getEventColor(event.type) }]} />
                <View style={styles.eventDetails}>
                  <Text style={styles.eventTime}>{event.time}</Text>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
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
  scrollContent: {
    padding: 15,
  },
  dayCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  dayDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6200ee',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  eventDetails: {
    flex: 1,
  },
  eventTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  eventTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});

export default CalendarViewScreen;