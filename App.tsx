import React from "react";
import { SafeAreaView, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";

// Screen imports
import QuizScreen from "./src/screens/Quiz/QuizScreen";
import MockInterviewScreen from "./src/screens/MockInterview/MockInterviewScreen";
import RoadmapScreen from "./src/screens/Planner/RoadmapScreen";
import DashboardScreen from "./src/screens/Planner/DashboardScreen";
import StudyPlannerScreen from "./src/screens/Planner/StudyPlannerScreen";
import ProgressScreen from "./src/screens/Progress/ProgressScreen";
import TestHistoryScreen from "./src/screens/Progress/TestHistoryScreen";
import CalendarViewScreen from "./src/screens/Progress/CalendarViewScreen";
import { UserProvider } from "./src/context/UserContext";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const ProgressStack = createStackNavigator();
const PlannerStack = createStackNavigator();

function PlannerStackScreen() {
  return (
    <PlannerStack.Navigator screenOptions={{ headerShown: false }}>
      <PlannerStack.Screen name="Dashboard" component={DashboardScreen} />
      <PlannerStack.Screen name="Roadmap" component={RoadmapScreen} />
      <PlannerStack.Screen name="StudyPlanner" component={StudyPlannerScreen} />
    </PlannerStack.Navigator>
  );
}

function ProgressStackScreen() {
  return (
    <ProgressStack.Navigator screenOptions={{ headerShown: false }}>
      <ProgressStack.Screen name="ProgressMain" component={ProgressScreen} />
      <PlannerStack.Screen name="CalendarView" component={CalendarViewScreen} />
      <ProgressStack.Screen name="TestHistory" component={TestHistoryScreen} />
      <ProgressStack.Screen name="MockInterview" component={MockInterviewScreen} />
    </ProgressStack.Navigator>
  );
}

export default function App() {
  React.useEffect(() => {
    const setupNotifications = async () => {
      await Notifications.requestPermissionsAsync();
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowBanner: true,
          shouldShowList: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });
    };
    setupNotifications();
  }, []);

  return (
    <UserProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#6200ee' }}>
        <StatusBar barStyle="light-content" />
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName: keyof typeof Ionicons.glyphMap;
                switch (route.name) {
                  case "Quiz":
                    iconName = focused ? "help-circle" : "help-circle-outline";
                    break;
                  case "Planner":
                    iconName = focused ? "calendar" : "calendar-outline";
                    break;
                  case "Mock Interview":
                    iconName = focused ? "mic" : "mic-outline";
                    break;
                  case "Progress":
                    iconName = focused ? "analytics" : "analytics-outline";
                    break;
                  default:
                    iconName = "help-circle-outline";
                }
                return <Ionicons name={iconName} size={24} color={color} />;
              },
              tabBarActiveTintColor: "#6200ee",
              tabBarInactiveTintColor: "gray",
              tabBarStyle: {
                backgroundColor: "white",
                height: 60,
                paddingBottom: 8,
                paddingTop: 8,
                borderTopWidth: 0,
                elevation: 10,
              },
              tabBarLabelStyle: {
                fontSize: 12,
                marginBottom: 4,
              },
              tabBarHideOnKeyboard: true,
              headerShown: false,
            })}
          >
            <Tab.Screen
              name="Quiz"
              component={QuizScreen}
              options={{ title: "Domain Quiz" }}
            />
            <Tab.Screen
              name="Planner"
              component={PlannerStackScreen}
              options={{ title: "Study Planner" }}
            />
            <Tab.Screen
              name="Mock Interview"
              component={MockInterviewScreen}
            />
            <Tab.Screen
              name="Progress"
              component={ProgressStackScreen}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </UserProvider>
  );
}