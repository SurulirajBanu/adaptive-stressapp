# 🌱 Adaptive Stress App

> A mobile wellness companion that helps you understand, track, and manage stress through guided practices and personalized insights.

## 📖 What is this app?

The Adaptive Stress App is a mobile application designed to help people cope with stress in their daily lives. Think of it as a personal wellness coach in your pocket that guides you through:

- **Calming breathing exercises** when you feel overwhelmed
- **Guided meditation sessions** to clear your mind
- **Stress tracking tools** to understand what's bothering you
- **Problem-solving strategies** to tackle life's challenges
- **A virtual garden** that grows healthier as you take care of yourself

The app adapts to your usage - the more you practice self-care, the more your virtual garden flourishes, providing a visual reminder of your progress.

---

## ✨ What can you do with this app?

### 🧘 Practice Mindfulness
- **Breathing Exercises**: Follow a gentle animated guide that helps you breathe slowly and deeply using the 4-7-8 breathing technique
- **Meditation Sessions**: Listen to 13 different guided meditations covering topics like mindfulness, body scans, and compassion. Sessions unlock as you complete them, encouraging regular practice

### 📊 Track Your Wellbeing
- **Mood Calendar**: Record how you're feeling each day and see patterns over time with a visual calendar
- **Stress Tracker**: Write down what's causing you stress, categorize it (work, relationships, health, etc.), and mark items as resolved when you've dealt with them
- **Set Reminders**: Get gentle notifications to remind you to practice self-care or work on your solutions

### 💡 Learn Coping Strategies
- **Problem-Solving Lessons**: Listen to 12 audio lessons teaching you effective ways to handle stress and solve problems
- **Troubleshooting Steps**: Create action plans for your stressors - identify the problem, brainstorm solutions, and set reminders to follow through

### 🌸 Watch Your Garden Grow
- **Adaptive Garden**: Your personal virtual garden reflects your self-care habits. When you complete breathing exercises or meditations, your garden stays healthy and vibrant. If you haven't practiced in a while, the garden will show it needs attention - a gentle reminder to take care of yourself

---

## 🎯 Who is this for?

This app is for anyone who:
- Feels stressed or overwhelmed and wants practical tools to cope
- Wants to build a regular mindfulness or meditation practice
- Likes to track their moods and understand their emotional patterns
- Needs help organizing and solving life's problems
- Appreciates visual reminders of their progress and self-care habits

---

## 📱 How to use the app

1. **Sign up** with your email and password (or log in if you already have an account)
2. **Explore the Practice screens** to try breathing exercises or start your first meditation
3. **Track your mood** daily to see how you feel over time
4. **Add stressors** you're dealing with and brainstorm solutions
5. **Listen to problem-solving lessons** to learn new coping strategies
6. **Check your garden** to see how your self-care habits are reflected visually
7. **Set up reminders** in your Profile to maintain regular practice

---

## 🏗️ Technical Overview
<sub>*This section is for developers and technical users*</sub>

### Built With
- **Platform**: React Native with Expo
- **Authentication**: Firebase Authentication
- **Storage**: AsyncStorage (local device storage)
- **Audio**: Expo AV for meditation playback
- **Navigation**: React Navigation (Stack & Bottom Tabs)

### Key Features Implementation
- **Breathing exercises** (`Breathing.js`): Animated 4-7-8 style breathing with visual guidance
- **Meditation sessions** (`Meditation.js`): Audio playlist with progress tracking and session unlocking
- **Stress tracker** (`StressTracker.js`, `StressForm.js`): Persistent stress management with AsyncStorage
- **Mood calendar** (`MoodCalendar.js`): Daily mood tracking with visual calendar display
- **Problem-solving** (`ProblemSolving.js`): Audio lessons with structured coping strategies
- **Adaptive garden** (`Garden.js`): Visual feedback based on recent practice activity

### Project Structure
```
adaptive-stressapp/
├── App.js                    # Main app component with navigation
├── src/
│   ├── firebaseConfig.js     # Firebase initialization
│   ├── components/
│   │   └── Navigation.js     # Bottom navigation bar
│   └── screens/
│       ├── LoginScreen.js    # Email/password login
│       ├── RegisterScreen.js # Account creation
│       ├── HomeScreen.js     # Main practice hub (breathing & meditation)
│       ├── HomeScreen2.js    # Secondary hub (problem-solving & stress)
│       ├── Breathing.js      # Guided breathing exercise
│       ├── Meditation.js     # Meditation audio player
│       ├── Garden.js          # Adaptive garden visualization
│       ├── StressTracker.js  # Stress list view
│       ├── StressForm.js     # Add/edit stress items
│       ├── ProblemSolving.js # Problem-solving audio lessons
│       ├── MoodCalendar.js   # Mood tracking calendar
│       └── Profile.js        # User settings and reminders
└── assets/                   # Images and audio files
```

---

## 🚀 For Developers: Getting Started

### Prerequisites
- Node.js (LTS version recommended)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Firebase project (for authentication)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd adaptive-stressapp

# Install dependencies
npm install
```

### Running the App

```bash
# Start the development server
npm start

# Run on Android emulator
npm run android

# Run on iOS simulator (macOS only)
npm run ios
```

### Using Expo Go App
1. Install Expo Go from App Store or Google Play
2. Run `npm start` in the project directory
3. Scan the QR code with Expo Go app

### Building for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build Android APK
eas build --platform android --profile preview

# Build for production (AAB for Google Play)
eas build --platform android --profile production

# Build for iOS
eas build --platform ios --profile production
```

### Configuration
- Update `src/firebaseConfig.js` with your Firebase project credentials
- Modify `app.json` for app metadata (name, version, icons)

---

## 🤝 Contributing

This is an academic/personal project. For major changes or improvements:
1. Review `Agents.md` for project guidelines
2. Follow the existing design patterns and code style
3. Test thoroughly on both iOS and Android
4. Keep user experience simple and intuitive

---

## 📄 License

See `LICENSE` file for details.

---

## 💡 Tips for Users

- **Build a routine**: Set daily reminders to practice breathing or meditation
- **Be honest**: Track your real feelings and stressors - this app is for you
- **Start small**: Even 5 minutes of breathing can make a difference
- **Check your garden**: Use it as a visual reminder to prioritize self-care
- **Unlock gradually**: Complete meditations in order to build a steady practice
- **Explore both homes**: The app has two practice areas - try them both!

---

<div align="center">
  <sub>Made with 💚 for mental wellness and stress management</sub>
</div>
