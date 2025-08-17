import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView, SafeAreaView, TouchableOpacity } from "react-native";
import { LineChart, ProgressChart } from "react-native-chart-kit";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Define your navigation types
type ProgressStackParamList = {
  ProgressMain: undefined;
  TestHistory: undefined;
  CalendarView: undefined;
  MockInterview: undefined;
  QuizModule: undefined;
};

const ProgressScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ProgressStackParamList>>();
  
  // Mock data
  const [domain] = useState("Full Stack Development");
  const [timeCommitment] = useState("10 hours/week");
  const [completedTopics] = useState(18);
  const [totalTopics] = useState(32);
  const progressPercent = completedTopics / totalTopics;
  
  const mockScores = [65, 72, 78, 85, 82, 88];
  const testDates = ["Jan 5", "Jan 12", "Jan 19", "Jan 26", "Feb 2", "Feb 9"];
  
  const roadmapProgress = [
    { name: "Basics", completed: 100 },
    { name: "HTML/CSS", completed: 90 },
    { name: "JavaScript", completed: 85 },
    { name: "React", completed: 75 },
    { name: "Node.js", completed: 60 },
    { name: "Databases", completed: 40 },
    { name: "Projects", completed: 20 },
  ];

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    propsForDots: {
      r: "5",
      strokeWidth: "2",
      stroke: "#6200ee",
      fill: "#ffffff"
    }
  };

  const handleViewAllTests = () => {
    navigation.navigate('TestHistory');
  };

  const handleViewCalendar = () => {
    navigation.navigate('CalendarView');
  };

  const handleViewMockInterviews = () => {
    navigation.navigate('MockInterview');
  };

  const handleDomainChange = () => {
    navigation.navigate('QuizModule');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <LinearGradient
          colors={['#6200ee', '#3700b3']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Progress Dashboard</Text>
            <View style={styles.domainContainer}>
              <Text style={styles.headerSubtitle}>{domain}</Text>
              <TouchableOpacity onPress={handleDomainChange}>
                <MaterialIcons name="edit" size={18} color="rgba(255,255,255,0.8)" />
              </TouchableOpacity>
            </View>
            <Text style={styles.timeCommitment}>Time Commitment: {timeCommitment}</Text>
          </View>
        </LinearGradient>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Progress Overview Cards */}
          <View style={styles.cardRow}>
            <View style={[styles.card, styles.progressCard]}>
              <View style={styles.cardHeader}>
                <Ionicons name="book" size={24} color="#6200ee" />
                <Text style={styles.cardTitle}>Learning Progress</Text>
              </View>
              <Text style={styles.cardValue}>{completedTopics}<Text style={styles.cardTotal}> / {totalTopics}</Text></Text>
              <ProgressChart
                data={{
                  labels: ["Progress"],
                  data: [progressPercent],
                  colors: ["#6200ee"]
                }}
                width={Dimensions.get("window").width - 180}
                height={100}
                strokeWidth={8}
                radius={32}
                chartConfig={chartConfig}
                hideLegend={true}
              />
              <Text style={styles.progressText}>{Math.round(progressPercent * 100)}% Complete</Text>
            </View>

            <View style={[styles.card, styles.testCard]}>
              <View style={styles.cardHeader}>
                <FontAwesome name="bar-chart" size={20} color="#6200ee" />
                <Text style={styles.cardTitle}>Test Performance</Text>
              </View>
              <Text style={styles.cardValue}>{mockScores.length}</Text>
              <Text style={styles.cardSubtitle}>Tests Taken</Text>
              <Text style={styles.scoreText}>
                {Math.round(mockScores.reduce((a, b) => a + b, 0) / mockScores.length)}%
                <Text style={styles.scoreTrend}> (+12% last month)</Text>
              </Text>
            </View>
          </View>

          {/* Performance Charts */}
          <View style={[styles.card, styles.chartCard]}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Test Score Trend</Text>
              <TouchableOpacity onPress={handleViewAllTests}>
                <Text style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            </View>
            <LineChart
              data={{
                labels: testDates,
                datasets: [{
                  data: mockScores,
                  color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
                  strokeWidth: 2
                }]
              }}
              width={Dimensions.get("window").width - 40}
              height={220}
              yAxisSuffix="%"
              yAxisInterval={1}
              chartConfig={chartConfig}
              bezier
              style={styles.lineChart}
            />
          </View>

          {/* Recent Mock Interviews */}
          <View style={[styles.card, styles.interviewCard]}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Recent Mock Interviews</Text>
              <TouchableOpacity onPress={handleViewMockInterviews}>
                <Text style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.interviewItem}>
              <View style={styles.interviewDate}>
                <Text style={styles.interviewDay}>15</Text>
                <Text style={styles.interviewMonth}>Feb</Text>
              </View>
              <View style={styles.interviewDetails}>
                <Text style={styles.interviewDomain}>Full Stack Interview</Text>
                <Text style={styles.interviewScore}>Score: 85%</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6200ee" />
            </View>
            <View style={styles.interviewItem}>
              <View style={styles.interviewDate}>
                <Text style={styles.interviewDay}>28</Text>
                <Text style={styles.interviewMonth}>Jan</Text>
              </View>
              <View style={styles.interviewDetails}>
                <Text style={styles.interviewDomain}>System Design</Text>
                <Text style={styles.interviewScore}>Score: 72%</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6200ee" />
            </View>
          </View>

          {/* Upcoming Schedule */}
          <View style={[styles.card, styles.scheduleCard]}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Upcoming Schedule</Text>
              <TouchableOpacity onPress={handleViewCalendar}>
                <Text style={styles.viewAll}>View Calendar</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.scheduleItem}>
              <View style={[styles.scheduleDot, { backgroundColor: '#6200ee' }]} />
              <View style={styles.scheduleDetails}>
                <Text style={styles.scheduleTime}>Today, 9:00 AM - 11:00 AM</Text>
                <Text style={styles.scheduleTask}>Node.js Modules Practice</Text>
              </View>
            </View>
            <View style={styles.scheduleItem}>
              <View style={[styles.scheduleDot, { backgroundColor: '#ff6b6b' }]} />
              <View style={styles.scheduleDetails}>
                <Text style={styles.scheduleTime}>Tomorrow, 2:00 PM - 3:30 PM</Text>
                <Text style={styles.scheduleTask}>Mock Interview Preparation</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#6200ee'
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7'
  },
  header: {
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 5
  },
  domainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginRight: 8
  },
  timeCommitment: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)'
  },
  scrollContent: {
    paddingBottom: 30
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 15,
    marginTop: 10
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3
  },
  progressCard: {
    width: '58%'
  },
  testCard: {
    width: '38%',
    justifyContent: 'space-between'
  },
  chartCard: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: 15
  },
  roadmapCard: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: 15
  },
  interviewCard: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: 15
  },
  tipsCard: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: 15
  },
  scheduleCard: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: 15
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  cardTitle: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    fontWeight: '500'
  },
  cardValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#6200ee',
    marginBottom: 5
  },
  cardTotal: {
    fontSize: 16,
    color: '#999',
    fontWeight: 'normal'
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#999',
    marginBottom: 10
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6200ee'
  },
  scoreTrend: {
    fontSize: 12,
    color: '#00b894',
    fontWeight: 'normal'
  },
  progressText: {
    textAlign: 'center',
    color: '#6200ee',
    fontWeight: '600',
    marginTop: 5
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  viewAll: {
    fontSize: 14,
    color: '#6200ee',
    fontWeight: '500'
  },
  lineChart: {
    borderRadius: 12,
    marginTop: 5
  },
  roadmapItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  roadmapName: {
    width: 100,
    fontSize: 14,
    color: '#555'
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#f1f3f5',
    borderRadius: 4,
    marginHorizontal: 10,
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#6200ee',
    borderRadius: 4
  },
  roadmapPercent: {
    width: 40,
    fontSize: 14,
    color: '#6200ee',
    fontWeight: '600',
    textAlign: 'right'
  },
  interviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5'
  },
  interviewDate: {
    width: 50,
    alignItems: 'center',
    marginRight: 15
  },
  interviewDay: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6200ee'
  },
  interviewMonth: {
    fontSize: 12,
    color: '#999',
    textTransform: 'uppercase'
  },
  interviewDetails: {
    flex: 1
  },
  interviewDomain: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3
  },
  interviewScore: {
    fontSize: 13,
    color: '#666'
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333'
  },
  tip: {
    fontSize: 14,
    marginBottom: 10,
    color: '#555',
    marginLeft: 5
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10
  },
  scheduleDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 15
  },
  scheduleDetails: {
    flex: 1
  },
  scheduleTime: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2
  },
  scheduleTask: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500'
  }
});

export default ProgressScreen;