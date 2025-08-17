import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useUserContext } from '../../context/UserContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './DashboardScreen';


type RoadmapScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'Roadmap'
>;

const DOMAIN_ROADMAPS = {
    fullstack: [
        "HTML/CSS Fundamentals",
        "JavaScript Mastery",
        "React Framework",
        "Node.js Backend",
        "Database Systems",
        "Deployment Strategies"
    ],
    aiml: [
        "Python Programming",
        "Linear Algebra Basics",
        "Machine Learning Concepts",
        "Neural Networks",
        "TensorFlow/PyTorch",
        "AI Ethics"
    ],
    uiux: [
        "Design Principles",
        "Figma/Sketch",
        "User Research",
        "Wireframing",
        "Prototyping",
        "Usability Testing"
    ],
    data: [
        "Data Analysis",
        "SQL Fundamentals",
        "Python for Data Science",
        "Data Visualization",
        "Machine Learning Basics",
        "Big Data Concepts"
    ],
    cyber: [
        "Networking Basics",
        "Security Fundamentals",
        "Cryptography",
        "Ethical Hacking",
        "Security Tools",
        "Incident Response"
    ]
};

const RoadmapScreen = () => {
    const { userData } = useUserContext();
    const navigation = useNavigation<RoadmapScreenNavigationProp>();

    if (!userData.domain) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No domain selected</Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('Quiz')}
                    >
                        <Text style={styles.buttonText}>Take Domain Quiz</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const domain = userData.domain as keyof typeof DOMAIN_ROADMAPS;
    const roadmapItems = DOMAIN_ROADMAPS[domain] || [];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <Text style={styles.title}>
                    {DOMAIN_DETAILS[domain].name} Roadmap
                </Text>

                <View style={styles.domainHeader}>
                    <Text style={styles.domainIcon}>{DOMAIN_DETAILS[domain].icon}</Text>
                    <Text style={styles.domainName}>{DOMAIN_DETAILS[domain].name}</Text>
                </View>

                <View style={styles.roadmapContainer}>
                    {roadmapItems.map((item, index) => (
                        <View key={index} style={styles.roadmapItem}>
                            <View style={[
                                styles.itemNumber,
                                { backgroundColor: DOMAIN_DETAILS[domain].color }
                            ]}>
                                <Text style={styles.numberText}>{index + 1}</Text>
                            </View>
                            <Text style={styles.itemText}>{item}</Text>
                        </View>
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>Back to Dashboard</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#212529',
        textAlign: 'center',
    },
    domainHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 25,
    },
    domainIcon: {
        fontSize: 32,
        marginRight: 10,
    },
    domainName: {
        fontSize: 20,
        fontWeight: '600',
        color: '#212529',
    },
    roadmapContainer: {
        marginBottom: 30,
    },
    roadmapItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    itemNumber: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    numberText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    itemText: {
        flex: 1,
        fontSize: 16,
        color: '#495057',
    },
    button: {
        backgroundColor: '#6c5ce7',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    backButton: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#6c5ce7',
        marginTop: 20,
    },
    backButtonText: {
        color: '#6c5ce7',
        fontSize: 16,
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 18,
        color: '#495057',
        marginBottom: 20,
    },
});

export default RoadmapScreen;