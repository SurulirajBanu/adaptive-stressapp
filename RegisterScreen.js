import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from './firebaseConfig';

export default function RegisterScreen({ navigation }) {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    if (!nickname || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        // This part saves the Nickname to the Firebase User Profile
        updateProfile(userCredentials.user, {
          displayName: nickname
        }).then(() => {
          Alert.alert("Success", `Account created for ${nickname}!`);
        });
      })
      .catch(error => Alert.alert("Registration Error", error.message));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.inputContainer}>
        <Text style={styles.header}>Join Us</Text>

        <TextInput
          placeholder="Nick Name"
          value={nickname}
          onChangeText={setNickname}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSignUp} style={styles.button}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  inputContainer: { width: '80%' },
  input: { backgroundColor: 'white', paddingHorizontal: 15, paddingVertical: 12, borderRadius: 10, marginTop: 10, borderWidth: 1, borderColor: '#ddd' },
  buttonContainer: { width: '60%', justifyContent: 'center', alignItems: 'center', marginTop: 30 },
  button: { backgroundColor: '#34C759', width: '100%', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonOutline: { backgroundColor: 'white', marginTop: 10, borderColor: '#34C759', borderWidth: 2 },
  buttonText: { color: 'white', fontWeight: '700', fontSize: 16 },
  buttonOutlineText: { color: '#34C759', fontWeight: '700', fontSize: 16 },
});