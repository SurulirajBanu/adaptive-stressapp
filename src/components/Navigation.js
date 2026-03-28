/**
 * Navigation.js — Dynamic bottom navigation bar.
 *
 * Reads the current navigation visibility level from context and filters
 * NAV_ITEMS (defined in BuildVersionControl.js) to show only the tabs
 * that belong to the active level. The active tab is highlighted in #6FAF98.
 *
 * @param {object} navigation - React Navigation navigation prop
 * @param {string} currentScreen - Name of the currently active screen (used for active-tab styling)
 */
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigationVisibility, NAV_ITEMS } from '../BuildVersionControl';

export default function Navigation({ navigation, currentScreen }) {
    // Get visibility level from context
    const visibilityLevel = useNavigationVisibility();

    // Filter items based on the current visibility level
    const visibleItems = NAV_ITEMS.filter(item =>
        item.visibilityLevels.includes(visibilityLevel)
    );

    const renderIcon = (item) => {
        const color = currentScreen === item.screenName ? '#6FAF98' : '#4f7f6b';
        if (item.iconFamily === 'Ionicons') {
            return <Ionicons name={item.icon} size={30} color={color} />;
        }
        return <MaterialCommunityIcons name={item.icon} size={30} color={color} />;
    };

    return (
        <View style={styles.bottomNav}>
            {visibleItems.map((item) => (
                <TouchableOpacity
                    key={item.screenName}
                    style={styles.navItem}
                    onPress={() => navigation.navigate(item.screenName)}
                >
                    {renderIcon(item)}
                    <Text
                        style={[
                            styles.navText,
                            {
                                color:
                                    currentScreen === item.screenName
                                        ? '#6FAF98'
                                        : '#4f7f6b',
                            },
                        ]}
                    >
                        {item.name}
                    </Text>
                </TouchableOpacity>
            ))}
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
