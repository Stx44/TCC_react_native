import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import moment from 'moment';
import 'moment/locale/pt-br';

moment.locale('pt-br');

const { width } = Dimensions.get('window');

export default function Exercicios() {
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

      {/* Cabeçalho superior */}
      <SafeAreaView style={styles.safeArea}>
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
      </SafeAreaView>

      {/* Conteúdo rolável */}
      <ScrollView style={styles.scrollContainer} contentContainerStyle={{ paddingBottom: width * 0.2 }}>
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
                <Text style={styles.label}>Peso atual</Text>
                <TextInput
                  style={styles.input}
                  value={peso}
                  onChangeText={setPeso}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.label}>Altura atual</Text>
                <TextInput
                  style={styles.input}
                  value={altura}
                  onChangeText={setAltura}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>verificar tabela IMC</Text>
          </TouchableOpacity>
        </View>

        <View>
          <Image
            source={require("../assets/images/divisoriaTabela.png")}
            style={styles.divisoria}
          />
        </View>

        {/* Seção Meu Treino com o calendário completo */}
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
                <Text key={i} style={styles.eventItem}>
                  • {ev}
                </Text>
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: width * 0.04,
    paddingVertical: width * 0.02,
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
    flex: 1,
    paddingHorizontal: '5%',
    paddingTop: width * 0.25,
  },
  sectionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5%',
    paddingTop: 0,
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#005067',
    marginBottom: '2%',
    marginLeft: "10%",
    alignSelf: 'flex-start',
  },
  imcContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: '5%',
  },
  imcBox: {
    borderWidth: 2,
    borderColor: '#005067',
    borderRadius: 15,
    padding: '3%',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%',
    height: '45%',
    marginTop: '07%',
  },
  imcValue: {
    fontSize: width * 0.08,
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
    fontSize: width * 0.035,
    color: '#005067',
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '55%',
    height: '27%',
  },
  infoBox: {
    borderWidth: 2,
    borderColor: '#005067',
    borderRadius: 20,
    padding: '3%',
    marginBottom: '3%',
    alignItems: 'center',
  },
  label: {
    fontSize: width * 0.035,
    color: '#005067',
    fontWeight: '600',
    marginBottom: '2%',
  },
  input: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    width: '100%',
  },
  button: {
    marginTop: '1%',
    backgroundColor: '#005067',
    borderRadius: 20,
    paddingVertical: '3%',
    paddingHorizontal: '6%',
    marginBottom: '5%',
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.04,
    textAlign: 'center',
  },
  divisoria: {
    width: width * 0.8,
    height: 2,
    resizeMode: 'stretch',
    marginVertical: '5%',
    alignSelf: 'center',
  },
  treinoContainer: {
    borderWidth: 2,
    borderColor: '#005067',
    borderRadius: 15,
    padding: '4%',
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
  eventItem: {
    fontSize: width * 0.04,
    marginBottom: '2%',
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