import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Navigation from '../components/Navigation';

const { width, height } = Dimensions.get('window');

// Constant for timeout duration (in seconds)
const EXERCISE_TIMEOUT_SECONDS = 3600; // 1 hour

const GardenScreen = ({ navigation }) => {
  const [isHealthy, setIsHealthy] = useState(true);
  const timerRef = useRef(null);

  // Check garden state and set up timer
  useFocusEffect(
    React.useCallback(() => {
      const checkAndStartTimer = async () => {
        try {
          const lastExerciseTime = await AsyncStorage.getItem('lastExerciseTime');

          if (lastExerciseTime) {
            const lastTime = new Date(lastExerciseTime);
            const currentTime = new Date();
            const secondsDifference = (currentTime - lastTime) / 1000;

            setIsHealthy(secondsDifference <= EXERCISE_TIMEOUT_SECONDS);
          } else {
            setIsHealthy(false); // No exercise recorded, garden is unhealthy
          }
        } catch (error) {
          console.error("Failed to load garden state:", error);
          setIsHealthy(false);
        }
      };

      checkAndStartTimer();

      // Set up timer to check every second
      timerRef.current = setInterval(() => {
        checkAndStartTimer();
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }, [])
  );

  const handlePracticeNow = () => {
    navigation.navigate('Home');
  };

  return (
    <ImageBackground
      source={require('../../assets/garden-background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container} edges={['right', 'left', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Garden</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.gardenText}>
            {isHealthy
              ? "Your garden is flourishing! Keep up the great work."
              : "Your garden needs some attention. Complete a practice to help it recover."}
          </Text>

          {/* Image is now scaled to 100% width and 65% of screen height */}
          <Image
            source={
              isHealthy
                ? require('../../assets/garden-healthy.png')
                : require('../../assets/garden-unhealthy.png')
            }
            style={styles.gardenImage}
            resizeMode="contain"
          />
        </View>

        {/* Practice Now Button - Only show when unhealthy */}
        {!isHealthy && (
          <TouchableOpacity
            style={styles.practiceButton}
            onPress={handlePracticeNow}
          >
            <Text style={styles.practiceButtonText}>Practice Now</Text>
          </TouchableOpacity>
        )}

        {/* Bottom Navigation */}
        <Navigation navigation={navigation} currentScreen="Garden" />
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 20,
  },

  gardenImage: {
    width: width,
    height: height * 0.5,
    marginVertical: 0,
  },

  gardenText: {
    fontSize: 26,
    color: '#4f7f6b',
    textAlign: 'center',
    paddingHorizontal: 40,
  },

  practiceButton: {
    backgroundColor: '#6FAF98',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },

  practiceButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default GardenScreen;