import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    StatusBar,
    PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ref, push } from 'firebase/database';
import { auth, database } from '../firebaseConfig';
import Navigation from '../components/Navigation';

const formatDate = (date) => date.toLocaleString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
});

const saveMeditationSession = async (meditationTitle, startTime, endTime) => {
    const user = auth.currentUser;
    if (!user || !startTime) return;

    const durationSeconds = Math.round((endTime - startTime) / 1000);
    if (durationSeconds < 1) return;

    const sessionData = {
        email: user.email,
        userId: user.uid,
        meditationTitle,
        startTime: formatDate(startTime),
        endTime: formatDate(endTime),
        durationSeconds,
    };

    try {
        await push(ref(database, `meditationSessions/${user.uid}`), sessionData);
    } catch (error) {
        console.error('Failed to save meditation session:', error);
    }
};

// Static audio file mapping
const audioFiles = {
    'breathing_1.mp3': require('../../assets/breathing-exercises/breathing_1.mp3'),
    'breathing_2.mp3': require('../../assets/breathing-exercises/breathing_2.mp3'),
    'breathing_3.mp3': require('../../assets/breathing-exercises/breathing_3.mp3'),
    'breathing_4.mp3': require('../../assets/breathing-exercises/breathing_4.mp3'),
    'breathing_5.mp3': require('../../assets/breathing-exercises/breathing_5.mp3'),
    'breathing_6.mp3': require('../../assets/breathing-exercises/breathing_6.mp3'),
    'breathing_7.mp3': require('../../assets/breathing-exercises/breathing_7.mp3'),
    'breathing_8.mp3': require('../../assets/breathing-exercises/breathing_8.mp3'),
    'breathing_9.mp3': require('../../assets/breathing-exercises/breathing_9.mp3'),
    'breathing_10.mp3': require('../../assets/breathing-exercises/breathing_10.mp3'),
    'breathing_11.mp3': require('../../assets/breathing-exercises/breathing_11.mp3'),
    'breathing_12.mp3': require('../../assets/breathing-exercises/breathing_12.mp3'),
    'breathing_13.mp3': require('../../assets/breathing-exercises/breathing_13.mp3'),
};

