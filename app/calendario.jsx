import { router } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function Alimentacao() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minha Alimentação</Text>
      <Button title="Abrir calendário" onPress={() => router.push('/calendario')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
});
