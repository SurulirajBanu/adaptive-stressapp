import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function Navigation({ navigation, currentScreen }) {
    return (
        <View style={styles.bottomNav}>
            <TouchableOpacity
                style={styles.navItem}
                onPress={() => navigation.navigate('Home')}
            >
                <Ionicons
                    name="home"
                    size={30}
                    color={currentScreen === 'Home' ? '#6FAF98' : '#4f7f6b'}
                />
                <Text
                    style={[
                        styles.navText,
                        { color: currentScreen === 'Home' ? '#6FAF98' : '#4f7f6b' },
                    ]}
                >
                    Home
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.navItem}
                onPress={() => navigation.navigate('Garden')}
            >
                <MaterialCommunityIcons
                    name="flower-tulip"
                    size={30}
                    color={currentScreen === 'Garden' ? '#6FAF98' : '#4f7f6b'}
                />
                <Text
                    style={[
                        styles.navText,
                        { color: currentScreen === 'Garden' ? '#6FAF98' : '#4f7f6b' },
                    ]}
                >
                    Garden
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.navItem}
                onPress={() => navigation.navigate('MoodCalendar')}
            >
                <MaterialCommunityIcons
                    name="calendar-heart"
                    size={30}
                    color={currentScreen === 'MoodCalendar' ? '#6FAF98' : '#4f7f6b'}
                />
                <Text
                    style={[
                        styles.navText,
                        { color: currentScreen === 'MoodCalendar' ? '#6FAF98' : '#4f7f6b' },
                    ]}
                >
                    Mood
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.navItem}
                onPress={() => navigation.navigate('StressTracker')}
            >
                <MaterialCommunityIcons
                    name="alert-circle-outline"
                    size={30}
                    color={currentScreen === 'Stress' ? '#6FAF98' : '#4f7f6b'}
                />
                <Text
                    style={[
                        styles.navText,
                        { color: currentScreen === 'Stress' ? '#6FAF98' : '#4f7f6b' },
                    ]}
                >
                    Stress
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.navItem}
                onPress={() => navigation.navigate('Profile')}
            >
                <Ionicons
                    name="person"
                    size={30}
                    color={currentScreen === 'Profile' ? '#6FAF98' : '#4f7f6b'}
                />
                <Text
                    style={[
                        styles.navText,
                        { color: currentScreen === 'Profile' ? '#6FAF98' : '#4f7f6b' },
                    ]}
                >
                    Profile
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
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
