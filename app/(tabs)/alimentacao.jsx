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

export default function Alimentacao() {
  const [diasSemana, setDiasSemana] = useState([]);
  const [diaSelecionado, setDiaSelecionado] = useState(moment().format('YYYY-MM-DD'));
  const [eventos, setEventos] = useState({});
  const [novoEvento, setNovoEvento] = useState('');

  useEffect(() => {
    const inicioSemana = moment().startOf('week');
    const dias = [];
    for (let i = 0; i < 7; i++) {
      const dia = moment(inicioSemana).add(i, 'days');
      dias.push({
        label: dia.format('ddd').toUpperCase(),
        dataCompleta: dia.format('YYYY-MM-DD'),
        numero: dia.format('D'),
      });
    }
    setDiasSemana(dias);
  }, []);

  useEffect(() => {
    const carregarEventos = async () => {
      const data = await AsyncStorage.getItem('alimentacaoSemana');
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
    await AsyncStorage.setItem('alimentacaoSemana', JSON.stringify(novosEventos));
    setNovoEvento('');
  };

  return (
    <ImageBackground
      source={require('../../assets/images/paredebranca.png')} // ⚠️ CORREÇÃO
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topo}>
          <TouchableOpacity style={styles.voltar} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#005067" />
            <Text style={styles.txtVoltar}>Voltar</Text>
          </TouchableOpacity>
          <Image
            source={require("../../assets/images/logo.png")} // ⚠️ CORREÇÃO
            style={styles.logoSuperior}
          />
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={{ paddingTop: 90, paddingBottom: 100 }}>

        <View style={styles.treinoContainer}>
          <Text style={styles.treinoTitle}>Meu Calendário de Alimentação</Text>
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
                <Text style={[styles.dayNumber, diaSelecionado === item.dataCompleta && { color: '#fff' }]}>
                  {item.numero}
                </Text>
              </TouchableOpacity>
            )}
          />
          <View style={styles.eventsContainer}>
            <Text style={styles.title}>
              Eventos de {moment(diaSelecionado).format('dddd, D [de] MMMM')}
            </Text>
            {eventos[diaSelecionado]?.length ? (
              eventos[diaSelecionado].map((ev, i) => (
                <View key={i} style={styles.eventBox}>
                  <Text style={styles.eventText}>{ev}</Text>
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
  treinoContainer: {
    borderWidth: 2,
    borderColor: '#005067',
    borderRadius: 15,
    padding: '4%',
    marginTop: 100,
    marginBottom: '5%',
    width: '90%',
    alignSelf: 'center',
  },
  treinoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#005067',
    marginBottom: '3%',
    textAlign: 'center',
  },
  weekContainer: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignSelf: 'center',
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
    color: '#000',
  },
  eventsContainer: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 18,
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
  noEvent: {
    fontSize: 14,
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
});