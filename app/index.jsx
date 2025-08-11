import React from 'react';
import { TextInput, Checkbox } from "react-native-paper";
import {
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
  Text,
  View,
  Image
} from 'react-native';
import { router } from 'expo-router'; // ✅ Adicionado para navegação

export default function App() {
  return (
    <ImageBackground
      source={require('../assets/images/fundo.png')}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        
        <Image
          source={require('../assets/images/logo-branca.png')}
          style={styles.logo}
        />
        <Text style={styles.slogan}>
          Manter sua vida saúdavel nunca foi tão fácil!
        </Text>
        
        <TouchableOpacity style={styles.botao} onPress={() => router.push('/login')}>
          <Text style={styles.textStyle}>Entrar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.botao} onPress={() => router.push('/cadastro')}>
          <Text style={styles.textStyle}>Cadastra-se</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.botao1} onPress={() => router.push('/homepage')}>
          <Text style={styles.textStyle}>Permanecer desconectado</Text>
        </TouchableOpacity>
        
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 350,
    height: 100,
    marginBottom: 40,
    resizeMode: 'contain',
  },
  textStyle: {
    color: 'white',
    fontSize: 16,
  },
  botao: {
    marginTop: 15,
    height: '5%',
    width: '80%',
    backgroundColor: '#005067',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'white',
  },
  botao1: {
    marginTop: 15,
  },
  slogan: {
    color: "white",
  }
});
