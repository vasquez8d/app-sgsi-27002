import STORAGE_KEYS, { saveData, getData } from './storage';
import { generateId } from '../utils/helpers';

export const getAssets = async () => {
  try {
    const assets = await getData(STORAGE_KEYS.ASSETS);
    return assets || [];
  } catch (error) {
    console.error('Error getting assets:', error);
    return [];
  }
};

export const addAsset = async (asset) => {
  try {
    const assets = await getAssets();
    const newAsset = {
      id: generateId(),
      ...asset,
      createdAt: new Date().toISOString(),
    };
    assets.push(newAsset);
    await saveData(STORAGE_KEYS.ASSETS, assets);
    return { success: true, asset: newAsset };
  } catch (error) {
    return { success: false, error: 'Error al agregar activo' };
  }
};

export const updateAsset = async (id, updatedData) => {
  try {
    const assets = await getAssets();
    const index = assets.findIndex(a => a.id === id);
    if (index !== -1) {
      assets[index] = { ...assets[index], ...updatedData, updatedAt: new Date().toISOString() };
      await saveData(STORAGE_KEYS.ASSETS, assets);
      return { success: true, asset: assets[index] };
    }
    return { success: false, error: 'Activo no encontrado' };
  } catch (error) {
    return { success: false, error: 'Error al actualizar activo' };
  }
};

export const deleteAsset = async (id) => {
  try {
    const assets = await getAssets();
    const filtered = assets.filter(a => a.id !== id);
    await saveData(STORAGE_KEYS.ASSETS, filtered);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Error al eliminar activo' };
  }
};

export const getAssetsByCategory = async (category) => {
  const assets = await getAssets();
  return assets.filter(a => a.category === category);
};

export const getAssetsByCriticality = async (criticality) => {
  const assets = await getAssets();
  return assets.filter(a => a.criticality === criticality);
};
