import { StyleSheet, Text, View, TouchableOpacity, Platform, Linking } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/lib/supabase';
import { products } from '@/src/stripe-config';
import { useState } from 'react';
import Constants from 'expo-constants';

export default function HomeScreen() {
  const [error, setError] = useState<string | null>(null);

  const getBaseUrl = () => {
    if (Platform.OS === 'web') {
      return window.location.origin;
    }
    // For development
    if (__DEV__) {
      return Constants.expoConfig?.hostUri 
        ? `http://${Constants.expoConfig.hostUri}`
        : 'http://localhost:8081';
    }
    // For production, replace with your deployed URL
    return 'https://your-production-url.com';
  };

  const handleDonate = async () => {
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const baseUrl = getBaseUrl();
      const response = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/stripe-checkout-anonymous`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          price_id: products.donation.priceId,
          mode: products.donation.mode,
          success_url: `${baseUrl}/donation-success`,
          cancel_url: `${baseUrl}/`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Checkout error:', data);
        setError(data.error || 'Failed to process donation. Please try again.');
        return;
      }

      const { url } = data;
      if (url) {
        if (Platform.OS === 'web') {
          window.location.href = url;
        } else {
          await Linking.openURL(url);
        }
      } else {
        setError('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setError('Network error. Please check your connection and try again.');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4C669F', '#3B5998', '#192F6A']}
        style={styles.gradient}>
        <View style={styles.content}>
          <Text style={styles.titleText}>Hello World</Text>
          <Text style={styles.subtitle}>
            Welcome to this beautiful mobile app
          </Text>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          <View style={styles.buttonContainer}>
            <Link href="/subscription">
              <TouchableOpacity
                style={[
                  styles.subscribeButton,
                  Platform.select({
                    web: styles.buttonWeb,
                    default: {}
                  })
                ]}>
                <Text style={styles.buttonText}>Subscribe Now</Text>
              </TouchableOpacity>
            </Link>
          </View>
          <TouchableOpacity
            style={[
              styles.donateButton,
              Platform.select({
                web: styles.donateButtonWeb,
                default: {}
              })
            ]}
            onPress={handleDonate}>
            <Text style={styles.buttonText}>Make a Donation</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  titleText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 32,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  subscribeButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  donateButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    width: '100%',
    maxWidth: 400,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center',
  },
  buttonWeb: {
    cursor: 'pointer',
    transition: 'opacity 0.2s ease-in-out',
    ':hover': {
      opacity: 0.8,
    },
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});