import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    StatusBar,
    ImageBackground,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Navigation from '../components/Navigation';

const CATEGORIES = ['Work', 'Study', 'Relationship', 'Financial', 'Health', 'Family', 'Other'];

export default function IdentifyStress({ navigation, route }) {
    const [description, setDescription] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Work');

    const handleNext = () => {
        if (description.trim().length === 0) {
            alert('Please describe your stress source');
            return;
        }

        navigation.navigate('StressSolutions', {
            stressDescription: description,
            category: selectedCategory,
        });
    };

    return (
        <ImageBackground
            source={require('../../assets/background.png')}
            style={styles.background}
            resizeMode="cover"
        >
            <SafeAreaView style={styles.container} edges={['right', 'left', 'bottom']}>
                <StatusBar barStyle="dark-content" />

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <ScrollView contentContainerStyle={styles.content}>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Ionicons name="chevron-back" size={32} color="#4f7f6b" />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>Identify Your Stress</Text>
                            <View style={{ width: 32 }} />
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.subtitle}>
                                Take a moment to reflect on what's causing you stress right now.
                            </Text>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>What's causing your stress?</Text>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Describe the situation that is stressing you..."
                                    placeholderTextColor="#999"
                                    multiline
                                    maxLength={200}
                                    value={description}
                                    onChangeText={setDescription}
                                    textAlignVertical="top"
                                />
                                <Text style={styles.charCount}>{description.length}/200</Text>
                            </View>

                            <View style={styles.categorySection}>
                                <Text style={styles.label}>Category</Text>
                                <View style={styles.categoryGrid}>
                                    {CATEGORIES.map(category => (
                                        <TouchableOpacity
                                            key={category}
                                            style={[
                                                styles.categoryButton,
                                                selectedCategory === category && styles.categoryButtonActive,
                                            ]}
                                            onPress={() => setSelectedCategory(category)}
                                        >
                                            <Text
                                                style={[
                                                    styles.categoryButtonText,
                                                    selectedCategory === category && styles.categoryButtonTextActive,
                                                ]}
                                            >
                                                {category}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </View>
                    </ScrollView>

                    <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                        <Text style={styles.nextButtonText}>Next</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>

                <Navigation navigation={navigation} currentScreen="Stress" />
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2f4f4f',
    },
    section: {
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 16,
        color: '#4f7f6b',
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2f4f4f',
        marginBottom: 8,
    },
    textInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 12,
        padding: 12,
        minHeight: 100,
        fontSize: 14,
        color: '#2f4f4f',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    charCount: {
        fontSize: 12,
        color: '#999',
        marginTop: 6,
        textAlign: 'right',
    },
    categorySection: {
        marginBottom: 24,
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    categoryButton: {
        width: '31%',
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderWidth: 2,
        borderColor: '#ddd',
        alignItems: 'center',
    },
    categoryButtonActive: {
        backgroundColor: '#6FAF98',
        borderColor: '#6FAF98',
    },
    categoryButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4f7f6b',
    },
    categoryButtonTextActive: {
        color: 'white',
    },
    nextButton: {
        backgroundColor: '#6FAF98',
        marginHorizontal: 20,
        marginBottom: 20,
        paddingVertical: 14,
        borderRadius: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    nextButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
});
