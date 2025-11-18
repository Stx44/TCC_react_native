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

const API_BASE_URL = "https://api-neon-2kpd.onrender.com";

export default function EsqueciSenha() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleVerificarEmail = async () => {
    const emailLimpo = email.trim().toLowerCase();

    if (!emailLimpo || !emailLimpo.includes("@")) {
      Toast.show({
        type: 'pillError',
        text1: 'Atenção',
        text2: 'Digite um email válido.',
      });
      return;
    }

    setLoading(true);
    
    try {
      // --- Chamada à API para verificar o email ---
      const response = await axios.post(`${API_BASE_URL}/verificar-email`, {
        email: emailLimpo,
      });

      if (response.data.sucesso) {
        const usuarioId = response.data.usuario.id;
        
        Toast.show({
          type: 'pillSuccess',
          text1: 'Email encontrado!',
          text2: 'Redirecionando...',
        });

        // --- Navega para a próxima tela levando o ID ---
        setTimeout(() => {
          router.push({ 
            pathname: "/esqueciSenha2", 
            params: { usuarioId } 
          });
        }, 1000);
      }

    } catch (error) {
      Toast.show({
        type: 'pillError',
        text1: 'Erro',
        text2: error.response?.data?.erro || "Email não encontrado.",
      });
    } finally {
      setLoading(false);
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
            style={styles.voltar} 
            onPress={() => router.back()}
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

          <Text style={styles.aviso}>
            Insira o seu email abaixo para localizarmos a sua conta.
          </Text>

          <TextInput
            placeholder="Digite seu email"
            placeholderTextColor="#005067"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.inputNative}
          />

          <TouchableOpacity 
            style={styles.botao} 
            onPress={handleVerificarEmail} 
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#005067" />
            ) : (
              <Text style={styles.textBotao}>
                Continuar
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { 
    flex: 1 
  },
  container: { 
    flex: 1, 
    paddingHorizontal: 20, 
    justifyContent: "space-around" 
  },
  topo: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginTop: "3%" 
  },
  voltar: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  txtVoltar: { 
    marginLeft: 6, 
    fontSize: 18, 
    color: "#005067", 
    fontWeight: "bold" 
  },
  logoSuperior: { 
    width: 40, 
    height: 40, 
    resizeMode: "contain" 
  },
  logoCentral: { 
    width: 290, 
    height: 150, 
    resizeMode: "contain" 
  },
  content: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  aviso: { 
    color: "#005067", 
    fontSize: 16, 
    textAlign: "center", 
    marginBottom: 20, 
    paddingHorizontal: 10 
  },
  inputNative: { 
    width: "88%", 
    height: 50, 
    marginBottom: 15, 
    borderWidth: 2, 
    borderColor: "#005067", 
    borderRadius: 25, 
    paddingHorizontal: 15, 
    color: "#005067", 
    backgroundColor: "transparent" 
  },
  botao: { 
    width: "60%", 
    backgroundColor: "transparent", 
    paddingVertical: 12, 
    justifyContent: "center", 
    alignItems: "center", 
    borderRadius: 25, 
    borderWidth: 2, 
    borderColor: "#005067", 
    marginTop: 10 
  },
  textBotao: { 
    color: "#005067", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
});