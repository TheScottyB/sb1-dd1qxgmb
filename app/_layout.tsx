import { useEffect } from 'react';
import { Stack, useSegments, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import * as Linking from 'expo-linking';
import { Platform } from 'react-native';

export default function RootLayout() {
  useFrameworkReady();
  const segments = useSegments();

  // Handle deep links including payment returns
  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const url = event.url;
      console.log('Deep link received:', url);
      
      try {
        // Parse the URL
        const parsedUrl = Linking.parse(url);
        console.log('Parsed deep link:', parsedUrl);
        
        // Handle successful payment return
        if (parsedUrl.queryParams && parsedUrl.queryParams.session_id) {
          const sessionId = parsedUrl.queryParams.session_id;
          console.log('Payment session ID:', sessionId);
          
          if (parsedUrl.path?.includes('subscription')) {
            router.replace({
              pathname: '/subscription',
              params: { success: 'true', session_id: sessionId }
            });
          } else if (parsedUrl.path?.includes('donation-success')) {
            router.replace('/donation-success');
          }
        }
        
        // Handle canceled payment
        if (parsedUrl.queryParams && parsedUrl.queryParams.canceled === 'true') {
          console.log('Payment was canceled');
          
          if (parsedUrl.path?.includes('subscription')) {
            router.replace({
              pathname: '/subscription',
              params: { success: 'false' }
            });
          } else {
            router.replace('/');
          }
        }
      } catch (error) {
        console.error('Error handling deep link:', error);
      }
    };

    // Set up the deep link handler
    if (Platform.OS !== 'web') {
      // Listen for incoming links when the app is running
      const subscription = Linking.addEventListener('url', handleDeepLink);
      
      // Handle links that opened the app
      Linking.getInitialURL().then((url) => {
        if (url) {
          handleDeepLink({ url });
        }
      });
      
      return () => {
        // Clean up the event listener
        subscription.remove();
      };
    }
  }, [segments]);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
