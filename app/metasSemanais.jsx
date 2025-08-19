import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    FlatList,
    Image,
    ImageBackground,
    SafeAreaView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function HomePage() {
  const [metas, setMetas] = useState([]);
  const [novaMeta, setNovaMeta] = useState("");

  useEffect(() => {
    const carregarMetas = async () => {
      const data = await AsyncStorage.getItem("metas");
      if (data) setMetas(JSON.parse(data));
    };
    carregarMetas();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("metas", JSON.stringify(metas));
  }, [metas]);

  const adicionarMeta = () => {
    if (!novaMeta.trim()) return;
    const nova = {
      id: Date.now().toString(),
      texto: novaMeta,
      concluida: false,
    };
    setMetas([...metas, nova]);
    setNovaMeta("");
  };

  const toggleMeta = (id) => {
    setMetas(
      metas.map((m) =>
        m.id === id ? { ...m, concluida: !m.concluida } : m
      )
    );
  };

  return (
    <ImageBackground
      source={require("../assets/images/paredebranca.png")}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        {/* TOPO */}
        <View style={styles.topo}>
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logoSuperior}
          />
          <TouchableOpacity>
            <Image
              source={require("../assets/images/perfil_teal.png")}
              style={styles.perfil}
            />
          </TouchableOpacity>
        </View>

        {/* INPUT + BOTÃO ADICIONAR */}
        <View style={styles.areaAdicionar}>
          <TextInput
            style={styles.input}
            placeholder="Digite sua meta"
            value={novaMeta}
            onChangeText={setNovaMeta}
          />
          <TouchableOpacity
            style={styles.botaoAdicionar}
            onPress={adicionarMeta}
          >
            <Text style={styles.textoBotao}>Adicionar</Text>
          </TouchableOpacity>
        </View>

        {/* LISTA DE METAS */}
        <FlatList
          data={metas}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          style={{ width: "90%", marginTop: 20 }}
          renderItem={({ item }) => (
            <View style={styles.caixaMeta}>
              <Switch
                value={item.concluida}
                onValueChange={() => toggleMeta(item.id)}
                trackColor={{ false: "#ccc", true: "#005067" }}
                thumbColor={item.concluida ? "#fff" : "#fff"}
              />
              <Text
                style={[
                  styles.textoMeta,
                  item.concluida && {
                    textDecorationLine: "line-through",
                    color: "gray",
                  },
                ]}
              >
                {item.texto}
              </Text>
            </View>
          )}
        />

        {/* TAB BAR */}
        <View style={styles.tabBar}>
          <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/alimentacao")}>
            <Image
              source={require("../assets/images/apple_teal.png")}
              style={styles.tabIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/homepage")}>
            <Image
              source={require("../assets/images/home_teal.png")}
              style={styles.tabIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/exercicios")}>
            <Image
              source={require("../assets/images/dumbbell_teal.png")}
              style={styles.tabIcon}
            />
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
    alignItems: "center",
    justifyContent: "space-between",
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
    aspectRatio: 1,
    resizeMode: "contain",
  },
  perfil: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: "cover",
  },
  areaAdicionar: {
    marginTop: 120,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 12,
    marginRight: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  botaoAdicionar: {
    backgroundColor: "#005067",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
  },
  caixaMeta: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  textoMeta: {
    fontSize: 16,
    fontWeight: "500",
    color: "#005067",
    marginLeft: 8,
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
