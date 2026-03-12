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
import Navigation from '../components/Navigation';

// Static audio file mapping
const audioFiles = {
    'problem_solving_1.mp3': require('../../assets/problem-solving/problem_solving_1.mp3'),
    'problem_solving_2.mp3': require('../../assets/problem-solving/problem_solving_2.mp3'),
    'problem_solving_3.mp3': require('../../assets/problem-solving/problem_solving_3.mp3'),
    'problem_solving_4.mp3': require('../../assets/problem-solving/problem_solving_4.mp3'),
    'problem_solving_5.mp3': require('../../assets/problem-solving/problem_solving_5.mp3'),
    'problem_solving_6.mp3': require('../../assets/problem-solving/problem_solving_6.mp3'),
    'problem_solving_7.mp3': require('../../assets/problem-solving/problem_solving_7.mp3'),
    'problem_solving_8.mp3': require('../../assets/problem-solving/problem_solving_8.mp3'),
    'problem_solving_9.mp3': require('../../assets/problem-solving/problem_solving_9.mp3'),
    'problem_solving_10.mp3': require('../../assets/problem-solving/problem_solving_10.mp3'),
    'problem_solving_11.mp3': require('../../assets/problem-solving/problem_solving_11.mp3'),
    'problem_solving_12.mp3': require('../../assets/problem-solving/problem_solving_12.mp3'),
};

