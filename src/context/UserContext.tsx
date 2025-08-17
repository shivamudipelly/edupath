// UserContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type DomainKey = 'fullstack' | 'aiml' | 'uiux' | 'data' | 'cyber';

interface UserData {
    domain: DomainKey | null;
    studySchedule: {
        days: string[];
        time: string;
        reminders: boolean;
    } | null;
    testScores: { date: string; score: number }[];
    interviewResults: { date: string; score: number; feedback: string }[];
    completedRoadmapItems: string[];
}

interface UserContextType {
    userData: UserData;
    setUserData: React.Dispatch<React.SetStateAction<UserData>>;
    updateDomain: (domain: DomainKey) => void;
    addTestScore: (score: number) => void;
    addInterviewResult: (result: { score: number; feedback: string }) => void;
    completeRoadmapItem: (item: string) => void;
    setStudySchedule: (schedule: { days: string[]; time: string }) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userData, setUserData] = useState<UserData>({
        domain: null,
        studySchedule: null,
        testScores: [],
        interviewResults: [],
        completedRoadmapItems: []
    });

    // Load data from storage on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                const storedData = await AsyncStorage.getItem('userData');
                if (storedData) setUserData(JSON.parse(storedData));
            } catch (error) {
                console.error('Failed to load user data', error);
            }
        };
        loadData();
    }, []);

    // Save data to storage when it changes
    useEffect(() => {
        const saveData = async () => {
            try {
                await AsyncStorage.setItem('userData', JSON.stringify(userData));
            } catch (error) {
                console.error('Failed to save user data', error);
            }
        };
        saveData();
    }, [userData]);

    const updateDomain = (domain: DomainKey) => {
        setUserData(prev => ({
            ...prev,
            domain,
            completedRoadmapItems: []
        }));
    };

    const addTestScore = (score: number) => {
        setUserData(prev => ({
            ...prev,
            testScores: [...prev.testScores, { date: new Date().toISOString(), score }]
        }));
    };

    const addInterviewResult = (result: { score: number; feedback: string }) => {
        setUserData(prev => ({
            ...prev,
            interviewResults: [...prev.interviewResults, {
                date: new Date().toISOString(),
                ...result
            }]
        }));
    };

    const completeRoadmapItem = (item: string) => {
        setUserData(prev => ({
            ...prev,
            completedRoadmapItems: [...prev.completedRoadmapItems, item]
        }));
    };

    const setStudySchedule = (schedule: { days: string[]; time: string }) => {
        setUserData(prev => ({
            ...prev,
            studySchedule: schedule
        } as UserData));
    };

    return (
        <UserContext.Provider value={{
            userData,
            setUserData,
            updateDomain,
            addTestScore,
            addInterviewResult,
            completeRoadmapItem,
            setStudySchedule
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
};