import { getFirstRow } from './database';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CURRENT_USER_KEY = '@sgsi_current_user';

export const login = async (username, password) => {
  try {
    // Buscar usuario en la base de datos
    const user = getFirstRow(
      'SELECT id, username, name, email, role FROM users WHERE username = ? AND password = ?',
      [username, password]
    );

    if (user) {
      const userSession = {
        ...user,
        loginTime: new Date().toISOString(),
      };
      
      // Guardar sesión actual en AsyncStorage
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userSession));
      return { success: true, user: userSession };
    }
    
    return { success: false, error: 'Credenciales incorrectas' };
  } catch (error) {
    console.error('Error en login:', error);
    return { success: false, error: 'Error en el login' };
  }
};

export const logout = async () => {
  try {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
    return { success: true };
  } catch (error) {
    console.error('Error en logout:', error);
    return { success: false, error: 'Error en el logout' };
  }
};

export const getCurrentUser = async () => {
  try {
    const userData = await AsyncStorage.getItem(CURRENT_USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error obteniendo usuario actual:', error);
    return null;
  }
};

export const isAuthenticated = async () => {
  const user = await getCurrentUser();
  return user !== null;
};

export const registerUser = async (userData) => {
  try {
    const { executeQuery } = require('./database');
    const result = executeQuery(
      'INSERT INTO users (username, password, name, email, role) VALUES (?, ?, ?, ?, ?)',
      [userData.username, userData.password, userData.name, userData.email, userData.role]
    );
    
    return { success: true, userId: result.lastInsertRowId };
  } catch (error) {
    console.error('Error registrando usuario:', error);
    if (error.message.includes('UNIQUE constraint failed')) {
      return { success: false, error: 'El usuario ya existe' };
    }
    return { success: false, error: 'Error al registrar usuario' };
  }
};
