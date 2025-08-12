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
  const [confSenha, setConfSenha] = useState("")
  const router = useRouter();

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

          <TextInput
            placeholder="Confirmar Senha"
            placeholderTextColor="#005067"
            value={confSenha}
            onChangeText={setConfSenha}
            autoCapitalize="none"
            secureTextEntry={oculto}
            style={styles.inputNative}
          />

          <TouchableOpacity style={styles.botao}>
            <Text style={styles.textBotao}>Entrar</Text>
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
    fontWeight: "#005067",
  },
});
