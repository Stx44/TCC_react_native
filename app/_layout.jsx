import React, { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet, Platform, Alert } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { toastConfig } from './toastConfig';
import { setCustomText } from 'react-native-global-props';
import { AuthProvider } from './AuthContext';

// 1. Importar Notifications
import * as Notifications from 'expo-notifications';

// 2. Configurar o Handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    Poppins: require('../assets/fonts/Poppins-Black.ttf'),
  });

  useEffect(() => {
    async function configureNotifications() {
      // Configuração para Android (Canal de Notificação)
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      // Solicitar Permissões
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert('Permissão necessária', 'Ative as notificações nas configurações para receber lembretes.');
        return;
      }
    }

    configureNotifications();

    // Listener de Resposta (Clique na notificação)
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      // O setTimeout ajuda a garantir que a navegação esteja pronta
      setTimeout(() => {
        router.push('/notic');
      }, 500);
    });

    return () => {
      // 🚨 CORREÇÃO DO BUG AQUI 🚨
      // Antes: Notifications.removeNotificationSubscription(responseListener);
      // Agora: Usamos .remove() diretamente no objeto listener
      if (responseListener && responseListener.remove) {
        responseListener.remove();
      }
    };
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  setCustomText({
    style: { fontFamily: 'Poppins' },
  });

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <Toast config={toastConfig} position="top" />
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