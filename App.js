import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebaseConfig';

// Import your custom screen files
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';

// Import a placeholder for the Dashboard
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

const Stack = createStackNavigator();

// --- Simple Dashboard View ---
function DashboardScreen() {
  const user = auth.currentUser;

  const handleLogout = () => {
    signOut(auth).catch(error => console.log(error.message));
  };

  return (
    <View style={styles.center}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.userText}>{user?.email}</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

// --- Main App Component ---
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
          // If logged in, only the Dashboard is accessible
          <Stack.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{ headerLeft: () => null }} // Hide back button on dashboard
          />
        ) : (
          // If logged out, these two screens are available
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  userText: { fontSize: 16, color: '#666', marginBottom: 30 },
  logoutButton: { backgroundColor: '#FF3B30', padding: 15, borderRadius: 10, width: '50%', alignItems: 'center' },
  logoutText: { color: 'white', fontWeight: 'bold' }
});