import axios from "axios";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Toast from 'react-native-toast-message';
import { useAuth } from './AuthContext';

const API_BASE_URL = "https://api-neon-2kpd.onrender.com";

export default function MinhaConta() {
  const { usuario, login, usuarioId } = useAuth();

  // Estados para Nome e Email
  const [nome, setNome] = useState(usuario?.nome || '');
  const [email, setEmail] = useState(usuario?.email || '');
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Estados para Senha
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [senhaOculta, setSenhaOculta] = useState(true);


  // --- 1. FUNÇÃO PARA ATUALIZAR NOME E EMAIL ---
  const handleUpdateProfile = async () => {
    if (!usuarioId) return;

    if (nome.trim() === '' || email.trim() === '') {
      Toast.show({ type: 'pillError', text1: 'Erro', text2: 'Nome e Email são obrigatórios.' });
      return;
    }

    setLoadingProfile(true);

    try {
      const response = await axios.put(`${API_BASE_URL}/usuarios/${usuarioId}`, {
        nome: nome,
        email: email
      });

      // Atualiza o contexto (para mudar o nome/email em tempo real no app)
      login(response.data); 

      Toast.show({ 
        type: 'pillSuccess', 
        text1: 'Sucesso', 
        text2: 'Dados atualizados com sucesso!' 
      });

    } catch (error) {
      const msg = error.response?.data?.erro || 'Falha ao atualizar dados.';
      Toast.show({ 
        type: 'pillError', 
        text1: 'Erro', 
        text2: msg 
      });
      console.error("Erro ao atualizar perfil:", error);
    } finally {
      setLoadingProfile(false);
    }
  };


  // --- 2. FUNÇÃO PARA ATUALIZAR SENHA ---
  const handleChangePassword = async () => {
    if (!usuarioId) return;

    if (senhaAtual === '' || novaSenha === '' || confirmarSenha === '') {
      Toast.show({ type: 'pillError', text1: 'Atenção', text2: 'Preencha todos os campos de senha.' });
      return;
    }
    if (novaSenha !== confirmarSenha) {
      Toast.show({ type: 'pillError', text1: 'Erro', text2: 'Nova senha e Confirmação não coincidem.' });
      return;
    }
    if (novaSenha.length < 6) {
        Toast.show({ type: 'pillError', text1: 'Erro', text2: 'A nova senha deve ter no mínimo 6 caracteres.' });
        return;
    }

    setLoadingPassword(true);

    try {
      const response = await axios.put(`${API_BASE_URL}/usuarios/${usuarioId}/senha`, {
        senha_atual: senhaAtual,
        nova_senha: novaSenha
      });

      Toast.show({ 
        type: 'pillSuccess', 
        text1: 'Sucesso', 
        text2: 'Senha alterada. Faça login novamente!' 
      });
      
      // Limpa os campos após o sucesso
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');

    } catch (error) {
      const msg = error.response?.data?.erro || 'Falha ao alterar senha.';
      Toast.show({ 
        type: 'pillError', 
        text1: 'Erro', 
        text2: msg 
      });
      console.error("Erro ao alterar senha:", error);
    } finally {
      setLoadingPassword(false);
    }
  };


  return (
    <ImageBackground
      source={require("../assets/images/paredebranca.png")}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.topo}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.voltar} 
          >
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color="#005067" 
            />
            <Text style={styles.txtVoltar}>
              Voltar
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <Text style={styles.titulo}>
            Minha Conta
          </Text>

          {/* --- SEÇÃO 1: NOME E EMAIL --- */}
          <View style={styles.secao}>
            <Text style={styles.subtitulo}>
              Informações Pessoais
            </Text>

            <TextInput
              placeholder="Nome"
              placeholderTextColor="#888"
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
              style={styles.inputNative}
            />

            <TextInput
              placeholder="Email"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.inputNative}
            />

            <TouchableOpacity 
              style={styles.botaoSalvar} 
              onPress={handleUpdateProfile}
              disabled={loadingProfile}
            >
              {loadingProfile ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.textBotao}>
                  Salvar Dados
                </Text>
              )}
            </TouchableOpacity>
          </View>
          
          {/* --- SEÇÃO 2: ALTERAR SENHA --- */}
          <View style={styles.secao}>
            <Text style={styles.subtitulo}>
              Alterar Senha
            </Text>

            <TextInput
              placeholder="Senha Atual"
              placeholderTextColor="#888"
              value={senhaAtual}
              onChangeText={setSenhaAtual}
              secureTextEntry={senhaOculta}
              style={styles.inputNative}
            />
            
            <TextInput
              placeholder="Nova Senha"
              placeholderTextColor="#888"
              value={novaSenha}
              onChangeText={setNovaSenha}
              secureTextEntry={senhaOculta}
              style={styles.inputNative}
            />

            <TextInput
              placeholder="Confirmar Nova Senha"
              placeholderTextColor="#888"
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              secureTextEntry={senhaOculta}
              style={styles.inputNative}
            />

            <TouchableOpacity 
              onPress={() => setSenhaOculta(!senhaOculta)} 
              style={styles.toggleSenha}
            >
                <Ionicons 
                    name={senhaOculta ? "eye-off" : "eye"} 
                    size={20} 
                    color="#005067" 
                />
                <Text style={styles.toggleSenhaText}>
                    {senhaOculta ? "Mostrar Senhas" : "Esconder Senhas"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.botaoSalvar} 
              onPress={handleChangePassword}
              disabled={loadingPassword}
            >
              {loadingPassword ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.textBotao}>
                  Alterar Senha
                </Text>
              )}
            </TouchableOpacity>
          </View>

        </ScrollView>
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
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
    alignItems: 'center',
  },
  topo: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
  },
  voltar: {
    flexDirection: "row",
    alignItems: "center",
  },
  txtVoltar: {
    marginLeft: 6,
    fontSize: 18,
    color: "#005067",
    fontWeight: "bold",
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#005067",
    marginBottom: 20,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  secao: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  subtitulo: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: "bold",
    color: "#005067",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 5,
  },
  inputNative: {
    width: "100%",
    height: 50,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#EAEAEA",
    borderRadius: 10,
    paddingHorizontal: 15,
    color: "#333",
    backgroundColor: "#F7F7F7",
    fontSize: 16,
  },
  botaoSalvar: {
    width: "100%",
    backgroundColor: "#005067",
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
  },
  textBotao: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  toggleSenha: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  toggleSenhaText: {
    marginLeft: 8,
    color: '#005067',
    fontSize: 14,
  }
});