import { router } from "expo-router";
import { useState } from "react";
import {
    Image,
    ImageBackground,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Calendar } from "react-native-calendars";


export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState("");

  return (
    <ImageBackground
      source={require("../assets/images/paredebranca.png")}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        {/* TOPO COM LOGO E PERFIL */}
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

        {/* BOTÕES E CALENDÁRIO */}
        <View style={styles.areaCalendario}>
            <View style={styles.areaTexto}>
                <Text style={styles.textoTitulo}>Calendário</Text>
            </View>  
            
          {/* CALENDÁRIO */}
          <Calendar
            current={new Date().toISOString().split("T")[0]}
            minDate={new Date().toISOString().split("T")[0]} // Bloqueia datas passadas
            maxDate={"2025-08-17"} // Exemplo de limite (4 dias no futuro)
            onDayPress={(day) => {
              setSelectedDate(day.dateString);
              console.log("Data selecionada:", day.dateString);
            }}
            markedDates={{
              [selectedDate]: {
                selected: true,
                selectedColor: "#005067",
                selectedTextColor: "#fff",
              },
            }}
            theme={{
              selectedDayBackgroundColor: "#005067",
              todayTextColor: "#00adf5",
              arrowColor: "#005067",
              calendarBackground: "transparent",
              borderRadius: 10,
            }}
            style={{
                 borderRadius: 10,
                 width: "95%",
                 borderWidth: 2,
                 borderColor: "#005067",
            }}
          />
        </View>

        <View style={styles.areaBotao}>
            <TouchableOpacity style={styles.botaoCalendario} onPress={() => router.push("/aliSemanal")}>
            <View style={styles.textos}>
              <Text style={styles.titulo}>Checar alimentação semanal</Text>
              <Text style={styles.descricao}>Gerencie sua dieta com nosso calendário!</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* TAB BAR */}
        <View style={styles.tabBar}>
          <TouchableOpacity style={styles.tabItem} >
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
          <TouchableOpacity style={styles.tabItem}>
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
    height: "20%",
    alignItems: "center",
    marginBottom: "2%",
  },
  botaoCalendario: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#005067",
    padding: 16,
    borderRadius: 12,
    width: "85%",
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 8,
    marginLeft: "7%",
    marginRight: "7%",
    marginTop: "5%",
  },
  textos: {
    flex: 1,
    alignItems: "center",
  },
  titulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  descricao: {
    fontSize: 14,
    color: "#fff",
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
  areaCalendario: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20%",
    backgroundColor: "transparent",
  },
  areaTexto: {
    marginBottom: 20,
    alignItems: "center",
    width: "50%",
  },
    textoTitulo: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#005067",
        marginBottom: "2%",
    },
});
