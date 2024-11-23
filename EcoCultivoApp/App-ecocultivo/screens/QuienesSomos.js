import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';

export default function QuienesSomos({ navigation }) {
  const [showWebView, setShowWebView] = React.useState(false);

  const abrirEnlace = () => {
    setShowWebView(true);  // Activamos la visualización del WebView
  };

  return (
    <View style={styles.container}>
      {!showWebView ? (
        <>
          <Text style={styles.title}>Quienes Somos</Text>
          <Text style={styles.description}>
            Aquí puedes conocer más sobre el proyecto EcoCultivo.
          </Text>
          <TouchableOpacity onPress={abrirEnlace} style={styles.button}>
            <Text style={styles.buttonText}>Ver en GitHub</Text>
          </TouchableOpacity>
        </>
      ) : (
        <WebView
          source={{ uri: 'https://github.com/vayalul/EcoCultivo' }}  // Carga el enlace en WebView
          style={{ flex: 1, width: '100%' }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
