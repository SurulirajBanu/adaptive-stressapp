import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/firebaseConfig';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/Profile';
import BreathingScreen from './src/screens/Breathing';
import GardenScreen from './src/screens/Garden';
import MeditationScreen from './src/screens/Meditation';
import MoodCalendarScreen from './src/screens/MoodCalendar';
import StressTrackerScreen from './src/screens/StressTracker';
import StressFormScreen from './src/screens/StressForm';
import IdentifyStressScreen from './src/screens/IdentifyStress';
import StressSolutionsScreen from './src/screens/StressSolutions';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0782F9" />
      </View>
    );
  }

  return (
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
            <Stack.Screen
              name="IdentifyStress"
              component={IdentifyStressScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="StressSolutions"
              component={StressSolutionsScreen}
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
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
});