import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from './AuthContext';
import Notic from './Notic';

const { width } = Dimensions.get('window');

export default function Perfil() {
    const { 
        usuario, 
        perfilImage, 
        atualizarFoto, 
        logout 
    } = useAuth();

    // --- Escolher Imagem ---
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Permissão necessária', 
                'Precisamos de acesso à galeria.'
            );
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            atualizarFoto(result.assets[0].uri);
        }
    };

    // --- Logout ---
    const handleLogout = () => {
        logout();
        router.replace('/login');
    };

    return (
        <ImageBackground
            source={require("../assets/images/paredebranca.png")}
            style={styles.background}
        >
            <SafeAreaView style={styles.container}>
                
                {/* --- TOPO --- */}
                <View style={styles.headerArea}>
                    <TouchableOpacity 
                        onPress={() => router.back()} 
                        style={styles.closeButton}
                    >
                        <Ionicons 
                            name="close" 
                            size={30} 
                            color="#888" 
                        />
                    </TouchableOpacity>

                    <View style={styles.profileInfo}>
                        <TouchableOpacity onPress={pickImage}>
                            <Image
                                source={
                                    perfilImage 
                                    ? { uri: perfilImage } 
                                    : require("../assets/images/perfil_teal.png")
                                }
                                style={styles.fotoPerfilGrande}
                            />
                            <View style={styles.editIconBadge}>
                                <Ionicons 
                                    name="camera" 
                                    size={14} 
                                    color="#fff" 
                                />
                            </View>
                        </TouchableOpacity>
                        
                        {/* --- NOME DO USUÁRIO --- */}
                        <Text style={styles.nomeUsuario}>
                            {usuario?.nome ? usuario.nome : "Usuário"}
                        </Text>
                    </View>
                </View>

                {/* --- MENU --- */}\\
                <View style={styles.areaBotoes}>
                    
                    {/* Botão: Dados da Conta */}
                    <TouchableOpacity 
                        style={styles.botaoPill} 
                        onPress={() => router.push('/MinhaConta')}
                    >
                        <View style={styles.leftContent}>
                            <Image
                                source={require("../assets/images/icone_conta.png")}
                                style={styles.iconeMenu}
                            />
                            <View>
                                <Text style={styles.tituloBotao}>
                                    Dados da conta
                                </Text>
                                <Text style={styles.descBotao}>
                                    Minhas informações da conta
                                </Text>
                            </View>
                        </View>
                        <Ionicons 
                            name="chevron-forward" 
                            size={20} 
                            color="#ccc" 
                        />
                    </TouchableOpacity>

                    {/* Botão: Notificações */}
                    <TouchableOpacity 
                        style={styles.botaoPill} 
                        onPress={() => router.push("/Notic")}
                    >
                         <View style={styles.leftContent}>
                            <Image
                                source={require("../assets/images/icone_sino.png")}
                                style={styles.iconeMenu}
                            />
                            <View>
                                <Text style={styles.tituloBotao}>
                                    Notificações
                                </Text>
                                <Text style={styles.descBotao}>
                                    Minha central de Notificações
                                </Text>
                            </View>
                        </View>
                        <Ionicons 
                            name="chevron-forward" 
                            size={20} 
                            color="#ccc" 
                        />
                    </TouchableOpacity>

                    {/* Botão: Sair */}
                    <TouchableOpacity 
                        style={styles.botaoLogoutPill} 
                        onPress={handleLogout}
                    >
                        <Text style={styles.textoLogout}>
                            Sair
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
    width: "100%", 
    height: "100%" 
  },
  container: { 
    flex: 1 
  },
  headerArea: { 
    alignItems: 'center', 
    paddingTop: 20, 
    paddingBottom: 30 
  },
  closeButton: { 
    position: 'absolute', 
    top: 50, 
    left: 20, 
    padding: 5, 
    zIndex: 10 
  },
  profileInfo: { 
    alignItems: 'center', 
    marginTop: 80 
  },
  fotoPerfilGrande: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    borderWidth: 3, 
    borderColor: '#005067', 
    marginBottom: 10 
  },
  editIconBadge: { 
    position: 'absolute', 
    bottom: 10, 
    right: 0, 
    backgroundColor: '#005067', 
    borderRadius: 15, 
    width: 30, 
    height: 30, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 2, 
    borderColor: '#fff' 
  },
  nomeUsuario: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#005067' 
  },
  areaBotoes: { 
    flex: 1, 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    marginTop: 10 
  },
  botaoPill: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    backgroundColor: "#FFFFFF", 
    paddingVertical: 15, 
    paddingHorizontal: 20, 
    borderRadius: 30, 
    width: "100%", 
    shadowColor: "#000", 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 3, 
    marginBottom: 20, 
    borderWidth: 1, 
    borderColor: '#f0f0f0' 
  },
  leftContent: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  iconeMenu: { 
    width: 28, 
    height: 28, 
    resizeMode: "contain", 
    marginRight: 15 
  },
  tituloBotao: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#005067" 
  },
  descBotao: { 
    fontSize: 12, 
    color: "#888" 
  },
  botaoLogoutPill: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "center", 
    backgroundColor: "#FFFFFF", 
    paddingVertical: 15, 
    paddingHorizontal: 25, 
    borderRadius: 30, 
    marginTop: 10, 
    borderWidth: 1, 
    borderColor: '#EAEAEA', 
    shadowColor: "#000", 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 3 
  },
  iconeLogout: { 
    width: 20, 
    height: 20, 
    resizeMode: "contain", 
    marginRight: 10, 
    tintColor: '#005067' 
  },
  textoLogout: { 
    fontSize: 14, 
    fontWeight: "bold", 
    color: "#005067" 
  },
});