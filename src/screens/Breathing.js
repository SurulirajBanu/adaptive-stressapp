import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const BreathingScreen = ({ navigation }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [instruction, setInstruction] = useState('Follow the ball and focus on your breathing');
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const breatheAnimation = Animated.loop(
    Animated.sequence([
      // Breathe In
      Animated.timing(scaleAnim, {
        toValue: 1.5,
        duration: 4000, // 4 seconds
        useNativeDriver: true,
      }),
      // Hold
      Animated.delay(1000), // 1 second
      // Breathe Out
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 6000, // 6 seconds
        useNativeDriver: true,
      }),
       // Hold
      Animated.delay(1000), // 1 second
    ])
  );

  useEffect(() => {
    let interval;
    if (isAnimating) {
      breatheAnimation.start();
      const cycleDuration = 12000; // 4s in + 1s hold + 6s out + 1s hold
      const updateInstructions = () => {
        setInstruction('Breathe In...');
        setTimeout(() => {
          setInstruction('Hold');
        }, 4000);
        setTimeout(() => {
          setInstruction('Breathe Out...');
        }, 5000);
         setTimeout(() => {
          setInstruction('Hold');
        }, 11000);
      };
      updateInstructions();
      interval = setInterval(updateInstructions, cycleDuration);
    } else {
      breatheAnimation.stop();
      scaleAnim.setValue(1);
      setInstruction('Follow the ball and focus on your breathing');
      if (interval) {
        clearInterval(interval);
      }
    }
    return () => clearInterval(interval);
  }, [isAnimating]);

  const handleBeginPress = () => {
    setIsAnimating(prevState => !prevState);
  };

  return (
    <ImageBackground
      source={require('../../assets/background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container} edges={['right', 'left', 'bottom']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#2f4f4f" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Breathing Exercises</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.instructionText}>{instruction}</Text>
          <View style={styles.ballContainer}>
            <Animated.View style={[styles.ballWrapper, { transform: [{ scale: scaleAnim }] }]}>
              {/* Wavy edge effect layer */}
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.1)', 'rgba(180, 230, 200, 0.4)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.ball, styles.wavyOverlay]}
              />
              {/* Main glass body */}
              <LinearGradient
                colors={['rgba(200, 230, 210, 0.6)', 'rgba(170, 220, 190, 0.9)']}
                style={styles.ball}
              />
              {/* Glass shine/highlight effect */}
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.7)', 'transparent']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 0.5 }}
                style={[styles.ball, styles.shineOverlay]}
              />
            </Animated.View>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={handleBeginPress} style={styles.beginButton}>
            <Text style={styles.beginButtonText}>{isAnimating ? 'Stop' : 'Begin'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
            <Ionicons name="home" size={30} color="#4f7f6b" />
            <Text style={styles.navText}>Home</Text>
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
};

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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  instructionText: {
    fontSize: 18,
    color: '#4f7f6b',
    textAlign: 'center',
    marginBottom: 60,
  },
  ballContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  ballWrapper: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    // Distinct shadow
    shadowColor: '#00331a',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 20,
  },
  ball: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
    overflow: 'hidden',
    position: 'absolute',
  },
  wavyOverlay: {
    // This gradient creates a soft, irregular edge by being slightly larger and rotated
    transform: [{ scale: 1.08 }, { rotate: '15deg' }],
    opacity: 0.7,
  },
  shineOverlay: {
    // This creates a sharp highlight at the top for a glass effect
    height: '50%',
    width: '80%',
    borderRadius: 75,
    transform: [{ translateY: -10 }, { rotate: '-10deg' }],
    alignSelf: 'center',
  },
  footer: {
    padding: 20,
    paddingBottom: 20,
  },
  beginButton: {
    backgroundColor: '#6FAF98',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  beginButtonText: {
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

export default BreathingScreen;