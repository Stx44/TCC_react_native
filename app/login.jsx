import axios from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  SafeAreaView,
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

export default function Login() {
  const [oculto, setOculto] = useState(true);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { login } = useAuth(); 

  const handleLogin = async () => {
    setLoading(true);
    const emailLimpo = email.trim().toLowerCase();
    const senhaLimpa = senha.trim();

    // Validações
    if (!emailLimpo || !senhaLimpa) {
      Toast.show({
        type: 'pillError',
        text1: 'Atenção!',
        text2: 'Preencha todos os campos.',
      });
      setLoading(false);
      return;
    }

    if (!emailLimpo.includes("@") || !emailLimpo.includes(".")) {
      Toast.show({
        type: 'pillError',
        text1: 'Atenção!',
        text2: 'Email inválido.',
      });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email: emailLimpo,
        senha: senhaLimpa,
      });

      if (response.data.sucesso) {
        // 🚨 ATENÇÃO: Passando o objeto completo do usuário
        login(response.data.usuario);
        
        Toast.show({
          type: 'pillSuccess',
          text1: 'Sucesso!',
          text2: 'Bem-vindo(a) de volta!',
          topOffset: 60,
        });
        
        setTimeout(() => {
          router.replace("/(tabs)/");
        }, 800);

      } else {
        Toast.show({
          type: 'pillError',
          text1: 'Erro de Login',
          text2: 'Credenciais inválidas.',
          topOffset: 65,
        });
      }
    } catch (error) {
      Toast.show({
        type: 'pillError',
        text1: 'Falha na Conexão',
        text2: error.message || "Erro ao fazer login.",
        topOffset: 65,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/fundo.png")}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.topo}>
          <TouchableOpacity 
            style={styles.voltar} 
            onPress={() => router.back()}
          >
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color="#ffffffff" 
            />
            <Text style={styles.txtVoltar}>
              Voltar
            </Text>
          </TouchableOpacity>

          <Image
            source={require("../assets/images/logobranca.png")}
            style={styles.logoSuperior}
          />
        </View>

        <View style={styles.content}>
          <Image
            source={require("../assets/images/logo_health_white.png")}
            style={styles.logoCentral}
          />

          <TextInput
            placeholder="Email"
            placeholderTextColor="#ffffffff"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.inputNative}
          />

          <TextInput
            placeholder="Senha"
            placeholderTextColor="#ffffffff"
            value={senha}
            onChangeText={setSenha}
            autoCapitalize="none"
            secureTextEntry={oculto}
            style={styles.inputNative}
          />

          <TouchableOpacity 
            style={styles.botao} 
            onPress={handleLogin} 
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffffff" />
            ) : (
              <Text style={styles.textBotao}>
                Entrar
              </Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.esqueciSenha} 
            onPress={() => router.push("/esqueciSenha")}
          >
            <Text style={styles.esqTxt}>
              Esqueceu a senha?
            </Text>
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
    color: "#ffffffff",
    fontWeight: "bold",
  },
  logoSuperior: {
    width: 40,
    height: 40,
    resizeMode: "contain",
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
    height: 50,
    marginBottom: "3%",
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 25,
    paddingHorizontal: "4%",
    color: "#ffffffff",
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
    borderColor: "white",
    marginTop: "3%",
  },
  textBotao: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  esqueciSenha: {
    marginTop: "4%",
  },
  esqTxt: {
    color: "#ffffffff",
    fontSize: 16,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});