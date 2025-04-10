import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Flower } from '@/src/components/Flower';

export default function DonationSuccessScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#FFEBCD', '#FFF8E1']}
        style={styles.background}
      />
      
      {/* Celebration flowers */}
      <View style={styles.celebrationFlowers}>
        <Flower type="sunflower" size={80} position={{ x: 50, y: 150 }} />
        <Flower type="rose" size={70} position={{ x: 150, y: 80 }} />
        <Flower type="daisy" size={65} position={{ x: 280, y: 120 }} />
        <Flower type="tulip" size={60} position={{ x: 330, y: 200 }} />
        <Flower type="rose" size={55} position={{ x: 70, y: 250 }} />
        <Flower type="daisy" size={50} position={{ x: 200, y: 270 }} />
      </View>
      
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Flower type="sunflower" size={80} />
          </View>
          
          <Text style={styles.title}>Thank You! 🎉</Text>
          <Text style={styles.message}>
            Your donation has been successfully processed. We truly appreciate your support!
          </Text>
          <Text style={styles.subMessage}>
            More beautiful flowers will bloom in the sandbox thanks to your generosity.
          </Text>
          
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/')}>
            <Text style={styles.buttonText}>Return to Sandbox</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFEBCD',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  celebrationFlowers: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    zIndex: 2,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 18,
    color: '#555555',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 26,
  },
  subMessage: {
    fontSize: 16,
    color: '#777777',
    textAlign: 'center',
    marginBottom: 28,
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 14,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});