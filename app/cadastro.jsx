import axios from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal // 1. Importei o Modal
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const API_BASE_URL = "https://api-neon-2kpd.onrender.com";

async function cadastrar(nome, email, senha) {
  const nomeLimpo = nome.trim();
  const emailLimpo = email.trim().toLowerCase();
  const senhaLimpa = senha.trim();

  if (!nomeLimpo || !emailLimpo || !senhaLimpa) {
    throw new Error("Preencha todos os campos.");
  }

  if (!emailLimpo.includes("@") || !emailLimpo.includes(".")) {
    throw new Error("Email inválido.");
  }

  const response = await axios.post(`${API_BASE_URL}/usuarios`, {
    nome: nomeLimpo,
    email: emailLimpo,
    senha: senhaLimpa,
  });

  return response.data;
}

export default function Cadastro() {
  const [oculto, setOculto] = useState(true);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  
  // 2. Estado para controlar o Modal de Aviso
  const [modalVisible, setModalVisible] = useState(false);

  const router = useRouter();

  const handleCadastro = async () => {
    setLoading(true);
    try {
      await cadastrar(nome, email, senha);
      
      // Limpa os campos
      setNome("");
      setEmail("");
      setSenha("");
      
      // 3. Em vez de ir direto, mostra o Modal de aviso
      setModalVisible(true);
      
    } catch (error) {
      Alert.alert("Erro", error.message || "Erro ao cadastrar.");
    } finally {
      setLoading(false);
    }
  };

  // Função para fechar o modal e ir para o login
  const fecharModalEIrParaLogin = () => {
    setModalVisible(false);
    router.replace("/login");
  };

  return (
    <ImageBackground
      source={require("../assets/images/paredebranca.png")}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
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

        <View style={styles.content}>
          <Image
            source={require("../assets/images/logo_health.png")}
            style={styles.logoCentral}
          />

          <TextInput
            placeholder="Nome"
            placeholderTextColor="#005067"
            value={nome}
            onChangeText={setNome}
            autoCapitalize="words"
            style={styles.inputNative}
          />

          <TextInput
            placeholder="Email"
            placeholderTextColor="#005067"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.inputNative}
          />

          <TextInput
            placeholder="Senha"
            placeholderTextColor="#005067"
            value={senha}
            onChangeText={setSenha}
            autoCapitalize="none"
            secureTextEntry={oculto}
            style={styles.inputNative}
          />

          <TouchableOpacity style={styles.botao} onPress={handleCadastro} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#005067" />
            ) : (
              <Text style={styles.textBotao}>Cadastrar</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* --- 4. MODAL DE VERIFICAÇÃO DE EMAIL --- */}
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={fecharModalEIrParaLogin}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Ícone de Carta/Email */}
                    <Ionicons name="mail-unread" size={50} color="#005067" />
                    
                    <Text style={styles.modalTitle}>Quase lá!</Text>
                    
                    <Text style={styles.modalText}>
                        Sua conta foi criada com sucesso.
                    </Text>
                    
                    <Text style={styles.modalText}>
                        Para sua segurança, enviamos um link de confirmação para o e-mail cadastrado.
                    </Text>

                    <Text style={styles.modalTextBold}>
                        Você precisa confirmar seu e-mail antes de fazer login.
                    </Text>

                    <TouchableOpacity 
                        style={styles.modalBtnConfirm}
                        onPress={fecharModalEIrParaLogin}
                    >
                        <Text style={styles.modalBtnTextConfirm}>Entendi, ir para Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>

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
    paddingHorizontal: 20,
    justifyContent: "space-around",
  },
  topo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "3%",
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
  logoSuperior: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  logoContainer: {
    alignItems: "center",
  },
  logoCentral: {
    width: 290,
    height: 150,
    resizeMode: "contain",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputNative: {
    width: "88%",
    height: "06%",
    marginBottom: "3%",
    borderWidth: 2,
    borderColor: "#005067",
    borderRadius: 25,
    paddingHorizontal: "4%",
    paddingVertical: "2%",
    color: "#005067",
    backgroundColor: "transparent",
  },
  botao: {
    width: "60%",
    backgroundColor: "transparent",
    paddingVertical: "3%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#005067",
    marginTop: "3%",
  },
  textBotao: {
    color: "#005067",
    fontSize: 16,
    fontWeight: "bold",
  },

  // --- ESTILOS DO MODAL (Copiados e adaptados de MinhaConta) ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)', // Fundo escurecido
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#005067', // Cor do tema
    marginTop: 10,
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 22,
  },
  modalTextBold: {
    fontSize: 15,
    color: '#d9534f', // Mantive vermelho para chamar atenção ao aviso importante
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  modalBtnConfirm: {
    backgroundColor: '#005067', // Botão com a cor do tema
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalBtnTextConfirm: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  }
});