const MeditationScreen = ({ navigation }) => {
    // Initialize with all meditations locked except the first one
    const [lockedMeditationIds, setLockedMeditationIds] = useState([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentMeditationId, setCurrentMeditationId] = useState(null);
    const [currentPosition, setCurrentPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [progressBarWidth, setProgressBarWidth] = useState(0);
    const [isSeeking, setIsSeeking] = useState(false);
    const panResponderRef = React.useRef(null);
    const progressViewRef = React.useRef(null);
    const sessionStartTime = React.useRef(null);
    const currentMeditationTitle = React.useRef(null);

    // Load locked meditations from AsyncStorage on mount
    useEffect(() => {
        const loadLockedMeditations = async () => {
            try {
                const saved = await AsyncStorage.getItem('lockedMeditationIds');
                const defaultLocked = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

                if (saved) {
                    const parsedSaved = JSON.parse(saved);
                    // If saved is empty or invalid, use defaults
                    if (parsedSaved.length === 0) {
                        setLockedMeditationIds(defaultLocked);
                        await AsyncStorage.setItem('lockedMeditationIds', JSON.stringify(defaultLocked));
                    } else {
                        setLockedMeditationIds(parsedSaved);
                    }
                } else {
                    // First time: set default and save
                    setLockedMeditationIds(defaultLocked);
                    await AsyncStorage.setItem('lockedMeditationIds', JSON.stringify(defaultLocked));
                }
            } catch (error) {
                console.error('Error loading locked meditations:', error);
            }
        };
        loadLockedMeditations();
    }, []);

    // Save locked meditations to AsyncStorage whenever they change
    useEffect(() => {
        const saveLockedMeditations = async () => {
            try {
                await AsyncStorage.setItem('lockedMeditationIds', JSON.stringify(lockedMeditationIds));
            } catch (error) {
                console.error('Error saving locked meditations:', error);
            }
        };
        saveLockedMeditations();
    }, [lockedMeditationIds]);

    // Configure audio mode on mount
    useEffect(() => {
        Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: true,
            staysActiveInBackground: true,
            shouldDuckAndroid: true,
        });
    }, []);

    // Record exercise interaction time for garden state
    useEffect(() => {
        // Only record when audio actually starts playing
        if (isPlaying && currentMeditationId) {
            const recordExerciseTime = async () => {
                try {
                    await AsyncStorage.setItem('lastExerciseTime', new Date().toISOString());
                    console.log('Exercise time recorded from Meditation');
                } catch (error) {
                    console.error('Failed to record exercise time:', error);
                }
            };
            recordExerciseTime();
        }
    }, [isPlaying, currentMeditationId]);

    // Create PanResponder for progress bar drag
    useEffect(() => {
        panResponderRef.current = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                setIsSeeking(true);
            },
            onPanResponderMove: (evt, gestureState) => {
                if (!sound || duration === 0 || !progressBarWidth || !progressViewRef.current) return;

                // Get the touch position relative to the progress bar
                progressViewRef.current.measure((x, y, width, height, pageX, pageY) => {
                    const touchX = Math.max(0, Math.min(evt.nativeEvent.pageX - pageX, width));
                    const newPosition = (touchX / width) * duration;

                    setCurrentPosition(newPosition);
                    sound.setPositionAsync(newPosition).catch(error => {
                        console.error('Error seeking audio:', error);
                    });
                });
            },
            onPanResponderRelease: () => {
                setIsSeeking(false);
            },
        });
    }, [sound, duration, progressBarWidth]);

    const meditations = [
        {
            id: 1,
            title: 'Brief mindfulness practice',
            description: 'Audio - Helps cultivate calm and clarity',
            subdescription: 'Audio - Helps cultivate calm and clarity',
            icon: 'lightbulb',
            duration: '5 min',
            audioFile: 'breathing_1.mp3',
        },
        {
            id: 2,
            title: 'The Breathing Space',
            description: 'Audio - Learn breathing techniques',
            subdescription: 'Audio - Learn breathing techniques',
            icon: 'wind',
            duration: '8 min',
            audioFile: 'breathing_2.mp3',
        },
        {
            id: 3,
            title: 'The Tension Release Meditation',
            description: 'Audio - Release tension and stress',
            subdescription: 'Audio - Release tension and stress',
            icon: 'relax',
            duration: '10 min',
            audioFile: 'breathing_3.mp3',
        },
        {
            id: 4,
            title: 'Mindfulness of sounds',
            description: 'Audio - Develop sound awareness',
            subdescription: 'Audio - Develop sound awareness',
            icon: 'music',
            duration: '7 min',
            audioFile: 'breathing_4.mp3',
        },
        {
            id: 5,
            title: 'Watching Thoughts',
            description: 'Audio - Observe your thoughts',
            subdescription: 'Audio - Observe your thoughts',
            icon: 'brain',
            duration: '9 min',
            audioFile: 'breathing_5.mp3',
        },
        {
            id: 6,
            title: 'Brief Body Scan',
            description: 'Audio - Body awareness practice',
            subdescription: 'Audio - Body awareness practice',
            icon: 'body',
            duration: '6 min',
            audioFile: 'breathing_6.mp3',
        },
        {
            id: 7,
            title: 'Breath Works Body Scan',
            description: 'Audio - Breathing with body awareness',
            subdescription: 'Audio - Breathing with body awareness',
            icon: 'human-male',
            duration: '12 min',
            audioFile: 'breathing_7.mp3',
        },
        {
            id: 8,
            title: 'Breath Awareness',
            description: 'Audio - Focus on your breath',
            subdescription: 'Audio - Focus on your breath',
            icon: 'air',
            duration: '8 min',
            audioFile: 'breathing_8.mp3',
        },
        {
            id: 9,
            title: 'Wisdom Meditation',
            description: 'Audio - Connect with inner wisdom',
            subdescription: 'Audio - Connect with inner wisdom',
            icon: 'flower',
            duration: '11 min',
            audioFile: 'breathing_9.mp3',
        },
        {
            id: 10,
            title: 'Compassionate Breath',
            description: 'Audio - Cultivate compassion',
            subdescription: 'Audio - Cultivate compassion',
            icon: 'heart',
            duration: '9 min',
            audioFile: 'breathing_10.mp3',
        },
        {
            id: 11,
            title: 'Breath, Sounds, Body, Thoughts, Emotions',
            description: 'Audio - Comprehensive awareness practice',
            subdescription: 'Audio - Comprehensive awareness practice',
            icon: 'leaf',
            duration: '15 min',
            audioFile: 'breathing_11.mp3',
        },
        {
            id: 12,
            title: 'Guided Imagery - Mountain',
            description: 'Audio - Visualize peaceful scenery',
            subdescription: 'Audio - Visualize peaceful scenery',
            icon: 'mountain',
            duration: '13 min',
            audioFile: 'breathing_12.mp3',
        },
        {
            id: 13,
            title: 'Sitting Meditation',
            description: 'Audio - Traditional sitting practice',
            subdescription: 'Audio - Traditional sitting practice',
            icon: 'meditation',
            duration: '10 min',
            audioFile: 'breathing_13.mp3',
        },
    ];

    const handleMeditationPress = async (meditation) => {
        if (!meditation.isLocked) {
            try {
                // If clicking same meditation that's loaded, toggle pause/play
                if (sound && currentMeditationId === meditation.id) {
                    const status = await sound.getStatusAsync();
                    if (status.isLoaded) {
                        if (isPlaying) {
                            await sound.pauseAsync();
                            setIsPlaying(false);
                            saveMeditationSession(currentMeditationTitle.current, sessionStartTime.current, new Date());
                            sessionStartTime.current = null;
                        } else {
                            sessionStartTime.current = new Date();
                            await sound.playAsync();
                            setIsPlaying(true);
                        }
                        return;
                    }
                }

                // Stop current audio if playing different one
                if (sound) {
                    if (sessionStartTime.current) {
                        saveMeditationSession(currentMeditationTitle.current, sessionStartTime.current, new Date());
                        sessionStartTime.current = null;
                    }
                    await sound.unloadAsync();
                }

                // Load and play the audio file using static mapping
                const audioSource = audioFiles[meditation.audioFile];
                if (!audioSource) {
                    alert('Audio file not found: ' + meditation.audioFile);
                    return;
                }

                const { sound: newSound } = await Audio.Sound.createAsync(audioSource);
                setSound(newSound);
                setCurrentMeditationId(meditation.id);
                currentMeditationTitle.current = meditation.title;
                setCurrentPosition(0);
                sessionStartTime.current = new Date();
                await newSound.playAsync();
                setIsPlaying(true);

                // Handle playback status updates (for progress tracking)
                newSound.setOnPlaybackStatusUpdate((status) => {
                    if (status.isLoaded) {
                        setCurrentPosition(status.positionMillis);
                        setDuration(status.durationMillis);
                        if (status.didJustFinish) {
                            setIsPlaying(false);
                            saveMeditationSession(meditation.title, sessionStartTime.current, new Date());
                            sessionStartTime.current = null;
                            // Unlock next meditation
                            setLockedMeditationIds(prev => {
                                const updated = prev.filter(id => id !== meditation.id + 1);
                                return updated;
                            });
                        }
                    }
                });
            } catch (error) {
                console.error('Error playing audio:', error);
                alert('Error playing audio. Make sure the file exists in assets folder.');
            }
        }
    };

    // Save session if user navigates away mid-meditation
    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            if (sessionStartTime.current) {
                saveMeditationSession(currentMeditationTitle.current, sessionStartTime.current, new Date());
                sessionStartTime.current = null;
            }
        });
        return unsubscribe;
    }, [navigation]);

    // Cleanup audio on component unmount
    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    const formatTime = (millis) => {
        if (!millis || isNaN(millis)) return '0:00';
        const totalSeconds = Math.floor(millis / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleProgressBarPress = async (event) => {
        if (!sound || duration === 0 || !progressBarWidth) return;

        const { locationX } = event.nativeEvent;
        const newPosition = (locationX / progressBarWidth) * duration;

        try {
            await sound.setPositionAsync(newPosition);
            setCurrentPosition(newPosition);
        } catch (error) {
            console.error('Error seeking audio:', error);
        }
    };

    const getIconComponent = (iconName) => {
        const iconMap = {
            lightbulb: 'lightbulb-outline',
            wind: 'fan',
            relax: 'spa',
            music: 'music-box-outline',
            brain: 'brain',
            body: 'human',
            'human-male': 'human',
            air: 'fan',
            flower: 'flower',
            heart: 'heart-outline',
            leaf: 'leaf',
            mountain: 'image-filter-hdr',
            meditation: 'meditation',
        };

        return iconMap[iconName] || 'meditation';
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
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <Ionicons name="chevron-back" size={28} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Meditation Sessions</Text>
                    <View style={styles.headerSpacer} />
                </View>

                {/* Meditation List */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {meditations.map((meditation) => {
                        // Determine if meditation is locked
                        const isLocked = lockedMeditationIds.includes(meditation.id);

                        return (
                            <TouchableOpacity
                                key={meditation.id}
                                onPress={() => handleMeditationPress(meditation)}
                                disabled={isLocked}
                                style={styles.meditationCard}
                            >
                                <LinearGradient
                                    colors={
                                        isLocked
                                            ? ['#f5f5f5', '#ffffff']
                                            : ['#e8f5e9', '#f1f8e9']
                                    }
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.cardGradient}
                                >
                                    <View style={styles.cardContent}>
                                        <View style={styles.iconContainer}>
                                            <MaterialCommunityIcons
                                                name={getIconComponent(meditation.icon)}
                                                size={32}
                                                color={isLocked ? '#999' : '#4caf50'}
                                            />
                                        </View>

                                        <View style={styles.textContainer}>
                                            <Text
                                                style={[
                                                    styles.title,
                                                    isLocked && styles.lockedTitle,
                                                ]}
                                            >
                                                {meditation.title}
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.description,
                                                    isLocked && styles.lockedDescription,
                                                ]}
                                            >
                                                {isLocked ? 'Locked' : meditation.subdescription}
                                            </Text>
                                        </View>

                                        <View style={styles.actionIcon}>
                                            {isLocked ? (
                                                <MaterialCommunityIcons
                                                    name="lock"
                                                    size={40}
                                                    color="#999"
                                                />
                                            ) : isPlaying && currentMeditationId === meditation.id ? (
                                                <MaterialCommunityIcons
                                                    name="pause-circle"
                                                    size={40}
                                                    color="#4caf50"
                                                />
                                            ) : (
                                                <MaterialCommunityIcons
                                                    name="play-circle"
                                                    size={40}
                                                    color="#4caf50"
                                                />
                                            )}
                                        </View>
                                    </View>

                                    {/* Progress Bar */}
                                    {currentMeditationId === meditation.id && duration > 0 && (
                                        <View style={styles.progressContainer}>
                                            <View
                                                ref={progressViewRef}
                                                {...(panResponderRef.current ? panResponderRef.current.panHandlers : {})}
                                                onLayout={(event) => {
                                                    setProgressBarWidth(event.nativeEvent.layout.width);
                                                }}
                                                style={styles.progressBarContainer}
                                            >
                                                <TouchableOpacity
                                                    activeOpacity={1}
                                                    onPress={handleProgressBarPress}
                                                    style={styles.progressBar}
                                                >
                                                    <View
                                                        style={[
                                                            styles.progressFill,
                                                            { width: `${(currentPosition / duration) * 100}%` },
                                                        ]}
                                                    />
                                                </TouchableOpacity>
                                                {/* Draggable Thumb */}
                                                <View
                                                    style={[
                                                        styles.progressThumb,
                                                        { left: `${(currentPosition / duration) * 100}%` },
                                                    ]}
                                                />
                                            </View>
                                            <View style={styles.timeContainer}>
                                                <Text style={styles.timeText}>
                                                    {formatTime(currentPosition)}
                                                </Text>
                                                <Text style={styles.timeText}>
                                                    {formatTime(duration)}
                                                </Text>
                                            </View>
                                        </View>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
                <Navigation navigation={navigation} currentScreen="Meditation" />
            </SafeAreaView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    container: {
        flex: 1,
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
    backButton: {
        padding: 8,
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
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 24,
    },
    meditationCard: {
        marginBottom: 12,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardGradient: {
        padding: 16,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(76, 175, 80, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    lockedTitle: {
        color: '#999',
    },
    description: {
        fontSize: 13,
        color: '#66bb6a',
        fontWeight: '500',
    },
    lockedDescription: {
        color: '#999',
    },
    actionIcon: {
        marginLeft: 12,
    },
    progressContainer: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(76, 175, 80, 0.2)',
    },
    progressBarContainer: {
        position: 'relative',
        marginBottom: 8,
        paddingVertical: 8,
    },
    progressBar: {
        height: 6,
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4caf50',
        borderRadius: 2,
    },
    progressThumb: {
        position: 'absolute',
        top: -2,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#4caf50',
        marginLeft: -14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 4,
        borderWidth: 2,
        borderColor: '#ffffff',
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 4,
    },
    timeText: {
        fontSize: 11,
        color: '#66bb6a',
        fontWeight: '500',
    },
});

export default MeditationScreen;
