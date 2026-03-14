import React, { useState, useEffect } from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const moodOptions = [
    { emoji: '😢', label: 'Terrible', value: 1 },
    { emoji: '😞', label: 'Bad', value: 2 },
    { emoji: '😐', label: 'Okay', value: 3 },
    { emoji: '🙂', label: 'Good', value: 4 },
    { emoji: '😄', label: 'Great', value: 5 },
];

export const WeeklyMoodTracker = ({ user }) => {
    const [showMoodRating, setShowMoodRating] = useState(false);

    // Check if mood rating should be shown
    useEffect(() => {
        if (!user) return;

        const checkAndShowMoodRating = async () => {
            try {
                // For testing: always show on app reopen
                const lastMoodTime = await AsyncStorage.getItem('lastMoodRatingTime');

                if (!lastMoodTime) {
                    // First time user
                    setShowMoodRating(true);
                } else {
                    // For testing: show every app reopen. Remove this logic later and replace with week check
                    const lastTime = new Date(lastMoodTime);
                    const currentTime = new Date();
                    const daysDifference = (currentTime - lastTime) / (1000 * 60 * 60 * 24);

                    // For now, show every time for testing. Change to daysDifference >= 7 for production
                    setShowMoodRating(true);
                    // Production logic: setShowMoodRating(daysDifference >= 7);
                }
            } catch (error) {
                console.error('Error checking mood rating:', error);
            }
        };

        checkAndShowMoodRating();
    }, [user]);

    const handleMoodSelect = async (mood) => {
        try {
            await AsyncStorage.setItem('lastMoodRatingTime', new Date().toISOString());
            await AsyncStorage.setItem(
                'userMood',
                JSON.stringify({
                    mood: mood.value,
                    label: mood.label,
                    timestamp: new Date().toISOString(),
                })
            );
            setShowMoodRating(false);
            console.log('Mood recorded:', mood.label);
        } catch (error) {
            console.error('Error saving mood:', error);
        }
    };

    return (
        <Modal
            visible={showMoodRating}
            transparent={true}
            animationType="fade"
            onRequestClose={() => { }} // No close button - user must select mood
        >
            <View style={styles.moodModalOverlay}>
                <View style={styles.moodModalContainer}>
                    <Text style={styles.moodModalTitle}>How are you feeling today?</Text>

                    <View style={styles.moodButtonsContainer}>
                        {moodOptions.map((mood) => (
                            <TouchableOpacity
                                key={mood.value}
                                style={styles.moodButton}
                                onPress={() => handleMoodSelect(mood)}
                            >
                                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                                <Text style={styles.moodLabel}>{mood.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    moodModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    moodModalContainer: {
        backgroundColor: 'white',
        borderRadius: 20,
        paddingVertical: 32,
        paddingHorizontal: 24,
        width: '85%',
        maxWidth: 380,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
    moodModalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2f4f4f',
        textAlign: 'center',
        marginBottom: 28,
    },
    moodButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 4,
    },
    moodButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 4,
        borderRadius: 12,
        backgroundColor: '#f5f5f5',
    },
    moodEmoji: {
        fontSize: 32,
        marginBottom: 4,
    },
    moodLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4f7f6b',
        textAlign: 'center',
    },
});
