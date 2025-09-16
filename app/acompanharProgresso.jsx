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
  ActivityIndicator
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useAuth } from './AuthContext';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/pt-br';

const { width } = Dimensions.get('window');
const API_BASE_URL = "https://api-neon-2kpd.onrender.com";

const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(0, 80, 103, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#005067',
  },
};

export default function AcompanharProgresso() {
  const { usuarioId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [ranking, setRanking] = useState([]);
  const [evolucaoData, setEvolucaoData] = useState({ labels: [], datasets: [{ data: [] }] });
  const [metasData, setMetasData] = useState({ labels: [], datasets: [{ data: [] }] });

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
        // ✅ CHAMADA CORRETA DA URL
        axios.get(`${API_BASE_URL}/dashboard/evolucao-peso/${usuarioId}`),
        axios.get(`${API_BASE_URL}/metas/${usuarioId}`)
      ]);
      
      setRanking(rankingResponse.data || []);
      
      setEvolucaoData(evolucaoResponse.data.evolucao_peso || { labels: [], datasets: [{ data: [] }] });

      const metasBruto = metasResponse.data.metas || [];
      if (metasBruto.length > 0) {
        const metasOrdenadas = [...metasBruto].sort((a, b) => new Date(a.data_agendada) - new Date(b.data_agendada));
        const metasPorSemana = metasOrdenadas.reduce((acc, meta) => {
          const semanaInicio = moment(meta.data_agendada).startOf('week').format('DD/MM');
          if (!acc[semanaInicio]) {
            acc[semanaInicio] = { total: 0, concluidas: 0 };
          }
          acc[semanaInicio].total += 1;
          if (meta.concluido) {
            acc[semanaInicio].concluidas += 1;
          }
          return acc;
        }, {});

        setMetasData({
            labels: Object.keys(metasPorSemana),
            datasets: [{
                data: Object.values(metasPorSemana).map(semana => semana.concluidas)
            }]
        });
      }

    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error.response?.data || error.message);
      Alert.alert("Erro", "Não foi possível buscar dados do dashboard.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#005067" />
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
        <ScrollView contentContainerStyle={styles.scrollContentContainer} showsVerticalScrollIndicator={false}>
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
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Meu Ranking</Text>
            <View style={styles.rankingContainer}>
              {Array.isArray(ranking) && ranking.length > 0 ? (
                ranking.map((item, index) => (
                  <View key={index} style={styles.rankingItem}>
                    <Text style={styles.rankingPosition}>{index + 1}.</Text>
                    <Image source={require("../assets/images/perfil_teal.png")} style={styles.rankingImage}/>
                    <Text style={styles.rankingName}>{item.nome}</Text>
                    <Text style={styles.rankingPoints}>{item.pontos} Pts</Text>
                  </View>
                ))
              ) : <Text style={styles.noDataText}>Nenhum dado de ranking.</Text>}
            </View>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Evolução Peso/IMC</Text>
            {evolucaoData.labels.length > 0 ? (
              <BarChart
                data={evolucaoData}
                width={width * 0.75}
                height={220}
                yAxisLabel=""
                yAxisSuffix="kg"
                chartConfig={chartConfig}
                verticalLabelRotation={30}
                fromZero
              />
            ) : <Text style={styles.noDataText}>Nenhum dado de peso.</Text>}
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Evolução Metas Concluídas</Text>
             {metasData.labels.length > 0 ? (
              <BarChart
                data={metasData}
                width={width * 0.75}
                height={220}
                yAxisLabel=""
                chartConfig={chartConfig}
                verticalLabelRotation={30}
                fromZero
              />
            ) : <Text style={styles.noDataText}>Nenhum dado de metas.</Text>}
          </View>
        </ScrollView>
      </SafeAreaView>
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

// ... SEUS ESTILOS CONTINUAM AQUI ...
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
    scrollContentContainer: {
        paddingHorizontal: '7%',
        flexGrow: 1,
        paddingBottom: 100,
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
        paddingVertical: 20,
        paddingHorizontal: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: width * 0.04,
        fontWeight: 'bold',
        color: '#005067',
        marginBottom: 15,
        textAlign: 'center',
    },
    rankingContainer: {
        paddingHorizontal: 10,
        width: '100%',
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
        marginTop: 10,
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