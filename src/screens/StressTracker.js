import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    StatusBar,
    ImageBackground,
    ScrollView,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Navigation from '../components/Navigation';

const CATEGORY_COLORS = {
    Work: '#FF6B6B',
    Study: '#4ECDC4',
    Relationship: '#FFE66D',
    Financial: '#95E1D3',
    Health: '#C7CEEA',
    Family: '#B5EAD7',
    Other: '#D4A5A5',
};

export default function StressTracker({ navigation }) {
    const [stressItems, setStressItems] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            loadStressItems();
        }, [])
    );

    const loadStressItems = async () => {
        try {
            const savedItems = await AsyncStorage.getItem('stressItems');
            if (savedItems) {
                setStressItems(JSON.parse(savedItems));
            }
        } catch (error) {
            console.log('Error loading stress items:', error);
        }
    };

    const deleteStressItem = async (id) => {
        const updatedItems = stressItems.filter(item => item.id !== id);
        setStressItems(updatedItems);
        await AsyncStorage.setItem('stressItems', JSON.stringify(updatedItems));
    };

    const toggleSolved = async (id) => {
        const updatedItems = stressItems.map(item =>
            item.id === id ? { ...item, solved: !item.solved } : item
        );
        setStressItems(updatedItems);
        await AsyncStorage.setItem('stressItems', JSON.stringify(updatedItems));
    };

    const renderStressItem = ({ item }) => (
        <TouchableOpacity
            style={styles.stressCard}
            onPress={() => navigation.navigate('StressForm', { item })}
        >
            <TouchableOpacity
                style={styles.checkBox}
                onPress={() => toggleSolved(item.id)}
            >
                <Ionicons
                    name={item.solved ? 'checkmark-circle' : 'ellipse-outline'}
                    size={24}
                    color={item.solved ? '#6FAF98' : '#ccc'}
                />
            </TouchableOpacity>

            <View style={styles.stressContent}>
                <View
                    style={[
                        styles.categoryBadge,
                        { backgroundColor: CATEGORY_COLORS[item.category] },
                    ]}
                >
                    <Text style={styles.categoryText}>{item.category}</Text>
                </View>
                <Text
                    style={[styles.stressDescription, item.solved && styles.stressDescriptionSolved]}
                    numberOfLines={2}
                >
                    {item.description}
                </Text>
                {item.solution && (
                    <Text style={styles.solutionText} numberOfLines={1}>
                        💡 {item.solution}
                    </Text>
                )}
            </View>

            <TouchableOpacity onPress={() => deleteStressItem(item.id)}>
                <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <ImageBackground
            source={require('../../assets/background.png')}
            style={styles.background}
            resizeMode="cover"
        >
            <SafeAreaView style={styles.container} edges={['right', 'left', 'bottom']}>
                <StatusBar barStyle="dark-content" />

                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Your Sources of Stress</Text>
                </View>

                {stressItems.length === 0 ? (
                    <View style={styles.emptyState}>
                        <MaterialCommunityIcons name="inbox-outline" size={60} color="#ccc" />
                        <Text style={styles.emptyText}>No stress sources yet</Text>
                        <Text style={styles.emptySubtext}>
                            Identify and track what's causing you stress
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={stressItems}
                        renderItem={renderStressItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.listContent}
                        scrollEnabled={false}
                    />
                )}

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('StressForm')}
                >
                    <Ionicons name="add" size={24} color="white" />
                    <Text style={styles.addButtonText}>Add Stress Source</Text>
                </TouchableOpacity>

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
    header: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2f4f4f',
        textAlign: 'center',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2f4f4f',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#4f7f6b',
        marginTop: 8,
        textAlign: 'center',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    stressCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    checkBox: {
        marginRight: 12,
        paddingVertical: 4,
    },
    stressContent: {
        flex: 1,
    },
    categoryBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginBottom: 6,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '600',
        color: 'white',
    },
    stressDescription: {
        fontSize: 14,
        fontWeight: '500',
        color: '#2f4f4f',
        marginBottom: 4,
    },
    stressDescriptionSolved: {
        textDecorationLine: 'line-through',
        color: '#999',
    },
    solutionText: {
        fontSize: 12,
        color: '#6FAF98',
        marginTop: 4,
    },
    addButton: {
        flexDirection: 'row',
        backgroundColor: '#6FAF98',
        marginHorizontal: 20,
        marginBottom: 16,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});
