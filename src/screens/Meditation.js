import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    SafeAreaView,
    StatusBar,
    PanResponder,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';

// Static audio file mapping
const audioFiles = {
    'breathing_1.mp3': require('../../assets/breathing_1.mp3'),
    'breathing_2.mp3': require('../../assets/breathing_2.mp3'),
    'breathing_3.mp3': require('../../assets/breathing_3.mp3'),
    'breathing_4.mp3': require('../../assets/breathing_4.mp3'),
    'breathing_5.mp3': require('../../assets/breathing_5.mp3'),
    'breathing_6.mp3': require('../../assets/breathing_6.mp3'),
    'breathing_7.mp3': require('../../assets/breathing_7.mp3'),
    'breathing_8.mp3': require('../../assets/breathing_8.mp3'),
    'breathing_9.mp3': require('../../assets/breathing_9.mp3'),
    'breathing_10.mp3': require('../../assets/breathing_10.mp3'),
    'breathing_11.mp3': require('../../assets/breathing_11.mp3'),
    'breathing_12.mp3': require('../../assets/breathing_12.mp3'),
    'breathing_13.mp3': require('../../assets/breathing_13.mp3'),
};

const MeditationScreen = ({ navigation }) => {
    const [completedMeditationIds, setCompletedMeditationIds] = useState([]);
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentMeditationId, setCurrentMeditationId] = useState(null);
    const [currentPosition, setCurrentPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [progressBarWidth, setProgressBarWidth] = useState(0);
    const [isSeeking, setIsSeeking] = useState(false);
    const panResponderRef = React.useRef(null);
    const progressViewRef = React.useRef(null);

    // Create PanResponder for progress bar drag
    useEffect(() => {
        panResponderRef.current = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                setIsSeeking(true);
            },
            onPanResponderMove: (evt, gestureState) => {
                if (!sound || duration === 0 || !progressBarWidth) return;

                const touchX = gestureState.x0;
                const newPosition = Math.max(0, Math.min(touchX / progressBarWidth * duration, duration));

                setCurrentPosition(newPosition);
                sound.setPositionAsync(newPosition).catch(error => {
                    console.error('Error seeking audio:', error);
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
                // Stop current audio if playing
                if (sound) {
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
                setIsPlaying(true);
                setCurrentMeditationId(meditation.id);
                setCurrentPosition(0);
                await newSound.playAsync();

                // Handle playback status updates (for progress tracking)
                newSound.setOnPlaybackStatusUpdate((status) => {
                    if (status.isLoaded) {
                        setCurrentPosition(status.positionMillis);
                        setDuration(status.durationMillis);
                        if (status.didJustFinish) {
                            setIsPlaying(false);
                            // Mark meditation as completed
                            setCompletedMeditationIds(prev => {
                                if (!prev.includes(meditation.id)) {
                                    return [...prev, meditation.id];
                                }
                                return prev;
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
            <SafeAreaView style={styles.container} edges={['right', 'left']}>
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
                        const isLocked = meditation.id > 1 && !completedMeditationIds.includes(meditation.id - 1);

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
                                                {isLocked ? 'Locked - Complete previous session' : meditation.subdescription}
                                            </Text>
                                        </View>

                                        <View style={styles.actionIcon}>
                                            {isLocked ? (
                                                <MaterialCommunityIcons
                                                    name="lock"
                                                    size={24}
                                                    color="#999"
                                                />
                                            ) : isPlaying && currentMeditationId === meditation.id ? (
                                                <MaterialCommunityIcons
                                                    name="pause-circle"
                                                    size={24}
                                                    color="#4caf50"
                                                />
                                            ) : (
                                                <MaterialCommunityIcons
                                                    name="play-circle"
                                                    size={24}
                                                    color="#4caf50"
                                                />
                                            )}
                                        </View>
                                    </View>

                                    {/* Progress Bar */}
                                    {isPlaying && currentMeditationId === meditation.id && duration > 0 && (
                                        <View style={styles.progressContainer}>
                                            <TouchableOpacity
                                                ref={progressViewRef}
                                                activeOpacity={1}
                                                onPress={handleProgressBarPress}
                                                {...(panResponderRef.current ? panResponderRef.current.panHandlers : {})}
                                                onLayout={(event) => {
                                                    setProgressBarWidth(event.nativeEvent.layout.width);
                                                }}
                                                style={styles.progressBar}
                                            >
                                                <View
                                                    style={[
                                                        styles.progressFill,
                                                        { width: `${(currentPosition / duration) * 100}%` },
                                                    ]}
                                                />
                                            </TouchableOpacity>
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
        paddingVertical: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
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
    progressBar: {
        height: 6,
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4caf50',
        borderRadius: 2,
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
