import { StyleSheet, Text, View, TouchableOpacity, Platform, Linking, Image, ActivityIndicator, ScrollView, SafeAreaView } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/lib/supabase';
import { products } from '@/src/stripe-config';
import { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

export default function HomeScreen() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is signed in
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUser(data.session.user);
      }
    };
    
    checkUser();
  }, []);

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
    // For production
    return 'https://myapp.example.com'; // Your production URL
  };

  const handleDonate = async () => {
    setError(null);
    setLoading(true);
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
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

      const { url, sessionId } = data;
      
      console.log('Received checkout session data:', { url, sessionId });
      
      if (url) {
        if (Platform.OS === 'web') {
          console.log('Redirecting to Stripe checkout on web:', url);
          window.location.href = url;
        } else {
          console.log('Opening Stripe checkout URL on mobile:', url);
          try {
            await Linking.openURL(url);
          } catch (linkError) {
            console.error('Error opening URL:', linkError);
            setError('Unable to open payment page. Please try again.');
          }
        }
      } else {
        console.error('No checkout URL returned from server');
        setError('Failed to create checkout session. Please try again.');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <LinearGradient
          colors={['#4C669F', '#3B5998', '#192F6A']}
          style={styles.gradient}>
          <View style={styles.header}>
            <Text style={styles.welcomeText}>
              {user ? `Welcome, ${user.email?.split('@')[0]}` : 'Welcome'}
            </Text>
            {!user && (
              <Link href="/login" style={styles.loginLink}>
                <Text style={styles.loginText}>Login</Text>
              </Link>
            )}
          </View>
          
          <View style={styles.content}>
            <Text style={styles.titleText}>Premium App</Text>
            <Text style={styles.subtitle}>
              Unlock amazing features with our subscription
            </Text>
            
            {error && (
              <BlurView intensity={80} tint="light" style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </BlurView>
            )}
            
            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <Text style={styles.featureTitle}>✓ Premium Content</Text>
                <Text style={styles.featureDescription}>Access to exclusive premium content</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureTitle}>✓ No Ads</Text>
                <Text style={styles.featureDescription}>Enjoy an ad-free experience</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureTitle}>✓ Priority Support</Text>
                <Text style={styles.featureDescription}>Get help when you need it</Text>
              </View>
            </View>
            
            <View style={styles.buttonContainer}>
              <Link href="/subscription" onPress={handleSubscribe}>
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
                  web: styles.buttonWeb,
                  default: {}
                }),
                loading && styles.buttonDisabled
              ]}
              onPress={handleDonate}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.buttonText}>Support Us</Text>
              )}
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#192F6A',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    minHeight: Platform.OS === 'web' ? '100%' : undefined,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loginLink: {
    padding: 8,
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 32,
  },
  featuresContainer: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
  },
  featureItem: {
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  buttonContainer: {
    marginBottom: 16,
    width: '100%',
    maxWidth: 280,
  },
  subscribeButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
  },
  donateButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
    maxWidth: 280,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  errorContainer: {
    backgroundColor: 'rgba(254, 226, 226, 0.9)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  buttonWeb: Platform.OS === 'web' ? {
    cursor: 'pointer',
    // Web-specific styles need to be handled differently
    // since React Native StyleSheet doesn't support some web properties
  } : {},
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});