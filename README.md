# Adaptive Stress App

> A mobile wellness companion that helps you understand, track, and manage stress through guided practices and personalised insights.

---

## What is this app?

The Adaptive Stress App is a React Native / Expo mobile application designed to help people cope with stress in their daily lives. It provides:

- **Guided breathing exercises** using the 4-7-8 technique
- **Guided meditation sessions** with progressive unlocking
- **Problem-solving lessons** focused on coping strategies
- **Mood tracking** — daily calendar and weekly check-ins
- **Stress journal** — log stressors, brainstorm solutions, set reminders
- **A virtual garden** that stays healthy when you exercise regularly

All session activity is persisted to Firebase Realtime Database so progress is visible across devices.

---

## Features

### Breathing Exercises
- Animated ball guides the 4-7-8 breathing cycle (4 s in · 7 s hold · 8 s out)
- Session start/end time and duration saved to Firebase

### Meditation Sessions
- 13 guided audio tracks, unlocked one-by-one as you complete each session
- Draggable progress bar with tap-to-seek
- Session data (title, duration) saved to Firebase

### Problem-Solving Lessons
- 12 audio lessons covering problem-focused coping strategies
- Same progressive unlock and progress bar as Meditation
- Session data saved to Firebase

### Mood Tracking
- **Mood Calendar**: record one of five daily moods; view history on a monthly calendar
- **Weekly Mood Prompt**: modal appears on first launch, then once every 7 days
- Both save to Firebase Realtime Database

### Stress Journal
- Add stressors with category tags (Work, Study, Relationship, Financial, Health, Family, Other)
- Brainstorm solutions and optionally set a reminder notification
- Mark stressors as resolved

### Virtual Garden
- Healthy garden = an exercise was completed within the last **24 hours**
- Checks every second using `lastExerciseTime` in AsyncStorage
- Written by Breathing, Meditation, and Problem Solving screens

### Daily Reminders
- Set a daily push notification time from the Profile screen
- Scheduled via `expo-notifications`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native 0.81 + Expo 54 |
| Navigation | React Navigation (Stack) |
| Auth | Firebase Authentication |
| Remote storage | Firebase Realtime Database |
| Local storage | AsyncStorage |
| Audio | expo-av |
| Notifications | expo-notifications |
| UI | expo-linear-gradient, @expo/vector-icons |

---

## Project Structure

```
adaptive-stressapp/
├── App.js                          # Root: auth listener, navigation stack, notification setup
├── src/
│   ├── firebaseConfig.js           # Firebase init (auth, Firestore, Realtime DB)
│   ├── BuildVersionControl.js      # Nav visibility levels, nav item definitions, context
│   ├── context/
│   │   └── NavigationVisibilityContext.js  # (legacy) nav visibility context
│   ├── config/
│   │   └── NavigationConfig.js     # (legacy) static nav level constant
│   ├── components/
│   │   ├── Navigation.js           # Bottom tab bar (level-aware)
│   │   └── WeeklyMood.js           # Weekly mood rating modal
│   └── screens/
│       ├── LoginScreen.js          # Email/password login
│       ├── RegisterScreen.js       # Account creation
│       ├── HomeScreen.js           # Practice hub — Breathing & Meditation (levels 1 & 2)
│       ├── HomeScreen2.js          # Practice hub — Problem Solving & Stress (level 3)
│       ├── Breathing.js            # 4-7-8 breathing exercise + Firebase session save
│       ├── Meditation.js           # Audio meditation player + Firebase session save
│       ├── ProblemSolving.js       # Problem-solving audio lessons + Firebase session save
│       ├── Garden.js               # Wellness garden (24 h health window)
│       ├── MoodCalendar.js         # Daily mood calendar + Firebase save
│       ├── StressTracker.js        # Stress items list
│       ├── StressForm.js           # Add/edit stress items + reminder scheduling
│       └── Profile.js              # Settings: reminders, logout, build version (TEST_MODE)
└── assets/                         # Background image, audio files
```

---

## Firebase Realtime Database Schema

```
breathingSessions/{uid}/{pushId}
  email, userId, startTime, endTime, durationSeconds

meditationSessions/{uid}/{pushId}
  email, userId, meditationTitle, startTime, endTime, durationSeconds

problemSolvingSessions/{uid}/{pushId}
  email, userId, lessonTitle, startTime, endTime, durationSeconds

moodCalendar/{uid}/{YYYY-MM-DD}
  email, userId, mood, emoji, label, createdAt

userMoods/{uid}/entries/{pushId}
  userEmail, emoji, label, mood, createdAt
```

All timestamps use a human-readable format: `"March 27, 2026, 10:36:33 PM"`.

### Required Security Rules

```json
{
  "rules": {
    "breathingSessions": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    },
    "meditationSessions": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    },
    "problemSolvingSessions": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    },
    "moodCalendar": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    },
    "userMoods": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    }
  }
}
```

---

## Navigation Visibility Levels

The app ships with three layout variants, switchable from Profile (TEST_MODE only):

| Level | Bottom tabs |
|---|---|
| 1 (default) | Home · Garden · Profile |
| 2 | Home · Mood Calendar · Profile |
| 3 | Home2 · Garden · Profile |

The active level is stored in AsyncStorage (`navVisibilityLevel`) and provided app-wide via `NavigationVisibilityContext`.

---

## Getting Started

### Prerequisites

- Node.js LTS
- Expo CLI: `npm install -g expo-cli`
- A Firebase project with Auth and Realtime Database enabled

### Install & Run

```bash
git clone <repo-url>
cd adaptive-stressapp
npm install

# Start Metro bundler
npm start

# Open on Android emulator (requires dev build installed)
npm run android
```

### Firebase Setup

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Email/Password** authentication
3. Create a **Realtime Database** and apply the security rules above
4. Copy your config into `src/firebaseConfig.js`

### Build for Production

```bash
npm install -g eas-cli
eas login
eas build:configure

# Android APK (preview)
eas build --platform android --profile preview

# Android AAB (Google Play)
eas build --platform android --profile production
```

---

## AsyncStorage Keys Reference

| Key | Written by | Purpose |
|---|---|---|
| `lastExerciseTime` | Breathing, Meditation, ProblemSolving | Garden health check |
| `lockedMeditationIds` | Meditation | Tracks which sessions are locked |
| `lockedLessonIds` | ProblemSolving | Tracks which lessons are locked |
| `moodHistory` | MoodCalendar | Local mood calendar cache |
| `lastMoodRatingTime` | WeeklyMood | Controls weekly prompt frequency |
| `userMood` | WeeklyMood | Latest weekly mood rating |
| `reminderTime` | Profile | Daily notification time |
| `reminderEnabled` | Profile | Daily notification toggle |
| `navVisibilityLevel` | Profile | Active navigation layout level |
| `stressItems` | StressTracker/StressForm | Stress journal entries |

---

## Contributing

1. Follow existing code style and naming conventions
2. Test on both Android and iOS
3. Keep the user experience simple and calming

---

<div align="center">
  <sub>Made with care for mental wellness and stress management</sub>
</div>
