import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';

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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
    // ⚠️ Envolva o ThemeProvider e a navegação com o AuthProvider
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </ThemeProvider>
    </AuthProvider>
  );
}