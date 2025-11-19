import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../utils/constants';
import Input from '../components/Input';
import Button from '../components/Button';
import { login } from '../services/authService';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!username.trim()) {
      newErrors.username = 'El usuario es requerido';
    }
    
    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    const result = await login(username, password);
    setLoading(false);
    
    if (result.success) {
      navigation.replace('MainTabs');
    } else {
      Alert.alert('Error', result.error || 'Credenciales incorrectas');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.spacer} />
        
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="shield-checkmark" size={100} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>SGSI ISO 27002</Text>
          <Text style={styles.subtitle}>Sistema de Gestión de Seguridad de la Información</Text>
          <Text style={styles.isoVersion}>ISO/IEC 27002:2013</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Usuario"
            value={username}
            onChangeText={setUsername}
            placeholder="Ingrese su usuario"
            error={errors.username}
            autoCapitalize="none"
          />
          
          <Input
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            placeholder="Ingrese su contraseña"
            secureTextEntry
            error={errors.password}
          />

          <Button
            title="Iniciar Sesión"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
          />

          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color={COLORS.info} />
            <Text style={styles.infoText}>
              Usuario: <Text style={styles.infoBold}>admin</Text>{'\n'}
              Contraseña: <Text style={styles.infoBold}>admin123</Text>
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Versión 2.0.0</Text>
          <Text style={styles.footerText}>© 2025 SGSI Management System</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.lg,
    paddingTop: SPACING.xl * 2,
  },
  spacer: {
    flex: 0.3,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl * 1.5,
  },
  logoContainer: {
    marginBottom: SPACING.lg,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: FONT_SIZES.xxl * 1.1,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    textAlign: 'center',
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.xs,
  },
  form: {
    marginBottom: SPACING.xl,
  },
  loginButton: {
    marginTop: SPACING.md,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: 8,
    marginTop: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.info,
  },
  infoText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    marginLeft: SPACING.sm,
    flex: 1,
  },
  infoBold: {
    fontWeight: '700',
    color: COLORS.text,
  },
  isoVersion: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: SPACING.xs,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textLight,
    marginTop: SPACING.xs / 2,
  },
});

export default LoginScreen;
