import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useUserContext } from '../../context/UserContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';


export type RootStackParamList = {
  Dashboard: undefined;
  Roadmap: undefined;
  Progress: undefined;
  Quiz: undefined;
  'Mock Interview': undefined;
};

type DashboardScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Dashboard'
>;

const DOMAIN_DETAILS = {
  fullstack: {
    name: "Full Stack Development",
    color: "#6c5ce7",
    icon: "💻"
  },
  aiml: {
    name: "AI/ML Engineering",
    color: "#00b894",
    icon: "🤖"
  },
  uiux: {
    name: "UI/UX Design",
    color: "#e17055",
    icon: "🎨"
  },
  data: {
    name: "Data Science",
    color: "#0984e3",
    icon: "📊"
  },
  cyber: {
    name: "Cybersecurity",
    color: "#d63031",
    icon: "🔒"
  }
};

const DashboardScreen = () => {
  const { userData } = useUserContext();
  const navigation = useNavigation<DashboardScreenNavigationProp>();

  const handleRoadmapPress = () => {
    if (!userData.domain) {
      alert('Please complete the quiz first to view your roadmap');
      return;
    }
    navigation.navigate('Roadmap');
  };

  const handleProgressPress = () => {
    navigation.navigate('Progress');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.header}>Welcome to Your Learning Dashboard</Text>

      <View style={styles.domainSection}>
        <Text style={styles.sectionTitle}>Your Domain</Text>
        <View style={[
          styles.domainCard,
          {
            backgroundColor: userData.domain
              ? DOMAIN_DETAILS[userData.domain as keyof typeof DOMAIN_DETAILS].color
              : '#6c5ce7'
          }
        ]}>
          <Text style={styles.domainIcon}>
            {userData.domain ? DOMAIN_DETAILS[userData.domain as keyof typeof DOMAIN_DETAILS].icon : '❓'}
          </Text>
          <Text style={styles.domainName}>
            {userData.domain
              ? DOMAIN_DETAILS[userData.domain as keyof typeof DOMAIN_DETAILS].name
              : 'No domain selected'}
          </Text>
          {!userData.domain && (
            <Text style={styles.domainHint}>Complete the quiz to get started</Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Study Schedule</Text>
        {userData.studySchedule ? (
          <View style={styles.scheduleCard}>
            <Text style={styles.scheduleText}>
              Days: {userData.studySchedule.days.join(', ')}
            </Text>
            <Text style={styles.scheduleText}>
              Time: {userData.studySchedule.time}
            </Text>
            <Text style={styles.scheduleText}>
              Reminders: {userData.studySchedule.reminders ? 'ON' : 'OFF'}
            </Text>
          </View>
        ) : (
          <Text style={styles.noScheduleText}>No study schedule set</Text>
        )}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('StudyPlanner' as never)}
        >
          <Text style={styles.buttonText}>
            {userData.studySchedule ? 'Edit Schedule' : 'Set Schedule'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Next Steps</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={handleRoadmapPress}
          disabled={!userData.domain}
        >
          <Text style={styles.buttonText}>View Learning Roadmap</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Progress Tracking</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={handleProgressPress}
        >
          <Text style={styles.buttonText}>View Your Progress</Text>
        </TouchableOpacity>
      </View>

      {!userData.domain && (
        <TouchableOpacity
          style={styles.quizButton}
          onPress={() => navigation.navigate('Quiz')}
        >
          <Text style={styles.quizButtonText}>Take Domain Quiz</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

// Your existing styles remain the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#212529',
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#495057',
  },
  domainSection: {
    marginBottom: 30,
    alignItems: 'center',
  },
  domainCard: {
    width: '100%',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  domainIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  domainName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 5,
  },
  domainHint: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#6c5ce7',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#6c5ce7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  quizButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6c5ce7',
    marginTop: 20,
  },
  quizButtonText: {
    color: '#6c5ce7',
    fontSize: 16,
    fontWeight: '600',
  }, scheduleCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scheduleText: {
    fontSize: 15,
    color: '#495057',
    marginBottom: 5,
  },
  noScheduleText: {
    fontSize: 15,
    color: '#868e96',
    marginBottom: 15,
    textAlign: 'center',
  },

});

export default DashboardScreen;