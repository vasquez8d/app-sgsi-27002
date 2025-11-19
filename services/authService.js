import STORAGE_KEYS, { saveData, getData } from './storage';

// Credenciales por defecto (en producción usar backend real)
const DEFAULT_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
};

export const login = async (username, password) => {
  try {
    // Simulación de autenticación
    if (username === DEFAULT_CREDENTIALS.username && password === DEFAULT_CREDENTIALS.password) {
      const user = {
        id: '1',
        username: username,
        name: 'Administrador SGSI',
        email: 'admin@sgsi.com',
        role: 'CISO',
        loginTime: new Date().toISOString(),
      };
      
      await saveData(STORAGE_KEYS.AUTH, user);
      return { success: true, user };
    }
    
    return { success: false, error: 'Credenciales incorrectas' };
  } catch (error) {
    return { success: false, error: 'Error en el login' };
  }
};

export const logout = async () => {
  try {
    await saveData(STORAGE_KEYS.AUTH, null);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Error en el logout' };
  }
};

export const getCurrentUser = async () => {
  try {
    const user = await getData(STORAGE_KEYS.AUTH);
    return user;
  } catch (error) {
    return null;
  }
};

export const isAuthenticated = async () => {
  const user = await getCurrentUser();
  return user !== null;
};
