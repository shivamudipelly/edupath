import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ActivityIndicator, ScrollView } from 'react-native';
import { useUserContext } from '../../context/UserContext';
import quizData from "../../data/quizData.json";

type DomainKey = 'fullstack' | 'aiml' | 'uiux' | 'data' | 'cyber';

type DomainInfo = {
    name: string;
    icon: string;
    color: string;
    description: string;
    traits?: string[];
};

type Option = {
    text: string;
    domains: DomainKey[];
};

type Question = {
    id: string;
    question: string;
    options: Option[];
};

type QuizData = {
    meta: {
        title: string;
        description: string;
        totalQuestions: number;
        estimatedTime: string;
        domains: {
            [key in DomainKey]: string;
        };
    };
    questions: Question[];
};

type QuizResult = {
    primary: {
        key: DomainKey;
        domain: DomainInfo;
        score: number;
    } | {
        name: string;
        description: string;
        icon: string;
        color: string;
    };
    secondary: {
        key: DomainKey;
        domain: DomainInfo;
        score: number;
    } | null;
    scores: { [key in DomainKey]?: number };
};

const DOMAIN_DETAILS: Record<DomainKey, DomainInfo> = {
    fullstack: {
        name: "Full Stack Development",
        icon: "💻",
        color: "#6c5ce7",
        description: "You build complete web applications from frontend to backend.",
        traits: ["Versatile", "Problem Solver", "Integrator"]
    },
    aiml: {
        name: "AI/ML Engineering",
        icon: "🤖",
        color: "#00b894",
        description: "You create intelligent systems that learn and adapt.",
        traits: ["Analytical", "Innovative", "Mathematical"]
    },
    uiux: {
        name: "UI/UX Design",
        icon: "🎨",
        color: "#e17055",
        description: "You craft intuitive and beautiful user experiences.",
        traits: ["Creative", "Empathetic", "Detail-oriented"]
    },
    data: {
        name: "Data Science",
        icon: "📊",
        color: "#0984e3",
        description: "You extract insights and tell stories with data.",
        traits: ["Curious", "Analytical", "Storyteller"]
    },
    cyber: {
        name: "Cybersecurity",
        icon: "🔒",
        color: "#d63031",
        description: "You protect systems and data from digital threats.",
        traits: ["Vigilant", "Resourceful", "Ethical"]
    }
};

const getRandomQuestions = (questions: Question[], count: number): Question[] => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

