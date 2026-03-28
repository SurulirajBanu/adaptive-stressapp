/**
 * HomeScreen.js — Main practice hub (navigation level 1 & 2).
 *
 * Entry point for the two primary mindfulness tools:
 * - Breathing Exercises
 * - Meditation Sessions
 *
 * Resolves the display name from Firebase Auth (displayName → email prefix fallback).
 */
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { auth } from '../firebaseConfig';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import Navigation from '../components/Navigation';

export default function HomeScreen({ navigation }) {
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        let name = 'User';
        if (user.displayName) {
          name = user.displayName;
        } else if (user.email) {
          const namePart = user.email.split('@')[0];
          name = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        }
        setUserName(name);
      } else {
        setUserName('User');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth).catch(error => console.log(error.message));
  };

  return (
    <ImageBackground
      source={require('../../assets/background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container} edges={['right', 'left', 'bottom']}>
        <StatusBar barStyle="dark-content" />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <Text style={styles.headerTitle}>Practice</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.content}>
          <Text style={styles.subtitle}>
            Welcome {userName}, Calm your mind and body through guided exercises
          </Text>

          <View>
            {/* Breathing Exercises Card */}
            <TouchableOpacity
              style={styles.practiceCard}
              onPress={() => navigation.navigate('Breathing')} // Navigate to Breathing screen
            >
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name="record-circle-outline"
                  size={50}
                  color="#4f7f6b"
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>Breathing Exercises</Text>
                <Text style={styles.cardSubtitle}>
                  Short exercises to calm your nervous system
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#4f7f6b" />
            </TouchableOpacity>

            {/* Meditation Sessions Card */}
            <TouchableOpacity
              style={styles.practiceCard}
              onPress={() => navigation.navigate('Meditation')}
            >
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name="meditation"
                  size={50}
                  color="#4f7f6b"
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>Meditation Sessions</Text>
                <Text style={styles.cardSubtitle}>
                  Guided mindfulness and grounding
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#4f7f6b" />
            </TouchableOpacity>
          </View>
        </View>

        <Navigation navigation={navigation} currentScreen="Home" />
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
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 44,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#4f7f6b',
    textAlign: 'center',
    marginBottom: 30,
  },
  practiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 150, // Adjusted height
  },
  iconContainer: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 22, // Adjusted font size
    fontWeight: '600',
    color: '#2f4f4f',
  },
  cardSubtitle: {
    fontSize: 16, // Adjusted font size
    color: '#4f7f6b',
    marginTop: 4,
  },

});