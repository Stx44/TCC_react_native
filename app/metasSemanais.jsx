import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';
import moment from 'moment';
import 'moment/locale/pt-br';
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
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from './AuthContext';

const { width } = Dimensions.get('window');
const API_BASE_URL = "https://api-neon-2kpd.onrender.com";

export default function MetasSemanais() {
  const [metas, setMetas] = useState({});
  const [progresso, setProgresso] = useState({});
  const [novaMeta, setNovaMeta] = useState('');
  const [mesSelecionado, setMesSelecionado] = useState(moment().format('YYYY-MM'));
  const [semanasDoMes, setSemanasDoMes] = useState([]);
  const [semanaSelecionada, setSemanaSelecionada] = useState(moment().startOf('week').format('YYYY-MM-DD'));
  const { usuarioId } = useAuth();

  const carregarMetasDoBackend = async () => {
    if (!usuarioId) {
      console.log("ID do usuário não disponível.");
      return;
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/metas/${usuarioId}`);
      const metasDoBackend = response.data.metas;
      const metasFormatadas = {};
      
      metasDoBackend.forEach(item => {
        const data_semana = moment(item.data_agendada).startOf('week').format('YYYY-MM-DD');
        if (!metasFormatadas[data_semana]) {
          metasFormatadas[data_semana] = [];
        }
        // ✅ Mantemos todas as metas no estado inicial para outros cálculos, se necessário
        metasFormatadas[data_semana].push({
          id: item.id,
          descricao: item.descricao,
          concluido: item.concluido,
          data_agendada: item.data_agendada,
        });
      });
      setMetas(metasFormatadas);
    } catch (error) {
      console.error("Erro ao carregar metas do backend:", error.response?.data || error.message);
      Alert.alert("Erro", "Não foi possível carregar suas metas.");
    }
  };

  useEffect(() => {
    if (usuarioId) {
      carregarMetasDoBackend();
    }
  }, [usuarioId]);

  useEffect(() => {
    gerarSemanasDoMes(mesSelecionado);
  }, [mesSelecionado]);

  const gerarMeses = () => {
    const meses = [];
    let data = moment().startOf('month').subtract(1, 'month');
    for (let i = 0; i < 3; i++) {
      meses.push({
        label: data.format('MMM').toUpperCase(),
        dataCompleta: data.format('YYYY-MM'),
      });
      data = data.add(1, 'month');
    }
    return meses;
  };

  const gerarSemanasDoMes = (mes) => {
    const startOfMonth = moment(mes).startOf('month');
    const endOfMonth = moment(mes).endOf('month');
    const semanas = [];
    let currentWeekStart = moment(startOfMonth).startOf('week');
    while (currentWeekStart.isSameOrBefore(endOfMonth)) {
      const weekDates = [];
      for (let i = 0; i < 7; i++) {
        const day = moment(currentWeekStart).add(i, 'days');
        if (day.isSame(mes, 'month')) {
          weekDates.push(day);
        }
      }
      if (weekDates.length > 0) {
        semanas.push({
          label: `${weekDates[0].format('D')}-${weekDates[weekDates.length - 1].format('D')}`,
          dataInicio: weekDates[0].format('YYYY-MM-DD'),
          dataFim: weekDates[weekDates.length - 1].format('YYYY-MM-DD'),
        });
      }
      currentWeekStart.add(1, 'week');
    }
    setSemanasDoMes(semanas);
  };

  const salvarMeta = async () => {
    if (!novaMeta.trim()) {
      return Alert.alert("Atenção", "Por favor, digite sua meta.");
    }
    if (usuarioId) {
      try {
        const response = await axios.post(`${API_BASE_URL}/metas`, {
          usuario_id: usuarioId,
          descricao: novaMeta,
          data_agendada: semanaSelecionada,
        });
        // Após salvar, recarrega as metas para garantir que a lista está atualizada
        await carregarMetasDoBackend();
        setNovaMeta('');
        Alert.alert("Sucesso", "Meta salva com sucesso!");
      } catch (error) {
        console.error("Erro ao salvar meta na API:", error.response?.data || error.message);
        Alert.alert("Erro", "Não foi possível salvar a meta na API.");
      }
    } else {
      Alert.alert("Atenção", "Usuário não identificado. Faça login novamente.");
    }
  };

  const marcarMetaComoConcluida = async (metaId) => {
    try {
      await axios.put(`${API_BASE_URL}/metas/${metaId}`);
      // Após marcar como concluída, simplesmente recarregamos os dados do backend.
      // A lista será atualizada automaticamente por causa do filtro que adicionamos.
      await carregarMetasDoBackend();
      Alert.alert("Sucesso", "Meta marcada como concluída!");
    } catch (error) {
      console.error("Erro ao marcar meta como concluída na API:", error.response?.data || error.message);
      Alert.alert("Erro", "Não foi possível marcar a meta como concluída.");
    }
  };

  const getWeekRange = (date) => {
    const start = moment(date).startOf('week');
    const end = moment(date).endOf('week');
    return `${start.format('D [de] MMM')} - ${end.format('D [de] MMM')}`;
  };

  // 🟢 CORREÇÃO APLICADA AQUI 🟢
  // Criamos uma nova variável que contém apenas as metas pendentes da semana selecionada
  const metasPendentes = (metas[semanaSelecionada] || []).filter(meta => !meta.concluido);

  return (
    <ImageBackground
      source={require('../assets/images/paredebranca.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={{ paddingBottom: width * 0.35 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#005067" />
              <Text style={styles.backButtonText}>Voltar</Text>
            </TouchableOpacity>
            <Image
              source={require("../assets/images/logo.png")}
              style={styles.logo}
            />
          </View>
          <Text style={styles.title}>Metas Semanais</Text>
          <View style={styles.mainContent}>
            <View style={styles.monthSelector}>
              {gerarMeses().map((mes, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.monthItem,
                    mesSelecionado === mes.dataCompleta && styles.monthItemSelected,
                  ]}
                  onPress={() => {
                    setMesSelecionado(mes.dataCompleta);
                    setSemanaSelecionada(moment(mes.dataCompleta).startOf('month').startOf('week').format('YYYY-MM-DD'));
                  }}
                >
                  <Text style={[styles.monthText, mesSelecionado === mes.dataCompleta && styles.monthTextSelected]}>
                    {mes.label}
                  </Text>
                  <Text style={[styles.yearText, mesSelecionado === mes.dataCompleta && styles.yearTextSelected]}>
                    {moment(mes.dataCompleta).format('YYYY')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.weekSelectorContainer}
            >
              {semanasDoMes.map((semana, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.weekItem,
                    semanaSelecionada === semana.dataInicio && styles.weekItemSelected,
                  ]}
                  onPress={() => setSemanaSelecionada(semana.dataInicio)}
                >
                  <Text style={[styles.weekText, semanaSelecionada === semana.dataInicio && styles.weekTextSelected]}>
                    {semana.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.metaCard}>
              <Text style={styles.metaCardTitle}>Metas para a semana:</Text>
              <Text style={styles.metaCardSubtitle}>{getWeekRange(semanaSelecionada)}</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Beber 2L de água"
                  value={novaMeta}
                  onChangeText={setNovaMeta}
                />
                <TouchableOpacity style={styles.saveButton} onPress={salvarMeta}>
                  <Text style={styles.saveButtonText}>Salvar</Text>
                </TouchableOpacity>
              </View>

              {/* 🟢 CORREÇÃO APLICADA AQUI 🟢 */}
              {/* Agora, o map percorre a lista de metas JÁ FILTRADA */}
              {metasPendentes.length > 0 ? (
                metasPendentes.map((meta) => (
                  <View key={meta.id} style={styles.metaItem}>
                    <Text style={styles.metaText}>{meta.descricao}</Text>
                    <TouchableOpacity
                      style={styles.completeButton}
                      onPress={() => marcarMetaComoConcluida(meta.id)}
                    >
                      <Ionicons name="add" size={20} color="#005067" />
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text style={styles.noMetaText}>Nenhuma meta definida para esta semana.</Text>
              )}
            </View>
          </View>
        </ScrollView>
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
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: '7%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: width * 0.04,
    paddingVertical: width * 0.02,
    marginBottom: width * 0.04,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#005067',
    fontSize: width * 0.04,
    marginLeft: width * 0.01,
  },
  logo: {
    width: width * 0.25,
    height: width * 0.1,
    resizeMode: 'contain',
  },
  mainContent: {
    alignItems: 'center',
    padding: '4%',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#005067',
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#005067',
    marginBottom: 20,
    marginTop: 10,
    alignSelf: 'center',
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  monthItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#005067',
    borderRadius: 15,
  },
  monthItemSelected: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#005067',
  },
  monthText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.04,
  },
  monthTextSelected: {
    color: '#005067',
  },
  yearText: {
    color: '#fff',
    fontSize: width * 0.03,
  },
  yearTextSelected: {
    color: '#005067',
  },
  weekSelectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  weekItem: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#005067',
    borderRadius: 15,
    marginRight: 10,
  },
  weekItemSelected: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#005067',
  },
  weekText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.035,
  },
  weekTextSelected: {
    color: '#005067',
  },
  metaCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#005067',
  },
  metaCardTitle: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#005067',
    marginBottom: 5,
  },
  metaCardSubtitle: {
    fontSize: width * 0.04,
    color: '#555',
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#e6f2f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  saveButton: {
    backgroundColor: '#005067',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  metaItem: {
    backgroundColor: '#e6f2f5',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  metaTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  noMetaText: {
    fontStyle: 'italic',
    color: '#777',
    textAlign: 'center',
    marginTop: 10,
  },
  completeButton: {
    backgroundColor: '#fff',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#005067',
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