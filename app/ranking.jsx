import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  ImageBackground,
  SafeAreaView
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from './AuthContext'; 

// URL Definida diretamente para evitar erros de importação
const API_URL = "https://api-neon-2kpd.onrender.com";

// Definição das Patentes
const TIERS = [
  { name: 'Diamante', minPoints: 1000, color: '#00bcd4', icon: 'diamond', description: 'A elite suprema.' },
  { name: 'Platina', minPoints: 600, color: '#78909c', icon: 'trophy', description: 'Conquistador nato.' },
  { name: 'Ouro', minPoints: 300, color: '#fbc02d', icon: 'medal', description: 'Mestre da disciplina.' },
  { name: 'Prata', minPoints: 100, color: '#9e9e9e', icon: 'medal-outline', description: 'No caminho certo.' },
  { name: 'Bronze', minPoints: 0, color: '#8d6e63', icon: 'ribbon-outline', description: 'O início da jornada.' },
];

export default function Ranking() {
  const router = useRouter();
  const { usuarioId } = useAuth();
  
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  // useFocusEffect garante que os dados atualizem sempre que você entrar na tela
  useFocusEffect(
    useCallback(() => {
      fetchUserPoints();
    }, [usuarioId])
  );

  const fetchUserPoints = async () => {
    if (!usuarioId) return;
    
    console.log("Buscando pontos para ID:", usuarioId); // Debug

    try {
      const response = await fetch(`${API_URL}/get-points/${usuarioId}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Pontos recebidos:", data.points); // Debug
        setUserPoints(data.points || 0);
      } else {
        console.log("Erro na resposta da API:", response.status);
      }
    } catch (error) {
      console.error("Erro de conexão:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentTierIndex = (points) => {
    // Retorna o índice da primeira patente que tem minPoints <= pontos do usuário
    return TIERS.findIndex(t => points >= t.minPoints);
  };

  const currentTierIndex = getCurrentTierIndex(userPoints);
  const HIGHLIGHT_COLOR = '#005067';

  return (
    <ImageBackground 
      source={require('../assets/images/paredebranca.png')} 
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1 }}>
        
        {/* Header Limpo */}
        <View style={styles.headerSimple}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={32} color={HIGHLIGHT_COLOR} />
          </TouchableOpacity>
          <Text style={[styles.pageTitle, { color: HIGHLIGHT_COLOR }]}>
            Jornada dos Rankings
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={HIGHLIGHT_COLOR} style={styles.loader} />
        ) : (
          <ScrollView 
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={false}
          >
            {/* Resumo de Pontos */}
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryText}>Seus Pontos Atuais</Text>
              <Text style={[styles.pointsLarge, { color: HIGHLIGHT_COLOR }]}>
                {userPoints}
              </Text>
            </View>

            <View style={styles.timelineContainer}>
              {/* Linha Vertical */}
              <View style={styles.timelineLine} />
              
              {TIERS.map((tier, index) => {
                const isActive = index === currentTierIndex; // Onde o usuário está agora
                const isReached = index >= currentTierIndex; // Níveis já conquistados
                const isNextGoal = index === currentTierIndex - 1; // O próximo nível (logo acima)

                // Lógica de Cores
                const cardBorderColor = isActive ? HIGHLIGHT_COLOR : '#ccc';
                const textColor = isActive ? HIGHLIGHT_COLOR : '#555';
                const iconColor = isActive ? HIGHLIGHT_COLOR : (isReached ? tier.color : '#aaa');
                
                return (
                  <View key={tier.name} style={styles.tierRow}>
                    
                    {/* Nó da Linha do Tempo */}
                    <View style={[
                      styles.timelineNode, 
                      isActive && styles.timelineNodeActive,
                      { borderColor: isActive ? HIGHLIGHT_COLOR : '#757575' },
                      isReached ? { backgroundColor: '#fff' } : { backgroundColor: '#e0e0e0' }
                    ]}>
                      <Ionicons name={tier.icon} size={20} color={iconColor} />
                    </View>

                    {/* Card de Informação */}
                    <View style={[
                      styles.tierCard, 
                      isActive && styles.tierCardActive,
                      { borderColor: cardBorderColor }
                    ]}>
                      <View style={styles.tierHeader}>
                        <Text style={[styles.tierName, { color: textColor }]}>
                          {tier.name}
                        </Text>
                        <Text style={[styles.tierPoints, { color: '#757575' }]}>
                          {tier.minPoints}+ pts
                        </Text>
                      </View>
                      
                      <Text style={styles.tierDescription}>{tier.description}</Text>
                      
                      {isActive && (
                        <View style={[styles.currentBadge, { backgroundColor: HIGHLIGHT_COLOR }]}>
                          <Text style={styles.currentBadgeText}>VOCÊ ESTÁ AQUI</Text>
                        </View>
                      )}
                      
                      {isNextGoal && (
                         <Text style={styles.nextGoalText}>
                           Faltam {tier.minPoints - userPoints} pts
                         </Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerSimple: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  backButton: { padding: 5, marginRight: 15 },
  pageTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Black',
    textTransform: 'uppercase',
  },
  loader: { marginTop: 50 },
  scrollContent: { paddingBottom: 40, paddingTop: 10 },
  summaryContainer: { alignItems: 'center', marginVertical: 20 },
  summaryText: {
    color: '#555',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: 'bold',
  },
  pointsLarge: {
    fontSize: 48,
    fontFamily: 'SpaceMono-Regular',
    fontWeight: 'bold',
  },
  timelineContainer: { paddingHorizontal: 20, position: 'relative' },
  timelineLine: {
    position: 'absolute',
    left: 40, 
    top: 20,
    bottom: 50,
    width: 3, 
    backgroundColor: '#757575',
    zIndex: -1,
  },
  tierRow: { flexDirection: 'row', marginBottom: 25, alignItems: 'flex-start' },
  timelineNode: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    borderWidth: 2,
    zIndex: 1,
    elevation: 2,
    backgroundColor: '#fff'
  },
  timelineNodeActive: {
    transform: [{ scale: 1.2 }],
    backgroundColor: '#fff',
    borderWidth: 3,
  },
  tierCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    elevation: 3,
  },
  tierCardActive: {
    backgroundColor: '#fff',
    borderWidth: 2,
    elevation: 6,
  },
  tierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  tierName: { fontSize: 18, fontWeight: 'bold', textTransform: 'uppercase' },
  tierPoints: { fontSize: 12, fontFamily: 'SpaceMono-Regular', fontWeight: 'bold' },
  tierDescription: { color: '#666', fontSize: 12, fontStyle: 'italic' },
  currentBadge: {
    marginTop: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  currentBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  nextGoalText: { marginTop: 8, color: '#555', fontSize: 11, fontWeight: 'bold' },
});