import React, { 
  createContext, 
  useState, 
  useContext, 
  useEffect 
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// 🚨 CORREÇÃO: Importando do módulo 'legacy' para corrigir o erro de deprecated
import * as FileSystem from 'expo-file-system/legacy'; 
import axios from 'axios'; 
import { Alert } from 'react-native'; 

const AuthContext = createContext({});

const API_BASE_URL = "https://api-neon-2kpd.onrender.com";

export const AuthProvider = ({ children }) => {
  // Guarda o objeto completo do usuário {id, nome, email, foto_perfil}
  const [usuario, setUsuario] = useState(null);
  // Guarda a URI local ou a string Base64 da foto de perfil
  const [perfilImage, setPerfilImage] = useState(null);

  // --- 1. Carregar dados e foto ao iniciar o App ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedUserJson = await AsyncStorage.getItem('user_data');
        
        if (savedUserJson) {
          const savedUser = JSON.parse(savedUserJson);
          setUsuario(savedUser);

          // Tenta carregar a foto do banco (se veio no objeto usuário)
          if (savedUser.foto_perfil) {
             setPerfilImage(savedUser.foto_perfil);
          } 
          // Se não, tenta carregar do cache local (com o ID na chave)
          else if (savedUser.id) {
            const localImage = await AsyncStorage.getItem(`user_profile_image_${savedUser.id}`);
            if (localImage) setPerfilImage(localImage);
          }
        }
      } catch (error) {
        console.log("Erro ao carregar dados:", error);
      }
    };
    loadData();
  }, []);

  // --- 2. Função de Login ---
  const login = async (dadosUsuario) => {
    setUsuario(dadosUsuario);
    await AsyncStorage.setItem('user_data', JSON.stringify(dadosUsuario));

    // Busca a foto específica deste usuário ao logar
    if (dadosUsuario.id) {
      try {
        const localImage = await AsyncStorage.getItem(`user_profile_image_${dadosUsuario.id}`);
        // Se achou foto salva localmente, usa. Se não, usa a foto do banco (dadosUsuario.foto_perfil)
        setPerfilImage(localImage || dadosUsuario.foto_perfil || null);
      } catch (e) {
        setPerfilImage(dadosUsuario.foto_perfil || null);
      }
    }
  };

  // --- 3. Função de Logout ---
  const logout = async () => {
    setUsuario(null);
    setPerfilImage(null); 
    await AsyncStorage.removeItem('user_data');
  };

  // --- 4. Atualizar Foto (Salva Localmente e no Banco de Dados) ---
  const atualizarFoto = async (uri) => {
    if (!usuario?.id) return;

    // Atualiza visualmente logo (otimista)
    setPerfilImage(uri);
    await AsyncStorage.setItem(`user_profile_image_${usuario.id}`, uri);

    try {
      console.log("Iniciando conversão para Base64...");
      
      // ✅ CORREÇÃO APLICADA AQUI: Chama o readAsStringAsync do módulo /legacy
      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
      const fotoEmTexto = `data:image/jpeg;base64,${base64}`;

      console.log("Enviando para API...");
      
      // Envia para o Banco de Dados
      const response = await axios.put(`${API_BASE_URL}/usuarios/${usuario.id}`, {
        foto_perfil: fotoEmTexto
      });

      console.log("Sucesso na API:", response.status);

      // Atualiza o objeto usuário local com o novo Base64
      const novoUsuario = { ...usuario, foto_perfil: fotoEmTexto };
      setUsuario(novoUsuario);
      await AsyncStorage.setItem('user_data', JSON.stringify(novoUsuario));
      
      Alert.alert("Sucesso", "Foto salva na nuvem!");

    } catch (error) {
      console.log("Erro detalhado:", error);
      
      // Alertas de erro para debug (importante para saber o que a API respondeu)
      if (error.response) {
        Alert.alert("Erro na API", `Status: ${error.response.status}\nMsg: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        Alert.alert("Erro de Conexão", "Não foi possível contactar o servidor. Verifique o deploy da API.");
      } else {
        Alert.alert("Erro Interno", error.message);
      }
      
      // Em caso de falha no salvamento, revertemos a foto visual para a anterior
      const previousImage = await AsyncStorage.getItem(`user_profile_image_${usuario.id}`);
      setPerfilImage(previousImage || usuario.foto_perfil || null);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        usuario,                
        usuarioId: usuario?.id, 
        login, 
        logout,
        perfilImage, 
        atualizarFoto 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};