const ProblemSolvingScreen = ({ navigation }) => {
    const [completedLessonIds, setCompletedLessonIds] = useState([]);
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentLessonId, setCurrentLessonId] = useState(null);
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

    const lessons = [
        {
            id: 1,
            title: 'What is Problem Focused Coping',
            description: 'Audio - Introduction to problem-focused strategies',
            subdescription: 'Audio - Introduction to problem-focused strategies',
            icon: 'help-circle',
            duration: '5 min',
            audioFile: 'problem_solving_1.mp3',
        },
        {
            id: 2,
            title: 'Problem-Focused vs Emotion-Focused Coping',
            description: 'Audio - Understanding different coping approaches',
            subdescription: 'Audio - Understanding different coping approaches',
            icon: 'compare',
            duration: '6 min',
            audioFile: 'problem_solving_2.mp3',
        },
        {
            id: 3,
            title: 'Growing Through Challenges',
            description: 'Audio - Building resilience through difficulties',
            subdescription: 'Audio - Building resilience through difficulties',
            icon: 'trending-up',
            duration: '4 min',
            audioFile: 'problem_solving_3.mp3',
        },
        {
            id: 4,
            title: 'When to Use Problem-Solving',
            description: 'Audio - Identifying appropriate situations',
            subdescription: 'Audio - Identifying appropriate situations',
            icon: 'time',
            duration: '5 min',
            audioFile: 'problem_solving_4.mp3',
        },
        {
            id: 5,
            title: 'Focus on What Matters',
            description: 'Audio - Prioritizing important issues',
            subdescription: 'Audio - Prioritizing important issues',
            icon: 'target',
            duration: '4 min',
            audioFile: 'problem_solving_5.mp3',
        },
        {
            id: 6,
            title: 'Step 1 – Recognising the Real Stressor',
            description: 'Audio - Identifying the root cause',
            subdescription: 'Audio - Identifying the root cause',
            icon: 'search',
            duration: '5 min',
            audioFile: 'problem_solving_6.mp3',
        },
        {
            id: 7,
            title: 'Step 2 – Brainstorming Solutions',
            description: 'Audio - Generating possible solutions',
            subdescription: 'Audio - Generating possible solutions',
            icon: 'bulb',
            duration: '4 min',
            audioFile: 'problem_solving_7.mp3',
        },
        {
            id: 8,
            title: 'Step 3 – Weighing Options & Making a Plan',
            description: 'Audio - Evaluating and planning action',
            subdescription: 'Audio - Evaluating and planning action',
            icon: 'balance-scale',
            duration: '5 min',
            audioFile: 'problem_solving_8.mp3',
        },
        {
            id: 9,
            title: 'Step 4 – Take One Small Step',
            description: 'Audio - Getting started with action',
            subdescription: 'Audio - Getting started with action',
            icon: 'walk',
            duration: '4 min',
            audioFile: 'problem_solving_9.mp3',
        },
        {
            id: 10,
            title: 'Using "Worry Time"',
            description: 'Audio - Managing worry effectively',
            subdescription: 'Audio - Managing worry effectively',
            icon: 'clock',
            duration: '4 min',
            audioFile: 'problem_solving_10.mp3',
        },
        {
            id: 11,
            title: 'Relax After Action',
            description: 'Audio - Recovery and relaxation techniques',
            subdescription: 'Audio - Recovery and relaxation techniques',
            icon: 'spa',
            duration: '4 min',
            audioFile: 'problem_solving_11.mp3',
        },
        {
            id: 12,
            title: 'Confidence & Control',
            description: 'Audio - Building self-efficacy',
            subdescription: 'Audio - Building self-efficacy',
            icon: 'shield-checkmark',
            duration: '5 min',
            audioFile: 'problem_solving_12.mp3',
        },
    ];

    const handleLessonPress = async (lesson) => {
        const isLocked = lesson.id > 1 && !completedLessonIds.includes(lesson.id - 1);

        if (!isLocked) {
            try {
                // Stop current audio if playing
                if (sound) {
                    await sound.unloadAsync();
                }

                // Load and play the audio file using static mapping
                const audioSource = audioFiles[lesson.audioFile];
                if (!audioSource) {
                    alert('Audio file not found: ' + lesson.audioFile);
                    return;
                }

                const { sound: newSound } = await Audio.Sound.createAsync(audioSource);
                setSound(newSound);
                setIsPlaying(true);
                setCurrentLessonId(lesson.id);
                setCurrentPosition(0);
                await newSound.playAsync();

                // Handle playback status updates (for progress tracking)
                newSound.setOnPlaybackStatusUpdate((status) => {
                    if (status.isLoaded) {
                        setCurrentPosition(status.positionMillis);
                        setDuration(status.durationMillis);
                        if (status.didJustFinish) {
                            setIsPlaying(false);
                            // Mark lesson as completed
                            setCompletedLessonIds(prev => {
                                if (!prev.includes(lesson.id)) {
                                    return [...prev, lesson.id];
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
            'help-circle': 'help-circle-outline',
            'compare': 'git-compare',
            'trending-up': 'trending-up',
            'time': 'clock-outline',
            'target': 'target',
            'search': 'magnify',
            'bulb': 'lightbulb-on-outline',
            'balance-scale': 'scale-balance',
            'walk': 'walk',
            'clock': 'clock-outline',
            'spa': 'spa',
            'shield-checkmark': 'shield-check-outline',
        };

        return iconMap[iconName] || 'help-circle-outline';
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
                    <Text style={styles.headerTitle}>Problem-Solving Lessons</Text>
                    <View style={styles.headerSpacer} />
                </View>

                {/* Lesson List */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {lessons.map((lesson) => {
                        // Determine if lesson is locked
                        const isLocked = lesson.id > 1 && !completedLessonIds.includes(lesson.id - 1);

                        return (
                            <TouchableOpacity
                                key={lesson.id}
                                onPress={() => handleLessonPress(lesson)}
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
                                                name={getIconComponent(lesson.icon)}
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
                                                {lesson.title}
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.description,
                                                    isLocked && styles.lockedDescription,
                                                ]}
                                            >
                                                {isLocked ? 'Locked - Complete previous lesson' : lesson.subdescription}
                                            </Text>
                                        </View>

                                        <View style={styles.actionIcon}>
                                            {isLocked ? (
                                                <MaterialCommunityIcons
                                                    name="lock"
                                                    size={24}
                                                    color="#999"
                                                />
                                            ) : isPlaying && currentLessonId === lesson.id ? (
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
                                    {isPlaying && currentLessonId === lesson.id && duration > 0 && (
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
                <Navigation navigation={navigation} currentScreen="ProblemSolving" />
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

export default ProblemSolvingScreen;
