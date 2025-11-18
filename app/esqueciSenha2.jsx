import axios from "axios";
import { useRouter, useLocalSearchParams } from "expo-router";
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

export default function RedefinirSenha() {
  // --- Recebe o ID passado pela tela anterior ---
  const { usuarioId } = useLocalSearchParams();

  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [oculto, setOculto] = useState(true);
  const router = useRouter();

  const handleRedefinir = async () => {
    // Validação simples
    if (!senha || !confirmarSenha) {
      Toast.show({ 
        type: 'pillError', 
        text1: 'Atenção', 
        text2: 'Preencha os dois campos.' 
      });
      return;
    }

    if (senha !== confirmarSenha) {
      Toast.show({ 
        type: 'pillError', 
        text1: 'Erro', 
        text2: 'As senhas não coincidem.' 
      });
      return;
    }

    setLoading(true);
    
    try {
      // --- Chama a API para atualizar a senha ---
      await axios.put(`${API_BASE_URL}/redefinir-senha/${usuarioId}`, {
        nova_senha: senha,
      });

      Toast.show({
        type: 'pillSuccess',
        text1: 'Sucesso!',
        text2: 'Senha alterada. Faça login agora.',
      });

      // Retorna ao Login após sucesso
      setTimeout(() => {
        router.replace("/login");
      }, 1500);

    } catch (error) {
      Toast.show({
        type: 'pillError',
        text1: 'Erro',
        text2: error.response?.data?.erro || "Falha ao redefinir senha.",
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

          <Text style={styles.titulo}>
            Crie sua nova senha
          </Text>

          {/* Campo Nova Senha */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Nova senha"
              placeholderTextColor="#005067"
              value={senha}
              onChangeText={setSenha}
              autoCapitalize="none"
              secureTextEntry={oculto}
              style={styles.inputNative}
            />
            <TouchableOpacity 
              onPress={() => setOculto(!oculto)} 
              style={styles.eyeIcon}
            >
              <Ionicons 
                name={oculto ? "eye-off" : "eye"} 
                size={20} 
                color="#005067" 
              />
            </TouchableOpacity>
          </View>

          {/* Campo Confirmar Senha */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Confirmar senha"
              placeholderTextColor="#005067"
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              autoCapitalize="none"
              secureTextEntry={oculto}
              style={styles.inputNative}
            />
          </View>

          <TouchableOpacity 
            style={styles.botao} 
            onPress={handleRedefinir} 
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#005067" />
            ) : (
              <Text style={styles.textBotao}>
                Salvar Senha
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
  titulo: { 
    fontSize: 18, 
    color: "#005067", 
    marginBottom: 20, 
    fontWeight: "bold" 
  },
  inputContainer: { 
    width: "88%", 
    marginBottom: 15, 
    position: 'relative' 
  },
  inputNative: { 
    width: "100%", 
    height: 50, 
    borderWidth: 2, 
    borderColor: "#005067", 
    borderRadius: 25, 
    paddingHorizontal: 15, 
    color: "#005067", 
    backgroundColor: "transparent" 
  },
  eyeIcon: { 
    position: "absolute", 
    right: 15, 
    top: 15 
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