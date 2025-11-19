import STORAGE_KEYS, { saveData, getData } from './storage';
import { generateId } from '../utils/helpers';

export const getRisks = async () => {
  try {
    const risks = await getData(STORAGE_KEYS.RISKS);
    return risks || [];
  } catch (error) {
    console.error('Error getting risks:', error);
    return [];
  }
};

export const addRisk = async (risk) => {
  try {
    const risks = await getRisks();
    const newRisk = {
      id: generateId(),
      ...risk,
      createdAt: new Date().toISOString(),
    };
    risks.push(newRisk);
    await saveData(STORAGE_KEYS.RISKS, risks);
    return { success: true, risk: newRisk };
  } catch (error) {
    return { success: false, error: 'Error al agregar riesgo' };
  }
};

export const updateRisk = async (id, updatedData) => {
  try {
    const risks = await getRisks();
    const index = risks.findIndex(r => r.id === id);
    if (index !== -1) {
      risks[index] = { ...risks[index], ...updatedData, updatedAt: new Date().toISOString() };
      await saveData(STORAGE_KEYS.RISKS, risks);
      return { success: true, risk: risks[index] };
    }
    return { success: false, error: 'Riesgo no encontrado' };
  } catch (error) {
    return { success: false, error: 'Error al actualizar riesgo' };
  }
};

export const deleteRisk = async (id) => {
  try {
    const risks = await getRisks();
    const filtered = risks.filter(r => r.id !== id);
    await saveData(STORAGE_KEYS.RISKS, filtered);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Error al eliminar riesgo' };
  }
};

export const getRisksByState = async (state) => {
  const risks = await getRisks();
  return risks.filter(r => r.state === state);
};
