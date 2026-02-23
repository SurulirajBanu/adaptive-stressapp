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
    Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';
import Navigation from '../components/Navigation';

const CATEGORIES = ['Work', 'Study', 'Relationship', 'Financial', 'Health', 'Family', 'Other'];

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export default function StressForm({ navigation, route }) {
    const isEditing = route?.params?.item ? true : false;
    const existingItem = route?.params?.item;

    const [description, setDescription] = useState(existingItem?.description || '');
    const [selectedCategory, setSelectedCategory] = useState(existingItem?.category || 'Work');
    const [solution, setSolution] = useState(existingItem?.solution || '');
    const [reminderEnabled, setReminderEnabled] = useState(existingItem?.reminderTime ? true : false);
    const [month, setMonth] = useState(String(existingItem?.reminderTime ? new Date(existingItem.reminderTime).getMonth() + 1 : new Date().getMonth() + 1).padStart(2, '0'));
    const [day, setDay] = useState(String(existingItem?.reminderTime ? new Date(existingItem.reminderTime).getDate() : new Date().getDate()).padStart(2, '0'));
    const [year, setYear] = useState(String(existingItem?.reminderTime ? new Date(existingItem.reminderTime).getFullYear() : new Date().getFullYear()));
    const [hour, setHour] = useState(() => {
        let h = existingItem?.reminderTime ? new Date(existingItem.reminderTime).getHours() : new Date().getHours();
        let displayH = h % 12 || 12;
        return String(displayH).padStart(2, '0');
    });
    const [minute, setMinute] = useState(String(existingItem?.reminderTime ? new Date(existingItem.reminderTime).getMinutes() : new Date().getMinutes()).padStart(2, '0'));
    const [ampm, setAmpm] = useState(existingItem?.reminderTime ? (new Date(existingItem.reminderTime).getHours() >= 12 ? 'PM' : 'AM') : (new Date().getHours() >= 12 ? 'PM' : 'AM'));
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [pickerDate, setPickerDate] = useState(new Date(parseInt(year), parseInt(month) - 1, parseInt(day)));
    const [showTimePickerModal, setShowTimePickerModal] = useState(false);

    useEffect(() => {
        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('reminders', {
                name: 'Reminders',
                importance: Notifications.AndroidImportance.HIGH,
                sound: true,
            });
        }
    }, []);

    const scheduleReminder = async () => {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'Please enable notifications to set reminders.');
            return false;
        }

        // Convert 12-hour format to 24-hour format
        let hour24 = parseInt(hour);
        if (ampm === 'PM' && hour24 !== 12) {
            hour24 += 12;
        } else if (ampm === 'AM' && hour24 === 12) {
            hour24 = 0;
        }

        // Build reminder date from individual fields
        const reminderDateTime = new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day),
            hour24,
            parseInt(minute)
        );

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

    const handleDateChange = (event, selectedDate) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }
        if (selectedDate) {
            setPickerDate(selectedDate);
            setMonth(String(selectedDate.getMonth() + 1).padStart(2, '0'));
            setDay(String(selectedDate.getDate()).padStart(2, '0'));
            setYear(String(selectedDate.getFullYear()));
        }
    };

    const handleSave = async () => {
        if (description.trim().length === 0) {
            alert('Please describe your stress source');
            return;
        }

        if (solution.trim().length === 0) {
            alert('Please write down a possible solution');
            return;
        }

        try {
            // Schedule reminder if enabled
            if (reminderEnabled) {
                const scheduled = await scheduleReminder();
                if (!scheduled) return;
            }

            // Create or update stress item
            const stressItem = isEditing
                ? {
                    ...existingItem,
                    description,
                    category: selectedCategory,
                    solution,
                    reminderTime: reminderEnabled ? new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute)).toISOString() : null,
                }
                : {
                    id: Date.now().toString(),
                    description,
                    category: selectedCategory,
                    solution,
                    solved: false,
                    createdAt: new Date().toISOString(),
                    reminderTime: reminderEnabled ? new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute)).toISOString() : null,
                };

            // Save to AsyncStorage
            let existingItems = await AsyncStorage.getItem('stressItems');
            let items = existingItems ? JSON.parse(existingItems) : [];

            if (isEditing) {
                items = items.map(item => (item.id === stressItem.id ? stressItem : item));
            } else {
                items.push(stressItem);
            }

            await AsyncStorage.setItem('stressItems', JSON.stringify(items));

            // Navigate back to StressTracker
            navigation.navigate('StressTracker');
        } catch (error) {
            console.log('Error saving stress item:', error);
            alert('Error saving stress item');
        }
    };

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
                            <Text style={styles.headerTitle}>
                                {isEditing ? 'Edit Stress' : 'Add Stress Source'}
                            </Text>
                            <View style={{ width: 32 }} />
                        </View>

                        {/* Identify Your Stress Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Identify Your Stress</Text>
                            <Text style={styles.subtitle}>
                                Take a moment to reflect on what's causing you stress right now.
                            </Text>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>What's causing your stress?</Text>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Describe the situation that is stressing you..."
                                    placeholderTextColor="#999"
                                    multiline
                                    maxLength={200}
                                    value={description}
                                    onChangeText={setDescription}
                                    textAlignVertical="top"
                                />
                                <Text style={styles.charCount}>{description.length}/200</Text>
                            </View>

                            <View style={styles.categorySection}>
                                <Text style={styles.label}>Category</Text>
                                <View style={styles.categoryGrid}>
                                    {CATEGORIES.map(category => (
                                        <TouchableOpacity
                                            key={category}
                                            style={[
                                                styles.categoryButton,
                                                selectedCategory === category && styles.categoryButtonActive,
                                            ]}
                                            onPress={() => setSelectedCategory(category)}
                                        >
                                            <Text
                                                style={[
                                                    styles.categoryButtonText,
                                                    selectedCategory === category && styles.categoryButtonTextActive,
                                                ]}
                                            >
                                                {category}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        {/* Possible Solutions Section */}
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
                                    <View style={styles.dateTimeRow}>
                                        <TouchableOpacity
                                            style={styles.datePickerButton}
                                            onPress={() => setShowDatePicker(true)}
                                        >
                                            <Ionicons name="calendar" size={20} color="#6FAF98" />
                                            <Text style={styles.datePickerButtonText}>
                                                {month}/{day}/{year}
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={styles.datePickerButton}
                                            onPress={() => setShowTimePickerModal(true)}
                                        >
                                            <Ionicons name="time" size={20} color="#6FAF98" />
                                            <Text style={styles.datePickerButtonText}>
                                                {hour}:{minute} {ampm}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        </View>
                    </ScrollView>

                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>
                            {isEditing ? 'Update Stress & Reminder' : 'Save Solutions & Set Reminder'}
                        </Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>

                <Navigation navigation={navigation} currentScreen="Stress" />

                {showDatePicker && (
                    <DateTimePicker
                        value={pickerDate}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                        onChange={handleDateChange}
                        minimumDate={new Date()}
                    />
                )}

                <Modal
                    visible={showTimePickerModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowTimePickerModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.timePickerModal}>
                            <View style={styles.timePickerModalHeader}>
                                <Text style={styles.timePickerModalHeaderTime}>{hour}:{minute} {ampm}</Text>
                            </View>

                            <View style={styles.timePickerModalContent}>
                                <View style={styles.timePickerModalSection}>
                                    <Text style={styles.timePickerModalLabel}>Hour</Text>
                                    <TouchableOpacity onPress={() => {
                                        let h = parseInt(hour) + 1;
                                        if (h > 12) h = 1;
                                        setHour(String(h).padStart(2, '0'));
                                    }}>
                                        <Ionicons name="chevron-up" size={28} color="#6FAF98" />
                                    </TouchableOpacity>
                                    <Text style={styles.timePickerModalValue}>{hour}</Text>
                                    <TouchableOpacity onPress={() => {
                                        let h = parseInt(hour) - 1;
                                        if (h < 1) h = 12;
                                        setHour(String(h).padStart(2, '0'));
                                    }}>
                                        <Ionicons name="chevron-down" size={28} color="#6FAF98" />
                                    </TouchableOpacity>
                                </View>

                                <Text style={styles.timePickerModalSeparator}>:</Text>

                                <View style={styles.timePickerModalSection}>
                                    <Text style={styles.timePickerModalLabel}>Minute</Text>
                                    <TouchableOpacity onPress={() => {
                                        let m = parseInt(minute) + 1;
                                        if (m > 59) m = 0;
                                        setMinute(String(m).padStart(2, '0'));
                                    }}>
                                        <Ionicons name="chevron-up" size={28} color="#6FAF98" />
                                    </TouchableOpacity>
                                    <Text style={styles.timePickerModalValue}>{minute}</Text>
                                    <TouchableOpacity onPress={() => {
                                        let m = parseInt(minute) - 1;
                                        if (m < 0) m = 59;
                                        setMinute(String(m).padStart(2, '0'));
                                    }}>
                                        <Ionicons name="chevron-down" size={28} color="#6FAF98" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.timePickerModalAmPmContainer}>
                                <TouchableOpacity
                                    style={[styles.timePickerModalAmPmButton, ampm === 'AM' && styles.timePickerModalAmPmButtonActive]}
                                    onPress={() => setAmpm('AM')}
                                >
                                    <Text style={[styles.timePickerModalAmPmText, ampm === 'AM' && styles.timePickerModalAmPmTextActive]}>AM</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.timePickerModalAmPmButton, ampm === 'PM' && styles.timePickerModalAmPmButtonActive]}
                                    onPress={() => setAmpm('PM')}
                                >
                                    <Text style={[styles.timePickerModalAmPmText, ampm === 'PM' && styles.timePickerModalAmPmTextActive]}>PM</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.timePickerModalFooter}>
                                <TouchableOpacity
                                    style={styles.timePickerModalCancelButton}
                                    onPress={() => setShowTimePickerModal(false)}
                                >
                                    <Text style={styles.timePickerModalCancelButtonText}>CANCEL</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.timePickerModalOkButton}
                                    onPress={() => setShowTimePickerModal(false)}
                                >
                                    <Text style={styles.timePickerModalOkButtonText}>OK</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
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
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2f4f4f',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#4f7f6b',
        marginBottom: 16,
    },
    inputContainer: {
        marginBottom: 20,
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
    categorySection: {
        marginBottom: 20,
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    categoryButton: {
        width: '31%',
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderWidth: 2,
        borderColor: '#ddd',
        alignItems: 'center',
    },
    categoryButtonActive: {
        backgroundColor: '#6FAF98',
        borderColor: '#6FAF98',
    },
    categoryButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4f7f6b',
    },
    categoryButtonTextActive: {
        color: 'white',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.1)',
        marginVertical: 20,
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
    dateTimeInputsContainer: {
        marginTop: 12,
        marginBottom: 12,
        flexDirection: 'row',
        gap: 8,
    },
    dateInputGroup: {
        flex: 1,
    },
    timeInputsContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    timeInputGroup: {
        flex: 1,
    },
    dateTimeLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#2f4f4f',
        marginBottom: 6,
    },
    dateTimeInput: {
        backgroundColor: 'white',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#6FAF98',
        paddingVertical: 10,
        paddingHorizontal: 8,
        fontSize: 14,
        fontWeight: '600',
        color: '#2f4f4f',
        textAlign: 'center',
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
    timePickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        marginBottom: 12,
        backgroundColor: 'rgba(111, 175, 152, 0.05)',
        borderRadius: 12,
        paddingVertical: 16,
    },
    timePickerSection: {
        alignItems: 'center',
        flex: 1,
    },
    timePickerLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4f7f6b',
        marginBottom: 8,
    },
    scrollPicker: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    timePickerValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2f4f4f',
        marginVertical: 8,
        minWidth: 50,
        textAlign: 'center',
    },
    timePickerSeparator: {
        fontSize: 24,
        fontWeight: '700',
        color: '#6FAF98',
        marginHorizontal: 8,
    },
    datePickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(111, 175, 152, 0.1)',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginTop: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#6FAF98',
        gap: 8,
        flex: 1,
    },
    datePickerButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2f4f4f',
    },
    dateTimeRow: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 12,
    },
    compactTimePickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(111, 175, 152, 0.1)',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#6FAF98',
        gap: 16,
        flex: 1,
    },
    compactTimePickerSection: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    compactTimePickerValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2f4f4f',
        minWidth: 35,
        textAlign: 'center',
    },
    compactTimePickerSeparator: {
        fontSize: 16,
        fontWeight: '700',
        color: '#6FAF98',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    timePickerModal: {
        backgroundColor: 'white',
        borderRadius: 20,
        paddingHorizontal: 0,
        paddingVertical: 0,
        width: '85%',
        maxWidth: 340,
        overflow: 'hidden',
    },
    timePickerModalHeader: {
        backgroundColor: '#6FAF98',
        paddingVertical: 24,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    timePickerModalHeaderTime: {
        fontSize: 38,
        fontWeight: '700',
        color: 'white',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2f4f4f',
    },
    timePickerModalContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 30,
        paddingHorizontal: 20,
        gap: 20,
    },
    timePickerModalSection: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    timePickerModalLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4f7f6b',
    },
    timePickerModalValue: {
        fontSize: 32,
        fontWeight: '700',
        color: '#2f4f4f',
        minWidth: 60,
        textAlign: 'center',
    },
    timePickerModalValueInput: {
        fontSize: 32,
        fontWeight: '700',
        color: '#2f4f4f',
        minWidth: 60,
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#6FAF98',
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 8,
        backgroundColor: 'rgba(111, 175, 152, 0.05)',
    },
    timePickerModalSeparator: {
        fontSize: 28,
        fontWeight: '700',
        color: '#6FAF98',
    },
    timePickerModalFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 16,
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    timePickerModalCancelButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    timePickerModalCancelButtonText: {
        color: '#6FAF98',
        fontSize: 14,
        fontWeight: '700',
    },
    timePickerModalOkButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    timePickerModalOkButtonText: {
        color: '#6FAF98',
        fontSize: 14,
        fontWeight: '700',
    },
    timePickerModalButton: {
        backgroundColor: '#6FAF98',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    timePickerModalButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
    timePickerModalAmPmContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    timePickerModalAmPmButton: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#6FAF98',
        backgroundColor: 'transparent',
    },
    timePickerModalAmPmButtonActive: {
        backgroundColor: '#6FAF98',
    },
    timePickerModalAmPmText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#6FAF98',
    },
    timePickerModalAmPmTextActive: {
        color: 'white',
    },
});
