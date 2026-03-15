import React, { useState, useEffect } from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ref, push, set } from 'firebase/database';
import { database } from '../firebaseConfig';

const moodOptions = [
    { emoji: '😢', label: 'Terrible', value: 1 },
    { emoji: '😞', label: 'Bad', value: 2 },
    { emoji: '😐', label: 'Okay', value: 3 },
    { emoji: '🙂', label: 'Good', value: 4 },
    { emoji: '😄', label: 'Great', value: 5 },
];

export const WeeklyMoodTracker = ({ user }) => {
    const [showMoodRating, setShowMoodRating] = useState(false);

    useEffect(() => {
        if (user) {
            // Show modal on app launch
            setShowMoodRating(true);
        }
    }, [user]);

    const handleMoodSelect = async (mood) => {
        setShowMoodRating(false);

        try {
            const now = new Date().toISOString();
            await AsyncStorage.setItem('lastMoodRatingTime', now);
            await AsyncStorage.setItem('userMood', JSON.stringify({
                ...mood,
                timestamp: now
            }));

            // Save to Firebase in background (don't wait)
            if (user?.uid) {
                saveToFirebase(mood, user);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to save mood');
        }
    };

    const saveToFirebase = async (mood, currentUser) => {
        try {
            const moodData = {
                emoji: mood.emoji,
                label: mood.label,
                mood: mood.value,
                userEmail: currentUser.email,
                createdAt: Date.now()
            };

            const moodEntriesRef = ref(database, `userMoods/${currentUser.uid}/entries`);
            const newMoodRef = push(moodEntriesRef);
            await set(newMoodRef, moodData);

            Alert.alert('Success', 'Mood saved to cloud');
        } catch (error) {
            console.error('Error saving mood:', error);
            Alert.alert('Error', 'Failed to save to cloud');
        }
    };


    return (
        <Modal
            visible={showMoodRating}
            transparent={true}
            animationType="slide"
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
                                activeOpacity={0.7}
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
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    moodModalContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        padding: 24,
        width: '90%',
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
    },
    moodModalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2D4F4F',
        textAlign: 'center',
        marginBottom: 30,
    },
    moodButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    moodButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 15,
        backgroundColor: '#F0F7F4', // Light version of your theme green
    },
    moodEmoji: {
        fontSize: 30,
        marginBottom: 5,
    },
    moodLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#4F7F6B',
        textTransform: 'uppercase',
    },
});