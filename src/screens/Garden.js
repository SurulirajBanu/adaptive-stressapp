import React, { useState } from 'react';
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

const { width, height } = Dimensions.get('window');

const GardenScreen = ({ navigation }) => {
  const [isHealthy, setIsHealthy] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const checkGardenState = async () => {
        try {
          const lastExerciseTime = await AsyncStorage.getItem('lastExerciseTime');
          if (lastExerciseTime) {
            const lastTime = new Date(lastExerciseTime);
            const currentTime = new Date();
            const hoursDifference = (currentTime - lastTime) / (1000 * 60 * 60);

            setIsHealthy(hoursDifference <= 24);
          } else {
            setIsHealthy(true);
          }
        } catch (error) {
          console.error("Failed to load garden state:", error);
          setIsHealthy(true);
        }
      };

      checkGardenState();
    }, [])
  );

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
              : "Your garden needs some attention. Complete a breathing exercise to help it recover."}
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

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
            <Ionicons name="home" size={30} color="#4f7f6b" />
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Garden')}>
            <MaterialCommunityIcons name="flower-tulip" size={30} color="#6FAF98" />
            <Text style={[styles.navText, { color: '#6FAF98' }]}>Garden</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
            <Ionicons name="person" size={30} color="#4f7f6b" />
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1 },

  header: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2f4f4f',
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between', // Pushes text to top and image to take up remaining space
    paddingTop: 20,
  },

  gardenImage: {
    width: width,             // Full screen width
    height: height * 0.65,    // Takes up 65% of the total screen height
    marginBottom: -20,        // Pulls it slightly closer to the bottom nav for maximum scale
  },

  gardenText: {
    fontSize: 18,
    color: '#4f7f6b',
    textAlign: 'center',
    paddingHorizontal: 40,    // Wider horizontal padding for that 2nd image look
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

export default GardenScreen;