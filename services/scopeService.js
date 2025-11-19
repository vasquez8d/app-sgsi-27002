import { executeQuery, getAllRows, getFirstRow } from './database';
import { generateId } from '../utils/helpers';

export const getScope = async () => {
  try {
    const items = getAllRows('SELECT * FROM scope ORDER BY created_at DESC');
    
    // Convertir a formato esperado por la app
    const includedProcesses = items.filter(item => item.type === 'process' && item.included === 1).map(i => i.name);
    const excludedProcesses = items.filter(item => item.type === 'process' && item.included === 0).map(i => i.name);
    const organizationalAreas = items.filter(item => item.type === 'area').map(i => i.name);
    const locations = items.filter(item => item.type === 'location').map(i => i.name);
    
    return {
      description: '',
      includedProcesses,
      excludedProcesses,
      organizationalAreas,
      locations,
      boundaries: '',
      justifications: '',
      lastUpdated: items.length > 0 ? items[0].updated_at : null,
    };
  } catch (error) {
    console.error('Error getting scope:', error);
    return {
      description: '',
      includedProcesses: [],
      excludedProcesses: [],
      organizationalAreas: [],
      locations: [],
      boundaries: '',
      justifications: '',
      lastUpdated: null,
    };
  }
};

export const updateScope = async (scopeData) => {
  try {
    // Este método podría usarse para actualizar descripción y justificaciones
    // Por ahora mantenemos compatibilidad
    return { success: true, scope: scopeData };
  } catch (error) {
    return { success: false, error: 'Error al actualizar alcance' };
  }
};

export const addIncludedProcess = async (process) => {
  try {
    const id = generateId();
    executeQuery(
      'INSERT INTO scope (id, name, type, included) VALUES (?, ?, ?, ?)',
      [id, process, 'process', 1]
    );
    return { success: true };
  } catch (error) {
    console.error('Error adding included process:', error);
    return { success: false, error: 'Error al agregar proceso' };
  }
};

export const addExcludedProcess = async (process) => {
  try {
    const id = generateId();
    executeQuery(
      'INSERT INTO scope (id, name, type, included) VALUES (?, ?, ?, ?)',
      [id, process, 'process', 0]
    );
    return { success: true };
  } catch (error) {
    console.error('Error adding excluded process:', error);
    return { success: false, error: 'Error al agregar proceso' };
  }
};
