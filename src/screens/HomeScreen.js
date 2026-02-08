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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; // Built-in with Expo
import { auth } from '../firebaseConfig';
import { signOut, onAuthStateChanged } from 'firebase/auth';

export default function HomeScreen({ navigation }) {
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        let name = 'User'; // Default name
        if (user.displayName) {
          name = user.displayName;
        } else if (user.email) {
          const namePart = user.email.split('@')[0];
          name = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        }
        setUserName(name);
      } else {
        // Handle user not signed in
        setUserName('User');
      }
    });

    // Cleanup subscription on unmount
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

        {/* --- MAIN CONTENT AREA --- */}
        <View style={styles.content}>
          <View>
            <Text style={styles.title}>Practice</Text>
            <Text style={styles.subtitle}>
              Welcome {userName}, Calm your mind and body through guided exercises
            </Text>

            {/* Breathing Exercises Card */}
            <TouchableOpacity style={styles.practiceCard}>
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
            <TouchableOpacity style={styles.practiceCard}>
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

        {/* --- BOTTOM NAVIGATION BAR --- */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="home" size={30} color="#6FAF98" />
            <Text style={[styles.navText, { color: '#6FAF98' }]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <MaterialCommunityIcons
              name="flower-tulip"
              size={30}
              color="#4f7f6b"
            />
            <Text style={styles.navText}>Garden</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
            <Ionicons name="person" size={30} color="#4f7f6b" />
            <Text style={styles.navText}>Profile</Text>
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
    backgroundColor: 'transparent',
  },
  header: {
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2f4f4f',
  },
  content: {
    flex: 1,
    justifyContent: 'center', // This centers the content vertically
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2f4f4f',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
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
    height: 200,
  },
  iconContainer: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 25,
    fontWeight: '600',
    color: '#2f4f4f',
  },
  cardSubtitle: {
    fontSize: 18,
    color: '#4f7f6b',
    marginTop: 4,
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
    marginTop: 10,
    color: '#4f7f6b',
  },
});