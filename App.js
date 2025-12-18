import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/firebaseConfig';

// 1. Import your screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen'; // Ensure this file exists in src/screens/

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This listener detects when a user logs in or out
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth State Changed. User is:", currentUser ? currentUser.email : "Logged Out");
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe; // Cleanup listener on unmount
  }, []);

  // Show a spinner while checking if the user is logged in
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
          // --- PROTECTED ROUTES (Only visible when logged in) ---
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }} // Custom header is inside HomeScreen.js
          />
        ) : (
          // --- AUTH ROUTES (Only visible when logged out) ---
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
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