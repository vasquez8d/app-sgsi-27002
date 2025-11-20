import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import { initDatabase } from './services/database';
import logger from './utils/logger';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        logger.appStart();
        logger.performanceStart('appInitialization');
        
        // Inicializar la base de datos
        logger.info('App', '🛠️ Inicializando base de datos...');
        const result = initDatabase();
        
        if (!result.success) {
          logger.error('App', 'Error al inicializar la base de datos', new Error(result.error));
          setError('Error al inicializar la base de datos');
        } else {
          logger.info('App', '✅ Base de datos inicializada correctamente');
        }
        
        logger.performanceEnd('appInitialization');
        setIsReady(true);
        logger.info('App', '🚀 Aplicación lista para usar');
      } catch (err) {
        logger.appError('App', 'Error preparando la aplicación', err);
        setError('Error al iniciar la aplicación');
        setIsReady(true); // Continuar de todas formas
      }
    };

    prepareApp();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E3A8A" />
        <Text style={styles.loadingText}>Inicializando aplicación...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#1E3A8A" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#1E3A8A',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#DC2626',
    textAlign: 'center',
  },
});
