import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    StatusBar,
    ImageBackground,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navigation from '../components/Navigation';

const MOOD_TYPES = {
    terrible: { emoji: '😵', label: 'Terrible', color: '#9CA3AF' },
    bad: { emoji: '😢', label: 'Bad', color: '#F8A5A5' },
    okay: { emoji: '😐', label: 'Okay', color: '#8FD4A0' },
    good: { emoji: '😊', label: 'Good', color: '#A8E6A1' },
    excellent: { emoji: '😄', label: 'Excellent', color: '#FFD580' },
};

const MOOD_KEYS = ['terrible', 'bad', 'okay', 'good', 'excellent'];

export default function MoodCalendar({ navigation }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [moods, setMoods] = useState({});

    // Load moods from storage on component mount
    useEffect(() => {
        loadMoods();
    }, []);

    const loadMoods = async () => {
        try {
            const savedMoods = await AsyncStorage.getItem('moodHistory');
            if (savedMoods) {
                setMoods(JSON.parse(savedMoods));
            }
        } catch (error) {
            console.log('Error loading moods:', error);
        }
    };

    const saveMood = async (mood) => {
        try {
            const today = new Date();
            const dateKey = today.toISOString().split('T')[0];
            const updatedMoods = { ...moods, [dateKey]: mood };
            setMoods(updatedMoods);
            await AsyncStorage.setItem('moodHistory', JSON.stringify(updatedMoods));
        } catch (error) {
            console.log('Error saving mood:', error);
        }
    };

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const getMoodForDate = (day) => {
        const dateKey = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
            .toISOString()
            .split('T')[0];
        return moods[dateKey];
    };

    const renderCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        // Empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            days.push(
                <View key={`empty-${i}`} style={styles.calendarDay}>
                    <Text style={styles.dayNumber}></Text>
                </View>
            );
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const mood = getMoodForDate(day);
            days.push(
                <View key={day} style={styles.calendarDay}>
                    {mood ? (
                        <View style={styles.moodCell}>
                            <Text style={styles.moodEmoji}>{MOOD_TYPES[mood].emoji}</Text>
                        </View>
                    ) : (
                        <Text style={styles.dayNumber}>{day}</Text>
                    )}
                </View>
            );
        }

        return days;
    };

    const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    return (
        <ImageBackground
            source={require('../../assets/background.png')}
            style={styles.background}
            resizeMode="cover"
        >
            <SafeAreaView style={styles.container} edges={['right', 'left', 'bottom']}>
                <StatusBar barStyle="dark-content" />

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Mood Tracker</Text>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Today's Mood Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>How are you today?</Text>
                        <Text style={styles.sectionSubtitle}>Track your mood over time</Text>

                        <View style={styles.moodSelector}>
                            {MOOD_KEYS.map((moodKey) => (
                                <TouchableOpacity
                                    key={moodKey}
                                    style={styles.moodButton}
                                    onPress={() => saveMood(moodKey)}
                                >
                                    <View
                                        style={[
                                            styles.moodCircle,
                                            { backgroundColor: MOOD_TYPES[moodKey].color },
                                        ]}
                                    >
                                        <Text style={styles.moodEmojiLarge}>
                                            {MOOD_TYPES[moodKey].emoji}
                                        </Text>
                                    </View>
                                    <Text style={styles.moodLabel}>{MOOD_TYPES[moodKey].label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Mood History Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Mood History</Text>
                        <Text style={styles.sectionSubtitle}>Track your mood over time</Text>

                        {/* Month Navigation */}
                        <View style={styles.monthHeader}>
                            <TouchableOpacity onPress={previousMonth}>
                                <Ionicons name="chevron-back" size={24} color="#2f4f4f" />
                            </TouchableOpacity>
                            <Text style={styles.monthName}>{monthName}</Text>
                            <TouchableOpacity onPress={nextMonth}>
                                <Ionicons name="chevron-forward" size={24} color="#2f4f4f" />
                            </TouchableOpacity>
                        </View>

                        {/* Calendar Grid */}
                        <View style={styles.calendar}>
                            {/* Day headers */}
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                                <View key={index} style={styles.dayHeader}>
                                    <Text style={styles.dayHeaderText}>{day}</Text>
                                </View>
                            ))}

                            {/* Calendar days */}
                            {renderCalendarDays()}
                        </View>
                    </View>

                    <View style={{ height: 30 }} />
                </ScrollView>

                <Navigation navigation={navigation} currentScreen="MoodCalendar" />
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2f4f4f',
        textAlign: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    section: {
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2f4f4f',
        textAlign: 'center',
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: 16,
        color: '#4f7f6b',
        textAlign: 'center',
        marginBottom: 20,
    },
    moodSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 20,
        paddingVertical: 16,
        paddingHorizontal: 12,
    },
    moodButton: {
        alignItems: 'center',
    },
    moodCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    moodEmojiLarge: {
        fontSize: 32,
    },
    moodLabel: {
        fontSize: 12,
        color: '#4f7f6b',
        textAlign: 'center',
    },
    monthHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    monthName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2f4f4f',
    },
    calendar: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 20,
        padding: 12,
    },
    dayHeader: {
        width: '14.28%',
        paddingVertical: 12,
        alignItems: 'center',
    },
    dayHeaderText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2f4f4f',
    },
    calendarDay: {
        width: '14.28%',
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 50,
    },
    dayNumber: {
        fontSize: 14,
        color: '#4f7f6b',
    },
    moodCell: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    moodEmoji: {
        fontSize: 24,
    },
});
