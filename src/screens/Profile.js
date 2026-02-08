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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { auth } from '../firebaseConfig';
import { signOut, onAuthStateChanged } from 'firebase/auth';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [isReminderEnabled, setIsReminderEnabled] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
    });
    return unsubscribe; // Cleanup on unmount
  }, []);

  const handleLogout = () => {
    signOut(auth).catch(error => console.log('Logout Error:', error.message));
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showTimepicker = () => {
    setShowPicker(true);
  };

  // Derive user name, similar to HomeScreen
  const userName = user?.displayName || (user?.email ? user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1) : 'User');

  return (
    <ImageBackground
      source={require('../../assets/background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container} edges={['top', 'right', 'left']}>
        <StatusBar barStyle="dark-content" />

        {/* --- HEADER --- */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#2f4f4f" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* --- USER INFO --- */}
        <View style={styles.userInfoSection}>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        {/* --- PRACTICE REMINDER CARD --- */}
        <View style={styles.reminderCard}>
          <Text style={styles.cardTitle}>Practice Reminder</Text>
          <View style={styles.remindMeRow}>
            <Text style={styles.remindMeText}>Remind Me</Text>
            <Switch
              trackColor={{ false: '#767577', true: '#6FAF98' }}
              thumbColor={isReminderEnabled ? '#f4f3f4' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => setIsReminderEnabled(previousState => !previousState)}
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
              display="spinner" // 'spinner' gives the wheel look
              onChange={onDateChange}
            />
          )}
        </View>

        {/* --- LOGOUT BUTTON --- */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    height: 60,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2f4f4f',
  },
  userInfoSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2f4f4f',
  },
  userEmail: {
    fontSize: 16,
    color: '#4f7f6b',
    marginTop: 4,
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
});