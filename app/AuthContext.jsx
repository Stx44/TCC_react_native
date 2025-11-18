import React, { 
  createContext, 
  useState, 
  useContext, 
  useEffect 
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [perfilImage, setPerfilImage] = useState(null);

  // --- 1. Carregar dados ao iniciar o App ---
  useEffect(() => {
    const loadData = async () => {
      try {
        // Primeiro carrega o usuário
        const savedUserJson = await AsyncStorage.getItem('user_data');
        
        if (savedUserJson) {
          const savedUser = JSON.parse(savedUserJson);
          setUsuario(savedUser);

          // Se tem usuário, carrega a foto DELE (usando o ID na chave)
          if (savedUser.id) {
            const savedImage = await AsyncStorage.getItem(`user_profile_image_${savedUser.id}`);
            if (savedImage) {
              setPerfilImage(savedImage);
            }
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

    // Ao logar, busca a foto específica deste usuário imediatamente
    if (dadosUsuario.id) {
      try {
        const savedImage = await AsyncStorage.getItem(`user_profile_image_${dadosUsuario.id}`);
        // Se achou foto salva, usa ela. Se não, limpa o estado (null) para usar a padrão
        setPerfilImage(savedImage || null);
      } catch (e) {
        setPerfilImage(null);
      }
    }
  };

  // --- 3. Função de Logout ---
  const logout = async () => {
    setUsuario(null);
    setPerfilImage(null); // Limpa a foto da memória para não aparecer pro próximo
    await AsyncStorage.removeItem('user_data');
  };

  // --- 4. Atualizar Foto ---
  const atualizarFoto = async (uri) => {
    if (!usuario?.id) return; // Segurança: só salva se tiver usuário logado

    try {
      setPerfilImage(uri);
      // Salva com o ID no nome da chave
      await AsyncStorage.setItem(`user_profile_image_${usuario.id}`, uri);
    } catch (error) {
      console.log("Erro ao salvar imagem:", error);
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