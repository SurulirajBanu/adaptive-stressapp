import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email === '' || password === '') {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .catch(error => Alert.alert("Login Error", error.message));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.inputContainer}>
        <Text style={styles.header}>Adaptive Stress App</Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
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
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/* This is the magic button that takes you to the Register screen */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Create New Account</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 40, color: '#333' },
  inputContainer: { width: '80%' },
  input: { backgroundColor: 'white', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 10, marginTop: 10, borderWidth: 1, borderColor: '#ddd' },
  buttonContainer: { width: '60%', justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  button: { backgroundColor: '#0782F9', width: '100%', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonOutline: { backgroundColor: 'white', marginTop: 10, borderColor: '#0782F9', borderWidth: 2 },
  buttonText: { color: 'white', fontWeight: '700', fontSize: 16 },
  buttonOutlineText: { color: '#0782F9', fontWeight: '700', fontSize: 16 },
});