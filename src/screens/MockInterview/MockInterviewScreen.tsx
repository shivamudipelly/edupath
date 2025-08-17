import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    Pressable
} from 'react-native';
import { useUserContext } from '../../context/UserContext';
import { Ionicons } from '@expo/vector-icons';

interface InterviewResult {
    id: string;
    date: string;
    score: number;
    feedback: string;
    domain?: string;
    interviewer?: string;
}

const domainOptions = [
    'Frontend',
    'Backend',
    'Fullstack',
    'Mobile',
    'DevOps',
    'Data Science',
    'General'
];

const scoreRangeOptions = [
    { label: 'All Scores', min: 0, max: 100 },
    { label: 'Excellent (85+)', min: 85, max: 100 },
    { label: 'Good (70-84)', min: 70, max: 84 },
    { label: 'Needs Improvement (<70)', min: 0, max: 69 }
];

const MockInterviewScreen = () => {
    const { userData } = useUserContext();
    const [interviews, setInterviews] = useState<InterviewResult[]>([]);
    const [filteredInterviews, setFilteredInterviews] = useState<InterviewResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [showDomainFilter, setShowDomainFilter] = useState(false);
    const [showScoreFilter, setShowScoreFilter] = useState(false);
    const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
    const [selectedScoreRange, setSelectedScoreRange] = useState(scoreRangeOptions[0]);

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                // Mock data - in real app, fetch from backend
                const mockInterviews: InterviewResult[] = [
                    {
                        id: '1',
                        date: '2023-10-15',
                        score: 85,
                        feedback: 'Demonstrated strong technical knowledge but could improve on system design. Showed good problem-solving skills under pressure.',
                        domain: 'Frontend',
                        interviewer: 'John Doe (Senior Developer)'
                    },
                    {
                        id: '2',
                        date: '2023-11-02',
                        score: 92,
                        feedback: 'Excellent communication skills and technical depth. Handled complex problems with clear, structured thinking.',
                        domain: 'Backend',
                        interviewer: 'Jane Smith (Engineering Manager)'
                    },
                    {
                        id: '3',
                        date: '2023-11-10',
                        score: 68,
                        feedback: 'Needs more practice with algorithms. Work on explaining your thought process more clearly.',
                        domain: 'Data Science',
                        interviewer: 'Alex Johnson (Data Scientist)'
                    },
                    {
                        id: '4',
                        date: '2023-11-15',
                        score: 78,
                        feedback: 'Good understanding of core concepts. Could improve on time management during coding exercises.',
                        domain: 'Fullstack',
                        interviewer: 'Sarah Williams (Tech Lead)'
                    }
                ];

                setInterviews(mockInterviews);
                setFilteredInterviews(mockInterviews);
            } catch (error) {
                console.error('Failed to fetch interviews', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInterviews();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [selectedDomain, selectedScoreRange, interviews]);

    const applyFilters = () => {
        let filtered = [...interviews];

        if (selectedDomain) {
            filtered = filtered.filter(i => i.domain === selectedDomain);
        }

        if (selectedScoreRange) {
            filtered = filtered.filter(i => 
                i.score >= selectedScoreRange.min && i.score <= selectedScoreRange.max
            );
        }

        setFilteredInterviews(filtered);
    };

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const getScoreColor = (score: number) => {
        if (score >= 85) return '#00b894'; // Green
        if (score >= 70) return '#fdcb6e'; // Yellow
        return '#d63031'; // Red
    };

    const resetFilters = () => {
        setSelectedDomain(null);
        setSelectedScoreRange(scoreRangeOptions[0]);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6200ee" />
                <Text style={styles.loadingText}>Loading your interview results...</Text>
            </View>
        );
    }

    if (interviews.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Ionicons name="document-text-outline" size={60} color="#adb5bd" />
                <Text style={styles.emptyTitle}>No Interview Results Yet</Text>
                <Text style={styles.emptyText}>Complete a mock interview to see your results here</Text>
                <TouchableOpacity style={styles.scheduleButton}>
                    <Text style={styles.scheduleButtonText}>Schedule Mock Interview</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mock Interview Results</Text>
            
            <View style={styles.filterContainer}>
                <TouchableOpacity 
                    style={styles.filterButton}
                    onPress={() => setShowDomainFilter(true)}
                >
                    <Text style={styles.filterButtonText}>
                        {selectedDomain || 'All Domains'}
                    </Text>
                    <Ionicons name="chevron-down" size={16} color="#6200ee" />
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.filterButton}
                    onPress={() => setShowScoreFilter(true)}
                >
                    <Text style={styles.filterButtonText}>
                        {selectedScoreRange.label}
                    </Text>
                    <Ionicons name="chevron-down" size={16} color="#6200ee" />
                </TouchableOpacity>

                {(selectedDomain || selectedScoreRange !== scoreRangeOptions[0]) && (
                    <TouchableOpacity 
                        style={styles.resetButton}
                        onPress={resetFilters}
                    >
                        <Text style={styles.resetButtonText}>Reset</Text>
                    </TouchableOpacity>
                )}
            </View>

            <Text style={styles.resultsCount}>
                Showing {filteredInterviews.length} of {interviews.length} results
            </Text>

            <FlatList
                data={filteredInterviews}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.noResultsContainer}>
                        <Ionicons name="funnel-outline" size={40} color="#adb5bd" />
                        <Text style={styles.noResultsText}>No results match your filters</Text>
                        <TouchableOpacity 
                            style={styles.resetButtonLarge}
                            onPress={resetFilters}
                        >
                            <Text style={styles.resetButtonText}>Reset Filters</Text>
                        </TouchableOpacity>
                    </View>
                }
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => toggleExpand(item.id)}
                        activeOpacity={0.8}
                    >
                        <View style={styles.cardHeader}>
                            <View>
                                <Text style={styles.date}>📅 {item.date}</Text>
                                {item.domain && (
                                    <Text style={styles.domainPill}>{item.domain}</Text>
                                )}
                            </View>
                            <Text style={[styles.score, { color: getScoreColor(item.score) }]}>
                                {item.score}%
                            </Text>
                        </View>

                        {expandedId === item.id && (
                            <View style={styles.detailsContainer}>
                                <Text style={styles.interviewer}>
                                    Interviewer: {item.interviewer}
                                </Text>
                                <Text style={styles.feedbackTitle}>Feedback:</Text>
                                <Text style={styles.feedback}>{item.feedback}</Text>

                                <View style={styles.insightsContainer}>
                                    <View style={[
                                        styles.insightPill,
                                        { 
                                            backgroundColor: getScoreColor(item.score),
                                            paddingHorizontal: 12
                                        }
                                    ]}>
                                        <Text style={[styles.insightText, { color: '#fff' }]}>
                                            {item.score >= 85 ? 'Excellent' :
                                                item.score >= 70 ? 'Good' : 'Needs Improvement'}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        )}

                        <View style={styles.expandButton}>
                            <Ionicons
                                name={expandedId === item.id ? 'chevron-up' : 'chevron-down'}
                                size={20}
                                color="#6200ee"
                            />
                        </View>
                    </TouchableOpacity>
                )}
            />

            {/* Domain Filter Modal */}
            <Modal
                visible={showDomainFilter}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowDomainFilter(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Filter by Domain</Text>
                        {domainOptions.map((domain) => (
                            <Pressable
                                key={domain}
                                style={[styles.filterOption, 
                                    selectedDomain === domain && styles.selectedFilterOption]}
                                onPress={() => {
                                    setSelectedDomain(domain === selectedDomain ? null : domain);
                                    setShowDomainFilter(false);
                                }}
                            >
                                <Text style={[
                                    styles.filterOptionText,
                                    selectedDomain === domain && styles.selectedFilterOptionText
                                ]}>
                                    {domain}
                                </Text>
                                {selectedDomain === domain && (
                                    <Ionicons name="checkmark" size={20} color="#6200ee" />
                                )}
                            </Pressable>
                        ))}
                        <Pressable
                            style={styles.modalCloseButton}
                            onPress={() => setShowDomainFilter(false)}
                        >
                            <Text style={styles.modalCloseButtonText}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* Score Filter Modal */}
            <Modal
                visible={showScoreFilter}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowScoreFilter(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Filter by Score Range</Text>
                        {scoreRangeOptions.map((range, index) => (
                            <Pressable
                                key={index}
                                style={[styles.filterOption, 
                                    selectedScoreRange === range && styles.selectedFilterOption]}
                                onPress={() => {
                                    setSelectedScoreRange(range);
                                    setShowScoreFilter(false);
                                }}
                            >
                                <Text style={[
                                    styles.filterOptionText,
                                    selectedScoreRange === range && styles.selectedFilterOptionText
                                ]}>
                                    {range.label}
                                </Text>
                                {selectedScoreRange === range && (
                                    <Ionicons name="checkmark" size={20} color="#6200ee" />
                                )}
                            </Pressable>
                        ))}
                        <Pressable
                            style={styles.modalCloseButton}
                            onPress={() => setShowScoreFilter(false)}
                        >
                            <Text style={styles.modalCloseButtonText}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f9fa',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#495057',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#212529',
        marginBottom: 8,
    },
    filterContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#6200ee',
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    filterButtonText: {
        color: '#6200ee',
        fontSize: 14,
        marginRight: 4,
    },
    resetButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f1f3f5',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    resetButtonLarge: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f1f3f5',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginTop: 16,
    },
    resetButtonText: {
        color: '#495057',
        fontSize: 14,
        fontWeight: '500',
    },
    resultsCount: {
        fontSize: 14,
        color: '#868e96',
        marginBottom: 12,
    },
    listContent: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    date: {
        fontSize: 16,
        fontWeight: '600',
        color: '#495057',
    },
    domainPill: {
        backgroundColor: '#f1f3f5',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        fontSize: 12,
        color: '#495057',
        marginTop: 4,
        alignSelf: 'flex-start',
    },
    score: {
        fontSize: 18,
        fontWeight: '700',
    },
    detailsContainer: {
        marginTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
        paddingTop: 12,
    },
    interviewer: {
        fontSize: 14,
        color: '#6c5ce7',
        marginBottom: 8,
        fontWeight: '500',
    },
    feedbackTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#212529',
        marginBottom: 4,
    },
    feedback: {
        fontSize: 14,
        color: '#495057',
        lineHeight: 20,
    },
    insightsContainer: {
        flexDirection: 'row',
        marginTop: 12,
        gap: 8,
    },
    insightPill: {
        borderRadius: 20,
        paddingVertical: 4,
    },
    insightText: {
        fontSize: 12,
        fontWeight: '500',
    },
    expandButton: {
        alignItems: 'center',
        marginTop: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#212529',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 16,
        color: '#868e96',
        textAlign: 'center',
        marginBottom: 24,
    },
    scheduleButton: {
        backgroundColor: '#6200ee',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    scheduleButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    noResultsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    noResultsText: {
        fontSize: 16,
        color: '#868e96',
        marginTop: 16,
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        maxHeight: '70%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#212529',
    },
    filterOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f3f5',
    },
    selectedFilterOption: {
        backgroundColor: '#f3e8ff',
    },
    filterOptionText: {
        fontSize: 16,
        color: '#495057',
    },
    selectedFilterOptionText: {
        color: '#6200ee',
        fontWeight: '500',
    },
    modalCloseButton: {
        marginTop: 16,
        padding: 12,
        alignItems: 'center',
        backgroundColor: '#6200ee',
        borderRadius: 8,
    },
    modalCloseButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default MockInterviewScreen;