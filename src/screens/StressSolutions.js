import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    StatusBar,
    ImageBackground,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Switch,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import Navigation from '../components/Navigation';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export default function StressSolutions({ navigation, route }) {
    const { stressDescription, category } = route.params;
    const [solution, setSolution] = useState('');
    const [reminderEnabled, setReminderEnabled] = useState(false);
    const [reminderDate, setReminderDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    useEffect(() => {
        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('reminders', {
                name: 'Reminders',
                importance: Notifications.AndroidImportance.HIGH,
                sound: true,
            });
        }
    }, []);

    const handleDateChange = (event, selectedDate) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }
        if (selectedDate) {
            setReminderDate(selectedDate);
        }
    };

    const handleTimeChange = (event, selectedTime) => {
        if (Platform.OS === 'android') {
            setShowTimePicker(false);
        }
        if (selectedTime) {
            const newDate = new Date(reminderDate);
            newDate.setHours(selectedTime.getHours());
            newDate.setMinutes(selectedTime.getMinutes());
            setReminderDate(newDate);
        }
    };

    const scheduleReminder = async (reminderDateTime) => {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'Please enable notifications to set reminders.');
            return false;
        }

        const now = new Date();
        if (reminderDateTime <= now) {
            Alert.alert('Invalid time', 'Please select a future date and time');
            return false;
        }

        try {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Time to work on your solution! 💡',
                    body: `Solution: ${solution}`,
                    sound: true,
                },
                trigger: {
                    type: 'date',
                    date: reminderDateTime,
                },
            });
            return true;
        } catch (error) {
            console.log('Error scheduling reminder:', error);
            return false;
        }
    };

    const handleSave = async () => {
        if (solution.trim().length === 0) {
            alert('Please write down a possible solution');
            return;
        }

        try {
            // Schedule reminder if enabled
            if (reminderEnabled) {
                const scheduled = await scheduleReminder(reminderDate);
                if (!scheduled) return;
            }

            // Create stress item with solution
            const stressItem = {
                id: Date.now().toString(),
                description: stressDescription,
                category: category,
                solution: solution,
                solved: false,
                createdAt: new Date().toISOString(),
                reminderTime: reminderEnabled ? reminderDate.toISOString() : null,
            };

            // Save to AsyncStorage
            const existingItems = await AsyncStorage.getItem('stressItems');
            const items = existingItems ? JSON.parse(existingItems) : [];
            items.push(stressItem);
            await AsyncStorage.setItem('stressItems', JSON.stringify(items));

            // Navigate back to StressTracker
            navigation.navigate('StressTracker');
        } catch (error) {
            console.log('Error saving stress item:', error);
            alert('Error saving stress item');
        }
    };

    const dateString = reminderDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    const timeString = reminderDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <ImageBackground
            source={require('../../assets/background.png')}
            style={styles.background}
            resizeMode="cover"
        >
            <SafeAreaView style={styles.container} edges={['right', 'left', 'bottom']}>
                <StatusBar barStyle="dark-content" />

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <ScrollView contentContainerStyle={styles.content}>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Ionicons name="chevron-back" size={32} color="#4f7f6b" />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>Practice</Text>
                            <View style={{ width: 32 }} />
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>What are some possible solutions?</Text>
                            <Text style={styles.subtitle}>
                                Write down ideas or steps that could help you deal with this stress.
                            </Text>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Possible solutions to help</Text>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="List ideas, steps, or plans that could help you manage your stress..."
                                    placeholderTextColor="#999"
                                    multiline
                                    maxLength={200}
                                    value={solution}
                                    onChangeText={setSolution}
                                    textAlignVertical="top"
                                />
                                <Text style={styles.charCount}>{solution.length}/200</Text>
                            </View>

                            <View style={styles.reminderSection}>
                                <View style={styles.reminderHeader}>
                                    <Ionicons name="notifications-outline" size={20} color="#4f7f6b" />
                                    <Text style={styles.reminderLabel}>Remind me</Text>
                                    <Switch
                                        value={reminderEnabled}
                                        onValueChange={setReminderEnabled}
                                        trackColor={{ false: '#ccc', true: '#B5EAD7' }}
                                        thumbColor={reminderEnabled ? '#6FAF98' : '#fff'}
                                    />
                                </View>

                                {reminderEnabled && (
                                    <View style={styles.reminderOptions}>
                                        <TouchableOpacity
                                            style={styles.dateTimeButton}
                                            onPress={() => setShowDatePicker(true)}
                                        >
                                            <Text style={styles.dateTimeText}>{dateString}</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={styles.dateTimeButton}
                                            onPress={() => setShowTimePicker(true)}
                                        >
                                            <Text style={styles.dateTimeText}>{timeString}</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>

                            {showDatePicker && (
                                <DateTimePicker
                                    value={reminderDate}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={handleDateChange}
                                />
                            )}

                            {showTimePicker && (
                                <DateTimePicker
                                    value={reminderDate}
                                    mode="time"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={handleTimeChange}
                                />
                            )}
                        </View>
                    </ScrollView>

                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Save Solutions & Set Reminder</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>

                <Navigation navigation={navigation} currentScreen="Stress" />
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
    keyboardView: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2f4f4f',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2f4f4f',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#4f7f6b',
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2f4f4f',
        marginBottom: 8,
    },
    textInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 12,
        padding: 12,
        minHeight: 100,
        fontSize: 14,
        color: '#2f4f4f',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    charCount: {
        fontSize: 12,
        color: '#999',
        marginTop: 6,
        textAlign: 'right',
    },
    reminderSection: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    reminderHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    reminderLabel: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
        color: '#2f4f4f',
        marginLeft: 12,
    },
    reminderOptions: {
        flexDirection: 'row',
        marginTop: 12,
        gap: 8,
    },
    dateTimeButton: {
        flex: 1,
        backgroundColor: 'rgba(111, 175, 152, 0.1)',
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#6FAF98',
    },
    dateTimeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4f7f6b',
    },
    saveButton: {
        backgroundColor: '#6FAF98',
        marginHorizontal: 20,
        marginBottom: 20,
        paddingVertical: 14,
        borderRadius: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
});
