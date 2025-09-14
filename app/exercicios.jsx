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
  FlatList,
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

moment.locale('pt-br');

const { width } = Dimensions.get('window');

const API_BASE_URL = "https://api-neon-2kpd.onrender.com";

export default function Exercicios() {
  const { usuarioId } = useAuth();
  const [peso, setPeso] = useState('85');
  const [altura, setAltura] = useState('1.77');
  const [imc, setImc] = useState(0);
  const [classificacao, setClassificacao] = useState('');
  const [diasSemana, setDiasSemana] = useState([]);
  const [diaSelecionado, setDiaSelecionado] = useState(moment().format('YYYY-MM-DD'));
  const [eventos, setEventos] = useState({});
  const [novoEvento, setNovoEvento] = useState('');

  useEffect(() => {
    calcularIMC();
  }, [peso, altura]);

  useEffect(() => {
    gerarDias();
  }, []);

  useEffect(() => {
    const carregarEventos = async () => {
      const data = await AsyncStorage.getItem('treinosSemana');
      if (data) setEventos(JSON.parse(data));
    };
    carregarEventos();
  }, []);

  const salvarEvento = async () => {
    if (!novoEvento) return;
    const novosEventos = { ...eventos };
    if (!novosEventos[diaSelecionado]) novosEventos[diaSelecionado] = [];
    novosEventos[diaSelecionado].push(novoEvento);
    setEventos(novosEventos);
    await AsyncStorage.setItem('treinosSemana', JSON.stringify(novosEventos));
    setNovoEvento('');
  };

  const marcarComoConcluido = async (eventoParaConcluir) => {
    if (!usuarioId) {
      Alert.alert("Erro", "ID do usuário não encontrado. Tente logar novamente.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/dashboard/exercicio/concluido`, {
        usuario_id: usuarioId,
        nome_exercicio: eventoParaConcluir,
        data: diaSelecionado
      });

      if (response.data.sucesso) {
        const novosEventos = { ...eventos };
        const index = novosEventos[diaSelecionado].indexOf(eventoParaConcluir);
        if (index > -1) {
          novosEventos[diaSelecionado].splice(index, 1);
        }
        setEventos(novosEventos);
        await AsyncStorage.setItem('treinosSemana', JSON.stringify(novosEventos));
        Alert.alert("Sucesso", "Exercício concluído e registrado!");
      } else {
        Alert.alert("Erro", "Não foi possível marcar o exercício como concluído.");
      }
    } catch (error) {
      console.error("Erro ao conectar com a API:", error.response?.data || error.message);
      Alert.alert("Erro", "Não foi possível registrar o evento. Verifique sua conexão ou a API.");
    }
  };

  const calcularIMC = () => {
    const p = parseFloat(peso);
    const a = parseFloat(altura);
    if (p > 0 && a > 0) {
      const imcCalc = p / (a * a);
      setImc(imcCalc.toFixed(1));
      if (imcCalc < 18.5) setClassificacao('Abaixo do peso');
      else if (imcCalc < 25) setClassificacao('Normal');
      else if (imcCalc < 30) setClassificacao('Sobrepeso');
      else if (imcCalc < 35) setClassificacao('Obesidade grau I');
      else if (imcCalc < 40) setClassificacao('Obesidade grau II');
      else setClassificacao('Obesidade grau III');
    }
  };

  const gerarDias = () => {
    const hoje = new Date();
    const lista = [];
    for (let i = 0; i < 7; i++) {
      const data = new Date(hoje);
      data.setDate(hoje.getDate() + i);
      lista.push({
        dataCompleta: data.toISOString().split('T')[0],
        label: data
          .toLocaleDateString("pt-BR", { weekday: "short" })
          .toUpperCase(),
        numero: data.getDate(),
      });
    }
    setDiasSemana(lista);
    setDiaSelecionado(lista[0].dataCompleta);
  };

  return (
    <ImageBackground
      source={require('../assets/images/paredebranca.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={{ paddingBottom: width * 0.35 }}
          showsVerticalScrollIndicator={false}
        >
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

          {/* Seção IMC */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Seu IMC</Text>
            <View style={styles.imcContainer}>
              <View style={styles.imcBox}>
                <Text style={styles.imcValue}>{imc}</Text>
                <View style={styles.imcClassBox}>
                  <Text style={styles.imcClass}>{classificacao}</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <View style={styles.infoBox}>
                  <TextInput
                    style={styles.input}
                    value={peso}
                    onChangeText={setPeso}
                    keyboardType="numeric"
                    placeholder='Peso atual (kg)'
                    placeholderTextColor={"#999"}
                  />
                </View>
                <View style={styles.infoBox}>
                  <TextInput
                    style={styles.input}
                    value={altura}
                    onChangeText={setAltura}
                    keyboardType="numeric"
                    placeholder='Altura (m)'
                    placeholderTextColor={"#999"}
                  />
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>verificar tabela IMC</Text>
            </TouchableOpacity>
          </View>

          {/* Espaço e divisória centralizada */}
          <View style={styles.divisoriaContainer}>
            <Image
              source={require("../assets/images/divisoriaTabela.png")}
              style={styles.divisoria}
            />
          </View>

          {/* Seção Meu Treino */}
          <View style={styles.treinoContainer}>
            <Text style={styles.treinoTitle}>Meu Treino</Text>
            <FlatList
              horizontal
              data={diasSemana}
              keyExtractor={(item) => item.dataCompleta}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.weekContainer}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.dayItem,
                    diaSelecionado === item.dataCompleta && styles.daySelected
                  ]}
                  onPress={() => setDiaSelecionado(item.dataCompleta)}
                >
                  <Text style={[styles.dayLabel, diaSelecionado === item.dataCompleta && { color: '#fff' }]}>
                    {item.label}
                  </Text>
                  <Text style={styles.dayNumber}>{item.numero}</Text>
                </TouchableOpacity>
              )}
            />

            <View style={styles.eventsContainer}>
              <Text style={styles.title}>
                Treinos de {moment(diaSelecionado).format('dddd, D [de] MMMM')}
              </Text>

              {eventos[diaSelecionado]?.length ? (
                eventos[diaSelecionado].map((ev, i) => (
                  <View key={i} style={styles.eventBox}>
                    <Text style={styles.eventText}>{ev}</Text>
                    <TouchableOpacity style={styles.addButton} onPress={() => marcarComoConcluido(ev)}>
                      <Text style={styles.addButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text style={styles.noEvent}>
                  Nenhum evento para este dia
                </Text>
              )}

              <TextInput
                style={styles.inputEvento}
                placeholder="Novo evento"
                value={novoEvento}
                onChangeText={setNovoEvento}
                placeholderTextColor="#999"
              />
              <TouchableOpacity style={styles.Button} onPress={salvarEvento}>
                <Text style={styles.textoBtn}>Adicionar Evento</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

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
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
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
  sectionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4%',
    alignSelf: 'center',
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#005067',
    marginBottom: '1%',
    alignSelf: 'center',
  },
  imcContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: width * 0.4,
    width: '100%',
    marginBottom: '5%',
    padding: '3%',
  },
  imcBox: {
    borderWidth: 2,
    borderColor: '#005067',
    borderRadius: 15,
    padding: '3%',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%',
    height: '49%',
    marginTop: '07%',
  },
  imcValue: {
    fontSize: width * 0.10,
    fontWeight: 'bold',
    color: '#000',
  },
  imcClassBox: {
    borderWidth: 1,
    borderColor: '#005067',
    borderRadius: 10,
    marginTop: '2%',
    width: '100%',
    textAlign: 'center',
    paddingVertical: '1%',
  },
  imcClass: {
    fontSize: width * 0.025,
    color: '#005067',
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '55%',
    height: '45%',
  },
  infoBox: {
    borderWidth: 2,
    borderColor: '#005067',
    borderRadius: 25,
    padding: '1%',
    marginBottom: '1%',
    alignItems: 'center',
    marginTop: '10%',
  },
  input: {
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    width: '100%',
    fontSize: width * 0.04,
  },
  button: {
    backgroundColor: '#005067',
    borderRadius: 20,
    paddingVertical: '3%',
    paddingHorizontal: '6%',
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.04,
    textAlign: 'center',
  },
  divisoriaContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: width * 0.16,
  },
  divisoria: {
    width: width * 0.8,
    height: 2,
    resizeMode: 'stretch',
    alignSelf: 'center',
  },
  treinoContainer: {
    borderWidth: 2,
    borderColor: '#005067',
    borderRadius: 15,
    padding: '4%',
    marginTop: 0,
    marginBottom: '5%',
  },
  treinoTitle: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#005067',
    marginBottom: '3%',
    textAlign: 'center',
  },
  weekContainer: {
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  dayItem: {
    width: width * 0.15,
    height: width * 0.18,
    borderRadius: 10,
    backgroundColor: '#eee',
    marginHorizontal: width * 0.01,
    justifyContent: 'center',
    alignItems: 'center',
  },
  daySelected: {
    backgroundColor: '#005067',
  },
  dayLabel: {
    fontSize: width * 0.035,
    color: '#333',
  },
  dayNumber: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#000',
  },
  eventsContainer: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#005067',
    marginBottom: '3%',
  },
  eventBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  eventText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#005067',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  noEvent: {
    fontSize: width * 0.035,
    fontStyle: 'italic',
    color: '#777',
  },
  inputEvento: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: '3%',
    borderRadius: 5,
    marginVertical: '3%',
  },
  Button: {
    backgroundColor: '#005067',
    padding: '3%',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: '5%',
  },
  textoBtn: {
    color: 'white',
    fontWeight: 'bold',
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