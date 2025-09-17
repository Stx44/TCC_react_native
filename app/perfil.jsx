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

export default function Perfil() {

    return (
        <ImageBackground
            source={require("../assets/images/paredebranca.png")}
            style={styles.background}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.topo}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#005067" />
                    </TouchableOpacity>
                    <Text style={styles.welcomeText}>Olá Usuario</Text>
                </View>

                <View style={styles.botoes}>
                    <TouchableOpacity style={styles.botaoMetas}>
                        <Image
                          source={require("../assets/images/target.png")}
                          style={styles.icone}
                        />
                        <View style={styles.textos}>
                          <Text style={styles.titulo}>Dados da conta</Text>
                          <Text style={styles.descricao}>minhas informações da conta</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.botaoMetas}>
                        <Image
                          source={require("../assets/images/target.png")}
                          style={styles.icone}
                        />
                        <View style={styles.textos}>
                          <Text style={styles.titulo}>Notificações</Text>
                          <Text style={styles.descricao}>minha central de Notificações</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.botaoLogout}>
                        <Image
                          source={require("../assets/images/target.png")}
                          style={styles.icone}
                        />
                        <View style={styles.textos}>
                          <Text style={styles.titulo}>Sair</Text>
                          <Text style={styles.descricao}>fazer logout da conta</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topo: {
    position: "absolute",
    top: "5%",
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: "5%",
    backgroundColor: "#fff",
    width: "100%",
    height: "20%",
  },
  logoSuperior: {
    width: "12%",
    height: undefined,
    aspectRatio: 1,
    resizeMode: "contain",
  },
  perfil: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: "cover",
  },
  areaBotao: {
    alignItems: "center",
    marginBottom: "2%",
  },
  botaoMetas: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffffff",
    padding: 16,
    borderRadius: 12,
    width: "85%",
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 8,
    marginBottom: 16,
  },
  icone: {
    width: 40,
    height: 40,
    marginRight: 12,
    resizeMode: "contain",
  },
  textos: {
    flex: 1,
  },
  titulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#005067",
  },
  descricao: {
    fontSize: 14,
    color: "#333",
  },
  tabBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ccc",
    paddingBottom: 10,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabIcon: {
    width: 32,
    height: 32,
    resizeMode: "contain",
  },
  botaoLogout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#ffffffff",
    padding: 16,
    borderRadius: 12,
    width: "58%",
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 8,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#005067",
    textAlign: "center",
    justifyContent: "center",
    marginRight: "29%",
  },

});