// toastConfig.jsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BaseToast } from 'react-native-toast-message';

/*
 * Componente Customizado para o Toast de Sucesso (Pílula)
 */
const SuccessPillToast = (props) => (
  <View style={[styles.pillContainer, styles.successBackground]}>
    <Text style={styles.text1}>{props.text1}</Text>
    {props.text2 && <Text style={styles.text2}>{props.text2}</Text>}
  </View>
);

/*
 * Componente Customizado para o Toast de Erro (Pílula)
 */
const ErrorPillToast = (props) => (
  <View style={[styles.pillContainer, styles.errorBackground]}>
    <Text style={styles.text1}>{props.text1}</Text>
    {props.text2 && <Text style={styles.text2}>{props.text2}</Text>}
  </View>
);

/*
 * Configuração principal
 * Mapeia os nomes que você usará no Toast.show() para os componentes
 */
export const toastConfig = {
  // Chamada: Toast.show({ type: 'pillSuccess', ... })
  pillSuccess: SuccessPillToast,
  
  // Chamada: Toast.show({ type: 'pillError', ... })
  pillError: ErrorPillToast,

  // Opcional: Se quiser que o tipo 'info' tenha um estilo base de pílula, mas com ícone
  info: (props) => (
    <BaseToast 
      {...props} 
      // Estilo do container principal da biblioteca base
      style={{ borderLeftColor: '#3498db', borderRadius: 25, height: 50, backgroundColor: '#f5f5f5' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 14, fontWeight: 'bold' }}
      text2Style={{ fontSize: 12, color: 'gray' }}
    />
  ),
};

/*
 * Estilos para o formato Pílula
 */
const styles = StyleSheet.create({
  pillContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 50, // **Chave para o estilo pílula**
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    maxWidth: '90%', 
    // Estilos de sombra e elevação para destaque
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  successBackground: {
    backgroundColor: '#2ecc71', // Verde
  },
  errorBackground: {
    backgroundColor: '#e74c3c', // Vermelho
  },
  text1: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 5,
  },
  text2: {
    fontSize: 12,
    color: 'white',
  },
});