import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Platform, Linking, ActivityIndicator, SafeAreaView, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Constants from 'expo-constants';
import { supabase } from '@/lib/supabase';
import { products } from '@/src/stripe-config';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

type SubscriptionStatus = {
  subscription_status: string;
  price_id: string | null;
  current_period_end: number | null;
};

export default function SubscriptionScreen() {
  const router = useRouter();
  const { success } = useLocalSearchParams<{ success?: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { sandbox } = products;

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

  useEffect(() => {
    if (success === 'true') {
      setSuccessMessage('Your subscription was successfully activated!');
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } else if (success === 'false') {
      setError('The subscription process was cancelled.');
    }
    
    fetchSubscription();
  }, [success]);

  const fetchSubscription = async () => {
    setLoadingInfo(true);
    try {
      const { data, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('subscription_status, price_id, current_period_end')
        .maybeSingle();

      if (error) {
        throw error;
      }

      setSubscription(data);
    } catch (err) {
      console.error('Error fetching subscription:', err);
      setError('Failed to load subscription status');
    } finally {
      setLoadingInfo(false);
    }
  };

  const handleSubscribe = async () => {
    setLoading(true);
    setError(null);
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    try {
      const { data: session } = await supabase.auth.getSession();

      if (!session?.session?.access_token) {
        router.push('/login');
        return;
      }

      const baseUrl = getBaseUrl();
      const response = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.session.access_token}`,
        },
        body: JSON.stringify({
          price_id: sandbox.priceId,
          success_url: `${baseUrl}/subscription?success=true`,
          cancel_url: `${baseUrl}/subscription?success=false`,
          mode: sandbox.mode,
        }),
      });

      const { error: stripeError, url } = await response.json();

      if (stripeError) {
        throw new Error(stripeError);
      }

      if (url) {
        if (Platform.OS === 'web') {
          window.location.href = url;
        } else {
          await Linking.openURL(url);
        }
      }
    } catch (err) {
      console.error('Error creating checkout session:', err);
      setError('Failed to start checkout process');
    } finally {
      setLoading(false);
    }
  };

  const isSubscribed = subscription?.subscription_status === 'active';
  const currentPlan = isSubscribed ? sandbox.name : 'No active subscription';
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <LinearGradient
            colors={['#ffffff', '#f5f7fa']}
            style={styles.gradientBackground}>
            <View style={styles.cardHeader}>
              <Text style={styles.title}>Your Subscription</Text>
            </View>
            
            {loadingInfo ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading subscription information...</Text>
              </View>
            ) : (
              <>
                {successMessage && (
                  <View style={styles.successContainer}>
                    <Text style={styles.successText}>{successMessage}</Text>
                  </View>
                )}
                
                {error && (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                )}
                
                <View style={styles.planCard}>
                  <View style={styles.planHeaderContainer}>
                    <Text style={styles.planName}>{sandbox.name}</Text>
                    <View style={styles.priceBadge}>
                      <Text style={styles.priceBadgeText}>{sandbox.price}</Text>
                    </View>
                  </View>
                  <Text style={styles.planDescription}>{sandbox.description}</Text>
                  
                  <View style={styles.benefitsList}>
                    <View style={styles.benefitItem}>
                      <Text style={styles.benefitCheck}>✓</Text>
                      <Text style={styles.benefitText}>Premium Content Access</Text>
                    </View>
                    <View style={styles.benefitItem}>
                      <Text style={styles.benefitCheck}>✓</Text>
                      <Text style={styles.benefitText}>Ad-Free Experience</Text>
                    </View>
                    <View style={styles.benefitItem}>
                      <Text style={styles.benefitCheck}>✓</Text>
                      <Text style={styles.benefitText}>Priority Support</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.statusCard}>
                  <Text style={styles.statusTitle}>Subscription Status</Text>
                  
                  <View style={styles.infoItem}>
                    <Text style={styles.label}>Current Plan:</Text>
                    <Text style={styles.value}>
                      {isSubscribed ? (
                        <Text style={styles.activeStatus}>{currentPlan}</Text>
                      ) : (
                        <Text style={styles.inactiveStatus}>No active subscription</Text>
                      )}
                    </Text>
                  </View>

                  {isSubscribed && subscription?.current_period_end && (
                    <View style={styles.infoItem}>
                      <Text style={styles.label}>Renews on:</Text>
                      <Text style={styles.value}>
                        {formatDate(subscription.current_period_end)}
                      </Text>
                    </View>
                  )}
                </View>

                {!isSubscribed && (
                  <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleSubscribe}
                    disabled={loading}>
                    {loading ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <Text style={styles.buttonText}>Subscribe Now</Text>
                    )}
                  </TouchableOpacity>
                )}
              </>
            )}
          </LinearGradient>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  gradientBackground: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  cardHeader: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
  },
  successContainer: {
    backgroundColor: '#DCFCE7',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#6EE7B7',
  },
  successText: {
    color: '#166534',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  planCard: {
    margin: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#64748B',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  planHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceBadge: {
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  priceBadgeText: {
    color: '#1E40AF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  benefitsList: {
    marginTop: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitCheck: {
    color: '#10B981',
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 8,
  },
  benefitText: {
    fontSize: 16,
    color: '#1F2937',
  },
  statusCard: {
    margin: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  infoItem: {
    marginBottom: 16,
  },
  infoContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 6,
  },
  value: {
    fontSize: 18,
    color: '#1F2937',
  },
  activeStatus: {
    fontWeight: '600',
    color: '#059669',
  },
  inactiveStatus: {
    fontWeight: '500',
    color: '#9CA3AF',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 14,
    paddingVertical: 16,
    margin: 16,
    marginTop: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  planName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  planDescription: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 4,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0EA5E9',
    marginTop: 12,
  },
});