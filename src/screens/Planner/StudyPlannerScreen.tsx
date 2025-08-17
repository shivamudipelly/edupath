import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useUserContext } from '../../context/UserContext';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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

const StudyPlannerScreen = () => {
    const { userData, setUserData } = useUserContext();
    const navigation = useNavigation();
    const [selectedDays, setSelectedDays] = useState<string[]>(userData.studySchedule?.days || []);
    const [studyTime, setStudyTime] = useState(() => {
        if (userData.studySchedule?.time) {
            const [hours, minutes] = userData.studySchedule.time.split(':').map(Number);
            const date = new Date();
            date.setHours(hours, minutes);
            return date;
        }
        return new Date();
    });
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [remindersEnabled, setRemindersEnabled] = useState(userData.studySchedule?.reminders || false);

    useEffect(() => {
        if (userData.studySchedule) {
            setSelectedDays(userData.studySchedule.days);
            setRemindersEnabled(userData.studySchedule.reminders);
        }
    }, [userData.studySchedule]);

    const toggleDay = (day: string) => {
        setSelectedDays(prev =>
            prev.includes(day)
                ? prev.filter(d => d !== day)
                : [...prev, day]
        );
    };

    const onTimeChange = (event: any, selectedDate?: Date) => {
        setShowTimePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setStudyTime(selectedDate);
        }
    };

    const saveSchedule = async () => {
        const newSchedule = {
            days: selectedDays,
            time: `${studyTime.getHours()}:${studyTime.getMinutes().toString().padStart(2, '0')}`,
            reminders: remindersEnabled
        };

        setUserData(prev => ({ ...prev, studySchedule: newSchedule }));

        if (remindersEnabled && userData.domain) {
            await scheduleNotifications(newSchedule, userData.domain);
        } else {
            await Notifications.cancelAllScheduledNotificationsAsync();
        }

        navigation.goBack();
    };

    const scheduleNotifications = async (schedule: any, domain: string) => {
        await Notifications.cancelAllScheduledNotificationsAsync();

        if (schedule.days.length > 0) {
            const now = new Date();
            const currentDay = now.getDay(); // 0 (Sunday) to 6 (Saturday)
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();

            for (const day of schedule.days) {
                const dayIndex = DAYS.indexOf(day);
                if (dayIndex !== -1) {
                    const [hours, minutes] = schedule.time.split(':').map(Number);
                    const notificationDay = (dayIndex + 1) % 7; // Convert to 0-6 (Sun-Sat)

                    // Calculate if this notification should be scheduled
                    const isFutureDay = notificationDay > currentDay;
                    const isToday = notificationDay === currentDay;
                    const isFutureTime = isToday &&
                        (hours > currentHour ||
                            (hours === currentHour && minutes > currentMinute));

                    if (isFutureDay || isFutureTime) {
                        // Schedule 5-min advance notification
                        await Notifications.scheduleNotificationAsync({
                            content: {
                                title: 'Study Session Starting Soon',
                                body: `Your ${domain} study session starts in 5 minutes`,
                                sound: true,
                                priority: Notifications.AndroidNotificationPriority.HIGH
                            },
                            trigger: {
                                hour: hours,
                                minute: minutes - 5,
                                repeats: true,
                                weekday: dayIndex + 1
                            } as Notifications.NotificationTriggerInput
                        });

                        // Schedule main notification
                        await Notifications.scheduleNotificationAsync({
                            content: {
                                title: 'Study Time!',
                                body: `Time to work on your ${domain} skills`,
                                sound: true,
                                priority: Notifications.AndroidNotificationPriority.HIGH
                            },
                            trigger: {
                                hour: hours,
                                minute: minutes,
                                repeats: true,
                                weekday: dayIndex + 1
                            } as Notifications.NotificationTriggerInput
                        });
                    }
                }
            }
        }
    };
    return (
        <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
        >
            <Text style={styles.title}>
                {userData.studySchedule ? 'Edit Study Plan' : 'Create Study Plan'}
            </Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Select Study Days</Text>
                <View style={styles.daysContainer}>
                    {DAYS.map(day => (
                        <TouchableOpacity
                            key={day}
                            style={[
                                styles.dayButton,
                                selectedDays.includes(day) && styles.dayButtonSelected,
                                selectedDays.includes(day) && {
                                    backgroundColor: DOMAIN_DETAILS[userData.domain as keyof typeof DOMAIN_DETAILS]?.color || '#6200ee'
                                }
                            ]}
                            onPress={() => toggleDay(day)}
                        >
                            <Text style={[
                                styles.dayText,
                                selectedDays.includes(day) && styles.dayTextSelected
                            ]}>
                                {day.substring(0, 3)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                {selectedDays.length === 0 && (
                    <Text style={styles.hintText}>Select at least one day</Text>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Study Time</Text>
                <TouchableOpacity
                    style={styles.timeInput}
                    onPress={() => setShowTimePicker(true)}
                >
                    <Text style={styles.timeText}>
                        {studyTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </TouchableOpacity>
                {showTimePicker && (
                    <DateTimePicker
                        value={studyTime}
                        mode="time"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={onTimeChange}
                        accentColor="#6200ee"
                    />
                )}
            </View>

            <View style={styles.section}>
                <View style={styles.switchContainer}>
                    <View style={styles.switchLabelContainer}>
                        <Text style={styles.switchLabel}>Enable Reminders</Text>
                        <Ionicons
                            name="notifications"
                            size={20}
                            color={remindersEnabled ? '#6200ee' : '#adb5bd'}
                        />
                    </View>
                    <Switch
                        value={remindersEnabled}
                        onValueChange={setRemindersEnabled}
                        thumbColor="#fff"
                        trackColor={{ false: '#e9ecef', true: '#6200ee' }}
                    />
                </View>
                {remindersEnabled && (
                    <Text style={styles.hintText}>
                        You'll receive notifications 5 minutes before each session
                    </Text>
                )}
            </View>

            <TouchableOpacity
                style={[
                    styles.saveButton,
                    selectedDays.length === 0 && styles.disabledButton
                ]}
                onPress={saveSchedule}
                disabled={selectedDays.length === 0}
            >
                <Text style={styles.saveButtonText}>
                    {userData.studySchedule ? 'Update Schedule' : 'Save Schedule'}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 40,
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#212529',
        textAlign: 'center',
    },
    section: {
        marginBottom: 25,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 15,
        color: '#495057',
    },
    daysContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    dayButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e9ecef',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    dayButtonSelected: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    dayText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#495057',
    },
    dayTextSelected: {
        color: '#fff',
        fontWeight: '600',
    },
    timeInput: {
        backgroundColor: '#f8f9fa',
        padding: 14,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#dee2e6',
    },
    timeText: {
        fontSize: 18,
        color: '#212529',
        textAlign: 'center',
        fontWeight: '500',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    switchLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    switchLabel: {
        fontSize: 16,
        color: '#212529',
    },
    saveButton: {
        backgroundColor: '#6200ee',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#6200ee',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    disabledButton: {
        opacity: 0.6,
        backgroundColor: '#adb5bd',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    hintText: {
        fontSize: 13,
        color: '#868e96',
        marginTop: 8,
        fontStyle: 'italic',
    },
});

export default StudyPlannerScreen;