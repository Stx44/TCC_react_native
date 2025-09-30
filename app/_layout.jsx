// RootLayout.jsx

import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

// ⬇ Importa o Toast e a configuração customizada
import Toast from 'react-native-toast-message';
import { toastConfig } from './toastConfig';

// ⬇ Este import garante que possamos aplicar o estilo global
import { setCustomText } from 'react-native-global-props';

// ⚠️ Importe o AuthProvider que você acabou de criar
import { AuthProvider } from './AuthContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    Poppins: require('../assets/fonts/Poppins-Black.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // ⬇ Aplica a fonte global para todos os <Text>
  setCustomText({
    style: {
      fontFamily: 'Poppins',
    },
  });

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        
        {/* 🚨 Adiciona o componente Toast com a configuração de pílula 🚨 */}
        <Toast 
          config={toastConfig}
          position="top" // Toasts geralmente ficam melhor no topo
        />
        
      </ThemeProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    }
});