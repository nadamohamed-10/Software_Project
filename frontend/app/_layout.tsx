import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-reanimated';
import { AuthProvider } from '../context/AuthContext'; // added import

export default function RootLayout() {
  return (
    <>
      <AuthProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="Signup" options={{ headerShown: false }} />

          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
      </AuthProvider>
      <StatusBar style="auto" />
    </>
  );
}
