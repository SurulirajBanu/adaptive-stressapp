## adaptive-stressapp

Adaptive Stress App is a **React Native / Expo mobile application** that helps users understand and manage their stress over time through guided practices, tracking tools, and a visual “garden” that reflects their self‑care habits.

The app uses **Firebase Authentication** for login/registration and stores local state (e.g. stress items) with **AsyncStorage**.

## Core features

- **Onboarding & auth**
  - Email/password login and registration using Firebase (`LoginScreen`, `RegisterScreen`).
  - Persistent authentication with React Native persistence (`firebaseConfig.js`).

- **Practice tools**
  - **Breathing exercises** (`Breathing.js`): animated 4–7–8 style breathing ball with visual guidance.
  - **Meditation sessions** (`Meditation.js`): playlist of guided audio meditations using `expo-av`, with progress bar and session unlocking.

- **Stress tracking & reflection**
  - **Stress tracker** (`StressTracker.js` / `StressForm.js`): track sources of stress, mark as solved, and persist them in `AsyncStorage`.
  - **Mood calendar** (`MoodCalendar.js`): view mood history over time (see screen for exact UI/behavior).
  - **Problem‑solving & coping** (`ProblemSolving.js`): structured space to think through stressors (see screen implementation).

- **Adaptive garden**
  - **Garden view** (`Garden.js`): a visual garden that changes based on recent practice.
  - Uses `AsyncStorage` to check when the last exercise was completed and shows healthy/unhealthy garden images accordingly.

- **Navigation & layout**
  - Stack navigation defined in `App.js` via `@react-navigation/native` and `@react-navigation/stack`.
  - Bottom navigation bar component (`Navigation.js`) for quick access to Home, Garden, Mood Calendar, Stress, and Profile.

## Tech stack

- **Framework**: React Native with **Expo** (see `app.json` and `package.json`).
- **Routing**: `@react-navigation/native`, `@react-navigation/stack`.
- **Auth & backend**: Firebase (`firebase/app`, `firebase/auth`).
- **Storage**: `@react-native-async-storage/async-storage` for on‑device persistence.
- **Media & UI**:
  - `expo-av` for audio playback.
  - `expo-linear-gradient` for gradients.
  - `@expo/vector-icons` (Ionicons, MaterialCommunityIcons) for icons.

## Project structure (high level)

At the repo root:

- `App.js` – Root app component, sets up navigation and auth state listener.
- `index.js` – Expo entry point that registers `App`.
- `app.json` – Expo app configuration (name, icons, splash, platforms).
- `package.json` / `package-lock.json` – Dependencies and npm scripts.
- `LICENSE` – License for this project.
- `Agents.md` – Guidelines for AI agents working on this repo.
- `.gitignore`, `.idea/` – Git and IDE/project configuration.

Source code lives under `src/`:

- `src/firebaseConfig.js` – Firebase initialization and React Native auth persistence.
- `src/components/`
  - `Navigation.js` – Bottom navigation bar used across main screens.
- `src/screens/`
  - `LoginScreen.js` – Email/password login with Firebase.
  - `RegisterScreen.js` – Account creation and nickname setup.
  - `HomeScreen.js`, `HomeScreen2.js` – Main practice/home views.
  - `Breathing.js` – Animated breathing exercise screen.
  - `Meditation.js` – Audio meditation list and player.
  - `Garden.js` – Adaptive garden visualization based on recent practice.
  - `StressTracker.js` – List of stress sources stored in `AsyncStorage`.
  - `StressForm.js` – Form for adding/editing a stress source.
  - `ProblemSolving.js` – Problem‑solving / coping strategy screen.
  - `MoodCalendar.js` – Mood tracking calendar.
  - `Profile.js` – User profile/settings screen.

Assets such as backgrounds, garden images, and breathing audio live under the `assets/` directory (referenced via `require('../../assets/...')` in screens).

## Getting started

### Prerequisites

- **Node.js** (recommended LTS)
- **npm** or **yarn**
- **Expo CLI** (installed globally): `npm install -g expo-cli` (or use `npx expo` commands)

You will also need a Firebase project if you want to use your own backend keys; update `src/firebaseConfig.js` accordingly.

### Installation

```bash
git clone <your-repo-url>
cd adaptive-stressapp
npm install
# or
yarn
```

### Running the mobile app (Expo)

From the project root:

```bash
npm start
# or
yarn start
```

This starts the **Expo dev server** (`expo start` under the hood).

- **Physical device (Expo Go)**:
  - Install the Expo Go app from the App Store / Google Play.
  - Scan the QR code shown in the terminal or browser.

- **Android emulator**:
  - Start an Android emulator from Android Studio.
  - Then run:
    ```bash
    npm run android
    # or
    yarn android
    ```

- **iOS simulator (macOS only)**:
  - Install Xcode and open at least one iOS Simulator.
  - Then run:
    ```bash
    npm run ios
    # or
    yarn ios
    ```

See the `scripts` section of `package.json` for available commands.

### Building installable binaries (APK / AAB) with Expo

This project uses Expo, so you can build distributable binaries using **EAS Build** (recommended) or the classic build system.

- **1. Login and configure Expo account (once)**
  ```bash
  npx expo login
  npx expo whoami
  ```

- **2. Configure EAS (once per project)**
  ```bash
  npx expo install eas-cli
  npx eas build:configure
  ```

- **3. Android build (APK or AAB)**
  - For a debug/sandbox APK (easy to share for testing):
    ```bash
    npx eas build --platform android --profile preview
    ```
  - For a store upload build (AAB by default):
    ```bash
    npx eas build --platform android --profile production
    ```
  - After the build finishes, Expo will give you a **URL** to download the APK/AAB.

- **4. iOS build**
  ```bash
  npx eas build --platform ios --profile production
  ```
  Expo will guide you through Apple credentials and provisioning.

You can customize build profiles (`preview`, `production`, etc.) in `eas.json` if you add one.

### Sharing builds

- **Direct APK sharing (Android)**:
  - Use the APK URL from EAS or download the APK and share it via email, Drive, etc.
  - On the test device, enable “Install from unknown sources” and tap the APK to install.

- **Store distribution**:
  - **Android**: upload the generated AAB (or APK) to Google Play Console.
  - **iOS**: upload the iOS build to App Store Connect (via EAS) and configure TestFlight / App Store distribution.

## Environment & configuration

- **Firebase**: The current `src/firebaseConfig.js` is configured for a specific Firebase project.  
  - To use your own project, replace the `firebaseConfig` values with your keys.
  - Keep keys that should remain private out of version control where appropriate.

## Development guidelines

- **Follow existing design**:
  - Use the same color palette, typography, and layout approaches as in the existing screens.
  - Reuse components like `Navigation` where possible.
- **State & storage**:
  - Prefer `AsyncStorage` for simple local persistence (as used in `StressTracker` and garden logic).
  - Keep Firebase usage consistent with `firebaseConfig.js`.
- **Audio & assets**:
  - When adding new meditations or breathing tracks, follow the pattern in `Meditation.js` and update the static `audioFiles` map.

For guidance on how AI agents should work with this project, see `Agents.md`.

## License

See `LICENSE` for licensing details.

