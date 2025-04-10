import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Flower } from './Flower';
import { FlowerType } from './flowerData';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const { width, height } = Dimensions.get('window');
const flowerTypes: FlowerType[] = ['rose', 'tulip', 'daisy', 'sunflower'];

interface FlowerItem {
  id: string;
  type: FlowerType;
  size: number;
  position: {
    x: number;
    y: number;
  };
  color?: string;
}

interface FlowerFieldProps {
  count?: number;
  isPremium?: boolean;
  onAddFlower?: () => void;
  maxFlowers?: number;
}

/**
 * FlowerField Component
 * Renders a field of flowers with ability to add more
 */
export const FlowerField = ({
  count = 5,
  isPremium = false,
  onAddFlower,
  maxFlowers = 20,
}: FlowerFieldProps) => {
  // State to track flowers
  const [flowers, setFlowers] = useState<FlowerItem[]>([]);
  
  // Generate initial flowers
  useEffect(() => {
    generateInitialFlowers();
  }, []);
  
  const generateInitialFlowers = () => {
    const initialFlowers: FlowerItem[] = [];
    const initialCount = Math.min(count, maxFlowers);
    
    for (let i = 0; i < initialCount; i++) {
      initialFlowers.push(createRandomFlower());
    }
    
    setFlowers(initialFlowers);
  };
  
  // Create a random flower
  const createRandomFlower = (x?: number, y?: number): FlowerItem => {
    // Use provided coordinates or random ones
    const posX = x !== undefined ? x : Math.random() * width * 0.8 + width * 0.1;
    const posY = y !== undefined ? y : Math.random() * height * 0.5 + height * 0.2;
    
    return {
      id: Math.random().toString(),
      type: flowerTypes[Math.floor(Math.random() * flowerTypes.length)],
      size: Math.random() * 30 + 45, // Size between 45-75
      position: { x: posX, y: posY },
      color: isPremium 
        ? `hsl(${Math.random() * 360}, ${60 + Math.random() * 20}%, ${50 + Math.random() * 20}%)`
        : undefined
    };
  };
  
  // Add a new flower when the user taps the screen
  const addFlower = useCallback((x: number, y: number) => {
    if (flowers.length >= maxFlowers) {
      // Optional: Remove the oldest flower to make room for a new one
      setFlowers(prev => [...prev.slice(1), createRandomFlower(x, y)]);
    } else {
      setFlowers(prev => [...prev, createRandomFlower(x, y)]);
      
      // Trigger the callback if provided
      if (onAddFlower) {
        onAddFlower();
      }
      
      // Add haptic feedback for real devices
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    }
  }, [flowers, isPremium, maxFlowers, onAddFlower]);
  
  // Handle taps on the background
  const handleBackgroundPress = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    addFlower(locationX, locationY);
  };
  
  return (
    <TouchableWithoutFeedback onPress={handleBackgroundPress}>
      <View style={styles.container}>
        <LinearGradient
          colors={['#FFEBCD', '#FFF8E1']}
          style={styles.sandbox}
        />
        
        {flowers.map(flower => (
          <Flower
            key={flower.id}
            type={flower.type}
            size={flower.size}
            position={flower.position}
            color={flower.color}
            isPremium={isPremium}
            onPress={() => {
              // Make the flower "bloom" when tapped
              // This is handled inside the Flower component
            }}
          />
        ))}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  sandbox: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});