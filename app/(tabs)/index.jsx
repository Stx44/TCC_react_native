import { router, useLocalSearchParams } from "expo-router"; // ⚠️ Adicione o useLocalSearchParams
import {
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function HomePage() {
  const { usuarioId } = useLocalSearchParams(); // ⚠️ Obtenha o ID do usuário aqui

  return (
    <ImageBackground
      source={require("../../assets/images/paredebranca.png")}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        {/* TOPO COM LOGO E PERFIL */}
        <View style={styles.topo}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logoSuperior}
          />
          <TouchableOpacity onPress={() => router.push({ pathname: "/perfil", params: { usuarioId } })}>
            <Image
              source={require("../../assets/images/perfil_teal.png")}
              style={styles.perfil}
            />
          </TouchableOpacity>
        </View>

        {/* BOTÕES METAS E PROGRESSO */}
        <View style={styles.areaBotao}>
          <TouchableOpacity style={styles.botaoMetas} onPress={() => router.push("/metasSemanais")}>
            <Image
              source={require("../../assets/images/target.png")}
              style={styles.icone}
            />
            <View style={styles.textos}>
              <Text style={styles.titulo}>Metas Semanais</Text>
              <Text style={styles.descricao}>Acompanhe suas metas dessa semana</Text>
            </View>
          </TouchableOpacity>

          {/* ⚠️ MUDANÇA AQUI: passe o ID do usuário para a tela de progresso. */}
          <TouchableOpacity 
            style={styles.botaoMetas} 
            onPress={() => router.push({ pathname: "/acompanharProgresso", params: { usuarioId } })}>
            <Image
              source={require("../../assets/images/progresso.png")}
              style={styles.icone}
            />
            <View style={styles.textos}>
              <Text style={styles.titulo}>Acompanhar Progresso</Text>
              <Text style={styles.descricao}>Acompanhe seus progressos de forma contínua</Text>
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
});