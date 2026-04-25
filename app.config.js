/**
 * app.config.js — Dynamic Expo configuration.
 *
 * Reads the APP_VARIANT environment variable at build time to inject
 * the correct navigation visibility level into the app bundle.
 *
 * APP_VARIANT → navLevel mapping:
 *   version1 → Level 1 (Home · Garden · Profile)
 *   version2 → Level 2 (Home · Mood Calendar · Profile)
 *   version3 → Level 3 (Home2 · Garden · Profile)
 *
 * The navLevel value is read at runtime via:
 *   Constants.expoConfig.extra.navLevel  (in BuildVersionControl.js)
 */

const navLevelMap = {
  version1: 1,
  version2: 2,
  version3: 3,
};

const variant = process.env.APP_VARIANT || 'version1';
const navLevel = navLevelMap[variant] ?? 1;

module.exports = {
  expo: {
    name: "adaptive-stressapp",
    slug: "adaptive-stressapp",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      infoPlist: {
        UIBackgroundModes: ["remote-notification"],
      },
      bundleIdentifier: "com.mona.adaptivestressapp",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      package: "com.mona.adaptivestressapp",
      permissions: [
        "RECEIVE_BOOT_COMPLETED",
        "VIBRATE",
        "WAKE_LOCK",
        "SCHEDULE_EXACT_ALARM",
        "POST_NOTIFICATIONS",
        "USE_EXACT_ALARM",
      ],
      useNextNotificationsApi: true,
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: [
      [
        "expo-notifications",
        {
          icon: "./assets/icon.png",
          color: "#6FAF98",
          sounds: [],
          mode: "production",
        },
      ],
    ],
    notification: {
      icon: "./assets/icon.png",
      color: "#6FAF98",
      androidMode: "default",
      androidCollapsedTitle: "#{unread_notifications} new stress reminders",
    },
    extra: {
      navLevel,
      eas: {
        projectId: "809f5a7b-19fc-4295-8c05-d88df2b2f404",
      },
    },
  },
};
