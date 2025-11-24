import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from './AuthContext'; 

const API_BASE_URL = "https://api-neon-2kpd.onrender.com";

export default function Notic() {
  const { usuarioId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [itensPendentes, setItensPendentes] = useState([]);

  const carregarPendencias = async () => {
    if (!usuarioId) return;
    setLoading(true);
    try {
      const [resExercicios, resMetas] = await Promise.all([
        axios.get(`${API_BASE_URL}/exercicios/${usuarioId}`),
        axios.get(`${API_BASE_URL}/metas/${usuarioId}`)
      ]);

      const exercicios = resExercicios.data
        .filter(item => !item.concluido)
        .map(item => ({ ...item, tipo: 'exercicio' }));
      
      const listaMetas = resMetas.data.metas || [];
      const metas = listaMetas
        .filter(item => !item.concluido)
        .map(item => ({ ...item, tipo: 'meta' }));

      setItensPendentes([...exercicios, ...metas]);

    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarPendencias();
  }, [usuarioId]);

  const concluirItem = async (tipo, id) => {
    try {
      const endpoint = tipo === 'exercicio' ? 'exercicios' : 'metas';
      await axios.put(`${API_BASE_URL}/${endpoint}/${id}`);
      Alert.alert("Sucesso!", "Item concluído.");
      setItensPendentes(prev => prev.filter(item => !(item.id === id && item.tipo === tipo)));
    } catch (error) {
      Alert.alert("Erro", "Não foi possível concluir.");
    }
  };

  const renderItem = ({ item }) => {
    const isExercicio = item.tipo === 'exercicio';
    return (
      <View style={styles.cardVertical}>
        
        {/* 1. Ícone no Topo */}
        <View style={[styles.iconBox, isExercicio ? styles.bgExercicio : styles.bgMeta]}>
          <Ionicons name={isExercicio ? 'barbell' : 'flag'} size={32} color="#fff" />
        </View>

        {/* 2. Conteúdo no Meio (Centralizado) */}
        <View style={styles.contentContainer}>
          <Text style={styles.cardTitle}>{isExercicio ? 'Exercício Pendente' : 'Meta Semanal'}</Text>
          <Text style={styles.cardDescription}>{item.descricao}</Text>
          <Text style={styles.cardDate}>
            {item.data_agendada ? new Date(item.data_agendada).toLocaleDateString('pt-BR') : 'Sem data'}
          </Text>
        </View>

        {/* 3. Botão Largo em Baixo */}
        <TouchableOpacity style={styles.checkButtonLarge} onPress={() => concluirItem(item.tipo, item.id)}>
          <Text style={styles.checkButtonText}>Marcar como Concluído</Text>
          <Ionicons name="checkmark-circle" size={20} color="#fff" />
        </TouchableOpacity>

      </View>
    );
  };

  return (
    <ImageBackground source={require('../assets/images/paredebranca.png')} style={styles.background} resizeMode="cover">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.container}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#005067" />
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Notificações</Text>
          <View style={{ width: 60 }} /> 
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#005067" style={{ marginTop: 50 }} />
        ) : (
          <View style={styles.content}>
            {itensPendentes.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="happy-outline" size={80} color="#005067" style={{ opacity: 0.5 }} />
                <Text style={styles.emptyText}>Tudo em dia!</Text>
              </View>
            ) : (
              <FlatList
                data={itensPendentes}
                keyExtractor={(item) => `${item.tipo}-${item.id}`}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1 },
  
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingVertical: 15, 
    marginTop: 10 
  },
  backButton: { flexDirection: 'row', alignItems: 'center' },
  backText: { color: '#005067', fontSize: 16, marginLeft: 5, fontWeight: 'bold' },
  pageTitle: { fontSize: 20, fontWeight: 'bold', color: '#005067' },
  
  content: { flex: 1, paddingHorizontal: 20 },
  
  // --- ESTILO VERTICAL ---
  cardVertical: {
    flexDirection: 'column', // Garante que fique um embaixo do outro
    alignItems: 'center',    // Centraliza horizontalmente
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: '#eee'
  },
  
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15
  },
  bgExercicio: { backgroundColor: '#005067' },
  bgMeta: { backgroundColor: '#005067' },
  
  contentContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#888', 
    textTransform: 'uppercase', 
    marginBottom: 5 
  },
  cardDescription: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333', 
    marginBottom: 5,
    textAlign: 'center'
  },
  cardDate: { 
    fontSize: 14, 
    color: '#005067' 
  },
  
  checkButtonLarge: { 
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#005067', 
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  checkButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8
  },
  
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: -50 },
  emptyText: { marginTop: 15, fontSize: 18, fontWeight: 'bold', color: '#005067' },
});