import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Platform, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { supabase } from '@/lib/supabase';
import { products } from '@/src/stripe-config';

type SubscriptionStatus = {
  subscription_status: string;
  price_id: string | null;
  current_period_end: number | null;
};

export default function SubscriptionScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);

  const { sandbox } = products;

  const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
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

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
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
    }
  };

  const handleSubscribe = async () => {
    setLoading(true);
    setError(null);

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
        if (typeof window !== 'undefined') {
          window.location.href = url;
        } else {
          Linking.openURL(url);
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

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Subscription Status</Text>

        <View style={styles.planCard}>
          <Text style={styles.planName}>{sandbox.name}</Text>
          <Text style={styles.planDescription}>{sandbox.description}</Text>
          <Text style={styles.planPrice}>{sandbox.price}</Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Current Plan:</Text>
          <Text style={styles.value}>{currentPlan}</Text>

          {isSubscribed && subscription.current_period_end && (
            <>
              <Text style={styles.label}>Renews on:</Text>
              <Text style={styles.value}>
                {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
              </Text>
            </>
          )}
        </View>

        {!isSubscribed && (
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubscribe}
            disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Subscribe Now'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#1A1A1A',
  },
  infoContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    color: '#1A1A1A',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
  },
  planCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  planDescription: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 12,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0EA5E9',
  },
});