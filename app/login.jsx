import { useRouter } from "expo-router";
import { useState } from "react";
import {
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

export default function Login() {
  const [oculto, setOculto] = useState(true);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const router = useRouter();

  return (
    <ImageBackground
      source={require("../assets/images/fundo.png")}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.topo}>
          <TouchableOpacity style={styles.voltar} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
            <Text style={styles.txtVoltar}>Voltar</Text>
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
            placeholderTextColor="white"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.inputNative}
          />

          <TextInput
            placeholder="Senha"
            placeholderTextColor="white"
            value={senha}
            onChangeText={setSenha}
            autoCapitalize="none"
            secureTextEntry={oculto}
            style={styles.inputNative}
          />

          <TouchableOpacity style={styles.botao}>
            <Text style={styles.textBotao}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.esqueceuSenha}>
            <Text style={styles.Esqueceutxt}>Esqueceu a senha?</Text>
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
    marginLeft: "2%",
    fontSize: 18,
    color: "white",
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
    borderColor: "white",
    borderRadius: 25,
    paddingHorizontal: "5%",
    paddingVertical: "3%",
    color: "white",
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
    borderColor: "#ffffff",
    marginTop: "3%",
  },
  textBotao: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  esqueceuSenha: {
    marginTop: "5%",
    marginRight: "20%",
    alignContent: "flex-end",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    width: "100%",
  },
  Esqueceutxt: {
    color: "white",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