export default function QuizScreen() {
    const [showStartScreen, setShowStartScreen] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<{ [key in DomainKey]?: string[] }>({});
    const [result, setResult] = useState<{
        primary: DomainInfo | { name: string; description: string; icon: string; color: string };
        secondary: DomainInfo | null;
        scores: { [key in DomainKey]?: number };
    } | null>(null);
    const [selectionAnim] = useState(new Animated.Value(0));
    const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
    const [isCalculating, setIsCalculating] = useState(false);
    const { updateDomain } = useUserContext();

    const { meta } = quizData as unknown as QuizData;

    const initializeQuiz = () => {
        const typedQuestions: Question[] = (quizData.questions as any[]).map(q => ({
            ...q,
            options: q.options.map((opt: any) => ({
                ...opt,
                domains: opt.domains.map((d: string) => d as DomainKey)
            }))
        }));
        const randomQuestions = getRandomQuestions(typedQuestions, 5);
        setCurrentQuestions(randomQuestions);
        setCurrentQuestionIndex(0);
        setAnswers({});
        setResult(null);
        setShowStartScreen(false);
    };

    const calculateResult = (answerData: { [key in DomainKey]?: string[] }): QuizResult => {
        const scores: { [key in DomainKey]?: number } = {};
        const domainKeys: DomainKey[] = ['fullstack', 'aiml', 'uiux', 'data', 'cyber'];

        domainKeys.forEach(key => {
            scores[key] = answerData[key]?.length || 0;
        });

        const scoredDomains = domainKeys
            .filter(key => scores[key]! > 0)
            .sort((a, b) => scores[b]! - scores[a]!)
            .map(key => ({
                key,
                score: scores[key]!,
                domain: DOMAIN_DETAILS[key]
            }));

        if (scoredDomains.length === 0) {
            return {
                primary: {
                    name: "No clear preference",
                    description: "You didn't show strong preference for any domain",
                    icon: "❓",
                    color: "#6c5ce7"
                },
                secondary: null,
                scores
            };
        }

        const maxScore = scoredDomains[0].score;
        const topDomains = scoredDomains.filter(d => d.score === maxScore);
        const primaryIndex = Math.floor(Math.random() * topDomains.length);
        const primaryDomain = topDomains[primaryIndex];

        let secondaryDomain = null;
        if (scoredDomains.length > topDomains.length) {
            secondaryDomain = scoredDomains[topDomains.length];
        } else if (topDomains.length > 1) {
            const secondaryIndex = (primaryIndex + 1) % topDomains.length;
            secondaryDomain = topDomains[secondaryIndex];
        }

        return {
            primary: primaryDomain,
            secondary: secondaryDomain,
            scores
        };
    };

    const handleAnswer = (option: Option) => {
        Animated.sequence([
            Animated.timing(selectionAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true
            }),
            Animated.timing(selectionAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true
            })
        ]).start();

        const newAnswers = { ...answers };
        option.domains.forEach((domain) => {
            if (!newAnswers[domain]) newAnswers[domain] = [];
            newAnswers[domain]!.push(option.text);
        });
        setAnswers(newAnswers);

        if (currentQuestionIndex < currentQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setIsCalculating(true);
            setTimeout(() => {
                const result = calculateResult(newAnswers);

                if ('key' in result.primary) {
                    updateDomain(result.primary.key);
                    setResult({
                        primary: result.primary.domain,
                        secondary: result.secondary?.domain || null,
                        scores: result.scores
                    });
                } else {
                    setResult({
                        primary: result.primary,
                        secondary: null,
                        scores: result.scores
                    });
                }

                setIsCalculating(false);
            }, 800);
        }
    };

    const restartQuiz = () => {
        setShowStartScreen(true);
        setResult(null);
    };

    if (isCalculating) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color="#6c5ce7" />
                <Text style={styles.loadingText}>Analyzing your answers...</Text>
            </View>
        );
    }

    if (result) {
        return (
            <ScrollView style={styles.resultOuterContainer}>
                <ScrollView
                    contentContainerStyle={styles.resultContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.resultTitle}>Your Tech Domain Match</Text>

                    <View
                        style={[
                            styles.domainCard,
                            { backgroundColor: 'color' in result.primary ? result.primary.color : '#6c5ce7' },
                        ]}
                    >
                        <Text style={styles.cardIcon}>{result.primary.icon}</Text>
                        <Text style={styles.cardTitle}>{result.primary.name}</Text>
                        <Text style={styles.cardDescription}>
                            {result.primary.description}
                        </Text>

                        {'traits' in result.primary && result.primary.traits && result.primary.traits.length > 0 && (
                            <View style={styles.traitsContainer}>
                                <Text style={styles.traitsTitle}>Your Strengths:</Text>
                                <View style={styles.traitsList}>
                                    {result.primary.traits.map((trait, index) => (
                                        <View key={index} style={styles.traitPill}>
                                            <Text style={styles.traitText}>{trait}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>

                    {result.secondary && (
                        <View style={styles.secondaryContainer}>
                            <Text style={styles.alsoGoodText}>You'd also be great at:</Text>
                            <View
                                style={[
                                    styles.domainCard,
                                    styles.secondaryCard,
                                    { backgroundColor: result.secondary.color },
                                ]}
                            >
                                <Text style={styles.cardIcon}>{result.secondary.icon}</Text>
                                <Text style={styles.cardTitle}>{result.secondary.name}</Text>
                            </View>
                        </View>
                    )}
                </ScrollView>

                <View style={styles.fixedButtonContainer}>
                    <TouchableOpacity
                        style={styles.restartButton}
                        onPress={restartQuiz}
                    >
                        <Text style={styles.restartButtonText}>Take Quiz Again</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }

    if (showStartScreen) {
        return (
            <View style={[styles.container, styles.startScreen]}>
                <Text style={styles.startScreenTitle}>{meta.title}</Text>
                <Text style={styles.startScreenSubtitle}>{meta.description}</Text>
                <Text style={styles.startScreenInfo}>
                    5 random questions • {meta.estimatedTime}
                </Text>
                <TouchableOpacity
                    style={styles.startButton}
                    onPress={initializeQuiz}
                >
                    <Text style={styles.startButtonText}>Begin Quiz</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const currentQuestion = currentQuestions[currentQuestionIndex];
    const progressPercentage = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;

    return (
        <View style={styles.container}>
            <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                    <Text style={styles.progressText}>
                        Question {currentQuestionIndex + 1} of {currentQuestions.length}
                    </Text>
                    <Text style={styles.progressPercentage}>{Math.round(progressPercentage)}%</Text>
                </View>
                <View style={styles.progressBarBackground}>
                    <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
                </View>
            </View>

            <Text style={styles.questionText}>{currentQuestion.question}</Text>

            <View style={styles.optionsContainer}>
                {currentQuestion.options.map((option, index) => (
                    <Animated.View
                        key={index}
                        style={{
                            transform: [{
                                scale: selectionAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [1, 0.95]
                                })
                            }]
                        }}
                    >
                        <TouchableOpacity
                            style={styles.optionButton}
                            onPress={() => handleAnswer(option)}
                        >
                            <Text style={styles.optionText}>{option.text}</Text>
                        </TouchableOpacity>
                    </Animated.View>
                ))}
            </View>
        </View>
    );
}

// Your existing styles remain exactly the same
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 20,
        paddingTop: 50,
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 20,
        fontSize: 16,
        color: '#495057',
    },
    startScreen: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    startScreenTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: '#212529',
        marginBottom: 10,
        textAlign: 'center',
    },
    startScreenSubtitle: {
        fontSize: 18,
        color: '#495057',
        marginBottom: 10,
        textAlign: 'center',
        lineHeight: 24,
    },
    startScreenInfo: {
        fontSize: 16,
        color: '#868e96',
        marginBottom: 40,
        textAlign: 'center',
    },
    startButton: {
        backgroundColor: '#6c5ce7',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 50,
        shadowColor: '#6c5ce7',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 5,
    },
    startButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    progressContainer: {
        marginBottom: 30,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    progressText: {
        fontSize: 14,
        color: '#495057',
        fontWeight: '500',
    },
    progressPercentage: {
        fontSize: 14,
        color: '#6c5ce7',
        fontWeight: '700',
    },
    progressBarBackground: {
        height: 8,
        backgroundColor: '#e9ecef',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#6c5ce7',
        borderRadius: 4,
    },
    questionText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#212529',
        marginBottom: 30,
        lineHeight: 32,
    },
    optionsContainer: {
        marginBottom: 30,
    },
    optionButton: {
        padding: 20,
        marginVertical: 10,
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e9ecef',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    optionText: {
        fontSize: 16,
        color: '#212529',
        fontWeight: '500',
    },
    resultContainer: {
        padding: 20,
        paddingTop: 40,
        paddingBottom: 100,
    },
    resultTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#212529',
        textAlign: 'center',
        marginBottom: 30,
    },
    domainCard: {
        borderRadius: 24,
        padding: 30,
        marginBottom: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
    },
    cardIcon: {
        fontSize: 48,
        textAlign: 'center',
        marginBottom: 15,
        color: 'white',
    },
    cardTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: 'white',
        textAlign: 'center',
        marginBottom: 15,
    },
    cardDescription: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 20,
    },
    secondaryContainer: {
        marginTop: 10,
    },
    secondaryCard: {
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    alsoGoodText: {
        fontSize: 18,
        color: '#495057',
        fontWeight: '600',
        marginBottom: 15,
        textAlign: 'center',
    },
    traitsContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 16,
        padding: 20,
    },
    traitsTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: 'white',
        marginBottom: 12,
        textAlign: 'center',
    },
    traitsList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    traitPill: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        margin: 6,
    },
    traitText: {
        fontSize: 14,
        fontWeight: '600',
        color: 'white',
    },
    restartButton: {
        backgroundColor: '#6c5ce7',
        paddingVertical: 16,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    restartButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
    },
    resultOuterContainer: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    fixedButtonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
});