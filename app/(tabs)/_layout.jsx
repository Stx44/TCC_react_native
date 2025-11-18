import { FontAwesome5 } from '@expo/vector-icons';
import { Tabs, router } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../AuthContext'; 

// --- Constantes ---
const ACTIVE_COLOR = '#005067';
const INACTIVE_COLOR = '#b0b0b0';
const BORDER_COLOR = '#EAEAEA';
const BORDER_WIDTH = 1.5;

const TABS = [
  { name: 'alimentacao', icon: 'apple-alt' },
  { name: 'index', icon: 'home' },
  { name: 'exercicios', icon: 'dumbbell' },
];

const { width } = Dimensions.get('window');
const TAB_BAR_WIDTH = width * 0.85;
const TAB_HEIGHT = 65;

// --- HEADER CUSTOMIZADO ---
const CustomHeader = () => {
  const insets = useSafeAreaInsets();
  const { perfilImage } = useAuth(); 
  const topOffset = insets.top > 0 ? insets.top + 5 : 20;

  return (
    <View style={[headerStyles.container, { top: topOffset }]}>
      <Image
        source={require("../../assets/images/logo.png")}
        style={headerStyles.logo}
      />
      <TouchableOpacity onPress={() => router.push("/perfil")}>
        <Image
          source={
            perfilImage 
              ? { uri: perfilImage } 
              : require("../../assets/images/perfil_teal.png")
          }
          style={headerStyles.profile}
        />
      </TouchableOpacity>
    </View>
  );
};

// --- TAB BAR CUSTOMIZADA (PÍLULA) ---
const CustomTabBar = ({ state }) => {
  if (!state) return null;
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      styles.tabBarContainer,
      { bottom: insets.bottom > 0 ? insets.bottom + 5 : 20 }
    ]}>
      {TABS.map((tab, index) => {
        // Lógica simplificada para verificar ativo
        // Verifica se a rota atual (state.routes[state.index]) tem o mesmo nome da aba
        const isFocused = state.routes[state.index].name === tab.name;

        return (
          <TabItem
            key={tab.name}
            icon={tab.icon}
            isActive={isFocused}
            onPress={() => {
              const route = tab.name === 'index' ? '/(tabs)/' : `/(tabs)/${tab.name}`;
              router.navigate(route);
            }}
          />
        );
      })}
    </View>
  );
};

// --- ÍCONE DA TAB ---
const TabItem = ({ icon, isActive, onPress }) => {
    const yOffset = useSharedValue(0);

    React.useEffect(() => {
        yOffset.value = withSpring(isActive ? -10 : 0, { 
          damping: 15,
          stiffness: 150,
        });
    }, [isActive]);

    const animatedIconStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: yOffset.value }]
        }
    });

    return (
        <TouchableOpacity onPress={onPress} style={styles.tabItem}>
            <Animated.View style={animatedIconStyle}>
                <FontAwesome5
                    name={icon}
                    size={24}
                    color={isActive ? ACTIVE_COLOR : INACTIVE_COLOR}
                />
            </Animated.View>
        </TouchableOpacity>
    );
}

// --- LAYOUT PRINCIPAL ---
export default function TabsLayout() {
  return (
    <Tabs
      // 🚨 CORREÇÃO: tabBar deve ficar AQUI, fora de screenOptions
      tabBar={(props) => <CustomTabBar {...props} />}
      
      screenOptions={{ 
        headerShown: true,
        headerTransparent: true,
        header: () => <CustomHeader />, 
      }}
    >
      {/* Telas Visíveis */}
      <Tabs.Screen name="alimentacao" />
      <Tabs.Screen name="index" />
      <Tabs.Screen name="exercicios" />

      {/* Telas Ocultas (href: null) */}
      <Tabs.Screen name="acompanharProgresso" options={{ href: null }} />
      <Tabs.Screen name="calendario" options={{ href: null }} />
      <Tabs.Screen name="metasSemanais" options={{ href: null }} />
    </Tabs>
  );
}

// --- ESTILOS TAB BAR (PÍLULA ORIGINAL) ---
const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    left: (width - TAB_BAR_WIDTH) / 2,
    width: TAB_BAR_WIDTH,
    height: TAB_HEIGHT,
    flexDirection: 'row', 
    backgroundColor: '#FFFFFF',
    borderRadius: TAB_HEIGHT / 2, // Faz a pílula
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_COLOR,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  tabItem: {
    flex: 1, 
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// --- ESTILOS HEADER ---
const headerStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: (width - TAB_BAR_WIDTH) / 2,
    width: TAB_BAR_WIDTH,
    height: TAB_HEIGHT,
    flexDirection: 'row', 
    backgroundColor: '#FFFFFF',
    borderRadius: TAB_HEIGHT / 2, 
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_COLOR,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  profile: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    resizeMode: 'cover',
  }
});