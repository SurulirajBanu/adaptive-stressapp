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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function ProfileScreen({ navigation }) {
  const [isReminderEnabled, setIsReminderEnabled] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  // Load saved settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedTime = await AsyncStorage.getItem('reminderTime');
        const savedEnabled = await AsyncStorage.getItem('reminderEnabled');
        if (savedTime) {
          setDate(new Date(savedTime));
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

  const scheduleNotification = async (time) => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please enable notifications to receive reminders.');
      return;
    }

    await Notifications.cancelAllScheduledNotificationsAsync(); // Clear old reminders

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Time for your practice! 🧘",
        body: 'A few moments of calm can make a big difference.',
      },
      trigger: {
        hour: time.getHours(),
        minute: time.getMinutes(),
        repeats: true, // Daily reminder
      },
    });
  };

  const handleReminderToggle = async (value) => {
    setIsReminderEnabled(value);
    await AsyncStorage.setItem('reminderEnabled', JSON.stringify(value));

    if (value) {
      await scheduleNotification(date);
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
  };

  const onDateChange = async (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios');
    setDate(currentDate);

    await AsyncStorage.setItem('reminderTime', currentDate.toISOString());
    if (isReminderEnabled) {
      await scheduleNotification(currentDate);
    }
  };

  const showTimepicker = () => {
    setShowPicker(true);
  };

  return (
    <ImageBackground
      source={require('../../assets/background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container} edges={['top', 'right', 'left']}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
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
                <TouchableOpacity onPress={showTimepicker} style={styles.timeDisplay}>
                <Text style={styles.timeText}>
                    {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                </TouchableOpacity>
            )}
            {showPicker && (
                <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="time"
                is24Hour={false}
                display="spinner"
                onChange={onDateChange}
                />
            )}
            </View>

            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Log Out</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
            <Ionicons name="home" size={30} color="#4f7f6b" />
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Garden')}>
            <MaterialCommunityIcons
              name="flower-tulip"
              size={30}
              color="#4f7f6b"
            />
            <Text style={styles.navText}>Garden</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
            <Ionicons name="person" size={30} color="#6FAF98" />
            <Text style={[styles.navText, { color: '#6FAF98' }]}>Profile</Text>
          </TouchableOpacity>
        </View>

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
    justifyContent: 'center',
    paddingHorizontal: 15,
    height: 60,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2f4f4f',
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
    backgroundColor: 'rgba(230, 230, 230, 0.8)',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  timeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4f7f6b',
  },
  logoutButton: {
    backgroundColor: '#6FAF98',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginHorizontal: 40,
    marginTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  bottomNav: {
    height: 100,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingBottom: 10,
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navText: {
    fontSize: 16,
    marginTop: 4,
    color: '#4f7f6b',
  },
});