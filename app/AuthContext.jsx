import React, { 
  createContext, 
  useState, 
  useContext, 
  useEffect 
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy'; 
import axios from 'axios'; 
import { Alert } from 'react-native'; 
import { router } from 'expo-router';

const AuthContext = createContext({});

const API_BASE_URL = "https://api-neon-2kpd.onrender.com";

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [perfilImage, setPerfilImage] = useState(null);

  // --- 1. Carregar dados e Verificar se Usuário ainda existe ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedUserJson = await AsyncStorage.getItem('user_data');
        
        if (savedUserJson) {
          const savedUser = JSON.parse(savedUserJson);

          // VERIFICAÇÃO DE SEGURANÇA: Checa se o usuário ainda existe no banco
          try {
            await axios.get(`${API_BASE_URL}/usuarios/${savedUser.id}/status`);
            // Se deu certo (status 200), carrega os dados normal
            setUsuario(savedUser);

            if (savedUser.foto_perfil) {
               setPerfilImage(savedUser.foto_perfil);
            } else if (savedUser.id) {
              const localImage = await AsyncStorage.getItem(`user_profile_image_${savedUser.id}`);
              if (localImage) setPerfilImage(localImage);
            }

          } catch (error) {
            // Se der erro 404 (Não encontrado), significa que foi excluído
            if (error.response && error.response.status === 404) {
              console.log("Usuário não encontrado no banco. Fazendo logout...");
              await AsyncStorage.removeItem('user_data');
              setUsuario(null);
              router.replace('/login'); // Força ida para login
              return;
            }
            // Se for erro de internet, mantém o login local (cache)
            setUsuario(savedUser);
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

    if (dadosUsuario.id) {
      try {
        const localImage = await AsyncStorage.getItem(`user_profile_image_${dadosUsuario.id}`);
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
    router.replace('/login');
  };

  // --- 4. Atualizar Foto ---
  const atualizarFoto = async (uri) => {
    if (!usuario?.id) return;

    setPerfilImage(uri);
    await AsyncStorage.setItem(`user_profile_image_${usuario.id}`, uri);

    try {
      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
      const fotoEmTexto = `data:image/jpeg;base64,${base64}`;
      
      const response = await axios.put(`${API_BASE_URL}/usuarios/${usuario.id}`, {
        foto_perfil: fotoEmTexto
      });

      const novoUsuario = { ...usuario, foto_perfil: fotoEmTexto };
      setUsuario(novoUsuario);
      await AsyncStorage.setItem('user_data', JSON.stringify(novoUsuario));
      
      Alert.alert("Sucesso", "Foto salva na nuvem!");

    } catch (error) {
      console.log("Erro detalhado:", error);
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