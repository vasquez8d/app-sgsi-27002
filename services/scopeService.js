import STORAGE_KEYS, { saveData, getData } from './storage';

export const getScope = async () => {
  try {
    const scope = await getData(STORAGE_KEYS.SCOPE);
    return scope || {
      description: '',
      includedProcesses: [],
      excludedProcesses: [],
      organizationalAreas: [],
      locations: [],
      boundaries: '',
      justifications: '',
      lastUpdated: null,
    };
  } catch (error) {
    console.error('Error getting scope:', error);
    return null;
  }
};

export const updateScope = async (scopeData) => {
  try {
    const updatedScope = {
      ...scopeData,
      lastUpdated: new Date().toISOString(),
    };
    await saveData(STORAGE_KEYS.SCOPE, updatedScope);
    return { success: true, scope: updatedScope };
  } catch (error) {
    return { success: false, error: 'Error al actualizar alcance' };
  }
};

export const addIncludedProcess = async (process) => {
  try {
    const scope = await getScope();
    if (!scope.includedProcesses.includes(process)) {
      scope.includedProcesses.push(process);
      await updateScope(scope);
      return { success: true };
    }
    return { success: false, error: 'El proceso ya existe' };
  } catch (error) {
    return { success: false, error: 'Error al agregar proceso' };
  }
};

export const addExcludedProcess = async (process) => {
  try {
    const scope = await getScope();
    if (!scope.excludedProcesses.includes(process)) {
      scope.excludedProcesses.push(process);
      await updateScope(scope);
      return { success: true };
    }
    return { success: false, error: 'El proceso ya existe' };
  } catch (error) {
    return { success: false, error: 'Error al agregar proceso' };
  }
};
