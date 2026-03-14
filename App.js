import React, { useState, useEffect, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/firebaseConfig';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { NavigationVisibilityProvider, DEFAULT_NAV_VISIBILITY_LEVEL } from './src/BuildVersionControl';
import { WeeklyMoodTracker } from './src/components/WeeklyMood';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import HomeScreen2 from './src/screens/HomeScreen2';
import ProfileScreen from './src/screens/Profile';
import BreathingScreen from './src/screens/Breathing';
import GardenScreen from './src/screens/Garden';
import MeditationScreen from './src/screens/Meditation';
import ProblemSolvingScreen from './src/screens/ProblemSolving';
import MoodCalendarScreen from './src/screens/MoodCalendar';
import StressTrackerScreen from './src/screens/StressTracker';
import StressFormScreen from './src/screens/StressForm';

// Configure notification handler to show notifications even when app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visibilityLevel, setVisibilityLevel] = useState(DEFAULT_NAV_VISIBILITY_LEVEL);
  const notificationListener = useRef();
  const responseListener = useRef();
  registerForPushNotificationsAsync();

  // Listen for notifications received while app is foregrounded
  notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
    console.log('Notification received:', notification);
  });

  // Listen for user tapping on notifications
  responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
    console.log('Notification tapped:', response);
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Load visibility level from storage
    const loadVisibilityLevel = async () => {
      try {
        const savedLevel = await AsyncStorage.getItem('navVisibilityLevel');
        if (savedLevel) {
          setVisibilityLevel(parseInt(savedLevel));
        }
      } catch (error) {
        console.error('Error loading visibility level:', error);
      }
    };

    loadVisibilityLevel();

    return () => {
      unsubscribe();
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0782F9" />
      </View>
    );
  }

  return (
    <>
      <WeeklyMoodTracker user={user} />
      <NavigationVisibilityProvider visibilityLevel={visibilityLevel} setVisibilityLevel={setVisibilityLevel}>
        <NavigationContainer>
          <Stack.Navigator>
            {user ? (
              <>
                <Stack.Screen
                  name="Home"
                  component={HomeScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Home2"
                  component={HomeScreen2}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Profile"
                  component={ProfileScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Breathing"
                  component={BreathingScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Garden"
                  component={GardenScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Meditation"
                  component={MeditationScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="ProblemSolving"
                  component={ProblemSolvingScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="MoodCalendar"
                  component={MoodCalendarScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="StressTracker"
                  component={StressTrackerScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="StressForm"
                  component={StressFormScreen}
                  options={{ headerShown: false }}
                />
              </>
            ) : (
              <>
                <Stack.Screen
                  name="Login"
                  component={LoginScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Register"
                  component={RegisterScreen}
                  options={{ headerShown: false }}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </NavigationVisibilityProvider>
    </>
  );
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('reminders', {
      name: 'Stress Reminders',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#6FAF98',
      sound: true,
      enableVibrate: true,
      enableLights: true,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: false,
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowAnnouncements: true,
        },
        android: {},
      });
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
});