/**
 * Build Version Control
 * 
 * Centralized control for app navigation visibility levels and build configuration.
 * This file manages:
 * - Navigation visibility levels (1, 2, or 3)
 * - Navigation item definitions with assigned visibility levels
 * - Navigation visibility context for app-wide access
 */

import React, { createContext, useContext } from 'react';

// ============================================
// TEST MODE
// ============================================
export const TEST_MODE = true; // Set to true to show additional debug/test UI

// ============================================
// NAVIGATION VISIBILITY LEVEL CONFIG
// ============================================
// Default visibility level (can be overridden dynamically from Profile)
// - Level 1: Home, Garden, Profile (minimal view)
// - Level 2: Home, Mood, Profile (minimal with alternatives)
// - Level 3: Home2, Garden, Profile (full view)
export const DEFAULT_NAV_VISIBILITY_LEVEL = 1;
export const NAV_VISIBILITY_LEVELS = [
    { level: 1, label: 'Version 1 (Home, Garden, Profile)' },
    { level: 2, label: 'Version 2 (Home, Mood, Profile)' },
    { level: 3, label: 'Version 3 (Home2, Garden, Profile)' },
];

// ============================================
// NAVIGATION ITEMS DEFINITION
// ============================================
// Each nav item can have multiple visibility levels assigned
export const NAV_ITEMS = [
    {
        name: 'Home',
        screenName: 'Home',
        icon: 'home',
        iconFamily: 'Ionicons',
        visibilityLevels: [1, 2],
    },
    {
        name: 'Home',
        screenName: 'Home2',
        icon: 'home',
        iconFamily: 'Ionicons',
        visibilityLevels: [3],
    },
    {
        name: 'Garden',
        screenName: 'Garden',
        icon: 'flower-tulip',
        iconFamily: 'MaterialCommunityIcons',
        visibilityLevels: [1, 3],
    },
    {
        name: 'Mood',
        screenName: 'MoodCalendar',
        icon: 'calendar-heart',
        iconFamily: 'MaterialCommunityIcons',
        visibilityLevels: [2],
    },
    {
        name: 'Profile',
        screenName: 'Profile',
        icon: 'person',
        iconFamily: 'Ionicons',
        visibilityLevels: [1, 2, 3],
    },
];

// ============================================
// NAVIGATION VISIBILITY CONTEXT
// ============================================
const NavigationVisibilityContext = createContext({
    visibilityLevel: DEFAULT_NAV_VISIBILITY_LEVEL,
    setVisibilityLevel: () => { },
});

export const NavigationVisibilityProvider = ({ children, visibilityLevel = DEFAULT_NAV_VISIBILITY_LEVEL, setVisibilityLevel = () => { } }) => {
    return (
        <NavigationVisibilityContext.Provider value={{ visibilityLevel, setVisibilityLevel }}>
            {children}
        </NavigationVisibilityContext.Provider>
    );
};

export const useNavigationVisibility = () => {
    const context = useContext(NavigationVisibilityContext);
    return context.visibilityLevel;
};

export const useNavigationVisibilityControl = () => {
    return useContext(NavigationVisibilityContext);
};
