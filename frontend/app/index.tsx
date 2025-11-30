import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ImageBackground,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={{ uri: 'https://img.freepik.com/premium-photo/osteoporosis-low-vitamin-d-estrogen-weaken-bones-leading-fractures-concept-osteoporosis-vitamin-d-deficiency-estrogen-weak-bones-fractures_918839-191415.jpg?semt=ais_hybrid&w=740&q=80' }}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      {/* Semi-transparent overlay */}
      <View style={styles.overlay} />
      
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        
        <View style={styles.content}>
          {/* Logo/Icon */}
          <View style={styles.logoContainer}>
            <MaterialCommunityIcons name="hospital-building" size={100} color="#fff" />
          </View>

          {/* App Name */}
          <Text style={styles.appName}>Dr Ahmed Nabil Clinic</Text>
          <Text style={styles.tagline}>Orthopedics Specialist</Text>

          {/* Welcome Text */}
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>Welcome!</Text>
            <Text style={styles.welcomeSubtitle}>
              Manage your appointments and access your health records
            </Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.loginButtonText}>Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => router.push('/Signup')}
            >
              <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <Text style={styles.footer}>
            By continuing, you agree to our Terms & Privacy Policy
          </Text>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay for better text visibility
  },
  container: {
    flex: 1,
    // REMOVED: backgroundColor: '#fff', ← This was blocking the image!
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    marginBottom: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff', // Changed to white
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  tagline: {
    fontSize: 16,
    color: '#fff', // Changed to white
    marginBottom: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff', // Changed to white
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#fff', // Changed to white
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 450,      // match the form width used in login / signup screens
    alignSelf: 'center',// center the buttons horizontally
    gap: 16,
  },
  loginButton: {
   backgroundColor: 'rgba(255, 255, 255, 0.2)', 
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    width: '100%',
    borderColor: '#fff',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  registerButton: {
   backgroundColor: 'rgba(255, 255, 255, 0.2)', // Transparent white
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    width: '100%',
    borderColor: '#fff',
  },
  registerButtonText: {
    color: '#ffffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    fontSize: 12,
    color: '#fff', // Changed to white
    textAlign: 'center',
    marginTop: 40,
    paddingHorizontal: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});