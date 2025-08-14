import {
    ImageBackground,
    SafeAreaView,
    StyleSheet,
    Text
} from 'react-native';

export default function App() {
  return (
    <ImageBackground
      source={require('../assets/images/paredebranca.png')}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.slogan}>
          Tela em desenvolvimento, em breve disponível!
        </Text>
        
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 350,
    height: 100,
    marginBottom: 40,
    resizeMode: 'contain',
  },
  slogan: {
    color: "black",
    fontSize: 16,
  },
});