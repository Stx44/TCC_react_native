import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import moment from 'moment';
import 'moment/locale/pt-br';
import { useEffect, useState } from 'react';
import {
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
  View
} from 'react-native';

moment.locale('pt-br');

function nivelIMC(valor) {
  if (!valor) return '';
  const imc = parseFloat(valor);
  if (imc < 18.5) return 'Muito magro';
  if (imc < 25) return 'Normal';
  if (imc < 30) return 'Sobrepeso';
  if (imc < 35) return 'Obesidade I';
  if (imc < 40) return 'Obesidade II';
  return 'Obesidade III';
}

export default function Calendario({ backgroundImage }) {
  const [diasSemana, setDiasSemana] = useState([]);
  const [diaSelecionado, setDiaSelecionado] = useState(moment().format('YYYY-MM-DD'));
  const [eventos, setEventos] = useState({});
  const [novoEvento, setNovoEvento] = useState('');

  // Estados para IMC
  const [altura, setAltura] = useState('');
  const [peso, setPeso] = useState('');
  const [idade, setIdade] = useState('');
  const [imc, setIMC] = useState(null);

  useEffect(() => {
    const inicioSemana = moment().startOf('week').add(1, 'days');
    const dias = [];
    for (let i = 0; i < 7; i++) {
      const dia = moment(inicioSemana).add(i, 'days');
      dias.push({
        label: dia.format('ddd'),
        dataCompleta: dia.format('YYYY-MM-DD'),
        numero: dia.format('D'),
      });
    }
    setDiasSemana(dias);
  }, []);

  useEffect(() => {
    const carregarEventos = async () => {
      const data = await AsyncStorage.getItem('eventosSemana');
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
    await AsyncStorage.setItem('dietaSemana', JSON.stringify(novosEventos));
    setNovoEvento('');
  };

  // Função para calcular IMC
  const calcularIMC = () => {
    if (altura && peso) {
      const valorIMC = (parseFloat(peso) / (parseFloat(altura) * parseFloat(altura))).toFixed(2);
      setIMC(valorIMC);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/paredebranca.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Cabeçalho superior sticky */}
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
      <ScrollView style={styles.scrollContainer} contentContainerStyle={{ paddingTop: 90, paddingBottom: 100 }}>
        {/* Caixa IMC lado a lado */}
        <View style={styles.containerIMC}>
          <View style={styles.inputsIMC}>
            <TextInput
              placeholder='Altura'
              style={styles.inserirTextoIMC}
              keyboardType="numeric"
              value={altura}
              onChangeText={setAltura}
            />
            <TextInput
              placeholder='Peso'
              style={styles.inserirTextoIMC}
              keyboardType="numeric"
              value={peso}
              onChangeText={setPeso}
            />
            <TextInput
              placeholder='Idade'
              style={styles.inserirTextoIMC}
              keyboardType="numeric"
              value={idade}
              onChangeText={setIdade}
            />
            <TouchableOpacity style={styles.botaoCalcularIMC} onPress={calcularIMC}>
              <Text style={styles.textoBotaoIMC}>Calcular IMC</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.resultadoIMC}>
            {imc && (
              <Text style={styles.textoResultadoIMC}>
                Seu IMC: {imc}
              </Text>
            )}
            {imc && (
          <View style={styles.nivelIMCBox}>
            <Text style={styles.nivelIMC}>{nivelIMC(imc)}</Text>
          </View>
        )}
          </View>
          
        </View>
        {/* Quadrado pequeno fora da caixa IMC */}
        

        {/* Cabeçalho semanal */}
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

        {/* Lista de eventos */}
        <View style={styles.eventsContainer}>
          <Text style={styles.title}>
            Eventos de {moment(diaSelecionado).format('dddd, D [de] MMMM')}
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
            style={styles.input}
            placeholder="Novo evento"
            value={novoEvento}
            onChangeText={setNovoEvento}
          />
          <TouchableOpacity style={styles.Button} onPress={salvarEvento}>
            <Text style={styles.textoBtn}>Adicionar Evento</Text>
          </TouchableOpacity>
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
  },
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  voltar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtVoltar: {
    color: '#005067',
    fontSize: 16,
    marginLeft: 5,
  },
  logoSuperior: {
    width: 100,
    height: 40,
    resizeMode: 'contain',
  },
  scrollContainer: {
    flex: 1,
  },
  weekContainer: {
    marginTop: 10,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  dayItem: {
    width: 50,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#eee',
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  daySelected: {
    backgroundColor: '#005067',
  },
  dayLabel: {
    fontSize: 14,
    color: '#333',
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  eventsContainer: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  eventItem: {
    fontSize: 16,
    marginBottom: 5,
  },
  noEvent: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#777',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 5,
    marginVertical: 10,
  },
  Button: {
    backgroundColor: '#005067',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
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
    height: 70,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 10,
    zIndex: 20,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  containerIMC: {
    width: '90%',
    alignSelf: 'center',
    borderColor: "#005067",
    borderWidth: 2,
    borderRadius: 33,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    minHeight: 160,
  },
  inputsIMC: {
    width: '56%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  resultadoIMC: {
    marginTop: 60,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 7,
    borderWidth: 1,
    borderColor: '#005067',
    borderRadius: 10,
  },
  inserirTextoIMC: {
    marginTop: 2,
    color: 'black',
    borderWidth: 1.5,
    borderColor: '#005067',
    borderRadius: 20,
    marginVertical: 10,
    width: '90%',
    textAlign: 'left',
  },
  botaoCalcularIMC: {
    width: '90%',
    backgroundColor: '#005067',
    padding: 10,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 5,
  },
  textoBotaoIMC: {
    color: 'white',
    fontWeight: 'bold',
  },
  textoResultadoIMC: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#005067',
    textAlign: 'center',
  },
  nivelIMCBox: {
    alignSelf: 'center',
    marginTop: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#005067',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 18,
    minWidth: 80,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  nivelIMC: {
    fontSize: 15,
    color: '#005067',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});