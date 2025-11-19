import STORAGE_KEYS, { saveData, getData } from './storage';
import { generateId } from '../utils/helpers';

export const getPolicies = async () => {
  try {
    const policies = await getData(STORAGE_KEYS.POLICIES);
    return policies || [];
  } catch (error) {
    console.error('Error getting policies:', error);
    return [];
  }
};

export const addPolicy = async (policy) => {
  try {
    const policies = await getPolicies();
    const newPolicy = {
      id: generateId(),
      ...policy,
      version: '1.0',
      createdAt: new Date().toISOString(),
    };
    policies.push(newPolicy);
    await saveData(STORAGE_KEYS.POLICIES, policies);
    return { success: true, policy: newPolicy };
  } catch (error) {
    return { success: false, error: 'Error al agregar política' };
  }
};

export const updatePolicy = async (id, updatedData) => {
  try {
    const policies = await getPolicies();
    const index = policies.findIndex(p => p.id === id);
    if (index !== -1) {
      // Incrementar versión si cambió el contenido
      const currentVersion = parseFloat(policies[index].version);
      const newVersion = (currentVersion + 0.1).toFixed(1);
      
      policies[index] = { 
        ...policies[index], 
        ...updatedData, 
        version: newVersion,
        updatedAt: new Date().toISOString() 
      };
      await saveData(STORAGE_KEYS.POLICIES, policies);
      return { success: true, policy: policies[index] };
    }
    return { success: false, error: 'Política no encontrada' };
  } catch (error) {
    return { success: false, error: 'Error al actualizar política' };
  }
};

export const deletePolicy = async (id) => {
  try {
    const policies = await getPolicies();
    const filtered = policies.filter(p => p.id !== id);
    await saveData(STORAGE_KEYS.POLICIES, filtered);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Error al eliminar política' };
  }
};

export const getPoliciesByState = async (state) => {
  const policies = await getPolicies();
  return policies.filter(p => p.state === state);
};
