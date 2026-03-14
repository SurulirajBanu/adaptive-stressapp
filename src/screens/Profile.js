import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
  Switch,
  Platform,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import Navigation from '../components/Navigation';

export default function ProfileScreen({ navigation }) {
  const [isReminderEnabled, setIsReminderEnabled] = useState(false);
  const [hour, setHour] = useState(() => {
    const h = new Date().getHours();
    const displayH = h % 12 || 12;
    return String(displayH).padStart(2, '0');
  });
  const [minute, setMinute] = useState(String(new Date().getMinutes()).padStart(2, '0'));
  const [ampm, setAmpm] = useState(new Date().getHours() >= 12 ? 'PM' : 'AM');
  const [showTimePickerModal, setShowTimePickerModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Load saved settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedTime = await AsyncStorage.getItem('reminderTime');
        const savedEnabled = await AsyncStorage.getItem('reminderEnabled');

        console.log('Loaded reminderTime from storage:', savedTime);
        console.log('Loaded reminderEnabled from storage:', savedEnabled);

        if (savedTime) {
          const savedDate = new Date(savedTime);
          const h = savedDate.getHours();
          const displayH = h % 12 || 12;
          const newHour = String(displayH).padStart(2, '0');
          const newMinute = String(savedDate.getMinutes()).padStart(2, '0');
          const newAmpm = h >= 12 ? 'PM' : 'AM';

          console.log('Setting hour to:', newHour, 'minute to:', newMinute, 'ampm to:', newAmpm);

          setHour(newHour);
          setMinute(newMinute);
          setAmpm(newAmpm);
        }

        if (savedEnabled) {
          setIsReminderEnabled(JSON.parse(savedEnabled));
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };
    loadSettings();
  }, []);

  const handleLogout = () => {
    signOut(auth).catch(error => console.log('Logout Error:', error.message));
  };

  const scheduleNotification = async () => {
    const { status } = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowAnnouncements: true,
      },
      android: {},
    });

    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please enable notifications to receive reminders.');
      return;
    }

    await Notifications.cancelAllScheduledNotificationsAsync(); // Clear old reminders

    // Convert 12-hour format to 24-hour format
    let hour24 = parseInt(hour);
    if (ampm === 'PM' && hour24 !== 12) {
      hour24 += 12;
    } else if (ampm === 'AM' && hour24 === 12) {
      hour24 = 0;
    }

    // Calculate seconds until the next reminder time
    const now = new Date();
    const reminderTime = new Date();
    reminderTime.setHours(hour24, parseInt(minute), 0, 0);

    // If the time has already passed today, schedule for tomorrow
    if (reminderTime <= now) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    const secondsUntilReminder = Math.floor((reminderTime.getTime() - now.getTime()) / 1000);
    console.log('Scheduling daily reminder for', secondsUntilReminder, 'seconds from now');
    console.log('Will fire at:', reminderTime.toLocaleString());

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Time for your practice! 🧘",
          body: 'A few moments of calm can make a big difference.',
          sound: true,
          priority: Notifications.AndroidNotificationPriority.MAX,
          ...(Platform.OS === 'android' && {
            channelId: 'reminders',
          }),
        },
        trigger: {
          type: 'timeInterval',
          seconds: secondsUntilReminder,
        },
      });

      console.log('Daily reminder scheduled successfully');

      // Save the time
      await AsyncStorage.setItem('reminderTime', reminderTime.toISOString());
    } catch (error) {
      console.log('Error scheduling reminder:', error);
      Alert.alert('Error', 'Failed to schedule notification: ' + error.message);
    }
  };

  const handleReminderToggle = async (value) => {
    setIsReminderEnabled(value);
    await AsyncStorage.setItem('reminderEnabled', JSON.stringify(value));

    if (value) {
      await scheduleNotification();
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
  };

  const handleSetTime = () => {
    setShowTimePickerModal(true);
  };

  const handleTimeConfirm = async () => {
    setShowTimePickerModal(false);

    // Save the selected time
    let hour24 = parseInt(hour);
    if (ampm === 'PM' && hour24 !== 12) {
      hour24 += 12;
    } else if (ampm === 'AM' && hour24 === 12) {
      hour24 = 0;
    }
    const savedTime = new Date();
    savedTime.setHours(hour24, parseInt(minute), 0, 0);
    await AsyncStorage.setItem('reminderTime', savedTime.toISOString());

    // Reschedule if reminder is enabled
    if (isReminderEnabled) {
      await scheduleNotification();
    }

    // Show success message
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 2500);
  };

  return (
    <ImageBackground
      source={require('../../assets/background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container} edges={['right', 'left', 'bottom']}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutIconButton}>
            <MaterialCommunityIcons name="power" size={32} color="#2f4f4f" strokeWidth={2} />
            <Text style={styles.logoutIconText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.reminderCard}>
            <Text style={styles.cardTitle}>Practice Reminder</Text>
            <View style={styles.remindMeRow}>
              <Text style={styles.remindMeText}>Remind Me Daily</Text>
              <Switch
                trackColor={{ false: '#767577', true: '#6FAF98' }}
                thumbColor={isReminderEnabled ? '#f4f3f4' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={handleReminderToggle}
                value={isReminderEnabled}
              />
            </View>
            {isReminderEnabled && (
              <View>
                <TouchableOpacity onPress={handleSetTime} style={styles.timeDisplay}>
                  <Ionicons name="time" size={20} color="#6FAF98" style={{ marginRight: 8 }} />
                  <Text style={styles.timeText}>
                    {hour}:{minute} {ampm}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleTimeConfirm} style={styles.saveButton}>
                  <Text style={styles.saveButtonText}>Save Time</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {showSuccessMessage && (
          <View style={styles.successMessage}>
            <View style={styles.successCheckbox}>
              <Ionicons name="checkmark" size={20} color="white" />
            </View>
            <Text style={styles.successMessageText}>Reminder saved & scheduled!</Text>
          </View>
        )}

        <Navigation navigation={navigation} currentScreen="Profile" />

        {/* Custom Time Picker Modal */}
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
                  onPress={handleTimeConfirm}
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
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    flex: 1,
  },
  logoutIconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    padding: 12,
  },
  logoutIconText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2f4f4f',
    marginTop: 6,
  },
  reminderCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2f4f4f',
    marginBottom: 20,
    textAlign: 'center',
  },
  remindMeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  remindMeText: {
    fontSize: 18,
    color: '#2f4f4f',
  },
  timeDisplay: {
    flexDirection: 'row',
    backgroundColor: 'rgba(111, 175, 152, 0.1)',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#6FAF98',
  },
  timeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2f4f4f',
  },
  saveButton: {
    backgroundColor: '#6FAF98',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  logoutButton: {
    display: 'none',
  },
  logoutButtonText: {
    display: 'none',
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
  timePickerModalSeparator: {
    fontSize: 28,
    fontWeight: '700',
    color: '#6FAF98',
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
  successMessage: {
    position: 'absolute',
    top: '50%',
    marginTop: 150,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(111, 175, 152, 0.3)',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 50,
    zIndex: 1000,
  },
  successMessageText: {
    color: 'black',
    fontSize: 14,
    fontWeight: '400',
  },
  successCheckbox: {
    backgroundColor: '#2f5f4a',
    width: 24,
    height: 24,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
});