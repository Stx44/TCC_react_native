import { FontAwesome5 } from '@expo/vector-icons';
import { Tabs, router } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// --- Constantes de Configuração ---
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
const NUM_TABS = TABS.length;
const TAB_BAR_WIDTH = width * 0.85;
const TAB_WIDTH = TAB_BAR_WIDTH / NUM_TABS;
const TAB_HEIGHT = 65;

// --- Componente da TabBar Customizada ---
const CustomTabBar = ({ state }) => {
  if (!state) return null;
  const activeIndex = state.index;
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      styles.tabBarContainer,
      { bottom: insets.bottom > 0 ? insets.bottom + 5 : 20 }
    ]}>
      {TABS.map((tab, index) => {
        return (
          <TabItem
            key={tab.name}
            icon={tab.icon}
            isActive={activeIndex === index}
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

// --- Componente de cada Ícone da TabBar ---
const TabItem = ({ icon, isActive, onPress }) => {
    const yOffset = useSharedValue(0);

    React.useEffect(() => {
        // ✅ Ajuste aqui: o ícone agora sobe -10 (menos) para não escapar da pílula
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

// --- Componente Principal do Layout ---
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="alimentacao" />
      <Tabs.Screen name="index" />
      <Tabs.Screen name="exercicios" />
    </Tabs>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  tabBarContainer: {
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
  },
  tabItem: {
    flex: 1, 
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});