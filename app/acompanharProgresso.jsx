import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BarChart, LineChart } from 'react-native-gifted-charts';
import { useAuth } from './AuthContext';
import axios from 'axios';

const { width } = Dimensions.get('window');

const API_BASE_URL = "https://api-neon-2kpd.onrender.com";

export default function AcompanharProgresso() {
  const { usuarioId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [ranking, setRanking] = useState([]);
  const [evolucaoPeso, setEvolucaoPeso] = useState([]);
  const [metasSemanais, setMetasSemanais] = useState([]);

  useEffect(() => {
    if (usuarioId) {
      buscarDadosDoDashboard();
    }
  }, [usuarioId]);

  const buscarDadosDoDashboard = async () => {
    try {
      setLoading(true);
      const [rankingResponse, evolucaoResponse, metasResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/dashboard/ranking`),
        axios.get(`${API_BASE_URL}/dashboard/evolucao-peso/${usuarioId}`),
        axios.get(`${API_BASE_URL}/dashboard/metas/${usuarioId}`)
      ]);
      setRanking(rankingResponse.data);
      setEvolucaoPeso(evolucaoResponse.data.evolucao_peso);
      setMetasSemanais(metasResponse.data.metas);
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error.response?.data || error.message);
      Alert.alert("Erro", "Não foi possível buscar dados do dashboard. Verifique sua conexão ou a API.");
    } finally {
      setLoading(false);
    }
  };

  const evolucaoData = evolucaoPeso.map(item => ({
    value: parseFloat(item.peso),
    label: item.data
  }));

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../assets/images/paredebranca.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Cabeçalho superior */}
          <View style={styles.topo}>
            <TouchableOpacity style={styles.voltar} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#005067" />
              <Text style={styles.txtVoltar}>Voltar</Text>
            </TouchableOpacity>
            <Image
              source={require("../assets/images/logo.png")}
              style={styles.logoSuperior}
            />
          </View>

          <Text style={styles.titulo}>Acompanhar progresso</Text>

          {/* Ranking e Evolução do Peso */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Meu Ranking</Text>
            <View style={styles.rankingContainer}>
              {ranking.length > 0 ? (
                ranking.map((item, index) => (
                  <View key={index} style={styles.rankingItem}>
                    <Text style={styles.rankingPosition}>{index + 1}.</Text>
                    <Image
                      source={require("../assets/images/perfil_teal.png")}
                      style={styles.rankingImage}
                    />
                    <Text style={styles.rankingName}>{item.nome}</Text>
                    <Text style={styles.rankingPoints}>{item.pontos} Pts</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noDataText}>Nenhum dado de ranking disponível.</Text>
              )}
            </View>
          </View>

          {/* Gráfico de Evolução de Peso */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Evolução Peso/IMC</Text>
            {evolucaoPeso.length > 0 ? (
              <BarChart
                data={evolucaoData}
                yAxisLabelSuffix="kg"
                barWidth={22}
                noOfSections={4}
                height={200}
                barBorderRadius={4}
                frontColor="#42B883"
                hideYAxisText={false}
                xAxisColor="#ccc"
                yAxisColor="#ccc"
                textColor="#333"
              />
            ) : (
              <Text style={styles.noDataText}>Nenhum dado de peso disponível.</Text>
            )}
          </View>

          {/* Gráfico de Metas */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Evolução Metas</Text>
            {metasSemanais.length > 0 ? (
              <LineChart
                data={metasSemanais.map(item => ({ value: item.metas_concluidas }))}
                data2={metasSemanais.map(item => ({ value: item.total_metas }))}
                dataPointsColor1="#005067"
                dataPointsColor2="#42B883"
                initialSpacing={30}
                yAxisLabelSuffix="%"
                height={180}
                spacing={70}
                color1="skyblue"
                color2="orange"
                hideDataPoints
                hideRules
              />
            ) : (
              <Text style={styles.noDataText}>Nenhum dado de metas disponível.</Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* TAB BAR */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/alimentacao")}>
          <Image source={require("../assets/images/apple_teal.png")} style={styles.tabIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/homepage")}>
          <Image source={require("../assets/images/home_teal.png")} style={styles.tabIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/exercicios")}>
          <Image source={require("../assets/images/dumbbell_teal.png")} style={styles.tabIcon} />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: width * 0.04,
    paddingVertical: width * 0.02,
    marginBottom: width * 0.04,
  },
  voltar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtVoltar: {
    color: '#005067',
    fontSize: width * 0.04,
    marginLeft: width * 0.01,
  },
  logoSuperior: {
    width: width * 0.25,
    height: width * 0.1,
    resizeMode: 'contain',
  },
  scrollContainer: {
    paddingHorizontal: '7%',
  },
  titulo: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#005067',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#005067',
    marginBottom: 10,
    textAlign: 'center',
  },
  rankingContainer: {
    paddingHorizontal: 10,
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  rankingPosition: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    width: 30,
  },
  rankingImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  rankingName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  rankingPoints: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#005067',
  },
  noDataText: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#888',
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 18,
    color: '#005067',
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: width * 0.18,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingBottom: width * 0.02,
    zIndex: 20,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    width: width * 0.08,
    height: width * 0.08,
    resizeMode: 'contain',
  },
});